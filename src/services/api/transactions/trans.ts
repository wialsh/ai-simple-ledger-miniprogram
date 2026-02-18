import type { Transaction } from '@/types';
import { storageService } from '@/services/storage';
import { transactionsService } from './trans-api';

const cachedKey = 'transactions';

const getFromLocal = () => {
  const transactions = storageService.get<Transaction[]>(cachedKey) || [];
  console.log(`从本地获取交易数据`, transactions);
  return transactions;
};

const getFromDefault = () => {
  const transactions = [];
  return { transactions };
};

const getFromServer = async (ledgerId: number) => {
  const transactions = (await transactionsService.getByLedgerId(ledgerId)) || [];
  if (transactions) {
    storageService.set(cachedKey, transactions);
    console.log('从服务器获取交易数据成功，更新本地缓存', transactions);
    return { transactions };
  }
};

export const transactionsService2 = {
  getAll: async (ledgerId: number) => {
    if (!ledgerId) return;
    const transactions = getFromLocal();
    if (transactions && transactions.length > 0) {
      return { transactions };
    }
    try {
      return (await getFromServer(ledgerId)) || getFromDefault();
    } catch (err) {
      console.error('后台获取交易列表失败', err);
      return getFromDefault();
    }
  },

  getFromLocal: () => {
    return getFromLocal() || getFromDefault();
  },

  save: async (transactions: Transaction[], saveAll = false, topK = 30) => {
    try {
      if (!transactions) return;
      storageService.set(cachedKey, transactions);
      if (saveAll) {
        await transactionsService.save(transactions);
      } else {
        // 保存最近30笔交易到服务器
        await transactionsService.save(transactions.slice(-topK));
      }
      console.log(`${cachedKey}已成功保存到服务器`, transactions);
    } catch (err) {
      console.error(`${cachedKey}保存到服务器失败`, err);
    }
  },

  clearLocal: () => {
    storageService.remove(cachedKey);
    console.log('已清除本地交易数据');
  },
};
