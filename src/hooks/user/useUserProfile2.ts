import { useState, useEffect } from 'react';
import { loginService } from '@/services/ledger-api';
import { UserProfile, UserProfileUpdatable } from '@/types';

export const useUserProfile2 = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const fetchData = async () => {
    const fetchedUserProfile = await loginService.login();
    setUserProfile(fetchedUserProfile);
  };

  const updateUserProfile = (updated: UserProfileUpdatable) => {
    setUserProfile(prev => ({ ...prev, ...updated }) as UserProfile);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return { userProfile, updateUserProfile };
};
