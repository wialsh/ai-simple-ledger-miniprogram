import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, RootPortal } from '@tarojs/components'; // 1. 引入 Taro 组件
import { AppContext } from '@/context/AppContext';
import { Icon, Dialog } from '@/components/ui';
import { Ledger, ClickType } from '@/types';
import { COLORS } from '@/styles/colors';
import { ShareCardModal } from './ShareCard';
import { ShareTimePage } from './ShareTimePage';
import { MemberPage } from './MemberPage';

interface LedgerSharePageProps {
  onClose: () => void;
}

export const LedgerSharePage: React.FC<LedgerSharePageProps> = ({ onClose }) => {
  const { mineLedgers, joinedLedgers, updateLedgerInfo, currentDate } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'shared' | 'joined'>('shared');
  const [shareDate, setShareDate] = useState(currentDate);
  const [targetLedger, setTargetLedger] = useState<Ledger | null>(null);
  const [clickType, setClickType] = useState<ClickType>('');

  const shareableLedgers = mineLedgers.sort((a, b) => {
    const timeA = a.joiningTime ? new Date(a.joiningTime).getTime() : 0;
    const timeB = b.joiningTime ? new Date(b.joiningTime).getTime() : 0;
    return timeB - timeA;
  });

  const handleShareOp = (type: number) => {
    if (targetLedger) {
      updateLedgerInfo(targetLedger.id, { type: type });
    }
    setClickType('');
  };

  const handleShareClick = (type: ClickType = '', ledger?: Ledger, date?: Date) => {
    setClickType(type);
    if (ledger) {
      setTargetLedger(ledger);
    }
    if (date) {
      setShareDate(date);
    }
    if (type === 'CancelShare') {
      // 这里的 CancelShare 仅仅是打开弹窗，真正执行是在 Dialog 的 confirm 中
      // 所以这里不需要立即执行 handleShareOp(0)
    } else if (type === 'Complete') {
      handleShareOp(1);
    }
  };

  // 真正的取消操作
  const confirmCancelShare = () => {
    handleShareOp(0);
  };

  // 关闭任何操作，重置状态
  const resetClickType = () => {
    setClickType('');
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
          backgroundColor: COLORS.white,
          zIndex: 700,
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
              marginRight: '32px',
            }}
          >
            分享管理
          </Text>
        </View>

        {/* Tabs */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            padding: '16px',
            gap: '16px',
            backgroundColor: 'rgba(249, 250, 251, 0.5)', // bg-gray-50/50
          }}
        >
          <View
            onClick={() => setActiveTab('shared')}
            style={{
              flex: 1,
              paddingTop: '10px',
              paddingBottom: '10px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: activeTab === 'shared' ? COLORS.primary : COLORS.white,
              boxShadow: activeTab === 'shared' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
              borderWidth: activeTab === 'shared' ? 0 : '1px',
              borderStyle: 'solid',
              borderColor: COLORS.gray100,
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: '14px',
                color: activeTab === 'shared' ? COLORS.black : COLORS.gray500,
              }}
            >
              我的账本
            </Text>
          </View>

          <View
            onClick={() => setActiveTab('joined')}
            style={{
              flex: 1,
              paddingTop: '10px',
              paddingBottom: '10px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: activeTab === 'joined' ? COLORS.primary : COLORS.white,
              boxShadow: activeTab === 'joined' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
              borderWidth: activeTab === 'joined' ? 0 : '1px',
              borderStyle: 'solid',
              borderColor: COLORS.gray100,
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: '14px',
                color: activeTab === 'joined' ? COLORS.black : COLORS.gray500,
              }}
            >
              协同账单
            </Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          scrollY
          style={{
            flex: 1,
            backgroundColor: COLORS.gray50,
          }}
        >
          <View style={{ padding: '16px', paddingBottom: '96px' }}>
            {activeTab === 'shared' && (
              <View style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {shareableLedgers.map(ledger => (
                  <ShareCardModal
                    key={ledger.id}
                    ledger={ledger}
                    onClick={(type: ClickType) => {
                      handleShareClick(type, ledger);
                    }}
                  />
                ))}
              </View>
            )}

            {activeTab === 'joined' && (
              <View style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {joinedLedgers.length === 0 ? (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingTop: '80px',
                    }}
                  >
                    <Icon name='User' size={48} style={{ marginBottom: '16px', opacity: 0.3 }} color={COLORS.gray400} />
                    <Text style={{ fontSize: '14px', color: COLORS.gray400 }}>您还没有加入任何账本</Text>
                  </View>
                ) : (
                  joinedLedgers.map(ledger => (
                    <View
                      key={ledger.id}
                      style={{
                        backgroundColor: COLORS.white,
                        borderRadius: '16px',
                        padding: '20px',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: COLORS.gray100,
                      }}
                    >
                      <View
                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '16px' }}
                      >
                        {/* Avatar Placeholder */}
                        <View
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: COLORS.indigo100,
                            borderRadius: '999px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                          }}
                        >
                          {/* 如果有真实头像这里换 Image */}
                          <Text style={{ color: COLORS.indigo600, fontWeight: 'bold' }}>
                            {ledger?.ownerAvatar || 'Z'}
                          </Text>
                        </View>

                        <View>
                          <Text
                            style={{ fontSize: '12px', color: COLORS.gray500, marginBottom: '2px', display: 'block' }}
                          >
                            拥有者
                          </Text>
                          <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>
                            {/* ledger.ownerNickname */}
                            {ledger.ownerNickname || '用户'}
                          </Text>
                        </View>

                        <View style={{ flex: 1, textAlign: 'right' }}>
                          <View
                            style={{
                              display: 'inline-block',
                              backgroundColor: COLORS.indigo50,
                              padding: '4px 8px',
                              borderRadius: '6px',
                            }}
                          >
                            <Text style={{ fontSize: '12px', color: COLORS.indigo600, fontWeight: 500 }}>已加入</Text>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          borderTopWidth: '1px',
                          borderTopStyle: 'solid',
                          borderTopColor: COLORS.gray100,
                          paddingTop: '12px',
                        }}
                      >
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <View
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '999px',
                              backgroundColor: COLORS.gray100,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '12px',
                            }}
                          >
                            <Icon name={ledger.type === 1 ? 'Users' : 'Book'} size={16} color={COLORS.gray600} />
                          </View>
                          <Text style={{ fontWeight: 'bold', color: COLORS.gray800 }}>{ledger.name}</Text>
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Modals */}
        {clickType === 'Share' && (
          <ShareTimePage
            date={shareDate}
            onClick={(d: Date) => handleShareClick('Member', undefined, d)}
            onClose={resetClickType}
          />
        )}

        {clickType === 'Member' && (
          <MemberPage onClick={() => handleShareClick('Complete')} onClose={() => handleShareClick('Share')} />
        )}

        {clickType === 'CancelShare' && (
          <Dialog
            title='取消分享'
            content='确定要取消分享吗？'
            onClickName='确认'
            onCloseName='取消'
            onClose={resetClickType}
            onClick={confirmCancelShare}
            onClickTextStyle={{ color: COLORS.white }}
            onClickStyle={{ backgroundColor: COLORS.primary }}
          />
        )}
      </View>
    </RootPortal>
  );
};
