import { useMemo } from 'react';
import { Ledger } from '@/types';

export const useStatLedgerBudget = (currentDate: Date, currentLedger: Ledger) => {
  // 统计月度预算
  const monthlyBudget = useMemo(() => {
    const year = currentDate.getFullYear();
    const monthIndex = currentDate.getMonth();
    const budgets = currentLedger?.budgets || [];
    if (budgets) {
      const filteredBudgets = budgets.find(b => b.year === year);
      return filteredBudgets?.amounts[monthIndex] || 0;
    }
    return 0;
  }, [currentDate, currentLedger?.budgets]);

  return { monthlyBudget };
};
