/*
  TODO:
    - query search get messages (user, time, title, type, category)
    - use function generateError in the errors
*/

const { getConnection } = require('../db');
const { processAndSaveImage, deleteImage, generateError } = require('../helpers');
const { newMessageSchema, searchSchema } = require('./validations');

// Rutas para anonimous user

// GET - /messages
// Listando mensajes De Para orden descendente

async function listMessages(req, res, next) {
  try {
    const connection = await getConnection();
    const { search } = req.query;

    let result;

    if (search) {
      await searchSchema.validateAsync(search);

      [result] = await connection.query(
        `
        select title, text, type, category from messages
        where messages.title like ? or messages.text like ? or messages.type like ? or messages.category like ?
      `,
        [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
      );
    } else {
      [result] = await connection.query(`
      select concat_ws(' ',a.name, b.surname) as De, concat_ws(' ',c.name, d.surname) as Para, title, text, image, type, category, create_message from messages
      inner join users a on a.id = from_users_id
      inner join users b on b.id = from_users_id
      inner join users c on c.id = to_users_id
      inner join users d on d.id = to_users_id
      order by create_message desc;
    `);
    }

    const [messages] = result;

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
    await newMessageSchema.validateAsync(req.body);
    const { to_users_id, title, text, type, category } = req.body;

    console.log(req.files.image);

    if (!to_users_id || !title || !text || !type || !category) {
      throw generateError('Los campos para, titulo, texto, tipo y categoria son obligatorios', 400);
    }

    if (req.auth.id.toString() === to_users_id) {
      throw generateError('No puedes escribir un mensaje para ti mismo', 400);
    }

    const [existing] = await connection.query('select id from users where id=?', [to_users_id]);
    if (!existing.length) {
      throw generateError('El usuario no existe', 400);
    }

    let savedFileName;

    if (req.files && req.files.image) {
      try {
        savedFileName = await processAndSaveImage(req.files.image);
      } catch (error) {
        const imageError = new Error('No se ha podido procesar la imagen');
        imageError.httpCode = 400;
        throw imageError;
      }
    }

    await connection.query(
      `
      insert into messages (from_users_id, to_users_id, title, text, type, category, image)
      values (?, ?, ?, ?, ?, ?, ?)`,
      [req.auth.id, to_users_id, title, text, type, category, savedFileName]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: { to_users_id, title, text, type, category, savedFileName },
    });
  } catch (error) {
    next(error);
  }
}

// PUT - /messages/:id

async function editMessage(req, res, next) {
  try {
    const connection = await getConnection();
    const { id } = req.params;
    const { title, text, type, category } = req.body;

    if (!title || !text || !type || !category) {
      const error = new Error('Los campos titulo, texto, type, category son obligatorios');
      error.httpCode = 400;
      throw error;
    }

    const [current] = await connection.query(`select image, from_users_id from messages where id=?`, [id]);
    console.log(current);

    if (!current.length) {
      const error = new Error(`No existe el mensaje con id ${id}`);
      error.httpCode = 400;
      throw error;
    }

    if (current[0].from_users_id !== req.auth.id && req.auth.role !== 'admin') {
      const error = new Error('No tienes permiso para editar este mensaje');
      error.httpCode = 401;
      throw error;
    }

    let savedFileName;

    if (req.files && req.files.image) {
      try {
        savedFileName = await processAndSaveImage(req.files.image);

        if (current[0] && current[0].image) {
          await deleteImage(current[0].image);
        }
      } catch (error) {
        const imageError = new Error('No se ha podido procesar la imagen');
        imageError.httpCode = 400;
        throw imageError;
      }
    } else {
      savedFileName = current[0].image;
    }

    await connection.query(`update messages set title=?, text=?, type=?, category=?, image=? where id=?`, [
      title,
      text,
      type,
      category,
      savedFileName,
      id,
    ]);

    connection.release();

    res.send({
      status: 'ok',
      message: 'Mensaje actualizado correctamente',
      data: {
        title: title,
        text: text,
        type: type,
        category: category,
        image: savedFileName,
      },
    });
  } catch (error) {
    next(error);
  }
}

// DELETE - /messages/:id
async function deleteMessage(req, res, next) {
  try {
    const { id } = req.params;

    const connection = await getConnection();

    const [current] = await connection.query(`select image, from_users_id from messages where id=?`, [id]);

    if (!current.length) {
      const error = new Error(`No existe el mensaje con id ${id}`);
      error.httpCode = 400;
      throw error;
    }

    if (current[0].from_users_id !== req.auth.id && req.auth.role !== 'admin') {
      const error = new Error('No tienes permiso para editar este mensaje');
      error.httpCode = 401;
      throw error;
    }

    if (current[0].image) {
      await deleteImage(current[0].image);
    }

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
  editMessage,
  deleteMessage,
};
