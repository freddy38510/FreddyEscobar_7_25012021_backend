const Joi = require('joi');

const createPost = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

const getPosts = {
  query: Joi.object().keys({
    page: Joi.number().integer(),
    pageSize: Joi.number().integer(),
  }),
};

const getPost = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

const updatePost = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      content: Joi.string(),
    })
    .min(1),
};

const deletePost = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

const createComment = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
  body: Joi.object().keys({
    content: Joi.string().required(),
  }),
};

const getComments = {
  query: Joi.object().keys({
    page: Joi.number().integer(),
    pageSize: Joi.number().integer(),
  }),
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  createComment,
  getComments,
};
