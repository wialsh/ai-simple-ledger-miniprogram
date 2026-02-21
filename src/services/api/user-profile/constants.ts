import type { UserProfile } from '@/types';

export const userProfileConstants = {
  // 💡 获取默认账本信息（每次调用生成新的 ID）
  getDefault: (): UserProfile => {
    const userInfo: UserProfile = {
      id: 0,
      account: '',
      nickname: '',
      phone: '',
      email: '',
      gender: 0, //性别（1-男、2-女、0-未知（默认））
      avatar: '',
      isVip: 0,
      isLogin: 0,
      token: '',
    };
    return userInfo;
  },
};
