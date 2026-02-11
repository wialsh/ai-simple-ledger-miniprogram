import { useMemo } from 'react';
import { Ledger } from '@/types';

export const useStatLedgerBill = (currentDate: Date, currentLedger: Ledger) => {
  // 统计月度预算
  const monthlyBudget = useMemo(() => {
    const year = currentDate.getFullYear();
    const monthIndex = currentDate.getMonth();
    const bills = currentLedger?.budgets || [];
    if (bills) {
      const filteredBills = bills.find(b => b.year === year);
      return filteredBills?.amounts[monthIndex] || 0;
    }
    return 0;
  }, [currentDate, currentLedger?.budgets]);

  return { monthlyBudget };
};
