import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, Category, Currency } from '../../types';
import { PlusCircleIcon, EditIcon, TrashIcon } from '../ui/Icons';
import Dropdown from '../ui/Dropdown';

// --- Modal Component ---
const Modal: React.FC<{ isOpen: boolean, onClose: () => void, children: React.ReactNode, title: string }> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg relative max-h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
                {children}
            </div>
        </div>
    );
};

// --- Transaction Form Component ---
const TransactionForm: React.FC<{
    onSave: (transaction: Omit<Transaction, 'id'>) => void;
    onClose: () => void;
    categories: Category[];
    transactionToEdit: Omit<Transaction, 'id'> | null;
}> = ({ onSave, onClose, categories, transactionToEdit }) => {
    const [type, setType] = useState<TransactionType>(transactionToEdit?.type || TransactionType.EXPENSE);
    const [amount, setAmount] = useState(transactionToEdit?.amount || '');
    const [category, setCategory] = useState(transactionToEdit?.category || '');
    const [date, setDate] = useState(transactionToEdit?.date || new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState(transactionToEdit?.description || '');
    const [isRecurring, setIsRecurring] = useState(transactionToEdit?.isRecurring || false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !category || !date || !description) {
            alert('Please fill all fields');
            return;
        }
        onSave({
            type,
            amount: parseFloat(amount.toString()),
            category,
            date,
            description,
            isRecurring
        });
    };

    const filteredCategories = categories.filter(c => c.type === type);
    const categoryOptions = filteredCategories.map(cat => ({ value: cat.name, label: cat.name }));

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <div className="flex items-center space-x-4 mt-1">
                    <button type="button" onClick={() => { setType(TransactionType.EXPENSE); setCategory(''); }} className={`w-full py-2 rounded-lg ${type === TransactionType.EXPENSE ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>Expense</button>
                    <button type="button" onClick={() => { setType(TransactionType.INCOME); setCategory(''); }} className={`w-full py-2 rounded-lg ${type === TransactionType.INCOME ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Income</button>
                </div>
            </div>
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" required/>
            </div>
             <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <Dropdown
                    options={categoryOptions}
                    value={category}
                    onChange={setCategory}
                    placeholder="Select a category"
                    className="mt-1"
                />
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" required/>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" required/>
            </div>
            <div className="flex items-center">
                 <input type="checkbox" id="isRecurring" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"/>
                 <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900">Recurring Transaction</label>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">{transactionToEdit ? 'Update' : 'Save'} Transaction</button>
            </div>
        </form>
    );
}

// --- Transactions Page Component ---
const TransactionsPage: React.FC<{
    transactions: Transaction[];
    categories: Category[];
    currency: Currency;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
}> = ({ transactions, categories, currency, addTransaction, updateTransaction, deleteTransaction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const searchMatch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
            const typeMatch = filterType === 'all' || t.type === filterType;
            const categoryMatch = filterCategory === 'all' || t.category === filterCategory;
            return searchMatch && typeMatch && categoryMatch;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, searchTerm, filterType, filterCategory]);

    const handleAddClick = () => {
        setTransactionToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (transaction: Transaction) => {
        setTransactionToEdit(transaction);
        setIsModalOpen(true);
    };

    const handleSaveTransaction = (transactionData: Omit<Transaction, 'id'>) => {
        if (transactionToEdit) {
            updateTransaction(transactionToEdit.id, transactionData);
        } else {
            addTransaction(transactionData);
        }
        setIsModalOpen(false);
        setTransactionToEdit(null);
    };
    
    const typeFilterOptions = [
        { value: 'all', label: 'All Types' },
        { value: TransactionType.INCOME, label: 'Income' },
        { value: TransactionType.EXPENSE, label: 'Expense' },
    ];
    
    const categoryFilterOptions = [
        { value: 'all', label: 'All Categories' },
        ...categories.map(c => ({ value: c.name, label: c.name }))
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800">Transactions</h2>
                <button onClick={handleAddClick} className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow transition-colors w-full md:w-auto">
                    <PlusCircleIcon className="h-5 w-5 mr-2"/>
                    <span>Add Transaction</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search descriptions..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                 <Dropdown
                    options={typeFilterOptions}
                    value={filterType}
                    onChange={setFilterType}
                 />
                <Dropdown
                    options={categoryFilterOptions}
                    value={filterCategory}
                    onChange={setFilterCategory}
                 />
            </div>
            
            {/* Transactions Table for Desktop */}
            <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Type</th>
                                <th className="p-4 font-semibold text-gray-600">Description</th>
                                <th className="p-4 font-semibold text-gray-600">Amount</th>
                                <th className="p-4 font-semibold text-gray-600">Category</th>
                                <th className="p-4 font-semibold text-gray-600">Date</th>
                                <th className="p-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(t => (
                                <tr key={t.id} className="border-t border-gray-200 hover:bg-gray-50">
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            t.type === TransactionType.INCOME ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>{t.type}</span>
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">{t.description}</td>
                                    <td className={`p-4 font-semibold ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                                        {currency.symbol}{t.amount.toFixed(2)}
                                    </td>
                                    <td className="p-4 text-gray-600">{t.category}</td>
                                    <td className="p-4 text-gray-600">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <button onClick={() => handleEditClick(t)} className="text-primary-600 hover:text-primary-800 mr-2 p-1"><EditIcon className="h-5 w-5"/></button>
                                        <button onClick={() => deleteTransaction(t.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="h-5 w-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transactions List for Mobile */}
            <div className="md:hidden space-y-4">
                {filteredTransactions.map(t => (
                    <div key={t.id} className="bg-white rounded-xl shadow-md p-4">
                        <div className="flex justify-between items-start">
                             <div>
                                <p className="font-bold text-gray-800">{t.description}</p>
                                <p className="text-sm text-gray-500">{t.category}</p>
                                <p className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className={`font-semibold text-lg ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === TransactionType.INCOME ? '+' : '-'}{currency.symbol}{t.amount.toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end items-center mt-2 border-t pt-2">
                             <span className={`px-2 py-1 text-xs font-semibold rounded-full mr-auto ${
                                t.type === TransactionType.INCOME ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>{t.type}</span>
                            <button onClick={() => handleEditClick(t)} className="text-primary-600 hover:text-primary-800 p-1"><EditIcon className="h-5 w-5"/></button>
                            <button onClick={() => deleteTransaction(t.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="h-5 w-5"/></button>
                        </div>
                    </div>
                ))}
            </div>


            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}>
                <TransactionForm
                    onSave={handleSaveTransaction}
                    onClose={() => setIsModalOpen(false)}
                    categories={categories}
                    transactionToEdit={transactionToEdit}
                />
            </Modal>
        </div>
    );
};

export default TransactionsPage;