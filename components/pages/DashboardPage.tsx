
import React, { useMemo } from 'react';
import { Transaction, TransactionType, Currency } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';

interface DashboardPageProps {
  transactions: Transaction[];
  currency: Currency;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const SummaryCard: React.FC<{ title: string; amount: number; currencySymbol: string; color: string }> = ({ title, amount, currencySymbol, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex-1">
    <h3 className="text-gray-500 text-lg">{title}</h3>
    <p className={`text-3xl font-bold ${color}`}>
      {currencySymbol}{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </p>
  </div>
);

const CustomTooltip = ({ active, payload, label, currencySymbol }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                <p className="font-semibold text-gray-800 mb-2">{label}</p>
                {payload.map((pld: any) => (
                    <div key={pld.dataKey} className="flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: pld.color || pld.fill }}></div>
                        <span className="text-gray-600 mr-2">{pld.name}:</span>
                        <span className="font-medium text-gray-800">{currencySymbol}{pld.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const DashboardPage: React.FC<DashboardPageProps> = ({ transactions, currency }) => {
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome: income, totalExpenses: expenses, balance: income - expenses };
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>();
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
      });
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  }, [transactions]);
  
  const incomeVsExpenseData = useMemo(() => {
    const dataByMonth: { [key: string]: { name: string; income: number; expenses: number } } = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!dataByMonth[month]) {
        dataByMonth[month] = { name: month, income: 0, expenses: 0 };
      }
      if (t.type === TransactionType.INCOME) {
        dataByMonth[month].income += t.amount;
      } else {
        dataByMonth[month].expenses += t.amount;
      }
    });
    return Object.values(dataByMonth).reverse();
  }, [transactions]);
  
  const trendData = useMemo(() => {
    const months: { name: string; income: number; expenses: number }[] = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        months.push({ name: monthName, income: 0, expenses: 0 });
    }

    transactions.forEach(t => {
        const transactionDate = new Date(t.date);
        const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
        
        if (transactionDate >= sixMonthsAgo) {
            const monthName = transactionDate.toLocaleString('default', { month: 'short', year: '2-digit' });
            const monthData = months.find(m => m.name === monthName);
            if (monthData) {
                if (t.type === TransactionType.INCOME) {
                    monthData.income += t.amount;
                } else {
                    monthData.expenses += t.amount;
                }
            }
        }
    });

    return months;
  }, [transactions]);


  const COLORS = ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#082f49'];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard title="Total Income" amount={totalIncome} currencySymbol={currency.symbol} color="text-green-500" />
        <SummaryCard title="Total Expenses" amount={totalExpenses} currencySymbol={currency.symbol} color="text-red-500" />
        <SummaryCard title="Balance" amount={balance} currencySymbol={currency.symbol} color="text-primary-600" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">6-Month Financial Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" tickFormatter={(value) => `${currency.symbol}${value / 1000}k`} />
                <Tooltip content={<CustomTooltip currencySymbol={currency.symbol} />} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} name="Income" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Income vs. Expenses (Monthly)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeVsExpenseData}>
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis stroke="#888888" tickFormatter={(value) => `${currency.symbol}${value}`} />
                    <Tooltip content={<CustomTooltip currencySymbol={currency.symbol}/>} />
                    <Legend />
                    <Bar dataKey="income" fill="#22c55e" name="Income" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Expense by Category</h3>
             <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={expenseByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {expenseByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip currencySymbol={currency.symbol}/>} />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
