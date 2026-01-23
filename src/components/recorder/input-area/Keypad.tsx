import React from 'react';
import { View, Text } from '@tarojs/components'; // 1. 引入 Taro 组件
import { Icon } from '@/components/ui';
import { COLORS } from '@/styles/colors';

interface KeypadModalProps {
  onClick: (amountStr: string) => void;
}

export const KeypadModal: React.FC<KeypadModalProps> = ({ onClick }) => {
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'back'];

  return (
    // 容器: flex-1 bg-white
    <View
      style={{
        flex: 1, // 占据 InputAreaModal 左侧剩余空间
        backgroundColor: COLORS.white,
        display: 'flex',
        flexDirection: 'row', // 水平排列
        flexWrap: 'wrap', // 允许换行
        height: '100%', // 撑满父容器高度 (h-64)
      }}
    >
      {keys.map(k => (
        <View
          key={k}
          onClick={() => onClick(k.toString())}
          // 模拟 active:bg-gray-100
          hoverStyle={{ backgroundColor: COLORS.gray100 }}
          hoverStayTime={100}
          style={{
            // 布局：3列 x 4行
            width: '33.3333%', // 100% / 3
            height: '25%', // 100% / 4 (因为父容器是固定高度 h-64)

            // Flex 居中
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            // 边框: border-r border-b
            borderRightWidth: '1px',
            borderRightStyle: 'solid',
            borderRightColor: COLORS.gray100,
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: COLORS.gray100,

            // 关键：防止边框撑大尺寸导致换行错位
            boxSizing: 'border-box',
          }}
        >
          {k === 'back' ? (
            <Icon name='Delete' size={24} color={COLORS.black} />
          ) : (
            <Text
              style={{
                fontSize: '20px', // text-xl
                fontWeight: 500, // font-medium
                color: COLORS.black,
              }}
            >
              {k}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};
