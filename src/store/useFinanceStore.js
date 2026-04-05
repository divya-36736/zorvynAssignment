import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MOCK_TRANSACTIONS = [
  { id: 1, date: '2025-04-01', description: 'Salary Deposit', amount: 85000, category: 'Income', type: 'income' },
  { id: 2, date: '2025-04-02', description: 'Amazon Purchase', amount: -3200, category: 'Shopping', type: 'expense' },
  { id: 3, date: '2025-04-03', description: 'Netflix Subscription', amount: -649, category: 'Entertainment', type: 'expense' },
  { id: 4, date: '2025-04-04', description: 'Grocery Store', amount: -4500, category: 'Food', type: 'expense' },
  { id: 5, date: '2025-04-05', description: 'Freelance Payment', amount: 22000, category: 'Income', type: 'income' },
  { id: 6, date: '2025-04-06', description: 'Electricity Bill', amount: -1800, category: 'Utilities', type: 'expense' },
  { id: 7, date: '2025-04-07', description: 'Restaurant Dinner', amount: -2100, category: 'Food', type: 'expense' },
  { id: 8, date: '2025-04-08', description: 'Gym Membership', amount: -999, category: 'Health', type: 'expense' },
  { id: 9, date: '2025-04-09', description: 'Dividend Income', amount: 5500, category: 'Income', type: 'income' },
  { id: 10, date: '2025-04-10', description: 'Uber Rides', amount: -850, category: 'Transport', type: 'expense' },
  { id: 11, date: '2025-04-11', description: 'Book Purchase', amount: -599, category: 'Shopping', type: 'expense' },
  { id: 12, date: '2025-04-12', description: 'Phone Bill', amount: -799, category: 'Utilities', type: 'expense' },
  { id: 13, date: '2025-03-01', description: 'Salary Deposit', amount: 85000, category: 'Income', type: 'income' },
  { id: 14, date: '2025-03-05', description: 'Rent Payment', amount: -15000, category: 'Housing', type: 'expense' },
  { id: 15, date: '2025-03-10', description: 'Freelance Payment', amount: 18000, category: 'Income', type: 'income' },
  { id: 16, date: '2025-03-15', description: 'Grocery Store', amount: -5200, category: 'Food', type: 'expense' },
  { id: 17, date: '2025-03-20', description: 'Spotify Premium', amount: -199, category: 'Entertainment', type: 'expense' },
  { id: 18, date: '2025-03-22', description: 'Medical Checkup', amount: -2500, category: 'Health', type: 'expense' },
  { id: 19, date: '2025-02-01', description: 'Salary Deposit', amount: 85000, category: 'Income', type: 'income' },
  { id: 20, date: '2025-02-08', description: 'Shopping Mall', amount: -8900, category: 'Shopping', type: 'expense' },
  { id: 21, date: '2025-02-14', description: 'Valentine Dinner', amount: -3500, category: 'Food', type: 'expense' },
  { id: 22, date: '2025-02-20', description: 'Freelance Payment', amount: 25000, category: 'Income', type: 'income' },
  { id: 23, date: '2025-02-25', description: 'Internet Bill', amount: -999, category: 'Utilities', type: 'expense' },
  { id: 24, date: '2025-01-01', description: 'Salary Deposit', amount: 85000, category: 'Income', type: 'income' },
  { id: 25, date: '2025-01-10', description: 'New Year Shopping', amount: -12000, category: 'Shopping', type: 'expense' },
  { id: 26, date: '2025-01-15', description: 'Investment Return', amount: 9000, category: 'Income', type: 'income' },
  { id: 27, date: '2025-01-20', description: 'Electricity Bill', amount: -2100, category: 'Utilities', type: 'expense' },
];

const useFinanceStore = create(
  persist(
    (set, get) => ({
      transactions: MOCK_TRANSACTIONS,
      role: 'viewer',
      filters: {
        search: '',
        type: 'all',
        category: 'all',
        sortBy: 'date-desc',
      },
      activeTab: 'dashboard',

      setRole: (role) => set({ role }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      resetFilters: () =>
        set({
          filters: { search: '', type: 'all', category: 'all', sortBy: 'date-desc' },
        }),

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [
            { ...tx, id: Date.now(), amount: tx.type === 'expense' ? -Math.abs(tx.amount) : Math.abs(tx.amount) },
            ...state.transactions,
          ],
        })),

      editTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id
              ? { ...t, ...updates, amount: updates.type === 'expense' ? -Math.abs(updates.amount) : Math.abs(updates.amount) }
              : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      getFilteredTransactions: () => {
        const { transactions, filters } = get();
        let result = [...transactions];

        if (filters.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (t) =>
              t.description.toLowerCase().includes(q) ||
              t.category.toLowerCase().includes(q)
          );
        }
        if (filters.type !== 'all') result = result.filter((t) => t.type === filters.type);
        if (filters.category !== 'all') result = result.filter((t) => t.category === filters.category);

        switch (filters.sortBy) {
          case 'date-desc': result.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
          case 'date-asc': result.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
          case 'amount-desc': result.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount)); break;
          case 'amount-asc': result.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount)); break;
        }
        return result;
      },

      getSummary: () => {
        const { transactions } = get();
        const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
        return { balance: income - expenses, income, expenses };
      },

      getCategories: () => {
        const { transactions } = get();
        return [...new Set(transactions.map((t) => t.category))].sort();
      },

      getCategoryBreakdown: () => {
        const { transactions } = get();
        const expense = transactions.filter((t) => t.type === 'expense');
        const map = {};
        expense.forEach((t) => {
          map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
        });
        return Object.entries(map)
          .map(([category, total]) => ({ category, total }))
          .sort((a, b) => b.total - a.total);
      },

      getMonthlyTrend: () => {
        const { transactions } = get();
        const map = {};
        transactions.forEach((t) => {
          const month = t.date.slice(0, 7);
          if (!map[month]) map[month] = { month, income: 0, expenses: 0 };
          if (t.type === 'income') map[month].income += t.amount;
          else map[month].expenses += Math.abs(t.amount);
        });
        return Object.values(map)
          .sort((a, b) => a.month.localeCompare(b.month))
          .map((m) => ({ ...m, balance: m.income - m.expenses }));
      },
    }),
    { name: 'finance-store', version: 1 }
  )
);

export default useFinanceStore;
