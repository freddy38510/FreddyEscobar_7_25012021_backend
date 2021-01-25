/* eslint-disable node/exports-style */
exports.up = (knex) => knex.schema.createTable('users', (table) => {
  table.increments();
  table.string('email').unique().notNullable();
  table.string('username').unique().notNullable();
  table.string('password').notNullable();
  table.boolean('isModerator').notNullable().defaultTo(false);
  table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('users');
