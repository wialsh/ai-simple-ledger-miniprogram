import { useMemo } from 'react';
import type { Budget } from '@/types';

export const useStatLedgerBill = (currentDate: Date, budgets: Budget[]) => {
  // 统计月度预算
  const monthlyBudget = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    if (budgets.length > 0) {
      const filteredBudgets = budgets.find(b => b.year === year && b.month === month);
      return filteredBudgets?.amount || 0;
    }
    return 0;
  }, [currentDate, budgets]);

  return { monthlyBudget };
};
