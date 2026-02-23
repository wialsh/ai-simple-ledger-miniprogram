import type { LedgerInfo, Response } from '@/types';
import apiClient from '@/services/request';
import { deserializer } from '@/services/common';

export const ledgersInfoService = {
  // 获取一个用户的所有账本
  getByUserId: async (userId: number) => {
    const response = await apiClient.get<Response<LedgerInfo>>(`/ledger/info/byUserId/${userId}`);
    const result = deserializer<LedgerInfo>(response);
    return result;
  },

  // 创建或更新账本
  save: async (ledgerInfo: LedgerInfo) => {
    const result = await apiClient.post<Response<null>>('/ledger/info', ledgerInfo);
    return result.data;
  },

  // 删除账本
  delete: async (id: string) => {
    await apiClient.delete(`/ledger/${id}`);
  },

  // AI 初始化账本分类
  aiInit: async (ledgerId: number, description: string) => {
    await apiClient.post(`/ledger/${ledgerId}/ai-init`, description, {
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};
