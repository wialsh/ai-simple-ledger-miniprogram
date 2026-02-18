import React, { useState } from 'react';
import { View, Text, Image, RootPortal, ScrollView } from '@tarojs/components';
import { useAppContext } from '@/context/AppContext';
import { Icon, Switch } from '@/components/ui';
import * as dateUtils from '@/utils/dateUtils';
import { COLORS } from '@/styles/colors';
import { LedgerSharingMember, MemberSearchResult } from '@/types';
import { SearchPage } from './SearchPage';

interface MemberPageProps {
  onClick: () => void;
  onClose: () => void;
}

export const MemberPage: React.FC<MemberPageProps> = ({ onClick, onClose }) => {
  const { ledgerInfo, ledgerSharingMembers, setLedgerSharingMembers, updateLedgerInfoSharingMember } = useAppContext();

  const [showSearch, setShowSearch] = useState(false);
  const [showBatchMenu, setShowBatchMenu] = useState(false);

  // 切换单个开关
  const toggleMember = (memberId: number, checked: boolean) => {
    updateLedgerInfoSharingMember(memberId, { isSharing: checked });
  };

  // 添加成员回调
  const handleAddMember = (user: MemberSearchResult) => {
    const now = new Date();
    const newMember: LedgerSharingMember = {
      ...user,
      isSharing: true,
      joinTime: now,
      ledgerId: ledgerInfo.id,
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    };
    setLedgerSharingMembers([newMember, ...ledgerSharingMembers]);
  };

  const handleBatchAction = (action: 'all_on' | 'all_off') => {
    const isSharing = action === 'all_on';
    setLedgerSharingMembers(ledgerSharingMembers.map(m => ({ ...m, isSharing })));
    setShowBatchMenu(false); // 操作后关闭菜单
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
          zIndex: 700,
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
            justifyContent: 'space-between',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: COLORS.gray100,
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            position: 'relative',
            zIndex: 10,
            flexShrink: 0,
          }}
        >
          <View
            onClick={onClose}
            style={{
              padding: '8px',
              marginLeft: '-8px',
              borderRadius: '999px',
            }}
          >
            <Icon name='ChevronLeft' size={24} color={COLORS.gray800} />
          </View>

          <Text style={{ fontWeight: 'bold', fontSize: '18px', color: COLORS.gray800 }}>成员管理</Text>

          <View
            onClick={() => setShowSearch(true)}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '4px',
              padding: '8px',
              marginRight: '-8px',
            }}
          >
            <Icon name='UserPlus' size={20} color='#333' />
            <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>新增</Text>
          </View>
        </View>

        {/* 列表头部控制栏 */}
        <View
          style={{
            marginTop: '16px',
            marginLeft: '16px',
            marginRight: '16px',
            backgroundColor: COLORS.white,
            borderTopLeftRadius: '12px', // rounded-t-xl
            borderTopRightRadius: '12px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: COLORS.gray100,
            padding: '16px 20px', // py-4 px-5
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            position: 'relative',
            zIndex: 20,
          }}
        >
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
            <Icon name='User' size={16} color={COLORS.gray500} />
            <Text style={{ fontSize: '14px', fontWeight: 500, color: COLORS.gray500 }}>
              成员列表 ({ledgerSharingMembers.filter(m => m.isSharing).length}/{ledgerSharingMembers.length})
            </Text>
          </View>

          {/* 批量操作区域 */}
          <View style={{ position: 'relative' }}>
            <View
              onClick={() => setShowBatchMenu(!showBatchMenu)}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px', // py-1.5 px-3
                borderRadius: '8px',
                backgroundColor: showBatchMenu ? COLORS.gray100 : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: showBatchMenu ? COLORS.gray900 : COLORS.gray500,
                }}
              >
                批量操作
              </Text>
              <Icon name='Settings2' size={14} color={showBatchMenu ? COLORS.gray900 : COLORS.gray500} />
            </View>

            {/* 下拉菜单 */}
            {showBatchMenu && (
              <View>
                {/* 遮罩层 (全屏透明) */}
                <View
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10,
                  }}
                  onClick={() => setShowBatchMenu(false)}
                />

                {/* 菜单主体 */}
                <View
                  className='animate-slide-up'
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '8px',
                    width: '144px', // w-36
                    backgroundColor: COLORS.white,
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-xl
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: COLORS.gray100,
                    paddingTop: '6px',
                    paddingBottom: '6px',
                    zIndex: 20,
                  }}
                >
                  <View
                    onClick={() => handleBatchAction('all_on')}
                    hoverStyle={{ backgroundColor: COLORS.yellow100 }}
                    style={{
                      padding: '10px 16px',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Icon name='CheckCircle2' size={16} color={COLORS.green500} />
                    <Text style={{ fontSize: '14px', color: COLORS.gray700 }}>全部开启</Text>
                  </View>

                  <View style={{ height: '1px', backgroundColor: COLORS.gray50, margin: '2px 0' }} />

                  <View
                    onClick={() => handleBatchAction('all_off')}
                    hoverStyle={{ backgroundColor: COLORS.red50 }}
                    style={{
                      padding: '10px 16px',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Icon name='XCircle' size={16} color={COLORS.red400} />
                    <Text style={{ fontSize: '14px', color: COLORS.gray700 }}>全部关闭</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* 成员列表 - 使用 ScrollView */}
        <ScrollView
          scrollY
          style={{
            flex: 1,
            marginLeft: '16px',
            marginRight: '16px',
            backgroundColor: COLORS.white,
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            marginBottom: '100px', // 留出底部按钮空间
            overflow: 'hidden',
          }}
        >
          {ledgerSharingMembers.length === 0 ? (
            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
              <Text style={{ color: COLORS.gray400, fontSize: '14px' }}>暂无成员</Text>
            </View>
          ) : (
            <View>
              {ledgerSharingMembers.map((member, index) => (
                <View
                  key={member.id}
                  hoverStyle={{ backgroundColor: COLORS.gray50 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px',
                    borderBottomWidth: index !== ledgerSharingMembers.length - 1 ? '1px' : 0,
                    borderBottomStyle: 'solid',
                    borderBottomColor: COLORS.gray50,
                  }}
                >
                  {/* 左侧：头像与信息 */}
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
                    <Image
                      src={member.avatar}
                      mode='aspectFill'
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '999px',
                        backgroundColor: COLORS.gray200,
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: COLORS.gray100,
                      }}
                    />

                    <View style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Text style={{ fontWeight: 'bold', color: COLORS.gray800, fontSize: '15px' }}>
                        {member.nickname}
                      </Text>
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px' }}>
                        <Icon name='Clock' size={12} color={COLORS.gray400} />
                        <Text style={{ fontSize: '10px', color: COLORS.gray400 }}>
                          {dateUtils.formatDate(member.joinTime, 'YYYY-MM-DD')} 加入
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* 右侧：操作开关 */}
                  <Switch checked={member.isSharing} onChange={val => toggleMember(member.id, val)} />
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Footer Buttons */}
        <View
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            backgroundColor: COLORS.white,
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: COLORS.gray100,
            zIndex: 10,
            paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          }}
        >
          <View
            onClick={onClick}
            hoverStyle={{ opacity: 0.9, transform: 'scale(0.98)' }}
            style={{
              width: '100%',
              backgroundColor: COLORS.primaryDark,
              paddingTop: '14px',
              paddingBottom: '14px',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: '16px' }}>完 成</Text>
          </View>
        </View>

        {/* 搜索覆盖层 */}
        <SearchPage isOpen={showSearch} onClose={() => setShowSearch(false)} onAdd={handleAddMember} />
      </View>
    </RootPortal>
  );
};
