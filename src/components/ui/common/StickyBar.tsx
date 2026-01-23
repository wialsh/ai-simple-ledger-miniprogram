import React from 'react';
import { View } from '@tarojs/components';
import { COLORS } from '@/styles/colors';

interface StickyBarProps {
  /** 主要内容区域 */
  children?: React.ReactNode;
  /** 外部样式类名 */
  className?: string;
  /** 是否开启吸顶 (默认为 true) */
  sticky?: boolean;
}

export const StickyBar: React.FC<StickyBarProps> = ({ children, className, sticky = true }) => {
  return (
    <View className={className}>
      <View
        style={{
          backgroundColor: COLORS.primary,
          paddingTop: '8px',
          paddingBottom: '4px',
          paddingLeft: '16px',
          paddingRight: '16px',
          // 灵活控制吸顶
          position: sticky ? 'sticky' : 'relative',
          top: sticky ? 0 : undefined,
          zIndex: 50,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* 内容区域 */}
        <View
          style={{
            display: 'flex',
            alignItems: 'stretch',
            marginBottom: '4px',
            position: 'relative',
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
};
