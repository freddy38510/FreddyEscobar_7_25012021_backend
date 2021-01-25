const status = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, _req, _res, next) => {
  if (err instanceof ApiError) {
    return next(err);
  }

  let error = err;

  const statusCode = error.statusCode
    ? status.BAD_REQUEST : status.INTERNAL_SERVER_ERROR;

  const message = error.message || status[statusCode];

  error = new ApiError(statusCode, message, false, err.stack);

  return next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, next) => {
  let { statusCode, message } = err;

  if (config.env === 'production' && !err.isOperational) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = status[status.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send({ message, status: statusCode });
};

module.exports = {
  errorConverter,
  errorHandler,
};
