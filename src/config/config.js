const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development').required(),
    PORT: Joi.number().default(3000),
    HOST: Joi.string().default('localhost'),
    DATABASE_URL: Joi.string().required().description('Postgres database url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_BLACKLIST_DAY_SIZE: Joi.number().default(10000),
    JWT_BLACKLIST_ERROR_RATE: Joi.number().min(0).max(1).default(0.001),
    JWT_BLACKLIST_STORE: Joi.string().valid('memory', 'redis').default('memory'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  host: envVars.HOST,
  database: {
    url: envVars.DATABASE_URL,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    blacklist: {
      daySize: envVars.JWT_BLACKLIST_DAY_SIZE,
      errorRate: envVars.JWT_BLACKLIST_ERROR_RATE,
      storeType: envVars.NODE_ENV === 'development' ? 'memory' : envVars.JWT_BLACKLIST_STORE,
    },
  },
};
