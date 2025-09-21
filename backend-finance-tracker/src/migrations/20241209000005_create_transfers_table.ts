import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transfers', (table) => {
    table.specificType('transfer_id', 'CHAR(21)').primary();
    table
      .specificType('from_account_id', 'CHAR(21)')
      .notNullable()
      .references('account_id')
      .inTable('accounts')
      .onDelete('CASCADE');
    table
      .specificType('to_account_id', 'CHAR(21)')
      .notNullable()
      .references('account_id')
      .inTable('accounts')
      .onDelete('CASCADE');
    table.decimal('amount', 15, 2).notNullable();
    table.text('description');
    table.date('transfer_date').notNullable();
    table
      .specificType('user_id', 'CHAR(21)')
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.index(['user_id']);
    table.index(['from_account_id']);
    table.index(['to_account_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transfers');
}
