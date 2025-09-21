import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { deserializeToken } from '../middlewares/auth.middleware';

const router = Router();
const dashboardController = new DashboardController();

/**
 * PRIVATE ROUTES - Semua endpoint dashboard memerlukan autentikasi
 * Menggunakan middleware auth untuk semua route di bawah ini
 */
router.use(deserializeToken);

/**
 * Routes untuk dashboard data
 */
// GET /dashboard - Get complete dashboard data (summary, transactions)
router.get('/', dashboardController.getDashboard);

// GET /dashboard/categories - Get only categories summary
router.get('/categories', dashboardController.getCategories);

// GET /dashboard/transactions - Get only transactions list
router.get('/transactions', dashboardController.getTransactions);

export default router;
