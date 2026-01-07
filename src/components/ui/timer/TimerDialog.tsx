import React, { useState } from 'react';
import { View, Text, RootPortal } from '@tarojs/components'; // 必须引入
import { Timer } from './TimerBasic';

interface TimerDialogProps {
  date: Date;
  onClick: (d: Date) => void;
  onClose: () => void;
  wheelFormat?: string;
}

// 定义颜色常量
const COLORS = {
  mask: 'rgba(0, 0, 0, 0.4)',
  white: '#ffffff',
  gray100: '#f3f4f6', // border-gray-100
  gray500: '#6b7280', // text-gray-500
  primaryDark: '#49807D', // text-primary-dark
};

export const TimerDialog: React.FC<TimerDialogProps> = ({ date, onClick, onClose, wheelFormat = 'YYYY-MM' }) => {
  const [wheelDate, setWheelDate] = useState(date);

  const handleConfirm = () => {
    onClick(wheelDate);
    onClose();
  };

  return (
    <RootPortal>
      {/* 外层容器：fixed inset-0 z-50 flex justify-end flex-col */}
      <View
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {/* 遮罩层：absolute inset-0 bg-black/40 */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: COLORS.mask,
          }}
          onClick={onClose}
        />

        {/* 弹窗主体：bg-white rounded-t-2xl z-10 w-full pb-safe shadow-2xl */}
        <View
          className='animate-slide-up'
          style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: '16px', // rounded-t-2xl
            borderTopRightRadius: '16px',
            zIndex: 100,
            width: '100%',
            boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)', // shadow-2xl 模拟
            // 适配底部安全区 (pb-safe)
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {/* 头部：flex justify-between items-center px-4 py-3 border-b */}
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px', // py-3 px-4
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: COLORS.gray100,
            }}
          >
            {/* 取消按钮 */}
            <View
              onClick={onClose}
              style={{ padding: '0 8px' }} // px-2
            >
              <Text style={{ fontSize: '14px', color: COLORS.gray500 }}>取消</Text>
            </View>

            {/* 标题 */}
            <Text style={{ fontSize: '16px', fontWeight: 600 }}>选择月份</Text>

            {/* 确认按钮 */}
            <View
              onClick={handleConfirm}
              style={{ padding: '0 8px' }} // px-2
            >
              <Text
                style={{
                  fontSize: '14px',
                  color: COLORS.primaryDark,
                  fontWeight: 600,
                }}
              >
                确认
              </Text>
            </View>
          </View>

          {/*
          ⚠️ 注意：
          Timer 组件内部也必须确保没有使用 div/span/select 等 HTML 标签，
          需要全部替换为 View/Text/PickerView。
        */}
          <Timer date={wheelDate} setDate={setWheelDate} wheelFormat={wheelFormat} />
        </View>
      </View>
    </RootPortal>
  );
};
