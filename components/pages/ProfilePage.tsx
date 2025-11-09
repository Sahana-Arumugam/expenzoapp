import React, { useState, useEffect, useMemo } from 'react';
import { UserIcon } from '../ui/Icons';
import { Transaction, TransactionType, Currency } from '../../types';

interface ProfilePageProps {
  userEmail: string;
  fullName: string;
  avatar: string;
  updateProfile: (fullName: string, avatar: string) => void;
  createdAt: string;
  transactions: Transaction[];
  currency: Currency;
}

const StatItem: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
);

const ProfilePage: React.FC<ProfilePageProps> = ({ userEmail, fullName, avatar, updateProfile, createdAt, transactions, currency }) => {
  const [name, setName] = useState(fullName);
  const [currentAvatar, setCurrentAvatar] = useState(avatar);
  const [successMessage, setSuccessMessage] = useState('');

  const accountStats = useMemo(() => {
    const totalIncome = transactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);

    const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);
    let mostFrequentCategory = 'N/A';
    if (expenseTransactions.length > 0) {
        const categoryCounts = expenseTransactions.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        mostFrequentCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0];
    }
    
    return {
        memberSince: new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        totalTransactions: transactions.length,
        totalIncome,
        totalExpenses,
        mostFrequentCategory,
    };
  }, [transactions, createdAt]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCurrentAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, currentAvatar);
    setSuccessMessage('Profile updated successfully!');
  };
  
  useEffect(() => {
    if (successMessage) {
        const timer = setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
        return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    setName(fullName);
    setCurrentAvatar(avatar);
  }, [fullName, avatar]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h2>
      
       {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
          <p className="font-bold">Success</p>
          <p>{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Profile Picture</h3>
              <div className="flex justify-center mb-4">
                {currentAvatar ? (
                  <img src={currentAvatar} alt="Avatar" className="w-40 h-40 rounded-full object-cover" />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="w-20 h-20 text-gray-400" />
                  </div>
                )}
              </div>
              <input
                type="file"
                id="avatarUpload"
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatarUpload" className="cursor-pointer px-5 py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors">
                Upload Image
              </label>
            </div>
          </div>

          {/* Right Column: Details & Stats */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">Personal Information</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={userEmail}
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-8">
                 <button
                    type="submit"
                    className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 shadow transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    Save Changes
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Account Statistics</h3>
                <div className="space-y-1">
                    <StatItem label="Member Since" value={accountStats.memberSince} />
                    <StatItem label="Total Transactions" value={accountStats.totalTransactions} />
                    <StatItem label="Lifetime Income" value={`${currency.symbol}${accountStats.totalIncome.toFixed(2)}`} />
                    <StatItem label="Lifetime Expenses" value={`${currency.symbol}${accountStats.totalExpenses.toFixed(2)}`} />
                    <StatItem label="Top Expense Category" value={accountStats.mostFrequentCategory} />
                </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
