import { Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { UserRequest } from '../types/request.type';
import { PaginationParams } from '../types/pagination.type';
import { StatusCodes } from 'http-status-codes';
import {
  CreateCategoryRequest,
  DeleteCategoryRequest,
  GetCategoryRequest,
  UpdateCategoryRequest
} from '../types/category.type';

/**
 * Controller untuk menangani request terkait category.
 */
export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  /**
   * Mengambil daftar category dengan pagination.
   * GET /categories
   */
  getCategories = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Validasi query parameters
      const paginationParams: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        sort_by: req.query.sort_by as string,
        sort_order: (req.query.sort_order as 'asc' | 'desc') || 'desc'
      };

      // Gunakan user_id dari token yang sudah di-authenticate
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          status_code: StatusCodes.UNAUTHORIZED,
          message: 'User tidak terautentikasi'
        });
      }

      const result = await this.categoryService.getCategoriesByUserId(
        userId,
        paginationParams
      );

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Daftar category berhasil diambil',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mengambil detail category berdasarkan ID.
   * GET /categories/:category_id
   */
  getCategoryById = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          status_code: StatusCodes.UNAUTHORIZED,
          message: 'User tidak terautentikasi'
        });
      }

      const request: GetCategoryRequest = {
        category_id: req.params.category_id
      };

      const category = await this.categoryService.getCategoryByIdAndUserId(
        request,
        userId
      );

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Detail category berhasil diambil',
        data: category
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Membuat category baru.
   * POST /categories
   */
  createCategory = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          status_code: StatusCodes.UNAUTHORIZED,
          message: 'User tidak terautentikasi'
        });
      }

      const request: CreateCategoryRequest = {
        ...req.body,
        user_id: userId // Gunakan user_id dari token
      };
      const newCategory = await this.categoryService.createCategory(request);

      res.status(StatusCodes.CREATED).json({
        success: true,
        status_code: StatusCodes.CREATED,
        message: 'Category berhasil dibuat',
        data: newCategory
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Memperbarui data category.
   * PUT /categories/:category_id
   */
  updateCategory = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          status_code: StatusCodes.UNAUTHORIZED,
          message: 'User tidak terautentikasi'
        });
      }

      const request: UpdateCategoryRequest = {
        ...req.body,
        category_id: req.params.category_id,
        user_id: userId // Gunakan user_id dari token
      };
      const updatedCategory = await this.categoryService.updateCategoryByUserId(
        request,
        userId
      );

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Category berhasil diperbarui',
        data: updatedCategory
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Menghapus category.
   * DELETE /categories/:category_id
   */
  deleteCategory = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          status_code: StatusCodes.UNAUTHORIZED,
          message: 'User tidak terautentikasi'
        });
      }

      const request: DeleteCategoryRequest = {
        category_id: req.params.category_id
      };
      await this.categoryService.deleteCategoryByUserId(request, userId);

      res.status(StatusCodes.OK).json({
        success: true,
        status_code: StatusCodes.OK,
        message: 'Category berhasil dihapus'
      });
    } catch (error) {
      next(error);
    }
  };
}
