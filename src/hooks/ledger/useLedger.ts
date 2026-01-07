import { useState, useMemo, useEffect } from 'react';
import { ledgersService } from '@/services/api';
import { UserProfile, Ledger, LedgerCategory, LedgerPick, Budget } from '@/types';

export const useLedgers = (userProfile: UserProfile) => {
  // const [currentLedger, setCurrentLedger] = useState<Ledger>({} as Ledger);
  const [allLedgers, setAllLedgers] = useState<Ledger[]>([]);

  const currentLedger = useMemo(() => {
    return allLedgers.find(ledger => ledger.isActived) || allLedgers[0];
  }, [allLedgers]);

  //展示账本（我的+分享）
  const displayLedgers = useMemo(() => {
    return allLedgers.filter(ledger => !ledger.isDeleted);
  }, [allLedgers]);

  //我的账本
  const mineLedgers = useMemo(() => {
    return allLedgers.filter(l => l.type !== 2 && !l.isDeleted);
  }, [allLedgers]);

  //分享账本
  const joinedLedgers = useMemo(() => {
    return allLedgers.filter(l => l.type === 2 && !l.isDeleted);
  }, [allLedgers]);

  const createLedger = (ledgerName: string, componentName: string, ledgerCategories: LedgerCategory[]) => {
    const now = new Date();
    const added: Ledger = {
      id: now.getTime(),
      name: ledgerName,
      desc: '',
      componentName: componentName,
      componentColor: '#76BDB9',
      ownerId: userProfile.id,
      ownerNickname: userProfile.nickname,
      ownerAvatar: userProfile.avatar,
      type: 1,
      userId: userProfile.id,
      isActived: true,
      joiningTime: now,
      shareStartTime: now,
      categories: ledgerCategories,
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    };

    addLedger(added);
  };

  const addLedger = (added: Ledger) => {
    setAllLedgers(prev => [...prev, added]);
  };

  const updateLedger = (ledgerId: number, updates: Partial<Pick<Ledger, LedgerPick>>) => {
    setAllLedgers(ledgers => {
      return ledgers.map(ledger =>
        ledger.id !== ledgerId ? ledger : { ...ledger, ...updates, updatedAt: new Date() }
      );
    });
  };

  const deleteLedger = (ledgerId: number) => {
    if (ledgerId) {
      setAllLedgers(prev =>
        prev.map(ledger => {
          return ledger.id === ledgerId ? { ...ledger, isDeleted: true } : { ...ledger };
        })
      );
    }
  };

  const activateLedger = (ledgerId: number) => {
    const selectedLedger = allLedgers.find(ledger => ledger.id === ledgerId);

    if (selectedLedger) {
      setAllLedgers(prev =>
        prev.map(ledger => {
          return ledger.id === ledgerId ? { ...ledger, isActived: true } : { ...ledger, isActived: false };
        })
      );
    }
  };

  const updateLedgerBudget = (updated: Budget) => {
    setAllLedgers(prev => {
      return prev.map(ledger => {
        if (ledger.id === currentLedger.id) {
          const budgets = ledger?.budgets || [];
          if (budgets.length > 0) {
            const hasBudget = budgets.some(budget => budget.year === updated.year);
            if (hasBudget) {
              // 更新
              const updatedBudgets = budgets.map(budget => (budget.year === updated.year ? updated : budget));
              return { ...ledger, budgets: updatedBudgets };
            } else {
              // 新增
              return { ...ledger, budgets: [...budgets, updated] };
            }
          }
          // 新增
          return { ...ledger, budgets: [updated] };
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
      if (!userProfile?.id) return;

      const fetchedLedgers = await ledgersService.getByUserId(userProfile.id);

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
      }
    };

    initLedgers();
  }, [userProfile?.id]);

  return {
    currentLedger,
    activateLedger,
    updateLedgerBudget,
    allLedgers,
    displayLedgers,
    createLedger,
    addLedger,
    updateLedger,
    deleteLedger,
    mineLedgers,
    joinedLedgers,
  };
};
