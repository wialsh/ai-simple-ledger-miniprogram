import React from 'react';
import { View, Text } from '@tarojs/components'; // 1. 引入 Taro 组件
import { Icon } from '@/components/ui';
import * as dateUtils from '@/utils/dateUtils';
import { Ledger, ClickType } from '@/types';
import { COLORS } from '@/styles/colors';

interface ShareCardModalProps {
  ledger: Ledger;
  onClick: (clickType: ClickType) => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ ledger, onClick }) => {
  const memberCount = 0;

  return (
    <View
      // key={ledger.id} // key 应该在父组件 map 循环中添加，这里不需要

      // 模拟 active:scale-[0.99]
      hoverStyle={{ transform: 'scale(0.99)' }}
      hoverStayTime={100}
      // bg-white space-y-4 rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden cursor-pointer transition
      style={{
        backgroundColor: COLORS.white,
        borderRadius: '16px', // rounded-2xl
        padding: '20px', // p-5
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: COLORS.gray100,
        position: 'relative',
        overflow: 'hidden',
        // space-y-4 需要把子元素间距分开写，或者用 gap (小程序新版支持 gap)
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Top Row */}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Icon Circle */}
        {/* w-10 h-10 bg-primary/20 rounded-full ... shrink-0 mr-3 */}
        <View
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: COLORS.primaryOp20,
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginRight: '12px', // mr-3
          }}
        >
          {/* Icon 通常可以通过 color 属性设置颜色 */}
          <Icon name={ledger.id === 0 ? 'Home' : 'BookOpen'} size={20} color={COLORS.primaryDark} />
        </View>

        {/* Name */}
        {/* flex-1 min-w-0 font-bold text-gray-900 truncate mr-2 */}
        <View style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
          <Text
            style={{
              fontWeight: 'bold',
              color: COLORS.gray900,
              fontSize: '16px',
              // 实现 truncate
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {ledger.name}
          </Text>
        </View>

        {/* Action Button */}
        <View style={{ flexShrink: 0 }}>
          <View
            onClick={e => {
              e.stopPropagation(); // 阻止冒泡，防止触发卡片点击
              onClick(ledger.type === 1 ? 'CancelShare' : 'Share');
            }}
            style={{
              display: 'inline-block', // 实际上 View 默认 flex-col，这里主要为了 padding 生效
              padding: '4px 8px', // px-2 py-1
              borderRadius: '6px', // rounded-md
              backgroundColor: ledger.type === 1 ? COLORS.red50 : COLORS.indigo50,
            }}
          >
            <Text
              style={{
                fontSize: '12px', // text-xs
                fontWeight: 500, // font-medium
                color: ledger.type === 1 ? COLORS.red500 : COLORS.indigo600,
              }}
            >
              {ledger.type === 1 ? '取消分享' : '分享'}
            </Text>
          </View>
        </View>
      </View>

      {/* Info Row (Conditional) */}
      {ledger.type === 1 && (
        // flex items-center justify-around text-xs text-gray-500 bg-gray-50 rounded-lg p-2
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: COLORS.gray50,
            borderRadius: '8px',
            padding: '8px', // p-2
          }}
        >
          {/* Time Info */}
          <View
            onClick={e => {
              e.stopPropagation();
              onClick('ResetShareTime');
            }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <Text style={{ color: COLORS.gray800, fontSize: '14px' }}>
              {dateUtils.formatDate(ledger.shareStartTime!, 'YYYY MM')}
            </Text>
            <Text style={{ color: COLORS.gray400, fontSize: '10px' }}>共享开始的时间</Text>
          </View>

          {/* Divider */}
          {/* w-px h-6 bg-gray-200 */}
          <View
            style={{
              width: '1px',
              height: '24px',
              backgroundColor: COLORS.gray200,
            }}
          />

          {/* Member Info */}
          <View
            onClick={e => {
              e.stopPropagation();
              onClick('Member');
            }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <Text style={{ color: COLORS.gray800, fontSize: '14px' }}>{memberCount}</Text>
            <Text style={{ color: COLORS.gray400, fontSize: '10px' }}>成员</Text>
          </View>
        </View>
      )}
    </View>
  );
};
