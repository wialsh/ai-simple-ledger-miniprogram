import React from 'react';
import { View, Text, RootPortal } from '@tarojs/components'; // 1. 引入 Taro 组件
import { COLORS } from '@/styles/colors'; // 假设你已提取颜色常量

interface GenderDialogProps {
  onClick: (genders: number) => void;
  onClose: () => void;
}

export const GenderDialog: React.FC<GenderDialogProps> = ({ onClick, onClose }) => {
  const handleGenderSelect = (gender: number) => {
    onClick(gender);
    onClose();
  };

  // 按钮通用样式
  const buttonStyle: React.CSSProperties = {
    width: '100%',
    paddingTop: '12px', // py-3
    paddingBottom: '12px', // py-3
    backgroundColor: COLORS.gray50,
    borderRadius: '12px', // rounded-xl
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px', // space-y-2 的替代
  };

  const textStyle: React.CSSProperties = {
    fontWeight: 'bold',
    fontSize: '16px',
    color: COLORS.gray800,
  };

  return (
    // 使用 RootPortal 覆盖全屏
    <RootPortal>
      <View
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 900, // z-[100]
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {/* 遮罩层 (bg-black/40) */}
        <View
          className='animate-slide-up'
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}
          onClick={onClose}
        />

        {/* 弹窗主体 */}
        <View
          className='animate-slide-up'
          style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: '16px', // rounded-t-2xl
            borderTopRightRadius: '16px',
            zIndex: 10,
            padding: '24px', // p-6
            // 适配底部安全区
            paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 标题 */}
          <View style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <Text style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.gray400 }}>选择性别</Text>
          </View>

          {/* 选项按钮 */}
          <View
            onClick={() => handleGenderSelect(1)}
            style={buttonStyle}
            hoverStyle={{ backgroundColor: COLORS.gray100 }} // active:bg-gray-100
          >
            <Text style={textStyle}>男</Text>
          </View>

          <View
            onClick={() => handleGenderSelect(2)}
            style={buttonStyle}
            hoverStyle={{ backgroundColor: COLORS.gray100 }}
          >
            <Text style={textStyle}>女</Text>
          </View>

          <View
            onClick={() => handleGenderSelect(0)} // 修正：未知通常为 0
            style={buttonStyle}
            hoverStyle={{ backgroundColor: COLORS.gray100 }}
          >
            <Text style={textStyle}>未知</Text>
          </View>

          {/* 间隔 h-2 */}
          <View style={{ height: '8px' }} />

          {/* 取消按钮 */}
          <View
            onClick={onClose}
            hoverStyle={{ backgroundColor: COLORS.gray50 }}
            style={{
              width: '100%',
              paddingTop: '12px',
              paddingBottom: '12px',
              backgroundColor: COLORS.white,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: COLORS.gray200,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.gray500 }}>取消</Text>
          </View>
        </View>
      </View>
    </RootPortal>
  );
};
