const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, tokenService } = require('../services');
const extractBearerToken = require('../utils/extractBearerToken');
const pick = require('../utils/pick');

const createUser = catchAsync(async (req, res) => {
  await userService.createUser(req.body);

  res.status(httpStatus.CREATED).send({ message: 'User created' });
});

const getUsers = catchAsync(async (req, res) => {
  const users = await userService.queryUsers();

  res.send(users);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserByUsername(req.params.username);

  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserByUsername(req.params.username, req.body, req.user);

  res.send({ user });
});

const deleteUser = catchAsync(async (req, res) => {
  const user = await userService.deleteUserByUsername(req.params.username, req.user);

  const token = extractBearerToken(req.headers.authorization);

  if (req.user && req.user.id === user.id) {
    await tokenService.blacklistToken(token, req.app.locals.JwtBlacklist);
  }

  res.status(204).send();
});

const getPosts = catchAsync(async (req, res) => {
  const paging = pick(req.query, ['page', 'pageSize']);

  const user = await userService.getUserByUsername(req.params.username);

  const posts = await user.getPosts(paging);

  res.send(posts);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getPosts,
};
