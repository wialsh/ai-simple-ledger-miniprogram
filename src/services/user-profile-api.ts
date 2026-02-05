import { UserProfile } from '@/types';
import apiClient from './request';
import cloudLogin from './login-api';
import { deserializer, type Response } from './request/deserialize';

// ==============================
// 用户 (User) - 查改
// ==============================
export const userService = {
  // 获取用户信息
  getProfile: async (userId: number) => {
    const response = await apiClient.get<Response<UserProfile[]>>(`/users/${userId}/profile`);
    const result = deserializer(response);
    return result;
  },

  // 更新用户信息
  update: async (user: UserProfile) => {
    const result = await apiClient.put<UserProfile>(`/users/${user.id}`, user);
    return result;
  },
};
