require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT;

//Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res, next) => {
  res.send('Pagina de inicio');
});

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
  console.log(`app corriendo en puerto ${port}`);
});
