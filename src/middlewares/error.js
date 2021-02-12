const status = require('http-status');
const { TokenExpiredError } = require('jsonwebtoken');
const {
  ValidationError,
  NotFoundError,
  DBError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError,
} = require('objection');
const config = require('../config/config');
const logger = require('../config/logger');
const IncorrectCredentialsError = require('../exceptions/IncorrectCredentialsError');
const JsonWebTokenBlacklistedError = require('../exceptions/JsonWebTokenBlacklistedError');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, _req, _res, next) => {
  if (err instanceof ApiError) {
    return next(err);
  }

  if (err instanceof ValidationError) {
    switch (err.type) {
      case 'ModelValidation':
        return next(new ApiError(status.BAD_REQUEST, err.message, true));
      case 'RelationExpression':
        return next(new ApiError(status.BAD_REQUEST, status[status.BAD_REQUEST], false));
      case 'UnallowedRelation':
        return next(new ApiError(status.BAD_REQUEST, status[status.BAD_REQUEST], false));
      case 'InvalidGraph':
        return next(new ApiError(status.BAD_REQUEST, status[status.BAD_REQUEST], false));
      default:
        return next(new ApiError(status.BAD_REQUEST, status[status.BAD_REQUEST], false));
    }
  }

  if (err instanceof NotFoundError) {
    return next(new ApiError(status.NOT_FOUND, status[status.NOT_FOUND], true));
  }

  if (err instanceof UniqueViolationError) {
    return next(new ApiError(status.CONFILCT, status[status.CONFLICT], false));
  }
  if (err instanceof NotNullViolationError) {
    return next(new ApiError(status.BAD_REQUEST, status[status.BAD_REQUEST], false));
  }

  if (err instanceof ForeignKeyViolationError) {
    return next(new ApiError(status.CONFILCT, status[status.CONFLICT], false));
  }

  if (err instanceof CheckViolationError) {
    return next(new ApiError(status.BAD_REQUEST, status[status.BAD_REQUEST], false));
  }

  if (err instanceof DataError) {
    return next(new ApiError(status.BAD_REQUEST, status[status.BAD_REQUEST], false));
  }

  if (err instanceof DBError) {
    return next(new ApiError(
      status.INTERNAL_SERVER_ERROR,
      status[status.INTERNAL_SERVER_ERROR],
      false,
    ));
  }

  if (err instanceof IncorrectCredentialsError) {
    return next(new ApiError(status.UNAUTHORIZED, err.message, true));
  }

  if (err instanceof JsonWebTokenBlacklistedError) {
    return next(new ApiError(status.UNAUTHORIZED, err.message, true));
  }

  if (err instanceof TokenExpiredError) {
    return next(new ApiError(status.UNAUTHORIZED, err.message, true));
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
