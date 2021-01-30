class JsonWebTokenBlacklistedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'JsonWebTokenBlacklistedError';
  }
}

module.exports = JsonWebTokenBlacklistedError;
