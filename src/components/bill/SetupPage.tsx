/* eslint-disable react/jsx-boolean-value */
import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, ScrollView, RootPortal } from '@tarojs/components';
import { AppContext } from '@/context/AppContext';
import { Dialog, Icon, TimerPicker } from '@/components/ui';
import type { Bill } from '@/types';
import { COLORS } from '@/styles/colors';
import { InputItem } from './InputItem';

interface BillSetupPageProps {
  onClose: () => void;
}

export const BillSetupPage: React.FC<BillSetupPageProps> = ({ onClose }) => {
  const { currentDate, ledgerInfo, updateLedgerInfoBill } = useContext(AppContext);
  const [showDialog, setShowDialog] = useState(false);
  const [inputTotalValue, setInputTotalValue] = useState<string>('');
  const [inputValues, setInputValues] = useState<string[]>(Array(12).fill(''));
  // 使用 Ref 存储最新数据（解决失焦保存旧值问题）
  const inputValuesRef = useRef<string[]>(Array(12).fill(''));
  const [bill, setBill] = useState<Bill>({} as Bill);
  const [planDate, setPlanDate] = useState<Date>(currentDate);

  const handleUpdateInputValues = () => {
    if (inputTotalValue.trim()) {
      const updatedValue = parseFloat(inputTotalValue) || 0;
      const newValues = inputValuesRef.current.map(() => (updatedValue / 12).toFixed(2));

      inputValuesRef.current = newValues;
      setInputValues(newValues);
      setBill({
        year: planDate.getFullYear(),
        amounts: newValues.map(v => parseFloat(v) || 0),
      });
      setInputTotalValue('');
    }
    setShowDialog(false);
  };

  const handleUpdateInputValue = (updated: string, i: number) => {
    // 这里只更新编辑框的内容
    const newValues = [...inputValuesRef.current];
    newValues[i] = updated;
    inputValuesRef.current = newValues;
    setInputValues(newValues);
    setBill({
      year: planDate.getFullYear(),
      amounts: newValues.map(v => parseFloat(v) || 0),
    });
  };

  // 初始化数据
  useEffect(() => {
    const findedBill = ledgerInfo?.bills?.find(b => b.year === planDate.getFullYear());
    const newValues = new Array(12).fill('');
    if (findedBill) {
      findedBill.amounts.forEach((amount, i) => {
        if (i < 12) {
          newValues[i] = amount ? amount.toString() : '';
        }
      });
    }
    inputValuesRef.current = newValues;
    setInputValues(newValues);
  }, [planDate, ledgerInfo]);

  // 同步到全局 Context
  useEffect(() => {
    // console.log('bill', bill);
    if (bill) {
      updateLedgerInfoBill(bill);
    }
  }, [bill, updateLedgerInfoBill]);

  return (
    <RootPortal>
      <View
        className='animate-slide-in-left'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: COLORS.gray50,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: COLORS.white,
            padding: '16px',
            display: 'flex',
            flexDirection: 'row',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          <View onClick={onClose} style={{ padding: '8px', marginLeft: '-8px', borderRadius: '999px' }}>
            <Icon name='ChevronLeft' size={24} />
          </View>
          <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: '18px', marginRight: '32px' }}>
            设置预算
          </Text>
        </View>

        {/* TopBarModal */}
        <TopBarModal>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <TimerPicker date={planDate} setDate={setPlanDate} />
            <View
              onClick={() => setShowDialog(true)}
              style={{ padding: '4px 8px', fontSize: '14px', color: COLORS.gray900 }}
            >
              <Text>每月均分</Text>
            </View>
          </View>
        </TopBarModal>

        {/* Content List */}
        <ScrollView
          scrollY
          enableFlex
          style={{
            flex: 1,
            width: '100%',
            height: '1px',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              marginTop: '16px',
              paddingBottom: '32px',
              width: '100%',
              paddingLeft: '16px',
              paddingRight: '16px',
              boxSizing: 'border-box',
            }}
          >
            {inputValues.map((value, i) => (
              <InputItem key={i} index={i} value={value} onSave={handleUpdateInputValue} />
            ))}
          </View>
        </ScrollView>

        {showDialog && (
          <Dialog
            title='请设置年度预算'
            onCloseName='取消'
            onClickName='保存'
            onClose={() => setShowDialog(false)}
            onClick={handleUpdateInputValues}
            onClickStyle={{ backgroundColor: '#49807D' }}
            onClickTextStyle={{ color: '#ffffff' }}
            showInput={true}
            inputValue={inputTotalValue}
            onInput={setInputTotalValue}
            inputPlaceholder='请输入年度总预算'
            inputMaxLength={20}
          />
        )}
      </View>
    </RootPortal>
  );
};
