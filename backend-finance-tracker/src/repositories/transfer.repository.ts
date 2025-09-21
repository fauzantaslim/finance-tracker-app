import { Transfer } from '../models/transfer.model';
import { PaginationParams, PaginationResponse } from '../types/pagination.type';
import { TransferResponse, toTransferResponse } from '../types/transfer.type';
import db from '../configs/database';
import { nanoid } from 'nanoid';

/**
 * Repository untuk operasi database terkait transfer.
 */
export class TransferRepository {
  private tableName = 'transfers';

  /**
   * Mengambil semua transfer dengan pagination dan search berdasarkan user_id.
   */
  async findAllByUserId(
    userId: string,
    params: PaginationParams
  ): Promise<PaginationResponse<TransferResponse>> {
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
        this.where('description', 'ilike', `%${search}%`);
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
        this.where('description', 'ilike', `%${search}%`);
      });
    }

    const [{ count }] = await countQuery.count('* as count');
    const totalItems = parseInt(count as string);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: data.map(toTransferResponse),
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
   * Mengambil transfer berdasarkan ID dan user_id.
   */
  async findByIdAndUserId(
    transferId: string,
    userId: string
  ): Promise<TransferResponse | null> {
    const transfer = await db(this.tableName)
      .where('transfer_id', transferId)
      .where('user_id', userId)
      .first();

    return transfer ? toTransferResponse(transfer) : null;
  }

  /**
   * Membuat transfer baru.
   */
  async create(
    transferData: Omit<Transfer, 'transfer_id'>
  ): Promise<TransferResponse | null> {
    // Generate transfer_id menggunakan nanoid
    const transferId = nanoid();

    await db(this.tableName).insert({
      ...transferData,
      transfer_id: transferId,
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    });

    // Ambil transfer yang baru dibuat
    const transfer = await db(this.tableName)
      .where('transfer_id', transferId)
      .first();

    return transfer ? toTransferResponse(transfer) : null;
  }

  /**
   * Memperbarui data transfer.
   */
  async update(
    transferId: string,
    transferData: Partial<Omit<Transfer, 'transfer_id'>>
  ): Promise<TransferResponse | null> {
    const updatedRows = await db(this.tableName)
      .where('transfer_id', transferId)
      .update({
        ...transferData,
        updated_at: db.fn.now()
      });

    if (updatedRows === 0) {
      return null;
    }

    // Ambil transfer yang sudah diupdate
    const transfer = await db(this.tableName)
      .where('transfer_id', transferId)
      .first();

    return transfer ? toTransferResponse(transfer) : null;
  }

  /**
   * Menghapus transfer berdasarkan ID.
   */
  async delete(transferId: string): Promise<boolean> {
    const deletedRows = await db(this.tableName)
      .where('transfer_id', transferId)
      .del();

    return deletedRows > 0;
  }

  /**
   * Mengecek apakah user ada.
   */
  async isUserExists(userId: string): Promise<boolean> {
    const user = await db('users').where('user_id', userId).first();
    return !!user;
  }

  /**
   * Mengecek apakah account ada dan milik user.
   */
  async isAccountExists(accountId: string, userId: string): Promise<boolean> {
    const account = await db('accounts')
      .where('account_id', accountId)
      .where('user_id', userId)
      .first();
    return !!account;
  }

  /**
   * Mengambil account berdasarkan ID untuk validasi balance.
   */
  async getAccountById(accountId: string): Promise<{ balance: number } | null> {
    const account = await db('accounts')
      .select('balance')
      .where('account_id', accountId)
      .first();
    return account || null;
  }

  /**
   * Update balance account.
   */
  async updateAccountBalance(
    accountId: string,
    newBalance: number
  ): Promise<boolean> {
    const updatedRows = await db('accounts')
      .where('account_id', accountId)
      .update({
        balance: newBalance,
        updated_at: db.fn.now()
      });

    return updatedRows > 0;
  }

  /**
   * Begin database transaction.
   */
  async beginTransaction() {
    return db.transaction();
  }
}
