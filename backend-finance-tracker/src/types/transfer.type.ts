import { Transfer } from '../models/transfer.model';
import moment from 'moment-timezone';

export type TransferIdRequest = { transfer_id: string };

export type CreateTransferRequest = Omit<Transfer, 'transfer_id'>;
export type UpdateTransferRequest = TransferIdRequest &
  Partial<Omit<Transfer, 'transfer_id'>>;
export type GetTransferRequest = TransferIdRequest;
export type DeleteTransferRequest = TransferIdRequest;
export type TransferResponse = Transfer;

export function toTransferResponse(transfer: Transfer): TransferResponse {
  return {
    ...transfer,
    transfer_date: moment(transfer.transfer_date)
      .utc()
      .tz('Asia/Jakarta')
      .format('DD-MM-YYYY')
  };
}
