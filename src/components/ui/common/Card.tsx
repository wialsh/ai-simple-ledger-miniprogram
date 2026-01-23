import React, { useState, useRef } from 'react';
import { Icon, Dialog } from '@/components/ui';

interface CardProps {
  cardId: number;
  onClick: (id: number) => void;
  onEdit: (e: React.MouseEvent, id: number) => void;
  onDelete: (id: number) => void;
  stats: any;
}

export const Card: React.FC<CardProps> = ({ cardId, onClick, onEdit, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // --- 状态管理 ---
  const [actionWidth, setActionWidth] = useState(0); // 右侧操作区的宽度
  const [isDragging, setIsDragging] = useState(false); // 是否正在按住拖动

  // --- Refs (用于记录瞬时数据，不触发渲染) ---
  const startX = useRef(0);
  const startY = useRef(0);
  const startWidth = useRef(0); // 触摸开始时，操作区已有的宽度
  const startTime = useRef(0); // 用于计算滑动速度

  // --- 常量配置 ---
  const BTN_WIDTH = 70; // 单个按钮宽度
  const BTN_COUNT = 2; // 按钮数量
  const MAX_WIDTH = BTN_WIDTH * BTN_COUNT; // 最大展开宽度 (140px)
  const SNAP_THRESHOLD = BTN_WIDTH; // 松手时的吸附阈值（达到一个按钮宽度即展开）

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.targetTouches[0].clientX;
    startY.current = e.targetTouches[0].clientY;
    startWidth.current = actionWidth; // 记录按下去瞬间的宽度状态
    startTime.current = Date.now();
    setIsDragging(true); // 开始拖动，禁用 CSS transition 以保证跟手
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const deltaX = currentX - startX.current; // 向左滑为负，向右滑为正
    const deltaY = currentY - startY.current;

    // 1. 垂直滚动判定：如果垂直移动幅度大于水平，认为是页面滚动，不处理
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    // 2. 计算目标宽度
    // 逻辑：新宽度 = 初始宽度 + (向左滑动的距离)。
    // 注意：deltaX 向左是负数，所以我们要减去 deltaX (或者理解为 0 - deltaX)
    // 但为了符合直觉：向左滑(deltaX < 0) -> 宽度增加。
    const moveDistance = -deltaX;
    let newWidth = startWidth.current + moveDistance;

    // 3. 限制范围 (0 到 MAX_WIDTH)，实现无阻尼跟随
    newWidth = Math.max(0, Math.min(MAX_WIDTH, newWidth));

    setActionWidth(newWidth);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false); // 恢复 CSS transition，让松手后的归位有动画

    const endTime = Date.now();
    const timeElapsed = endTime - startTime.current;
    const currentX = e.changedTouches[0].clientX;
    const deltaX = currentX - startX.current;

    // --- 判定逻辑 ---

    // 1. 快速滑动 (Flick) 检测
    // 条件：时间短 (< 300ms) 且 移动距离明显 (> 30px)
    if (timeElapsed < 300 && Math.abs(deltaX) > 30) {
      if (deltaX < 0) {
        // 向左快滑 -> 展开
        setActionWidth(MAX_WIDTH);
      } else {
        // 向右快滑 -> 关闭
        setActionWidth(0);
      }
    }
    // 2. 普通拖动松手 (Drag Release) 检测
    else {
      // 如果当前宽度超过阈值（一个按钮的宽度），则完全展开，否则关闭
      if (actionWidth >= SNAP_THRESHOLD) {
        setActionWidth(MAX_WIDTH);
      } else {
        setActionWidth(0);
      }
    }
  };

  const onClickCard = () => {
    // 如果操作栏是打开的，点击卡片只是关闭操作栏
    if (actionWidth > 0) {
      setActionWidth(0);
      return;
    }
    // console.log('handleSelectLedger', ledger);
    onClick(ledger.id);
  };

  const handleDeleteDialog = (status: boolean) => {
    if (status) {
      onDelete(ledger.id);
    }
    setShowDeleteDialog(false);
    setActionWidth(0);
  };

  return (
    <div className='relative w-full my-2 select-none overflow-hidden rounded-3xl bg-white shadow-sm flex'>
      {/* 左侧内容区
        flex-1: 自动填充
        min-w-0: 允许被压缩至小于内容宽度 (触发 truncate 的关键)
      */}
      <div
        onClick={onClickCard}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`flex-1 min-w-0 p-4 flex items-center relative z-10 cursor-pointer hover:border-gray-200`}
        style={{
          // 仅在左侧内容区添加背景色过渡，避免拖动时的闪烁
          transition: 'background-color 0.2s, border-color 0.2s',
        }}
      >
        {/* 这里实现插槽 */}
      </div>

      {/* 右侧操作区
        宽度由 state 控制
        transition: 拖动时为 none (丝滑跟手)，松手时有 duration (回弹效果)
      */}
      <div
        style={{
          width: actionWidth,
          transition: isDragging ? 'none' : 'width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
        className='flex-shrink-0 flex overflow-hidden bg-gray-50'
      >
        <button
          onClick={e => {
            e.stopPropagation();
            onEdit(e, ledger.id);
            setActionWidth(0);
          }}
          // w-[70px] 固定宽度，确保内容不被压缩，只是被遮挡
          className='w-[70px] h-full flex flex-col items-center justify-center bg-gray-100 text-primary-dark active:bg-gray-200'
        >
          <Icon name='Edit3' size={20} />
          <span className='text-[10px] mt-1'>编辑</span>
        </button>
        {ledger.isActived ? (
          <button
            disabled
            className='w-[70px] h-full flex flex-col items-center justify-center bg-red-500 text-white active:bg-red-600 disabled:bg-gray-300 disabled:text-gray-600 disabled:opacity-50'
          >
            <Icon name='Trash' size={20} />
            <span className='text-[10px] mt-1'>删除</span>
          </button>
        ) : (
          <button
            onClick={e => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            className='w-[70px] h-full flex flex-col items-center justify-center bg-red-500 text-white active:bg-red-600'
          >
            <Icon name='Trash' size={20} />
            <span className='text-[10px] mt-1'>删除</span>
          </button>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteDialog && (
        <Dialog
          title='删除账本'
          content={`确定要删除「${ledger.name}」账本吗？此操作无法撤销。`}
          onCloseName='取消'
          onClickName='确认删除'
          onClose={() => handleDeleteDialog(false)}
          onClick={() => handleDeleteDialog(true)}
          onClickTextColor='text-white'
          onClickBgColor='bg-red-500'
        />
      )}
    </div>
  );
};
