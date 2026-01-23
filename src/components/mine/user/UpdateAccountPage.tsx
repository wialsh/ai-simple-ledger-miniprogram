import React, { useState } from 'react';
import { View, Text, Input, RootPortal } from '@tarojs/components';
import { WindowsCustom } from '@/components';
import { Icon } from '@/components/ui';
import { COLORS } from '@/styles/colors';

interface UpdateAccountPageProps {
  account: string;
  onBack: () => void;
  onSave: (newAccount: string) => void;
}

export const UpdateAccountPage: React.FC<UpdateAccountPageProps> = ({ account, onBack, onSave }) => {
  const [inputValue, setInputValue] = useState(account);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 校验逻辑
  const validateAccount = (val: string): string | null => {
    // 规则1: 长度 6-20
    if (val.length < 6 || val.length > 20) {
      return '账号长度限 6-20 位，建议避免包含姓名、生日等涉及个人隐私信息。';
    }

    // 规则2: 必须以字母或下划线开头
    // 规则3: 只能包含数字、字母、下划线、减号
    const regex = /^[a-zA-Z_][a-zA-Z0-9_-]*$/;

    if (!regex.test(val)) {
      return '账号必须以字母或者下划线开头，可以使用6-20位数字、字母、下划线、减号或它们的组合。';
    }

    return null;
  };

  // 处理输入变化
  const handleInput = (e: any) => {
    const val = e.detail.value;
    setInputValue(val);

    // 输入时实时清除之前的特定格式错误
    if (errorMsg) setErrorMsg(null);
  };

  // 处理提交
  const handleSubmit = () => {
    // 如果没有输入内容，不执行
    if (inputValue.length === 0) return;

    const error = validateAccount(inputValue);
    if (error) {
      setErrorMsg(error);
    } else {
      setErrorMsg(null);
      onSave(inputValue);
    }
  };

  const isFormatError = errorMsg;

  return (
    <WindowsCustom
      onBack={onBack}
      showNavBar
      className='animate-slide-up'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: COLORS.white,
        display: 'flex',
        flexDirection: 'column', // 垂直排列
      }}
    >
      {/* 红色错误提示栏 - 仅在格式错误时显示 */}
      {isFormatError && (
        <View
          className='animate-slide-up'
          style={{
            backgroundColor: COLORS.red500,
            paddingLeft: '24px', // px-6
            paddingRight: '24px',
            paddingTop: '12px', // py-3
            paddingBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: '14px',
              lineHeight: '20px', // leading-relaxed approx
              textAlign: 'left',
            }}
          >
            {errorMsg}
          </Text>
        </View>
      )}

      <View
        style={{
          paddingLeft: '32px', // px-8
          paddingRight: '32px',
          marginTop: '16px', // mt-4
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* 顶部提示文字 - 如果没有红色报错，则显示默认提示 */}
        {!isFormatError && (
          <Text
            style={{
              textAlign: 'center',
              color: COLORS.gray900,
              fontSize: '15px',
              lineHeight: '24px',
              marginBottom: '40px', // mb-10
              paddingLeft: '8px', // px-2
              paddingRight: '8px',
            }}
          >
            账号长度限 6-20 位，建议避免包含姓名、生日等涉及个人隐私信息。
          </Text>
        )}

        {/* 如果有红色报错，占位 */}
        {isFormatError && <View style={{ height: '40px' }} />}

        {/* 输入框区域 */}
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: COLORS.gray200,
            paddingTop: '12px', // py-3
            paddingBottom: '12px',
            marginBottom: '40px', // mb-10
          }}
        >
          <Text
            style={{
              color: COLORS.black,
              fontSize: '17px',
              width: '80px', // w-20
              fontWeight: 500, // font-medium
              flexShrink: 0,
            }}
          >
            账号
          </Text>

          <View style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
            <Input
              focus // autoFocus
              type='text'
              value={inputValue}
              onInput={handleInput}
              style={{
                width: '100%',
                fontSize: '17px',
                color: COLORS.black,
                backgroundColor: 'transparent',
                // Taro Input caret-color 不一定生效，视平台而定
              }}
            />

            {/* 清除按钮 */}
            {inputValue.length > 0 && (
              <View
                onClick={() => {
                  setInputValue('');
                  setErrorMsg(null);
                }}
                style={{
                  padding: '4px',
                  marginLeft: '8px',
                }}
              >
                <View
                  style={{
                    backgroundColor: COLORS.gray300,
                    borderRadius: '999px',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '16px',
                    height: '16px',
                  }}
                >
                  <Icon name='X' size={10} color={COLORS.white} strokeWidth={3} />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* 保存按钮 */}
        <View
          onClick={inputValue.length > 0 ? handleSubmit : undefined}
          hoverStyle={inputValue.length > 0 ? { backgroundColor: COLORS.primaryDark5 } : {}}
          style={{
            width: '100%',
            maxWidth: '300px',
            paddingTop: '12px', // py-3
            paddingBottom: '12px',
            borderRadius: '8px', // rounded-lg
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: inputValue.length > 0 ? COLORS.primaryDark : COLORS.gray300,
            transition: 'background-color 0.2s',
          }}
        >
          <Text
            style={{
              fontSize: '17px',
              fontWeight: 500,
              letterSpacing: '0.025em', // tracking-wide
              color: inputValue.length > 0 ? COLORS.white : COLORS.gray500,
            }}
          >
            保存
          </Text>
        </View>
      </View>
    </WindowsCustom>
  );
};
