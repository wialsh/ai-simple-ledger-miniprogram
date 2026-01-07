import React, { useEffect, useRef } from 'react';
import { View, Canvas } from '@tarojs/components';
import Taro, { useReady } from '@tarojs/taro';

interface Props {
  echarts: any; // 传入 echarts 核心库
  option: any; // 图表配置
  style?: React.CSSProperties; // 样式
  canvasId: string; // 唯一 ID
}

export const EChart: React.FC<Props> = ({ echarts, option, style, canvasId }) => {
  const chartRef = useRef<any>(null);

  // 初始化图表
  const initChart = () => {
    if (!option) return;

    const query = Taro.createSelectorQuery();
    query
      .select(`#${canvasId}`)
      .fields({ node: true, size: true })
      .exec(res => {
        // 核心：获取 Canvas 节点
        const canvas = res[0]?.node;
        const width = res[0]?.width;
        const height = res[0]?.height;

        if (canvas) {
          // 1. 初始化 Canvas 上下文
          const ctx = canvas.getContext('2d');
          const dpr = Taro.getSystemInfoSync().pixelRatio;

          // 2. 解决模糊问题：根据 dpr 缩放
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          ctx.scale(dpr, dpr);

          // 3. 将 canvas 实例传给 echarts (Canvas 2D 模式必须)
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr,
          });

          // 4. 设置配置
          chart.setOption(option);
          chartRef.current = chart;
        }
      });
  };

  // 页面准备好后初始化
  useReady(() => {
    // 延时一小会儿确保节点挂载
    setTimeout(() => {
      initChart();
    }, 200);
  });

  // 监听 option 变化，更新图表
  useEffect(() => {
    if (chartRef.current && option) {
      chartRef.current.setOption(option);
    }
  }, [option]);

  return (
    <View style={{ width: '100%', height: '100%', ...style }}>
      {/*
        type="2d" 是关键！
        必须显式写死 style 的宽高，否则 canvas 默认为 300x150
      */}
      <Canvas type='2d' id={canvasId} style={{ width: '100%', height: '100%' }} />
    </View>
  );
};
