const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { postService } = require('../services');
const pick = require('../utils/pick');

const createPost = catchAsync(async (req, res) => {
  const post = await postService.createPost(req.user, req.body);

  res.status(httpStatus.CREATED).send(post);
});

const getPosts = catchAsync(async (req, res) => {
  const paging = pick(req.query, ['page', 'pageSize']);

  const posts = await postService.queryPosts(paging);

  res.send(posts);
});

const getPost = catchAsync(async (req, res) => {
  const post = await postService.getPostBySlug(req.params.slug);

  res.send(post);
});

const updatePost = catchAsync(async (req, res) => {
  await postService.updatePostBySlug(req.params.slug, req.body, req.user);

  res.send({ message: 'Post updated' });
});

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePostBySlug(req.params.slug, req.user);

  res.status(204).send();
});

const createComment = catchAsync(async (req, res) => {
  const post = await postService.getPostBySlug(req.params.slug);

  const comment = await post.insertComment(req.user, req.body);

  res.status(httpStatus.CREATED).send(comment);
});

const getComments = catchAsync(async (req, res) => {
  const paging = pick(req.query, ['page', 'pageSize']);

  const post = await postService.getPostBySlug(req.params.slug);

  const comments = await post.getComments(req.user, paging);

  res.send(comments);
});

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  createComment,
  getComments,
};
