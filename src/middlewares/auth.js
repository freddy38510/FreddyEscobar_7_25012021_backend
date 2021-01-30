const status = require('http-status');
const ApiError = require('../utils/ApiError');
const extractBearerToken = require('../utils/extractBearerToken');
const { tokenService } = require('../services');

const auth = async (req, _res, next) => {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      throw new ApiError(status.UNAUTHORIZED, status[status.UNAUTHORIZED]);
    }

    const decodedToken = await tokenService.verifyToken(token, req.app.locals.JwtBlacklist);

    req.user = decodedToken.user;

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = auth;
