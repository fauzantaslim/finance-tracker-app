import { DashboardRepository } from '../repositories/dashboard.repository';
import {
  DashboardBaseFilters,
  DashboardFilters,
  DashboardResponse,
  CategorySummary,
  TransactionSummary
} from '../types/dashboard.type';
import { PaginationParams, PaginationResponse } from '../types/pagination.type';
import { ResponseError } from '../utils/responseError';
import { StatusCodes } from 'http-status-codes';
import { DashboardValidation } from '../validations/dashboard.validation';
import { Validation } from '../validations/validatiom';

/**
 * Service untuk operasi bisnis terkait dashboard.
 */
export class DashboardService {
  private dashboardRepository: DashboardRepository;

  constructor() {
    this.dashboardRepository = new DashboardRepository();
  }

  /**
   * Mengambil data dashboard lengkap (summary, categories, transactions).
   */
  async getDashboard(
    userId: string,
    request: DashboardBaseFilters
  ): Promise<DashboardResponse> {
    // Validasi parameter
    const validatedData = Validation.validate(
      DashboardValidation.GET_DASHBOARD,
      { ...request, user_id: userId }
    );

    // Filter untuk repository
    const filters: DashboardBaseFilters = {
      type: validatedData.type,
      date_filter: validatedData.date_filter,
      start_date: validatedData.start_date,
      end_date: validatedData.end_date
    };

    try {
      const [summary, transactions] = await Promise.all([
        this.dashboardRepository.getDashboardSummary(userId, filters),
        this.dashboardRepository.getTransactionsForChart(userId, filters)
      ]);
      return {
        summary,
        transactions
      };
    } catch {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal mengambil data dashboard'
      );
    }
  }

  /**
   * Mengambil hanya categories summary.
   */
  async getCategories(
    userId: string,
    request: DashboardFilters
  ): Promise<{ categories: CategorySummary[] }> {
    // Validasi parameter
    const validatedData = Validation.validate(
      DashboardValidation.GET_CATEGORIES,
      { ...request, user_id: userId }
    );

    const filters: DashboardFilters = {
      type: validatedData.type,
      date_filter: validatedData.date_filter,
      start_date: validatedData.start_date,
      end_date: validatedData.end_date
    };

    try {
      const categories = await this.dashboardRepository.getCategoriesSummary(
        userId,
        filters
      );
      return { categories };
    } catch {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal mengambil categories summary'
      );
    }
  }

  /**
   * Mengambil hanya transactions list.
   */
  async getTransactions(
    userId: string,
    request: DashboardFilters
  ): Promise<{
    transactions: TransactionSummary[];
    pagination: PaginationResponse<TransactionSummary>['pagination'];
  }> {
    // Validasi parameter
    const validatedData = Validation.validate(
      DashboardValidation.GET_TRANSACTIONS,
      { ...request, user_id: userId }
    );

    // Set default pagination jika tidak ada
    const paginationParams: PaginationParams = {
      page: validatedData.page || 1,
      limit: validatedData.limit || 10,
      search: validatedData.search,
      sort_by: validatedData.sort_by || 'transaction_date',
      sort_order: validatedData.sort_order || 'desc'
    };

    // Validasi pagination
    if (paginationParams.page < 1) {
      throw new ResponseError(
        StatusCodes.BAD_REQUEST,
        'Halaman harus lebih dari 0'
      );
    }

    if (paginationParams.limit < 1 || paginationParams.limit > 100) {
      throw new ResponseError(
        StatusCodes.BAD_REQUEST,
        'Limit harus antara 1-100'
      );
    }

    const filters: DashboardFilters = {
      type: validatedData.type,
      date_filter: validatedData.date_filter,
      start_date: validatedData.start_date,
      end_date: validatedData.end_date,
      category_id: validatedData.category_id,
      account_id: validatedData.account_id,
      search: validatedData.search
    };

    try {
      const transactionsResult =
        await this.dashboardRepository.getTransactionsSummary(
          userId,
          filters,
          paginationParams
        );

      return {
        transactions: transactionsResult.data,
        pagination: transactionsResult.pagination
      };
    } catch {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal mengambil transactions list'
      );
    }
  }
}
