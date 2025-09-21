import { Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { UserRequest } from '../types/request.type';
import { StatusCodes } from 'http-status-codes';
import {
  DashboardFilters,
  DashboardBaseFilters,
  TransactionFilterType,
  DateFilterType
} from '../types/dashboard.type';

/**
 * Controller untuk menangani request terkait dashboard.
 */
export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  /**
   * Mengambil data dashboard lengkap (summary, transactions untuk chart).
   * GET /dashboard
   */
  getDashboard = async (
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

      const request: DashboardBaseFilters = {
        type: req.query.type as TransactionFilterType,
        date_filter: req.query.date_filter as DateFilterType,
        start_date: req.query.start_date as string,
        end_date: req.query.end_date as string
      };

      const result = await this.dashboardService.getDashboard(userId, request);

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Data dashboard berhasil diambil',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mengambil hanya categories summary.
   * GET /dashboard/categories
   */
  getCategories = async (
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

      const request: DashboardFilters = {
        type: req.query.type as TransactionFilterType,
        date_filter: req.query.date_filter as DateFilterType,
        start_date: req.query.start_date as string,
        end_date: req.query.end_date as string
      };

      const result = await this.dashboardService.getCategories(userId, request);

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Categories summary berhasil diambil',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mengambil hanya transactions list.
   * GET /dashboard/transactions
   */
  getTransactions = async (
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

      const request: DashboardFilters = {
        type: req.query.type as TransactionFilterType,
        date_filter: req.query.date_filter as DateFilterType,
        start_date: req.query.start_date as string,
        end_date: req.query.end_date as string,
        category_id: req.query.category_id as string,
        account_id: req.query.account_id as string,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit
          ? parseInt(req.query.limit as string)
          : undefined,
        sort_by: req.query.sort_by as string,
        sort_order: req.query.sort_order as 'asc' | 'desc'
      };

      const result = await this.dashboardService.getTransactions(
        userId,
        request
      );

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Transactions list berhasil diambil',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}
