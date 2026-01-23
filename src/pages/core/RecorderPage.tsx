import React, { useState, useContext } from 'react';
import { View, Text } from '@tarojs/components';
import { AppContext } from '@/context/AppContext';
import { WindowsCustom } from '@/components';
import { InputAreaModal, CategoriesGrids, CategorySettingsPage } from '@/components/recorder';
import { LedgerCategory } from '@/types';
import { COLORS } from '@/styles/colors';

interface RecorderPageProps {
  onBack: () => void;
}

export const RecorderPage: React.FC<RecorderPageProps> = ({ onBack }) => {
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
      onBack();
    }
  };

  // 如果显示设置页，直接渲染设置页组件 (前提是 CategorySettingsPage 内部也适配了全屏/RootPortal)
  if (showSettings) {
    return <CategorySettingsPage onBack={() => setShowSettings(false)} />;
  }

  return (
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
        selectedCatId ? (
          <View style={{ flexShrink: 0 }}>
            {/* Input Area */}
            {/* 只有选中分类后才显示输入区域 */}
            <InputAreaModal onClick={handleSubmit} />
          </View>
        ) : null
      }
    >
      {/* Category Grid */}
      {/* 分类网格 (自适应高度，flex: 1 在组件内部) */}
      <CategoriesGrids
        selectedCatId={selectedCatId}
        categories={categories}
        onClick={handleClickCategory}
        onEdit={() => setShowSettings(true)}
      />
    </WindowsCustom>
  );
};
