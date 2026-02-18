import type { Response, LedgerCategory } from '@/types';
import apiClient from '@/services/request';
import { deserializer } from '@/services/common';

export const categoriesService = {
  /**
   * 获取账本关联的分类 ID 列表
   * 注意：后端目前返回的是 Long[]
   */
  getByLedgerId: async (ledgerId: number) => {
    const response = await apiClient.get<Response<LedgerCategory[]>>(`/ledger/${ledgerId}/categories`);
    const result = deserializer<LedgerCategory[]>(response);
    return result;
  },

  /**
   * 全量更新账本的分类关联
   * categories: LedgerCategory[]，包含分类的完整信息（id、name、type、iconName、iconColor）
   * 后端会根据分类 ID 来更新关联关系，新增的分类会被创建，缺失的分类关联会被删除
   * 注意：前端传给后端的分类 ID 可以是临时的（如负数），后端会在创建新分类时分配正式 ID
   */
  save: async (ledgerId: number, categories: LedgerCategory[]) => {
    const res = await apiClient.post<Response<null>>(`/ledger/${ledgerId}/categories`, categories);
    return res.data;
  },

  /** 清空分类 */
  clear: async (ledgerId: number) => {
    return await apiClient.delete(`/ledger/${ledgerId}/categories`);
  },
};
