import { Knex, knex } from 'knex';

exports.up = async function (knex: Knex) {
  return knex.schema
    .createTable('point_items', function (table) {
      table.increments('id').primary();
      table.string('point_id')
      .notNullable()
      .references('id')
      .inTable('points');

      table.string('item_id').notNullable()
      .references('id')
      .inTable('items');
    })
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable('point_items');
};

exports.config = { transaction: false };