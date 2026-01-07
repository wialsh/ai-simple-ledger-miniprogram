import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components'; // 引入 Text 用于无数据提示
// 引入 ECharts 核心模块
import * as echarts from 'echarts/core';
// 引入图表类型 (折线图)
import { LineChart } from 'echarts/charts';
// 引入组件 (标题、提示框、网格、数据集等)
import { GridComponent, TooltipComponent, DatasetComponent } from 'echarts/components';
// 引入渲染器 (小程序必须使用 Canvas)
import { CanvasRenderer } from 'echarts/renderers';
// 引入 Taro 适配组件
// import { EChart } from 'echarts-taro3-react';
import { TrendData } from '@/types';
import { EChart } from './EChart';

// 注册必须的组件
echarts.use([LineChart, GridComponent, TooltipComponent, DatasetComponent, CanvasRenderer]);

interface TrendChartProps {
  data: TrendData[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const [option, setOption] = useState<any>(null); // 默认为 null

  useEffect(() => {
    // 0. 数据安全检查
    if (!data || data.length === 0) {
      // 如果没有数据，设置一个空配置或保持 null
      setOption(null);
      return;
    }

    // 1. 拆分数据
    const xData = data.map(item => item.day);
    const yData = data.map(item => item.amount);

    // console.log('chartOption data', data);
    // console.log('chartOption xData', xData);
    // console.log('chartOption yData', yData);

    // 2. 配置 Option
    const chartOption = {
      // 这里的配置与你之前的一致
      color: ['#5CA09D'],
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}元',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: [10, 15],
        textStyle: {
          color: '#5CA09D',
          fontSize: 12,
          fontWeight: 'bold',
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-radius: 8px;',
        confine: true, // 关键：限制在图表区域内
      },
      grid: {
        top: '15%', // 稍微增加顶部距离，防止 Tooltip 被切
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#9ca3af',
          fontSize: 10,
          interval: 4, // 既然你手动生成了每天的数据，这里设置间隔防止重叠
        },
      },
      yAxis: {
        type: 'value',
        // 建议加上 minInterval，防止数据全是 0 时Y轴刻度显示 0.2, 0.4 等小数
        // minInterval: 1,
        splitLine: {
          lineStyle: {
            color: '#374151',
            type: 'dashed',
          },
        },
        axisLabel: {
          color: '#9ca3af',
          fontSize: 10,
        },
      },
      series: [
        {
          name: '支出',
          data: yData,
          type: 'line',
          smooth: true,
          showSymbol: false,
          symbolSize: 6,
          lineStyle: {
            width: 2,
            color: '#5CA09D',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(118, 189, 185, 0.8)' },
              { offset: 1, color: 'rgba(118, 189, 185, 0)' },
            ]),
          },
        },
      ],
    };

    setOption(chartOption);
  }, [data]);

  // 如果没有数据，展示占位提示，避免图表报错或空白
  if (!option) {
    return (
      <View style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: '12px', color: '#ccc' }}>暂无趋势数据</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <EChart
        canvasId='trend-chart-canvas'
        echarts={echarts}
        option={option}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
};
