import { Response, NextFunction } from 'express';
import { TransactionService } from '../services/transaction.service';
import { UserRequest } from '../types/request.type';
import { PaginationParams } from '../types/pagination.type';
import { StatusCodes } from 'http-status-codes';
import {
  CreateTransactionRequest,
  DeleteTransactionRequest,
  GetTransactionRequest,
  UpdateTransactionRequest
} from '../types/transaction.type';

/**
 * Controller untuk menangani request terkait transaction.
 */
export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  /**
   * Mengambil daftar transaction dengan pagination.
   * GET /transactions
   */
  getTransactions = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Validasi query parameters
      const paginationParams: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        sort_by: req.query.sort_by as string,
        sort_order: (req.query.sort_order as 'asc' | 'desc') || 'desc'
      };

      // Gunakan user_id dari token yang sudah di-authenticate
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          status_code: StatusCodes.UNAUTHORIZED,
          message: 'User tidak terautentikasi'
        });
      }

      const result = await this.transactionService.getTransactionsByUserId(
        userId,
        paginationParams
      );

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Daftar transaction berhasil diambil',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mengambil detail transaction berdasarkan ID.
   * GET /transactions/:transaction_id
   */
  getTransactionById = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          status_code: StatusCodes.UNAUTHORIZED,
          message: 'User tidak terautentikasi'
        });
      }

      const request: GetTransactionRequest = {
        transaction_id: req.params.transaction_id
      };

      const transaction =
        await this.transactionService.getTransactionByIdAndUserId(
          request,
          userId
        );

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Detail transaction berhasil diambil',
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Membuat transaction baru.
   * POST /transactions
   */
  createTransaction = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          status_code: StatusCodes.UNAUTHORIZED,
          message: 'User tidak terautentikasi'
        });
      }

      const request: CreateTransactionRequest = {
        ...req.body,
        user_id: userId // Gunakan user_id dari token
      };
      const newTransaction =
        await this.transactionService.createTransaction(request);

      res.status(StatusCodes.CREATED).json({
        success: true,
        status_code: StatusCodes.CREATED,
        message: 'Transaction berhasil dibuat',
        data: newTransaction
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Memperbarui data transaction.
   * PUT /transactions/:transaction_id
   */
  updateTransaction = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          status_code: StatusCodes.UNAUTHORIZED,
          message: 'User tidak terautentikasi'
        });
      }

      const request: UpdateTransactionRequest = {
        ...req.body,
        transaction_id: req.params.transaction_id,
        user_id: userId // Gunakan user_id dari token
      };
      const updatedTransaction =
        await this.transactionService.updateTransactionByUserId(
          request,
          userId
        );

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Transaction berhasil diperbarui',
        data: updatedTransaction
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Menghapus transaction.
   * DELETE /transactions/:transaction_id
   */
  deleteTransaction = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          status_code: StatusCodes.UNAUTHORIZED,
          message: 'User tidak terautentikasi'
        });
      }

      const request: DeleteTransactionRequest = {
        transaction_id: req.params.transaction_id
      };
      await this.transactionService.deleteTransactionByUserId(request, userId);

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Transaction berhasil dihapus'
      });
    } catch (error) {
      next(error);
    }
  };
}
