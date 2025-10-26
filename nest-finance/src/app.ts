import React from 'react';
import { motion } from 'framer-motion';

const FinancialSummaryTile = () => {
  const monthlyPosition = 3870;
  const cashFlow = {
    income: 8240,
    expenses: 4370,
    savings: 3870,
  };
  const projections = {
    year1: 46400,
    year2: 98120,
    year5: 322980,
  };
  const goals = {
    emergencyFund: 8500,
    investments: 8500,
    travel: 8500,
  };
  const recentTransactions = [
    { label: 'Rent', amount: -1850, tag: 'Housing' },
    { label: 'Freelance invoice', amount: 2200, tag: 'Income' },
    { label: 'Groceries', amount: -140, tag: 'Food' },
  ];

  return (
    <motion.div
      className="relative mx-auto mt-12 h-[600px] w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-emerald-200/20 transform transition-transform hover:scale-105"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold">Monthly Position</h3>
        <p className="text-3xl font-bold">${monthlyPosition}</p>
        <p className="text-sm text-slate-500">Projection backed by your manual entries.</p>
        <p className="text-sm text-slate-500">Confidence: High</p>

        <h4 className="mt-6 text-lg font-semibold">Cash Flow Split</h4>
        <p>Income · ${cashFlow.income}</p>
        <p>Expenses · ${cashFlow.expenses}</p>
        <p>Savings power · ${cashFlow.savings}</p>

        <h4 className="mt-6 text-lg font-semibold">Projection</h4>
        <p>Year 1 · ${projections.year1}</p>
        <p>Year 2 · ${projections.year2}</p>
        <p>Year 5 · ${projections.year5}</p>

        <h4 className="mt-6 text-lg font-semibold">Goals</h4>
        <p>Emergency Fund · ${goals.emergencyFund} (3 months ahead of schedule)</p>
        <p>Investments · ${goals.investments} (3 months ahead of schedule)</p>
        <p>Travel · ${goals.travel} (3 months ahead of schedule)</p>

        <h4 className="mt-6 text-lg font-semibold">Recent Transactions</h4>
        <div className="space-y-2">
          {recentTransactions.map((transaction) => (
            <div key={transaction.label} className="flex justify-between">
              <span>{transaction.label}</span>
              <span className={transaction.amount > 0 ? 'text-emerald-600' : 'text-red-500'}>
                {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <FinancialSummaryTile />
    </div>
  );
};

export default App;