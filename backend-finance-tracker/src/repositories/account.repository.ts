import { Account } from '../models/account.model';
import { PaginationParams, PaginationResponse } from '../types/pagination.type';
import { AccountResponse, toAccountResponse } from '../types/account.type';
import db from '../configs/database';
import { nanoid } from 'nanoid';

/**
 * Repository untuk operasi database terkait account.
 */
export class AccountRepository {
  private tableName = 'accounts';

  /**
   * Mengambil semua account dengan pagination dan search berdasarkan user_id.
   */
  async findAllByUserId(
    userId: string,
    params: PaginationParams
  ): Promise<PaginationResponse<AccountResponse>> {
    const {
      page,
      limit,
      search,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = params;
    const offset = (page - 1) * limit;

    // Query builder untuk data dengan filter user_id
    let query = db(this.tableName).select('*').where('user_id', userId);

    // Filter search jika ada
    if (search) {
      query = query.where(function () {
        this.where('name', 'ilike', `%${search}%`);
      });
    }

    // Sorting
    query = query.orderBy(sort_by, sort_order);

    // Pagination
    const data = await query.limit(limit).offset(offset);

    // Query untuk total count dengan filter user_id
    let countQuery = db(this.tableName).where('user_id', userId);
    if (search) {
      countQuery = countQuery.where(function () {
        this.where('name', 'ilike', `%${search}%`);
      });
    }

    const [{ count }] = await countQuery.count('* as count');
    const totalItems = parseInt(count as string);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: data.map(toAccountResponse),
      pagination: {
        total_items: totalItems,
        total_pages: totalPages,
        current_page: page,
        limit,
        has_next: page < totalPages,
        has_prev: page > 1
      }
    };
  }

  /**
   * Mengambil account berdasarkan ID dan user_id.
   */
  async findByIdAndUserId(
    accountId: string,
    userId: string
  ): Promise<AccountResponse | null> {
    const account = await db(this.tableName)
      .where('account_id', accountId)
      .where('user_id', userId)
      .first();

    return account ? toAccountResponse(account) : null;
  }

  /**
   * Membuat account baru.
   */
  async create(
    accountData: Omit<Account, 'account_id'>
  ): Promise<AccountResponse | null> {
    // Generate account_id menggunakan nanoid
    const accountId = nanoid();

    await db(this.tableName).insert({
      ...accountData,
      account_id: accountId,
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    });

    // Ambil account yang baru dibuat
    const account = await db(this.tableName)
      .where('account_id', accountId)
      .first();

    return account ? toAccountResponse(account) : null;
  }

  /**
   * Memperbarui data account.
   */
  async update(
    accountId: string,
    accountData: Partial<Omit<Account, 'account_id'>>
  ): Promise<AccountResponse | null> {
    const updatedRows = await db(this.tableName)
      .where('account_id', accountId)
      .update({
        ...accountData,
        updated_at: db.fn.now()
      });

    if (updatedRows === 0) {
      return null;
    }

    // Ambil account yang sudah diupdate
    const account = await db(this.tableName)
      .where('account_id', accountId)
      .first();

    return account ? toAccountResponse(account) : null;
  }

  /**
   * Menghapus account berdasarkan ID.
   */
  async delete(accountId: string): Promise<boolean> {
    const deletedRows = await db(this.tableName)
      .where('account_id', accountId)
      .del();

    return deletedRows > 0;
  }

  /**
   * Mengecek apakah nama account sudah digunakan untuk user tertentu.
   */
  async isNameExists(
    name: string,
    userId: string,
    excludeAccountId?: string
  ): Promise<boolean> {
    let query = db(this.tableName).where('name', name).where('user_id', userId);

    if (excludeAccountId) {
      query = query.whereNot('account_id', excludeAccountId);
    }

    const account = await query.first();
    return !!account;
  }

  /**
   * Mengecek apakah user ada.
   */
  async isUserExists(userId: string): Promise<boolean> {
    const user = await db('users').where('user_id', userId).first();
    return !!user;
  }
}
