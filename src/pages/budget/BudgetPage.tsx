import React, { useState } from 'react';
import { View } from '@tarojs/components'; // 1. 引入 Taro 组件
import { useAppContext } from '@/context/AppContext';
import { BudgetSetupPage } from '@/components/modals/budget/SetupPage';
import { BudgetCard } from '@/components/modals/budget/BudgetCard';
import TopBar from '@/components/bar/TopBar';

// 定义颜色常量 (保持一致性)
const COLORS = {
  gray50: '#f9fafb', // bg-gray-50
};

export const BudgetPage: React.FC = () => {
  const { monthlyBudget, monthlySpent } = useAppContext();
  const [showSetup, setShowSetup] = useState(false);

  return (
    // className='pb-24 min-h-screen bg-gray-50'
    <View
      style={{
        paddingBottom: '96px', // pb-24 (24 * 4px)
        minHeight: '100vh', // min-h-screen
        backgroundColor: COLORS.gray50, // bg-gray-50
      }}
    >
      {/* Header */}
      <TopBar onSetupBudget={() => setShowSetup(true)} />

      {/* className='px-2 py-4' */}
      <View
        style={{
          paddingLeft: '8px', // px-2
          paddingRight: '8px', // px-2
          paddingTop: '16px', // py-4
          paddingBottom: '16px', // py-4
        }}
      >
        <BudgetCard totalBudget={monthlyBudget} currentSpent={monthlySpent} onClick={() => setShowSetup(true)} />
      </View>

      {/*
         注意：BudgetSetupPage 作为一个弹窗组件，
         内部实现也需要确保使用了 View/Text 且使用了 position: fixed/absolute
      */}
      {showSetup && <BudgetSetupPage onClose={() => setShowSetup(false)} />}
    </View>
  );
};
