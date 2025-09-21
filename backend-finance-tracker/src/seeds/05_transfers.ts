import type { Knex } from 'knex';
import { nanoid } from 'nanoid';

export async function seed(knex: Knex): Promise<void> {
  // Hapus data yang ada
  await knex('transfers').del();

  // Ambil user_id dan account_id yang sudah ada
  const users = await knex('users').select('user_id');
  const accounts = await knex('accounts').select('account_id', 'name');

  if (users.length === 0 || accounts.length === 0) {
    throw new Error(
      'No users or accounts found. Please run previous seeders first.'
    );
  }

  const userId = users[0].user_id;

  // Cari account berdasarkan nama
  const bankMandiri = accounts.find((acc) => acc.name === 'Bank Mandiri');
  const bca = accounts.find((acc) => acc.name === 'BCA');
  const cash = accounts.find((acc) => acc.name === 'Cash');
  const eWallet = accounts.find((acc) => acc.name === 'E-Wallet');

  if (!bankMandiri || !bca || !cash || !eWallet) {
    throw new Error('Required accounts not found.');
  }

  // Generate tanggal untuk transfer (beberapa hari terakhir)
  const today = new Date();
  const dates = [];
  for (let i = 7; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  // Insert seed data untuk transfers
  const transfers = [
    {
      transfer_id: nanoid(21),
      from_account_id: bankMandiri.account_id,
      to_account_id: cash.account_id,
      amount: 200000.0,
      description: 'Tarik tunai untuk kebutuhan harian',
      transfer_date: dates[dates.length - 2], // Yesterday
      user_id: userId
    },
    {
      transfer_id: nanoid(21),
      from_account_id: bca.account_id,
      to_account_id: eWallet.account_id,
      amount: 50000.0,
      description: 'Top up e-wallet',
      transfer_date: dates[dates.length - 3], // 2 days ago
      user_id: userId
    },
    {
      transfer_id: nanoid(21),
      from_account_id: bankMandiri.account_id,
      to_account_id: bca.account_id,
      amount: 100000.0,
      description: 'Transfer ke rekening BCA',
      transfer_date: dates[dates.length - 5], // 4 days ago
      user_id: userId
    },
    {
      transfer_id: nanoid(21),
      from_account_id: eWallet.account_id,
      to_account_id: cash.account_id,
      amount: 25000.0,
      description: 'Tarik tunai dari e-wallet',
      transfer_date: dates[dates.length - 6], // 5 days ago
      user_id: userId
    }
  ];

  await knex('transfers').insert(transfers);
}
