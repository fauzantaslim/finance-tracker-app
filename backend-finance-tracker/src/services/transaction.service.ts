import { TransactionRepository } from '../repositories/transaction.repository';
import { Transaction } from '../models/transaction.model';
import { CategoryType } from '../models/category.model';
import { PaginationParams, PaginationResponse } from '../types/pagination.type';
import {
  TransactionResponse,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  GetTransactionRequest,
  DeleteTransactionRequest
} from '../types/transaction.type';
import { ResponseError } from '../utils/responseError';
import { StatusCodes } from 'http-status-codes';
import { TransactionValidation } from '../validations/transaction.validation';
import { Validation } from '../validations/validatiom';

/**
 * Service untuk operasi bisnis terkait transaction.
 */
export class TransactionService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  /**
   * Mengambil daftar transaction dengan pagination berdasarkan user_id.
   */
  async getTransactionsByUserId(
    userId: string,
    params: PaginationParams
  ): Promise<PaginationResponse<TransactionResponse>> {
    // Validasi parameter pagination
    if (params.page < 1) {
      throw new ResponseError(
        StatusCodes.BAD_REQUEST,
        'Halaman harus lebih dari 0'
      );
    }

    if (params.limit < 1 || params.limit > 100) {
      throw new ResponseError(
        StatusCodes.BAD_REQUEST,
        'Limit harus antara 1-100'
      );
    }

    return await this.transactionRepository.findAllByUserId(userId, params);
  }

  /**
   * Mengambil detail transaction berdasarkan ID dan user_id.
   */
  async getTransactionByIdAndUserId(
    request: GetTransactionRequest,
    userId: string
  ): Promise<TransactionResponse> {
    // Validasi parameter menggunakan Validation utility
    const validatedParams = Validation.validate(
      TransactionValidation.GET,
      request
    );

    const transaction = await this.transactionRepository.findByIdAndUserId(
      validatedParams.transaction_id,
      userId
    );

    if (!transaction) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Transaction tidak ditemukan'
      );
    }

    return transaction;
  }

  /**
   * Membuat transaction baru.
   */
  async createTransaction(
    request: CreateTransactionRequest
  ): Promise<TransactionResponse> {
    // Validasi data menggunakan Validation utility
    const validatedData = Validation.validate(
      TransactionValidation.CREATE,
      request
    );

    // Cek apakah user ada
    const userExists = await this.transactionRepository.isUserExists(
      validatedData.user_id
    );
    if (!userExists) {
      throw new ResponseError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
    }

    // Cek apakah category ada dan milik user
    const categoryExists = await this.transactionRepository.isCategoryExists(
      validatedData.category_id,
      validatedData.user_id
    );
    if (!categoryExists) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Category tidak ditemukan atau tidak milik user ini'
      );
    }

    // Cek apakah type transaction sama dengan type category
    const category = await this.transactionRepository.getCategoryById(
      validatedData.category_id
    );
    if (!category) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Category tidak ditemukan'
      );
    }
    if (category.type !== validatedData.type) {
      throw new ResponseError(
        StatusCodes.BAD_REQUEST,
        'Type transaction harus sama dengan type category'
      );
    }

    // Cek apakah account ada dan milik user
    const accountExists = await this.transactionRepository.isAccountExists(
      validatedData.account_id,
      validatedData.user_id
    );
    if (!accountExists) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Account tidak ditemukan atau tidak milik user ini'
      );
    }

    const newTransaction = await this.transactionRepository.create({
      ...validatedData,
      type: validatedData.type as CategoryType
    });
    if (!newTransaction) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal membuat transaction'
      );
    }

    return newTransaction;
  }

  /**
   * Memperbarui data transaction.
   */
  async updateTransaction(
    request: UpdateTransactionRequest
  ): Promise<TransactionResponse> {
    // Validasi parameter dan data menggunakan Validation utility
    const validatedData = Validation.validate(
      TransactionValidation.UPDATE,
      request
    );

    // Cek transaction ada atau tidak
    const existingTransaction =
      await this.transactionRepository.findByIdAndUserId(
        validatedData.transaction_id,
        validatedData.user_id || ''
      );
    if (!existingTransaction) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Transaction tidak ditemukan'
      );
    }

    // Validasi category jika diupdate
    if (
      validatedData.category_id &&
      validatedData.category_id !== existingTransaction.category_id
    ) {
      const categoryExists = await this.transactionRepository.isCategoryExists(
        validatedData.category_id,
        existingTransaction.user_id
      );
      if (!categoryExists) {
        throw new ResponseError(
          StatusCodes.NOT_FOUND,
          'Category tidak ditemukan atau tidak milik user ini'
        );
      }

      // Cek apakah type transaction sama dengan type category
      const category = await this.transactionRepository.getCategoryById(
        validatedData.category_id
      );
      if (!category) {
        throw new ResponseError(
          StatusCodes.NOT_FOUND,
          'Category tidak ditemukan'
        );
      }
      if (validatedData.type && category.type !== validatedData.type) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Type transaction harus sama dengan type category'
        );
      }
    }

    // Validasi type jika diupdate tanpa mengubah category
    if (
      validatedData.type &&
      validatedData.type !== existingTransaction.type &&
      (!validatedData.category_id ||
        validatedData.category_id === existingTransaction.category_id)
    ) {
      const category = await this.transactionRepository.getCategoryById(
        existingTransaction.category_id
      );
      if (!category) {
        throw new ResponseError(
          StatusCodes.NOT_FOUND,
          'Category tidak ditemukan'
        );
      }
      if (category.type !== validatedData.type) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Type transaction harus sama dengan type category'
        );
      }
    }

    // Validasi account jika diupdate
    if (
      validatedData.account_id &&
      validatedData.account_id !== existingTransaction.account_id
    ) {
      const accountExists = await this.transactionRepository.isAccountExists(
        validatedData.account_id,
        existingTransaction.user_id
      );
      if (!accountExists) {
        throw new ResponseError(
          StatusCodes.NOT_FOUND,
          'Account tidak ditemukan atau tidak milik user ini'
        );
      }
    }

    // Validasi user_id jika diupdate
    if (
      validatedData.user_id &&
      validatedData.user_id !== existingTransaction.user_id
    ) {
      const userExists = await this.transactionRepository.isUserExists(
        validatedData.user_id
      );
      if (!userExists) {
        throw new ResponseError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
      }
    }

    // Hapus transaction_id dari update data karena tidak boleh diupdate
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { transaction_id: _transaction_id, ...dataToUpdate } =
      validatedData as Partial<Omit<Transaction, 'transaction_id'>> & {
        transaction_id?: string;
      };

    const updatedTransaction = await this.transactionRepository.update(
      validatedData.transaction_id,
      dataToUpdate
    );
    if (!updatedTransaction) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal memperbarui transaction'
      );
    }

    return updatedTransaction;
  }

  /**
   * Memperbarui data transaction berdasarkan user_id.
   */
  async updateTransactionByUserId(
    request: UpdateTransactionRequest,
    userId: string
  ): Promise<TransactionResponse> {
    // Validasi parameter dan data menggunakan Validation utility
    const validatedData = Validation.validate(
      TransactionValidation.UPDATE,
      request
    );

    // Cek transaction ada atau tidak dan milik user yang benar
    const existingTransaction =
      await this.transactionRepository.findByIdAndUserId(
        validatedData.transaction_id,
        userId
      );
    if (!existingTransaction) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Transaction tidak ditemukan'
      );
    }

    // Validasi category jika diupdate
    if (
      validatedData.category_id &&
      validatedData.category_id !== existingTransaction.category_id
    ) {
      const categoryExists = await this.transactionRepository.isCategoryExists(
        validatedData.category_id,
        userId
      );
      if (!categoryExists) {
        throw new ResponseError(
          StatusCodes.NOT_FOUND,
          'Category tidak ditemukan atau tidak milik user ini'
        );
      }

      // Cek apakah type transaction sama dengan type category
      const category = await this.transactionRepository.getCategoryById(
        validatedData.category_id
      );
      if (!category) {
        throw new ResponseError(
          StatusCodes.NOT_FOUND,
          'Category tidak ditemukan'
        );
      }
      if (validatedData.type && category.type !== validatedData.type) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Type transaction harus sama dengan type category'
        );
      }
    }

    // Validasi type jika diupdate tanpa mengubah category
    if (
      validatedData.type &&
      validatedData.type !== existingTransaction.type &&
      (!validatedData.category_id ||
        validatedData.category_id === existingTransaction.category_id)
    ) {
      const category = await this.transactionRepository.getCategoryById(
        existingTransaction.category_id
      );
      if (!category) {
        throw new ResponseError(
          StatusCodes.NOT_FOUND,
          'Category tidak ditemukan'
        );
      }
      if (category.type !== validatedData.type) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Type transaction harus sama dengan type category'
        );
      }
    }

    // Validasi account jika diupdate
    if (
      validatedData.account_id &&
      validatedData.account_id !== existingTransaction.account_id
    ) {
      const accountExists = await this.transactionRepository.isAccountExists(
        validatedData.account_id,
        userId
      );
      if (!accountExists) {
        throw new ResponseError(
          StatusCodes.NOT_FOUND,
          'Account tidak ditemukan atau tidak milik user ini'
        );
      }
    }

    // Hapus transaction_id dan user_id dari update data karena tidak boleh diupdate
    const dataToUpdate: Partial<Omit<Transaction, 'transaction_id'>> = {
      type: validatedData.type as CategoryType | undefined,
      amount: validatedData.amount,
      description: validatedData.description,
      transaction_date: validatedData.transaction_date,
      category_id: validatedData.category_id,
      account_id: validatedData.account_id
    };

    const updatedTransaction = await this.transactionRepository.update(
      validatedData.transaction_id,
      dataToUpdate
    );
    if (!updatedTransaction) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal memperbarui transaction'
      );
    }

    return updatedTransaction;
  }

  /**
   * Menghapus transaction.
   */
  async deleteTransaction(request: DeleteTransactionRequest): Promise<void> {
    // Validasi parameter menggunakan Validation utility
    const validatedParams = Validation.validate(
      TransactionValidation.DELETE,
      request
    );

    const transactionExists =
      await this.transactionRepository.findByIdAndUserId(
        validatedParams.transaction_id,
        '' // Tidak ada user_id untuk method deleteTransaction yang lama
      );
    if (!transactionExists) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Transaction tidak ditemukan'
      );
    }

    const deleted = await this.transactionRepository.delete(
      validatedParams.transaction_id
    );
    if (!deleted) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal menghapus transaction'
      );
    }
  }

  /**
   * Menghapus transaction berdasarkan user_id.
   */
  async deleteTransactionByUserId(
    request: DeleteTransactionRequest,
    userId: string
  ): Promise<void> {
    // Validasi parameter menggunakan Validation utility
    const validatedParams = Validation.validate(
      TransactionValidation.DELETE,
      request
    );

    const transactionExists =
      await this.transactionRepository.findByIdAndUserId(
        validatedParams.transaction_id,
        userId
      );
    if (!transactionExists) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Transaction tidak ditemukan'
      );
    }

    const deleted = await this.transactionRepository.delete(
      validatedParams.transaction_id
    );
    if (!deleted) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal menghapus transaction'
      );
    }
  }
}
