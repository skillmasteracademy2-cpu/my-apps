import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { type Transaction, type DisplayTransaction } from './types';
import SummaryCard from './components/SummaryCard';
import TransactionModal from './components/TransactionModal';
import FinancePieChart from './components/FinancePieChart';
import TransactionList from './components/TransactionList';
import ConfirmationModal from './components/ConfirmationModal';


const currencies = [
  { code: 'USD', name: 'United States Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'GBP', name: 'British Pound Sterling' },
  { code: 'NGN', name: 'Nigerian Naira' },
  { code: 'KES', name: 'Kenyan Shilling' },
  { code: 'ZAR', name: 'South African Rand' },
  { code: 'GHS', name: 'Ghanaian Cedi' },
  { code: 'XAF', name: 'Central African CFA franc' },
];


const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const savedTransactions = localStorage.getItem('finance-tracker-transactions');
      // Simple migration for old data
      if (savedTransactions) {
        const parsed = JSON.parse(savedTransactions);
        return parsed.map((t: any) => ({
          ...t,
          recurrence: t.recurrence || 'none',
          processedDates: t.processedDates || [],
        }));
      }
      return [];
    } catch (error) {
      console.error('Error parsing transactions from localStorage', error);
      return [];
    }
  });

  const [currency, setCurrency] = useState<string>(() => {
    try {
      const savedCurrency = localStorage.getItem('finance-tracker-currency');
      return savedCurrency ? JSON.parse(savedCurrency) : 'USD';
    } catch (error) {
      console.error('Error parsing currency from localStorage', error);
      return 'USD';
    }
  });


  const [modalType, setModalType] = useState<'income' | 'expense' | null>(null);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<DisplayTransaction | null>(null);


  useEffect(() => {
    localStorage.setItem('finance-tracker-transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance-tracker-currency', JSON.stringify(currency));
  }, [currency]);

  const { displayTransactions, totalIncome, totalExpenses, savings } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const generatedTransactions: DisplayTransaction[] = [];

    transactions.forEach(t => {
      const startDate = new Date(t.date);
      startDate.setHours(0, 0, 0, 0);

      if (t.recurrence === 'none') {
        const transactionDate = new Date(t.date);
        if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
          generatedTransactions.push({
            ...t,
            instanceDate: t.date,
            status: 'paid', // One-time transactions are always considered paid
          });
        }
      } else {
        let currentDate = new Date(startDate);
        while (currentDate <= lastDayOfMonth) {
            if (currentDate >= firstDayOfMonth) {
                const instanceDateStr = currentDate.toISOString().split('T')[0];
                const isProcessed = t.processedDates?.includes(instanceDateStr);
                let status: 'paid' | 'pending' | 'future';
                
                if (isProcessed) {
                    status = 'paid';
                } else if (currentDate <= today) {
                    status = 'pending';
                } else {
                    status = 'future';
                }

                generatedTransactions.push({
                    ...t,
                    instanceDate: currentDate.toISOString(),
                    status,
                });
            }

            switch (t.recurrence) {
                case 'daily':
                    currentDate.setDate(currentDate.getDate() + 1);
                    break;
                case 'weekly':
                    currentDate.setDate(currentDate.getDate() + 7);
                    break;
                case 'monthly':
                    // Handles month-end correctly
                    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
                    currentDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), Math.min(startDate.getDate(), new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate()));
                    break;
            }
        }
      }
    });

    const paidTransactions = generatedTransactions.filter(t => t.status === 'paid');

    const income = paidTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = paidTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      displayTransactions: generatedTransactions.sort((a, b) => new Date(b.instanceDate).getTime() - new Date(a.instanceDate).getTime()),
      totalIncome: income,
      totalExpenses: expenses,
      savings: income - expenses,
    };
  }, [transactions]);
  
  const processTransaction = useCallback((transaction: DisplayTransaction, action: 'confirm' | 'skip') => {
    setTransactions(prev => prev.map(t => {
      if (t.id === transaction.id) {
        const instanceDateStr = new Date(transaction.instanceDate).toISOString().split('T')[0];
        const updatedProcessedDates = [...(t.processedDates || [])];
        if (!updatedProcessedDates.includes(instanceDateStr)) {
          updatedProcessedDates.push(instanceDateStr);
        }
        return { ...t, processedDates: updatedProcessedDates };
      }
      return t;
    }));
  }, []);

  const handleConfirmTransaction = useCallback((transaction: DisplayTransaction) => {
    processTransaction(transaction, 'confirm');
    setPendingConfirmation(null);
  }, [processTransaction]);

  const handleSkipTransaction = useCallback((transaction: DisplayTransaction) => {
    processTransaction(transaction, 'skip');
    setPendingConfirmation(null);
  }, [processTransaction]);


  useEffect(() => {
    const firstPending = displayTransactions.find(t => t.status === 'pending');
    if (firstPending && !pendingConfirmation) {
      setPendingConfirmation(firstPending);

      if (Notification.permission === 'granted') {
        new Notification('Pending Transaction', {
          body: `Your recurring transaction "${firstPending.description}" is due. Please confirm.`,
        });
      }
    }
  }, [displayTransactions, pendingConfirmation]);

  const handleAddTransaction = (newTransactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...newTransactionData,
      id: crypto.randomUUID(),
      processedDates: [],
    };
    setTransactions(prev => [...prev, newTransaction]);
  };
  
  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    setTransactionToEdit(null);
  };
  
  const handleStartEdit = (transaction: Transaction) => {
    setModalType(transaction.type);
    setTransactionToEdit(transaction);
  };
  
  const handleOpenModal = (type: 'income' | 'expense') => {
      setTransactionToEdit(null);
      setModalType(type);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setTransactionToEdit(null);
  };
  
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };


  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 min-h-screen font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <header>
          <div className="flex flex-wrap justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">
                Monthly Finance Tracker
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Your personal dashboard for this month's finances.
              </p>
            </div>
             <div className="flex items-center gap-4">
              <button onClick={requestNotificationPermission} className="text-xs p-1 px-2 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">Enable Notifications</button>
              <label htmlFor="currency-select" className="sr-only">Select Currency</label>
              <select
                id="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 dark:text-slate-50"
                aria-label="Select currency"
              >
                {currencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={() => handleOpenModal('income')}
              className="px-6 py-3 rounded-lg bg-emerald-500 text-white font-semibold shadow-md hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75"
              aria-label="Add new income"
            >
              Add Income
            </button>
            <button
              onClick={() => handleOpenModal('expense')}
              className="px-6 py-3 rounded-lg bg-rose-500 text-white font-semibold shadow-md hover:bg-rose-600 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-opacity-75"
              aria-label="Add new expense"
            >
              Add Expense
            </button>
          </div>
        </header>

        <section className="mt-8" aria-labelledby="summary-heading">
           <h2 id="summary-heading" className="sr-only">Financial Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard title="Total Income" amount={totalIncome} color="green" currency={currency} />
            <SummaryCard title="Total Expenses" amount={totalExpenses} color="red" currency={currency} />
            <SummaryCard title="Savings" amount={savings} color="blue" currency={currency} />
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 id="overview-heading" className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Monthly Overview</h3>
            <div role="img" aria-labelledby="overview-heading">
              <FinancePieChart income={totalIncome} expenses={totalExpenses} currency={currency} />
            </div>
          </div>
          <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col">
             <h3 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Recent Transactions</h3>
            <div className="flex-grow">
              <TransactionList 
                transactions={displayTransactions} 
                currency={currency}
                onConfirm={handleConfirmTransaction}
                onSkip={handleSkipTransaction}
                onEdit={handleStartEdit}
              />
            </div>
          </div>
        </section>
      </main>
      
      {pendingConfirmation && (
        <ConfirmationModal
            transaction={pendingConfirmation}
            onConfirm={() => handleConfirmTransaction(pendingConfirmation)}
            onSkip={() => handleSkipTransaction(pendingConfirmation)}
            currency={currency}
        />
      )}

      {modalType && (
        <TransactionModal
          type={modalType}
          onClose={handleCloseModal}
          onAddTransaction={handleAddTransaction}
          onEditTransaction={handleUpdateTransaction}
          transactionToEdit={transactionToEdit}
        />
      )}
    </div>
  );
};

export default App;