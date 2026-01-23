import React, { useState, useRef } from 'react';
import { View, Text, ITouchEvent } from '@tarojs/components'; // 1. 引入 ITouchEvent
import { Icon, Dialog } from '@/components/ui';
import { COLORS } from '@/styles/colors';
import { Ledger } from '@/types';

interface LedgerCardProps {
  ledger: Ledger;
  onClick: (ledgerId: number) => void;
  onEdit: (e: any, ledgerId: number) => void; // Taro 事件对象不同
  onDelete: (ledgerId: number) => void;
}

export const LedgerCard: React.FC<LedgerCardProps> = ({ ledger, onClick, onEdit, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // --- 状态管理 ---
  const [actionWidth, setActionWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // --- Refs ---
  const startX = useRef(0);
  const startY = useRef(0);
  const startWidth = useRef(0);
  const startTime = useRef(0);

  // --- 常量配置 ---
  const BTN_WIDTH = 70;
  const BTN_COUNT = 2;
  const MAX_WIDTH = BTN_WIDTH * BTN_COUNT; // 140
  const SNAP_THRESHOLD = BTN_WIDTH;

  const handleTouchStart = (e: ITouchEvent) => {
    // 阻止冒泡防止触发外层点击 (可选，视情况而定)
    // e.stopPropagation();

    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    startWidth.current = actionWidth;
    startTime.current = Date.now();
    setIsDragging(true);
  };

  const handleTouchMove = (e: ITouchEvent) => {
    // 如果没有在拖动，不处理
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - startX.current;
    const deltaY = currentY - startY.current;

    // 1. 垂直滚动判定：如果垂直移动幅度大于水平，认为是页面滚动，不处理
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    // 阻止页面滚动 (在 Taro 小程序 View 上直接 catchMove 可能需要配置 catchMove={true}，或者使用 catchTouchMove)
    // 注意：在小程序中阻止默认滚动比较麻烦，通常通过样式 overflow: hidden 或 catchTouchMove 实现

    // 2. 计算目标宽度
    // 向左滑(deltaX < 0) -> 宽度增加
    const moveDistance = -deltaX;
    let newWidth = startWidth.current + moveDistance;

    // 3. 限制范围
    newWidth = Math.max(0, Math.min(MAX_WIDTH, newWidth));

    setActionWidth(newWidth);
  };

  const handleTouchEnd = (e: ITouchEvent) => {
    setIsDragging(false);

    const endTime = Date.now();
    const timeElapsed = endTime - startTime.current;
    const currentX = e.changedTouches[0].clientX;
    const deltaX = currentX - startX.current;

    // 1. 快速滑动检测
    if (timeElapsed < 300 && Math.abs(deltaX) > 30) {
      if (deltaX < 0) {
        // 向左
        setActionWidth(MAX_WIDTH);
      } else {
        // 向右
        setActionWidth(0);
      }
    }
    // 2. 普通拖动松手检测
    else {
      if (actionWidth >= SNAP_THRESHOLD) {
        setActionWidth(MAX_WIDTH);
      } else {
        setActionWidth(0);
      }
    }
  };

  const onClickCard = () => {
    if (actionWidth > 0) {
      setActionWidth(0);
      return;
    }
    onClick(ledger.id);
  };

  const handleDeleteDialog = () => {
    onDelete(ledger.id);
    setShowDeleteDialog(false);
    setActionWidth(0);
  };

  return (
    // Card Container
    // className='relative w-full my-2 select-none overflow-hidden rounded-3xl bg-white shadow-sm flex'
    <View
      style={{
        position: 'relative',
        width: '100%',
        marginTop: '8px',
        marginBottom: '8px',
        overflow: 'hidden',
        borderRadius: '24px', // rounded-3xl
        backgroundColor: COLORS.white,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'row', // 水平布局
      }}
    >
      {/* 左侧内容区 */}
      <View
        onClick={onClickCard}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        // className={`flex-1 min-w-0 p-4 flex items-center relative z-10 ...`}
        style={{
          flex: 1,
          minWidth: 0, // 允许 flex 子项收缩
          padding: '16px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
          backgroundColor: ledger.isActived ? COLORS.primaryLight : COLORS.white,
          // 模拟 ring-1 ring-primary
          // borderWidth: ledger.isActived ? '1px' : '1px',
          // borderStyle: 'solid',
          // borderColor: ledger.isActived ? COLORS.primary : 'transparent',
          // transition 在 style 中可能需要配合 transition 属性，但小程序支持度不一，通常 View 不支持 transition 属性
          // 建议：如果需要背景色过渡，可能需要 css class
        }}
        // hoverClass 模拟 hover:border-gray-200，但因为已有边框逻辑，这里暂略
      >
        {/* Icon Circle */}
        <View
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            flexShrink: 0,
            backgroundColor: COLORS.white,
          }}
        >
          <Icon name={ledger.componentName} size={24} color={ledger.componentColor} />
        </View>

        {/* Text Info */}
        <View style={{ flex: 1, minWidth: 0 }}>
          {/* Name */}
          <Text
            style={{
              fontWeight: 'bold',
              color: COLORS.gray900,
              display: 'block', // 确保 Text 独占一行以触发截断
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {ledger.name}
          </Text>

          {/* Desc */}
          <Text
            style={{
              fontSize: '12px',
              color: COLORS.gray500,
              marginTop: '2px',
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {ledger.desc}
          </Text>
        </View>
      </View>

      {/* 右侧操作区 */}
      <View
        style={{
          width: `${actionWidth}px`, // 动态宽度
          height: '100%', // 必须撑满高度
          // transition: isDragging ? 'none' : 'width 0.3s ...' (在 View style 里写 transition 无效，需用 className 或 CSS)
          // 建议：直接接受无动画，或者用 className
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          backgroundColor: COLORS.gray50,
          flexShrink: 0,
        }}
        className={!isDragging ? 'transition-width' : ''} // 需要在 common.scss 定义 .transition-width { transition: width 0.3s; }
      >
        {/* Edit Button */}
        <View
          onClick={e => {
            e.stopPropagation();
            onEdit(e, ledger.id);
            setActionWidth(0);
          }}
          style={{
            width: '70px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.gray100,
          }}
          hoverStyle={{ backgroundColor: COLORS.gray200 }}
        >
          <Icon name='Edit3' size={20} color={COLORS.primaryDark} />
          <Text style={{ fontSize: '10px', marginTop: '4px', color: COLORS.primaryDark }}>编辑</Text>
        </View>

        {/* Delete Button */}
        {ledger.isActived ? (
          <View
            style={{
              width: '70px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.gray300, // disabled color
              opacity: 0.5,
            }}
          >
            <Icon name='Trash' size={20} color={COLORS.gray600} />
            <Text style={{ fontSize: '10px', marginTop: '4px', color: COLORS.gray600 }}>删除</Text>
          </View>
        ) : (
          <View
            onClick={e => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            style={{
              width: '70px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.red500,
            }}
            hoverStyle={{ backgroundColor: COLORS.red600 }}
          >
            <Icon name='Trash' size={20} color={COLORS.white} />
            <Text style={{ fontSize: '10px', marginTop: '4px', color: COLORS.white }}>删除</Text>
          </View>
        )}
      </View>

      {/* Delete Modal */}
      {showDeleteDialog && (
        <Dialog
          title='删除账本'
          content={`确定要删除「${ledger.name}」账本吗？此操作无法撤销。`}
          onCloseName='取消'
          onClickName='确认删除'
          onClose={() => setShowDeleteDialog(false)}
          onClick={handleDeleteDialog}
          onClickTextStyle={{ color: COLORS.white }}
          onClickStyle={{ backgroundColor: COLORS.red500 }}
        />
      )}
    </View>
  );
};
