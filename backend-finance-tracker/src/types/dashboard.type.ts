import { CategoryType } from '../models/category.model';

export type TransactionFilterType = 'all' | 'income' | 'expense';
export type DateFilterType = 'week' | 'month' | 'year' | 'custom';

export interface DashboardSummary {
  total_income: number;
  total_expense: number;
  net_income: number;
  transaction_count: number;
}

export interface CategorySummary {
  category_id: string;
  category_name: string;
  category_type: CategoryType;
  category_icon: string;
  category_color: string;
  total_amount: number;
  transaction_count: number;
}

export interface TransactionSummary {
  transaction_id: string;
  type: CategoryType;
  amount: number;
  description?: string;
  transaction_date: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  account_name: string;
  account_icon: string;
  account_color: string;
}

export interface DashboardBaseFilters {
  type?: TransactionFilterType;
  date_filter?: DateFilterType;
  start_date?: string;
  end_date?: string;
}

export interface DashboardFilters extends DashboardBaseFilters {
  category_id?: string;
  account_id?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface DashboardResponse {
  summary: DashboardSummary;
  transactions: TransactionChartSummary[];
}

export interface TransactionChartSummary {
  amount: number;
  type: CategoryType;
  transaction_date: string;
}
