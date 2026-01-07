import React from 'react';
import { View } from '@tarojs/components';

interface SwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

const COLORS = {
  primaryDark: '#49807D',
  gray200: '#e5e7eb',
  white: '#ffffff',
};

export const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <View
      onClick={e => {
        e.stopPropagation(); // 防止冒泡触发列表点击
        onChange(!checked);
      }}
      // w-11 h-6 -> width: 44px, height: 24px
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '999px',
        backgroundColor: checked ? COLORS.primaryDark : COLORS.gray200,
        position: 'relative',
        transition: 'background-color 0.3s',
        // 小程序中 transition 需要在 css 类中定义才更流畅，或者这里简单使用
      }}
      className='switch-transition' // 建议在 common.scss 定义 transition 属性
    >
      <View
        // w-5 h-5 -> width: 20px, height: 20px
        // left 计算: checked ? (44 - 20 - 2)px : 2px
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '999px',
          backgroundColor: COLORS.white,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)', // shadow-md
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          transition: 'left 0.3s', // 同样建议放在 css 类中
        }}
        className='switch-knob-transition'
      />
    </View>
  );
};
