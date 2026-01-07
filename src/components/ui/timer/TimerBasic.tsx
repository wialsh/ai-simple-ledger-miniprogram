import React, { useMemo, useCallback } from 'react';
import { View, PickerView, PickerViewColumn } from '@tarojs/components';
import { getYear, getMonth, getDate } from '@/utils/dateUtils';

interface TimerProps {
  date: Date;
  setDate: (d: Date) => void;
  wheelFormat?: string; // 'YYYY-MM' | 'YYYY-MM-DD'
}

// 静态数据移出组件，避免重复创建
const MONTHS_DATA = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}月`,
  value: i + 1,
}));

export const Timer: React.FC<TimerProps> = ({ date, setDate, wheelFormat = 'YYYY-MM' }) => {
  // 1. 获取当前日期的 年、月、日
  // 这里的 month 是 1-12
  const currentYear = getYear(date);
  const currentMonth = getMonth(date);
  const currentDay = getDate(date);
  const showDay = wheelFormat.startsWith('YYYY-MM-DD');

  // 2. 生成年份数据 (缓存)
  // 范围：当前年份 前5年 ~ 后5年 (共11年)
  const yearsData = useMemo(() => {
    // 这里的基准年可以用传入的 date，也可以用 new Date()，通常建议用 date 以保持选中项在中间
    // 但为了列表稳定，这里我们以 date 为准生成区间，或者你可以固定一个范围
    const centerYear = currentYear;
    return Array.from({ length: 11 }, (_, i) => {
      const y = centerYear - 5 + i;
      return { label: `${y}年`, value: y };
    });
  }, [currentYear]); // 依赖 currentYear，保证选中年总是在列表里

  // 3. 生成天数数据 (缓存，依赖年月)
  const daysData = useMemo(() => {
    // 获取当月有多少天 (使用 dateUtils 或原生写法)
    // new Date(year, month, 0) 中的 month 是 1-12，会自动获取上个月最后一天，所以这里传入 currentMonth 即可获取当月天数
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({
      label: `${i + 1}日`,
      value: i + 1,
    }));
  }, [currentYear, currentMonth]);

  // 4. 计算 PickerView 需要的索引数组 [年索引, 月索引, 日索引]
  const pickerValue = useMemo(() => {
    const yearIndex = yearsData.findIndex(y => y.value === currentYear);
    const monthIndex = currentMonth - 1; // 1月对应索引0
    const dayIndex = currentDay - 1; // 1日对应索引0

    // 还没加载好年份时，默认选中间
    const safeYearIndex = yearIndex >= 0 ? yearIndex : 5;

    return [safeYearIndex, monthIndex, dayIndex];
  }, [yearsData, currentYear, currentMonth, currentDay]);

  // 5. 处理滚动变化
  const handleChange = useCallback(
    (e: any) => {
      const [yIdx, mIdx, dIdx] = e.detail.value;
      // console.log('e.detail.value', e.detail.value);
      // console.log('yIdx, mIdx, dIdx', [yIdx, mIdx, dIdx]);

      // 根据索引找回实际的值
      const selectedYear = yearsData[yIdx]?.value || currentYear;
      const selectedMonth = MONTHS_DATA[mIdx]?.value || 1;
      // console.log('selectedYear, selectedMonth', selectedYear, selectedMonth);

      // 处理天数溢出逻辑 (例如 1月31日 -> 2月，应该变成 2月28/29日)
      // 获取新月份的最大天数
      const maxDaysInNewMonth = new Date(selectedYear, selectedMonth, 0).getDate();

      // 如果是 YYYY-MM 模式，天数默认设为 1
      // 如果是 YYYY-MM-DD 模式，尝试保持当前天数，但不能超过最大天数
      let targetDay = 1;
      if (showDay) {
        // 原始意图选中的天数（根据 dIdx + 1）
        const intendedDay = dIdx + 1;
        targetDay = Math.min(intendedDay, maxDaysInNewMonth);
      }

      // 更新父组件
      // 注意：Date 构造函数里 month 是 0-11
      setDate(new Date(selectedYear, selectedMonth - 1, targetDay));
    },
    [yearsData, currentYear, setDate, showDay]
  );

  return (
    <View
      style={{
        position: 'relative',
        width: '100%',
        height: '240px', // 稍微加高一点，保证显示舒适
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/*
         使用单个 PickerView 包含多个 Column 是 Taro/小程序的标准写法
         这样 indicatorStyle 是一条贯穿的线，体验更好
      */}
      <PickerView
        indicatorStyle='height: 48px; border-top: 1px solid #eee; border-bottom: 1px solid #eee;'
        style={{ width: '100%', height: '100%' }}
        value={pickerValue}
        onChange={handleChange}
      >
        {/* 年份列 */}
        <PickerViewColumn>
          {yearsData.map(item => (
            <View key={item.value} style={itemStyle}>
              {item.label}
            </View>
          ))}
        </PickerViewColumn>

        {/* 月份列 */}
        <PickerViewColumn>
          {MONTHS_DATA.map(item => (
            <View key={item.value} style={itemStyle}>
              {item.label}
            </View>
          ))}
        </PickerViewColumn>

        {/* 日期列 (条件渲染) */}
        {showDay && (
          <PickerViewColumn>
            {daysData.map(item => (
              <View key={item.value} style={itemStyle}>
                {item.label}
              </View>
            ))}
          </PickerViewColumn>
        )}
      </PickerView>
    </View>
  );
};

// 提取通用样式
const itemStyle: React.CSSProperties = {
  lineHeight: '48px',
  textAlign: 'center',
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: 500,
};
