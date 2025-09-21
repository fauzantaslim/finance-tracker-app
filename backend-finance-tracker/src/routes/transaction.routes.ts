import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { deserializeToken } from '../middlewares/auth.middleware';

const router = Router();
const transactionController = new TransactionController();

/**
 * PRIVATE ROUTES - Semua endpoint transaction memerlukan autentikasi
 * Menggunakan middleware auth untuk semua route di bawah ini
 */
router.use(deserializeToken);

/**
 * Routes untuk operasi CRUD transaction (semua private)
 */
router.get('/', transactionController.getTransactions);
router.get('/:transaction_id', transactionController.getTransactionById);
router.post('/', transactionController.createTransaction);
router.put('/:transaction_id', transactionController.updateTransaction);
router.delete('/:transaction_id', transactionController.deleteTransaction);

export default router;
