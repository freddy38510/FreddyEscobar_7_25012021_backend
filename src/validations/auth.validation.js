const Joi = require('joi');
const { password, username } = require('./custom.validation');

const me = {};

const register = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().custom(password).required(),
    username: Joi.string().custom(username).required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {};

module.exports = {
  me,
  register,
  login,
  logout,
};
