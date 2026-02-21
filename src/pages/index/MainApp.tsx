import React, { useState, useMemo, useEffect } from 'react';
import Taro, { useDidHide } from '@tarojs/taro';
import { View, Text, ITouchEvent } from '@tarojs/components';
import { AppContext } from '@/context/AppContext';
import { TabBar, RecorderPage, DetailsPage, ChartsPage, BillPage, MinePage } from '@/pages/core';
import { LedgerDescriptionDialog } from '@/components/recorder';
import { Dialog } from '@/components/ui';
import {
  useUserProfile,
  useLedgerInfo,
  useLedgerCategories,
  useLedgerBudgets,
  useTransactions,
  useStatTransactions,
  useStatLedgerBill,
  useChatMessage,
} from '@/hooks';
import { syncSendTransactionsData, syncSendLedgerData } from '@/services';
import { COLORS } from '@/styles/colors';
import type { Tab } from '@/types';

export const MainAppComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  // const [currentDateStr, setCurrentDateStr] = useState<string>(dateUtils.getTodayStr(currentDate));
  const [showRecorder, setShowRecorder] = useState(false);
  const [showLedgerDescDialog, setShowLedgerDescDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // --- Hooks ---
  const { userId, userProfile, updateUserProfile } = useUserProfile();
  const { ledgerId, ledgerInfo, updateLedgerInfo } = useLedgerInfo(userId);
  const { categories, updateLedgerCategories, deleteLedgerCategory } = useLedgerCategories(ledgerId);
  const { budgets, updateLedgerBudgets } = useLedgerBudgets(ledgerId, currentDate.getFullYear());

  const { transactions, addTransaction, monthlyTransactions, dailyTotalTransactions } = useTransactions(
    userId,
    ledgerId,
    currentDate
  );

  const { monthlySpent, dailySpent, categoriesData } = useStatTransactions(monthlyTransactions);

  const { monthlyBudget } = useStatLedgerBill(currentDate, budgets || []);

  const { chatMessages, updateChatMessage } = useChatMessage();

  // --- 性能优化：使用 useMemo 缓存 Context Value ---
  const contextValue = useMemo(
    () => ({
      // 基础信息
      currentDate,
      setCurrentDate,

      // 用户信息
      userId,
      userProfile,
      updateUserProfile,

      // 交易
      transactions,
      addTransaction,
      monthlyTransactions,
      dailyTotalTransactions,

      // 账本
      ledgerId,
      ledgerInfo,
      updateLedgerInfo,
      categories,
      updateLedgerCategories,
      deleteLedgerCategory,
      budgets,
      updateLedgerBudgets,

      // 消费统计
      monthlySpent,
      dailySpent,
      categoriesData,
      monthlyBudget,

      // 消息
      chatMessages,
      updateChatMessage,
    }),
    [
      addTransaction,
      budgets,
      categories,
      categoriesData,
      chatMessages,
      currentDate,
      dailySpent,
      dailyTotalTransactions,
      deleteLedgerCategory,
      ledgerId,
      ledgerInfo,
      monthlyBudget,
      monthlySpent,
      monthlyTransactions,
      transactions,
      updateChatMessage,
      updateLedgerBudgets,
      updateLedgerCategories,
      updateLedgerInfo,
      updateUserProfile,
      userId,
      userProfile,
    ]
  );
  // const contextValue = {};

  const handleLoginClick = () => {
    setShowLoginDialog(false);
    updateUserProfile({ isLogin: 1 });
    setActiveTab('mine');
  };

  const handleTabChange = (e: ITouchEvent, t: Tab) => {
    if (t === 'add') {
      if (ledgerInfo?.type === 0) {
        setShowLedgerDescDialog(true);
        e.stopPropagation();
      } else {
        setShowRecorder(true);
      }
    } else {
      if (t === activeTab) return; // 点击当前 Tab 不重复切换
      if (t === 'mine') {
        // Taro.showToast({ title: '请先登录', icon: 'none' });
        // fetchUserProfile();
        if (!userProfile?.isLogin) {
          Taro.showToast({ title: '请先登录', icon: 'none' });
          setShowLoginDialog(true);
          return;
        }
      }
      setActiveTab(t);
    }
  };

  // 1. 小程序切入后台（用户点击退出或切换App）时触发
  useDidHide(() => {
    console.log('[Lifecycle] 小程序进入后台，执行静默数据上报');
    // 这里 syncSendData 内部应该去读 storage 里的 'pending_sync_data'
    syncSendTransactionsData('onHide');
    syncSendLedgerData(userId, 'onHide');
  });

  // 2. 组件挂载完成（相当于启动）时触发
  useEffect(() => {
    console.log('[Lifecycle] 业务主组件已就绪，检查本地补发数据');
    // 检查是否有之前因断网没发出去的数据
    syncSendTransactionsData('onLaunch');
    // syncSendLedgerData(userId,'onLaunch');
  }, []); // 仅在初始化执行一次

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
        {showLedgerDescDialog && (
          <LedgerDescriptionDialog
            onClose={() => {
              setShowLedgerDescDialog(false);
              setShowRecorder(true);
            }}
          />
        )}

        {showLoginDialog && (
          <Dialog
            title='是否登录？'
            onCloseName='取消'
            onClickName='确认'
            onClose={() => setShowLoginDialog(false)}
            onClick={handleLoginClick}
            onClickStyle={{ backgroundColor: COLORS.primaryDark }}
            onClickTextStyle={{ color: COLORS.white }}
          />
        )}
      </View>
    </AppContext.Provider>
    // <Text style={{ height: '100%', width: '100%' }}>abc</Text>
  );
};
