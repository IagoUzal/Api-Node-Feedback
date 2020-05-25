/* 
  TODO: 
  - Revisar validación de to_user_id
  - Organizar los Joi mejor
*/

const Joi = require('@hapi/joi');

const { generateError } = require('../../helpers');

// Registro Usuario

const userSchema = Joi.object().keys({
  name: Joi.string().min(2).max(20).error(generateError('El nombre debe tener entre 2 y 20 caracteres'), 400),
  surname: Joi.string()
    .min(2)
    .max(30)
    .required()
    .error(generateError('El apellido debe de tener entre 2 y 30 caracteres')),
  email: Joi.string().email().required().error(generateError('Comprueba que el email sea correcto'), 400),
  password: Joi.string()
    .min(6)
    .max(100)
    .required()
    .error(generateError('La contraseña debe detener como mínimo 6 caracteres '), 400),
  // FIXME: Falta location, validar de JSON
  location: Joi.any(),
});

// Login Usuario

const userLoginSchema = Joi.object().keys({
  email: Joi.string().email().required().error(generateError('Debes introducir un email valido'), 400),
  password: Joi.string()
    .min(6)
    .max(100)
    .required()
    .error(generateError('La contraseña debe tener como minimo 6 caracteres')),
});

// Edit Usuario

const editUserSchema = Joi.object().keys({
  name: Joi.string().min(2).max(20).error(generateError('El nombre debe tener entre 2 y 20 caracteres'), 400),
  surname: Joi.string()
    .min(2)
    .max(30)
    .required()
    .error(generateError('El apellido debe de tener entre 2 y 30 caracteres')),
  email: Joi.string().email().required().error(generateError('Comprueba que el email sea correcto'), 400),
  // FIXME: Falta location, validar de JSON
  location: Joi.any(),
});

// New Message

const newMessageSchema = Joi.object().keys({
  to_users_id: Joi.any(),
  title: Joi.string()
    .max(50)
    .required()
    .error(generateError('El campo titulo no puede superar los 50 caracteres', 400)),
  text: Joi.string()
    .max(140)
    .required()
    .error(generateError('El campo texto no puede tener más de 140 caracteres', 400)),
  type: Joi.valid('Agradecimiento', 'Referencia')
    .required()
    .error(generateError('Tiene que elegir entre Agradecimiento y Referencia'), 400),
  category: Joi.valid('Personal', 'Profesional')
    .required()
    .error(generateError('Tiene que elegir entre Personal y Profesional'), 400),
});

module.exports = {
  newMessageSchema,
  userSchema,
  userLoginSchema,
  editUserSchema,
};
