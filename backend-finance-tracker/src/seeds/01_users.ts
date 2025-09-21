import type { Knex } from 'knex';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

export async function seed(knex: Knex): Promise<void> {
  // Hapus data yang ada
  await knex('users').del();

  // Hash password untuk user
  const hashedPassword = await bcrypt.hash('psswrd123', 10);

  // Insert seed data
  await knex('users').insert([
    {
      user_id: nanoid(21),
      email: 'johndoe@gmail.com',
      full_name: 'John Doe',
      password: hashedPassword
    }
  ]);
}
