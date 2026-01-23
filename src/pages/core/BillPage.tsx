import React, { useState, useMemo } from 'react';
import { View } from '@tarojs/components';
import { useAppContext } from '@/context/AppContext';
import { WindowsCustom } from '@/components';
import { BillSetupPage, BillOverviewCard, BillList } from '@/components/bill';
import { COLORS } from '@/styles/colors';
import type { BudgetData } from '@/types';

export const BillPage: React.FC = () => {
  const { transactions, currentDate } = useAppContext();
  const [showSetup, setShowSetup] = useState(false);
  const [activedYear, setActivedYear] = useState(currentDate.getFullYear());

  // --- 数据计算逻辑---
  const { monthlyData, totalIncome, totalExpense, totalBalance } = useMemo(() => {
    const data: BudgetData[] = [];
    const yearTrans = transactions.filter(t => t.recordDate.getFullYear() === activedYear);

    // 聚合数据
    yearTrans.forEach(t => {
      const month = t.recordDate.getMonth() + 1; // 0-11 -> 1-12
      // 找到对应的月份数据项
      let item = data.find(d => d.id === month);
      if (!item) {
        item = {
          id: month,
          displayName: `${String(month).padStart(2, '0')}月`,
          income: 0,
          expense: 0,
          balance: 0,
        };
        data.push(item);
      }
      if (item) {
        if (t.amount > 0) {
          // 临时逻辑: amount > 0 视为支出
          item.expense += t.amount;
        } else {
          // 收入逻辑
          item.income += Math.abs(t.amount);
        }
      }
    });

    // 4. 计算结余 & 总计
    let tIncome = 0;
    let tExpense = 0;

    data.forEach(item => {
      item.balance = item.income - item.expense;
      tIncome += item.income;
      tExpense += item.expense;
    });

    return {
      monthlyData: data.sort((a, b) => b.id - a.id),
      totalIncome: tIncome,
      totalExpense: tExpense,
      totalBalance: tIncome - tExpense,
    };
  }, [transactions, activedYear]);

  return (
    <WindowsCustom showNavBar>
      {/* Content Container */}
      <View
        style={{
          flex: 1,
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 概览卡片 */}
        <BillOverviewCard totalIncome={totalIncome} totalExpense={totalExpense} balance={totalBalance} />

        {/* 月度列表 */}
        <BillList data={monthlyData} />
      </View>

      {/* 设置弹窗 */}
      {showSetup && <BillSetupPage onClose={() => setShowSetup(false)} />}
    </WindowsCustom>
  );
};
