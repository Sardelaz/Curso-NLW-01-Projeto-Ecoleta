import { Knex, knex } from 'knex';

exports.up = async function (knex: Knex) {
  return knex.schema
    .createTable('items', function (table) {
      table.increments('id').primary();
      table.string('image').notNullable();
      table.string('title').notNullable();
    })
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable('items');
};

exports.config = { transaction: false };