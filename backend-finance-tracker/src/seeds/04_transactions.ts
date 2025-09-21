import type { Knex } from 'knex';
import { nanoid } from 'nanoid';

export async function seed(knex: Knex): Promise<void> {
  // Hapus data yang ada
  await knex('transactions').del();

  // Ambil user_id, account_id, dan category_id yang sudah ada
  const users = await knex('users').select('user_id');
  const accounts = await knex('accounts').select('account_id', 'name');
  const categories = await knex('categories').select(
    'category_id',
    'name',
    'type'
  );

  if (users.length === 0 || accounts.length === 0 || categories.length === 0) {
    throw new Error(
      'No users, accounts, or categories found. Please run previous seeders first.'
    );
  }

  const userId = users[0].user_id;

  // Cari account dan category berdasarkan nama
  const bankMandiri = accounts.find((acc) => acc.name === 'Bank Mandiri');
  const bca = accounts.find((acc) => acc.name === 'BCA');
  const cash = accounts.find((acc) => acc.name === 'Cash');

  const gajiCategory = categories.find(
    (cat) => cat.name === 'Gaji' && cat.type === 'income'
  );
  const freelanceCategory = categories.find(
    (cat) => cat.name === 'Freelance' && cat.type === 'income'
  );
  const makananCategory = categories.find(
    (cat) => cat.name === 'Makanan' && cat.type === 'expense'
  );
  const transportasiCategory = categories.find(
    (cat) => cat.name === 'Transportasi' && cat.type === 'expense'
  );
  const belanjaCategory = categories.find(
    (cat) => cat.name === 'Belanja' && cat.type === 'expense'
  );

  if (
    !bankMandiri ||
    !bca ||
    !cash ||
    !gajiCategory ||
    !freelanceCategory ||
    !makananCategory ||
    !transportasiCategory ||
    !belanjaCategory
  ) {
    throw new Error('Required accounts or categories not found.');
  }

  // Generate tanggal untuk transaksi (14 hari terakhir)
  const today = new Date();
  const dates = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  // Insert seed data untuk transactions
  const transactions = [
    // Income transactions
    {
      transaction_id: nanoid(21),
      type: 'income',
      amount: 1500000,
      description: 'Gaji bulanan',
      transaction_date: dates[dates.length - 1], // Today
      user_id: userId,
      category_id: gajiCategory.category_id,
      account_id: bankMandiri.account_id
    },
    {
      transaction_id: nanoid(21),
      type: 'income',
      amount: 500000,
      description: 'Freelance project',
      transaction_date: dates[dates.length - 2], // Yesterday
      user_id: userId,
      category_id: freelanceCategory.category_id,
      account_id: bca.account_id
    },
    // Expense transactions
    {
      transaction_id: nanoid(21),
      type: 'expense',
      amount: 50000,
      description: 'Makan siang',
      transaction_date: dates[dates.length - 1], // Today
      user_id: userId,
      category_id: makananCategory.category_id,
      account_id: cash.account_id
    },
    {
      transaction_id: nanoid(21),
      type: 'expense',
      amount: 25000,
      description: 'Bensin motor',
      transaction_date: dates[dates.length - 2], // Yesterday
      user_id: userId,
      category_id: transportasiCategory.category_id,
      account_id: cash.account_id
    },
    {
      transaction_id: nanoid(21),
      type: 'expense',
      amount: 100000,
      description: 'Belanja bulanan',
      transaction_date: dates[dates.length - 3], // 2 days ago
      user_id: userId,
      category_id: belanjaCategory.category_id,
      account_id: bankMandiri.account_id
    },
    {
      transaction_id: nanoid(21),
      type: 'expense',
      amount: 30000,
      description: 'Makan malam',
      transaction_date: dates[dates.length - 4], // 3 days ago
      user_id: userId,
      category_id: makananCategory.category_id,
      account_id: cash.account_id
    },
    {
      transaction_id: nanoid(21),
      type: 'expense',
      amount: 15000,
      description: 'Gojek',
      transaction_date: dates[dates.length - 5], // 4 days ago
      user_id: userId,
      category_id: transportasiCategory.category_id,
      account_id: bca.account_id
    }
  ];

  await knex('transactions').insert(transactions);
}
