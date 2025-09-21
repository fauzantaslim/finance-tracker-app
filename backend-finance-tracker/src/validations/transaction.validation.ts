import { z } from 'zod';
import { CategoryType } from '../models/category.model';

export class TransactionValidation {
  private static readonly baseSchemas = {
    type: z.enum(Object.values(CategoryType) as [string, ...string[]], {
      message: 'Tipe transaction tidak valid'
    }),
    amount: z.number().min(0.01),
    description: z.string().max(500).optional(),
    transactionDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
    transactionId: z.string().min(1).max(21),
    userId: z.string().min(1).max(21),
    categoryId: z.string().min(1).max(21),
    accountId: z.string().min(1).max(21)
  };

  static readonly CREATE = z.object({
    type: this.baseSchemas.type,
    amount: this.baseSchemas.amount,
    description: this.baseSchemas.description,
    transaction_date: this.baseSchemas.transactionDate,
    user_id: this.baseSchemas.userId,
    category_id: this.baseSchemas.categoryId,
    account_id: this.baseSchemas.accountId
  });

  static readonly UPDATE = z.object({
    transaction_id: this.baseSchemas.transactionId,
    type: this.baseSchemas.type.optional(),
    amount: this.baseSchemas.amount.optional(),
    description: this.baseSchemas.description,
    transaction_date: this.baseSchemas.transactionDate.optional(),
    user_id: this.baseSchemas.userId.optional(),
    category_id: this.baseSchemas.categoryId.optional(),
    account_id: this.baseSchemas.accountId.optional()
  });

  static readonly GET = z.object({
    transaction_id: this.baseSchemas.transactionId
  });

  static readonly DELETE = z.object({
    transaction_id: this.baseSchemas.transactionId
  });
}
