import React, { useState, useMemo } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AppContext } from '@/context/AppContext';
import { TabBar, RecorderPage, DetailsPage, ChartsPage, BillPage, MinePage } from '@/pages/core';

import {
  useUserProfile2,
  useLedgers,
  useLedgerSharingMember,
  useTransactions,
  useStatTransactions,
  useStatLedgerBill,
  useAllCategories,
  useChatMessage,
} from '@/hooks';

import { Tab } from '@/types';
import { COLORS } from '@/styles/colors';
import { cloudLogin } from '@/services';

export const MainAppComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [showRecorder, setShowRecorder] = useState(false);

  // --- Hooks ---
  const { userProfile, updateUserProfile } = useUserProfile2(); // Hardcoded userId for demo
  // const { allCategories } = useAllCategories();
  console.log('userProfile', userProfile);

  const {
    currentLedger,
    activateLedger,
    updateLedgerBudgets,
    allLedgers,
    displayLedgers,
    createLedger,
    addLedger,
    updateLedger,
    deleteLedger,
    mineLedgers,
    joinedLedgers,
    deleteLedgerCategory,
  } = useLedgers(userProfile!);

  const {
    ledgerSharingMembers,
    setLedgerSharingMembers,
    updateLedgerSharingMember,
    addLedgerSharingMember,
    deleteLedgerSharingMember,
  } = useLedgerSharingMember(currentLedger?.id as number);

  const { transactions, addTransaction, monthlyTransactions, dailyTotalTransactions } = useTransactions(
    userProfile!,
    currentLedger!,
    currentDate
  );

  const { monthlySpent, dailySpent, categoriesData, trendData } = useStatTransactions(monthlyTransactions);

  const { monthlyBudget } = useStatLedgerBill(currentDate, currentLedger);

  const { chatMessages, updateChatMessage } = useChatMessage();

  // --- 性能优化：使用 useMemo 缓存 Context Value ---
  const contextValue = useMemo(
    () => ({
      // 基础信息
      currentDate,
      setCurrentDate,

      // 用户信息
      userProfile,
      updateUserProfile,

      // 分类
      // allCategories,

      // 交易
      transactions,
      addTransaction,
      monthlyTransactions,
      dailyTotalTransactions,

      // 账本
      currentLedger,
      activateLedger,
      updateLedgerBudgets,
      allLedgers,
      displayLedgers,
      createLedger,
      addLedger,
      updateLedger,
      deleteLedger,
      mineLedgers,
      joinedLedgers,
      deleteLedgerCategory,

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

      // 消息
      chatMessages,
      updateChatMessage,
    }),
    [
      activateLedger,
      addLedger,
      addLedgerSharingMember,
      addTransaction,
      allLedgers,
      categoriesData,
      chatMessages,
      createLedger,
      currentDate,
      currentLedger,
      dailySpent,
      dailyTotalTransactions,
      deleteLedger,
      deleteLedgerCategory,
      deleteLedgerSharingMember,
      displayLedgers,
      joinedLedgers,
      ledgerSharingMembers,
      mineLedgers,
      monthlyBudget,
      monthlySpent,
      monthlyTransactions,
      setLedgerSharingMembers,
      transactions,
      trendData,
      updateChatMessage,
      updateLedger,
      updateLedgerBudgets,
      updateLedgerSharingMember,
      updateUserProfile,
      userProfile,
    ]
  );

  const handleLogin = async () => {
    const userInfo = await cloudLogin();
    console.log('登录成功，用户信息：', userInfo);
    updateUserProfile(userInfo);
  };

  const handleTabChange = (t: Tab) => {
    if (t === 'add') {
      setShowRecorder(true);
    } else {
      if (t === activeTab) return; // 点击当前 Tab 不重复切换
      if (t === 'mine') {
        Taro.showToast({ title: '请先登录', icon: 'none' });
        handleLogin();
        return;
      }
      setActiveTab(t);
    }
  };

  return (
    <AppContext.Provider value={contextValue as any}>
      <View
        className='app-container'
        style={{
          minHeight: '100vh',
          backgroundColor: COLORS.gray50,
          position: 'relative',
          overflow: 'hidden', // 防止整体页面滚动，交给子页面的 ScrollView
        }}
      >
        {/*
           页面内容区域
           注意：这里不需要 paddingBottom，因为我们在每个 Page 内部（如 DetailsPage）
           的 ScrollView 内部已经预留了 paddingBottom: 100px 来避让 TabBar。
           如果在最外层加 padding，会导致 ScrollView 的高度被挤压。
        */}
        <View style={{ height: '100%', width: '100%' }}>
          {activeTab === 'details' && <DetailsPage />}
          {activeTab === 'charts' && <ChartsPage />}
          {activeTab === 'bill' && <BillPage />}
          {activeTab === 'mine' && <MinePage />}
        </View>

        {/* 底部导航栏 (Fixed) */}
        <TabBar active={activeTab} onChange={handleTabChange} />

        {/* 记账弹窗 (Full Screen Overlay) */}
        {showRecorder && <RecorderPage onBack={() => setShowRecorder(false)} />}
      </View>
    </AppContext.Provider>
  );
};
