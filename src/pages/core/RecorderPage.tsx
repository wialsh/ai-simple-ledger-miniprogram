import React, { useState, useContext } from 'react';
import { View } from '@tarojs/components';
import { AppContext } from '@/context/AppContext';
import { WindowsCustom } from '@/components';
import { InputAreaModal, CategoriesGrids, CategorySettingsPage } from '@/components/recorder';
import { DEFAULT_LEDGER } from '@/hooks/constants';
import { COLORS } from '@/styles/colors';
import { LedgerCategory } from '@/types';

interface RecorderPageProps {
  onBack: () => void;
}

export const RecorderPage: React.FC<RecorderPageProps> = ({ onBack }) => {
  const { addTransaction, currentLedger } = useContext(AppContext);
  const [selectediconName, setSelectediconName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<LedgerCategory>();
  // 如果 currentLedger 没有 categories，使用默认账本的 categories
  const categories = currentLedger?.categories || DEFAULT_LEDGER.categories;
  const [showSettings, setShowSettings] = useState(false);

  const handleClickCategory = (iconName: string) => {
    setSelectediconName(iconName);
    setSelectedCategory(categories.find(cat => cat.iconName === iconName));
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
        selectediconName ? (
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
        selectediconName={selectediconName}
        categories={categories}
        onClick={handleClickCategory}
        onEdit={() => setShowSettings(true)}
      />
    </WindowsCustom>
  );
};
