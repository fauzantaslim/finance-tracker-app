import { z } from 'zod';

export class DashboardValidation {
  private static readonly baseSchemas = {
    type: z.enum(['all', 'income', 'expense']).optional(),
    date_filter: z.enum(['week', 'month', 'year', 'custom']).optional(),
    start_date: z.string().datetime().optional(),
    end_date: z.string().datetime().optional(),
    category_id: z.string().min(1).max(21).optional(),
    account_id: z.string().min(1).max(21).optional(),
    search: z.string().max(255).optional(),
    page: z.number().min(1).optional(),
    limit: z.number().min(1).max(100).optional(),
    sort_by: z.string().max(50).optional(),
    sort_order: z.enum(['asc', 'desc']).optional(),
    userId: z.string().min(1).max(21)
  };

  static readonly GET_DASHBOARD = z.object({
    type: this.baseSchemas.type,
    date_filter: this.baseSchemas.date_filter,
    start_date: this.baseSchemas.start_date,
    end_date: this.baseSchemas.end_date,
    category_id: this.baseSchemas.category_id
  });

  static readonly GET_CATEGORIES = z.object({
    type: this.baseSchemas.type,
    date_filter: this.baseSchemas.date_filter,
    start_date: this.baseSchemas.start_date,
    end_date: this.baseSchemas.end_date
  });

  static readonly GET_TRANSACTIONS = z.object({
    type: this.baseSchemas.type,
    date_filter: this.baseSchemas.date_filter,
    start_date: this.baseSchemas.start_date,
    end_date: this.baseSchemas.end_date,
    category_id: this.baseSchemas.category_id,
    account_id: this.baseSchemas.account_id,
    search: this.baseSchemas.search,
    page: this.baseSchemas.page,
    limit: this.baseSchemas.limit,
    sort_by: this.baseSchemas.sort_by,
    sort_order: this.baseSchemas.sort_order
  });
}
