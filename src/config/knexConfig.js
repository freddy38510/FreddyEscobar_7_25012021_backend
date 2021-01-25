const config = require('./config');

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://dev@localhost/groupomaniaSocialNetwork_dev',
    migrations: {
      directory: `${__dirname}/../database/migrations`,
    },
    seeds: {
      directory: `${__dirname}/../database/seeds/development`,
    },
  },
  production: {
    client: 'pg',
    connection: config.database.url,
    migrations: {
      directory: `${__dirname}/../database/migrations`,
    },
    seeds: {
      directory: `${__dirname}/../database/seeds/production`,
    },
  },
};
