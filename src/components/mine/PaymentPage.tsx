import React from 'react';
import { View, Text, ScrollView, RootPortal } from '@tarojs/components'; // 1. 引入 Taro 组件
import { Icon } from '@/components/ui'; // 2. 使用封装的 Icon 组件
import { COLORS } from '@/styles/colors';

interface PaymentPageProps {
  onClose: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ onClose }) => {
  return (
    // 使用 RootPortal 确保覆盖全屏，不受父级 z-index 影响
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
          backgroundColor: COLORS.white,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: COLORS.white,
            padding: '16px', // py-4 px-4
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: COLORS.gray100,
            // 适配顶部安全区 (可选)
            // paddingTop: 'env(safe-area-inset-top)',
          }}
        >
          {/* Close Button */}
          <View
            onClick={onClose}
            style={{
              padding: '8px',
              marginLeft: '-8px',
              borderRadius: '999px',
              // hover:bg-gray-100 在小程序通常忽略或用 active 态
            }}
          >
            <Icon name='ChevronLeft' size={24} />
          </View>

          {/* Title */}
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '18px',
              marginRight: '32px', // 平衡左侧按钮宽度
            }}
          >
            VIP 会员
          </Text>
        </View>

        {/* Content - 使用 ScrollView 替换 overflow-y-auto */}
        <ScrollView
          scrollY
          style={{
            flex: 1,
            backgroundColor: COLORS.gray50,
          }}
        >
          <View style={{ padding: '24px' }}>
            {/* VIP Card */}
            <View
              style={{
                // 线性渐变背景
                background: `linear-gradient(to right, ${COLORS.gray900}, ${COLORS.black})`,
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '32px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', // shadow-xl
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px',
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: COLORS.amber300,
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    高级权限
                  </Text>
                  <Text style={{ fontSize: '14px', color: COLORS.whiteOp70 }}>解锁所有高级功能</Text>
                </View>
                <Icon name='Crown' size={32} color={COLORS.amber300} />
              </View>

              {/* Feature List */}
              <View style={{ marginTop: '24px' }}>
                {['无限云同步', '高级数据分析', '导出 CSV/Excel'].map((feature, idx) => (
                  <View
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: '8px', // space-y-2
                    }}
                  >
                    <Icon name='Check' size={16} color={COLORS.green400} />
                    <Text style={{ fontSize: '14px', color: COLORS.whiteOp90, marginLeft: '8px' }}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Plan Selection */}
            <Text
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: COLORS.gray800,
                marginBottom: '16px',
                display: 'block',
              }}
            >
              选择方案
            </Text>

            <View>
              {/* 年度会员 (Active) */}
              <View
                style={{
                  backgroundColor: COLORS.white,
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: COLORS.primary,
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px', // space-y-4
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }}
              >
                <View>
                  <Text style={{ fontWeight: 'bold', display: 'block', color: COLORS.black }}>年度会员</Text>
                  <Text style={{ fontSize: '12px', color: COLORS.gray500 }}>¥18.00 / 月</Text>
                </View>
                <Text style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.black }}>¥218.00</Text>
              </View>

              {/* 月度会员 (Normal) */}
              <View
                style={{
                  backgroundColor: COLORS.white,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: COLORS.gray200,
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  opacity: 0.8,
                }}
              >
                <View>
                  <Text style={{ fontWeight: 'bold', display: 'block', color: COLORS.black }}>月度会员</Text>
                  <Text style={{ fontSize: '12px', color: COLORS.gray500 }}>随时取消</Text>
                </View>
                <Text style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.black }}>¥28.00</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer Button */}
        <View
          style={{
            padding: '16px',
            backgroundColor: COLORS.white,
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: COLORS.gray100,
            // 适配底部安全区
            paddingBottom: 'env(safe-area-inset-bottom)',
            boxSizing: 'content-box', // 确保 padding 不挤压高度
          }}
        >
          <View
            onClick={onClose} // 模拟订阅逻辑，暂时关闭
            hoverStyle={{ opacity: 0.9, transform: 'scale(0.98)' }} // 模拟 active:scale-[0.98]
            style={{
              width: '100%',
              backgroundColor: COLORS.primary,
              borderRadius: '12px',
              paddingTop: '14px', // py-3.5
              paddingBottom: '14px', // py-3.5
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', // shadow-lg
            }}
          >
            <Text style={{ color: COLORS.black, fontWeight: 'bold', fontSize: '16px' }}>立即订阅</Text>
          </View>
        </View>
      </View>
    </RootPortal>
  );
};
