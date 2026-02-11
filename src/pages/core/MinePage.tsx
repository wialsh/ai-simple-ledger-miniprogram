import React, { useState, useContext } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { AppContext } from '@/context/AppContext';
import { WindowsCustom } from '@/components';
import {
  MenuItem,
  UserProfilePage,
  LedgersPage,
  LedgerSharePage,
  HelpPage2,
  SettingPage,
  PaymentPage,
} from '@/components/mine';
import { Icon } from '@/components/ui';
import { COLORS } from '@/styles/colors';

export const MinePage: React.FC = () => {
  const { userProfile } = useContext(AppContext);
  const [showPayment, setShowPayment] = useState(false);
  const [showLedgers, setShowLedgers] = useState(false);
  const [showSharing, setShowSharing] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSetting, setSetting] = useState(false);

  return (
    // className='pb-24 min-h-screen bg-gray-50'
    <WindowsCustom>
      {/* Header Profile */}
      {/* className='bg-primary pt-12 pb-8 px-6 rounded-b-[40px] shadow-sm relative overflow-hidden' */}
      <View
        style={{
          backgroundColor: COLORS.primary,
          paddingTop: '48px', // pt-12
          paddingBottom: '32px', // pb-8
          paddingLeft: '24px', // px-6
          paddingRight: '24px',
          borderBottomLeftRadius: '40px', // rounded-b-[40px]
          borderBottomRightRadius: '40px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* User Info Row */}
        {/* className='flex items-center space-x-4 relative z-10' */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
            zIndex: 10,
          }}
          onClick={() => setShowProfile(true)}
        >
          {/* Avatar */}
          {/* className='w-16 h-16 rounded-full border-4 border-white shadow-md bg-gray-100 overflow-hidden flex items-center justify-center' */}
          <View
            style={{
              width: '64px', // w-16
              height: '64px',
              borderRadius: '50%',
              borderWidth: '4px',
              borderStyle: 'solid',
              borderColor: COLORS.white,
              backgroundColor: COLORS.gray100,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px', // space-x-4
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', // shadow-md
            }}
          >
            {userProfile?.avatar ? (
              <Image
                src={userProfile?.avatar}
                mode='aspectFill' // 对应 object-cover
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <Icon name='User' size={32} color={COLORS.gray400} />
            )}
          </View>

          {/* Name & Info */}
          <View style={{ flex: 1, color: COLORS.black }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>{userProfile?.nickname}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Menu List */}
      {/* className='px-4 -mt-4 relative z-20 space-y-4' */}
      <View
        style={{
          paddingLeft: '16px',
          paddingRight: '16px',
          marginTop: '-16px', // 关键：负边距实现重叠效果
          position: 'relative',
          zIndex: 20,
        }}
      >
        {/* Menu Group 1 */}
        {/* className='bg-white rounded-2xl shadow-sm overflow-hidden' */}
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '16px', // space-y-4
            boxShadow: `0 1px 2px 0 ${COLORS.mask2}`,
          }}
        >
          {/* <MenuItem icon='Book' label='账本管理（敬请期待）' onClick={() => setShowLedgers(true)} disabled /> */}
          {/* <MenuItem icon='Users' label='账本共享（敬请期待）' onClick={() => setShowSharing(true)} disabled /> */}
        </View>

        {/* Menu Group 2 */}
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: `0 1px 2px 0 ${COLORS.mask2}`,
          }}
        >
          <MenuItem icon='HelpCircle' label='帮助与反馈' onClick={() => setShowHelp(true)} />
          {/* <MenuItem icon='Settings' label='设置' onClick={() => setSetting(true)} /> */}
        </View>
      </View>

      {/* Version */}
      <View style={{ textAlign: 'center', marginTop: '32px' }}>
        <Text style={{ fontSize: '10px', color: COLORS.gray300 }}>简单记账 v1.1.0</Text>
      </View>

      {/* Modals */}
      {/* 确保这些组件内部也都适配了 Taro (View/Text/RootPortal) */}
      {showPayment && <PaymentPage onClose={() => setShowPayment(false)} />}
      {showLedgers && <LedgersPage onClose={() => setShowLedgers(false)} />}
      {showSharing && <LedgerSharePage onClose={() => setShowSharing(false)} />}
      {showProfile && <UserProfilePage onBack={() => setShowProfile(false)} />}
      {showHelp && <HelpPage2 onBack={() => setShowHelp(false)} />}
      {showSetting && <SettingPage onBack={() => setSetting(false)} />}
    </WindowsCustom>
  );
};
