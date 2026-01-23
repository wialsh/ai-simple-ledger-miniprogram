export interface CategoriesSpend {
  displayName: string;
  name: string;
  color: string;
  amount: number;
}

export interface TrendData {
  day: string;
  amount: number;
}

export interface BudgetData {
  id: number;
  displayName: string;
  income: number;
  expense: number;
  balance: number;
}
