import Taro from '@tarojs/taro';
import { BASE_URL, CLOUD_ENV, X_WX_SERVICE } from './request/config';

// --- 初始化云开发 (小程序端必须) ---
if (process.env.TARO_ENV === 'weapp' && Taro.cloud) {
  Taro.cloud.init({ env: CLOUD_ENV });
}

export const cloudLogin = async () => {
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

    const result = await Taro.cloud.callContainer({
      config: config,
      path: path,
      method: 'POST',
      header: header,
      data: data,
    });

    console.log('调用云托管接口的 result', result);

    if (result.statusCode === 200) {
      console.log('登录成功，用户信息：', result.data.data);
      // 将后端返回的 UserProfile 存入本地缓存
      // Taro.setStorageSync('currentUser', res.data.data);
      return result.data.data;
    }
  } catch (err) {
    console.error('云托管调用异常', err);
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
      const serverRes = await Taro.request({
        url: `${BASE_URL}/login`,
        method: 'POST',
        data: {
          code: loginRes.code,
        },
      });

      // 3. 处理后端返回的 Token
      if (serverRes.statusCode === 200 && serverRes.data.token) {
        // 存储 Token 到本地缓存
        // Taro.setStorageSync('token', serverRes.data.token);

        Taro.showToast({ title: '登录成功', icon: 'success' });
        console.log('登录成功，serverRes:', serverRes);
        console.log('登录成功，Token:', serverRes.data.token);
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
