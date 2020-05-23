/* 
  TODO: 
  - Revisar validación de from_user_id y to_user_id
    Como validar los imputs de solo 3 campos si tienes 5 por ejemplo??
      "status": "error",
      "message": "\"from_users_id\" is not allowed"
    Si ya verificas quien puede y quien no en las rutas
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

// New Message

const newMessageSchema = Joi.object().keys({
  // FIXME: Revisar si con any es correcto, la petición pasa
  from_users_id: Joi.any(),
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
};
