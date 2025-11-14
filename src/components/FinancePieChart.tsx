
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FinancePieChartProps {
  income: number;
  expenses: number;
  currency: string;
}

const FinancePieChart: React.FC<FinancePieChartProps> = ({ income, expenses, currency }) => {
  const savings = Math.max(0, income - expenses);

  const data = [
    { name: 'Expenses', value: expenses },
    { name: 'Savings', value: savings },
  ];

  const COLORS = ['#f43f5e', '#3b82f6']; // rose-500 for expenses, sky-500 for savings

  if (income === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
        <p>No income data for this month to display chart.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(value)}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancePieChart;
