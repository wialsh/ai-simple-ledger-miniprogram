import { useState, useEffect } from 'react';
import { ledgerBudgetsService } from '@/services';
import type { Budget } from '@/types';

export const useLedgerBudgets = (ledgerId: number, year: number) => {
  const [budgets, setBudgets] = useState<Budget[]>();

  useEffect(() => {
    if (budgets && budgets.length > 0) {
      ledgerBudgetsService.save(ledgerId, budgets);
    }
  }, [budgets, ledgerId]);

  // ---------------------------------------------------------
  // 计算属性 (useMemo)
  // ---------------------------------------------------------

  // ---------------------------------------------------------
  // 业务操作方法 (Action)
  // ---------------------------------------------------------
  const updateLedgerBudgets = (updated: Budget[]) => {
    setBudgets(prev => {
      if (!prev) return prev;
      const newBudget = { ...prev, ...updated };
      return newBudget;
    });
  };

  useEffect(() => {
    ledgerBudgetsService
      .get(ledgerId, year)
      .then(res => {
        if (res && Array.isArray(res.budgets)) {
          setBudgets(res.budgets);
        } else {
          setBudgets([]);
        }
      })
      .catch(err => {
        console.error('获取账本预算数据失败', err);
        setBudgets([]);
      });
  }, [ledgerId, year]);

  return {
    budgets,
    updateLedgerBudgets,
  };
};
