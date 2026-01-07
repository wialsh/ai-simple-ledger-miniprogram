import { useState, useMemo, useEffect } from 'react';
import { ledgerPlanningService } from '@/services/api';
import * as dateUtils from '@/utils/dateUtils';
import { Ledger, LedgerPlan, PlanBudget } from '@/types';

export const useLedgerPlan = (ledger: Ledger, currentDate: Date) => {
  const [ledgerPlan, setLedgerPlan] = useState<LedgerPlan>();
  // console.log('useLedgerPlan', ledgerId, currentDate);
  const fetchData = async () => {
    const fetchedLedgerPlan = await ledgerPlanningService.byLedgerId(ledger.id);
    setLedgerPlan(fetchedLedgerPlan);
  };

  const monthlyPlanBudget = useMemo(() => {
    if (ledgerPlan) {
      const findedResult = ledgerPlan.planBudgets?.find(p => dateUtils.isSameMonth(p.planDate, currentDate));
      return findedResult || {};
    } else {
      return {};
    }
  }, [ledgerPlan, currentDate]) as PlanBudget;

  const updateLedgerPlan = (amount: number, planDate: Date) => {
    setLedgerPlan(prev => {
      if (!prev) {
        const planYear = dateUtils.getYear(planDate);
        const now = new Date();
        const planBudgets = Array.from({ length: 12 }, (_, i) => ({
          planDate: new Date(planYear, i, 1),
          amount: 0,
          type: 'monthly',
        }));
        const updatedBudgets = planBudgets.map(p =>
          dateUtils.isSameMonth(p.planDate, planDate) ? { ...p, amount, planDate } : p
        );
        const added = {
          id: now.getTime(),
          planBudgets: updatedBudgets,
          ledgerId: ledger.id,
          createdAt: now,
          updatedAt: now,
          isDeleted: false,
        };
        return added;
      }
      const updatedBudgets = prev.planBudgets.map(p =>
        dateUtils.isSameMonth(p.planDate, planDate) ? { ...p, amount, planDate } : p
      );
      return { ...prev, planBudgets: updatedBudgets };
    });
  };

  useEffect(() => {
    if (ledger?.id) {
      fetchData();
    }
  }, [ledger?.id]);

  return {
    ledgerPlan,
    updateLedgerPlan,
    monthlyPlanBudget,
  };
};
