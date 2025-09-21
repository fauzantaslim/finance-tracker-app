// models/transfer.model.ts
export interface Transfer {
  transfer_id: string;
  from_account_id: string;
  to_account_id: string;
  amount: number;
  description?: string;
  transfer_date: string;
  user_id: string;
}
