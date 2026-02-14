import { useState, useMemo, useEffect } from 'react';
import { transactionService, storageService } from '@/services';
import * as dateUtils from '@/utils/dateUtils';
import { Transaction, Ledger, LedgerCategory } from '@/types';

export const useTransactions = (ledger: Ledger, currentDate: Date) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const addTransaction = (
    userId: number,
    amount: number,
    recordDate: Date,
    remark: string,
    category: LedgerCategory
  ) => {
    const now = new Date();
    const trans: Transaction = {
      transId: now.getTime(), //交易ID
      amount,
      remark,
      recordDate,
      userId: userId,
      ledgerId: ledger.id,
      ownerId: ledger.ownerId,
      iconName: category.iconName,
      iconColor: category.iconColor,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    setTransactions(prev => [trans, ...prev]);
    storageService.set(`transactions`, transactions);
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
  }, [fetchData, ledger?.id]);
  return {
    transactions,
    addTransaction,
    monthlyTransactions,
    dailyTotalTransactions,
  };
};
