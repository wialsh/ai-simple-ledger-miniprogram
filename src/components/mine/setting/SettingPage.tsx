import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { WindowsCustom } from '@/components';
import { UserProfilePage } from '@/components/mine/user/UserProfilePage';
import { Icon } from '@/components/ui';
import { COLORS } from '@/styles/colors';
// import { LoginPage } from '../user/login';

interface SettingPageProps {
  onBack: () => void;
}

export const SettingPage: React.FC<SettingPageProps> = ({ onBack }) => {
  const [showUserProfile, setShowUserProfile] = useState(false);

  const handleLogout = () => {
    // ⚠️ 小程序不支持 window.confirm，使用 Taro.showModal
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗?',
      confirmColor: COLORS.red500, // 确认按钮红色
      success: function (res) {
        if (res.confirm) {
          // Mock logout
          Taro.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 2000,
          });

          // 延迟关闭，让 toast 显示一会
          setTimeout(() => {
            onBack();
          }, 1000);
        }
      },
    });
  };

  if (showUserProfile) {
    // 假设 UserProfilePage 已经适配了全屏/RootPortal
    return <UserProfilePage onBack={() => setShowUserProfile(false)} />;
  }

  return (
    <WindowsCustom
      title='设置'
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
      <View
        style={{
          marginTop: '12px',
          backgroundColor: COLORS.white,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* User Profile Item */}
        <View
          onClick={() => setShowUserProfile(true)}
          hoverStyle={{ backgroundColor: COLORS.gray50 }}
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            // 模拟 divide-y (如果有多个子项，需要在非最后一个子项加 border-bottom)
            // 这里只有一个项，暂不需要 border
          }}
        >
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Icon name='UserCog' size={20} />
            <Text
              style={{
                marginLeft: '16px',
                fontWeight: 500,
                color: COLORS.gray700,
                fontSize: '16px',
              }}
            >
              个人信息
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Icon name='ChevronRight' size={16} color={COLORS.gray300} />
          </View>
        </View>

        {/* login */}
        <View
          hoverStyle={{ backgroundColor: COLORS.gray50 }}
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            // 模拟 divide-y (如果有多个子项，需要在非最后一个子项加 border-bottom)
            // 这里只有一个项，暂不需要 border
          }}
        >
          {/* {LoginPage()} */}
        </View>
      </View>

      {/* Footer Area */}
      <View style={{ padding: '16px' }}>
        {/* Logout Button */}
        <View
          onClick={handleLogout}
          hoverStyle={{ backgroundColor: COLORS.red50 }} // active:bg-red-50
          style={{
            width: '100%',
            backgroundColor: COLORS.white,
            borderRadius: '12px',
            padding: '16px',
            marginTop: '32px', // mt-8
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          <Icon name='LogOut' size={20} color={COLORS.red500} />
          <Text
            style={{
              marginLeft: '8px', // space-x-2
              color: COLORS.red500,
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            退出登录
          </Text>
        </View>
      </View>
    </WindowsCustom>
  );
};
