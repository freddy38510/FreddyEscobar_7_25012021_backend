class IncorrectCredentialsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'IncorrectCredentialsError';
  }
}

module.exports = IncorrectCredentialsError;
