import React from 'react';
import { View, Text } from '@tarojs/components';
import { Icon } from '@/components/ui';
import type { LedgerCategory } from '@/types';
import { COLORS } from '@/styles/colors';

interface CategoriesGridsProps {
  selectedCatId: string;
  categories: LedgerCategory[];
  onClick: (catId: string) => void;
  onEdit: () => void;
}

export const CategoriesGrids: React.FC<CategoriesGridsProps> = ({ selectedCatId, categories, onClick, onEdit }) => {
  return (
    <View
      style={{
        padding: '16px', // p-4
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap', // 关键：自动换行模拟 Grid
        paddingBottom: '240px', // 底部留白，防止紧贴底部
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
              width: '25%', // 5列布局 (100/5)
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
  );
};
