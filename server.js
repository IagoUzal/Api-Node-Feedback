require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();
const port = process.env.PORT;

const { register, info, login } = require('./controllers/users');
const { listMessages, getMessage, newMessage, editMessage, deleteMessage } = require('./controllers/messages');

//Middlewares
// Console logger
app.use(morgan('dev'));
// Body parsing
app.use(bodyParser.json());
// Multipart parsing
app.use(fileUpload());

// Routes Users
app.post('/users', register);
app.post('/users/login', login);
app.get('/users/:id', info);

// Protected Routes
app.get('/only-users', (req, res, next) => {
  res.send({ message: 'Solo usuarios registrados' });
});
app.get('only-admin', (req, res, next) => {
  res.send({ message: 'Solo usuarios admin' });
});

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
