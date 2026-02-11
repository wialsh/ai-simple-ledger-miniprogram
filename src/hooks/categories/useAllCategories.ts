import { useState, useMemo, useEffect } from 'react';
// import { categoriesService } from '@/services';
import { Category } from '@/types';

export const useAllCategories = () => {
  const [allCategories, setAllCategories] = useState<Category[]>();

  const fetchData = async () => {
    // const fetchedAllCategories = await categoriesService.get();
    const fetchedAllCategories = [];
    setAllCategories(fetchedAllCategories);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    allCategories,
  };
};
