import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

/**
 * PRIVATE AUTH ROUTES - Memerlukan autentikasi
 * Middleware deserializeToken akan diterapkan di index.ts
 */
router.post('/logout', authController.logout);
router.get('/me', authController.me);

export default router;
