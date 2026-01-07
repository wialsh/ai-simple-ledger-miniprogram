import React, { useMemo, useState } from 'react';
import { View, Text } from '@tarojs/components'; // 1. 引入 Taro 组件
import { TimerDialog } from '@/components/ui/timer/TimerDialog';
import { Icon } from '@/components/ui/Icon';
import * as dateUtils from '@/utils/dateUtils';

interface ActionsColumnModalProps {
  onSubmit: (d: Date) => void;
  onEdit: (op: '+' | '-') => void;
}

// 定义颜色常量
const COLORS = {
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6', // border-gray-100
  gray300: '#d1d5db',
  gray500: '#6b7280',
  primaryDark: '#49807D',
  primaryDark5: '#406F6D', // active color for primary button
};

export const ActionsColumnModal: React.FC<ActionsColumnModalProps> = ({ onSubmit, onEdit }) => {
  const today = new Date();
  const [recordedDate, setRecordedDate] = useState(today);
  const [showTimerDialog, setShowTimerDialog] = useState(false);

  const dateStr = useMemo(() => {
    const dateDelta = dateUtils.dateDiff(recordedDate, today);
    if (dateDelta === 0) {
      return '今天';
    } else if (dateDelta === 1) {
      return '昨天';
    } else if (dateDelta === 2) {
      return '前天';
    } else if (dateDelta === -1) {
      return '明天';
    } else if (dateDelta === -2) {
      return '后天';
    } else {
      return dateUtils.formatDate(recordedDate, 'MMM dd, EEEE');
    }
  }, [recordedDate, today]);

  // 通用按钮样式
  const actionButtonStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: COLORS.gray100,
  };

  return (
    // className='w-1/4 flex flex-col border-gray-100'
    <View
      style={{
        width: '25%', // w-1/4
        display: 'flex',
        flexDirection: 'column',
        // 假设这里作为右侧栏，可能需要左边框分割
        borderLeftWidth: '1px',
        borderLeftStyle: 'solid',
        borderLeftColor: COLORS.gray100,
        height: '100%', // 确保填满父容器高度
      }}
    >
      {/* 1. 日期选择按钮 */}
      <View
        onClick={() => setShowTimerDialog(true)}
        style={actionButtonStyle}
        // active:bg-gray-100 -> hoverStyle
        hoverStyle={{ backgroundColor: COLORS.gray100 }}
        hoverStayTime={100}
      >
        <Icon name='CalendarDays' size={20} color={COLORS.gray500} />
        {/* text-[10px] text-gray-500 */}
        <Text
          style={{
            fontSize: '10px',
            color: COLORS.gray500,
            marginTop: '4px', // space-y-1
          }}
        >
          {dateStr}
        </Text>
      </View>

      {/* 2. 支出按钮 (+) */}
      <View
        onClick={() => onEdit('+')}
        style={actionButtonStyle}
        hoverStyle={{ backgroundColor: COLORS.gray100 }}
        hoverStayTime={100}
      >
        <Icon name='Plus' size={20} color={COLORS.gray500} />
        <Text
          style={{
            fontSize: '10px',
            color: COLORS.gray300,
            marginTop: '4px',
          }}
        >
          支出
        </Text>
      </View>

      {/* 3. 收入/退款按钮 (-) */}
      <View
        onClick={() => onEdit('-')}
        style={actionButtonStyle}
        hoverStyle={{ backgroundColor: COLORS.gray100 }}
        hoverStayTime={100}
      >
        <Icon name='Minus' size={20} color={COLORS.gray500} />
        <Text
          style={{
            fontSize: '10px',
            color: COLORS.gray300,
            marginTop: '4px',
          }}
        >
          收入/退款
        </Text>
      </View>

      {/* 4. 完成按钮 (Submit) */}
      <View
        onClick={() => onSubmit(recordedDate)}
        // className='flex-1 bg-primary-dark flex items-center justify-center text-base text-white active:bg-primary-dark5 transition-colors'
        style={{
          flex: 1,
          backgroundColor: COLORS.primaryDark,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        // active:bg-primary-dark5
        hoverStyle={{ backgroundColor: COLORS.primaryDark5 }}
        hoverStayTime={100}
      >
        <Text style={{ fontSize: '16px', color: COLORS.white }}>完成</Text>
      </View>

      {/*
         TimerDialog 弹窗
         注意：确保 TimerDialog 内部使用了 RootPortal，否则可能会被外层的 View 裁剪
      */}
      {showTimerDialog && (
        <TimerDialog
          date={recordedDate}
          onClick={setRecordedDate}
          onClose={() => setShowTimerDialog(false)}
          wheelFormat='YYYY-MM-DD'
        />
      )}
    </View>
  );
};
