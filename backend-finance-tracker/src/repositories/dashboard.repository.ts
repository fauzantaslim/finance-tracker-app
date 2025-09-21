import {
  DashboardBaseFilters,
  DashboardFilters,
  DashboardSummary,
  CategorySummary,
  TransactionSummary
} from '../types/dashboard.type';
import { PaginationParams, PaginationResponse } from '../types/pagination.type';
import db from '../configs/database';

/**
 * Repository untuk operasi database terkait dashboard.
 */
export class DashboardRepository {
  /**
   * Mendapatkan summary dashboard berdasarkan filter.
   */
  async getDashboardSummary(
    userId: string,
    filters: DashboardBaseFilters
  ): Promise<DashboardSummary> {
    const dateCondition = this.buildDateCondition(filters);
    const typeCondition = this.buildTypeCondition(filters);

    // Query untuk mendapatkan total income
    const incomeResult = await db('transactions as t')
      .join('categories as c', 't.category_id', 'c.category_id')
      .where('t.user_id', userId)
      .where('c.type', 'income')
      .whereRaw(dateCondition)
      .whereRaw(typeCondition)
      .sum('t.amount as total')
      .first();

    // Query untuk mendapatkan total expense
    const expenseResult = await db('transactions as t')
      .join('categories as c', 't.category_id', 'c.category_id')
      .where('t.user_id', userId)
      .where('c.type', 'expense')
      .whereRaw(dateCondition)
      .whereRaw(typeCondition)
      .sum('t.amount as total')
      .first();

    // Query untuk mendapatkan total transaction count
    const countResult = await db('transactions as t')
      .join('categories as c', 't.category_id', 'c.category_id')
      .where('t.user_id', userId)
      .whereRaw(dateCondition)
      .whereRaw(typeCondition)
      .count('t.transaction_id as total')
      .first();

    const totalIncome = parseFloat(incomeResult?.total as string) || 0;
    const totalExpense = parseFloat(expenseResult?.total as string) || 0;
    const transactionCount = parseInt(countResult?.total as string) || 0;

    return {
      total_income: totalIncome,
      total_expense: totalExpense,
      net_income: totalIncome - totalExpense,
      transaction_count: transactionCount
    };
  }

  /**
   * Mendapatkan summary kategori berdasarkan filter.
   */
  async getCategoriesSummary(
    userId: string,
    filters: DashboardFilters
  ): Promise<CategorySummary[]> {
    const dateCondition = this.buildDateCondition(filters);
    const typeCondition = this.buildTypeCondition(filters);

    const categories = await db('categories as c')
      .join('transactions as t', 'c.category_id', 't.category_id')
      .where('c.user_id', userId)
      .whereRaw(dateCondition)
      .whereRaw(typeCondition)
      .select(
        'c.category_id',
        'c.name as category_name',
        'c.type as category_type',
        'c.icon as category_icon',
        'c.color as category_color'
      )
      .sum('t.amount as total_amount')
      .count('t.transaction_id as transaction_count')
      .groupBy('c.category_id', 'c.name', 'c.type', 'c.icon', 'c.color')
      .orderBy('total_amount', 'desc');

    return categories.map((category) => ({
      category_id: category.category_id,
      category_name: category.category_name,
      category_type: category.category_type,
      category_icon: category.category_icon,
      category_color: category.category_color,
      total_amount: parseFloat(category.total_amount as string) || 0,
      transaction_count: parseInt(category.transaction_count as string) || 0
    }));
  }

  /**
   * Mendapatkan daftar transaksi dengan pagination berdasarkan filter.
   */
  async getTransactionsSummary(
    userId: string,
    filters: DashboardFilters,
    paginationParams: PaginationParams
  ): Promise<PaginationResponse<TransactionSummary>> {
    const {
      page,
      limit,
      sort_by = 'transaction_date',
      sort_order = 'desc'
    } = paginationParams;
    const offset = (page - 1) * limit;

    const dateCondition = this.buildDateCondition(filters);
    const typeCondition = this.buildTypeCondition(filters);
    const searchCondition = this.buildSearchCondition(filters);

    // Query builder untuk data
    let query = db('transactions as t')
      .join('categories as c', 't.category_id', 'c.category_id')
      .join('accounts as a', 't.account_id', 'a.account_id')
      .where('t.user_id', userId)
      .whereRaw(dateCondition)
      .whereRaw(typeCondition)
      .whereRaw(searchCondition);

    // Filter tambahan
    if (filters.category_id) {
      query = query.where('t.category_id', filters.category_id);
    }
    if (filters.account_id) {
      query = query.where('t.account_id', filters.account_id);
    }

    // Sorting
    query = query.orderBy(sort_by, sort_order);

    // Pagination
    const data = await query
      .select(
        't.transaction_id',
        't.type',
        't.amount',
        't.description',
        't.transaction_date',
        'c.name as category_name',
        'c.icon as category_icon',
        'c.color as category_color',
        'a.name as account_name',
        'a.icon as account_icon',
        'a.color as account_color'
      )
      .limit(limit)
      .offset(offset);

    // Query untuk total count
    let countQuery = db('transactions as t')
      .join('categories as c', 't.category_id', 'c.category_id')
      .join('accounts as a', 't.account_id', 'a.account_id')
      .where('t.user_id', userId)
      .whereRaw(dateCondition)
      .whereRaw(typeCondition)
      .whereRaw(searchCondition);

    if (filters.category_id) {
      countQuery = countQuery.where('t.category_id', filters.category_id);
    }
    if (filters.account_id) {
      countQuery = countQuery.where('t.account_id', filters.account_id);
    }

    const [{ count }] = await countQuery.count('t.transaction_id as count');
    const totalItems = parseInt(count as string);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: data.map((transaction) => ({
        transaction_id: transaction.transaction_id,
        type: transaction.type,
        amount: parseFloat(transaction.amount),
        description: transaction.description,
        transaction_date: transaction.transaction_date,
        category_name: transaction.category_name,
        category_icon: transaction.category_icon,
        category_color: transaction.category_color,
        account_name: transaction.account_name,
        account_icon: transaction.account_icon,
        account_color: transaction.account_color
      })),
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
   * Mendapatkan daftar transaksi untuk chart (tanpa pagination, hanya amount, type, transaction_date).
   */
  async getTransactionsForChart(
    userId: string,
    filters: DashboardBaseFilters
  ): Promise<
    {
      amount: number;
      type: import('../models/category.model').CategoryType;
      transaction_date: string;
    }[]
  > {
    const dateCondition = this.buildDateCondition(filters);
    const typeCondition = this.buildTypeCondition(filters);

    const query = db('transactions as t')
      .join('categories as c', 't.category_id', 'c.category_id')
      .where('t.user_id', userId)
      .whereRaw(dateCondition)
      .whereRaw(typeCondition);

    return query
      .select('t.amount', 'c.type as type', 't.transaction_date')
      .orderBy('t.transaction_date', 'asc')
      .then((rows) =>
        rows.map((row) => ({
          amount: parseFloat(row.amount),
          type: row.type as import('../models/category.model').CategoryType,
          transaction_date: row.transaction_date
        }))
      );
  }

  /**
   * Membangun kondisi tanggal berdasarkan filter.
   */
  private buildDateCondition(filters: DashboardFilters): string {
    if (filters.start_date && filters.end_date) {
      return `t.transaction_date >= '${filters.start_date}' AND t.transaction_date <= '${filters.end_date}'`;
    }

    if (filters.date_filter) {
      const now = new Date();
      let startDate: Date;
      const endDate: Date = now;

      switch (filters.date_filter) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          return '1=1'; // No date filter
      }

      return `t.transaction_date >= '${startDate.toISOString()}' AND t.transaction_date <= '${endDate.toISOString()}'`;
    }

    return '1=1'; // No date filter
  }

  /**
   * Membangun kondisi tipe berdasarkan filter.
   */
  private buildTypeCondition(filters: DashboardFilters): string {
    if (filters.type && filters.type !== 'all') {
      return `c.type = '${filters.type}'`;
    }
    return '1=1'; // No type filter
  }

  /**
   * Membangun kondisi pencarian berdasarkan filter.
   */
  private buildSearchCondition(filters: DashboardFilters): string {
    if (filters.search) {
      return `(t.description ILIKE '%${filters.search}%' OR c.name ILIKE '%${filters.search}%' OR a.name ILIKE '%${filters.search}%')`;
    }
    return '1=1'; // No search filter
  }
}
