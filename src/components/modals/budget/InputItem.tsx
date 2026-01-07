/* eslint-disable react/jsx-boolean-value */
import React, { useState, useEffect } from 'react';
import { View, Text, Input } from '@tarojs/components';

// 定义颜色常量
const COLORS = {
  gray50: '#f9fafb',
  white: '#ffffff',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray900: '#111827',
  primary: '#76BDB9',
};

// ✨✨✨ 1. 抽离单个输入组件 (解决光标跳动问题) ✨✨✨
// 使用 React.memo 防止父组件更新时导致不必要的子组件重渲染
export const InputItem = React.memo(
  ({ index, value, onSave }: { index: number; value: string; onSave: (val: string, i: number) => void }) => {
    // 内部维护一个状态，保证输入极其流畅
    const [innerValue, setInnerValue] = useState('');

    // console.log('InputItem');
    const handleSave = () => {
      // console.log('handleSave', innerValue);
      onSave(innerValue, index);
    };

    // 当父组件传入的值发生变化（例如点击了“每月均分”），同步到内部状态
    useEffect(() => {
      // console.log('useEffect', value);
      setInnerValue(value);
    }, [value]);

    return (
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: '16px',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: '16px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 500 }}>{index + 1}月预算</Text>
        </View>

        <Input
          type='digit'
          value={innerValue}
          onInput={e => setInnerValue(e.detail.value)}
          onBlur={handleSave}
          placeholder='0'
          style={{
            width: '60%',
            textAlign: 'right',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: COLORS.gray200,
            paddingTop: '4px',
            paddingBottom: '4px',
            height: '48px',
            lineHeight: '48px',
          }}
          placeholderStyle='color: #9ca3af; line-height: 48px;'
        />
      </View>
    );
  }
);
