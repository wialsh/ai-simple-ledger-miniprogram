import React from 'react';
import { Picker, View, Text } from '@tarojs/components';
import * as dateUtils from '@/utils/dateUtils';
import { COLORS } from '@/styles/colors';

export const TimerPicker: React.FC<{
  date: Date;
  setDate: (d: Date) => void;
  fields?: 'month' | 'day' | 'year';
  children?: React.ReactNode; // ✨ 1. 接收 children
}> = ({ date, setDate, fields = 'month', children }) => {
  const handlePickerChange = (e: any) => {
    const val = e.detail.value;
    // 兼容处理：fields='year' 时 val 只是 "2023"
    const parts = val.split('-').map(Number);
    const year = parts[0];
    const month = parts[1] ? parts[1] - 1 : 0;
    const day = parts[2] || 1;

    setDate(new Date(year, month, day));
  };
  // Picker 的 value 必须是 YYYY-MM-DD 格式的字符串
  const currentDateStr = dateUtils.formatDate(date, 'YYYY-MM-DD');

  return (
    <Picker mode='date' fields={fields} value={currentDateStr} onChange={handlePickerChange}>
      {/* ✨ 2. 渲染 children，这才是用户点击的目标 */}
      {children}
    </Picker>
  );
};

export const TimePicker2: React.FC<{
  date: Date;
  setDate: (d: Date) => void;
  fields?: 'month' | 'day' | 'year';
}> = ({ date, setDate, fields = 'month' }) => {
  return (
    <View>
      <TimerPicker date={date} setDate={setDate}>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '20px',
            color: COLORS.black,
          }}
        >
          {fields === 'year' ? (
            <Text>{dateUtils.formatDate(date, 'YYYY')}</Text>
          ) : fields === 'month' ? (
            <Text>{dateUtils.formatDate(date, 'YYYY-MM')}</Text>
          ) : fields === 'day' ? (
            <Text>{dateUtils.formatDate(date, 'YYYY-MM-DD')}</Text>
          ) : null}
        </View>
      </TimerPicker>
    </View>
  );
};
