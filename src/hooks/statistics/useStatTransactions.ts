import { useMemo } from 'react';
import * as dateUtils from '@/utils/dateUtils';
import type { Transaction, CategoriesSpend } from '@/types';

export const useStatTransactions = (monthlyTransactions: Transaction[]) => {
  // 统计月度计消费
  const monthlySpent = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);

  /**
   * 按天统计消费
   */
  const dailySpent = useMemo(() => {
    const dailyGroups: {
      date: Date;
      items: any[];
      amount: number;
    }[] = [];
    monthlyTransactions?.forEach(t => {
      const existing = dailyGroups.find(g => dateUtils.isSameDay(g.date, t.recordDate));
      if (existing) {
        existing.items.push(t);
        existing.amount += t.amount;
      } else {
        dailyGroups.push({
          date: t.recordDate,
          items: [t],
          amount: t.amount,
        });
      }
    });
    return dailyGroups;
  }, [monthlyTransactions]);

  // 统计分类信息
  const categoriesData = useMemo(() => {
    const map = new Map<string, CategoriesSpend>();
    monthlyTransactions.forEach(t => {
      const statInfo = map.get(t.catName);
      if (statInfo) {
        statInfo.transAmount += t.amount;
        map.set(t.catName, statInfo);
      } else {
        map.set(t.catName, {
          displayName: t.catName,
          iconName: t.iconName,
          iconColor: t.iconColor,
          transAmount: t.amount,
        });
      }
    });
    // entries获取所有键值对（[key, value]）迭代器
    return Array.from(map.entries())
      .map(([iconName, statInfo]) => {
        return statInfo;
      })
      .sort((a, b) => b.transAmount - a.transAmount);
  }, [monthlyTransactions]);

  /**
   * 统计每天消费（按月的每一天）
   */
  // const trendData = useMemo(() => {
  //   const currentDate = new Date();
  //   const days = Array.from({ length: dateUtils.endOfMonth(currentDate).getDate() }, (_, i) => {
  //     const d = i + 1;
  //     return {
  //       label: `${d}日`,
  //       value: new Date(currentDate.getFullYear(), currentDate.getMonth(), d),
  //     };
  //   });
  //   return days.map(day => {
  //     const amount = monthlyTransactions
  //       .filter(t => dateUtils.isSameDay(t.recordDate, day.value))
  //       .reduce((sum, t) => sum + t.amount, 0);
  //     return { day: day.label, amount };
  //   });
  // }, [monthlyTransactions]) as TrendData[];

  return { monthlySpent, dailySpent, categoriesData };
};
