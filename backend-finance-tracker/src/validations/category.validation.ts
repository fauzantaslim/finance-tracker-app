import { z } from 'zod';
import { CategoryType } from '../models/category.model';

export class CategoryValidation {
  private static readonly baseSchemas = {
    name: z.string().min(1).max(100),
    type: z.enum(Object.values(CategoryType) as [string, ...string[]], {
      message: 'Tipe category tidak valid'
    }),
    icon: z.string().min(1).max(100),
    color: z.string().min(1).max(7),
    categoryId: z.string().min(1).max(21),
    userId: z.string().min(1).max(21)
  };

  static readonly CREATE = z.object({
    name: this.baseSchemas.name,
    type: this.baseSchemas.type,
    icon: this.baseSchemas.icon,
    color: this.baseSchemas.color,
    user_id: this.baseSchemas.userId
  });

  static readonly UPDATE = z.object({
    category_id: this.baseSchemas.categoryId,
    name: this.baseSchemas.name.optional(),
    type: this.baseSchemas.type.optional(),
    icon: this.baseSchemas.icon.optional(),
    color: this.baseSchemas.color.optional(),
    user_id: this.baseSchemas.userId.optional()
  });

  static readonly GET = z.object({
    category_id: this.baseSchemas.categoryId
  });

  static readonly DELETE = z.object({
    category_id: this.baseSchemas.categoryId
  });
}
