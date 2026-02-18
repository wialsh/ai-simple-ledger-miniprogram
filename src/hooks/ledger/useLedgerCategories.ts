import { useState, useMemo, useEffect } from 'react';
import { ledgerCategoriesService } from '@/services';
import type { LedgerCategory } from '@/types';

export const useLedgerCategories = (ledgerId: number) => {
  const [categories, setCategories] = useState<LedgerCategory[]>([]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      ledgerCategoriesService.save(ledgerId, categories);
    }
  }, [categories, ledgerId]);

  // ---------------------------------------------------------
  // 计算属性 (useMemo)
  // ---------------------------------------------------------
  const categoryIds = useMemo(() => categories.map(cat => cat.catId), [categories]);

  // ---------------------------------------------------------
  // 业务操作方法 (Action)
  // ---------------------------------------------------------
  const categoriesUniqueByCatId = (ledgerCategories: LedgerCategory[], catMap: Map<number, LedgerCategory>) => {
    for (const category of ledgerCategories) {
      // 如果 name 未出现过，则保留该分类
      if (!catMap.has(category.catId)) {
        catMap.set(category.catId, category);
      }
    }
  };

  const updateLedgerCategories = (updates: LedgerCategory[]) => {
    setCategories(prev => {
      const catMap = new Map<number, LedgerCategory>();
      if (prev && prev.length > 0) {
        categoriesUniqueByCatId(prev, catMap);
      }
      if (updates && updates.length > 0) {
        categoriesUniqueByCatId(updates, catMap);
      }
      return Array.from(catMap.values()).slice(0, 500);
    });
  };

  const deleteLedgerCategory = (catId: number) => {
    setCategories(prev => {
      if (!prev) return prev;
      const updatedCategories = prev.filter(cat => cat.catId !== catId);
      return updatedCategories;
    });
  };

  useEffect(() => {
    ledgerCategoriesService
      .get(ledgerId)
      .then(res => {
        if (res) {
          setCategories(res.categories);
        } else {
          setCategories([]);
        }
      })
      .catch(err => {
        console.error('获取账本数据失败', err);
        setCategories([]);
      });
  }, [ledgerId]);

  return {
    categoryIds,
    categories,
    updateLedgerCategories,
    deleteLedgerCategory,
  };
};
