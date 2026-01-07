import React, { useMemo, useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useAppContext } from '@/context/AppContext';
import { Icon } from '@/components/ui/Icon';
import { FormatNumber } from '@/components/ui/format/Number';
import { TimerModal } from '@/components/ui/timer/Timer';

export const TopBarModal: React.FC<{
  header?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}> = ({ header, children, className }) => {
  return (
    <View className={className}>
      {/*
        对应类名: bg-primary pt-2 pb-1 px-4 sticky top-0 z-30 shadow-sm
      */}
      <View
        style={{
          backgroundColor: '#76BDB9', // bg-primary (根据你之前的配置)
          paddingTop: '8px', // pt-2 (2 * 4px)
          paddingBottom: '4px', // pb-1 (1 * 4px)
          paddingLeft: '16px', // px-4 (4 * 4px)
          paddingRight: '16px', // px-4
          position: 'sticky', // sticky
          top: 0, // top-0
          zIndex: 30, // z-30
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
        }}
      >
        {/* ⚠️ 注意：小程序必须把 <header> 改为 <View> */}
        {header && <View>{header}</View>}

        {/*
          对应类名: flex items-stretch mb-1 relative
        */}
        <View
          style={{
            display: 'flex', // flex
            alignItems: 'stretch', // items-stretch
            marginBottom: '4px', // mb-1
            position: 'relative', // relative
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
};

export default function TopBar({ onSetupBudget }: { onSetupBudget?: () => void }) {
  const { currentDate, setCurrentDate, currentLedger, monthlyBudget, monthlySpent } = useAppContext();
  const [showLedgerSetup, setShowLedgerSetup] = useState(false);

  return (
    <TopBarModal>
      {/* 账单月份 */}
      {/* 对应: mr-2 */}
      <View style={{ marginRight: '8px' }}>
        <TimerModal date={currentDate} setDate={setCurrentDate} />
      </View>

      {/*
        对应: grid grid-cols-3 w-full
        小程序用 Flex 模拟 Grid 三等分更稳定: 父容器 flex, 子元素 flex: 1
      */}
      <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        {/* --- 第一列：月度预算 --- */}
        <View
          onClick={() => onSetupBudget && onSetupBudget()}
          // 对应: flex flex-col justify-between
          style={{
            flex: 1, // 等分宽度
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* 对应: text-xs text-gray-900 (#111827) */}
          <Text style={{ fontSize: '12px', color: '#6b7280' }}>预算</Text>

          <View style={{ display: 'flex', alignItems: 'center' }}>
            {/* 注意：FormatNumber 内部也需要确保没有使用 span/div */}
            <FormatNumber
              value={monthlyBudget} // 对应 text-xs (12px)
              mainStyle={{ fontSize: '20px', color: '#111827' }}
              // 对应 text-[10px]
              decimalStyle={{ fontSize: '16px', color: '#111827' }}
            />
            {onSetupBudget && <Icon name='ChevronDown' size={12} style={{ marginLeft: '4px' }} strokeWidth={2} />}
          </View>
        </View>

        {/* --- 第二列：月度支出 --- */}
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ fontSize: '12px', color: '#6b7280' }}>支出</Text>
          <FormatNumber
            value={monthlySpent}
            mainStyle={{ fontSize: '20px', color: '#111827' }}
            // 对应 text-[10px]
            decimalStyle={{ fontSize: '16px', color: '#111827' }}
          />
        </View>

        {/* --- 第三列：月度盈余 --- */}
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ fontSize: '12px', color: '#6b7280' }}>盈余</Text>
          <FormatNumber
            value={monthlyBudget - monthlySpent}
            mainStyle={{ fontSize: '20px', color: '#111827' }}
            // 对应 text-[10px]
            decimalStyle={{ fontSize: '16px', color: '#111827' }}
          />
        </View>
      </View>
    </TopBarModal>
  );
}
