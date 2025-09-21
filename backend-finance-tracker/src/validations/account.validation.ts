import { z } from 'zod';

export class AccountValidation {
  private static readonly baseSchemas = {
    name: z.string().min(1).max(100),
    balance: z.number().min(0),
    icon: z.string().min(1).max(100),
    color: z.string().min(1).max(7),
    accountId: z.string().min(1).max(21),
    userId: z.string().min(1).max(21)
  };

  static readonly CREATE = z.object({
    name: this.baseSchemas.name,
    balance: this.baseSchemas.balance,
    icon: this.baseSchemas.icon,
    color: this.baseSchemas.color,
    user_id: this.baseSchemas.userId
  });

  static readonly UPDATE = z.object({
    account_id: this.baseSchemas.accountId,
    name: this.baseSchemas.name.optional(),
    balance: this.baseSchemas.balance.optional(),
    icon: this.baseSchemas.icon.optional(),
    color: this.baseSchemas.color.optional(),
    user_id: this.baseSchemas.userId.optional()
  });

  static readonly GET = z.object({
    account_id: this.baseSchemas.accountId
  });

  static readonly DELETE = z.object({
    account_id: this.baseSchemas.accountId
  });
}
