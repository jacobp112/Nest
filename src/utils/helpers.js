export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);

export const startOfDay = (value) => {
  const date = value instanceof Date ? new Date(value) : new Date(value || Date.now());
  date.setHours(0, 0, 0, 0);
  return date;
};

export const endOfDay = (value) => {
  const date = value instanceof Date ? new Date(value) : new Date(value || Date.now());
  date.setHours(23, 59, 59, 999);
  return date;
};

export const serialiseDate = (value, boundary = 'start') =>
  (boundary === 'end' ? endOfDay(value) : startOfDay(value)).toISOString();

export const formatMonthYear = (d) =>
  new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(d);

export const calculateNetMonthlySavings = (income, expenses, transactions) => {
  const base = (income || 0) - (expenses || 0);
  const variable = transactions.reduce((acc, tx) => {
    if (tx.type === 'income') return acc + (tx.amount || 0);
    if (tx.type === 'expense') return acc - (tx.amount || 0);
    return acc;
  }, 0);
  return base + variable;
};
