/* 
  TODO: 
  
*/

const Joi = require('@hapi/joi');

const { generateError } = require('../../helpers');

//Search

const searchSchema = Joi.string()
  .min(2)
  .required()
  .error(generateError('El campo de búsqueda debe de ser de máis de 2 caracteres', 400));

//Location

const locationSchema = Joi.string().valid(
  'Alava',
  'Albacete',
  'Alicante',
  'Almería',
  'Asturias',
  'Avila',
  'Badajoz',
  'Barcelona',
  'Burgos',
  'Cáceres',
  'Cádiz',
  'Cantabria',
  'Castellón',
  'Ciudad Real',
  'Córdoba',
  'La Coruña',
  'Cuenca',
  'Gerona',
  'Granada',
  'Guadalajara',
  'Guipúzcoa',
  'Huelva',
  'Huesca',
  'Islas Baleares',
  'Jaén',
  'León',
  'Lérida',
  'Lugo',
  'Madrid',
  'Málaga',
  'Murcia',
  'Navarra',
  'Orense',
  'Palencia',
  'Las Palmas',
  'Pontevedra',
  'La Rioja',
  'Salamanca',
  'Segovia',
  'Sevilla',
  'Soria',
  'Tarragona',
  'Santa Cruz de Tenerife',
  'Teruel',
  'Toledo',
  'Valencia',
  'Valladolid',
  'Vizcaya',
  'Zamora',
  'Zaragoza'
);

//Email

const emailSchema = Joi.string()
  .email()
  .required()
  .error(generateError('El campo email debe de ser un email bien formado midireccion@midominio.com', 400));

//Password

const passwordSchema = Joi.string()
  .min(6)
  .max(100)
  .required()
  .error(generateError('La password debe de tener entre 6 y 100 carateres', 400));

// Registro Usuario

const userSchema = Joi.object().keys({
  name: Joi.string().min(2).max(20).error(generateError('El nombre debe tener entre 2 y 20 caracteres'), 400),
  surname: Joi.string()
    .min(2)
    .max(30)
    .required()
    .error(generateError('El apellido debe de tener entre 2 y 30 caracteres')),
  email: emailSchema,
  password: passwordSchema,
  location: locationSchema,
});

// Login Usuario

const userLoginSchema = Joi.object().keys({
  email: emailSchema,
  password: passwordSchema,
});

// Edit Usuario

const editUserSchema = Joi.object().keys({
  name: Joi.string().min(2).max(20).error(generateError('El nombre debe tener entre 2 y 20 caracteres'), 400),
  surname: Joi.string()
    .min(2)
    .max(30)
    .required()
    .error(generateError('El apellido debe de tener entre 2 y 30 caracteres')),
  email: emailSchema,
  location: locationSchema,
});

// Edit password User

const editUserPasswordSchema = Joi.object().keys({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
  newPasswordRepeat: Joi.any()
    .valid(Joi.ref('newPassword'))
    .error(generateError('Las passwords debe ser iguales', 400)),
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
  editUserPasswordSchema,
  searchSchema,
};
