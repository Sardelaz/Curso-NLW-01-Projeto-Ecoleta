import { Knex, knex } from 'knex';

exports.up = async function (knex: Knex) {
  return knex.schema
    .createTable('points', function (table) {
      table.increments('id').primary();
      table.string('image').notNullable();
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('whatsapp').notNullable();
      table.decimal('latitude').notNullable();
      table.decimal('longitude').notNullable();
      table.string('city').notNullable();
      table.string('uf', 2).notNullable();
    })
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable('points');
};

exports.config = { transaction: false };