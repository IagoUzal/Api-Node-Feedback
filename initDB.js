/*

  TODO: 
    - Delete images static/uploads reset db

*/

require('dotenv').config();
const { getConnection } = require('./db');
const args = process.argv;
const bcrypt = require('bcrypt');
const faker = require('faker/locale/es');

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
    active boolean default false not null,
    registration_code varchar(255),
    create_user timestamp default current_timestamp,
    update_user timestamp default current_timestamp on update current_timestamp,
    last_password_update timestamp default current_timestamp on update current_timestamp
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
    const adminAvatar = `${process.env.HOST}/static/uploads/iagoavatar.jpg`;

    await connection.query(`
      insert into users (name, surname, avatar, email, password, location, role, active)
      values
      ('Iago', 'Alvarez Uzal','${adminAvatar}', 'iagouzal@gmail.com', '${adminPassword}', 'A Coruña', 'admin', true)
    `);

    // Creando user normal
    const userPassword = await bcrypt.hash(process.env.DEFAULT_USER_DEMO_PASSWORD, 10);
    const avatarFaker = faker.internet.avatar();

    await connection.query(`
      insert into users (name, surname, avatar, email, password, location, active) 
      values
      ('Ruben', 'Perez Perez', '${avatarFaker}', 'rubii9@gmail.com', '${userPassword}', 'A Coruña', true);
    `);

    await connection.query(`
      insert into users (name, surname, avatar, email, password, location, active) 
      values
      ('Juan', 'Dominguez Lopez', '${avatarFaker}', 'dlopez@gmail.com', '${userPassword}', 'Lugo', true);
    `);

    await connection.query(`
      insert into users (name, surname, avatar, email, password, location, active) 
      values
      ('Noe', 'Torres Torres', '${avatarFaker}', 'tttorres@gmail.com', '${userPassword}', 'Madrid', true);
    `);

    await connection.query(`
      insert into users (name, surname, avatar, email, password, location, active) 
      values
      ('Jordi', 'Camps Vilanova', '${avatarFaker}', 'jjjordi@gmail.com', '${userPassword}', 'Barcelona', true);
    `);

    await connection.query(`
      insert into users (name, surname, avatar, email, password, location, active) 
      values
      ('Paco', 'Lopez Lopez', '${avatarFaker}', 'plopez@gmail.com', '${userPassword}', 'Salamanca', true);
    `);

    // Creando menssages example
    await connection.query(`
      insert into messages (title, text, type, category, from_users_id, to_users_id)
      values
      ('Configurando MySQL', 'Me ayudo mucho en la configuración de MySQl', 'Referencia', 'Profesional', 2, 3);
    `);

    await connection.query(`
      insert into messages (title, text, type, category, from_users_id, to_users_id)
      values
      ('Instalando Windows', 'Me enseñó a configurar windows para programar web', 'Agradecimiento', 'Personal', 3, 1);
    `);

    await connection.query(`
      insert into messages (title, text, type, category, from_users_id, to_users_id)
      values
      ('Me ayudo en el traslado a la ciudad', 'Me ayudó en el tralado a la ciudad y me presentó a mis compañeros', 'Agradecimiento', 'Personal', 2, 6);
    `);

    await connection.query(`
      insert into messages (title, text, type, category, from_users_id, to_users_id)
      values
      ('Jefe de proyecto muy atento', 'Organizó el equipo y las tareas perfectamente resolviendo todas las dudas', 'Agradecimiento', 'Personal', 4, 1);
    `);

    await connection.query(`
      insert into messages (title, text, type, category, from_users_id, to_users_id)
      values
      ('Formación interna', 'Me dio la formación interna de la empresa sobre distintos temas y me ayudo mucho', 'Agradecimiento', 'Profesional', 1, 2);
    `);

    await connection.query(`
      insert into messages (title, text, type, category, from_users_id, to_users_id)
      values
      ('Programador Java eficiente', 'Trabaje con él en varios proyectos de Java y salieron adelante de manera exitosa', 'Referencia', 'Profesional', 5, 3);
    `);
  }

  //Estructura inicial creada
  console.log('Estructura inicial de DB creada');

  connection.release();
  process.exit();
}

main();
