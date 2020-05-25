require('dotenv').config();
const jwt = require('jsonwebtoken');

function userIsAuthenticated(req, res, next) {
  try {
    const { authorization } = req.headers;

    const decoded = jwt.verify(authorization, process.env.SECRET);

    next();

    req.auth = decoded;
  } catch (error) {
    const authError = new Error('Invalid authorization');
    authError.httpCode = 401;
    next(authError);
  }
}

function userIsAdmin(req, res, next) {
  if (!req.auth || req.auth.role !== 'admin') {
    const error = new Error('No tienes privilegios de administrador');
    error.httpCode = 401;
    return next(error);
  }
  next();
}

module.exports = {
  userIsAuthenticated,
  userIsAdmin,
};
