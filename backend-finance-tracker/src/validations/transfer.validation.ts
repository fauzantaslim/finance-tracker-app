import { z } from 'zod';

export class TransferValidation {
  private static readonly baseSchemas = {
    fromAccountId: z.string().min(1).max(21),
    toAccountId: z.string().min(1).max(21),
    amount: z.number().min(0.01),
    description: z.string().max(500).optional(),
    transferDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
    transferId: z.string().min(1).max(21),
    userId: z.string().min(1).max(21)
  };

  static readonly CREATE = z
    .object({
      from_account_id: this.baseSchemas.fromAccountId,
      to_account_id: this.baseSchemas.toAccountId,
      amount: this.baseSchemas.amount,
      description: this.baseSchemas.description,
      transfer_date: this.baseSchemas.transferDate,
      user_id: this.baseSchemas.userId
    })
    .refine((data) => data.from_account_id !== data.to_account_id, {
      message: 'Account asal dan tujuan tidak boleh sama',
      path: ['to_account_id']
    });

  static readonly UPDATE = z
    .object({
      transfer_id: this.baseSchemas.transferId,
      from_account_id: this.baseSchemas.fromAccountId.optional(),
      to_account_id: this.baseSchemas.toAccountId.optional(),
      amount: this.baseSchemas.amount.optional(),
      description: this.baseSchemas.description,
      transfer_date: this.baseSchemas.transferDate.optional(),
      user_id: this.baseSchemas.userId.optional()
    })
    .refine(
      (data) => {
        if (data.from_account_id && data.to_account_id) {
          return data.from_account_id !== data.to_account_id;
        }
        return true;
      },
      {
        message: 'Account asal dan tujuan tidak boleh sama',
        path: ['to_account_id']
      }
    );

  static readonly GET = z.object({
    transfer_id: this.baseSchemas.transferId
  });

  static readonly DELETE = z.object({
    transfer_id: this.baseSchemas.transferId
  });
}
