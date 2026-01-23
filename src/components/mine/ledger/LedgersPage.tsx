import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, RootPortal } from '@tarojs/components';
import { AppContext } from '@/context/AppContext';
import { Icon } from '@/components/ui';
import { Ledger } from '@/types';
import { COLORS } from '@/styles/colors';
import { CategorySetupPage } from './LedgerSetupPage';
import { LedgerCard } from './LedgerCard';

interface LedgersPageProps {
  onClose: () => void;
}

export const LedgersPage: React.FC<LedgersPageProps> = ({ onClose }) => {
  const { activateLedger, displayLedgers, deleteLedger } = useContext(AppContext);
  const [editingLedger, setEditingLedger] = useState<Ledger | null>(null);
  const [isCreatingLedger, setIsCreatingLedger] = useState(false);

  const handleSelectLedger = (ledgerId: number) => {
    activateLedger(ledgerId);
    // onClose(); // 通常选中后应该关闭列表，返回主页？根据业务逻辑决定
  };

  const handleEditLedger = (e: any, ledgerId: number) => {
    e.stopPropagation(); // 阻止冒泡
    const ledger = displayLedgers.find(l => l.id === ledgerId);
    if (ledger) {
      setEditingLedger(ledger);
    }
  };

  const handleDeleteLedger = (ledgerId: number) => {
    deleteLedger(ledgerId);
  };

  // 如果处于编辑模式，直接渲染编辑页 (全屏替换)
  if (editingLedger) {
    return <CategorySetupPage onClose={() => setEditingLedger(null)} initLedger={editingLedger} />;
  }

  const handleCreateLedger = () => {
    setIsCreatingLedger(true);
  };

  return (
    // 使用 RootPortal 覆盖全屏
    <RootPortal>
      <View
        className='animate-slide-up' // 需在 common.scss 定义动画
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: COLORS.gray50,
          zIndex: 700,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        {/* 原 Grid 布局改为 Flex 布局 */}
        <View
          style={{
            backgroundColor: COLORS.white,
            padding: '16px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: COLORS.gray100,
            // 适配顶部安全区 (可选)
            // paddingTop: 'env(safe-area-inset-top)',
          }}
        >
          {/* 左侧：返回按钮 */}
          <View
            onClick={onClose}
            style={{
              padding: '8px',
              marginLeft: '-8px',
              borderRadius: '999px',
              width: '40px', // 固定宽度，模拟 grid col-1
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon name='ChevronLeft' size={24} />
          </View>

          {/* 中间：标题 */}
          <Text
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              textAlign: 'center',
              flex: 1, // 占据剩余空间
            }}
          >
            账本
          </Text>

          {/* 右侧：新建按钮 */}
          <View
            onClick={handleCreateLedger}
            // hover-class 模拟 hover:bg-primary-dark
            hoverStyle={{ backgroundColor: COLORS.primaryDark }}
            style={{
              backgroundColor: COLORS.primary,
              padding: '8px 12px',
              borderRadius: '8px',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }}
          >
            <Text
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: COLORS.black, // 假设按钮文字是黑色
              }}
            >
              新建账本
            </Text>
          </View>
        </View>

        {/* 新建账本弹窗 */}
        {isCreatingLedger && <CategorySetupPage onClose={() => setIsCreatingLedger(false)} />}

        {/* 列表内容 */}
        <ScrollView
          scrollY
          style={{
            flex: 1,
            backgroundColor: COLORS.gray50,
          }}
        >
          <View style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {displayLedgers.map(ledger => {
              return (
                <LedgerCard
                  key={ledger.id}
                  ledger={ledger}
                  onClick={() => handleSelectLedger(ledger.id)}
                  // 传递事件给 Card，Card 内部调用 props.onEdit(e, id)
                  onEdit={e => handleEditLedger(e, ledger.id)}
                  onDelete={() => handleDeleteLedger(ledger.id)}
                />
              );
            })}

            {/* 底部安全区垫片 */}
            <View style={{ height: 'env(safe-area-inset-bottom)' }} />
          </View>
        </ScrollView>
      </View>
    </RootPortal>
  );
};
