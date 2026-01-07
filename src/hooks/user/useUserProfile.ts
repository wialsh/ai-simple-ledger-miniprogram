import { useState, useEffect } from 'react';
import { userService } from '@/services/api';
import { UserProfile, UserProfileUpdatable } from '@/types';

export const useUserProfile = (userId: number) => {
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const fetchData = async () => {
    const fetchedUser = await userService.getProfile(userId);
    setUserProfile(fetchedUser[0]);
  };

  const updateUserProfile = (updated: UserProfileUpdatable) => {
    setUserProfile(prev => ({ ...prev, ...updated }) as UserProfile);
  };

  useEffect(() => {
    fetchData();
  }, [userId]);
  return { userProfile, updateUserProfile };
};
