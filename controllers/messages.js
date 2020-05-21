const { getConnection } = require('../db');

// Rutas para anonimous user

// GET - /messages
// Listando mensajes De Para orden descendente

async function listMessages(req, res, next) {
  try {
    const connection = await getConnection();
    const [messages] = await connection.query(`
      select concat_ws(' ',a.name, b.surname) as De, concat_ws(' ',c.name, d.surname) as Para, title, text, image, type, category, create_message from messages
      inner join users a on a.id = from_users_id
      inner join users b on b.id = from_users_id
      inner join users c on c.id = to_users_id
      inner join users d on d.id = to_users_id
      order by create_message desc;
    `);

    connection.release();

    res.send({
      status: 'ok',
      data: messages,
    });
  } catch (error) {
    next(error);
  }
}

// GET - /messages/:id

async function getMessage(req, res, next) {
  try {
    const { id } = req.params;

    const connection = await getConnection();

    const [result] = await connection.query(
      `
      select * from messages where id=?`,
      [id]
    );

    if (!result[0]) {
      const error = new Error(`El mensaje con id: ${id} no existe`);
      error.httpCode = 404;
      throw error;
    }

    connection.release();

    res.send({
      status: 'ok',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// Rutas para authenticated users

// POST - /messages

async function newMessage(req, res, next) {
  try {
    const connection = await getConnection();
    const { from_users_id, to_users_id, title, text, type, category } = req.body;

    await connection.query(
      `
      insert into messages (from_users_id, to_users_id, title, text, type, category)
      values (?, ?, ?, ?, ?, ?)`,
      [from_users_id, to_users_id, title, text, type, category]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: { from_users_id, to_users_id, title, text, type, category },
    });
  } catch (error) {
    next(error);
  }
}

// PUT - /messages/:id

// DELETE - /messages/:id
async function deleteMessage(req, res, next) {
  try {
    const { id } = req.params;

    const connection = await getConnection();

    await connection.query(`delete from messages where id=?`, [id]);

    connection.release();

    res.send({
      status: 'ok',
      message: `el mensaje con id: ${id} ha sido borrado`,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listMessages,
  getMessage,
  newMessage,
  deleteMessage,
};
