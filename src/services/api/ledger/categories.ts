import { storageService } from '@/services/storage';
import type { LedgerCategory } from '@/types';
import { categoriesService } from './categories-api';
import { ledgerConstants } from './constants';

const cachedKey = 'ledger_categories';

const getFromLocal = () => {
  const categories = storageService.get<LedgerCategory[]>(cachedKey) || [];
  return { categories };
};

const getFromDefault = () => {
  const categories = ledgerConstants.getDefaultCategories();
  storageService.set(cachedKey, categories);
  console.log(`使用默认账本分类数据，${cachedKey}：`, categories);
  return { categories };
};

const getFromServer = async (ledgerId: number) => {
  if (!ledgerId) return;
  const categories = (await categoriesService.getByLedgerId(ledgerId)) || [];
  if (categories && categories.length > 0) {
    storageService.set(cachedKey, categories);
    console.log(`从服务器获取账本数据成功，更新本地缓存，${cachedKey}：`, categories);
    return { categories };
  }
};

export const ledgerCategoriesService = {
  get: async (ledgerId: number) => {
    if (!ledgerId) return;
    const { categories } = getFromLocal();
    if (categories && categories.length > 0) {
      return { categories };
    }
    try {
      return (await getFromServer(ledgerId)) || getFromDefault();
    } catch (err) {
      console.error('后台获取账本列表失败', err);
      return getFromDefault();
    }
  },

  getFromLocal: () => {
    return getFromLocal() || getFromDefault();
  },

  save: async (ledgerId: number, categories: LedgerCategory[]) => {
    try {
      if (!categories) return;
      storageService.set(cachedKey, categories);
      const result = await categoriesService.save(ledgerId, categories);
      console.log('categories已成功保存到服务器', ledgerId, categories);
      return result;
    } catch (err) {
      console.error('categories保存到服务器失败', err);
    }
  },

  clearLocal: () => {
    storageService.remove(cachedKey);
    console.log(`已清除本地账本${cachedKey}数据`);
  },
};
