import { Account } from '../models/account.model';

export type AccountIdRequest = { account_id: string };

export type CreateAccountRequest = Omit<Account, 'account_id'>;
export type UpdateAccountRequest = AccountIdRequest &
  Partial<Omit<Account, 'account_id'>>;
export type GetAccountRequest = AccountIdRequest;
export type DeleteAccountRequest = AccountIdRequest;
export type AccountResponse = Account;

export function toAccountResponse(account: Account): AccountResponse {
  return { ...account };
}
