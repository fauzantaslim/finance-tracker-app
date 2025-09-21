import { User } from '../models/user.model';
import {
  UserResponse,
  toUserResponse,
  RegisterRequest
} from '../types/user.type';
import db from '../configs/database';
import { nanoid } from 'nanoid';

/**
 * Repository untuk operasi database terkait autentikasi.
 */
export class AuthRepository {
  private tableName = 'users';

  /**
   * Mengambil user berdasarkan email untuk login.
   */
  async findByEmail(email: string): Promise<User | null> {
    return await db(this.tableName).where('email', email).first();
  }

  /**
   * Mengambil user berdasarkan ID untuk validasi token.
   */
  async findById(userId: string): Promise<User | null> {
    return await db(this.tableName).where('user_id', userId).first();
  }

  /**
   * Membuat user baru di database untuk registrasi.
   */
  async create(userData: RegisterRequest): Promise<UserResponse> {
    // Generate user_id menggunakan nanoid
    const userId = nanoid();

    await db(this.tableName).insert({
      ...userData,
      user_id: userId
    });

    // Ambil user yang baru dibuat
    const user = await db(this.tableName).where('user_id', userId).first();

    if (!user) {
      throw new Error('Gagal membuat user');
    }

    return toUserResponse(user);
  }

  /**
   * Memperbarui last_login timestamp user.
   */
  async updateLastLogin(userId: string): Promise<void> {
    await db(this.tableName).where('user_id', userId).update({
      updated_at: db.fn.now()
    });
  }
}
