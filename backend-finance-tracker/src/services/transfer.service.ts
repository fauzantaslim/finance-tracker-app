import { TransferRepository } from '../repositories/transfer.repository';
import { Transfer } from '../models/transfer.model';
import { PaginationParams, PaginationResponse } from '../types/pagination.type';
import {
  TransferResponse,
  CreateTransferRequest,
  UpdateTransferRequest,
  GetTransferRequest,
  DeleteTransferRequest
} from '../types/transfer.type';
import { ResponseError } from '../utils/responseError';
import { StatusCodes } from 'http-status-codes';
import { TransferValidation } from '../validations/transfer.validation';
import { Validation } from '../validations/validatiom';

/**
 * Service untuk operasi bisnis terkait transfer.
 */
export class TransferService {
  private transferRepository: TransferRepository;

  constructor() {
    this.transferRepository = new TransferRepository();
  }

  /**
   * Mengambil daftar transfer dengan pagination berdasarkan user_id.
   */
  async getTransfersByUserId(
    userId: string,
    params: PaginationParams
  ): Promise<PaginationResponse<TransferResponse>> {
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

    return await this.transferRepository.findAllByUserId(userId, params);
  }

  /**
   * Mengambil detail transfer berdasarkan ID dan user_id.
   */
  async getTransferByIdAndUserId(
    request: GetTransferRequest,
    userId: string
  ): Promise<TransferResponse> {
    // Validasi parameter menggunakan Validation utility
    const validatedParams = Validation.validate(
      TransferValidation.GET,
      request
    );

    const transfer = await this.transferRepository.findByIdAndUserId(
      validatedParams.transfer_id,
      userId
    );

    if (!transfer) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Transfer tidak ditemukan'
      );
    }

    return transfer;
  }

  /**
   * Membuat transfer baru.
   */
  async createTransfer(
    request: CreateTransferRequest
  ): Promise<TransferResponse> {
    // Validasi data menggunakan Validation utility
    const validatedData = Validation.validate(
      TransferValidation.CREATE,
      request
    );

    // Cek apakah user ada
    const userExists = await this.transferRepository.isUserExists(
      validatedData.user_id
    );
    if (!userExists) {
      throw new ResponseError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
    }

    // Cek apakah from_account ada dan milik user
    const fromAccountExists = await this.transferRepository.isAccountExists(
      validatedData.from_account_id,
      validatedData.user_id
    );
    if (!fromAccountExists) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Account asal tidak ditemukan atau tidak milik user ini'
      );
    }

    // Cek apakah to_account ada dan milik user
    const toAccountExists = await this.transferRepository.isAccountExists(
      validatedData.to_account_id,
      validatedData.user_id
    );
    if (!toAccountExists) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Account tujuan tidak ditemukan atau tidak milik user ini'
      );
    }

    // Cek balance account asal
    const fromAccount = await this.transferRepository.getAccountById(
      validatedData.from_account_id
    );
    if (!fromAccount) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Account asal tidak ditemukan'
      );
    }
    if (fromAccount.balance < validatedData.amount) {
      throw new ResponseError(
        StatusCodes.BAD_REQUEST,
        'Saldo account asal tidak mencukupi'
      );
    }

    // Mulai transaction untuk update balance
    const trx = await this.transferRepository.beginTransaction();
    try {
      // Update balance account asal (kurangi)
      const newFromBalance = fromAccount.balance - validatedData.amount;
      const fromUpdated = await this.transferRepository.updateAccountBalance(
        validatedData.from_account_id,
        newFromBalance
      );
      if (!fromUpdated) {
        throw new ResponseError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Gagal update balance account asal'
        );
      }

      // Update balance account tujuan (tambah)
      const toAccount = await this.transferRepository.getAccountById(
        validatedData.to_account_id
      );
      if (!toAccount) {
        throw new ResponseError(
          StatusCodes.NOT_FOUND,
          'Account tujuan tidak ditemukan'
        );
      }
      const newToBalance = toAccount.balance + validatedData.amount;
      const toUpdated = await this.transferRepository.updateAccountBalance(
        validatedData.to_account_id,
        newToBalance
      );
      if (!toUpdated) {
        throw new ResponseError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Gagal update balance account tujuan'
        );
      }

      // Buat record transfer
      const newTransfer = await this.transferRepository.create(validatedData);
      if (!newTransfer) {
        throw new ResponseError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Gagal membuat transfer'
        );
      }

      await trx.commit();
      return newTransfer;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  /**
   * Memperbarui data transfer.
   */
  async updateTransfer(
    request: UpdateTransferRequest
  ): Promise<TransferResponse> {
    // Validasi parameter dan data menggunakan Validation utility
    const validatedData = Validation.validate(
      TransferValidation.UPDATE,
      request
    );

    // Cek transfer ada atau tidak
    const existingTransfer = await this.transferRepository.findByIdAndUserId(
      validatedData.transfer_id,
      validatedData.user_id || ''
    );
    if (!existingTransfer) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Transfer tidak ditemukan'
      );
    }

    // Validasi account jika diupdate
    if (
      validatedData.from_account_id &&
      validatedData.from_account_id !== existingTransfer.from_account_id
    ) {
      const fromAccountExists = await this.transferRepository.isAccountExists(
        validatedData.from_account_id,
        existingTransfer.user_id
      );
      if (!fromAccountExists) {
        throw new ResponseError(
          StatusCodes.NOT_FOUND,
          'Account asal tidak ditemukan atau tidak milik user ini'
        );
      }
    }

    if (
      validatedData.to_account_id &&
      validatedData.to_account_id !== existingTransfer.to_account_id
    ) {
      const toAccountExists = await this.transferRepository.isAccountExists(
        validatedData.to_account_id,
        existingTransfer.user_id
      );
      if (!toAccountExists) {
        throw new ResponseError(
          StatusCodes.NOT_FOUND,
          'Account tujuan tidak ditemukan atau tidak milik user ini'
        );
      }
    }

    // Validasi user_id jika diupdate
    if (
      validatedData.user_id &&
      validatedData.user_id !== existingTransfer.user_id
    ) {
      const userExists = await this.transferRepository.isUserExists(
        validatedData.user_id
      );
      if (!userExists) {
        throw new ResponseError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
      }
    }

    // Hapus transfer_id dari update data karena tidak boleh diupdate
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { transfer_id: _transfer_id, ...dataToUpdate } =
      validatedData as Partial<Omit<Transfer, 'transfer_id'>> & {
        transfer_id?: string;
      };

    const updatedTransfer = await this.transferRepository.update(
      validatedData.transfer_id,
      dataToUpdate
    );
    if (!updatedTransfer) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal memperbarui transfer'
      );
    }

    return updatedTransfer;
  }

  /**
   * Memperbarui data transfer berdasarkan user_id.
   */
  async updateTransferByUserId(
    request: UpdateTransferRequest,
    userId: string
  ): Promise<TransferResponse> {
    // Validasi parameter dan data menggunakan Validation utility
    const validatedData = Validation.validate(
      TransferValidation.UPDATE,
      request
    );

    // Cek transfer ada atau tidak dan milik user yang benar
    const existingTransfer = await this.transferRepository.findByIdAndUserId(
      validatedData.transfer_id,
      userId
    );
    if (!existingTransfer) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Transfer tidak ditemukan'
      );
    }

    // Validasi account jika diupdate
    if (
      validatedData.from_account_id &&
      validatedData.from_account_id !== existingTransfer.from_account_id
    ) {
      const fromAccountExists = await this.transferRepository.isAccountExists(
        validatedData.from_account_id,
        userId
      );
      if (!fromAccountExists) {
        throw new ResponseError(
          StatusCodes.NOT_FOUND,
          'Account asal tidak ditemukan atau tidak milik user ini'
        );
      }
    }

    if (
      validatedData.to_account_id &&
      validatedData.to_account_id !== existingTransfer.to_account_id
    ) {
      const toAccountExists = await this.transferRepository.isAccountExists(
        validatedData.to_account_id,
        userId
      );
      if (!toAccountExists) {
        throw new ResponseError(
          StatusCodes.NOT_FOUND,
          'Account tujuan tidak ditemukan atau tidak milik user ini'
        );
      }
    }

    // Hapus transfer_id dan user_id dari update data karena tidak boleh diupdate
    const dataToUpdate: Partial<Omit<Transfer, 'transfer_id'>> = {
      from_account_id: validatedData.from_account_id,
      to_account_id: validatedData.to_account_id,
      amount: validatedData.amount,
      description: validatedData.description,
      transfer_date: validatedData.transfer_date
    };

    const updatedTransfer = await this.transferRepository.update(
      validatedData.transfer_id,
      dataToUpdate
    );
    if (!updatedTransfer) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal memperbarui transfer'
      );
    }

    return updatedTransfer;
  }

  /**
   * Menghapus transfer.
   */
  async deleteTransfer(request: DeleteTransferRequest): Promise<void> {
    // Validasi parameter menggunakan Validation utility
    const validatedParams = Validation.validate(
      TransferValidation.DELETE,
      request
    );

    const transferExists = await this.transferRepository.findByIdAndUserId(
      validatedParams.transfer_id,
      '' // Tidak ada user_id untuk method deleteTransfer yang lama
    );
    if (!transferExists) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Transfer tidak ditemukan'
      );
    }

    const deleted = await this.transferRepository.delete(
      validatedParams.transfer_id
    );
    if (!deleted) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal menghapus transfer'
      );
    }
  }

  /**
   * Menghapus transfer berdasarkan user_id.
   */
  async deleteTransferByUserId(
    request: DeleteTransferRequest,
    userId: string
  ): Promise<void> {
    // Validasi parameter menggunakan Validation utility
    const validatedParams = Validation.validate(
      TransferValidation.DELETE,
      request
    );

    const transferExists = await this.transferRepository.findByIdAndUserId(
      validatedParams.transfer_id,
      userId
    );
    if (!transferExists) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Transfer tidak ditemukan'
      );
    }

    const deleted = await this.transferRepository.delete(
      validatedParams.transfer_id
    );
    if (!deleted) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal menghapus transfer'
      );
    }
  }
}
