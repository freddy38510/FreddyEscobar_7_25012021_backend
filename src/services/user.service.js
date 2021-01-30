const IncorrectCredentialsError = require('../exceptions/IncorrectCredentialsError');
const { User } = require('../models');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => User.query().insert(userBody);

/**
 * Query for users
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async () => User.query().modify('maskEmail');

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => User.query().findById(id).modify('maskEmail').throwIfNotFound();

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => User.query().findOne({ email }).modify('maskEmail').throwIfNotFound();

/**
 * Get user by email
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByUsername = async (username) => User.query().findOne({ username }).modify('maskEmail').throwIfNotFound();

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody, authUser) => User
  .query()
  .authorize(authUser)
  .patchAndFetchById(userId, updateBody)
  .throwIfNotFound()
  .fetchResourceContextFromDB()
  .returning('*');

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserByUsername = async (username, updateBody, authUser) => {
  const user = await User.query().findOne({ username }).modify('maskEmail').throwIfNotFound();

  const data = updateBody;

  if (data.password) {
    if (!(await user.verifyPassword(data.currentPassword))) {
      throw new IncorrectCredentialsError('Incorrect password');
    }

    delete data.currentPassword;
  }

  return user
    .$query()
    .authorize(authUser)
    .patch(data)
    .returning(Object.keys(user));
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId, authUser) => User
  .query()
  .authorize(authUser)
  .findById(userId)
  .throwIfNotFound()
  .delete()
  .fetchResourceContextFromDB()
  .returning('*');

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserByUsername = async (username, authUser) => User
  .query()
  .authorize(authUser)
  .where('username', username)
  .first()
  .throwIfNotFound()
  .delete()
  .fetchResourceContextFromDB()
  .returning('*');

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  updateUserById,
  updateUserByUsername,
  deleteUserById,
  deleteUserByUsername,
};
