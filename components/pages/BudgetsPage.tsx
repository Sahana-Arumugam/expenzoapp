import React, { useState, useMemo } from 'react';
import { Budget, Category, Transaction, TransactionType, Currency } from '../../types';
import { PlusCircleIcon, EditIcon, TrashIcon } from '../ui/Icons';
import Dropdown from '../ui/Dropdown';

const BudgetCard: React.FC<{
    budget: Budget;
    spentAmount: number;
    currency: Currency;
    onEdit: (budget: Budget) => void;
    onDelete: (id: string) => void;
}> = ({ budget, spentAmount, currency, onEdit, onDelete }) => {
    const { id, category, amount } = budget;
    const percentage = Math.min((spentAmount / amount) * 100, 100);
    const progressBarColor = percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <div className="bg-white p-6 rounded-xl shadow-md relative group">
             <div className="absolute top-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(budget)} className="p-1 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100">
                    <EditIcon className="h-5 w-5" />
                </button>
                <button onClick={() => onDelete(id)} className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100">
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-lg text-gray-800">{category}</h4>
                <span className="text-sm font-medium text-gray-500">
                    {currency.symbol}{spentAmount.toFixed(2)} / {currency.symbol}{amount.toFixed(2)}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={progressBarColor + " h-2.5 rounded-full"} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const BudgetsPage: React.FC<{
    budgets: Budget[];
    transactions: Transaction[];
    categories: Category[];
    currency: Currency;
    addBudget: (budget: Omit<Budget, 'id'>) => void;
    updateBudget: (id: string, budget: Omit<Budget, 'id'>) => void;
    deleteBudget: (id: string) => void;
}> = ({ budgets, transactions, categories, currency, addBudget, updateBudget, deleteBudget }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    
    const expenseCategories = categories.filter(c => c.type === TransactionType.EXPENSE);
    
    const categoryOptions = useMemo(() => {
        return expenseCategories
            .filter(cat => {
                const hasBudget = budgets.some(b => b.category === cat.name);
                if (budgetToEdit && budgetToEdit.category === cat.name) {
                    return true;
                }
                return !hasBudget;
            })
            .map(cat => ({ value: cat.name, label: cat.name }));
    }, [budgets, expenseCategories, budgetToEdit]);


    const spentData = useMemo(() => {
        const spentMap = new Map<string, number>();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        transactions.forEach(t => {
            const transactionDate = new Date(t.date);
            if (
                t.type === TransactionType.EXPENSE &&
                transactionDate.getMonth() === currentMonth &&
                transactionDate.getFullYear() === currentYear
            ) {
                spentMap.set(t.category, (spentMap.get(t.category) || 0) + t.amount);
            }
        });
        return spentMap;
    }, [transactions]);

    const handleOpenAddModal = () => {
        setBudgetToEdit(null);
        setCategory('');
        setAmount('');
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (budget: Budget) => {
        setBudgetToEdit(budget);
        setCategory(budget.category);
        setAmount(String(budget.amount));
        setIsModalOpen(true);
    };
    
    const handleDeleteBudget = (id: string) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            deleteBudget(id);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setBudgetToEdit(null);
    };

    const handleSaveBudget = (e: React.FormEvent) => {
        e.preventDefault();
        if (!category || !amount) {
            alert('Please fill all fields');
            return;
        }

        const budgetData = { category, amount: parseFloat(amount), period: 'monthly' as const };
        if (budgetToEdit) {
            updateBudget(budgetToEdit.id, budgetData);
        } else {
            addBudget(budgetData);
        }
        handleCloseModal();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Budgets</h2>
                <button onClick={handleOpenAddModal} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow transition-colors">
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Set New Budget
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map(budget => (
                    <BudgetCard
                        key={budget.id}
                        budget={budget}
                        spentAmount={spentData.get(budget.category) || 0}
                        currency={currency}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDeleteBudget}
                    />
                ))}
            </div>
            
            {/* Add/Edit Budget Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={handleCloseModal}>
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">{budgetToEdit ? 'Edit Budget' : 'Set a New Budget'}</h3>
                        <form onSubmit={handleSaveBudget} className="space-y-4">
                             <div>
                                <label htmlFor="budgetCategory" className="block text-sm font-medium text-gray-700">Category</label>
                                <Dropdown
                                    options={categoryOptions}
                                    value={category}
                                    onChange={setCategory}
                                    placeholder="Select a category"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label htmlFor="budgetAmount" className="block text-sm font-medium text-gray-700">Budget Amount</label>
                                <input type="number" id="budgetAmount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="e.g., 500" required/>
                            </div>
                            <div className="flex justify-end pt-4 space-x-2">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">{budgetToEdit ? 'Update Budget' : 'Set Budget'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BudgetsPage;