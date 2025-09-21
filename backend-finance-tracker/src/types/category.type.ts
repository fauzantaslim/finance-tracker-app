import { Category } from '../models/category.model';

export type CategoryIdRequest = { category_id: string };

export type CreateCategoryRequest = Omit<Category, 'category_id'>;
export type UpdateCategoryRequest = CategoryIdRequest &
  Partial<Omit<Category, 'category_id'>>;
export type GetCategoryRequest = CategoryIdRequest;
export type DeleteCategoryRequest = CategoryIdRequest;
export type CategoryResponse = Category;

export function toCategoryResponse(category: Category): CategoryResponse {
  return { ...category };
}
