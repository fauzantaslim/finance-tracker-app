import { Transaction } from '../models/transaction.model';
import moment from 'moment-timezone';

export type TransactionIdRequest = { transaction_id: string };

export type CreateTransactionRequest = Omit<Transaction, 'transaction_id'>;
export type UpdateTransactionRequest = TransactionIdRequest &
  Partial<Omit<Transaction, 'transaction_id'>>;
export type GetTransactionRequest = TransactionIdRequest;
export type DeleteTransactionRequest = TransactionIdRequest;
export type TransactionResponse = Transaction;

export function toTransactionResponse(
  transaction: Transaction
): TransactionResponse {
  return {
    ...transaction,
    transaction_date: moment(transaction.transaction_date)
      .utc()
      .tz('Asia/Jakarta')
      .format('DD-MM-YYYY')
  };
}
