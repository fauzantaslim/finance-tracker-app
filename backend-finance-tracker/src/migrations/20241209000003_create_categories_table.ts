import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('categories', (table) => {
    table.specificType('category_id', 'CHAR(21)').primary();
    table.string('name', 100).notNullable();
    table.enu('type', ['income', 'expense']).notNullable();
    table.string('icon', 100).notNullable();
    table.string('color', 7).notNullable();
    table
      .specificType('user_id', 'CHAR(21)')
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.index(['user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('categories');
}
