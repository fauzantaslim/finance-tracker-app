import { Response, NextFunction } from 'express';
import { TransferService } from '../services/transfer.service';
import { UserRequest } from '../types/request.type';
import { PaginationParams } from '../types/pagination.type';
import { StatusCodes } from 'http-status-codes';
import {
  CreateTransferRequest,
  DeleteTransferRequest,
  GetTransferRequest,
  UpdateTransferRequest
} from '../types/transfer.type';

/**
 * Controller untuk menangani request terkait transfer.
 */
export class TransferController {
  private transferService: TransferService;

  constructor() {
    this.transferService = new TransferService();
  }

  /**
   * Mengambil daftar transfer dengan pagination.
   * GET /transfers
   */
  getTransfers = async (
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

      const result = await this.transferService.getTransfersByUserId(
        userId,
        paginationParams
      );

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Daftar transfer berhasil diambil',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mengambil detail transfer berdasarkan ID.
   * GET /transfers/:transfer_id
   */
  getTransferById = async (
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

      const request: GetTransferRequest = {
        transfer_id: req.params.transfer_id
      };

      const transfer = await this.transferService.getTransferByIdAndUserId(
        request,
        userId
      );

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Detail transfer berhasil diambil',
        data: transfer
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Membuat transfer baru.
   * POST /transfers
   */
  createTransfer = async (
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

      const request: CreateTransferRequest = {
        ...req.body,
        user_id: userId // Gunakan user_id dari token
      };
      const newTransfer = await this.transferService.createTransfer(request);

      res.status(StatusCodes.CREATED).json({
        success: true,
        status_code: StatusCodes.CREATED,
        message: 'Transfer berhasil dibuat',
        data: newTransfer
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Memperbarui data transfer.
   * PUT /transfers/:transfer_id
   */
  updateTransfer = async (
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

      const request: UpdateTransferRequest = {
        ...req.body,
        transfer_id: req.params.transfer_id,
        user_id: userId // Gunakan user_id dari token
      };
      const updatedTransfer = await this.transferService.updateTransferByUserId(
        request,
        userId
      );

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Transfer berhasil diperbarui',
        data: updatedTransfer
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Menghapus transfer.
   * DELETE /transfers/:transfer_id
   */
  deleteTransfer = async (
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

      const request: DeleteTransferRequest = {
        transfer_id: req.params.transfer_id
      };
      await this.transferService.deleteTransferByUserId(request, userId);

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Transfer berhasil dihapus'
      });
    } catch (error) {
      next(error);
    }
  };
}
