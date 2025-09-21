// models/category.model.ts
export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export interface Category {
  category_id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  user_id: string;
}
