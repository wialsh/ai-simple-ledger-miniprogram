import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, MovableArea, MovableView } from '@tarojs/components';
import { AppContext } from '@/context/AppContext';
import { WindowsCustom, Icon } from '@/components';
import type { LedgerCategory } from '@/types';
import { COLORS } from '@/styles/colors';
import { AddCategoryDialog } from './AddDialog';
import { CategoryItem } from './Item';

interface CategorySettingsPageProps {
  onBack: () => void;
}

// 📏 常量配置
const ITEM_HEIGHT = 60;
const SCROLL_ZONE = 80; // 上下边缘 80px 触发滚动
const SCROLL_SPEED = 15; // 滚动速度

export const CategorySettingsPage: React.FC<CategorySettingsPageProps> = ({ onBack }) => {
  const { categories, deleteLedgerCategory, updateLedgerCategories } = useContext(AppContext);
  const [showAdd, setShowAdd] = useState(false);
  const [localCategories, setLocalCategories] = useState<LedgerCategory[]>([]);

  // --- 拖拽状态 ---
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(-1); // 原位置索引
  const [movableY, setMovableY] = useState(0); // 浮层 Y
  const [areaHeight, setAreaHeight] = useState(0);

  // --- 滚动状态 ---
  const [scrollTop, setScrollTop] = useState(0);

  // Refs (不触发渲染)
  const scrollTopRef = useRef(0);
  const scrollViewHeightRef = useRef(0);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // console.log('CategorySettingsPage 渲染', { ledgerInfo, localCategories, isDragging, dragIndex, scrollTop });

  useEffect(() => {
    setLocalCategories(categories || []);
  }, [categories]);

  useEffect(() => {
    setAreaHeight(localCategories.length * ITEM_HEIGHT);
    // setMaxCategories(localCategories.length > 0 && localCategories.length <= 1000 ? localCategories.length : 1000);
  }, [localCategories]);

  const handleScroll = (e: any) => {
    scrollTopRef.current = e.detail.scrollTop;
  };

  // --- 自动滚动逻辑 (定时器驱动) ---
  const startAutoScroll = (direction: 1 | -1) => {
    if (scrollIntervalRef.current) return; // 已经在滚了

    scrollIntervalRef.current = setInterval(() => {
      const current = scrollTopRef.current;
      let next = current;

      if (direction === -1) {
        // 向上
        next = Math.max(0, current - SCROLL_SPEED);
      } else {
        // 向下
        // 预留一些缓冲空间
        const maxScroll = localCategories.length * ITEM_HEIGHT - scrollViewHeightRef.current + 100;
        next = Math.min(maxScroll, current + SCROLL_SPEED);
      }

      if (next !== current) {
        setScrollTop(next); // 触发 ScrollView 更新
        scrollTopRef.current = next; // 同步 Ref
      }
    }, 20); // 20ms 刷新一次，约 50fps
  };

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  // --- 拖拽逻辑 ---
  const handleLongPress = (index: number) => {
    // Taro.vibrateShort({ type: 'medium' });
    setIsDragging(true);
    setDragIndex(index);
    setMovableY(index * ITEM_HEIGHT);
  };

  const handleDragChange = (e: any) => {
    if (!isDragging || e.detail.source !== 'touch') return;

    const currentY = e.detail.y; // 绝对 Y
    const visualY = currentY - scrollTopRef.current; // 相对屏幕 Y

    // 1. 边缘检测与自动滚动
    if (visualY < SCROLL_ZONE) {
      startAutoScroll(-1);
    } else if (visualY > scrollViewHeightRef.current - SCROLL_ZONE) {
      startAutoScroll(1);
    } else {
      stopAutoScroll();
    }

    // 2. 排序交换
    const hoverIndex = Math.round(currentY / ITEM_HEIGHT);
    if (hoverIndex < 0 || hoverIndex >= localCategories.length) return;

    if (hoverIndex !== dragIndex) {
      const newList = [...localCategories];
      const item = newList[dragIndex];
      newList.splice(dragIndex, 1);
      newList.splice(hoverIndex, 0, item);

      setLocalCategories(newList);
      setDragIndex(hoverIndex);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragIndex(-1);
    stopAutoScroll();
    updateLedgerCategories(localCategories);
  };

  console.log('CategorySettingsPage 渲染', { localCategories });

  return (
    <View>
      <WindowsCustom
        onBack={onBack}
        showNavBar
        className='animate-slide-up'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          backgroundColor: COLORS.white,
          display: 'flex',
          flexDirection: 'column', // 垂直排列
        }}
        bottom={
          <View
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px',
              backgroundColor: COLORS.white,
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: COLORS.gray100,
              zIndex: 100,
              paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
            }}
          >
            {/* Bottom Button */}
            <View
              onClick={() => setShowAdd(true)}
              hoverStyle={{ transform: 'scale(0.98)', opacity: 0.9 }}
              style={{
                width: '100%',
                backgroundColor: COLORS.primary,
                borderRadius: '12px',
                paddingTop: '14px',
                paddingBottom: '14px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Icon name='Plus' size={20} color={COLORS.black} />
              <Text style={{ color: COLORS.black, fontWeight: 'bold', fontSize: '16px' }}>添加分类</Text>
            </View>
          </View>
        }
      >
        {/* MovableArea */}
        <MovableArea
          style={{
            width: '100%',
            // 保证高度足够大
            height: `${Math.max(areaHeight, scrollViewHeightRef.current + 50)}px`,
            backgroundColor: COLORS.white,
            paddingBottom: '100px', // 底部留白，防止紧贴底部
          }}
        >
          {localCategories.map((category, index) => (
            // 使用 React.memo 优化的组件
            <CategoryItem
              key={category.catId}
              index={index}
              category={category}
              onLongPress={handleLongPress}
              onDelete={deleteLedgerCategory}
              isHidden={isDragging && index === dragIndex}
            />
          ))}

          {/* 浮层替身 (仅在拖拽时显示) */}
          {isDragging && dragIndex !== -1 && localCategories[dragIndex] && (
            <MovableView
              y={movableY}
              direction='vertical'
              damping={50}
              friction={2}
              onChange={handleDragChange}
              onTouchEnd={handleDragEnd}
              style={{
                width: '100%',
                height: `${ITEM_HEIGHT}px`,
                zIndex: 100,
                backgroundColor: 'rgba(255,255,255,0.95)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '0 16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                borderTopColor: COLORS.gray100,
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: COLORS.gray100,
              }}
            >
              {/* 替身内容 (静态) */}
              <View
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '999px',
                  backgroundColor: COLORS.red500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
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
                }}
              >
                <Icon name={localCategories[dragIndex].iconName} size={20} color={COLORS.gray600} />
              </View>
              <Text style={{ flex: 1, fontWeight: 500, color: COLORS.gray800, fontSize: '16px' }}>
                {localCategories[dragIndex].name}
              </Text>
              <View style={{ padding: '24px' }}>
                <Icon name='Menu' size={20} color={COLORS.primary} />
              </View>
            </MovableView>
          )}
        </MovableArea>

        <View style={{ height: '100px' }} />
      </WindowsCustom>

      {showAdd && <AddCategoryDialog onClose={() => setShowAdd(false)} />}
    </View>
  );
};
