import { Category } from '../models/category.model';
import { PaginationParams, PaginationResponse } from '../types/pagination.type';
import { CategoryResponse, toCategoryResponse } from '../types/category.type';
import db from '../configs/database';
import { nanoid } from 'nanoid';

/**
 * Repository untuk operasi database terkait category.
 */
export class CategoryRepository {
  private tableName = 'categories';

  /**
   * Mengambil semua category dengan pagination dan search berdasarkan user_id.
   */
  async findAllByUserId(
    userId: string,
    params: PaginationParams
  ): Promise<PaginationResponse<CategoryResponse>> {
    const {
      page,
      limit,
      search,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = params;
    const offset = (page - 1) * limit;

    // Query builder untuk data dengan filter user_id
    let query = db(this.tableName).select('*').where('user_id', userId);

    // Filter search jika ada
    if (search) {
      query = query.where(function () {
        this.where('name', 'ilike', `%${search}%`);
      });
    }

    // Sorting
    query = query.orderBy(sort_by, sort_order);

    // Pagination
    const data = await query.limit(limit).offset(offset);

    // Query untuk total count dengan filter user_id
    let countQuery = db(this.tableName).where('user_id', userId);
    if (search) {
      countQuery = countQuery.where(function () {
        this.where('name', 'ilike', `%${search}%`);
      });
    }

    const [{ count }] = await countQuery.count('* as count');
    const totalItems = parseInt(count as string);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: data.map(toCategoryResponse),
      pagination: {
        total_items: totalItems,
        total_pages: totalPages,
        current_page: page,
        limit,
        has_next: page < totalPages,
        has_prev: page > 1
      }
    };
  }

  /**
   * Mengambil category berdasarkan ID dan user_id.
   */
  async findByIdAndUserId(
    categoryId: string,
    userId: string
  ): Promise<CategoryResponse | null> {
    const category = await db(this.tableName)
      .where('category_id', categoryId)
      .where('user_id', userId)
      .first();

    return category ? toCategoryResponse(category) : null;
  }

  /**
   * Membuat category baru.
   */
  async create(
    categoryData: Omit<Category, 'category_id'>
  ): Promise<CategoryResponse | null> {
    // Generate category_id menggunakan nanoid
    const categoryId = nanoid();

    await db(this.tableName).insert({
      ...categoryData,
      category_id: categoryId,
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    });

    // Ambil category yang baru dibuat
    const category = await db(this.tableName)
      .where('category_id', categoryId)
      .first();

    return category ? toCategoryResponse(category) : null;
  }

  /**
   * Memperbarui data category.
   */
  async update(
    categoryId: string,
    categoryData: Partial<Omit<Category, 'category_id'>>
  ): Promise<CategoryResponse | null> {
    const updatedRows = await db(this.tableName)
      .where('category_id', categoryId)
      .update({
        ...categoryData,
        updated_at: db.fn.now()
      });

    if (updatedRows === 0) {
      return null;
    }

    // Ambil category yang sudah diupdate
    const category = await db(this.tableName)
      .where('category_id', categoryId)
      .first();

    return category ? toCategoryResponse(category) : null;
  }

  /**
   * Menghapus category berdasarkan ID.
   */
  async delete(categoryId: string): Promise<boolean> {
    const deletedRows = await db(this.tableName)
      .where('category_id', categoryId)
      .del();

    return deletedRows > 0;
  }

  /**
   * Mengecek apakah nama category sudah digunakan untuk user tertentu.
   */
  async isNameExists(
    name: string,
    userId: string,
    excludeCategoryId?: string
  ): Promise<boolean> {
    let query = db(this.tableName).where('name', name).where('user_id', userId);

    if (excludeCategoryId) {
      query = query.whereNot('category_id', excludeCategoryId);
    }

    const category = await query.first();
    return !!category;
  }

  /**
   * Mengecek apakah user ada.
   */
  async isUserExists(userId: string): Promise<boolean> {
    const user = await db('users').where('user_id', userId).first();
    return !!user;
  }
}
