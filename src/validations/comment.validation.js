const Joi = require('joi');

const getComments = {
  query: Joi.object().keys({
    page: Joi.number().integer(),
    pageSize: Joi.number().integer(),
  }),
};

const getCommentsByUsername = {
  query: Joi.object().keys({
    page: Joi.number().integer(),
    pageSize: Joi.number().integer(),
  }),
  params: Joi.object().keys({
    username: Joi.string().required(),
  }),
};

const getComment = {
  params: Joi.object().keys({
    commentId: Joi.string().required(),
  }),
};

const updateComment = {
  params: Joi.object().keys({
    commentId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      content: Joi.string().required(),
    }),
};

const deleteComment = {
  params: Joi.object().keys({
    commentId: Joi.string().required(),
  }),
};

module.exports = {
  getComments,
  getCommentsByUsername,
  getComment,
  updateComment,
  deleteComment,
};
