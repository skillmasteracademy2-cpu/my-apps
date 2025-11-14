
import React, { useState, useEffect } from 'react';
import { type Transaction } from '../types';

interface TransactionModalProps {
  type: 'income' | 'expense';
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onEditTransaction: (transaction: Transaction) => void;
  transactionToEdit: Transaction | null;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ type, onClose, onAddTransaction, onEditTransaction, transactionToEdit }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [recurrence, setRecurrence] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [error, setError] = useState('');
  
  const isEditing = !!transactionToEdit;

  useEffect(() => {
    if (isEditing) {
      setAmount(String(transactionToEdit.amount));
      setDescription(transactionToEdit.description);
      setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
      setRecurrence(transactionToEdit.recurrence || 'none');
    } else {
        // Reset form for adding new transaction
        setAmount('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        setRecurrence('none');
    }
  }, [transactionToEdit, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);

    if (!numericAmount || numericAmount <= 0 || !description.trim() || !date) {
      setError('Please enter a valid amount, description, and date.');
      return;
    }

    if (isEditing) {
        onEditTransaction({
            ...transactionToEdit,
            type,
            amount: numericAmount,
            description,
            date,
            recurrence,
        });
    } else {
        onAddTransaction({
            type,
            amount: numericAmount,
            description,
            date,
            recurrence,
        });
    }
    onClose();
  };

  const isIncome = type === 'income';
  const modalTitle = isEditing 
    ? (isIncome ? 'Edit Income' : 'Edit Expense')
    : (isIncome ? 'Add Income' : 'Add Expense');
    
  const accentColor = isIncome ? 'emerald' : 'rose';
  const colorClassMap = {
      emerald: {
          text: 'text-emerald-500',
          focusRing: 'focus:ring-emerald-500',
          focusBorder: 'focus:border-emerald-500',
          bg: 'bg-emerald-500',
          hoverBg: 'hover:bg-emerald-600',
      },
      rose: {
          text: 'text-rose-500',
          focusRing: 'focus:ring-rose-500',
          focusBorder: 'focus:border-rose-500',
          bg: 'bg-rose-500',
          hoverBg: 'hover:bg-rose-600',
      }
  };
  const colors = colorClassMap[accentColor];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-in fade-in-0">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-md transform transition-all animate-in fade-in-0 zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-2xl font-bold ${colors.text}`}>{modalTitle}</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount</label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={`w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 ${colors.focusRing} ${colors.focusBorder}`}
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                 <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 ${colors.focusRing} ${colors.focusBorder}`}
                  />
              </div>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`e.g., Salary, Groceries`}
              className={`w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 ${colors.focusRing} ${colors.focusBorder}`}
            />
          </div>
           <div className="mb-6">
            <label htmlFor="recurrence" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Recurrence</label>
            <select
                id="recurrence"
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as any)}
                className={`w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 ${colors.focusRing} ${colors.focusBorder}`}
            >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded-md bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold">Cancel</button>
            <button type="submit" className={`py-2 px-4 rounded-md text-white font-semibold ${colors.bg} ${colors.hoverBg}`}>{isEditing ? 'Save Changes' : 'Add Transaction'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;