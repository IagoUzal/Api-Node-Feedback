require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();
const port = process.env.PORT;

const { listMessages, getMessage, newMessage, editMessage, deleteMessage } = require('./controllers/messages');

//Middlewares
// Console logger
app.use(morgan('dev'));
// Body parsing
app.use(bodyParser.json());
// Multipart parsing
app.use(fileUpload());

// Routes Messages
app.get('/messages', listMessages);
app.get('/messages/:id', getMessage);
app.post('/messages', newMessage);
app.put('/messages/:id', editMessage);
app.delete('/messages/:id', deleteMessage);

//Middleware de error
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.httpCode || 500).send({ status: 'error', message: error.message });
});

// Pagina no encontrada
app.use((req, res) => {
  res.status(404).send('{status: "error", message: "Pagina no encontrada"}');
});

app.listen(port, () => {
  console.log(`app corriendo en http://localhost:${port} 💪`);
});
