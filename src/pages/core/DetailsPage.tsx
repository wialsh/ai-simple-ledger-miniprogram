import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { View, Text } from '@tarojs/components';
import { WindowsCustom } from '@/components';
import { TransCardModal, TransEmptyModal } from '@/components/transaction';
import * as dateUtils from '@/utils/dateUtils';
import * as formatUtil from '@/utils/formatUtil';
import { COLORS } from '@/styles/colors';

export const DetailsPage: React.FC = () => {
  const { dailyTotalTransactions } = useAppContext();

  return (
    // 最外层容器：全屏高度，flex-col
    <WindowsCustom showNavBar>
      {dailyTotalTransactions.length === 0 ? (
        <TransEmptyModal />
      ) : (
        dailyTotalTransactions.map((dailyTransGroup, idx) => (
          <View key={idx} style={{ backgroundColor: COLORS.white, marginBottom: '8px' }}>
            {/* Date Header */}
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 16px',
                borderBottom: `1px solid ${COLORS.gray50}`,
                backgroundColor: COLORS.grayOp50,
              }}
            >
              <Text style={{ color: COLORS.gray400, fontSize: '12px' }}>
                {dateUtils.formatDate(dailyTransGroup.date, 'MMM dd, EEEE')}
              </Text>
              <Text style={{ color: COLORS.gray400, fontSize: '12px' }}>
                {dailyTransGroup.amount > 0 && `支出: ${formatUtil.formatNumber(dailyTransGroup.amount)}`}
              </Text>
            </View>

            {/* Transactions Items */}
            {dailyTransGroup.items.map((dailyTrans, itemIdx) => {
              const isLastItem = itemIdx === dailyTransGroup.items.length - 1;
              return <TransCardModal key={dailyTrans.transId} transaction={dailyTrans} isLastItem={isLastItem} />;
            })}
          </View>
        ))
      )}
    </WindowsCustom>
  );
};
