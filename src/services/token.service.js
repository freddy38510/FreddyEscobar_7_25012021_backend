const jwt = require('jsonwebtoken');
const config = require('../config/config');
const JsonWebTokenBlacklistedError = require('../exceptions/JsonWebTokenBlacklistedError');

/**
 * Generate token
 * @param {Object} user
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (user, secret = config.jwt.secret) => {
  const payload = {
    user: {
      id: user.id,
      username: user.username,
      isModerator: user.isModerator,
    },

  };

  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

/**
 * Verify token and return token payload
 * @param {string} token
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, blacklist) => {
  if (await blacklist.has(token)) {
    throw new JsonWebTokenBlacklistedError('Revoked token');
  }

  return jwt.verify(token, config.jwt.secret);
};

const blacklistToken = async (token, blacklist) => blacklist.add(token);

module.exports = {
  generateToken,
  verifyToken,
  blacklistToken,
};
