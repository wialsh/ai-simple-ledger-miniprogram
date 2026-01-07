import React, { useState, useContext } from 'react';
import Taro from '@tarojs/taro'; // 引入 Taro 用于调用相册 API
import { View, Text, Image, RootPortal } from '@tarojs/components';
import { AppContext } from '@/context/AppContext';
import { Icon } from '@/components/ui/Icon';
import { GenderDialog } from '@/components/ui/GenderDialog';
import { Dialog } from '@/components/ui/Dialog';
import { UpdateAccountPage } from './UpdateAccountPage';

interface UserProfilePageProps {
  onClose: () => void;
}

// 定义颜色常量
const COLORS = {
  gray50: '#f9fafb',
  white: '#ffffff',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray700: '#374151',
  black: '#000000',
  primaryDark: '#49807D',
};

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ onClose }) => {
  const { userProfile, updateUserProfile } = useContext(AppContext);

  const [showGenderPage, setShowGenderPage] = useState(false);
  const [showNicknameDialog, setshowNicknameDialog] = useState(false);
  const [showAccountPage, setshowAccountPage] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(userProfile.nickname);

  // 1. 修改头像点击逻辑：使用 Taro.chooseImage
  const handleAvatarClick = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1, // 只选一张
        sizeType: ['compressed'], // 压缩图
        sourceType: ['album', 'camera'], // 相册或相机
      });

      const tempFilePath = res.tempFilePaths[0];

      // 注意：这里得到的是本地临时路径 (http://tmp/...)
      // 在实际项目中，你通常需要在这里调用 Taro.uploadFile 将图片上传到服务器
      // 获取服务器 URL 后再调用 updateUserProfile

      // 这里仅做演示，直接设置本地路径
      updateUserProfile({ avatar: tempFilePath });
    } catch (err) {
      // 用户取消选择或报错
      console.log('Select image failed/cancelled', err);
    }
  };

  const handleNicknameSave = () => {
    if (nicknameInput.trim()) {
      updateUserProfile({ nickname: nicknameInput.trim() });
      setshowNicknameDialog(false);
    }
  };

  const handleGenderSelect = (gender: number) => {
    updateUserProfile({ gender });
    setShowGenderPage(false);
  };

  const handleAccountSave = (accountInput: string) => {
    if (accountInput.trim()) {
      updateUserProfile({ account: accountInput.trim() });
      setshowAccountPage(false);
    }
  };

  // 辅助样式：列表项容器
  const listItemStyle: React.CSSProperties = {
    padding: '16px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    // 模拟 active:bg-gray-50，实际需配合 hoverStyle
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
          zIndex: 800,
          backgroundColor: COLORS.gray50,
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
          }}
        >
          <View
            onClick={onClose}
            style={{
              padding: '8px',
              marginLeft: '-8px',
              borderRadius: '999px',
              position: 'absolute',
              left: '16px',
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
            }}
          >
            个人信息
          </Text>
        </View>

        {/* Content */}
        <View style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Profile Picture */}
          <View
            onClick={handleAvatarClick} // 绑定 Taro 选择图片事件
            hoverStyle={{ backgroundColor: COLORS.gray50 }}
            style={{
              backgroundColor: COLORS.white,
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }}
          >
            <Text style={{ fontWeight: 500, color: COLORS.gray700 }}>头像</Text>

            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: COLORS.gray100,
                  borderRadius: '999px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: COLORS.gray200,
                  marginRight: '12px', // space-x-3
                }}
              >
                {userProfile.avatar ? (
                  <Image src={userProfile.avatar} mode='aspectFill' style={{ width: '100%', height: '100%' }} />
                ) : (
                  <Icon name='User' size={24} color={COLORS.gray400} />
                )}
              </View>
              <Icon name='ChevronRight' size={16} color={COLORS.gray300} />
            </View>

            {/* ❌ 移除了 <input type="file" /> */}
          </View>

          {/* Details List */}
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }}
          >
            {/* Nickname */}
            <View
              onClick={() => setshowNicknameDialog(true)}
              hoverStyle={{ backgroundColor: COLORS.gray50 }}
              style={{
                ...listItemStyle,
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: COLORS.gray100,
              }}
            >
              <Text style={{ fontWeight: 500, color: COLORS.gray700 }}>昵称</Text>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: COLORS.gray500, fontSize: '14px', marginRight: '8px' }}>
                  {userProfile.nickname}
                </Text>
                <Icon name='ChevronRight' size={16} color={COLORS.gray300} />
              </View>
            </View>

            {/* Account */}
            <View
              onClick={() => setshowAccountPage(true)}
              hoverStyle={{ backgroundColor: COLORS.gray50 }}
              style={{
                ...listItemStyle,
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: COLORS.gray100,
              }}
            >
              <Text style={{ fontWeight: 500, color: COLORS.gray700 }}>账号</Text>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: COLORS.gray500, fontSize: '14px', marginRight: '8px' }}>
                  {userProfile.account}
                </Text>
                <Icon name='ChevronRight' size={16} color={COLORS.gray300} />
              </View>
            </View>

            {/* Gender */}
            <View
              onClick={() => setShowGenderPage(true)}
              hoverStyle={{ backgroundColor: COLORS.gray50 }}
              style={listItemStyle}
            >
              <Text style={{ fontWeight: 500, color: COLORS.gray700 }}>性别</Text>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: COLORS.gray500, fontSize: '14px', marginRight: '8px' }}>
                  {userProfile.gender === 1 ? '男' : userProfile.gender === 2 ? '女' : '未知'}
                </Text>
                <Icon name='ChevronRight' size={16} color={COLORS.gray300} />
              </View>
            </View>
          </View>
        </View>

        {/* Modals */}
        {showGenderPage && <GenderDialog onClick={handleGenderSelect} onClose={() => setShowGenderPage(false)} />}

        {showNicknameDialog && (
          <Dialog
            title='修改昵称'
            onCloseName='取消'
            onClickName='保存'
            onClose={() => setshowNicknameDialog(false)}
            onClick={handleNicknameSave}
            // 使用 style 对象替代 tailwind 类名
            onClickStyle={{ backgroundColor: COLORS.primaryDark }}
            onClickTextStyle={{ color: COLORS.white }}
            showInput={true}
            inputValue={nicknameInput}
            onInput={setNicknameInput}
            inputPlaceholder='请输入昵称'
            inputMaxLength={20}
          />
        )}

        {showAccountPage && (
          <UpdateAccountPage
            account={userProfile.account}
            onBack={() => setshowAccountPage(false)}
            onSave={handleAccountSave}
          />
        )}
      </View>
    </RootPortal>
  );
};
