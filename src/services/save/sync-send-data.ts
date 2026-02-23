import { ledgerInfoService, ledgerCategoriesService, ledgerBudgetsService, transactionsService2 } from '@/services/api';

export const syncSendTransactionsData = async (sendWay: 'onHide' | 'onLaunch' = 'onHide') => {
  try {
    const transactions = transactionsService2.getFromLocal();
    if (transactions?.length > 0) {
      console.log('发现本地未同步的交易数据，正在同步...', transactions);
      await transactionsService2.save(transactions, true);
      console.log('交易数据同步成功。');
      // 同步成功后清除本地缓存
      if (sendWay === 'onHide') {
        // transactionsService.clearLocal();
      }
    }
  } catch (e) {
    console.error('同步失败，数据保留在本地下次重试', e);
  }
};

export const syncSendLedgerData = async (userId: number, sendWay: 'onHide' | 'onLaunch' = 'onHide') => {
  try {
    const { ledgerInfo } = ledgerInfoService.getFromLocal(userId);
    if (ledgerInfo?.id) {
      const { categories } = ledgerCategoriesService.getFromLocal(ledgerInfo?.id || 0);
      const { budgets } = ledgerBudgetsService.getFromLocal(ledgerInfo?.id || 0);
      console.log('发现本地未同步的账本数据，正在同步...', { ledgerInfo, categories, budgets });
      const result = await ledgerInfoService.save(ledgerInfo);
      const result2 = await ledgerCategoriesService.save(ledgerInfo.id, categories);
      const result3 = await ledgerBudgetsService.save(ledgerInfo.id, budgets);

      if (result?.code !== 0 || result2?.code !== 0 || result3?.code !== 0) {
        console.error('账本信息同步失败:', result?.msg || result2?.msg || result3?.msg, ledgerInfo);
      } else {
        console.log('账本同步成功。');
        // 同步成功后清除本地缓存
        if (sendWay === 'onHide') {
          // ledgerService.clearLocal();
        }
      }
    }
  } catch (e) {
    console.error('同步失败，数据保留在本地下次重试', e);
  }
};
