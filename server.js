require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();
const port = process.env.PORT;

const { registerUsers, infoUsers, loginUsers, editUsers, editPassword } = require('./controllers/users');
const { listMessages, getMessage, newMessage, editMessage, deleteMessage } = require('./controllers/messages');
const { userIsAuthenticated, userIsAdmin } = require('./middlewares/auth');

//Middlewares
// Console logger
app.use(morgan('dev'));
// Body parsing
app.use(bodyParser.json());
// Multipart parsing
app.use(fileUpload());
// Cors
app.use(cors());

// Routes Users
app.post('/users', registerUsers); // Anonimo
app.post('/users/login', loginUsers); // Anonimo
app.get('/users/:id', infoUsers); // Anonimo
app.put('/users/:id', userIsAuthenticated, editUsers); // Solo el propio usuario o admin
app.post('/users/:id/password', userIsAuthenticated, editPassword); // Solo el propio usuario o Admin

// Routes Messages
app.get('/messages', listMessages); // Anonimo
app.get('/messages/:id', getMessage); // Anonimo
app.post('/messages', userIsAuthenticated, newMessage); // Solo Usuarios o admin
app.put('/messages/:id', userIsAuthenticated, editMessage); // Solo Usuarios que crearon el mensaje o admin
app.delete('/messages/:id', userIsAuthenticated, deleteMessage); // Solo Usuarios que crearon el mensaje o admin

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
