const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  authService, userService, tokenService,
} = require('../services');
const extractBearerToken = require('../utils/extractBearerToken');

const me = catchAsync(async (req, res) => {
  const user = await authService.getMeByUsername(req.user.username);

  res.send({ user });
});

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);

  const token = tokenService.generateToken(user);

  res.status(httpStatus.CREATED).send({ user, token });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.loginUserWithEmailAndPassword(email, password);

  const token = tokenService.generateToken(user);

  res.send({ user, token });
});

const logout = catchAsync(async (req, res) => {
  const token = extractBearerToken(req.headers.authorization);

  await tokenService.blacklistToken(token, req.app.locals.JwtBlacklist);

  res.send({ message: 'Logout' });
});

module.exports = {
  me,
  register,
  login,
  logout,
};
