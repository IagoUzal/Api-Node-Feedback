/*

 TODO:
  - Falta procesar imagen en el registro de usuario
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { getConnection } = require('../db');
const { generateError } = require('../helpers');
const { userSchema, userLoginSchema } = require('./validations');

// POST - Register User

async function register(req, res, next) {
  try {
    // Validate Body
    await userSchema.validateAsync(req.body);

    const connection = await getConnection();
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

    connection.release();

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
  }
}

// GET - User info

async function info(req, res, next) {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    const [result] = await connection.query(
      `
      select name, surname, avatar, email, location from users where id=?
    `,
      [id]
    );

    if (!result.length) {
      throw generateError(`No existe usuario con la id: ${id}`, 404);
    }

    connection.release();

    res.send({
      info: 'ok',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// POST - User Login

async function login(req, res, next) {
  try {
    let connection;
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

    connection.release();

    res.send({
      status: 'ok',
      message: 'Login Ok',
      data: { token },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  info,
  login,
};
