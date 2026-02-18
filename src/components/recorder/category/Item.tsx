import React from 'react';
import { View, Text } from '@tarojs/components';
import { Icon } from '@/components/ui';
import { COLORS } from '@/styles/colors';
import { LedgerCategory } from '@/types';

// 必须使用 React.memo，否则父组件一更新，1000个子组件全部重绘，必卡无疑
export const CategoryItem = React.memo(
  ({
    category,
    index,
    onLongPress,
    onDelete,
    isHidden,
  }: {
    category: LedgerCategory;
    index: number;
    onLongPress: (index: number) => void;
    onDelete: (catId: number) => void;
    isHidden: boolean;
  }) => {
    return (
      <View
        // 绑定长按事件
        onLongPress={() => onLongPress(index)}
        style={{
          height: '60px', // 固定高度 ITEM_HEIGHT
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '0 16px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: COLORS.gray100,
          backgroundColor: COLORS.white,
          opacity: isHidden ? 0 : 1,
          // 只有不隐藏时才过渡，避免拖拽时的闪烁
          transition: isHidden ? 'none' : 'opacity 0.2s',
        }}
      >
        <View
          onClick={e => {
            e.stopPropagation();
            onDelete(category.catId);
          }}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '999px',
            backgroundColor: COLORS.red500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px',
            flexShrink: 0,
          }}
        >
          <Icon name='Minus' size={16} color={COLORS.white} />
        </View>
        <View
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '999px',
            backgroundColor: COLORS.gray100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            flexShrink: 0,
          }}
        >
          <Icon name={category.iconName} size={20} color={category.iconColor} />
        </View>
        <Text style={{ flex: 1, fontWeight: 500, color: COLORS.black, fontSize: '16px' }}>{category.name}</Text>

        {/* 视觉把手 */}
        <View style={{ padding: '8px', pointerEvents: 'none' }}>
          <Icon name='Menu' size={20} color={COLORS.gray400} />
        </View>
      </View>
    );
    // 只有当 isHidden 状态改变，或者 category 本身数据改变时才重渲染
  },
  (prev, next) => prev.isHidden === next.isHidden && prev.category === next.category && prev.index === next.index
);
