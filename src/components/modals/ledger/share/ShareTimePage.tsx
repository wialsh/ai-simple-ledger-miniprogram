import React, { useState } from 'react';
import Taro from '@tarojs/taro'; // 引入 Taro API
import { View, Text, RootPortal } from '@tarojs/components'; // 引入 Taro 组件
import { Timer } from '@/components/ui/timer/TimerBasic';
import { Icon } from '@/components/ui/Icon';

interface ShareTimePageProps {
  date: Date;
  onClick: (d: Date) => void;
  onClose: () => void;
}

// 定义颜色常量
const COLORS = {
  bgBase: '#f7f8fa', // bg-[#f7f8fa]
  white: '#ffffff',
  gray100: '#f3f4f6', // border-gray-100
  gray400: '#9ca3af',
  gray500: '#6b7280',
  primaryDark: '#49807D',
  black: '#000000',
};

export const ShareTimePage: React.FC<ShareTimePageProps> = ({ date, onClick, onClose }) => {
  const [wheelDate, setWheelDate] = useState(date);
  const [isAgreed, setIsAgreed] = useState(false);

  const handleStart = () => {
    if (!isAgreed) {
      // ⚠️ 小程序替换 alert
      Taro.showToast({
        title: '请先同意分享协议',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    onClick(wheelDate);
  };

  return (
    // 使用 RootPortal 确保全屏覆盖
    <RootPortal>
      <View
        className='animate-slide-up' // 需在 common.scss 定义动画
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 700,
          backgroundColor: COLORS.bgBase,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: COLORS.white,
            padding: '16px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: COLORS.gray100,
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            position: 'relative',
            zIndex: 10,
            flexShrink: 0, // shrink-0
          }}
        >
          <View
            onClick={onClose}
            style={{
              padding: '8px',
              marginLeft: '-8px',
              borderRadius: '999px',
            }}
          >
            <Icon name='ChevronLeft' size={24} />
          </View>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '18px',
              marginRight: '32px',
            }}
          >
            设置共享开始时间
          </Text>
        </View>

        {/* Center Container */}
        <View
          style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box', // 确保 padding 不撑破宽度
          }}
        >
          {/* Main Card */}
          <View
            // 阻止冒泡 (虽然这里 View 没有父级点击事件，但保留习惯)
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              backgroundColor: COLORS.white,
              width: '100%',
              maxWidth: '380px',
              borderRadius: '12px', // rounded-xl
              paddingTop: '40px', // py-10
              paddingBottom: '40px',
              paddingLeft: '20px', // px-5
              paddingRight: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Text
              style={{
                fontSize: '13px',
                color: COLORS.gray500,
                marginBottom: '30px',
              }}
            >
              加入的伙伴可以看到共享日期后的全部记账数据
            </Text>

            {/* Timer Component */}
            {/* 确保 Timer 组件内部已适配 Taro (View/Text/PickerView) */}
            <Timer date={wheelDate} setDate={setWheelDate} />

            {/* Bottom Area */}
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '20px', // 给一点上边距
              }}
            >
              {/* Start Button */}
              <View
                onClick={handleStart}
                hoverStyle={{ opacity: 0.9, transform: 'scale(0.95)' }} // 模拟 active:scale-95
                style={{
                  backgroundColor: COLORS.primaryDark,
                  width: '100%',
                  paddingTop: '14px',
                  paddingBottom: '14px',
                  borderRadius: '30px',
                  marginBottom: '20px', // mb-5
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)',
                }}
              >
                <Text style={{ color: COLORS.white, fontSize: '16px', fontWeight: 'bold' }}>开启共享账单</Text>
              </View>

              {/* Agreement Checkbox */}
              <View
                onClick={() => setIsAgreed(!isAgreed)}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '8px',
                  fontSize: '13px',
                }}
              >
                {/* Radio Circle */}
                <View
                  style={{
                    width: '16px', // w-4
                    height: '16px', // h-4
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: isAgreed ? COLORS.primaryDark : COLORS.gray400,
                    borderRadius: '50%',
                    marginRight: '6px', // mr-1.5
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isAgreed && (
                    <View
                      style={{
                        width: '10px', // w-2.5
                        height: '10px',
                        backgroundColor: COLORS.primaryDark,
                        borderRadius: '50%',
                      }}
                    />
                  )}
                </View>

                <Text style={{ color: isAgreed ? COLORS.primaryDark : COLORS.gray500 }}>
                  同意将记账数据分享给加入的伙伴
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </RootPortal>
  );
};
