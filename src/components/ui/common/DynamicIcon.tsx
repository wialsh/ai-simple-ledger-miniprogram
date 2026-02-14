import React, { useMemo, useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Ask } from '@nutui/icons-react-taro';
import { base64Icons } from '@/assets/icons-base64';
import { storageService, iconService } from '@/services';

// 1. 基础映射表（包含 NutUI 组件和本地预置 SVG）
const localIconMap: Record<string, React.FC<any> | string> = {
  ...base64Icons,
  HelpCircle: Ask,
};

// 2. 辅助函数：处理颜色并转为 Data URI
const svgToDataUrl = (svgString: string, color: string) => {
  if (!svgString || typeof svgString !== 'string') return '';
  let coloredSvg = svgString
    .replace(/stroke="currentColor"/g, `stroke="${color}"`)
    .replace(/fill="currentColor"/g, `fill="${color}"`);
  const encodedSvg = encodeURIComponent(coloredSvg).replace(/'/g, '%27').replace(/"/g, '%22');
  return `url("data:image/svg+xml;charset=utf-8,${encodedSvg}")`;
};

interface IconProps {
  name: string;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  onClick?: () => void;
}

export const DynamicIcon: React.FC<IconProps> = ({ name, size = 20, className, style, color = '#6b7280', onClick }) => {
  // 转换名称格式
  const iconName = useMemo(() => {
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
  }, [name]);

  // 状态：当前渲染的图标内容（字符串或组件）
  const [target, setTarget] = useState<React.FC<any> | string>(() => localIconMap[iconName]);

  // 处理尺寸
  const sizeStr = typeof size === 'number' ? `${size}px` : size;

  // ✨ 核心逻辑：监听名称变化，执行查找/请求
  useEffect(() => {
    const local = localIconMap[iconName];
    if (local) {
      setTarget(local);
      return;
    }

    // 如果本地没有，先看缓存
    const cacheKey = `icon_${iconName}`;
    const cachedSvg = storageService.get<string>(cacheKey);
    if (cachedSvg) {
      setTarget(cachedSvg);
      return;
    }

    // 缓存也没有，向服务器请求
    const fetchRemoteIcon = async () => {
      try {
        const svgContent = await iconService.get(iconName);
        if (svgContent) {
          storageService.set(cacheKey, svgContent); // 存入缓存
          setTarget(svgContent);
        } else {
          setTarget('BadgeQuestionMark'); // 失败兜底
        }
      } catch (e) {
        setTarget('BadgeQuestionMark');
      }
    };
    fetchRemoteIcon();
  }, [iconName]);

  // 计算背景图
  const bgImage = useMemo(() => {
    if (typeof target === 'string' && target.includes('<svg')) {
      return svgToDataUrl(target, color);
    }
    // 如果是预置的字符串 key 且在 base64Icons 里
    if (typeof target === 'string' && base64Icons[target]) {
      return svgToDataUrl(base64Icons[target], color);
    }
    return '';
  }, [target, color]);

  // --- 分流渲染 ---

  // 分支 A: 字符串 (SVG 内容)
  if (typeof target === 'string' && (target.includes('<svg') || base64Icons[target])) {
    return (
      <View
        className={className}
        style={{
          display: 'inline-block',
          width: sizeStr,
          height: sizeStr,
          backgroundImage: bgImage,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          flexShrink: 0,
          ...style,
        }}
        onClick={onClick}
      />
    );
  }

  // 分支 B: React 组件 (NutUI 或其他)
  const TargetComponent = (target as React.FC<any>) || Ask;
  return (
    <View
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: sizeStr,
        height: sizeStr,
        flexShrink: 0,
        ...style,
      }}
      onClick={onClick}
    >
      <TargetComponent width={size} height={size} color={color} />
    </View>
  );
};
