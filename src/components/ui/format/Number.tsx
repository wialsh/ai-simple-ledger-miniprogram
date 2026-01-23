/* eslint-disable no-restricted-globals */
import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';

interface NumberFormatProps {
  value: number;
  /** 用于整数部分和小数点的样式 */
  mainStyle?: React.CSSProperties;
  /** 用于小数部分的样式 */
  decimalStyle?: React.CSSProperties;
  /** 用于单位部分的样式 */
  unitStyle?: React.CSSProperties;
  /** 外层容器样式 */
  style?: React.CSSProperties;
}

export const NumberFormat: React.FC<NumberFormatProps> = ({ value, mainStyle, decimalStyle, unitStyle, style }) => {
  // 核心逻辑保持不变，使用 useMemo 计算显示值
  const formattedData = useMemo(() => {
    let currentUnit = '';
    let maxThreshold = Infinity;

    if (typeof value !== 'number' || isNaN(value)) {
      return { integer: '0', decimal: '00', unit: '' };
    }

    if (value >= 100000000) {
      currentUnit = '亿';
      maxThreshold = 100000000;
    } else if (value >= 10000000) {
      currentUnit = '千万';
      maxThreshold = 10000000;
    } else if (value >= 1000000) {
      currentUnit = '百万';
      maxThreshold = 1000000;
    }

    let displayValue = value;
    if (maxThreshold !== Infinity) {
      if (value < maxThreshold * 10) {
        displayValue = value / maxThreshold;
      } else {
        displayValue = 10;
        currentUnit += '+';
      }
    }

    const [integer, decimal] = displayValue.toFixed(2).split('.');
    return { integer, decimal, unit: currentUnit };
  }, [value]);

  const { integer, decimal, unit } = formattedData;

  // 默认样式定义 (可以在这里统一修改默认大小颜色)
  const defaultMainStyle: React.CSSProperties = {
    fontSize: '20px',
    // fontWeight: 500,
    color: '#111827', // text-gray-900
  };

  const defaultSubStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#374151', // text-gray-700
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline', // 底部对齐
        ...style,
      }}
    >
      {/* 整数部分 */}
      <Text style={{ ...defaultMainStyle, ...mainStyle }}>{integer}</Text>

      {/* 小数点 (跟随整数样式) */}
      <Text style={{ ...defaultMainStyle, ...mainStyle }}>.</Text>

      {/* 小数部分 */}
      <Text style={{ ...defaultSubStyle, ...decimalStyle }}>{decimal}</Text>

      {/* 单位部分 */}
      {unit && (
        <Text
          style={{
            ...defaultSubStyle,
            fontSize: '10px',
            marginLeft: '2px',
            ...unitStyle,
          }}
        >
          {unit}
        </Text>
      )}
    </View>
  );
};

export default NumberFormat;
