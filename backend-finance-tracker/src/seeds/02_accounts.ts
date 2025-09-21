import type { Knex } from 'knex';
import { nanoid } from 'nanoid';

export async function seed(knex: Knex): Promise<void> {
  // Hapus data yang ada
  await knex('accounts').del();

  // Ambil user_id dari user yang sudah ada
  const users = await knex('users').select('user_id');
  if (users.length === 0) {
    throw new Error('No users found. Please run user seeder first.');
  }

  const userId = users[0].user_id; // Gunakan user pertama

  // Insert seed data untuk accounts
  await knex('accounts').insert([
    {
      account_id: nanoid(21),
      name: 'Bank Mandiri',
      balance: 1500000,
      icon: 'mdi:bank', // ganti dari '🏦'
      color: '#3b82f6',
      user_id: userId
    },
    {
      account_id: nanoid(21),
      name: 'BCA',
      balance: 500000,
      icon: 'mdi:credit-card', // ganti dari '💳'
      color: '#10b981',
      user_id: userId
    },
    {
      account_id: nanoid(21),
      name: 'Cash',
      balance: 200000,
      icon: 'mdi:cash', // ganti dari '💵'
      color: '#f59e0b',
      user_id: userId
    },
    {
      account_id: nanoid(21),
      name: 'E-Wallet',
      balance: 100000,
      icon: 'mdi:wallet', // ganti dari '📱'
      color: '#8b5cf6',
      user_id: userId
    }
  ]);
}
