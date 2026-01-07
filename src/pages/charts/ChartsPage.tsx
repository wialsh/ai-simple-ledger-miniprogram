import React from 'react';
import { View, Text } from '@tarojs/components';
import { useAppContext } from '@/context/AppContext';
import { formatNumber } from '@/utils/formatUtil';
import TopBar from '@/components/bar/TopBar';
import { Icon } from '@/components/ui/Icon';
// 1. 引入新封装的图表组件
// import { TrendChart } from '@/components/charts/TrendChart';

// 定义颜色常量 (保持之前的配置)
const COLORS = {
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray400: '#9ca3af',
  gray700: '#374151',
  gray800: '#1f2937',
  primary: '#76BDB9',
};

export const ChartsPage: React.FC = () => {
  const { trendData, categoriesData, monthlySpent } = useAppContext();

  return (
    <View
      style={{
        paddingBottom: '96px',
        minHeight: '100vh',
        backgroundColor: COLORS.white,
      }}
    >
      <TopBar />

      <View style={{ padding: '16px' }}>
        {/* --- 趋势分析 --- */}
        {/* <View style={{ marginBottom: '32px', marginTop: '8px' }}>
          <View
            style={{
              marginBottom: '16px',
              paddingLeft: '12px',
              borderLeftWidth: '4px',
              borderLeftStyle: 'solid',
              borderLeftColor: COLORS.primary,
            }}
          >
            <Text
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: COLORS.gray700,
              }}
            >
              趋势分析
            </Text>
          </View>

          <View
            style={{
              height: '220px', // 稍微给高一点，让 tooltip 更好显示
              width: '100%',
              backgroundColor: COLORS.gray50, // 图表背景色
              borderRadius: '12px',
              padding: '8px 0', // 上下留点白，左右由 ECharts Grid 控制
              overflow: 'hidden', // 防止溢出
            }}
          >
            <TrendChart data={trendData} />
          </View>
        </View> */}

        {/* --- 分类列表 (保持不变) --- */}
        <View>
          <View
            style={{
              marginBottom: '16px',
              paddingLeft: '12px',
              borderLeftWidth: '4px',
              borderLeftStyle: 'solid',
              borderLeftColor: COLORS.primary,
            }}
          >
            <Text
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: COLORS.gray700,
              }}
            >
              分类
            </Text>
          </View>

          {categoriesData.length === 0 ? (
            <View
              style={{
                textAlign: 'center',
                paddingTop: '32px',
                paddingBottom: '32px',
              }}
            >
              <Text style={{ fontSize: '14px', color: COLORS.gray400 }}>本月无支出</Text>
            </View>
          ) : (
            categoriesData.map((category, idx) => {
              const percentage = monthlySpent > 0 ? (category.amount / monthlySpent) * 100 : 0;

              return (
                <View
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <View
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: COLORS.gray100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                    }}
                  >
                    <Icon name={category.name || 'HelpCircle'} size={20} color={category.color || '#9ca3af'} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: COLORS.gray800,
                        }}
                      >
                        {category.displayName}
                      </Text>
                      <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>{formatNumber(category.amount)}</Text>
                    </View>

                    <View
                      style={{
                        width: '100%',
                        backgroundColor: COLORS.gray100,
                        borderRadius: '999px',
                        height: '6px',
                        overflow: 'hidden',
                      }}
                    >
                      <View
                        style={{
                          height: '100%',
                          width: `${percentage}%`,
                          backgroundColor: category.color || COLORS.primary,
                          borderRadius: '999px',
                        }}
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      marginLeft: '12px',
                      width: '40px',
                      textAlign: 'right',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: '12px',
                        color: COLORS.gray400,
                        fontWeight: 500,
                      }}
                    >
                      {percentage.toFixed(0)}%
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>
    </View>
  );
};
