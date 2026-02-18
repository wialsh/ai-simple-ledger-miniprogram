import Taro from '@tarojs/taro';
import { parseDates } from '../common';

export const storageService = {
  set: (key: string, value: any) => {
    try {
      Taro.setStorageSync(key, value);
    } catch (err) {
      console.error(`设置缓存失败: ${key}`, err);
    }
  },

  /**
   * 💡 增强版 get：支持传入转换函数
   * @param key 键名
   * @param transform 可选的转换逻辑，用于恢复 Date 格式
   */
  get: <T>(key: string): T | undefined => {
    try {
      const value = Taro.getStorageSync<T>(key);
      if (value === undefined || value === null || value === '') {
        return;
      }
      return parseDates(value) as T; // 直接调用 parseDates 处理日期转换
    } catch (err) {
      console.error(`获取缓存失败: ${key}`, err);
      return;
    }
  },
  remove: (key: string) => {
    try {
      Taro.removeStorageSync(key);
    } catch (err) {
      console.error(`移除缓存失败: ${key}`, err);
    }
  },
  clear: () => {
    try {
      Taro.clearStorageSync();
    } catch (err) {
      console.error('清除缓存失败', err);
    }
  },
};
