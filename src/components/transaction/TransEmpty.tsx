import React from 'react';
import { View, Text } from '@tarojs/components';
import { Icon } from '@/components/ui';

export const TransEmptyModal: React.FC = () => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '80px',
      }}
    >
      <Icon name='FileText' size={48} style={{ marginBottom: '8px', opacity: 0.5 }} />
      <Text style={{ color: '#9ca3af' }}>本月暂无记录</Text>
    </View>
  );
};
