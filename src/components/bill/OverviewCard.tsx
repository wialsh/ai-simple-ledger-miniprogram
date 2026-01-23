import React from 'react';
import { View, Text } from '@tarojs/components';
import { COLORS } from '@/styles/colors';
import { NumberFormat } from '@/components/ui';

interface BillOverviewCardProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const BillOverviewCard: React.FC<BillOverviewCardProps> = ({ totalIncome, totalExpense, balance }) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.primaryDark, // 背景
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '16px',
      }}
    >
      <Text style={{ fontSize: '12px', color: COLORS.gray600, marginBottom: '8px' }}>结余</Text>

      {/* 大号结余金额 */}
      <NumberFormat
        value={balance}
        mainStyle={{ fontSize: '36px', fontWeight: 'bold', color: COLORS.gray900 }} // gray-900
        decimalStyle={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.gray900 }}
        style={{ marginBottom: '24px' }}
      />

      {/* 底部收入支出行 */}
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontSize: '12px', color: COLORS.gray600, marginRight: '4px' }}>预算</Text>
          <NumberFormat
            value={totalIncome}
            mainStyle={{ fontSize: '16px', color: COLORS.gray900 }}
            decimalStyle={{ fontSize: '12px', color: COLORS.gray900 }}
          />
        </View>

        <View>
          <Text style={{ fontSize: '12px', color: COLORS.gray600, marginRight: '4px' }}>支出</Text>
          <NumberFormat
            value={totalExpense}
            mainStyle={{ fontSize: '16px', color: COLORS.gray900 }}
            decimalStyle={{ fontSize: '12px', color: COLORS.gray900 }}
          />
        </View>
      </View>
    </View>
  );
};
