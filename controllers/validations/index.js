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
};
