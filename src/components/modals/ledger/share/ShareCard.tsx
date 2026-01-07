import React from 'react';
import { View, Text } from '@tarojs/components'; // 1. 引入 Taro 组件
import { Icon } from '@/components/ui/Icon';
import * as dateUtils from '@/utils/dateUtils';
import { Ledger, ClickType } from '@/types';

interface ShareCardModalProps {
  ledger: Ledger;
  onClick: (clickType: ClickType) => void;
}

// 定义颜色常量
const COLORS = {
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6', // border-gray-100 / bg-gray-100
  gray200: '#e5e7eb',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray800: '#1f2937',
  gray900: '#111827',
  primaryDark: '#49807D',
  primaryOp20: 'rgba(118, 189, 185, 0.2)', // bg-primary/20 (Assuming primary is #76BDB9)
  red50: '#fef2f2',
  red500: '#ef4444',
  indigo50: '#eef2ff',
  indigo600: '#4f46e5',
};

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
