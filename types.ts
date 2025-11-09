// FIX: Removed circular import of UserCredentials and defined the interface.
export interface UserCredentials {
  email: string;
  password: string;
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  description: string;
  isRecurring: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}

export interface Budget {
  id:string;
  category: string;
  amount: number;
  period: 'monthly'; // For simplicity, only monthly budgets
}

export interface Currency {
  symbol: string;
  code: string;
}

export interface UserData {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  currency: Currency;
  fullName: string;
  avatar: string; // Base64 string for the image
  createdAt: string; // ISO String for user creation date
}

export enum Page {
  DASHBOARD = 'dashboard',
  TRANSACTIONS = 'transactions',
  ANALYTICS = 'analytics',
  BUDGETS = 'budgets',
  PROFILE = 'profile',
  SETTINGS = 'settings',
}