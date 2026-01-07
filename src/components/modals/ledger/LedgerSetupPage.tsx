import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Input, ScrollView, RootPortal } from '@tarojs/components'; // 1. 引入 Taro 组件
import { Icon } from '@/components/ui/Icon';
import { AppContext } from '@/context/AppContext';
import { Ledger, LedgerCategory } from '@/types';

interface CategorySetupPageProps {
  onClose: () => void;
  initLedger?: Ledger;
}

// 定义颜色常量
const COLORS = {
  white: '#ffffff',
  whiteOp20: 'rgba(255, 255, 255, 0.2)',
  black: '#000000',
  blackOp20: 'rgba(0, 0, 0, 0.2)',
  blackOp30: 'rgba(0, 0, 0, 0.3)',
  blackOp60: 'rgba(0, 0, 0, 0.6)',
  blackOp70: 'rgba(0, 0, 0, 0.7)',
  blackOp80: 'rgba(0, 0, 0, 0.8)',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray400: '#9ca3af',
  gray500: '#9ca3af',
  red500: '#ef4444',
  red600: '#dc2626',
  primary: '#76BDB9',
  primaryDark: '#49807D',
};

export const CategorySetupPage: React.FC<CategorySetupPageProps> = ({ onClose, initLedger }) => {
  const { allCategories, createLedger, updateLedger } = useContext(AppContext);
  const [ledgerName, setLedgerName] = useState(initLedger?.name || '');
  const [ledgerCategories, setLedgerCategories] = useState<LedgerCategory[]>(initLedger?.categories || []);
  const [mergedLedgerCategories, setMergedLedgerCategories] = useState<LedgerCategory[]>([]);

  const [componentName, setComponentName] = useState<string | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [showNameError, setShowNameError] = useState(false);

  const isEditing = !!initLedger;

  const handleClickCategory = (clickComponentName: string) => {
    setComponentName(clickComponentName);
    const existing = ledgerCategories.find(c => c.componentName === clickComponentName);
    setCategoryNameInput(existing?.name || '');
  };

  const handleSaveLedgerCategory = () => {
    if (categoryNameInput.trim() === '') {
      setLedgerCategories(prev => [...prev.filter(c => c.componentName !== componentName)]);
    } else if (componentName) {
      const existingCategory = ledgerCategories.find(c => c.componentName === componentName);
      const newCat: LedgerCategory = {
        id: existingCategory?.id || componentName,
        name: categoryNameInput.trim().substring(0, 6),
        type: existingCategory?.type || 1,
        componentName: componentName,
        componentColor: existingCategory?.componentColor || '#76BDB9',
      };
      setLedgerCategories(prev => [...prev.filter(c => c.componentName !== componentName), newCat]);
    }

    setComponentName(null);
  };

  const handleSaveLedgerCategories = () => {
    if (!ledgerName.trim()) {
      setShowNameError(true);
      return;
    }

    if (isEditing && initLedger) {
      updateLedger({
        ...initLedger,
        name: ledgerName,
        categories: ledgerCategories,
      });
    } else {
      createLedger(ledgerName, 'BookOpen', ledgerCategories);
    }
    onClose();
  };

  useEffect(() => {
    const categoryIds = new Set(ledgerCategories.map(item => item.id));
    const remainingCategories: LedgerCategory[] = allCategories
      .filter(c => !categoryIds.has(c.id))
      .map(c => ({
        id: c.id,
        name: c.name,
        type: 0,
        componentName: c.name,
        componentColor: c.color,
      }));

    const mergedAllCategories: LedgerCategory[] = [...ledgerCategories, ...remainingCategories];

    setMergedLedgerCategories(mergedAllCategories);
  }, [ledgerCategories, allCategories]);

  return (
    <RootPortal>
      <View
        className='animate-slide-up'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 800,
          backgroundColor: COLORS.white,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top 30% Area */}
        <View
          style={{
            height: '30vh',
            backgroundColor: COLORS.primary,
            display: 'flex',
            flexDirection: 'column',
            padding: '24px', // p-6
            position: 'relative',
          }}
        >
          {/* Header Bar */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px', // mb-6
            }}
          >
            <View onClick={onClose}>
              <Text style={{ color: COLORS.blackOp70, fontWeight: 500 }}>取消</Text>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <View
                onClick={handleSaveLedgerCategories}
                style={{
                  backgroundColor: COLORS.primaryDark,
                  padding: '6px 16px', // px-4 py-1.5
                  borderRadius: '999px',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }}
              >
                <Text style={{ color: COLORS.black, fontWeight: 'bold', fontSize: '14px' }}>保存</Text>
              </View>
            </View>
          </View>

          {/* Ledger Name Input Area */}
          <View
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Book Icon */}
            <View
              style={{
                width: '80px', // w-20
                height: '80px', // h-20
                backgroundColor: COLORS.whiteOp20,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px', // mb-4
                // backdrop-filter 在小程序支持有限，通常忽略
              }}
            >
              <Icon name='BookOpen' size={40} color={COLORS.blackOp80} />
            </View>

            {/* Input Wrapper */}
            <View
              style={{
                width: '100%',
                maxWidth: '320px', // max-w-xs
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <Input
                type='text'
                placeholder='账本名称'
                value={ledgerName}
                onInput={e => {
                  setLedgerName(e.detail.value);
                  if (e.detail.value.trim()) setShowNameError(false);
                }}
                style={{
                  backgroundColor: 'transparent',
                  borderBottomWidth: '2px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: showNameError ? COLORS.red500 : COLORS.blackOp20,
                  textAlign: 'center',
                  fontSize: '24px', // text-2xl
                  fontWeight: 'bold',
                  width: '100%',
                  paddingBottom: '8px',
                  color: COLORS.black,
                }}
                placeholderStyle={`color: ${COLORS.blackOp30}`}
              />

              {/* Error Message */}
              {showNameError && (
                <Text
                  className='animate-shake' // 需在 common.scss 定义抖动动画
                  style={{
                    color: COLORS.red600,
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginTop: '4px',
                    position: 'absolute',
                    top: '100%',
                  }}
                >
                  请补充账本名称
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Bottom 70% Area (Categories Grid) */}
        <ScrollView
          scrollY
          style={{
            height: '70vh',
            backgroundColor: COLORS.white,
            marginTop: '12px', // mt-3
            width: '100%',
          }}
        >
          <View style={{ padding: '24px', paddingBottom: 'env(safe-area-inset-bottom)' }}>
            {/* Grid Layout: grid-cols-5 */}
            {/* 小程序用 Flex Wrap 模拟 Grid */}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start', // 左对齐
                gap: '16px', // 行列间距
              }}
            >
              {mergedLedgerCategories.map(category => {
                // 计算宽度：(100% - 4 * gap) / 5
                // 简单点：设定固定宽度或者用 calc
                // 为了简单起见，这里假设屏幕宽度大致固定，给一个近似百分比
                const itemWidth = '16%'; // 5列大约 16-18%

                return (
                  <View
                    key={category.id}
                    onClick={() => handleClickCategory(category.componentName)}
                    style={{
                      width: itemWidth,
                      aspectRatio: '1 / 1', // 保持正方形
                      borderRadius: '50%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: category.type !== 0 ? COLORS.primary : COLORS.gray100,
                      opacity: category.type !== 0 ? 1 : 0.6,
                      transform: category.type !== 0 ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: category.type !== 0 ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon
                      name={category.componentName}
                      size={20}
                      color={category.type !== 0 ? COLORS.black : COLORS.gray400}
                    />
                    {category.type !== 0 && <Text style={{ fontSize: '9px', marginTop: '4px' }}>{category.name}</Text>}
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Popup for Category Naming */}
        {componentName && (
          <View
            className='animate-fade-in'
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 900,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <View
              className='animate-slide-up' // 也可以复用 slide-up 动画
              style={{
                backgroundColor: COLORS.white,
                borderRadius: '16px',
                width: '100%',
                maxWidth: '320px',
                padding: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              <Text
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  display: 'block',
                  marginBottom: '24px',
                }}
              >
                修改名称
              </Text>

              <View style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <View
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name={componentName} size={32} />
                </View>
              </View>

              <Input
                type='text'
                focus
                placeholder='最多5个汉字'
                maxlength={5}
                value={categoryNameInput}
                onInput={e => setCategoryNameInput(e.detail.value)}
                style={{
                  width: '100%',
                  backgroundColor: COLORS.gray100,
                  padding: '16px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  marginBottom: '24px',
                  height: '56px',
                  boxSizing: 'border-box',
                }}
              />

              <View style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
                <View
                  onClick={() => setComponentName(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: COLORS.gray100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontWeight: 'bold', color: COLORS.gray500 }}>取消</Text>
                </View>

                <View
                  onClick={handleSaveLedgerCategory}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontWeight: 'bold', color: COLORS.black }}>确认</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </RootPortal>
  );
};
