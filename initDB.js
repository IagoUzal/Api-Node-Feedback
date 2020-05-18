const { getConnection } = require('./db');
const args = process.argv;

//Seleccionamos el argumento --reset
const resetDB = args[2] === '--reset';

async function main() {
  //Conexión a la BD
  const connection = await getConnection();

  //Si le pasamos el argumento --save a node initDB.js resetea la base de datos
  if (resetDB) {
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS messages');
  }

  //Create Table Users

  //Create table messages

  //Estructura inicial creada
  console.log('Estructura inicial de DB creada');

  connection.release();
  process.exit();
}

main();
