// models/transaction.model.ts
import { CategoryType } from './category.model';

export interface Transaction {
  transaction_id: string;
  type: CategoryType;
  amount: number;
  description?: string;
  transaction_date: string;
  user_id: string;
  category_id: string;
  account_id: string;
}
