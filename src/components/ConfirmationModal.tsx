
import React from 'react';
import { type DisplayTransaction } from '../types';

interface ConfirmationModalProps {
  transaction: DisplayTransaction;
  onConfirm: () => void;
  onSkip: () => void;
  currency: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ transaction, onConfirm, onSkip, currency }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };
  
  const isIncome = transaction.type === 'income';
  const accentColor = isIncome ? 'emerald' : 'rose';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-in fade-in-0">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-md transform transition-all animate-in fade-in-0 zoom-in-95">
        <h2 className={`text-2xl font-bold text-amber-500`}>Confirm Transaction</h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
            A recurring transaction is due. Please confirm if it has been processed.
        </p>
        
        <div className={`mt-4 p-4 rounded-lg border-l-4 bg-${accentColor}-50 dark:bg-${accentColor}-900/30 border-${accentColor}-500`}>
            <p className="font-semibold text-lg text-slate-800 dark:text-slate-100">{transaction.description}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Due on: {new Date(transaction.instanceDate).toLocaleDateString()}
            </p>
            <p className={`font-bold text-2xl mt-2 ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
            </p>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" onClick={onSkip} className="py-2 px-4 rounded-md bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold">Skip</button>
          <button type="button" onClick={onConfirm} className={`py-2 px-4 rounded-md text-white font-semibold bg-emerald-500 hover:bg-emerald-600`}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
