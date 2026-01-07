import React from 'react';
import { View, Text } from '@tarojs/components';
import { Icon } from '@/components/ui/Icon';
// 假设你使用的是我们刚才改写的支持 style 对象的 FormatNumber
import { FormatNumber } from '@/components/ui/format/Number';

interface BudgetCardProps {
  totalBudget?: number;
  currentSpent?: number;
  onClick?: () => void;
}

// 定义颜色常量
const COLORS = {
  white: '#ffffff',
  gray100: '#f3f4f6', // 分割线
  gray300: '#d1d5db',
  gray500: '#6b7280',
  gray700: '#374151',
  gray800: '#1f2937',
  primary: '#76BDB9', // 进度条颜色 (深色)
  primaryLight: '#DEECEB', // 进度条底色 (浅色)
};

export const BudgetCard: React.FC<BudgetCardProps> = ({ totalBudget = 0, currentSpent = 0, onClick }) => {
  // 计算逻辑
  const remaining = totalBudget - currentSpent;
  // 进度百分比
  const percent = totalBudget > 0 ? Math.max(0, Math.min(100, Math.round((remaining / totalBudget) * 100))) : 0;

  return (
    <View
      onClick={onClick}
      // className='bg-white rounded-2xl p-5 shadow-sm mb-4'
      style={{
        backgroundColor: COLORS.white,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* 标题栏 */}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <Text style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.gray800 }}>当月预算</Text>
        <Icon name='ChevronRight' size={20} color={COLORS.gray300} />
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {/*
           ⚠️ 核心替换：使用 CSS 实现圆环
           原理：外层圆(锥形渐变) + 内层圆(白色) = 圆环
        */}
        <View
          style={{
            position: 'relative',
            width: '112px', // w-28 (28 * 4px)
            height: '112px', // h-28
            marginRight: '24px',
            flexShrink: 0,
            borderRadius: '50%',
            // ✨ CSS Magic: 锥形渐变实现进度条
            background: `conic-gradient(${COLORS.primary} ${percent}%, ${COLORS.primaryLight} 0%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* 内部遮罩圆 (白色) 用来把实心圆变成空心圆环 */}
          <View
            style={{
              width: '96px', // 112 - 16 (strokeWidth 8 * 2)
              height: '96px',
              backgroundColor: COLORS.white,
              borderRadius: '50%',
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: '12px', color: COLORS.gray300, marginBottom: '2px' }}>剩余</Text>
            <Text style={{ fontSize: '14px', color: COLORS.gray800 }}>{percent}%</Text>
          </View>
        </View>

        {/* 右侧：数据列表 */}
        <View style={{ flex: 1 }}>
          {/* 第一行：剩余预算 (大字) */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <Text style={{ fontSize: '14px', fontWeight: 500, color: COLORS.gray800 }}>剩余预算</Text>

            {/* FormatNumber 调用调整 */}
            <FormatNumber
              value={remaining}
              // 对应 className='text-3xl font-medium ...'
              mainStyle={{ fontSize: '30px', fontWeight: 500, color: COLORS.gray800 }}
              // 对应 subClassName='text-xl ...'
              decimalStyle={{ fontSize: '20px', fontWeight: 500, color: COLORS.gray800 }}
            />
          </View>

          {/* 分割线 h-px w-full bg-gray-100 */}
          <View
            style={{
              height: '1px',
              width: '100%',
              backgroundColor: COLORS.gray100,
              margin: '12px 0',
              display: 'block',
            }}
          />

          {/* 第二行：本月预算 (小字灰色) */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              marginBottom: '4px', // space-y-3 的一部分
            }}
          >
            <Text style={{ color: COLORS.gray500 }}>本月预算</Text>
            <FormatNumber
              value={totalBudget}
              mainStyle={{ fontSize: '18px', color: COLORS.gray500 }}
              decimalStyle={{ fontSize: '12px', color: COLORS.gray500 }}
            />
          </View>

          {/* 第三行：本月支出 (小字灰色) */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
            }}
          >
            <Text style={{ color: COLORS.gray500 }}>本月支出</Text>
            <FormatNumber
              value={currentSpent}
              mainStyle={{ fontSize: '18px', color: COLORS.gray500 }}
              decimalStyle={{ fontSize: '12px', color: COLORS.gray500 }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
