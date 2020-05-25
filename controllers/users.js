/*

 TODO:
  - Falta procesar imagen en el registro de usuario si al final lo requiero como oblogatorio

 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { getConnection } = require('../db');
const { generateError, processAndSaveImage, deleteImage } = require('../helpers');
const { userSchema, userLoginSchema, editUserSchema } = require('./validations');

// POST - Register User

async function registerUsers(req, res, next) {
  let connection;
  try {
    // Validate Body
    await userSchema.validateAsync(req.body);

    connection = await getConnection();
    const { name, surname, email, password, location } = req.body;

    // Validando que el email no exita
    const [existing] = await connection.query('select id from users where email=?', [email]);
    if (existing.length) {
      throw generateError('El email ya existe', 409);
    }

    // Hash Password
    const dbPassword = await bcrypt.hash(password, 10);

    const [result] = await connection.query(
      `
      insert into users (name, surname, email, password, location)
      values
      (?, ?, ?, ?, ?)`,
      [name, surname, email, dbPassword, location]
    );

    res.send({
      status: 'ok',
      data: {
        id: result.insertId,
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
      select id, email, password, role from users where email=?
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

module.exports = {
  registerUsers,
  infoUsers,
  loginUsers,
  editUsers,
};
