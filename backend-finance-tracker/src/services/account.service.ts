import { AccountRepository } from '../repositories/account.repository';
import { Account } from '../models/account.model';
import { PaginationParams, PaginationResponse } from '../types/pagination.type';
import {
  AccountResponse,
  CreateAccountRequest,
  UpdateAccountRequest,
  GetAccountRequest,
  DeleteAccountRequest
} from '../types/account.type';
import { ResponseError } from '../utils/responseError';
import { StatusCodes } from 'http-status-codes';
import { AccountValidation } from '../validations/account.validation';
import { Validation } from '../validations/validatiom';

/**
 * Service untuk operasi bisnis terkait account.
 */
export class AccountService {
  private accountRepository: AccountRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
  }

  /**
   * Mengambil daftar account dengan pagination berdasarkan user_id.
   */
  async getAccountsByUserId(
    userId: string,
    params: PaginationParams
  ): Promise<PaginationResponse<AccountResponse>> {
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

    return await this.accountRepository.findAllByUserId(userId, params);
  }

  /**
   * Mengambil detail account berdasarkan ID dan user_id.
   */
  async getAccountByIdAndUserId(
    request: GetAccountRequest,
    userId: string
  ): Promise<AccountResponse> {
    // Validasi parameter menggunakan Validation utility
    const validatedParams = Validation.validate(AccountValidation.GET, request);

    const account = await this.accountRepository.findByIdAndUserId(
      validatedParams.account_id,
      userId
    );

    if (!account) {
      throw new ResponseError(StatusCodes.NOT_FOUND, 'Account tidak ditemukan');
    }

    return account;
  }

  /**
   * Membuat account baru.
   */
  async createAccount(request: CreateAccountRequest): Promise<AccountResponse> {
    // Validasi data menggunakan Validation utility
    const validatedData = Validation.validate(
      AccountValidation.CREATE,
      request
    );

    // Cek apakah user ada
    const userExists = await this.accountRepository.isUserExists(
      validatedData.user_id
    );
    if (!userExists) {
      throw new ResponseError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
    }

    // Cek apakah nama account sudah ada untuk user yang sama
    const nameExists = await this.accountRepository.isNameExists(
      validatedData.name,
      validatedData.user_id
    );
    if (nameExists) {
      throw new ResponseError(
        StatusCodes.CONFLICT,
        'Nama account sudah digunakan untuk user ini'
      );
    }

    const newAccount = await this.accountRepository.create(validatedData);
    if (!newAccount) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal membuat account'
      );
    }

    return newAccount;
  }

  /**
   * Memperbarui data account.
   */
  async updateAccount(request: UpdateAccountRequest): Promise<AccountResponse> {
    // Validasi parameter dan data menggunakan Validation utility
    const validatedData = Validation.validate(
      AccountValidation.UPDATE,
      request
    );

    // Cek account ada atau tidak
    const existingAccount = await this.accountRepository.findByIdAndUserId(
      validatedData.account_id,
      validatedData.user_id || ''
    );
    if (!existingAccount) {
      throw new ResponseError(StatusCodes.NOT_FOUND, 'Account tidak ditemukan');
    }

    // Validasi nama jika diupdate
    if (validatedData.name && validatedData.name !== existingAccount.name) {
      const nameExists = await this.accountRepository.isNameExists(
        validatedData.name,
        existingAccount.user_id,
        validatedData.account_id
      );
      if (nameExists) {
        throw new ResponseError(
          StatusCodes.CONFLICT,
          'Nama account sudah digunakan untuk user ini'
        );
      }
    }

    // Validasi user_id jika diupdate
    if (
      validatedData.user_id &&
      validatedData.user_id !== existingAccount.user_id
    ) {
      const userExists = await this.accountRepository.isUserExists(
        validatedData.user_id
      );
      if (!userExists) {
        throw new ResponseError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
      }
    }

    // Hapus account_id dari update data karena tidak boleh diupdate
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { account_id: _account_id, ...dataToUpdate } =
      validatedData as Partial<Omit<Account, 'account_id'>> & {
        account_id?: string;
      };

    const updatedAccount = await this.accountRepository.update(
      validatedData.account_id,
      dataToUpdate
    );
    if (!updatedAccount) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal memperbarui account'
      );
    }

    return updatedAccount;
  }

  /**
   * Memperbarui data account berdasarkan user_id.
   */
  async updateAccountByUserId(
    request: UpdateAccountRequest,
    userId: string
  ): Promise<AccountResponse> {
    // Validasi parameter dan data menggunakan Validation utility
    const validatedData = Validation.validate(
      AccountValidation.UPDATE,
      request
    );

    // Cek account ada atau tidak dan milik user yang benar
    const existingAccount = await this.accountRepository.findByIdAndUserId(
      validatedData.account_id,
      userId
    );
    if (!existingAccount) {
      throw new ResponseError(StatusCodes.NOT_FOUND, 'Account tidak ditemukan');
    }

    // Validasi nama jika diupdate
    if (validatedData.name && validatedData.name !== existingAccount.name) {
      const nameExists = await this.accountRepository.isNameExists(
        validatedData.name,
        userId,
        validatedData.account_id
      );
      if (nameExists) {
        throw new ResponseError(
          StatusCodes.CONFLICT,
          'Nama account sudah digunakan untuk user ini'
        );
      }
    }

    // Hapus account_id dan user_id dari update data karena tidak boleh diupdate
    const dataToUpdate: Partial<Omit<Account, 'account_id'>> = {
      name: validatedData.name,
      balance: validatedData.balance,
      icon: validatedData.icon,
      color: validatedData.color
    };

    const updatedAccount = await this.accountRepository.update(
      validatedData.account_id,
      dataToUpdate
    );
    if (!updatedAccount) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal memperbarui account'
      );
    }

    return updatedAccount;
  }

  /**
   * Menghapus account.
   */
  async deleteAccount(request: DeleteAccountRequest): Promise<void> {
    // Validasi parameter menggunakan Validation utility
    const validatedParams = Validation.validate(
      AccountValidation.DELETE,
      request
    );

    const accountExists = await this.accountRepository.findByIdAndUserId(
      validatedParams.account_id,
      '' // Tidak ada user_id untuk method deleteAccount yang lama
    );
    if (!accountExists) {
      throw new ResponseError(StatusCodes.NOT_FOUND, 'Account tidak ditemukan');
    }

    const deleted = await this.accountRepository.delete(
      validatedParams.account_id
    );
    if (!deleted) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal menghapus account'
      );
    }
  }

  /**
   * Menghapus account berdasarkan user_id.
   */
  async deleteAccountByUserId(
    request: DeleteAccountRequest,
    userId: string
  ): Promise<void> {
    // Validasi parameter menggunakan Validation utility
    const validatedParams = Validation.validate(
      AccountValidation.DELETE,
      request
    );

    const accountExists = await this.accountRepository.findByIdAndUserId(
      validatedParams.account_id,
      userId
    );
    if (!accountExists) {
      throw new ResponseError(StatusCodes.NOT_FOUND, 'Account tidak ditemukan');
    }

    const deleted = await this.accountRepository.delete(
      validatedParams.account_id
    );
    if (!deleted) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal menghapus account'
      );
    }
  }
}
