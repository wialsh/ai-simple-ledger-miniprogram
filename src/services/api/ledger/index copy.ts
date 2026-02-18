import { storageService } from '@/services/storage';
import type { Budget, LedgerCategory, LedgerInfo } from '@/types';
import { ledgersInfoService } from './ledger-info-api';
import { categoriesService } from './categories-api';
import { budgetService } from './budget-api';
import { DEFAULT_LEDGER_INFO, DEFAULT_LEDGER_CATEGORIES } from './constants';

const getFromLocal = () => {
  const ledgerInfo = storageService.get<LedgerInfo>('ledger_info');
  const categories = storageService.get<LedgerCategory[]>('ledger_categories') || [];
  const budgets = storageService.get<Budget[]>('ledger_budgets') || [];
  return { ledgerInfo, categories, budgets };
};

const getFromDefault = () => {
  const ledgerInfo = DEFAULT_LEDGER_INFO;
  const categories = DEFAULT_LEDGER_CATEGORIES;
  const budgets = [];
  storageService.set('ledger_info', ledgerInfo);
  storageService.set('ledger_categories', categories);
  storageService.set('ledger_budgets', budgets);
  console.log('使用默认账本数据', ledgerInfo, categories, budgets);
  return { ledgerInfo, categories, budgets };
};

const getFromServer = async (userId: number) => {
  if (!userId) return;
  const ledgerInfo = await ledgersInfoService.getByUserId(userId);
  const categories = (await categoriesService.getByLedgerId(ledgerInfo.id)) || [];
  const budgets = (await budgetService.getByYear(ledgerInfo.id, new Date().getFullYear())) || [];

  if (ledgerInfo?.id) {
    // 更新本地缓存
    storageService.set('ledger_info', ledgerInfo);
    storageService.set('ledger_categories', categories);
    storageService.set('ledger_budgets', budgets);
    console.log('从服务器获取账本数据成功，更新本地缓存', ledgerInfo, categories, budgets);
    return { ledgerInfo, categories, budgets };
  }
};

export const ledgerService = {
  getAll: async (userId: number) => {
    if (!userId) return;
    const { ledgerInfo, categories, budgets } = getFromLocal();

    if (ledgerInfo) {
      return { ledgerInfo, categories, budgets };
    }

    try {
      return (await getFromServer(userId)) || getFromDefault();
    } catch (err) {
      console.error('后台获取账本列表失败', err);
      return getFromDefault();
    }
  },

  getFromLocal: () => {
    return getFromLocal() || getFromDefault();
  },

  saveLedgerInfo: async (ledgerInfo?: LedgerInfo) => {
    try {
      if (!ledgerInfo) return;
      storageService.set('ledger_info', ledgerInfo);
      const result = await ledgersInfoService.save(ledgerInfo);
      console.log('LedgerInfo已成功保存到服务器', ledgerInfo);
      return result;
    } catch (err) {
      console.error('LedgerInfo保存到服务器失败', err);
    }
  },

  saveCategories: async (ledgerId: number, categories: LedgerCategory[]) => {
    try {
      if (!categories) return;
      storageService.set('ledger_categories', categories);
      const result = await categoriesService.save(ledgerId, categories);
      console.log('categories已成功保存到服务器', ledgerId, categories);
      return result;
    } catch (err) {
      console.error('categories保存到服务器失败', err);
    }
  },

  saveBudgets: async (ledgerId: number, budgets: Budget[]) => {
    try {
      if (!budgets) return;
      storageService.set('ledger_budgets', budgets);
      const result = await budgetService.save(ledgerId, budgets);
      console.log('budget已成功保存到服务器', ledgerId, budgets);
      return result;
    } catch (err) {
      console.error('budget保存到服务器失败', err);
    }
  },

  clearLocal: () => {
    storageService.remove('ledger_info');
    storageService.remove('ledger_categories');
    storageService.remove('ledger_budgets');
    console.log('已清除本地账本数据');
  },
};
