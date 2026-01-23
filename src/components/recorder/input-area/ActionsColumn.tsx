import React, { useMemo, useState } from 'react';
import { View, Text } from '@tarojs/components';
import { Icon, TimerPicker } from '@/components/ui';
import * as dateUtils from '@/utils/dateUtils';
import { COLORS } from '@/styles/colors';

interface ActionsColumnProps {
  onSubmit: (d: Date) => void;
  onEdit: (op: '+' | '-') => void;
}

export const ActionsColumn: React.FC<ActionsColumnProps> = ({ onSubmit, onEdit }) => {
  const today = new Date();
  const [recordDate, setRecordDate] = useState(today);

  const dateStr = useMemo(() => {
    const dateDelta = dateUtils.dateDiff(recordDate, today);
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
      return dateUtils.formatDate(recordDate, 'MMM dd, EEEE');
    }
  }, [recordDate, today]);

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
        // 假设这里作为右侧栏，可能需要右边框分割
        borderRightWidth: '1px',
        borderRightStyle: 'solid',
        borderRightColor: COLORS.gray100,
        height: '100%', // 确保填满父容器高度
      }}
    >
      {/* 1. 日期选择按钮 */}
      <View
        // onClick={() => setShowTimerDialog(true)}
        style={actionButtonStyle}
        // active:bg-gray-100 -> hoverStyle
        hoverStyle={{ backgroundColor: COLORS.gray100 }}
        hoverStayTime={100}
      >
        <TimerPicker date={recordDate} setDate={setRecordDate} fields='day'>
          {/* 👇 这个 View 就是用户点击的地方 */}
          <View style={actionButtonStyle}>
            <Icon name='CalendarDays' size={20} color={COLORS.gray500} />
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
        </TimerPicker>
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
        onClick={() => onSubmit(recordDate)}
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
    </View>
  );
};
