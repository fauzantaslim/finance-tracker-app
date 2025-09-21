import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.specificType('transaction_id', 'CHAR(21)').primary();
    table.enu('type', ['income', 'expense']).notNullable();
    table.decimal('amount', 15, 2).notNullable();
    table.text('description');
    table.date('transaction_date').notNullable();
    table
      .specificType('user_id', 'CHAR(21)')
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .specificType('category_id', 'CHAR(21)')
      .notNullable()
      .references('category_id')
      .inTable('categories')
      .onDelete('CASCADE');
    table
      .specificType('account_id', 'CHAR(21)')
      .notNullable()
      .references('account_id')
      .inTable('accounts')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.index(['user_id']);
    table.index(['category_id']);
    table.index(['account_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transactions');
}
