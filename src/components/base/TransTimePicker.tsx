import React from 'react';
import { View, Text } from '@tarojs/components';
import { Icon, TimerPicker } from '@/components/ui';
import * as dateUtils from '@/utils/dateUtils';
import { COLORS } from '@/styles/colors';

// 主副文本（Primary-Secondary Text）展示
export const TextFormat: React.FC<{
  Text: string; // 注意：Props 名字叫 Text
  subText: string;
}> = ({ Text: mainText, subText }) => {
  // ⬆️ 解构时重命名为 mainText，防止和 <Text> 组件冲突
  return (
    // className='inline-flex items-baseline font-base tracking-tight'
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
      }}
    >
      {/* className='text-2xl' */}
      <Text style={{ fontSize: '24px' }}>{mainText}</Text>

      {/* className='pl-0.5 text-sm text-gray-700' */}
      <Text
        style={{
          paddingLeft: '2px',
          fontSize: '14px',
          color: COLORS.gray700,
        }}
      >
        {subText}
      </Text>
    </View>
  );
};

export const TransactionsTimePicker: React.FC<{
  date: Date;
  setDate: (d: Date) => void;
}> = ({ date, setDate }) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* className='text-xs opacity-70 mb-0.5 ml-0.5' */}
      <View style={{ marginBottom: '2px', marginLeft: '2px', color: COLORS.gray500 }}>
        <Text style={{ fontSize: '12px' }}>{dateUtils.formatDate(date, 'YYYY')}</Text>
      </View>

      {/* className='flex justify-between items-center' */}
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TimerPicker date={date} setDate={setDate}>
          {/* className='flex items-center text-xl text-gray-900' */}
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '20px',
              color: COLORS.black,
            }}
          >
            <TextFormat Text={dateUtils.getMonth(date).toString()} subText='月' />
            <Icon name='ChevronDown' size={16} style={{ marginLeft: '4px', color: COLORS.gray700 }} strokeWidth={2} />
          </View>
        </TimerPicker>

        {/* 分割线 */}
        {/* className='w-px h-6 bg-primary-dark mx-2 inline-block' */}
        <View
          style={{
            width: '1px',
            height: '24px',
            backgroundColor: COLORS.primaryDark,
            margin: '0 8px',
          }}
        />
      </View>
    </View>
  );
};
