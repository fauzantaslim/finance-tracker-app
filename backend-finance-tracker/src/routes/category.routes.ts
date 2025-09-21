import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { deserializeToken } from '../middlewares/auth.middleware';

const router = Router();
const categoryController = new CategoryController();

/**
 * PRIVATE ROUTES - Semua endpoint category memerlukan autentikasi
 * Menggunakan middleware auth untuk semua route di bawah ini
 */
router.use(deserializeToken);

/**
 * Routes untuk operasi CRUD category (semua private)
 */
router.get('/', categoryController.getCategories);
router.get('/:category_id', categoryController.getCategoryById);
router.post('/', categoryController.createCategory);
router.put('/:category_id', categoryController.updateCategory);
router.delete('/:category_id', categoryController.deleteCategory);

export default router;
