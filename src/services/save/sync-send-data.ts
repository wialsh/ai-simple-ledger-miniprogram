import { ledgersService, transactionService, storageService } from '@/services';
import { Ledger, Transaction } from '@/types';

export const syncSendData = async (sendWay: 'onHide' | 'onLaunch' = 'onHide') => {
  try {
    // 注意：在 onHide 里执行异步请求，时间非常短（约 5 秒）
    // 微信会尽可能保证请求发出，但不保证一定能收到回包

    const transactions = storageService.get<Transaction[]>('transactions');
    if (transactions && transactions.length > 0) {
      const result = await transactionService.save(transactions);
      if (result.code !== 0) {
        console.error('交易同步失败:', result.msg, transactions);
      } else {
        console.log('交易同步成功');
        // 同步成功后清除本地缓存
        if (sendWay === 'onHide') {
          storageService.remove('transactions');
        }
      }
    }

    const ledgers = storageService.get<Ledger[]>('ledgers');
    if (ledgers && ledgers.length > 0) {
      const result = await ledgersService.save(ledgers);
      if (result.code !== 0) {
        console.error('账本同步失败:', result.msg, ledgers);
      } else {
        console.log('账本同步成功:', result);
        // 同步成功后清除本地缓存
        if (sendWay === 'onHide') {
          storageService.remove('ledgers');
        }
      }
    }
  } catch (e) {
    console.error('同步失败，数据保留在本地下次重试', e);
  }
};
