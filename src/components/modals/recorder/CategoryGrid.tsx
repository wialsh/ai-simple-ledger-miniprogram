import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components'; // 1. 引入 Taro 组件
import { Icon } from '@/components/ui/Icon';
import { LedgerCategory } from '@/types';

interface CategoryGridModalProps {
  selectedCatId: string;
  categories: LedgerCategory[];
  onClick: (catId: string) => void;
  onEdit: () => void;
}

// 定义颜色常量
const COLORS = {
  primaryDark: '#49807D', // bg-primary-dark
  primaryDark5: '#406F6D', // text-primary-dark5 (假设)
  gray100: '#f3f4f6', // bg-gray-100
  gray300: '#d1d5db', // border-gray-300
  gray500: '#6b7280', // text-gray-500
  white: '#ffffff',
};

export const CategoryGridModal: React.FC<CategoryGridModalProps> = ({ selectedCatId, categories, onClick, onEdit }) => {
  return (
    // className='flex-1 overflow-y-auto p-4'
    <ScrollView
      scrollY
      enableFlex // 开启 Flex 布局支持
      style={{
        flex: 1,
        // ScrollView 需要指定高度，在 Flex 容器中通常配合 flex: 1 生效
        // 如果外层没有 flex 约束，可能需要 height: '100%'
        width: '100%',
      }}
    >
      <View
        style={{
          padding: '16px', // p-4
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap', // 关键：自动换行模拟 Grid
          // gap 在小程序 View 中支持良好，或者用 margin 替代
          // gap: '24px', // gap-y-6 (水平间距默认0，或者也设一下)
        }}
      >
        {categories.map(cat => {
          const isSelected = selectedCatId === cat.id;

          return (
            <View
              key={cat.id}
              onClick={() => onClick(cat.id)}
              style={{
                // 模拟 grid-cols-4：每个元素宽度 25%
                width: '25%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '24px', // gap-y-6 的替代
              }}
            >
              {/* 圆形图标容器 */}
              <View
                style={{
                  width: '48px', // w-12
                  height: '48px', // h-12
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px', // mb-1
                  // 选中态样式
                  backgroundColor: isSelected ? COLORS.primaryDark : COLORS.gray100,
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                  transition: 'all 0.2s', // 动画过渡
                }}
              >
                <Icon
                  name={cat.componentName}
                  size={20}
                  // 直接传颜色属性，而不是 className
                  color={isSelected ? COLORS.white : COLORS.gray500}
                />
              </View>

              {/* 文字标签 */}
              <Text
                style={{
                  fontSize: '12px', // text-xs
                  color: isSelected ? COLORS.primaryDark5 : COLORS.gray500,
                  fontWeight: isSelected ? 'bold' : 'normal', // 选中加粗体验更好
                }}
              >
                {cat.name}
              </Text>
            </View>
          );
        })}

        {/* 自定义按钮 (放在列表最后) */}
        <View
          onClick={onEdit}
          style={{
            width: '25%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <View
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: COLORS.gray100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '4px',
              borderWidth: '2px',
              borderStyle: 'dashed',
              borderColor: COLORS.gray300,
              boxSizing: 'border-box', // 确保边框不撑大尺寸
            }}
          >
            <Icon name='Settings' size={20} color={COLORS.gray500} />
          </View>
          <Text style={{ fontSize: '12px', color: COLORS.gray500 }}>自定义</Text>
        </View>
      </View>
    </ScrollView>
  );
};
