import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('accounts', (table) => {
    table.specificType('account_id', 'CHAR(21)').primary();
    table.string('name', 100).notNullable();
    table.decimal('balance', 15, 2).notNullable();
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
  return knex.schema.dropTable('accounts');
}
