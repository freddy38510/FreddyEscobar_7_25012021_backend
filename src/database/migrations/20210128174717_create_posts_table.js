/* eslint-disable node/exports-style */
exports.up = (knex) => knex.schema.createTable('posts', (table) => {
  table.increments();
  table.integer('user_id').unsigned().notNullable();
  table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  table.string('title', 30).notNullable();
  table.string('slug').unique().notNullable();
  table.text('content').notNullable();
  table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('posts');
