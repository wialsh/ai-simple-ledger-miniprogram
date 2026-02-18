import { useState, useMemo, useEffect } from 'react';
import { transactionsService2 } from '@/services';
import * as dateUtils from '@/utils/dateUtils';
import { Transaction, LedgerCategory } from '@/types';

export const useTransactions = (userId, ledgerId: number, currentDate: Date) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transactions.length > 0) {
      transactionsService2.save(transactions);
    }
  }, [transactions]);

  const addTransaction = async (amount: number, recordDate: Date, remark: string, category: LedgerCategory) => {
    const now = new Date();
    const newTrans: Transaction = {
      transId: now.getTime(), // 临时本地 ID
      amount,
      remark,
      recordDate,
      userId,
      ledgerId: ledgerId,
      catName: category.name,
      iconName: category.iconName,
      iconColor: category.iconColor,
    };
    setTransactions(prev => (prev ? [newTrans, ...prev] : [newTrans]));
  };

  // ---------------------------------------------------------
  // 4. 数据计算 (useMemo)
  // ---------------------------------------------------------
  const monthlyTransactions = useMemo(() => {
    // console.log('计算本月交易记录: 依赖变化了', transactions, currentDate);
    const findedResult = transactions.filter(t => dateUtils.isSameMonth(t.recordDate, currentDate));
    return findedResult || [];
  }, [transactions, currentDate]);

  /**
   * 按天统计消费
   */
  const dailyTotalTransactions = useMemo(() => {
    if (!transactions.length) return [];
    const dailyGroups: Map<string, { date: Date; items: Transaction[]; amount: number }> = new Map();
    transactions.forEach(t => {
      const dateKey = dateUtils.formatDate(t.recordDate, 'YYYY-MM-DD');
      const existing = dailyGroups.get(dateKey);

      if (existing) {
        existing.items.push(t);
        existing.amount += t.amount;
      } else {
        dailyGroups.set(dateKey, {
          date: t.recordDate,
          items: [t],
          amount: t.amount,
        });
      }
    });

    // 转回数组并按日期倒序排列
    return Array.from(dailyGroups.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [transactions]);

  useEffect(() => {
    transactionsService2.getAll(ledgerId).then(data => {
      if (data?.transactions) {
        setTransactions(data.transactions);
      }
    });
  }, [ledgerId]);

  return {
    transactions,
    addTransaction,
    monthlyTransactions,
    dailyTotalTransactions,
  };
};
