import React, { useState, useEffect, useContext } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Textarea, Image } from '@tarojs/components';
import { Icon } from '@/components/ui';
import { COLORS } from '@/styles/colors';
import { WindowsCustom } from '@/components';
import { AppContext } from '@/context/AppContext';

interface HelpPage2Props {
  onBack: () => void;
}

export const HelpPage2: React.FC<HelpPage2Props> = ({ onBack }) => {
  const { chatMessages, updateChatMessage } = useContext(AppContext);
  const [inputText, setInputText] = useState('');
  const [showTools, setShowTools] = useState(false);
  const [scrollIntoViewId, setScrollIntoViewId] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // 监听消息变化，自动滚动
  useEffect(() => {
    // 延时滚动，确保 DOM 渲染完毕
    // 加一个随机后缀防止 ID 重复导致不触发滚动
    setTimeout(() => {
      setScrollIntoViewId(`msg-${chatMessages.length - 1}`);
    }, 100);
  }, [chatMessages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    updateChatMessage(inputText, 'user', 'text');
    setInputText('');

    // 保持聚焦
    setIsFocused(true);

    // Mock Reply
    setTimeout(() => {
      updateChatMessage('感谢您的反馈！我们的团队会尽快处理。', 'support', 'text');
    }, 1000);
  };

  // 核心改造：使用 Taro API 选择媒体
  const handleFileClick = async (mediaType: 'image' | 'video') => {
    try {
      const res = await Taro.chooseMedia({
        count: 1,
        mediaType: [mediaType],
        sourceType: ['album', 'camera'],
        maxDuration: 60, // 视频最大时长
      });

      const tempFile = res.tempFiles[0];

      updateChatMessage(tempFile.tempFilePath, 'user', mediaType);
      setShowTools(false);
    } catch (err) {
      console.log('Choose media failed', err);
    }
  };

  return (
    <View>
      <WindowsCustom
        title='帮助反馈'
        onBack={onBack}
        showNavBar
        scrollIntoView={scrollIntoViewId}
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
        {/* Chat Area (ScrollView) */}
        <View style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {chatMessages.map((msg, index) => (
            <View
              key={index}
              id={`msg-${index}`} // 锚点 ID
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start', // 顶部对齐
              }}
            >
              {/* Support Avatar */}
              {msg.sender === 'support' && (
                <View
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '999px',
                    backgroundColor: COLORS.primaryOp20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '8px',
                    flexShrink: 0,
                  }}
                >
                  <Text style={{ color: COLORS.primaryDark, fontWeight: 'bold', fontSize: '12px' }}>Zi</Text>
                </View>
              )}

              {/* Message Bubble */}
              <View
                style={{
                  maxWidth: '75%',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  backgroundColor: msg.sender === 'user' ? COLORS.msgUserBg : COLORS.white,
                  boxShadow: `0 1px 2px ${COLORS.mask2}`,
                }}
              >
                {msg.type === 'text' && (
                  <Text
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: msg.sender === 'user' ? COLORS.black : COLORS.gray800,
                      whiteSpace: 'pre-wrap', // 保持换行
                    }}
                  >
                    {msg.content}
                  </Text>
                )}
                {msg.type === 'image' && (
                  <Image
                    src={msg.content}
                    mode='widthFix'
                    style={{
                      width: '200px', // 给个最大宽度
                      borderRadius: '8px',
                    }}
                  />
                )}
              </View>

              {/* User Avatar */}
              {msg.sender === 'user' && (
                <View
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '999px',
                    backgroundColor: COLORS.gray200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '8px',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <Icon name='User' size={20} color={COLORS.white} />
                </View>
              )}
            </View>
          ))}
        </View>
      </WindowsCustom>

      {/* Input Area */}
      <View
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: COLORS.bgInputArea,
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: COLORS.gray200,
          zIndex: 100,
          padding: '12px',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        }}
      >
        <View
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
        >
          {/* Plus Button */}
          <View
            onClick={() => setShowTools(!showTools)}
            hoverStyle={{ backgroundColor: COLORS.gray200 }}
            style={{
              padding: '8px',
              borderRadius: '999px',
              transition: 'transform 0.2s',
              transform: showTools ? 'rotate(45deg)' : 'rotate(0deg)',
            }}
          >
            <Icon name='Plus' size={24} color={COLORS.gray500} />
          </View>

          {/* Textarea Container */}
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.white,
              borderRadius: '12px',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '12px',
              paddingRight: '12px',
              paddingTop: '8px',
              paddingBottom: '8px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: COLORS.gray100,
            }}
          >
            <Textarea
              autoHeight // 自动增高
              placeholder=''
              value={inputText}
              onInput={e => setInputText(e.detail.value)}
              // 绑定 focus 状态
              focus={isFocused}
              // 这是微信小程序特有属性，点击页面其他地方不收起键盘
              holdKeyboard
              // 同步聚焦状态 (用户手动点击收起键盘时需要更新 state)
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxlength={1000}
              style={{
                width: '100%',
                fontSize: '14px',
                lineHeight: '20px',
                backgroundColor: 'transparent',
                padding: 0,
                minHeight: '20px',
                maxHeight: '60px', // max-h-24
              }}
              placeholderStyle={`color: ${COLORS.gray400}`}
              cursorSpacing={20} // 键盘弹起时距离底部的距离
            />
          </View>

          {/* Send */}
          <View
            // onClick={handleSend}
            // 阻止冒泡，防止触发 Input 的 onBlur (虽有 holdKeyboard，双重保险)
            onClick={e => {
              e.stopPropagation();
              handleSend();
            }}
            hoverStyle={{ opacity: 0.85 }}
            style={{
              backgroundColor: COLORS.green500,
              padding: '8px 16px',
              borderRadius: '8px',
              boxShadow: `0 2px 4px ${COLORS.mask3}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '24px',
            }}
          >
            <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: '14px' }}>发送</Text>
          </View>
        </View>

        {/* Tools Drawer */}
        {showTools && (
          <View
            className='animate-fade-in'
            style={{
              display: 'flex',
              flexDirection: 'row', // grid-cols-4
              gap: '16px',
              marginTop: '16px',
              paddingTop: '16px',
              paddingLeft: '8px',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: COLORS.gray200,
            }}
          >
            {/* Photo Tool */}
            <View
              onClick={() => handleFileClick('image')}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <View
                hoverStyle={{ backgroundColor: COLORS.gray50 }}
                style={{
                  width: '56px', // w-14
                  height: '56px',
                  backgroundColor: COLORS.white,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 1px 2px ${COLORS.mask2}`,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: COLORS.gray100,
                }}
              >
                <Icon name='Image' size={24} color={COLORS.gray600} />
              </View>
              <Text style={{ fontSize: '12px', color: COLORS.gray500 }}>照片</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
