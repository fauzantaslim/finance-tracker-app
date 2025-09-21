import { Request } from 'express';

/**
 * Payload user yang digunakan untuk autentikasi dan otorisasi.
 */
export type UserPayload = {
  user_id: string;
  email: string;
  full_name: string;
};

export interface UserRequest extends Request {
  user?: UserPayload;
}
