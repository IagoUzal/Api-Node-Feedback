const Joi = require('@hapi/joi');

const { generateError } = require('../../helpers');

// New Message

const newMessageSchema = Joi.object().keys({
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
