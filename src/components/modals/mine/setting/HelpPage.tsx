import React from 'react';
import { View, Text, RootPortal } from '@tarojs/components'; // 1. 引入 Taro 组件
import { Icon } from '@/components/ui/Icon';

interface HelpPageProps {
  onClose: () => void;
}

// 定义颜色常量
const COLORS = {
  gray50: '#f9fafb', // bg-gray-50 (对应原代码 bg-gray-100 可能稍深，这里统一用 gray50 或 gray100)
  gray100: '#f3f4f6', // border-gray-100 / bg-gray-100
  white: '#ffffff',
  black: '#000000',
};

export const HelpPage: React.FC<HelpPageProps> = ({ onClose }) => {
  return (
    // 使用 RootPortal 确保覆盖全屏，不受父级 z-index 影响
    <RootPortal>
      <View
        className='animate-slide-up' // 需在 common.scss 定义动画
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 800, // z-[80]
          backgroundColor: COLORS.gray100, // bg-gray-100
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: COLORS.white,
            paddingTop: '16px', // py-4
            paddingBottom: '16px', // py-4
            paddingLeft: '16px', // px-4
            paddingRight: '16px', // px-4
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: COLORS.gray100,
            position: 'relative',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
            zIndex: 10,
          }}
        >
          {/* Back Button */}
          <View
            onClick={onClose}
            // 模拟 hover:bg-gray-100
            hoverStyle={{ backgroundColor: COLORS.gray100 }}
            style={{
              padding: '8px',
              marginLeft: '-8px', // -ml-2
              borderRadius: '999px', // rounded-full
              position: 'absolute',
              left: '16px', // left-4
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name='ChevronLeft' size={24} />
          </View>

          {/* Title */}
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '18px', // text-lg
              color: COLORS.black,
            }}
          >
            帮助与反馈
          </Text>
        </View>

        {/* Content Placeholder (如果不加内容，下面就是空的灰底) */}
        <View style={{ flex: 1, padding: '16px' }}>
          {/* 这里可以放置具体帮助内容 */}
          <Text style={{ fontSize: '14px', color: '#6b7280' }}>此处为帮助内容...</Text>
        </View>
      </View>
    </RootPortal>
  );
};
