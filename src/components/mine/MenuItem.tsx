import React from 'react';
import { View, Text } from '@tarojs/components';
import { Icon } from '@/components/ui';
import { COLORS } from '@/styles/colors';

interface MenuItemProps {
  icon: string;
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean; // ✨ 1. 新增 disabled 属性
}

export const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick, className, disabled = false }) => (
  <View
    // ✨ 2. 逻辑控制：如果禁用，不传 onClick 事件
    onClick={disabled ? undefined : onClick}
    // ✨ 3. 交互控制：如果禁用，传入空对象屏蔽点击态背景色
    hoverStyle={disabled ? {} : { backgroundColor: COLORS.gray50 }}
    hoverStayTime={100}
    className={`menu-item ${className || ''}`}
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: COLORS.gray100,

      // ✨ 4. 视觉控制：降低透明度来实现“置灰”效果
      opacity: disabled ? 0.5 : 1,
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
      <Icon name={icon} size={20} color={COLORS.gray600} />

      <Text
        style={{
          fontSize: '14px',
          fontWeight: 500,
          color: COLORS.gray700,
          marginLeft: '12px',
        }}
      >
        {label}
      </Text>
    </View>

    {/* Right Side: Chevron */}
    {/* 如果禁用，通常也可以选择隐藏箭头，或者保持置灰显示，这里保持置灰 */}
    <Icon name='ChevronRight' size={16} color={COLORS.gray300} />
  </View>
);
