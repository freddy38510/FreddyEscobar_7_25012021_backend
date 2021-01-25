const config = require('../config/config');
const knexConfig = require('../config/knexConfig.js')[config.env];

module.exports = require('knex')(knexConfig);
