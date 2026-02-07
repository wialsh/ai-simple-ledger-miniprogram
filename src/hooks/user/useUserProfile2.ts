import { useState, useEffect } from 'react';
import { wxLogin } from '@/services';
import { UserProfile, UserProfileUpdatable } from '@/types';

export const useUserProfile2 = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const fetchData = async () => {
    const fetchedUserProfile = undefined;
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
