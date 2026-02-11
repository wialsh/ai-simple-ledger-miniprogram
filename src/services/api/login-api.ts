import Taro from '@tarojs/taro';
import type { UserProfile, Response } from '@/types';
import { TARO_ENV, NODE_ENV, BASE_URL, CLOUD_ENV, X_WX_SERVICE } from '../request/config';

// --- 初始化云开发 (小程序端必须) ---
if (TARO_ENV === 'weapp' && Taro.cloud) {
  Taro.cloud.init({ env: CLOUD_ENV });
}

const getUserProfilefromBackend = async () => {
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
    if (NODE_ENV === 'development') {
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
};

export const wxLogin = async () => {
  try {
    // 1. 调用 Taro.login 获取 code
    // Taro 会自动识别当前环境，在微信小程序中这就是 wx.login
    const loginRes = await Taro.login();

    if (loginRes.code) {
      console.log('获取到的 code:', loginRes.code);

      // 2. 使用 Taro.request 发送 code 给后端
      const result = await Taro.request({
        url: `${BASE_URL}/login`,
        method: 'POST',
        data: {
          code: loginRes.code,
        },
      });

      // 3. 处理后端返回的 Token
      if (result.statusCode === 200 && result.data.token) {
        const userInfofile = result.data.data;
        // 存储 Token 到本地缓存
        // Taro.setStorageSync('currentUser', userInfo);

        Taro.showToast({ title: '登录成功', icon: 'success' });
        console.log('登录成功，result:', result);
        console.log('登录成功，Token:', result.data.token);
      } else {
        Taro.showToast({ title: '服务器登录失败', icon: 'none' });
      }
    } else {
      console.log('登录失败！' + loginRes.errMsg);
    }
  } catch (err) {
    console.error('请求异常', err);
    Taro.showToast({ title: '网络异常', icon: 'none' });
  }
};
