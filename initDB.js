/*

  TODO: 
    - cambiar location default sin provincia, validar con Joi
    - 🤔 on delete set null o update borrado para cuando se borre el usuario sus mensajes
      cambien a usuario null o borrado

*/

require('dotenv').config();
const { getConnection } = require('./db');
const args = process.argv;
const bcrypt = require('bcrypt');

//Si seleccionamos el argumento --data creamos datos iniciales
const addData = args[2] === '--data';

async function main() {
  //Conexión a la BD
  const connection = await getConnection();

  console.log('Eliminando tablas si existen');
  await connection.query('DROP TABLE IF EXISTS messages');
  await connection.query('DROP TABLE IF EXISTS users');

  //Create Table Users
  await connection.query(`
    create table if not exists users (
	  id int primary key auto_increment,
    name varchar(30) not null,
    surname varchar(60) not null,
    avatar varchar(255) default 'sin imagen',
    email varchar(30) not null unique,
    password varchar(255) not null,
    location varchar(30) default 'sin provincia' not null,
    role enum("normal", "admin") default "normal" not null,
    create_user timestamp default current_timestamp,
    update_user timestamp default current_timestamp on update current_timestamp
);
  `);

  //Create table messages
  await connection.query(`
    create table if not exists messages (
	  id int primary key auto_increment,
    title varchar(60) not null,
    text varchar(255) not null,
    image varchar(255) default 'sin imagen',
    type varchar(30) not null,
    category varchar(30) not null,
    tag varchar(30) default 'sin etiqueta',
    from_users_id int not null,
    to_users_id int not null,
    create_message timestamp default current_timestamp,
    update_message timestamp default current_timestamp on update current_timestamp,
    constraint fk_from_users_id foreign key (from_users_id) references users(id) on delete cascade,
    constraint fk_to_users_id foreign key (to_users_id) references users(id) on delete cascade
);
  `);

  //Datos iniciales
  if (addData) {
    console.log('Creando datos de ejemplo');

    // Creando user Admin
    const adminPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 10);

    await connection.query(`
      insert into users (name, surname, email, password, location, role)
      values
      ('Iago', 'Alvarez Uzal', 'iagouzal@gmail.com', '${adminPassword}', 'A Coruña', 'admin')
    `);

    // Creando user normal
    const userPassword = await bcrypt.hash(process.env.DEFAULT_USER_DEMO_PASSWORD, 10);

    await connection.query(`
      insert into users (name, surname, email, password, location) 
      values
      ('Ruben', 'Perez Perez', 'rubii9@gmail.com', '${userPassword}', 'A Coruña');
    `);

    await connection.query(`
      insert into users (name, surname, email, password, location) 
      values
      ('Juan', 'Dominguez Lopez', 'dlopez@gmail.com', '${userPassword}', 'Lugo');
    `);

    // Creando message de ejemplo
    await connection.query(`
      insert into messages (title, text, type, category, from_users_id, to_users_id)
      values
      ('Configurando MySQL', 'Me ayudo mucho en la configuración de MySQl', 'Referencia', 'Profesional', 2, 3);
    `);
  }

  //Estructura inicial creada
  console.log('Estructura inicial de DB creada');

  connection.release();
  process.exit();
}

main();
