import { Router } from 'express';
import { TransferController } from '../controllers/transfer.controller';
import { deserializeToken } from '../middlewares/auth.middleware';

const router = Router();
const transferController = new TransferController();

/**
 * PRIVATE ROUTES - Semua endpoint transfer memerlukan autentikasi
 * Menggunakan middleware auth untuk semua route di bawah ini
 */
router.use(deserializeToken);

/**
 * Routes untuk operasi CRUD transfer (semua private)
 */
router.get('/', transferController.getTransfers);
router.get('/:transfer_id', transferController.getTransferById);
router.post('/', transferController.createTransfer);
router.put('/:transfer_id', transferController.updateTransfer);
router.delete('/:transfer_id', transferController.deleteTransfer);

export default router;
