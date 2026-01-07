import React, { useState } from 'react';
import { View } from '@tarojs/components'; // 1. 引入 View
import { AppContext } from '@/context/AppContext';
// Components and Pages
import { TabBar } from '@/pages/index/TabBar';
import { RecorderPage } from '@/pages/records/RecorderPage';
import { DetailsPage } from '@/pages/details/DetailsPage';
import { ChartsPage } from '@/pages/charts/ChartsPage';
import { BudgetPage } from '@/pages/budget/BudgetPage';
import { MinePage } from '@/pages/mine/MinePage';

import {
  useUserProfile,
  useLedgers,
  useLedgerSharingMember,
  useTransactions,
  useStatTransactions,
  useStatLedgerBudget,
  useAllCategories,
} from '@/hooks';

import { Tab } from '@/types';

// --- Main App Component ---

const MainAppComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [showRecorder, setShowRecorder] = useState(false);
  const [userId, setUserId] = useState<number>(3010);

  const { userProfile, updateUserProfile } = useUserProfile(userId);
  const { allCategories } = useAllCategories();

  const {
    currentLedger,
    activateLedger,
    updateLedgerBudget,
    allLedgers,
    displayLedgers,
    createLedger,
    addLedger,
    updateLedger,
    deleteLedger,
    mineLedgers,
    joinedLedgers,
  } = useLedgers(userProfile!);

  // const { ledgerPlan, updateLedgerPlan, monthlyPlanBudget } = useLedgerPlan(currentLedger!, currentDate);

  const {
    ledgerSharingMembers,
    setLedgerSharingMembers,
    updateLedgerSharingMember,
    addLedgerSharingMember,
    deleteLedgerSharingMember,
  } = useLedgerSharingMember(currentLedger?.id as number);

  const {
    transactions,
    addTransaction,
    monthlyTransactions,
    dailyTotalTransactions, // 确保 useTransactions 返回了这个
  } = useTransactions(userProfile!, currentLedger!, currentDate);

  const { monthlySpent, dailySpent, categoriesData, trendData } = useStatTransactions(monthlyTransactions);

  const { monthlyBudget } = useStatLedgerBudget(currentDate, currentLedger);

  // Derived state context
  const contextValue = {
    // 基础信息
    currentDate,
    setCurrentDate,

    //用户信息
    userProfile,
    updateUserProfile,

    //分类
    allCategories,

    // 交易
    transactions,
    addTransaction,
    monthlyTransactions,
    dailyTotalTransactions,

    // 账本
    currentLedger,
    activateLedger,
    updateLedgerBudget,
    allLedgers,
    displayLedgers,
    createLedger,
    addLedger,
    updateLedger,
    deleteLedger,
    mineLedgers,
    joinedLedgers,

    // 账本成员
    ledgerSharingMembers,
    setLedgerSharingMembers,
    updateLedgerSharingMember,
    addLedgerSharingMember,
    deleteLedgerSharingMember,

    // 消费统计
    monthlySpent,
    dailySpent,
    categoriesData,
    trendData,
    monthlyBudget,
  };

  const handleTabChange = (t: Tab) => {
    if (t === 'add') {
      setShowRecorder(true);
    } else {
      setActiveTab(t);
    }
  };

  return (
    <AppContext.Provider value={contextValue as any}>
      {/*
        修改点：
        1. 移除了 mx-auto, shadow-2xl, overflow-hidden (这些在小程序根视图通常不需要)
        2. 保留了 bg-gray-100, min-h-screen, relative, text-gray-900 (假设你在 common.scss 已定义)
        3. style 中添加了 paddingBottom: '100px'
           这是因为 TabBar 是 fixed 定位的，如果不加 padding，页面底部的内容会被 TabBar 挡住。
      */}
      <View
        className='bg-gray-100 min-h-screen relative text-gray-900'
        style={{
          paddingBottom: '100px', // 预留给 TabBar 的高度
          boxSizing: 'border-box',
        }}
      >
        {activeTab === 'details' && <DetailsPage />}
        {activeTab === 'charts' && <ChartsPage />}
        {activeTab === 'budget' && <BudgetPage />}
        {activeTab === 'mine' && <MinePage />}

        <TabBar active={activeTab} onChange={handleTabChange} />

        {showRecorder && <RecorderPage onClose={() => setShowRecorder(false)} />}
      </View>
    </AppContext.Provider>
  );
};

export default MainAppComponent;
