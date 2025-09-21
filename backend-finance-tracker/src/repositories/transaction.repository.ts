import { Transaction } from '../models/transaction.model';
import { PaginationParams, PaginationResponse } from '../types/pagination.type';
import {
  TransactionResponse,
  toTransactionResponse
} from '../types/transaction.type';
import db from '../configs/database';
import { nanoid } from 'nanoid';

/**
 * Repository untuk operasi database terkait transaction.
 */
export class TransactionRepository {
  private tableName = 'transactions';

  /**
   * Mengambil semua transaction dengan pagination dan search berdasarkan user_id.
   */
  async findAllByUserId(
    userId: string,
    params: PaginationParams
  ): Promise<PaginationResponse<TransactionResponse>> {
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
      data: data.map(toTransactionResponse),
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
   * Mengambil transaction berdasarkan ID dan user_id.
   */
  async findByIdAndUserId(
    transactionId: string,
    userId: string
  ): Promise<TransactionResponse | null> {
    const transaction = await db(this.tableName)
      .where('transaction_id', transactionId)
      .where('user_id', userId)
      .first();

    return transaction ? toTransactionResponse(transaction) : null;
  }

  /**
   * Membuat transaction baru.
   */
  async create(
    transactionData: Omit<Transaction, 'transaction_id'>
  ): Promise<TransactionResponse | null> {
    // Generate transaction_id menggunakan nanoid
    const transactionId = nanoid();

    await db(this.tableName).insert({
      ...transactionData,
      transaction_id: transactionId,
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    });

    // Ambil transaction yang baru dibuat
    const transaction = await db(this.tableName)
      .where('transaction_id', transactionId)
      .first();

    return transaction ? toTransactionResponse(transaction) : null;
  }

  /**
   * Memperbarui data transaction.
   */
  async update(
    transactionId: string,
    transactionData: Partial<Omit<Transaction, 'transaction_id'>>
  ): Promise<TransactionResponse | null> {
    const updatedRows = await db(this.tableName)
      .where('transaction_id', transactionId)
      .update({
        ...transactionData,
        updated_at: db.fn.now()
      });

    if (updatedRows === 0) {
      return null;
    }

    // Ambil transaction yang sudah diupdate
    const transaction = await db(this.tableName)
      .where('transaction_id', transactionId)
      .first();

    return transaction ? toTransactionResponse(transaction) : null;
  }

  /**
   * Menghapus transaction berdasarkan ID.
   */
  async delete(transactionId: string): Promise<boolean> {
    const deletedRows = await db(this.tableName)
      .where('transaction_id', transactionId)
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
   * Mengecek apakah category ada dan milik user.
   */
  async isCategoryExists(categoryId: string, userId: string): Promise<boolean> {
    const category = await db('categories')
      .where('category_id', categoryId)
      .where('user_id', userId)
      .first();
    return !!category;
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
   * Mengambil category berdasarkan ID untuk validasi type.
   */
  async getCategoryById(categoryId: string): Promise<{ type: string } | null> {
    const category = await db('categories')
      .select('type')
      .where('category_id', categoryId)
      .first();
    return category || null;
  }
}
