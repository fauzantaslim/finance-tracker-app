import { Response, NextFunction } from 'express';
import type { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { UserRequest } from '../types/request.type';
import { RegisterRequest, LoginRequest } from '../types/user.type';
import { StatusCodes } from 'http-status-codes';

/**
 * Controller untuk menangani request terkait autentikasi.
 */
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Melakukan registrasi user baru.
   * POST /auth/register
   */
  register = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const request: RegisterRequest = req.body as RegisterRequest;
      const newUser = await this.authService.register(request);

      res.status(StatusCodes.CREATED).json({
        success: true,
        status_code: StatusCodes.CREATED,
        message: 'User berhasil didaftarkan',
        data: newUser
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Melakukan login user.
   * POST /auth/login
   */
  login = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const request: LoginRequest = req.body as LoginRequest;

      // Ambil user_agent dan ip_address dari request headers
      const user_agent = req.get('User-Agent') || undefined;
      const ip_address = req.ip || req.connection.remoteAddress || undefined;

      const result = await this.authService.login(
        request,
        user_agent,
        ip_address
      );

      // Set refresh token as HttpOnly cookie (Secure/Path vary by env)
      if (result.tokens && result.tokens.refresh_token) {
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('refresh_token', result.tokens.refresh_token, {
          httpOnly: true,
          secure: isProd, // in dev (HTTP) must be false or cookie won't be stored
          sameSite: isProd ? 'strict' : 'lax',
          path: isProd ? '/api/auth/refresh' : '/',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });
      }

      // Return only access token in body
      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Login berhasil',
        data: {
          tokens: { access_token: result.tokens.access_token },
          user: result.user
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Melakukan logout user.
   * POST /auth/logout
   */
  logout = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          status_code: StatusCodes.UNAUTHORIZED,
          errors: 'User tidak terautentikasi'
        });
      }

      const result = await this.authService.logout(req.user.user_id.toString());

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refresh access token menggunakan refresh token.
   * POST /auth/refresh
   */
  refreshToken = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { cookies } = req as Request & {
        cookies?: Record<string, string>;
      };
      const refresh_token = cookies?.refresh_token as string | undefined;

      if (!refresh_token) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          status_code: StatusCodes.BAD_REQUEST,
          message: 'Refresh token tidak ditemukan',
          data: null
        });
      }

      const result = await this.authService.refreshToken(refresh_token);

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Token berhasil di-refresh',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Memvalidasi token dan mengembalikan data user yang sedang login.
   * GET /auth/me
   */
  me = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          status_code: StatusCodes.UNAUTHORIZED,
          message: 'User tidak terautentikasi',
          data: null
        });
      }

      const user = await this.authService.validateToken(
        req.user.user_id.toString()
      );

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Data user berhasil diambil',
        data: user
      });
    } catch (error) {
      next(error);
    }
  };
}
