import React from 'react';
import Taro from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';

export const LoginPage = () => {
  // 处理微信登录逻辑
  const handleWechatLogin = async () => {
    try {
      // 1. 调用 Taro.login 获取 code
      const res = await Taro.login();

      if (res.code) {
        console.log('获取到的登录凭证 code:', res.code);

        // 2. 将 code 发送给你的后端服务器
        // 注意：这里必须是你自己的后端接口，不能直接在前端调用微信的 jscode2session 接口（那样会暴露 AppSecret，不安全）
        const loginResponse = await Taro.request({
          url: 'https://your-backend-api.com/api/login/wechat', // 替换你的后端地址
          method: 'POST',
          data: {
            code: res.code,
          },
        });

        if (loginResponse.data.success) {
          // 3. 登录成功，保存 Token
          const { token, userInfo } = loginResponse.data.data;
          Taro.setStorageSync('token', token);
          Taro.setStorageSync('userInfo', userInfo);

          Taro.showToast({ title: '登录成功', icon: 'success' });

          // 跳转回首页
          Taro.switchTab({ url: '/pages/index/index' });
        } else {
          Taro.showToast({ title: '登录失败', icon: 'none' });
        }
      } else {
        console.log('登录失败！' + res.errMsg);
      }
    } catch (error) {
      console.error('登录异常', error);
      Taro.showToast({ title: '网络异常', icon: 'none' });
    }
  };

  return (
    <View style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 100 }}>
      {/* 微信登录按钮 */}
      <View
        onClick={handleWechatLogin}
        style={{
          backgroundColor: '#07c160', // 微信绿
          padding: '12px 32px',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>微信一键登录</Text>
      </View>
    </View>
  );
};
