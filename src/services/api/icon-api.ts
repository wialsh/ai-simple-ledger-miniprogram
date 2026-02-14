import apiClient from '@/services/request';
import { storageService } from '@/services';
import { Response } from '@/types';

export const iconService = {
  get: async (name: string): Promise<string> => {
    const cacheKey = `icon_${name}`;
    // 1. 先看缓存
    const cached = storageService.get<string>(cacheKey);
    if (cached) return cached;

    // 2. 缓存没有则查服务器
    try {
      const res = await apiClient.get<Response<String>>(`/icons/${name}`);
      if (res.data.code === 0) {
        const svg = res.data.data as string;
        // 存入本地缓存，下次直接用
        storageService.set(cacheKey, svg);
        return svg;
      }
    } catch (e) {
      console.error('获取图标失败', e);
    }
    return '';
  },
};
