import { Category, Transaction, TransactionType, Budget, Currency, UserCredentials, UserData } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Salary', type: TransactionType.INCOME },
  { id: 'cat-2', name: 'Freelance', type: TransactionType.INCOME },
  { id: 'cat-3', name: 'Food', type: TransactionType.EXPENSE },
  { id: 'cat-4', name: 'Transport', type: TransactionType.EXPENSE },
  { id: 'cat-5', name: 'Bills', type: TransactionType.EXPENSE },
  { id: 'cat-6', name: 'Entertainment', type: TransactionType.EXPENSE },
  { id: 'cat-7', name: 'Health', type: TransactionType.EXPENSE },
  { id: 'cat-8', name: 'Shopping', type: TransactionType.EXPENSE },
];

const user1Transactions: Transaction[] = [
    { id: 't-1', type: TransactionType.INCOME, amount: 4500, category: 'Salary', date: '2024-05-01', description: 'Monthly Salary', isRecurring: true },
    { id: 't-2', type: TransactionType.EXPENSE, amount: 1200, category: 'Bills', date: '2024-05-02', description: 'Rent', isRecurring: true },
    { id: 't-3', type: TransactionType.EXPENSE, amount: 75.50, category: 'Food', date: '2024-05-03', description: 'Groceries', isRecurring: false },
    { id: 't-4', type: TransactionType.EXPENSE, amount: 45, category: 'Transport', date: '2024-05-04', description: 'Gasoline', isRecurring: false },
    { id: 't-5', type: TransactionType.EXPENSE, amount: 120, category: 'Entertainment', date: '2024-05-05', description: 'Concert Tickets', isRecurring: false },
    { id: 't-6', type: TransactionType.INCOME, amount: 350, category: 'Freelance', date: '2024-05-08', description: 'Web design project', isRecurring: false },
    { id: 't-7', type: TransactionType.EXPENSE, amount: 55, category: 'Health', date: '2024-05-09', description: 'Pharmacy', isRecurring: false },
    { id: 't-8', type: TransactionType.EXPENSE, amount: 250, category: 'Shopping', date: '2024-05-11', description: 'New clothes', isRecurring: false },
];

const user2Transactions: Transaction[] = [
    { id: 't-user2-1', type: TransactionType.INCOME, amount: 800, category: 'Freelance', date: '2024-05-05', description: 'Logo Design', isRecurring: false },
    { id: 't-user2-2', type: TransactionType.EXPENSE, amount: 50, category: 'Food', date: '2024-05-06', description: 'Lunch with client', isRecurring: false },
    { id: 't-user2-3', type: TransactionType.EXPENSE, amount: 25, category: 'Transport', date: '2024-05-07', description: 'Train ticket', isRecurring: false },
];

export const INITIAL_BUDGETS: Budget[] = [
    { id: 'b-1', category: 'Food', amount: 500, period: 'monthly' },
    { id: 'b-2', category: 'Entertainment', amount: 200, period: 'monthly' },
    { id: 'b-3', category: 'Shopping', amount: 300, period: 'monthly' },
];

export const CURRENCIES: Currency[] = [
    { symbol: '$', code: 'USD' },
    { symbol: '€', code: 'EUR' },
    { symbol: '£', code: 'GBP' },
    { symbol: '¥', code: 'JPY' },
    { symbol: '₹', code: 'INR' },
];

export const INITIAL_USERS: UserCredentials[] = [
    { email: 'user@example.com', password: 'password123' },
    { email: 'test@expenzo.com', password: 'testpassword' },
];

export const INITIAL_ALL_USERS_DATA: { [email: string]: UserData } = {
    'user@example.com': {
        transactions: user1Transactions,
        categories: INITIAL_CATEGORIES,
        budgets: INITIAL_BUDGETS,
        currency: CURRENCIES[0], // USD
        fullName: 'Demo User',
        avatar: '',
        createdAt: '2024-01-15T14:30:00Z',
    },
    'test@expenzo.com': {
        transactions: user2Transactions,
        categories: [
            { id: 'cat-1', name: 'Freelance', type: TransactionType.INCOME },
            { id: 'cat-2', name: 'Consulting', type: TransactionType.INCOME },
            { id: 'cat-3', name: 'Food', type: TransactionType.EXPENSE },
            { id: 'cat-4', name: 'Transport', type: TransactionType.EXPENSE },
            { id: 'cat-5', name: 'Software', type: TransactionType.EXPENSE },
        ],
        budgets: [
            { id: 'b-1', category: 'Food', amount: 300, period: 'monthly' }
        ],
        currency: CURRENCIES[1], // EUR
        fullName: 'Test User',
        avatar: '',
        createdAt: '2024-02-20T10:00:00Z',
    }
};

export const NEW_USER_DATA_TEMPLATE = {
    transactions: [],
    categories: INITIAL_CATEGORIES,
    budgets: [],
    currency: CURRENCIES[0],
    avatar: '',
};
