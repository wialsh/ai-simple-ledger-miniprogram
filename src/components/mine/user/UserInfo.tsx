import React, { useState } from 'react';
import { View, Button, Image, Input, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';

export const UserInfo = () => {
  const [avatar, setAvatar] = useState('');
  const [nickname, setNickname] = useState('');

  // 1. 获取头像 (用户点击按钮选择)
  const onChooseAvatar = e => {
    const { avatarUrl } = e.detail;
    // 这里得到的是临时路径，通常需要上传到服务器
    setAvatar(avatarUrl);
    console.log('用户选择的头像:', avatarUrl);
  };

  // 2. 获取昵称 (用户输入时键盘上方会有昵称提示)
  const onNicknameBlur = e => {
    const val = e.detail.value;
    setNickname(val);
    console.log('用户输入的昵称:', val);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>请完善个人信息</Text>

      {/* 头像选择按钮 */}
      <Button
        openType='chooseAvatar'
        onChooseAvatar={onChooseAvatar}
        style={{ width: 80, height: 80, padding: 0, borderRadius: 40, marginTop: 20 }}
      >
        <Image src={avatar || '默认头像URL'} style={{ width: '100%', height: '100%' }} />
      </Button>

      {/* 昵称输入框 */}
      <View style={{ marginTop: 20, borderBottom: '1px solid #eee', padding: 10 }}>
        <Input type='nickname' placeholder='请输入昵称' onBlur={onNicknameBlur} />
      </View>

      <Button type='primary' style={{ marginTop: 40 }}>
        保存信息
      </Button>
    </View>
  );
};
