import type { Knex } from 'knex';
import { nanoid } from 'nanoid';

export async function seed(knex: Knex): Promise<void> {
  // Hapus data yang ada
  await knex('categories').del();

  // Ambil user_id dari user yang sudah ada
  const users = await knex('users').select('user_id');
  if (users.length === 0) {
    throw new Error('No users found. Please run user seeder first.');
  }

  const userId = users[0].user_id; // Gunakan user pertama

  // Insert seed data untuk categories
  await knex('categories').insert([
    // Income
    {
      category_id: nanoid(21),
      name: 'Gaji',
      type: 'income',
      icon: 'mdi:cash-multiple',
      color: '#22c55e',
      user_id: userId
    },
    {
      category_id: nanoid(21),
      name: 'Freelance',
      type: 'income',
      icon: 'mdi:briefcase',
      color: '#06b6d4',
      user_id: userId
    },
    {
      category_id: nanoid(21),
      name: 'Investasi',
      type: 'income',
      icon: 'mdi:trending-up',
      color: '#84cc16',
      user_id: userId
    },
    {
      category_id: nanoid(21),
      name: 'Bonus',
      type: 'income',
      icon: 'mdi:gift',
      color: '#f97316',
      user_id: userId
    },
    // Expense
    {
      category_id: nanoid(21),
      name: 'Makanan',
      type: 'expense',
      icon: 'mdi:food',
      color: '#ef4444',
      user_id: userId
    },
    {
      category_id: nanoid(21),
      name: 'Transportasi',
      type: 'expense',
      icon: 'mdi:car',
      color: '#6366f1',
      user_id: userId
    },
    {
      category_id: nanoid(21),
      name: 'Belanja',
      type: 'expense',
      icon: 'mdi:cart',
      color: '#ec4899',
      user_id: userId
    },
    {
      category_id: nanoid(21),
      name: 'Hiburan',
      type: 'expense',
      icon: 'mdi:movie',
      color: '#8b5cf6',
      user_id: userId
    },
    {
      category_id: nanoid(21),
      name: 'Kesehatan',
      type: 'expense',
      icon: 'mdi:hospital',
      color: '#f59e0b',
      user_id: userId
    },
    {
      category_id: nanoid(21),
      name: 'Tagihan',
      type: 'expense',
      icon: 'mdi:file-document',
      color: '#6b7280',
      user_id: userId
    }
  ]);
}
