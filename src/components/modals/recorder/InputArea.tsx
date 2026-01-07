/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components'; // 1. 引入 Taro 组件
import { Icon } from '@/components/ui/Icon';
import { KeypadModal } from '@/components/modals/recorder/Keypad';
import { ActionsColumnModal } from '@/components/modals/recorder/ActionsColumn';
import * as formatUtil from '@/utils/formatUtil';

interface InputAreaModalProps {
  onClick: (amount: number, date: Date, remark: string) => void;
}

// 定义颜色常量
const COLORS = {
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray500: '#6b7280',
  gray700: '#374151',
  red500: '#ef4444',
  white: '#ffffff',
  black: '#000000',
};

export const InputAreaModal: React.FC<InputAreaModalProps> = ({ onClick }) => {
  const [amountStr, setAmountStr] = useState('0');
  const [finalAmount, setFinalAmount] = useState(0);
  const [hasOp, setHasOp] = useState(false);
  const [remark, setRemark] = useState('');

  // 用于控制 ScrollView 的滚动位置
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleUpdateRemark = (newRemark: string, k: number = 100) => {
    if (newRemark.trim().length === 0 && newRemark.length === 0) {
      setRemark(''); // 允许清空
      return;
    }
    if (newRemark.length > k) {
      setRemark(newRemark.substring(0, k));
      return;
    }
    setRemark(newRemark);
  };

  const handleNumClick = (val: string) => {
    if (val === 'back') {
      setAmountStr(prev => {
        if (prev.length <= 1) {
          return '0';
        }
        return prev.slice(0, -1);
      });
      return;
    }
    const segments = amountStr.split(/[+-]/);
    const lastSegment = segments[segments.length - 1];
    if (lastSegment.length > 10) {
      return;
    } else if (val === '.') {
      if (!lastSegment.includes('.')) {
        setAmountStr(prev => prev + '.');
      }
    } else if (lastSegment === '0') {
      if (val === '0') {
        return;
      } else if (/[1-9]/.test(val)) {
        setAmountStr(prev => prev.slice(0, -1) + val);
      }
    } else {
      setAmountStr(prev => (prev === '0' ? val : prev + val));
    }
  };

  const handleOperatorClick = (op: '+' | '-') => {
    if (amountStr.endsWith('+') || amountStr.endsWith('-') || amountStr.endsWith('.')) {
      setAmountStr(prev => prev.slice(0, -1) + op);
      return;
    }
    if (amountStr === '0') {
      if (op === '-') setAmountStr('-');
      return;
    }
    setAmountStr(prev => prev + op);
  };

  useEffect(() => {
    if (amountStr.includes('+') || amountStr.includes('-')) {
      let str = amountStr;
      // 简单的去尾逻辑
      if (['+', '-', '.'].some(char => str.endsWith(char))) {
        str = str.slice(0, -1);
      }
      if (['+', '-', '.'].some(char => str.endsWith(char))) {
        str = str.slice(0, -1);
      }

      if (str === '' || str === '0') {
        setHasOp(false);
        return;
      }

      if (str.includes('+') || str.includes('-')) {
        setHasOp(true);
      } else {
        setHasOp(false);
      }

      const parts = str.split(/([+-])/);
      let currentSign = 1;
      let totalAmount = 0;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part === '+') {
          currentSign = 1;
        } else if (part === '-') {
          currentSign = -1;
        } else if (part.trim() !== '') {
          const val = parseFloat(part);
          if (!isNaN(val)) {
            totalAmount += val * currentSign;
          }
        }
      }
      setFinalAmount(totalAmount);
    } else {
      setHasOp(false);
      setFinalAmount(parseFloat(amountStr));
    }

    // 每次 amountStr 变化，设置一个很大的 scrollLeft 值，让 ScrollView 滚到最右侧
    // 这里使用一个足够大的数，或者估算宽度
    setScrollLeft(amountStr.length * 50 + 1000);
  }, [amountStr]);

  const handleSubmit = (date: Date) => {
    if (finalAmount === 0) {
      // 可选：Taro.showToast('请输入金额')
      return;
    }
    onClick(finalAmount, date, remark);
  };

  return (
    // className='bg-gray-50 border-t border-gray-200'
    <View
      style={{
        backgroundColor: COLORS.gray50,
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: COLORS.gray200,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 顶部区域：显示金额和备注 */}
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '12px 16px', // py-3 px-4
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: COLORS.gray200,
          backgroundColor: COLORS.white,
          gap: '8px', // space-y-2
        }}
      >
        <View style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'flex-end' }}>
          {/* 上面金额区域 (可水平滚动) */}
          <ScrollView
            scrollX
            scrollLeft={scrollLeft} // 绑定滚动位置
            scrollWithAnimation // 开启滚动动画
            style={{
              width: '100%',
              whiteSpace: 'nowrap',
              height: '40px', // 给定高度
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end', // 内容靠右对齐
                minWidth: '100%', // 确保内容少时也能靠右
                height: '100%',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: '24px', lineHeight: '40px' }}>{amountStr}</Text>
            </View>
          </ScrollView>

          {/* 下面总额区域 */}
          {hasOp && (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                paddingLeft: '8px',
                marginTop: '4px',
              }}
            >
              <Text style={{ color: COLORS.gray500, fontWeight: 500, marginRight: '8px' }}>=</Text>
              <Text
                style={{
                  color: finalAmount >= 0 ? COLORS.gray500 : COLORS.red500,
                  fontWeight: 500,
                }}
              >
                {formatUtil.formatNumber(finalAmount)}
              </Text>
            </View>
          )}
        </View>

        {/* 备注行 */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.gray100,
            padding: '8px', // py-2 px-2
            borderRadius: '4px', // rounded
          }}
        >
          <Text style={{ fontSize: '14px', fontWeight: 500, color: COLORS.gray300, marginRight: '8px' }}>备注:</Text>

          <Input
            type='text'
            placeholder='添加备注...'
            value={remark}
            // 关键修改：Taro Input 事件
            onInput={e => handleUpdateRemark(e.detail.value)}
            style={{
              flex: 1,
              fontSize: '14px',
              color: COLORS.gray700,
              backgroundColor: 'transparent',
              // 去除默认边框等
            }}
            placeholderStyle={`color: ${COLORS.gray300}`}
          />

          {/* 一键清除按钮 */}
          {remark && remark.trim().length > 0 && (
            <View
              onClick={() => setRemark('')}
              // active:opacity-70
              hoverStyle={{ opacity: 0.7 }}
              style={{
                padding: '4px',
                flexShrink: 0,
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.gray300,
                  borderRadius: '999px',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '16px',
                  height: '16px',
                }}
              >
                <Icon name='X' size={8} color={COLORS.white} strokeWidth={3} />
              </View>
            </View>
          )}
        </View>
      </View>

      {/* 底部键盘区域 */}
      <View style={{ display: 'flex', flexDirection: 'row', height: '256px' }}>
        {/* Keypad */}
        <KeypadModal onClick={handleNumClick} />

        {/* Actions Column */}
        <ActionsColumnModal onSubmit={handleSubmit} onEdit={handleOperatorClick} />
      </View>
    </View>
  );
};
