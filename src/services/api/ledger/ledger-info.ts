import { storageService } from '@/services/storage';
import type { LedgerInfo } from '@/types';
import { ledgersInfoService } from './ledger-info-api';
import { ledgerConstants } from './constants';

const cachedKey = 'ledger_info';

const getFromLocal = () => {
  const ledgerInfo = storageService.get<LedgerInfo>(cachedKey);
  return { ledgerInfo };
};

const getFromDefault = (userId: number) => {
  const ledgerInfo = ledgerConstants.getDefault(userId);
  console.log('使用默认账本数据，ledgerInfo：', ledgerInfo);
  return { ledgerInfo };
};

const getFromServer = async (userId: number) => {
  if (!userId) return;
  const ledgerInfo = await ledgersInfoService.getByUserId(userId);
  if (ledgerInfo?.id) {
    // 更新本地缓存
    storageService.set(cachedKey, ledgerInfo);
    console.log('从服务器获取账本数据成功，更新本地缓存，ledgerInfo：', ledgerInfo);
    return { ledgerInfo };
  }
};

export const ledgerInfoService = {
  get: async (userId: number) => {
    if (!userId) return;
    const { ledgerInfo } = getFromLocal();
    if (ledgerInfo && ledgerInfo.id) {
      return { ledgerInfo };
    }
    try {
      return (await getFromServer(userId)) || getFromDefault(userId);
    } catch (err) {
      console.error('后台获取账本列表失败', err);
      return getFromDefault(userId);
    }
  },

  getFromLocal: (userId: number) => {
    return getFromLocal() || getFromDefault(userId);
  },

  save: async (ledgerInfo: LedgerInfo) => {
    try {
      if (!ledgerInfo) return;
      storageService.set(cachedKey, ledgerInfo);
      const result = await ledgersInfoService.save(ledgerInfo);
      console.log('已成功保存到服务器，ledgerInfo：', ledgerInfo);
      return result;
    } catch (err) {
      console.error('保存到服务器失败', err);
    }
  },

  clearLocal: () => {
    storageService.remove(cachedKey);
    console.log(`已清除本地账本${cachedKey}数据`);
  },
};
