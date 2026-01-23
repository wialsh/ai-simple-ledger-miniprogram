import React, { useState } from 'react';
import { View, Text, Input, RootPortal } from '@tarojs/components';

interface DialogProps {
  // --- 基础弹窗属性 ---
  title?: string;
  content?: string;

  // --- 按钮与回调 ---
  onCloseName: string;
  onClickName: string;
  onClose: () => void;
  onClick: () => void;

  // --- 样式自定义 (改为 CSSProperties) ---
  /** 取消按钮容器样式 (背景色等) */
  onCloseStyle?: React.CSSProperties;
  /** 取消按钮文字样式 (颜色等) */
  onCloseTextStyle?: React.CSSProperties;
  /** 确认按钮容器样式 (背景色等) */
  onClickStyle?: React.CSSProperties;
  /** 确认按钮文字样式 (颜色等) */
  onClickTextStyle?: React.CSSProperties;

  // --- 输入框属性 ---
  showInput?: boolean;
  inputValue?: string;
  onInput?: (val: string) => void;
  inputPlaceholder?: string;
  inputMaxLength?: number;
  inputAutoFocus?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  title,
  content,
  onCloseName,
  onClickName,
  onClose,
  onClick,

  // 默认样式为空对象，后面会与基础样式合并
  onCloseStyle,
  onCloseTextStyle,
  onClickStyle,
  onClickTextStyle,

  showInput = false,
  inputValue = '',
  onInput,
  inputPlaceholder = '',
  inputMaxLength = 20,
  inputAutoFocus = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // 定义基础颜色常量，作为默认值
  const DEFAULT_COLORS = {
    closeBg: '#f3f4f6', // gray-100
    closeText: '#4b5563', // gray-600
    confirmBg: '#49807D', // primary-dark
    confirmText: '#ffffff', // white (通常确认按钮文字是白色)
  };

  return (
    <RootPortal>
      <View
        className='animate-slide-up'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '24px',
        }}
      >
        <View
          className='animate-slide-up'
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '320px',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* 标题 */}
          {title && (
            <View style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>{title}</Text>
            </View>
          )}

          {/* 内容 */}
          {content && (
            <View style={{ marginBottom: '24px' }}>
              <Text style={{ fontSize: '14px', color: '#4b5563' }}>{content}</Text>
            </View>
          )}

          {/* 输入框 */}
          {showInput && (
            <Input
              type='text'
              focus={inputAutoFocus}
              value={inputValue}
              placeholder={inputPlaceholder}
              maxlength={inputMaxLength}
              onInput={e => onInput && onInput(e.detail.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{
                width: '100%',
                backgroundColor: '#f3f4f6',
                padding: '0 12px',
                borderRadius: '12px',
                marginBottom: '24px',
                fontSize: '16px',
                color: '#111827',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isFocused ? '#76BDB9' : 'transparent',
                boxSizing: 'border-box',
                height: '48px',
                // 添加 lineHeight 并使其等于 height
                // 这是单行输入框垂直居中的标准做法
                lineHeight: '48px',
              }}
              placeholderStyle='color: #9ca3af'
            />
          )}

          {/* 按钮区域 */}
          <View style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
            {/* 取消按钮 */}
            <View
              onClick={onClose}
              style={{
                flex: 1,
                paddingTop: '12px',
                paddingBottom: '12px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: DEFAULT_COLORS.closeBg, // 默认背景
                ...onCloseStyle, // ✨ 合并传入的容器样式
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: DEFAULT_COLORS.closeText, // 默认文字色
                  ...onCloseTextStyle, // ✨ 合并传入的文字样式
                }}
              >
                {onCloseName}
              </Text>
            </View>

            {/* 确认按钮 */}
            <View
              onClick={onClick}
              style={{
                flex: 1,
                paddingTop: '12px',
                paddingBottom: '12px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: DEFAULT_COLORS.confirmBg, // 默认背景
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                ...onClickStyle, // ✨ 合并传入的容器样式
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: DEFAULT_COLORS.confirmText, // 默认文字色
                  ...onClickTextStyle, // ✨ 合并传入的文字样式
                }}
              >
                {onClickName}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </RootPortal>
  );
};
