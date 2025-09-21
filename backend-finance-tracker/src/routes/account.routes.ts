import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';
import { deserializeToken } from '../middlewares/auth.middleware';

const router = Router();
const accountController = new AccountController();

/**
 * PRIVATE ROUTES - Semua endpoint account memerlukan autentikasi
 * Menggunakan middleware auth untuk semua route di bawah ini
 */
router.use(deserializeToken);

/**
 * Routes untuk operasi CRUD account (semua private)
 */
router.get('/', accountController.getAccounts);
router.get('/:account_id', accountController.getAccountById);
router.post('/', accountController.createAccount);
router.put('/:account_id', accountController.updateAccount);
router.delete('/:account_id', accountController.deleteAccount);

export default router;
