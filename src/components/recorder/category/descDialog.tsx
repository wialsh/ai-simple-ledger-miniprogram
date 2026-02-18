import React, { useContext, useRef } from 'react';
import { View, Text, RootPortal, Textarea } from '@tarojs/components';
import { AppContext } from '@/context/AppContext';
import { COLORS } from '@/styles/colors';

interface LedgerDescriptionDialogProps {
  maxLength?: number;
  onClose: () => void;
}

export const LedgerDescriptionDialog: React.FC<LedgerDescriptionDialogProps> = ({ onClose }) => {
  const { updateLedgerInfo } = useContext(AppContext);
  // const [textValue, setTextValue] = useState('');
  // 1. 改用 Ref 存储数据，不触发渲染
  const textValueRef = useRef('');

  const handleConfirm = () => {
    let ledgerDescriton = textValueRef.current.trim();
    if (!ledgerDescriton || ledgerDescriton.length < 3) {
      ledgerDescriton = '记录工作相关收支，如差旅、办公、团建等。';
    }

    updateLedgerInfo({
      description: ledgerDescriton,
      type: 1,
    });
    onClose();
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
          zIndex: 100,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <View
          className='animate-slide-up'
          style={{
            width: '100%',
            maxWidth: '320px',
            backgroundColor: COLORS.white,
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* 标题 */}
          <Text
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: COLORS.black,
              marginBottom: '8px',
              textAlign: 'center',
            }}
          >
            账本描述
          </Text>

          <Text
            style={{
              fontSize: '12px',
              color: COLORS.gray500,
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            请输入账本的描述信息（不少于6个字符）
          </Text>

          {/* 大编辑框容器 */}
          <View
            style={{
              backgroundColor: COLORS.gray100,
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '24px',
              // ✨ 关键：设置 relative，作为换行按钮的定位基准
              position: 'relative',
            }}
          >
            <Textarea
              // value={textValue}
              // onInput={e => setTextValue(e.detail.value)}
              onInput={e => {
                textValueRef.current = e.detail.value;
              }}
              placeholder='例如：记录工作相关收支，如差旅、办公、团建等。'
              maxlength={-1}
              style={{
                width: '100%',
                height: '300px',
                fontSize: '16px',
                color: COLORS.black,
                lineHeight: '24px',
                // 给顶部留出一点 padding，防止文字被右上角按钮遮挡
                paddingTop: '2px',
              }}
              placeholderStyle={`color: ${COLORS.gray400};`}
            />
          </View>

          {/* 按钮区域 */}
          <View style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
            {/* <View
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: COLORS.gray100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontWeight: 'bold', color: COLORS.gray500, fontSize: '14px' }}>取消</Text>
            </View> */}

            <View
              onClick={handleConfirm}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: COLORS.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontWeight: 'bold', color: COLORS.black, fontSize: '14px' }}>确认</Text>
            </View>
          </View>
        </View>
      </View>
    </RootPortal>
  );
};
