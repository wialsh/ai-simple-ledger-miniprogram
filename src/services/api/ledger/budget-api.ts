import type { Budget, Response } from '@/types';
import apiClient from '@/services/request';
import { deserializer } from '@/services/common';

export const budgetService = {
  /** 获取某账本某年份的预算详情 */
  getByYear: async (ledgerId: number, year: number) => {
    const response = await apiClient.get<Response<Budget[]>>(`/ledger/${ledgerId}/budgets/${year}`);
    const result = deserializer<Budget[]>(response);
    return result;
  },

  /** 批量保存/更新预算 */
  save: async (ledgerId: number, budgets: Budget[]) => {
    const res = await apiClient.post<Response<null>>(`/ledger/${ledgerId}/budgets`, budgets);
    return res.data;
  },
};
