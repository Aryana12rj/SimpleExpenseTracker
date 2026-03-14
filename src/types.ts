export type Category = 
  | 'Food' 
  | 'Transport' 
  | 'Bills' 
  | 'Health' 
  | 'Education' 
  | 'Entertainment' 
  | 'Groceries' 
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
}

export interface SpendingSummary {
  total: number;
  byCategory: Record<Category, number>;
}
