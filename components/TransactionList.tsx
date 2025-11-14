
import React from 'react';
import { type DisplayTransaction, type Transaction } from '../types';

interface TransactionListProps {
  transactions: DisplayTransaction[];
  currency: string;
  onConfirm: (transaction: DisplayTransaction) => void;
  onSkip: (transaction: DisplayTransaction) => void;
  onEdit: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, currency, onConfirm, onSkip, onEdit }) => {
  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
        <p>No transactions for this month.</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const statusBadge = (status: DisplayTransaction['status']) => {
    const baseClasses = "text-xs px-2 py-0.5 rounded-full font-medium";
    switch (status) {
      case 'paid':
        return <span className={`${baseClasses} bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200`}>Paid</span>;
      case 'pending':
        return <span className={`${baseClasses} bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 animate-pulse`}>Pending</span>;
      case 'future':
         return <span className={`${baseClasses} bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200`}>Upcoming</span>;
    }
  };

  return (
    <div className="max-h-96 overflow-y-auto pr-2">
      <ul className="space-y-3">
        {transactions.map(t => (
          <li key={`${t.id}-${t.instanceDate}`} className="flex flex-col p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg transition-all hover:bg-slate-100 dark:hover:bg-slate-700">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <p className="font-semibold text-slate-800 dark:text-slate-100">{t.description}</p>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(t.instanceDate).toLocaleDateString()}
                    </p>
                    {t.recurrence !== 'none' && statusBadge(t.status)}
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <p className={`font-bold text-lg whitespace-nowrap ${t.status === 'future' ? 'text-slate-400 dark:text-slate-500' : (t.type === 'income' ? 'text-emerald-500' : 'text-rose-500')}`}>
                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </p>
                 <button onClick={() => onEdit(t)} aria-label={`Edit transaction ${t.description}`} className="text-slate-400 hover:text-sky-500 dark:text-slate-500 dark:hover:text-sky-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                </button>
              </div>
            </div>
            {t.status === 'pending' && (
              <div className="flex justify-end items-center gap-2 mt-2 border-t border-slate-200 dark:border-slate-600 pt-2">
                 <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mr-auto">Action required</p>
                <button onClick={() => onSkip(t)} className="px-3 py-1 text-xs font-semibold rounded bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500">Skip</button>
                <button onClick={() => onConfirm(t)} className="px-3 py-1 text-xs font-semibold rounded bg-emerald-500 text-white hover:bg-emerald-600">Confirm</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
