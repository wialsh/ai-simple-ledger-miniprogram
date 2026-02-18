import type { UserProfile } from '@/types';
import { storageService } from '@/services/storage';
import * as dateUtils from '@/utils/dateUtils';
import { userProfileService } from './user-profile-api';
import { userProfileConstants } from './constants';

const cachedKey = 'user_info';
const lastCheckDateKey = 'last_check_date';
const tokenKey = 'token';
const isLoginKey = 'is_login';

const getFromLocal = () => {
  const userProfile = storageService.get<UserProfile>(cachedKey);
  return { userProfile };
};

const getFromDefault = () => {
  const userProfile = userProfileConstants.getDefault();
  return { userProfile };
};

const getFromServer = async () => {
  const userProfile = await userProfileService.get();
  if (userProfile && userProfile?.id) {
    const todayStr = dateUtils.getTodayStr(new Date());
    storageService.set(cachedKey, userProfile);
    storageService.set(lastCheckDateKey, todayStr);
    storageService.set(tokenKey, userProfile.token);
    storageService.set(isLoginKey, true);
    console.log('从服务器获取用户信息数据成功，更新本地缓存', userProfile);
    return { userProfile };
  }
  return {};
};

export const userProfileService2 = {
  getAll: async () => {
    const todayStr = dateUtils.getTodayStr(new Date());
    const lastCheckDate = storageService.get(lastCheckDateKey);
    console.log(`检查更新: 缓存日期=${lastCheckDate},  今日=${todayStr}`);
    try {
      if (lastCheckDate !== todayStr) {
        const { userProfile } = await getFromServer();
        if (userProfile && userProfile?.id) {
          return { userProfile };
        }
      }
    } catch (err) {
      console.error('【首次】后台获取用户信息失败', err);
    }
    const { userProfile } = getFromLocal();
    if (userProfile && userProfile?.id) {
      console.log('命中日内缓存，直接使用本地用户信息', userProfile);
      storageService.set(tokenKey, userProfile.token);
      return { userProfile };
    }
    try {
      console.log('缓存失效或跨天，执行云登录...');
      return (await getFromServer()) || getFromDefault();
    } catch (err) {
      console.error('后台获取用户信息失败', err);
      // 如果报错了，尝试降级使用旧缓存（防止断网导致无法进入小程序）
      if (userProfile && userProfile?.id) {
        return { userProfile };
      } else {
        return getFromDefault();
      }
    }
  },

  getFromLocal: () => {
    return getFromLocal() || getFromDefault();
  },

  getFromServer: () => {
    return getFromServer();
  },

  save: async (userProfile: UserProfile) => {
    try {
      if (!userProfile || !userProfile?.id) return;
      storageService.set(cachedKey, userProfile);
      await userProfileService.save(userProfile?.id, userProfile);
      console.log(`${cachedKey}已成功保存到服务器`, userProfile);
    } catch (err) {
      console.error(`${cachedKey}保存到服务器失败`, err);
    }
  },

  clearLocal: () => {
    storageService.remove(cachedKey);
    console.log('已清除本地交易数据');
  },

  isLogin: () => {
    return storageService.get(isLoginKey) || false;
  },
};
