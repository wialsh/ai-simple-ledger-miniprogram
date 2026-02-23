import React from 'react';
import { View, Text, ITouchEvent } from '@tarojs/components'; // 1. 引入 Taro 组件
import { Icon } from '@/components/ui';
import type { Tab } from '@/types';
import { COLORS } from '@/styles/colors';

interface TabBarProps {
  active: Tab;
  onChange: (e: ITouchEvent, t: Tab) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ active, onChange }) => {
  // 辅助函数：根据选中状态获取颜色
  const getColor = (tabName: Tab) => {
    return active === tabName ? COLORS.gray900 : COLORS.gray400;
  };

  // 辅助函数：通用 Tab Item 样式
  const tabItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // space-y-1 对应 marginTop
  };

  const textStyle = (tabName: Tab): React.CSSProperties => ({
    fontSize: '10px',
    marginTop: '4px', // space-y-1 的替代
    color: getColor(tabName),
  });

  return (
    // 容器: fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-6 flex justify-between items-center z-9 h-[80px]
    <View
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: COLORS.gray200,
        // 关键：适配 iPhone 底部安全区
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingTop: '8px', // pt-2
        paddingLeft: '24px', // px-6
        paddingRight: '24px', // px-6
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 80,
        height: '80px',
        boxSizing: 'content-box', // 确保 padding 不挤压高度，或者根据需要设为 border-box
      }}
    >
      {/* 1. 明细 Tab */}
      <View onClick={(e: ITouchEvent) => onChange(e, 'details')} style={tabItemStyle}>
        <Icon
          name='NotebookText'
          size={24}
          color={getColor('details')}
          strokeWidth={active === 'details' ? 2.5 : 1.5}
        />
        <Text style={textStyle('details')}>明细</Text>
      </View>

      {/* 2. 图表 Tab */}
      <View onClick={(e: ITouchEvent) => onChange(e, 'charts')} style={tabItemStyle}>
        <Icon name='ChartPie' size={24} color={getColor('charts')} strokeWidth={active === 'charts' ? 2.5 : 1.5} />
        <Text style={textStyle('charts')}>图表</Text>
      </View>

      {/* 3. 中间记账按钮 (凸起效果) */}
      <View
        onClick={(e: ITouchEvent) => onChange(e, 'add')}
        // className='flex flex-col items-center justify-center -mt-6'
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '-24px', // 凸起效果关键
        }}
      >
        {/* 圆形按钮背景 */}
        {/* w-14 h-14 (56px) bg-primary rounded-full shadow-lg border-4 border-white */}
        <View
          style={{
            width: '56px',
            height: '56px',
            backgroundColor: COLORS.primary,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', // shadow-lg
            borderWidth: '4px',
            borderStyle: 'solid',
            borderColor: COLORS.white,
          }}
        >
          <Icon name='Plus' size={32} color={COLORS.black} />
        </View>
        <Text
          style={{
            fontSize: '10px',
            color: COLORS.black,
            marginTop: '4px',
          }}
        >
          记账
        </Text>
      </View>

      {/* 4. 预算 Tab */}
      <View onClick={(e: ITouchEvent) => onChange(e, 'bill')} style={tabItemStyle}>
        <Icon name='Landmark' size={24} color={getColor('bill')} strokeWidth={active === 'bill' ? 2.5 : 1.5} />
        <Text style={textStyle('bill')}>账单</Text>
      </View>

      {/* 5. 我的 Tab */}
      <View onClick={(e: ITouchEvent) => onChange(e, 'mine')} style={tabItemStyle}>
        <Icon name='CircleUser' size={24} color={getColor('mine')} strokeWidth={active === 'mine' ? 2.5 : 1.5} />
        <Text style={textStyle('mine')}>我的</Text>
      </View>
    </View>
  );
};
