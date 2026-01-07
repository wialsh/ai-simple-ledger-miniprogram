import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { View, Text } from '@tarojs/components';
import TopBar from '@/components/bar/TopBar';
import * as dateUtils from '@/utils/dateUtils';
import * as formatUtil from '@/utils/formatUtil';
import { TransEmptyModal } from './TransEmpty';
import { TransCardModal } from './TransCard';

export const DetailsPage: React.FC = () => {
  const { dailyTotalTransactions } = useAppContext();

  return (
    <View
      style={{
        paddingBottom: '96px', // pb-24
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <TopBar />

      {/* List */}
      <View style={{ flex: 1 }}>
        {dailyTotalTransactions.length === 0 ? (
          <TransEmptyModal />
        ) : (
          dailyTotalTransactions.map((dailyTransGroup, idx) => (
            <View key={idx} style={{ backgroundColor: '#ffffff', marginBottom: '8px' }}>
              {/* Date Header */}
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 16px', // py-2 px-4
                  borderBottom: '1px solid #f9fafb', // border-gray-50
                  backgroundColor: 'rgba(249, 250, 251, 0.5)', // bg-gray-50/50
                }}
              >
                <Text style={{ color: '#6b7280', fontSize: '12px' }}>
                  {dateUtils.formatDate(dailyTransGroup.date, 'MMM dd, EEEE')}
                </Text>
                <Text style={{ color: '#9ca3af', fontSize: '12px' }}>
                  {dailyTransGroup.amount > 0 && `支出: ${formatUtil.formatNumber(dailyTransGroup.amount)}`}
                </Text>
              </View>

              {/* Transactions Items */}
              {dailyTransGroup.items.map((dailyTrans, itemIdx) => {
                // 判断是否是最后一个元素，模拟 last:border-0
                const isLastItem = itemIdx === dailyTransGroup.items.length - 1;

                return <TransCardModal key={dailyTrans.id} transaction={dailyTrans} isLastItem={isLastItem} />;
              })}
            </View>
          ))
        )}
      </View>
    </View>
  );
};
