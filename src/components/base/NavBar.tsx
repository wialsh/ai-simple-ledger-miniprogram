import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useNavInfo } from '@/hooks';
import { Icon } from '@/components/ui';
import { COLORS } from '@/styles/colors';

interface NavBarProps {
  title?: string;
  background?: string;
  color?: string; // 文字/图标颜色
  showBack?: boolean; // 是否显示返回按钮
  onBack?: () => void; // 自定义返回事件
  renderLeft?: React.ReactNode; // 自定义左侧内容
  renderCenter?: React.ReactNode; // 自定义中间内容 (替代标题)
}

export const NavBar: React.FC<NavBarProps> = ({
  title,
  background = COLORS.white,
  color = COLORS.black,
  showBack = false,
  onBack,
  renderLeft,
  renderCenter,
}) => {
  const { statusBarHeight, navContentHeight, navHeight, menuButtonWidth, menuButtonRight } = useNavInfo();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      Taro.navigateBack();
    }
  };

  return (
    // 占位容器：防止导航栏遮挡页面内容
    // 如果希望导航栏悬浮在内容之上（透明背景），可以把 height 设为 0 或删除这个 View
    <View style={{ height: `${navHeight}px`, width: '100%' }}>
      {/* 真实的导航栏 (Fixed 定位) */}
      <View
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: background,
          height: `${navHeight}px`,
        }}
      >
        {/* 1. 状态栏占位 (电量/时间条) */}
        <View style={{ height: `${statusBarHeight}px` }} />

        {/* 2. 内容区域 (高度 = navContentHeight) */}
        <View
          style={{
            height: `${navContentHeight}px`,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
            paddingLeft: `${menuButtonRight}px`, // 左边距跟右边距保持一致
            paddingRight: `${menuButtonWidth + menuButtonRight}px`, // 右边避让胶囊按钮
          }}
        >
          {/* 左侧区域：返回按钮 或 自定义 */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              height: '100%',
              zIndex: 10,
            }}
          >
            {renderLeft ? (
              renderLeft
            ) : showBack ? (
              <View onClick={handleBack} style={{ padding: '4px 8px 4px 0' }}>
                <Icon name='ChevronLeft' size={24} color={color} />
              </View>
            ) : null}
          </View>

          {/* 中间区域：标题 或 自定义 (绝对定位居中) */}
          <View
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: '50%', // 防止标题太长碰到两边
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {renderCenter ? (
              renderCenter
            ) : title ? (
              <Text
                style={{
                  fontSize: '17px',
                  fontWeight: 600, // 小程序标准字重
                  color: color,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};
