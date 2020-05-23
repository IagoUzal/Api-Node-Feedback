const bcrypt = require('bcrypt');
const { getConnection } = require('../db');
const { userSchema } = require('./validations');

const { generateError } = require('../helpers');

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

    // Hash Paaasword
    const dbPassword = await bcrypt.hash(password, 10);

    await connection.query(
      `
      insert into users (name, surname, email, password, location)
      values
      (?, ?, ?, ?, ?)`,
      [name, surname, email, dbPassword, location]
    );

    connection.release();

    res.send({
      status: 'ok',
      message: 'Usuario registrado, revisa tu email para validación. Mira en la carpeta SPAM seguro esta allí',
    });
  } catch (error) {
    next(error);
  }

  res.send({ register: 'ok' });
}

async function info(req, res, next) {
  res.send({ info: 'ok' });
}

async function login(req, res, next) {
  res.send({ login: 'ok' });
}

module.exports = {
  register,
  info,
  login,
};
