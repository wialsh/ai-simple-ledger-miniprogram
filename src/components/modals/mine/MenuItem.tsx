import React from 'react';
import { View, Text } from '@tarojs/components'; // 1. 引入 Taro 组件
import { Icon } from '@/components/ui/Icon';

interface MenuItemProps {
  icon: string;
  label: string;
  onClick?: () => void;
  className?: string; // 允许父组件传入额外的类名 (比如控制 last-border-0)
}

// 定义颜色常量
const COLORS = {
  gray50: '#f9fafb', // hover 背景
  gray100: '#f3f4f6', // 边框
  gray300: '#d1d5db', // 箭头颜色
  gray600: '#4b5563', // 图标颜色
  gray700: '#374151', // 文字颜色
};

export const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick, className }) => (
  <View
    onClick={onClick}
    // 1. 交互态：active:bg-gray-50 对应 Taro 的 hoverStyle
    hoverStyle={{ backgroundColor: COLORS.gray50 }}
    hoverStayTime={100} // 点击后保持一下背景色，体验更好
    // 2. 允许传入 className (例如父级可能想传入 last-border-0)
    // 这里的 'last-border-0' 需要你在 common.scss 中定义过 &:last-child { border-bottom: none }
    className={`menu-item ${className || ''}`}
    // 3. 基础样式
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px', // p-4
      borderBottomWidth: '1px', // border-b
      borderBottomStyle: 'solid',
      borderBottomColor: COLORS.gray100,
    }}
  >
    {/* Left Side: Icon + Label */}
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {/* Icon */}
      <Icon name={icon} size={20} color={COLORS.gray600} />

      {/* Label */}
      <Text
        style={{
          fontSize: '14px', // text-sm
          fontWeight: 500, // font-medium
          color: COLORS.gray700,
          marginLeft: '12px', // space-x-3 (3 * 4px)
        }}
      >
        {label}
      </Text>
    </View>

    {/* Right Side: Chevron */}
    <Icon name='ChevronRight' size={16} color={COLORS.gray300} />
  </View>
);
