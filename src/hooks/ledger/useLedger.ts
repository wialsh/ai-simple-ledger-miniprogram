import { useState, useMemo, useEffect } from 'react';
import { ledgersService, storageService } from '@/services';
import { COLORS } from '@/styles/colors';
import { Ledger, LedgerCategory, LedgerPick, Budget } from '@/types';
import { DEFAULT_LEDGER } from '../constants';

export const useLedgers = (userId: number) => {
  const [ledgerId, setLedgerId] = useState<number>(0);
  const [allLedgers, setAllLedgers] = useState<Ledger[]>([]);

  const currentLedger = useMemo(() => {
    return allLedgers.find(ledger => ledger.isActived) || allLedgers[0];
  }, [allLedgers]);

  //展示账本（我的+分享）
  const displayLedgers = useMemo(() => {
    return allLedgers;
  }, [allLedgers]);

  //我的账本
  const mineLedgers = useMemo(() => {
    return allLedgers.filter(l => l.type !== 2);
  }, [allLedgers]);

  //分享账本
  const joinedLedgers = useMemo(() => {
    return allLedgers.filter(l => l.type === 2);
  }, [allLedgers]);

  const createLedger = (ledgerName: string, iconName: string, ledgerCategories: LedgerCategory[]) => {
    const now = new Date();
    const added: Ledger = {
      id: now.getTime(),
      name: ledgerName,
      description: '',
      iconName: iconName,
      iconColor: COLORS.primaryDark,
      ownerId: userId,
      type: 1,
      userId: userId,
      isActived: true,
      joiningTime: now,
      shareStartTime: now,
      categories: ledgerCategories,
    };

    addLedger(added);
  };

  const addLedger = (added: Ledger) => {
    setAllLedgers(prev => [...prev, added]);
  };

  const updateLedger = (id: number, updates: Partial<Pick<Ledger, LedgerPick>>) => {
    setAllLedgers(ledgers => {
      return ledgers.map(ledger => (ledger.id !== id ? ledger : { ...ledger, ...updates, updatedAt: new Date() }));
    });
  };

  const deleteLedger = (id: number) => {
    if (id) {
      setAllLedgers(prev =>
        prev.map(ledger => {
          return ledger.id === id ? { ...ledger, isDeleted: true } : { ...ledger };
        })
      );
    }
  };

  const deleteLedgerCategory = (iconName: string) => {
    setAllLedgers(prev =>
      prev.map(ledger => {
        if (ledger.id === currentLedger.id) {
          const updatedCategories = ledger.categories?.filter(cat => cat.iconName !== iconName) || [];
          return { ...ledger, categories: updatedCategories };
        }
        return ledger;
      })
    );
  };

  /**
   * 选择账本
   */
  const selectLedger = (id: number) => {
    const selectedLedger = allLedgers.find(ledger => ledger.id === id);

    if (selectedLedger) {
      setAllLedgers(prev =>
        prev.map(ledger => {
          return ledger.id === id ? { ...ledger, isActived: true } : { ...ledger, isActived: false };
        })
      );
    }
  };

  /**
   * 更新账本预算
   */
  const updateLedgerBudgets = (updated: Budget[]) => {
    setAllLedgers(prev => {
      return prev.map(ledger => {
        if (ledger.id === currentLedger.id) {
          const budgets = ledger?.budgets || [];
          if (budgets.length > 0) {
            const hasBudget = budgets.some(budget => budget.year === updated[0].year);
            if (hasBudget) {
              // 更新
              const updatedBudgets = budgets.map(budget => (budget.year === updated[0].year ? updated[0] : budget));
              return { ...ledger, budgets: updatedBudgets };
            } else {
              // 新增
              return { ...ledger, budgets: [...budgets, ...updated] };
            }
          }
          // 新增
          return { ...ledger, budgets: updated };
        }
        return ledger;
      });
    });
  };

  /**
   * 服务器更新所有账本数据
   */
  useEffect(() => {
    const initLedgers = async () => {
      if (!userId) return;
      const fetchedLedgers = await ledgersService.getByUserId(userId);

      if (fetchedLedgers && fetchedLedgers.length > 0) {
        const initCurrentLedger = fetchedLedgers.find(l => l.isActived) || fetchedLedgers[0];
        // 从服务器更新账本状态
        setAllLedgers(
          fetchedLedgers.map(ledger => {
            return ledger.id === initCurrentLedger?.id
              ? { ...ledger, isActived: true }
              : { ...ledger, isActived: false };
          })
        );
        return;
      }

      const cachedLedger = storageService.get<Ledger[]>('ledgers');
      if (cachedLedger && cachedLedger.length > 0) {
        setAllLedgers(cachedLedger);
      } else {
        // 没有账本，创建一个默认账本
        setAllLedgers([DEFAULT_LEDGER]);
      }
    };

    initLedgers();
  }, [userId]);

  useEffect(() => {
    if (allLedgers.length > 0) {
      storageService.set('ledgers', allLedgers);
      allLedgers
        .filter(l => l.isActived)
        .forEach(l => {
          setLedgerId(l.id);
        });
    }
  }, [allLedgers]);

  return {
    ledgerId,
    currentLedger,
    selectLedger,
    updateLedgerBudgets,
    allLedgers,
    displayLedgers,
    createLedger,
    addLedger,
    updateLedger,
    deleteLedger,
    mineLedgers,
    joinedLedgers,
    deleteLedgerCategory,
  };
};
