import { useState, useMemo, useEffect } from 'react';
import { transactionService } from '@/services/api';
import * as dateUtils from '@/utils/dateUtils';
import { Transaction, Ledger, UserProfile, LedgerCategory } from '@/types';

export const useTransactions = (userProfile: UserProfile, ledger: Ledger, currentDate: Date) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const fetchData = async () => {
    // await Promise.all
    const fetchedTransactions = await transactionService.getByLedgerId(ledger.id);

    setTransactions(fetchedTransactions);
  };

  // 获取月度交易
  const monthlyTransactions = useMemo(() => {
    const findedResult = transactions.filter(t => dateUtils.isSameMonth(t.createdAt, currentDate));
    return findedResult || [];
  }, [transactions, currentDate]);

  // 新增一笔消费
  const addTransaction = (amount: number, recordDate: Date, remark: string, category: LedgerCategory) => {
    const trans: Transaction = {
      id: Date.now(),
      amount,
      remark,
      recordDate,
      userId: userProfile.id,
      ledgerId: ledger.id,
      ownerId: ledger.ownerId,
      categoryId: category.id,
      categoryName: category.name,
      componentName: category.componentName,
      componentColor: category.componentColor,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };

    setTransactions(prev => [trans, ...prev]);
  };

  /**
   * 按天统计消费
   */
  const dailyTotalTransactions = useMemo(() => {
    if (!monthlyTransactions) return []; // 防止 undefined 报错
    const dailyGroups: {
      date: Date;
      items: Transaction[];
      amount: number;
    }[] = [];
    monthlyTransactions?.forEach(t => {
      const existing = dailyGroups.find(g => dateUtils.isSameDay(g.date, t.createdAt));
      if (existing) {
        existing.items.push(t);
        existing.amount += t.amount;
      } else {
        dailyGroups.push({
          date: t.createdAt,
          items: [t],
          amount: t.amount,
        });
      }
    });
    return dailyGroups;
  }, [monthlyTransactions]);

  useEffect(() => {
    if (ledger?.id) {
      fetchData();
    }
  }, [ledger?.id]);
  return {
    transactions,
    addTransaction,
    monthlyTransactions,
    dailyTotalTransactions,
  };
};
