import Taro from '@tarojs/taro';
import { BASE_URL, TIMEOUT, X_WX_SERVICE, CLOUD_ENV } from './request/config';

// --- 初始化云开发 (小程序端必须) ---
if (process.env.TARO_ENV === 'weapp' && Taro.cloud) {
  Taro.cloud.init({ env: CLOUD_ENV });
}

export const cloudLogin = async () => {
  // 此时不需要调用 Taro.login() 获取 code！
  try {
    const config = {
      env: CLOUD_ENV, //环境ID
    };
    const path = '/login'; // 后端 LoginController 路径
    const header = {
      'X-WX-SERVICE': X_WX_SERVICE,
      'content-type': 'application/json',
    };
    const data = {}; // 可以传空的，也可以传前端采集的头像昵称

    // 如果是本地开发环境，手动塞一个 OpenID 模拟登录态
    if (process.env.NODE_ENV === 'development') {
      header['x-wx-openid'] = 'my-local-debug-openid-123';
    }

    const res = await Taro.cloud.callContainer({
      config: config,
      path: path,
      method: 'POST',
      header: header,
      data: data,
    });

    if (res.statusCode === 200) {
      console.log('登录成功，用户信息：', res.data.data);
      // 将后端返回的 UserProfile 存入本地缓存
      // Taro.setStorageSync('currentUser', res.data.data);
      return res.data.data;
    }
  } catch (err) {
    console.error('云托管调用异常', err);
  }
};

export default cloudLogin;
