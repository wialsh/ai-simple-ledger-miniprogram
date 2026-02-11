import React, { useState, useMemo } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AppContext } from '@/context/AppContext';
import { TabBar, RecorderPage, DetailsPage, ChartsPage, BillPage, MinePage } from '@/pages/core';
import {
  useUserProfile,
  useLedgers,
  useTransactions,
  useStatTransactions,
  useStatLedgerBill,
  useChatMessage,
} from '@/hooks';
import * as dateUtils from '@/utils/dateUtils';
import { COLORS } from '@/styles/colors';
import type { Tab } from '@/types';

export const MainAppComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  // const [currentDateStr, setCurrentDateStr] = useState<string>(dateUtils.getTodayStr(currentDate));
  const [showRecorder, setShowRecorder] = useState(false);

  // --- Hooks ---
  const currentDateStr = '2024-06-01'; // 固定日期，方便测试用户信息的缓存和更新逻辑
  const { userProfile, setUserProfile } = useUserProfile(currentDateStr);

  console.log('userProfile', userProfile);

  const {
    currentLedger,
    selectLedger,
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
  } = useLedgers(userProfile);

  const { transactions, addTransaction, monthlyTransactions, dailyTotalTransactions } = useTransactions(
    currentLedger,
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
      setUserProfile,

      // 分类
      // allCategories,

      // 交易
      transactions,
      addTransaction,
      monthlyTransactions,
      dailyTotalTransactions,

      // 账本
      currentLedger,
      selectLedger,
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
      // ledgerSharingMembers,
      // setLedgerSharingMembers,
      // updateLedgerSharingMember,
      // addLedgerSharingMember,
      // deleteLedgerSharingMember,

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
      addLedger,
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
      displayLedgers,
      joinedLedgers,
      mineLedgers,
      monthlyBudget,
      monthlySpent,
      monthlyTransactions,
      selectLedger,
      transactions,
      trendData,
      updateChatMessage,
      updateLedger,
      updateLedgerBudgets,
      setUserProfile,
      userProfile,
    ]
  );
  // const contextValue = {};

  const handleTabChange = (t: Tab) => {
    if (t === 'add') {
      setShowRecorder(true);
    } else {
      if (t === activeTab) return; // 点击当前 Tab 不重复切换
      if (t === 'mine') {
        Taro.showToast({ title: '请先登录', icon: 'none' });
        // fetchUserProfile();
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
    // <Text style={{ height: '100%', width: '100%' }}>abc</Text>
  );
};
