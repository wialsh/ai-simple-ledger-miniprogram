import React from 'react';
import { View, Text } from '@tarojs/components';
import { Icon } from '@/components/ui';
import * as formatUtil from '@/utils/formatUtil';
import { Transaction } from '@/types';
import { COLORS } from '@/styles/colors';

interface TransCardModalProps {
  transaction: Transaction;
  isLastItem: boolean;
}

export const TransCardModal: React.FC<TransCardModalProps> = ({ transaction, isLastItem }) => {
  const isPositive = transaction.amount > 0;

  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px', // py-3 px-4
        borderBottomWidth: isLastItem ? 0 : '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#f3f4f6', // border-gray-100
      }}
    >
      {/* Icon Circle */}
      <View
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#f3f4f6', // bg-gray-100
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
        }}
      >
        <Icon name={transaction.componentName} size={20} color={transaction.componentColor} />
      </View>

      {/* Content Text */}
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#1f2937' }}>{transaction.categoryName}</Text>
        {transaction.remark && (
          // 注意：这里需要 Text 包裹或者用 block 元素
          <View
            style={{
              fontSize: '12px',
              color: '#9ca3af',
              marginTop: '2px',
            }}
          >
            <Text>{transaction.remark}</Text>
          </View>
        )}
      </View>

      {/* Amount */}
      <View
        style={{
          color: !isPositive ? '#ef4444' : '#1f2937',
        }}
      >
        <Text>
          {isPositive ? '' : '-'}
          {formatUtil.formatNumber(transaction.amount)}
        </Text>
      </View>
    </View>
  );
};
