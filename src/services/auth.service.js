const IncorrectCredentialsError = require('../exceptions/IncorrectCredentialsError');
const userService = require('./user.service');
const { User } = require('../models');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  try {
    const user = await userService.getUserByEmail(email);

    if (!user || !(await user.verifyPassword(password))) {
      throw new Error();
    }

    return user;
  } catch (err) {
    // always return this general error for security
    // Client should not know if user or username exist
    throw new IncorrectCredentialsError('Incorrect email or password');
  }
};

/**
 * Get user by email
 * @param {string} username
 * @returns {Promise<User>}
 */
const getMeByUsername = async (username) => User.query().findOne({ username }).throwIfNotFound();

module.exports = {
  loginUserWithEmailAndPassword,
  getMeByUsername,
};
