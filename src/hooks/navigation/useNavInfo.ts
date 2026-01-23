import Taro from '@tarojs/taro';
import { useMemo } from 'react';

export const useNavInfo = () => {
  return useMemo(() => {
    // 1. 获取系统信息 (状态栏高度)
    const systemInfo = Taro.getWindowInfo();

    // 2. 获取胶囊按钮位置信息 (右上角那个原生胶囊)
    const menuButtonInfo = Taro.getMenuButtonBoundingClientRect();

    // 3. 计算导航栏内容高度 (不含状态栏)
    // 胶囊高度 + (胶囊距顶 - 状态栏底) * 2
    // 这种计算方式能保证你的自定义内容和胶囊按钮垂直居中对齐
    const navContentHeight = (menuButtonInfo.top - systemInfo.statusBarHeight!) * 2 + menuButtonInfo.height;

    // 4. 计算总高度
    const navHeight = systemInfo.statusBarHeight! + navContentHeight;

    return {
      statusBarHeight: systemInfo.statusBarHeight, // 状态栏高度 (刘海/电量条)
      navContentHeight, // 导航栏内容高度
      navHeight, // 总高度
      menuButtonWidth: menuButtonInfo.width, // 胶囊宽度 (用于右侧留白)
      menuButtonHeight: menuButtonInfo.height, // 胶囊高度
      menuButtonRight: systemInfo.screenWidth - menuButtonInfo.right, // 胶囊右边距
    };
  }, []);
};
