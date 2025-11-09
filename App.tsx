import React, { useState, useEffect } from 'react';
import { Page, Transaction, Category, Budget, Currency, UserCredentials, UserData, TransactionType } from './types';
import { INITIAL_USERS, INITIAL_ALL_USERS_DATA, NEW_USER_DATA_TEMPLATE, INITIAL_CATEGORIES } from './constants';
import Sidebar from './components/layout/Sidebar';
import AuthPage from './components/pages/AuthPage';
import DashboardPage from './components/pages/DashboardPage';
import TransactionsPage from './components/pages/TransactionsPage';
import BudgetsPage from './components/pages/BudgetsPage';
import SettingsPage from './components/pages/SettingsPage';
import ProfilePage from './components/pages/ProfilePage';
import { AnalyticsIcon, MenuIcon } from './components/ui/Icons';


const MobileNav: React.FC<{ onMenuClick: () => void; currentPage: string; }> = ({ onMenuClick, currentPage }) => (
    <div className="md:hidden bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onMenuClick} className="text-gray-600">
            <MenuIcon className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 capitalize">{currentPage}</h1>
        <div className="w-6"></div> {/* Spacer */}
    </div>
);


const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<string | null>(null);

    // Main state for all user credentials
    const [users, setUsers] = useState<UserCredentials[]>(INITIAL_USERS);
    
    // Main state for all user-specific data (transactions, budgets, etc.)
    const [allUsersData, setAllUsersData] = useState<{ [email: string]: UserData }>(() => {
        try {
            const storedData = localStorage.getItem('allUsersData');
            return storedData ? JSON.parse(storedData) : INITIAL_ALL_USERS_DATA;
        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
            return INITIAL_ALL_USERS_DATA;
        }
    });

    // Persist all user data to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('allUsersData', JSON.stringify(allUsersData));
        } catch (error) {
            console.error("Failed to save user data to localStorage", error);
        }
    }, [allUsersData]);

    // Check for a remembered user on initial load
    useEffect(() => {
        const rememberedUserEmail = localStorage.getItem('rememberedUser');
        if (rememberedUserEmail && allUsersData[rememberedUserEmail]) {
            setCurrentUser(rememberedUserEmail);
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []); // Removed allUsersData dependency to run only once on mount

    const modifyCurrentUserData = (updater: (userData: UserData) => UserData) => {
        if (!currentUser) return;
        setAllUsersData(prev => ({
            ...prev,
            [currentUser]: updater(prev[currentUser]),
        }));
    };

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction = { ...transaction, id: `t-${Date.now()}` };
        modifyCurrentUserData(data => ({
            ...data,
            transactions: [newTransaction, ...data.transactions]
        }));
    };

    const updateTransaction = (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
        modifyCurrentUserData(data => ({
            ...data,
            transactions: data.transactions.map(t => t.id === id ? { ...updatedTransaction, id } : t)
        }));
    };

    const deleteTransaction = (id: string) => {
         modifyCurrentUserData(data => ({
            ...data,
            transactions: data.transactions.filter(t => t.id !== id)
        }));
    };
    
    const addBudget = (budget: Omit<Budget, 'id'>) => {
        const newBudget = { ...budget, id: `b-${Date.now()}`};
        modifyCurrentUserData(data => ({
            ...data,
            budgets: [...data.budgets, newBudget]
        }));
    };

    const updateBudget = (id: string, updatedBudget: Omit<Budget, 'id'>) => {
        modifyCurrentUserData(data => ({
            ...data,
            budgets: data.budgets.map(b => b.id === id ? { ...updatedBudget, id } : b)
        }));
    };

    const deleteBudget = (id: string) => {
        modifyCurrentUserData(data => ({
            ...data,
            budgets: data.budgets.filter(b => b.id !== id)
        }));
    };
    
    const setCurrency = (newCurrency: Currency) => {
        modifyCurrentUserData(data => ({
            ...data,
            currency: newCurrency
        }));
    };

    const updateProfile = (fullName: string, avatar: string) => {
        modifyCurrentUserData(data => ({
            ...data,
            fullName,
            avatar,
        }));
    };

    const addUser = (newUser: UserCredentials) => {
        setUsers(prev => [...prev, newUser]);

        const deriveNameFromEmail = (email: string): string => {
            const namePart = email.split('@')[0];
            return namePart
                .replace(/[._-]/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        };

        // Initialize data for the new user
        if (!allUsersData[newUser.email]) {
            setAllUsersData(prev => ({
                ...prev,
                [newUser.email]: { 
                    ...NEW_USER_DATA_TEMPLATE, 
                    categories: [...INITIAL_CATEGORIES], // Deep copy to prevent mutation across users
                    fullName: deriveNameFromEmail(newUser.email),
                    createdAt: new Date().toISOString(),
                }
            }));
        }
    };
    
    const handleLogin = (email: string) => {
        setCurrentUser(email);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('rememberedUser');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setCurrentPage(Page.DASHBOARD);
    };
    
    const currentUserData = currentUser ? allUsersData[currentUser] : null;

    const renderPage = () => {
        if (!currentUserData) return null; // Should not happen if authenticated
        
        switch (currentPage) {
            case Page.DASHBOARD:
                return <DashboardPage transactions={currentUserData.transactions} currency={currentUserData.currency} addTransaction={addTransaction} />;
            case Page.TRANSACTIONS:
                return <TransactionsPage 
                            transactions={currentUserData.transactions} 
                            categories={currentUserData.categories}
                            currency={currentUserData.currency} 
                            addTransaction={addTransaction} 
                            updateTransaction={updateTransaction} 
                            deleteTransaction={deleteTransaction} 
                        />;
            case Page.BUDGETS:
                return <BudgetsPage 
                            budgets={currentUserData.budgets} 
                            transactions={currentUserData.transactions} 
                            categories={currentUserData.categories}
                            currency={currentUserData.currency}
                            addBudget={addBudget}
                            updateBudget={updateBudget}
                            deleteBudget={deleteBudget}
                        />;
            case Page.PROFILE:
                return <ProfilePage
                            userEmail={currentUser!}
                            fullName={currentUserData.fullName}
                            avatar={currentUserData.avatar}
                            updateProfile={updateProfile}
                            createdAt={currentUserData.createdAt}
                            transactions={currentUserData.transactions}
                            currency={currentUserData.currency}
                        />;
            case Page.SETTINGS:
                return <SettingsPage 
                            currentCurrency={currentUserData.currency} 
                            setCurrency={setCurrency} 
                            transactions={currentUserData.transactions}
                            userEmail={currentUser!}
                        />;
            case Page.ANALYTICS: // Placeholder for analytics, re-using dashboard for now
                 return <DashboardPage transactions={currentUserData.transactions} currency={currentUserData.currency} addTransaction={addTransaction} />;
            default:
                return <DashboardPage transactions={currentUserData.transactions} currency={currentUserData.currency} addTransaction={addTransaction} />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
                <AnalyticsIcon className="h-12 w-12 text-primary-600 animate-pulse" />
                <p className="text-gray-600 mt-4">Loading expenzo...</p>
            </div>
        );
    }

    if (!isAuthenticated || !currentUserData) {
        return <AuthPage onLoginSuccess={handleLogin} users={users} addUser={addUser} />;
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage} 
                logout={handleLogout} 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)}
                userName={currentUserData.fullName}
                userAvatar={currentUserData.avatar}
                userEmail={currentUser!}
            />
            <div className="flex-1 flex flex-col md:ml-64">
                 <MobileNav onMenuClick={() => setIsSidebarOpen(true)} currentPage={currentPage} />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default App;
