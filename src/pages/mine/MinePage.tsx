import React, { useState, useContext } from 'react';
import { View, Text, Image } from '@tarojs/components'; // 1. 引入 Taro 组件
import { MenuItem } from '@/components/modals/mine/MenuItem';
import { PaymentPage } from '@/components/modals/PaymentPage';
import { LedgersPage } from '@/components/modals/ledger/LedgersPage';
import { LedgerSharingPage } from '@/components/modals/ledger/share/SharingPage';
import { UserProfilePage } from '@/components/modals/mine/user/UserProfilePage';
import { HelpPage } from '@/components/modals/mine/setting/HelpPage';
import { SettingPage } from '@/components/modals/mine/setting/SettingPage';
import { AppContext } from '@/context/AppContext';
import { Icon } from '@/components/ui/Icon';

// 定义颜色常量
const COLORS = {
  primary: '#76BDB9', // bg-primary
  gray50: '#f9fafb', // bg-gray-50
  gray100: '#f3f4f6', // bg-gray-100
  gray300: '#d1d5db', // text-gray-300
  gray400: '#9ca3af', // text-gray-400
  white: '#ffffff',
  black: '#000000',
  amber400: '#fbbf24', // text-amber-400
  amber400Op20: 'rgba(251, 191, 36, 0.2)', // bg-amber-400/20
  amber400Op60: 'rgba(251, 191, 36, 0.6)', // text-amber-400/60
};

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
    <View
      style={{
        paddingBottom: '100px', // pb-24 approx
        minHeight: '100vh',
        backgroundColor: COLORS.gray50,
      }}
    >
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

        {/* VIP Banner */}
        {/* className='mt-6 bg-black rounded-2xl p-4 flex items-center justify-between text-amber-400 shadow-lg ...' */}
        <View
          onClick={() => setShowPayment(true)}
          style={{
            marginTop: '24px', // mt-6
            backgroundColor: COLORS.black,
            borderRadius: '16px', // rounded-2xl
            padding: '16px', // p-4
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', // shadow-lg
          }}
        >
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {/* Crown Icon Container */}
            {/* className='p-2 bg-amber-400/20 rounded-lg' */}
            <View
              style={{
                padding: '8px',
                backgroundColor: COLORS.amber400Op20,
                borderRadius: '8px',
                marginRight: '12px', // space-x-3
              }}
            >
              <Icon name='Crown' size={20} color={COLORS.amber400} />
            </View>

            <View>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.amber400, display: 'block' }}>
                简单记账 VIP
              </Text>
              <Text style={{ fontSize: '10px', color: COLORS.amber400Op60 }}>解锁高级功能</Text>
            </View>
          </View>

          {/* Upgrade Button */}
          {/* className='bg-amber-400 text-black text-xs font-bold px-3 py-1.5 rounded-full' */}
          <View
            style={{
              backgroundColor: COLORS.amber400,
              padding: '6px 12px',
              borderRadius: '999px',
            }}
          >
            <Text style={{ color: COLORS.black, fontSize: '12px', fontWeight: 'bold' }}>升级</Text>
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
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          <MenuItem icon='Book' label='账本管理' onClick={() => setShowLedgers(true)} />
          <MenuItem icon='Users' label='账本共享' onClick={() => setShowSharing(true)} />
        </View>

        {/* Menu Group 2 */}
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          <MenuItem icon='HelpCircle' label='帮助与反馈' onClick={() => setShowHelp(true)} />
          <MenuItem
            icon='Settings' // 注意：Lucide 中 Setting 通常叫 Settings
            label='设置'
            onClick={() => setSetting(true)}
          />
        </View>
      </View>

      {/* Version */}
      <View style={{ textAlign: 'center', marginTop: '32px' }}>
        <Text style={{ fontSize: '10px', color: COLORS.gray300 }}>简单记账 v2.1.0</Text>
      </View>

      {/* Modals */}
      {/* 确保这些组件内部也都适配了 Taro (View/Text/RootPortal) */}
      {showPayment && <PaymentPage onClose={() => setShowPayment(false)} />}
      {showLedgers && <LedgersPage onClose={() => setShowLedgers(false)} />}
      {showSharing && <LedgerSharingPage onClose={() => setShowSharing(false)} />}
      {showProfile && <UserProfilePage onClose={() => setShowProfile(false)} />}
      {showHelp && <HelpPage onClose={() => setShowHelp(false)} />}
      {showSetting && <SettingPage onClose={() => setSetting(false)} />}
    </View>
  );
};
