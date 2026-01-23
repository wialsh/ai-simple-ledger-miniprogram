import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useAppContext } from '@/context/AppContext';
import { NumberFormat } from '@/components/ui/format';
import { Icon, StickyBar } from '@/components/ui';
import { COLORS } from '@/styles/colors';
import { TransactionsTimePicker } from './TransTimePicker';

export const TopBar = ({ onSetupBill }: { onSetupBill?: () => void }) => {
  const { currentDate, setCurrentDate, monthlyBudget, monthlySpent } = useAppContext();
  const [showBudget, setShowBudget] = useState(false);

  useEffect(() => {
    setShowBudget(monthlyBudget > 0);
  }, [monthlyBudget]);

  return (
    <StickyBar>
      {/* 账单月份 */}
      {/* 对应: mr-2 */}
      <View style={{ marginRight: '8px' }}>
        <TransactionsTimePicker date={currentDate} setDate={setCurrentDate} />
      </View>
      {/*
        对应: grid grid-cols-3 w-full
        小程序用 Flex 模拟 Grid 三等分更稳定: 父容器 flex, 子元素 flex: 1
      */}
      <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        {/* --- 第一列：月度预算 --- */}
        {showBudget && (
          <View
            onClick={() => onSetupBill && onSetupBill()}
            // 对应: flex flex-col justify-between
            style={{
              flex: 1, // 等分宽度
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontSize: '12px', color: COLORS.gray500 }}>预算</Text>

            <View style={{ display: 'flex', alignItems: 'center' }}>
              {/* 注意：NumberFormat 内部也需要确保没有使用 span/div */}
              <NumberFormat
                value={monthlyBudget} // 对应 text-xs (12px)
                mainStyle={{ fontSize: '20px', color: COLORS.gray900 }}
                // 对应 text-[10px]
                decimalStyle={{ fontSize: '16px', color: COLORS.gray900 }}
              />
              {onSetupBill && <Icon name='ChevronDown' size={12} style={{ marginLeft: '4px' }} strokeWidth={2} />}
            </View>
          </View>
        )}

        {/* --- 第二列：月度支出 --- */}
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ fontSize: '12px', color: COLORS.gray500 }}>支出</Text>
          <NumberFormat
            value={monthlySpent}
            mainStyle={{ fontSize: '20px', color: COLORS.gray900 }}
            // 对应 text-[10px]
            decimalStyle={{ fontSize: '16px', color: COLORS.gray900 }}
          />
        </View>

        {/* --- 第三列：月度盈余 --- */}
        {showBudget && (
          <View
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontSize: '12px', color: COLORS.gray500 }}>盈余</Text>
            <NumberFormat
              value={monthlyBudget - monthlySpent}
              mainStyle={{ fontSize: '20px', color: COLORS.gray900 }}
              // 对应 text-[10px]
              decimalStyle={{ fontSize: '16px', color: COLORS.gray900 }}
            />
          </View>
        )}
      </View>
    </StickyBar>
  );
};
