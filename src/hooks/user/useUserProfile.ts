import { useState, useEffect, useMemo } from 'react';
import { userProfileService2 } from '@/services';
import { UserProfile, UserProfilePick } from '@/types';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>();

  const userId = useMemo(() => userProfile?.id || 0, [userProfile]);
  const isLogin = useMemo(() => userProfileService2.isLogin(), []);

  useEffect(() => {
    if (userProfile?.id) {
      userProfileService2.save(userProfile);
    }
  }, [userProfile]);

  const updateUserProfile = (updated: Partial<Pick<UserProfile, UserProfilePick>>) => {
    setUserProfile(prev => (prev ? { ...prev, ...updated } : prev));
  };

  useEffect(() => {
    userProfileService2.getAll().then(data => {
      if (data?.userProfile) {
        setUserProfile(data.userProfile);
      }
    });
  }, []);

  return { userId, userProfile, updateUserProfile, isLogin };
};
