import Taro from '@tarojs/taro';

export const storageService = {
  set: (key: string, value: any) => {
    try {
      Taro.setStorageSync(key, value);
    } catch (err) {
      console.error(`设置缓存失败: ${key}`, err);
    }
  },
  get: <T>(key: string): T | null => {
    try {
      const value = Taro.getStorageSync<T>(key);
      return value !== undefined ? value : null;
    } catch (err) {
      console.error(`获取缓存失败: ${key}`, err);
      return null;
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
