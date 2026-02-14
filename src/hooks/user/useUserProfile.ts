import { useState, useEffect, useCallback } from 'react';
import { userProfileService, storageService, setAuthToken } from '@/services';
import { UserProfile } from '@/types';
// import * as dateUtils from '@/utils/dateUtils';

export const useUserProfile = (currentDateStr: string) => {
  const [userId, setUserId] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 0,
    account: '',
    nickname: '',
    phone: '',
    email: '',
    gender: 0,
    avatar: '',
    isVip: 0,
    token: '',
  });

  // console.log('useUserProfile: currentDateStr=', currentDateStr);
  useEffect(() => {
    // console.log('useUserProfile: useEffect 执行', currentDateStr);
    const fetchUserProfile = async () => {
      if (!currentDateStr) {
        console.warn('[Hook] currentDateStr 为空，跳过用户信息获取');
        return;
      }
      const today = currentDateStr; // 使用传入的日期字符串，避免重复计算
      const lastCheckDate = storageService.get('last_check_date');
      const cachedUserInfo = storageService.get<UserProfile>('user_info');
      // const cachedToken = storageService.get<string>('token');
      console.log('[Hook] 检查更新: 缓存日期=', lastCheckDate, ' 今日=', today);
      // --- 命中缓存的条件：日期一致 且 缓存中有用户信息 ---
      if (lastCheckDate === today && cachedUserInfo?.id) {
        console.log('[Hook] 命中日内缓存，直接使用', cachedUserInfo);
        setAuthToken(cachedUserInfo.token); // 同步内存 Token
        setUserProfile(cachedUserInfo);
        return;
      }
      // --- 否则：执行登录或更新 ---
      try {
        console.log('[Hook] 缓存失效或跨天，执行云登录...');
        const newUserInfo = await userProfileService.get();
        if (newUserInfo?.id) {
          storageService.set('user_info', newUserInfo);
          storageService.set('last_check_date', today);
          storageService.set('token', newUserInfo.token);
          setAuthToken(newUserInfo.token);
          setUserProfile(newUserInfo);
          console.log('[Hook] 用户信息已同步');
        }
      } catch (err) {
        console.error('[Hook] 获取用户信息失败', err);
        // 如果报错了，尝试降级使用旧缓存（防止断网导致无法进入小程序）
        if (cachedUserInfo) setUserProfile(cachedUserInfo);
      }
    };

    fetchUserProfile();
  }, [currentDateStr]);

  useEffect(() => {
    if (userProfile?.id) {
      setUserId(userProfile.id);
    }
  }, [userProfile?.id]);

  return { userId, userProfile, setUserProfile };
};
