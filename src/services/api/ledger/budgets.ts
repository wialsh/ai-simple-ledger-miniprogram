import { storageService } from '@/services/storage';
import type { Budget } from '@/types';
import { budgetService } from './budget-api';

const cachedKey = 'ledger_budgets';

const getFromLocal = () => {
  const budgets = storageService.get<Budget[]>(cachedKey) || [];
  return { budgets };
};

const getFromDefault = () => {
  const budgets = [];
  storageService.set(cachedKey, budgets);
  console.log(`使用默认账本预算数据，${cachedKey}：`, budgets);
  return { budgets };
};

const getFromServer = async (ledgerId: number, year: number) => {
  if (!ledgerId) return;
  const budgets = (await budgetService.getByYear(ledgerId, year)) || [];
  if (budgets && budgets.length > 0) {
    storageService.set(cachedKey, budgets);
    console.log(`从服务器获取账本预算数据成功，更新本地缓存，${cachedKey}：`, budgets);
    return { budgets };
  }
};

export const ledgerBudgetsService = {
  get: async (ledgerId: number, year: number) => {
    if (!ledgerId || !year) return;
    const { budgets } = getFromLocal();
    if (budgets && budgets.length > 0) {
      return { budgets };
    }
    try {
      return (await getFromServer(ledgerId, year)) || getFromDefault();
    } catch (err) {
      console.error('后台获取账本预算列表失败', err);
      return getFromDefault();
    }
  },

  getFromLocal: (ledgerId: number) => {
    return getFromLocal() || getFromDefault();
  },

  save: async (ledgerId: number, budgets: Budget[]) => {
    try {
      if (!budgets) return;
      storageService.set(cachedKey, budgets);
      const result = await budgetService.save(ledgerId, budgets);
      console.log(`账本${ledgerId}预算已成功保存到服务器`, budgets);
      return result;
    } catch (err) {
      console.error(`账本${ledgerId}预算保存到服务器失败`, err);
    }
  },

  clearLocal: () => {
    storageService.remove(cachedKey);
    console.log(`已清除本地账本${cachedKey}数据`);
  },
};
