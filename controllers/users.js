/*

 TODO:

 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { getConnection } = require('../db');
const { generateError, processAndSaveImage, deleteImage, randomString, sendEmail } = require('../helpers');
const { userSchema, userLoginSchema, editUserSchema, editUserPasswordSchema } = require('./validations');

// POST - Register User

async function registerUsers(req, res, next) {
  let connection;
  try {
    // Validate Body
    await userSchema.validateAsync(req.body);

    connection = await getConnection();
    const { name, surname, email, password, location } = req.body;

    // Validando que el email no exista
    const [existing] = await connection.query('select id from users where email=?', [email]);

    if (existing.length) {
      throw generateError('El email ya existe', 409);
    }

    // Hash Password
    const dbPassword = await bcrypt.hash(password, 10);

    const registrationCode = randomString(40);

    const [result] = await connection.query(
      `
      insert into users (name, surname, email, password, location, registration_code)
      values
      (?, ?, ?, ?, ?, ?)`,
      [name, surname, email, dbPassword, location, registrationCode]
    );

    const validationURL = `${process.env.HOST}/users/${result.insertId}/validate?code=${registrationCode}`;

    try {
      await sendEmail({
        email: email,
        title: 'Valida tu cuenta de usuario en la app de diario mysql',
        content: `Para validar tu cuenta de usuario pega esta url en tu navegador: ${validationURL}`,
      });
    } catch (error) {
      console.error(error.response.body);
      throw new Error('Error en el envío de mail. Inténtalo de nuevo más tarde.');
    }

    res.send({
      status: 'ok',
      data: {
        name: name,
        surname: surname,
        email: email,
        location: location,
      },
      message: 'Usuario registrado, revisa tu email para validación. Mira en la carpeta SPAM seguro esta allí',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// GET - users

async function listUsers(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const [users] = await connection.query(`
      select name, surname, avatar, location from users
    `);

    res.send({ status: 'ok', messsage: 'lista de usuarios', data: users });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// GET - User info

async function infoUsers(req, res, next) {
  let connection;
  try {
    const { id } = req.params;
    connection = await getConnection();

    const [result] = await connection.query(
      `
      select name, surname, avatar, email, location from users where id=?
    `,
      [id]
    );

    if (!result.length) {
      throw generateError(`No existe usuario con la id: ${id}`, 404);
    }

    res.send({
      info: 'ok',
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// POST - User Login

async function loginUsers(req, res, next) {
  let connection;
  try {
    await userLoginSchema.validateAsync(req.body);

    const { email, password } = req.body;
    connection = await getConnection();

    const [dbUser] = await connection.query(
      `
      select id, email, password, role from users where email=? and active=1
    `,
      [email]
    );

    if (!dbUser.length) {
      throw generateError(
        'No hay ningún usuario activo con ese email en la base de datos. Si te acabas de registrar valida el email',
        404
      );
    }

    const [user] = dbUser;

    const passwordsMath = await bcrypt.compare(password, user.password);

    if (!passwordsMath) {
      throw generateError('Password incorrecta', 401);
    }

    const tokenPayload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.SECRET, { expiresIn: '10h' });

    res.send({
      status: 'ok',
      message: 'Login Ok',
      data: { token },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// PUT - Edit user

async function editUsers(req, res, next) {
  let connection;
  try {
    await editUserSchema.validateAsync(req.body);

    const { id } = req.params;
    const { name, surname, email, location } = req.body;
    connection = await getConnection();

    const [current] = await connection.query(
      `
      select id from users where id=?
    `,
      [id]
    );

    if (!current.length) {
      generateError(`El usuario con id: ${id} no existe`, 404);
    }

    if (current[0].id !== req.auth.id || req.auth.role !== 'admin') {
      generateError('No tienes permiso para editar este usuario', 401);
    }

    let savedFileName;

    if (req.files && req.files.avatar) {
      try {
        savedFileName = await processAndSaveImage(req.files.avatar);

        if (current[0] && current[0].avatar) {
          await deleteImage(current[0].avatar);
        }
      } catch (error) {
        const imageError = new Error('No se ha podido procesar la imagen');
        imageError.httpCode = 400;
        throw imageError;
      }
    } else {
      savedFileName = current[0].avatar;
    }

    await connection.query(
      `
      update users set name=?, surname=?, email=?, location=?, avatar=? where id=?
    `,
      [name, surname, email, location, savedFileName, id]
    );

    res.send({
      status: 'ok',
      message: 'Usuario actualizado correctamente',
      data: {
        id: id,
        name: name,
        surname: surname,
        email: email,
        location: location,
        avatar: savedFileName,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// POST - Edit password

async function editPassword(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;

    // Body: oldPassword, newPassword, newPasswordRepeat (optional)
    await editUserPasswordSchema.validateAsync(req.body);

    const { oldPassword, newPassword, newPasswordRepeat } = req.body;

    if (Number(id) !== req.auth.id) {
      throw generateError('No tienes permisos para cambiar el password del usuario', 401);
    }

    if (newPassword !== newPasswordRepeat) {
      throw generateError('El campo nueva password y nueva password repetir deben de ser identicos', 400);
    }

    if (oldPassword === newPassword) {
      throw generateError('La password actual y la nueva password no pueden ser iguales', 401);
    }

    const [currentUser] = await connection.query(
      `
      select id, password from users where id=?
    `,
      [id]
    );

    if (!currentUser.length) {
      throw generateError(`El usuario con id: ${id} no existe`, 404);
    }

    const [dbUser] = currentUser;

    // Comprobar la vieja password

    const passwordsMath = await bcrypt.compare(oldPassword, dbUser.password);

    if (!passwordsMath) {
      throw generateError('La password actual es incorrecta', 401);
    }

    // hash nueva password

    const dbNewPassword = await bcrypt.hash(newPassword, 10);

    await connection.query(
      `
      update users set password=? where id=?
    `,
      [dbNewPassword, id]
    );

    res.send({ status: 'ok', message: 'Password actualizado correctamente, vuelve a hacer login' });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// GET - Validate User

async function validateUser(req, res, next) {
  let connection;
  try {
    const { code } = req.query;

    connection = await getConnection();

    const [result] = await connection.query(
      `
      update users set active=1, registration_code=null where registration_code=?
    `,
      [code]
    );

    if (result.affectedRows === 0) {
      throw generateError('Validación incorrecta', 400);
    }

    res.send({ status: 'ok', message: 'Usuario validado, puedes hacer login' });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  registerUsers,
  listUsers,
  infoUsers,
  loginUsers,
  editUsers,
  editPassword,
  validateUser,
};
