// src/types/index.ts

export interface FinancialSummary {
  monthlyPosition: number;
  cashFlowSplit: {
    income: number;
    expenses: number;
    savingsPower: number;
  };
  projections: {
    year1: number;
    year2: number;
    year5: number;
  };
  emergencyFund: {
    amount: number;
    status: string;
  };
  investments: {
    amount: number;
    status: string;
  };
  travel: {
    amount: number;
    status: string;
  };
  recentTransactions: Array<{
    label: string;
    amount: string;
    tag: string;
  }>;
}

export interface PopOutTileProps {
  summary: FinancialSummary;
  onClose: () => void;
}