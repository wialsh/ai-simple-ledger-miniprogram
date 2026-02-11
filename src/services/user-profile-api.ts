import Taro from '@tarojs/taro';
import type { UserProfile, Response } from '@/types';
import { storageService } from './local/storage';
import { CLOUD_ENV, X_WX_SERVICE } from './request/config';

// --- 初始化云开发 (小程序端必须) ---
if (process.env.TARO_ENV === 'weapp' && Taro.cloud) {
  Taro.cloud.init({ env: CLOUD_ENV });
}

// ==============================
// 用户 (User) - 查改
// ==============================
export const userProfileService = {
  get: async () => {
    // 此时不需要调用 Taro.login() 获取 code！
    try {
      const config = {
        env: CLOUD_ENV,
      };
      const path = '/login';
      const header = {
        'X-WX-SERVICE': X_WX_SERVICE,
        'content-type': 'application/json',
      };
      const data = {}; // 可以传空的，也可以传前端采集的头像昵称

      // 如果是本地开发环境，手动塞一个 OpenID 模拟登录态
      if (process.env.NODE_ENV === 'development') {
        header['x-wx-openid'] = 'my-local-debug-openid-123';
      }

      // console.log('调用云托管接口的 header:', header);

      const result = await Taro.cloud.callContainer<Response<UserProfile>>({
        config: config,
        path: path,
        method: 'POST',
        header: header,
        data: data,
      });

      console.log('调用云托管接口的 result', result);

      if (result.statusCode === 200 && result.data.data.token) {
        console.log('登录成功，用户信息：', result.data.data);
        // 将后端返回的 UserProfile 存入本地缓存
        Taro.setStorageSync('user_info', result.data.data);
        // Taro.showToast({ title: '登录成功' });
        return result.data.data;
      }
    } catch (err) {
      // Taro.showToast({ title: '登录失败', icon: 'error' });
      console.error('登录失败', err);
      return null;
    }
  },

  getFromCache: (): UserProfile | null => {
    return storageService.get<UserProfile>('user_info');
  },
};
