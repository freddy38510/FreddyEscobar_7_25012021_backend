const username = (value, helpers) => {
  if (value.length < 3) {
    return helpers.message('"{{#label}}" must be at least 3 characters');
  }

  if (!value.match(/^[a-z0-9_-]{3,16}$/)) {
    return helpers.message('"{{#label}}" must contain only alphanumeric and _ or -');
  }

  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }

  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }

  return value;
};

module.exports = {
  username,
  password,
};
