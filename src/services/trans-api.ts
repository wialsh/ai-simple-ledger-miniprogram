import type { Transaction, Response } from '@/types';
import apiClient from './request';
import { deserializer } from './request/deserialize';

// ==============================
// 交易（Transactions）- 增删查
// ==============================
export const transactionService = {
  // 获取指定账本的交易
  getByLedgerId: async (ledgerId: number) => {
    const response = await apiClient.get<Response<Transaction[]>>(`/transactions/listByLedger/${ledgerId}`);
    const result = deserializer<Transaction[]>(response);
    return result;
  },

  // 保存交易
  save: async (transaction: Transaction) => {
    const result = await apiClient.post<Transaction>('/transactions', transaction);
    return result;
  },

  // 删除交易
  delete: async (id: number) => {
    await apiClient.delete(`/transactions/${id}`);
  },
};
