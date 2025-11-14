
import React from 'react';

interface SummaryCardProps {
  title: string;
  amount: number;
  color: 'green' | 'red' | 'blue';
  currency: string;
}

const colorClasses = {
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/50',
    border: 'border-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  red: {
    bg: 'bg-rose-50 dark:bg-rose-900/50',
    border: 'border-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
  },
  blue: {
    bg: 'bg-sky-50 dark:bg-sky-900/50',
    border: 'border-sky-500',
    text: 'text-sky-600 dark:text-sky-400',
  },
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, color, currency }) => {
  const classes = colorClasses[color];
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);

  return (
    <div className={`p-6 rounded-xl shadow-lg border-l-4 ${classes.bg} ${classes.border}`}>
      <h2 className="text-lg font-medium text-slate-600 dark:text-slate-300">{title}</h2>
      <p className={`text-4xl font-bold mt-2 ${classes.text}`}>{formattedAmount}</p>
    </div>
  );
};

export default SummaryCard;
