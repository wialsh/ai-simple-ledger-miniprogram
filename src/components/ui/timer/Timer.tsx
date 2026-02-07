import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { Icon } from '@/components/ui';
import * as dateUtils from '@/utils/dateUtils';
import { COLORS } from '@/styles/colors';
import { TimerDialog } from './TimerDialog';

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

export const TimerModal: React.FC<{
  date: Date;
  setDate: (d: Date) => void;
}> = ({ date, setDate }) => {
  const [showTimerDialog, setShowTimerDialog] = useState(false);

  return (
    // className='flex flex-col justify-between'
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* className='text-xs opacity-70 mb-0.5 ml-0.5' */}
      <View style={{ marginBottom: '2px', marginLeft: '2px', color: '#6b7280' }}>
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
        <View onClick={() => setShowTimerDialog(true)}>
          {/* className='flex items-center text-xl text-gray-900' */}
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '20px',
              color: COLORS.gray900,
            }}
          >
            <TextFormat Text={dateUtils.getMonth(date).toString()} subText='月' />
            {/* className='ml-1' */}
            <Icon name='ChevronDown' size={16} style={{ marginLeft: '4px' }} strokeWidth={2} />
          </View>
        </View>

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

      {/* TimerDialog */}
      {showTimerDialog && <TimerDialog date={date} onClick={setDate} onClose={() => setShowTimerDialog(false)} />}
    </View>
  );
};

export const YeayTimerModal: React.FC<{
  date: Date;
  setDate: (d: Date) => void;
}> = ({ date, setDate }) => {
  const [showTimerDialog, setShowTimerDialog] = useState(false);

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View onClick={() => setShowTimerDialog(true)}>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '20px',
              color: COLORS.gray900,
            }}
          >
            <TextFormat Text={date.getFullYear().toString()} subText='年' />
            <Icon name='ChevronDown' size={16} style={{ marginLeft: '4px' }} strokeWidth={2} />
          </View>
        </View>
        {/* 年份模式下可能不需要分割线，注释掉的代码已移除 */}
      </View>

      {/* TimerDialog */}
      {showTimerDialog && (
        <TimerDialog date={date} onClick={setDate} onClose={() => setShowTimerDialog(false)} wheelFormat='YYYY' />
      )}
    </View>
  );
};
