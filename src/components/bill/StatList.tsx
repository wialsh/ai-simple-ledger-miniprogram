import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { COLORS } from '@/styles/colors';
import { NumberFormat } from '@/components/ui/format';
import type { BudgetData } from '@/types';

interface BillListProps {
  data: BudgetData[];
}

export const BillList: React.FC<BillListProps> = ({ data }) => {
  // 表头配置
  const headers = ['月份', '预算', '支出', '结余'];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white, marginTop: '16px' }}>
      {/* 表头 */}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: '12px 16px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: COLORS.gray100,
        }}
      >
        {headers.map((header, index) => (
          <Text
            key={index}
            style={{
              flex: 1,
              textAlign: 'left',
              fontSize: '12px',
              color: COLORS.gray400,
            }}
          >
            {header}
          </Text>
        ))}
      </View>

      {/* 列表内容 */}
      <ScrollView scrollY style={{ height: '100%' }}>
        <View style={{ paddingBottom: '100px' }}>
          {data.map(item => (
            <View
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: 'row',
                padding: '16px',
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: COLORS.gray50,
                alignItems: 'center',
              }}
            >
              {/* 月份 */}
              <Text style={{ flex: 1, fontSize: '14px', color: COLORS.gray700 }}>{item.displayName}</Text>

              {/* 月预算 */}
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <NumberFormat
                  value={item.income}
                  mainStyle={{ fontSize: '14px', color: COLORS.gray700 }}
                  decimalStyle={{ fontSize: '12px', color: COLORS.gray700 }}
                />
              </View>

              {/* 月支出 */}
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <NumberFormat
                  value={item.expense}
                  mainStyle={{ fontSize: '14px', color: COLORS.gray700 }}
                  decimalStyle={{ fontSize: '12px', color: COLORS.gray700 }}
                />
              </View>

              {/* 月结余 */}
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <NumberFormat
                  value={item.balance}
                  mainStyle={{ fontSize: '14px', color: COLORS.gray700 }}
                  decimalStyle={{ fontSize: '12px', color: COLORS.gray700 }}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
