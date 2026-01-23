import React from 'react';
import { View, ScrollView } from '@tarojs/components';
import { NavBar, TopBar } from '@/components';

import { COLORS } from '@/styles/colors';

interface WindowsCustomProps {
  title?: string;
  className?: string;
  // 支持滚动锚点
  scrollIntoView?: string;
  style?: React.CSSProperties;
  header?: React.ReactNode;
  /** 主要内容区域 */
  children?: React.ReactNode;
  bottom?: React.ReactNode;
  onBack?: () => void;
  showNavBar?: boolean;
  showTopBar?: boolean;
}

export const WindowsCustom: React.FC<WindowsCustomProps> = ({
  title,
  className,
  scrollIntoView,
  style,
  header,
  children,
  bottom,
  onBack,
  showNavBar = false,
  showTopBar = false,
}) => {
  return (
    // 最外层容器：全屏高度，flex-col
    <View
      className={className}
      style={{
        height: '100vh', // 关键：限制高度为视口高度
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLORS.gray50, // 最好给个背景色
        overflow: 'hidden', // 防止整体滚动
        ...style,
      }}
    >
      {/* Header */}
      <View style={{ flexShrink: 0 }}>
        {header ? header : showNavBar ? <NavBar title={title} showBack={!!onBack} onBack={onBack} /> : null}
        {showTopBar ? <TopBar /> : null}
      </View>

      {/* 占据剩余空间 */}
      <ScrollView
        scrollY
        enableFlex
        scrollWithAnimation // 开启平滑滚动
        // 绑定 scrollIntoView
        scrollIntoView={scrollIntoView}
        style={{
          flex: 1, // 占据剩余高度
          height: '1px', // Trick: 在 Flex 布局中强制 ScrollView 生效
          width: '100%',
        }}
      >
        {/* 内部容器：负责 padding-bottom (避让 TabBar) */}
        <View style={{ paddingBottom: '240px' }}>{children}</View>
      </ScrollView>
      {bottom ? bottom : null}
    </View>
  );
};
