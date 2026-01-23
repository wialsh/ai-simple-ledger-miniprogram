import React, { useMemo } from 'react';
import { View } from '@tarojs/components';
// 引入 NutUI 图标
import { Ask } from '@nutui/icons-react-taro';
// 引入图标字典 (注意：这里假设里面存储的是原始 SVG 字符串，而不是 base64)
import { base64Icons } from '@/assets/icons-base64';

// 建立映射表
const iconMap: Record<string, React.FC<any> | string> = {
  ...base64Icons,
  HelpCircle: Ask, // 这是一个组件，不是字符串
};

// 辅助函数
const svgToDataUrl = (svgString: string, color: string) => {
  if (!svgString || typeof svgString !== 'string') return '';

  // 1. 替换颜色
  let coloredSvg = svgString
    .replace(/stroke="currentColor"/g, `stroke="${color}"`)
    .replace(/fill="currentColor"/g, `fill="${color}"`);

  // 2. 转义特殊字符
  const encodedSvg = encodeURIComponent(coloredSvg).replace(/'/g, '%27').replace(/"/g, '%22');

  return `url("data:image/svg+xml;charset=utf-8,${encodedSvg}")`;
};

interface IconProps {
  name: string;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  strokeWidth?: number;
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className, style, color = '#6b7280', onClick }) => {
  // 1. 查找图标
  let target = iconMap[name];

  // 2. 容错处理
  if (!target && name) {
    const pascalName = name.charAt(0).toUpperCase() + name.slice(1);
    target = iconMap[pascalName];
  }

  // 3. 兜底
  if (!target) {
    target = iconMap['BadgeQuestionMark'] || Ask;
  }

  // 处理尺寸
  const sizeStr = typeof size === 'number' ? `${size}px` : size;

  // ✨✨✨ 修复点 1：安全生成背景图 URL ✨✨✨
  // 必须判断 target 是否为字符串，否则 NutUI 组件传进去会报错
  const bgImage = useMemo(() => {
    if (typeof target === 'string') {
      return svgToDataUrl(target, color);
    }
    return ''; // 如果是组件，返回空字符串
  }, [target, color]);

  // ✨✨✨ 修复点 2：根据类型分流渲染 ✨✨✨

  // 分支 A: 如果是字符串 (SVG)，使用背景图方案
  if (typeof target === 'string') {
    return (
      <View
        className={className}
        style={{
          display: 'inline-block',
          width: sizeStr,
          height: sizeStr,
          backgroundImage: bgImage, // 使用生成的 Data URI
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          ...style,
        }}
        onClick={onClick}
      />
    );
  }

  // 分支 B: 如果是组件 (NutUI)，直接渲染组件
  const TargetIcon = target as React.FC<any>;
  return (
    <View
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      onClick={onClick}
    >
      <TargetIcon width={size} height={size} color={color} />
    </View>
  );
};
