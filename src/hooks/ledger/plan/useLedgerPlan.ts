import { useState, useMemo, useEffect } from 'react';
// import { ledgerPlanningService } from '@/services';
import * as dateUtils from '@/utils/dateUtils';
import { Ledger, LedgerPlan, PlanBill } from '@/types';

export const useLedgerPlan = (ledger: Ledger, currentDate: Date) => {
  const [ledgerPlan, setLedgerPlan] = useState<LedgerPlan>();
  // console.log('useLedgerPlan', ledgerId, currentDate);
  const fetchData = async () => {
    // const fetchedLedgerPlan = await ledgerPlanningService.byLedgerId(ledger.id);
    // setLedgerPlan(fetchedLedgerPlan);
  };

  const monthlyPlanBill = useMemo(() => {
    if (ledgerPlan) {
      const findedResult = ledgerPlan.planBills?.find(p => dateUtils.isSameMonth(p.planDate, currentDate));
      return findedResult || {};
    } else {
      return {};
    }
  }, [ledgerPlan, currentDate]) as PlanBill;

  const updateLedgerPlan = (amount: number, planDate: Date) => {
    setLedgerPlan(prev => {
      if (!prev) {
        const planYear = dateUtils.getYear(planDate);
        const now = new Date();
        const planBills = Array.from({ length: 12 }, (_, i) => ({
          planDate: new Date(planYear, i, 1),
          amount: 0,
          type: 'monthly',
        }));
        const updatedBills = planBills.map(p =>
          dateUtils.isSameMonth(p.planDate, planDate) ? { ...p, amount, planDate } : p
        );
        const added = {
          id: now.getTime(),
          planBills: updatedBills,
          ledgerId: ledger.id,
          createdAt: now,
          updatedAt: now,
          isDeleted: false,
        };
        return added;
      }
      const updatedBills = prev.planBills.map(p =>
        dateUtils.isSameMonth(p.planDate, planDate) ? { ...p, amount, planDate } : p
      );
      return { ...prev, planBills: updatedBills };
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
    monthlyPlanBill,
  };
};
