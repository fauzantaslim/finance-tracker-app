import { Response, NextFunction } from 'express';
import { AccountService } from '../services/account.service';
import { UserRequest } from '../types/request.type';
import { PaginationParams } from '../types/pagination.type';
import { StatusCodes } from 'http-status-codes';
import {
  CreateAccountRequest,
  DeleteAccountRequest,
  GetAccountRequest,
  UpdateAccountRequest
} from '../types/account.type';

/**
 * Controller untuk menangani request terkait account.
 */
export class AccountController {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  /**
   * Mengambil daftar account dengan pagination.
   * GET /accounts
   */
  getAccounts = async (req: UserRequest, res: Response, next: NextFunction) => {
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

      const result = await this.accountService.getAccountsByUserId(
        userId,
        paginationParams
      );

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Daftar account berhasil diambil',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mengambil detail account berdasarkan ID.
   * GET /accounts/:account_id
   */
  getAccountById = async (
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

      const request: GetAccountRequest = {
        account_id: req.params.account_id
      };

      const account = await this.accountService.getAccountByIdAndUserId(
        request,
        userId
      );

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Detail account berhasil diambil',
        data: account
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Membuat account baru.
   * POST /accounts
   */
  createAccount = async (
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

      const request: CreateAccountRequest = {
        ...req.body,
        user_id: userId // Gunakan user_id dari token
      };
      const newAccount = await this.accountService.createAccount(request);

      res.status(StatusCodes.CREATED).json({
        success: true,
        status_code: StatusCodes.CREATED,
        message: 'Account berhasil dibuat',
        data: newAccount
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Memperbarui data account.
   * PUT /accounts/:account_id
   */
  updateAccount = async (
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

      const request: UpdateAccountRequest = {
        ...req.body,
        account_id: req.params.account_id,
        user_id: userId // Gunakan user_id dari token
      };
      const updatedAccount = await this.accountService.updateAccountByUserId(
        request,
        userId
      );

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Account berhasil diperbarui',
        data: updatedAccount
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Menghapus account.
   * DELETE /accounts/:account_id
   */
  deleteAccount = async (
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

      const request: DeleteAccountRequest = {
        account_id: req.params.account_id
      };
      await this.accountService.deleteAccountByUserId(request, userId);

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Account berhasil dihapus'
      });
    } catch (error) {
      next(error);
    }
  };
}
