
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  processedDates?: string[]; // Stores ISO date strings of confirmed/skipped instances
}

export interface DisplayTransaction extends Transaction {
  instanceDate: string;
  status: 'paid' | 'pending' | 'future';
}
