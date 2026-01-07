import React, { useState, useContext } from 'react';
import { View, Text, RootPortal } from '@tarojs/components'; // 1. 引入 Taro 组件
import { AppContext } from '@/context/AppContext';
import { CategorySettingsPage } from '@/components/modals/CategorySettingsPage';
import { CategoryGridModal } from '@/components/modals/recorder/CategoryGrid';
import { InputAreaModal } from '@/components/modals/recorder/InputArea';
import { LedgerCategory } from '@/types';

interface RecorderPageProps {
  onClose: () => void;
}

// 定义颜色常量
const COLORS = {
  white: '#ffffff',
  primary: '#76BDB9', // bg-primary
  blackOp70: 'rgba(0, 0, 0, 0.7)', // text-black/70
};

export const RecorderPage: React.FC<RecorderPageProps> = ({ onClose }) => {
  const { addTransaction, currentLedger } = useContext(AppContext);
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<LedgerCategory>();

  const categories = currentLedger?.categories || [];
  const [showSettings, setShowSettings] = useState(false);

  const handleClickCategory = (catId: string) => {
    setSelectedCatId(catId);
    setSelectedCategory(categories.find(cat => cat.id === catId));
  };

  const handleSubmit = (amount: number, recordDate: Date, remark: string) => {
    if (selectedCategory) {
      addTransaction(amount, recordDate, remark, selectedCategory);
      onClose();
    }
  };

  // 如果显示设置页，直接渲染设置页组件 (前提是 CategorySettingsPage 内部也适配了全屏/RootPortal)
  if (showSettings) {
    return <CategorySettingsPage onClose={() => setShowSettings(false)} />;
  }

  return (
    // 使用 RootPortal 覆盖全屏
    <RootPortal>
      <View
        className='animate-fade-in' // 需在 common.scss 定义动画
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 600, // z-[60]
          backgroundColor: COLORS.white,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top Bar */}
        <View
          style={{
            backgroundColor: COLORS.primary,
            padding: '16px', // py-4 px-4
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
            // 适配顶部安全区 (可选，视设计稿而定，如果 header 在最顶端通常需要)
            // paddingTop: 'env(safe-area-inset-top)',
          }}
        >
          {/* 左侧占位，保持中间标题居中(如果有标题的话)，这里是为了保持 Cancel 按钮在右侧 */}
          <View style={{ width: '40px' }} />

          {/* Cancel Button */}
          <View onClick={onClose} style={{ padding: '4px' }}>
            <Text
              style={{
                color: COLORS.blackOp70,
                fontWeight: 500, // font-medium
                fontSize: '14px', // text-sm
              }}
            >
              取消
            </Text>
          </View>
        </View>

        {/* Category Grid */}
        {/* CategoryGridModal 内部是 ScrollView flex:1，所以这里外层不需要额外处理 */}
        <CategoryGridModal
          selectedCatId={selectedCatId}
          categories={categories}
          onClick={handleClickCategory}
          onEdit={() => setShowSettings(true)}
        />

        {/* Input Area */}
        {/* 只有选中分类后才显示输入区域 */}
        {selectedCatId && <InputAreaModal onClick={handleSubmit} />}
      </View>
    </RootPortal>
  );
};
