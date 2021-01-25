/* eslint-disable node/exports-style */
exports.up = (knex) => knex.schema.createTable('comments', (table) => {
  table.increments();
  table.integer('user_id').unsigned().notNullable();
  table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  table.integer('post_id').unsigned().notNullable();
  table.foreign('post_id').references('id').inTable('posts').onDelete('CASCADE');
  table.text('content').notNullable();
  table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('comments');
