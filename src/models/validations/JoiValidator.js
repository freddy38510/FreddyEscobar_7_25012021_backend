const { Validator } = require('objection');
const Joi = require('joi');
const pick = require('../../utils/pick');

class JoiValidator extends Validator {
  validate({
    model, json, options,
  }) {
    let schema = model.validationSchema;

    if (!schema) {
      return json;
    }

    if (options.patch) {
      schema = pick(schema, Object.keys(json));
    }

    const { error, value } = Joi.object()
      .keys(schema)
      .validate(json, { abortEarly: false });

    if (error) {
      this.model = model;
      throw this.parseJoiValidationError({ error, value });
    }

    return value;
  }

  parseJoiValidationError(validation) {
    const errors = validation.error.details;

    const validationInfo = {
      data: {},
      type: 'ModelValidation',
    };

    for (let i = 0; i < errors.length; i += 1) {
      const error = errors[i];

      validationInfo.data[error.path] = validationInfo.data[error.path] || [];

      validationInfo.data[error.path].push({
        message: error.message,
        keyword: error.type,
        params: error.context,
      });
    }

    return this.model.createValidationError(validationInfo);
  }
}

module.exports = JoiValidator;
