import { CategoryRepository } from '../repositories/category.repository';
import { Category, CategoryType } from '../models/category.model';
import { PaginationParams, PaginationResponse } from '../types/pagination.type';
import {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  GetCategoryRequest,
  DeleteCategoryRequest
} from '../types/category.type';
import { ResponseError } from '../utils/responseError';
import { StatusCodes } from 'http-status-codes';
import { CategoryValidation } from '../validations/category.validation';
import { Validation } from '../validations/validatiom';

/**
 * Service untuk operasi bisnis terkait category.
 */
export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  /**
   * Mengambil daftar category dengan pagination berdasarkan user_id.
   */
  async getCategoriesByUserId(
    userId: string,
    params: PaginationParams
  ): Promise<PaginationResponse<CategoryResponse>> {
    // Validasi parameter pagination
    if (params.page < 1) {
      throw new ResponseError(
        StatusCodes.BAD_REQUEST,
        'Halaman harus lebih dari 0'
      );
    }

    if (params.limit < 1 || params.limit > 100) {
      throw new ResponseError(
        StatusCodes.BAD_REQUEST,
        'Limit harus antara 1-100'
      );
    }

    return await this.categoryRepository.findAllByUserId(userId, params);
  }

  /**
   * Mengambil detail category berdasarkan ID dan user_id.
   */
  async getCategoryByIdAndUserId(
    request: GetCategoryRequest,
    userId: string
  ): Promise<CategoryResponse> {
    // Validasi parameter menggunakan Validation utility
    const validatedParams = Validation.validate(
      CategoryValidation.GET,
      request
    );

    const category = await this.categoryRepository.findByIdAndUserId(
      validatedParams.category_id,
      userId
    );

    if (!category) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Category tidak ditemukan'
      );
    }

    return category;
  }

  /**
   * Membuat category baru.
   */
  async createCategory(
    request: CreateCategoryRequest
  ): Promise<CategoryResponse> {
    // Validasi data menggunakan Validation utility
    const validatedData = Validation.validate(
      CategoryValidation.CREATE,
      request
    );

    // Cek apakah user ada
    const userExists = await this.categoryRepository.isUserExists(
      validatedData.user_id
    );
    if (!userExists) {
      throw new ResponseError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
    }

    // Cek apakah nama category sudah ada untuk user yang sama
    const nameExists = await this.categoryRepository.isNameExists(
      validatedData.name,
      validatedData.user_id
    );
    if (nameExists) {
      throw new ResponseError(
        StatusCodes.CONFLICT,
        'Nama category sudah digunakan untuk user ini'
      );
    }

    const newCategory = await this.categoryRepository.create({
      ...validatedData,
      type: validatedData.type as CategoryType
    });
    if (!newCategory) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal membuat category'
      );
    }

    return newCategory;
  }

  /**
   * Memperbarui data category.
   */
  async updateCategory(
    request: UpdateCategoryRequest
  ): Promise<CategoryResponse> {
    // Validasi parameter dan data menggunakan Validation utility
    const validatedData = Validation.validate(
      CategoryValidation.UPDATE,
      request
    );

    // Cek category ada atau tidak
    const existingCategory = await this.categoryRepository.findByIdAndUserId(
      validatedData.category_id,
      validatedData.user_id || ''
    );
    if (!existingCategory) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Category tidak ditemukan'
      );
    }

    // Validasi nama jika diupdate
    if (validatedData.name && validatedData.name !== existingCategory.name) {
      const nameExists = await this.categoryRepository.isNameExists(
        validatedData.name,
        existingCategory.user_id,
        validatedData.category_id
      );
      if (nameExists) {
        throw new ResponseError(
          StatusCodes.CONFLICT,
          'Nama category sudah digunakan untuk user ini'
        );
      }
    }

    // Validasi user_id jika diupdate
    if (
      validatedData.user_id &&
      validatedData.user_id !== existingCategory.user_id
    ) {
      const userExists = await this.categoryRepository.isUserExists(
        validatedData.user_id
      );
      if (!userExists) {
        throw new ResponseError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
      }
    }

    // Hapus category_id dari update data karena tidak boleh diupdate
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { category_id: _category_id, ...dataToUpdate } =
      validatedData as Partial<Omit<Category, 'category_id'>> & {
        category_id?: string;
      };

    const updatedCategory = await this.categoryRepository.update(
      validatedData.category_id,
      dataToUpdate
    );
    if (!updatedCategory) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal memperbarui category'
      );
    }

    return updatedCategory;
  }

  /**
   * Memperbarui data category berdasarkan user_id.
   */
  async updateCategoryByUserId(
    request: UpdateCategoryRequest,
    userId: string
  ): Promise<CategoryResponse> {
    // Validasi parameter dan data menggunakan Validation utility
    const validatedData = Validation.validate(
      CategoryValidation.UPDATE,
      request
    );

    // Cek category ada atau tidak dan milik user yang benar
    const existingCategory = await this.categoryRepository.findByIdAndUserId(
      validatedData.category_id,
      userId
    );
    if (!existingCategory) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Category tidak ditemukan'
      );
    }

    // Validasi nama jika diupdate
    if (validatedData.name && validatedData.name !== existingCategory.name) {
      const nameExists = await this.categoryRepository.isNameExists(
        validatedData.name,
        userId,
        validatedData.category_id
      );
      if (nameExists) {
        throw new ResponseError(
          StatusCodes.CONFLICT,
          'Nama category sudah digunakan untuk user ini'
        );
      }
    }

    // Hapus category_id dan user_id dari update data karena tidak boleh diupdate
    const dataToUpdate: Partial<Omit<Category, 'category_id'>> = {
      name: validatedData.name,
      type: validatedData.type as CategoryType | undefined,
      icon: validatedData.icon,
      color: validatedData.color
    };

    const updatedCategory = await this.categoryRepository.update(
      validatedData.category_id,
      dataToUpdate
    );
    if (!updatedCategory) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal memperbarui category'
      );
    }

    return updatedCategory;
  }

  /**
   * Menghapus category.
   */
  async deleteCategory(request: DeleteCategoryRequest): Promise<void> {
    // Validasi parameter menggunakan Validation utility
    const validatedParams = Validation.validate(
      CategoryValidation.DELETE,
      request
    );

    const categoryExists = await this.categoryRepository.findByIdAndUserId(
      validatedParams.category_id,
      '' // Tidak ada user_id untuk method deleteCategory yang lama
    );
    if (!categoryExists) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Category tidak ditemukan'
      );
    }

    const deleted = await this.categoryRepository.delete(
      validatedParams.category_id
    );
    if (!deleted) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal menghapus category'
      );
    }
  }

  /**
   * Menghapus category berdasarkan user_id.
   */
  async deleteCategoryByUserId(
    request: DeleteCategoryRequest,
    userId: string
  ): Promise<void> {
    // Validasi parameter menggunakan Validation utility
    const validatedParams = Validation.validate(
      CategoryValidation.DELETE,
      request
    );

    const categoryExists = await this.categoryRepository.findByIdAndUserId(
      validatedParams.category_id,
      userId
    );
    if (!categoryExists) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Category tidak ditemukan'
      );
    }

    const deleted = await this.categoryRepository.delete(
      validatedParams.category_id
    );
    if (!deleted) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Gagal menghapus category'
      );
    }
  }
}
