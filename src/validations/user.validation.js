const Joi = require('joi');
const { password, username } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().custom(password).required(),
    username: Joi.string().custom(username).required(),
    isModerator: Joi.boolean(),
  }),
};

const getUsers = {};

const getUser = {
  params: Joi.object().keys({
    username: Joi.string().custom(username).required(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    username: Joi.string().custom(username).required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      currentPassword: Joi.string().custom(password),
      username: Joi.string().custom(username),
      isModerator: Joi.boolean(),
    })
    .and('password', 'currentPassword')
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    username: Joi.string().custom(username).required(),
  }),
};

const getPosts = {
  query: Joi.object().keys({
    page: Joi.number().integer(),
    pageSize: Joi.number().integer(),
  }),
  params: Joi.object().keys({
    username: Joi.string().required(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getPosts,
};
