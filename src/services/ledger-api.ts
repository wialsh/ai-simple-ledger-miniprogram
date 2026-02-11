import type { Ledger, Budget, Response } from '@/types';
import apiClient from './request';
import { deserializer } from './request/deserialize';

// ==============================
// 账本 (Ledgers) - 增删改查
// ==============================
export const ledgersService = {
  // 获取一个用户的所有账本
  getByUserId: async (userId: number) => {
    const response = await apiClient.get<Response<Ledger[]>>(`/ledgers/byUserId/${userId}`);
    const result = deserializer<Ledger[]>(response);
    return result;
  },

  // 获取账本创建人的所有账本
  getByOwnerId: async (ownerId: number) => {
    const response = await apiClient.get<Response<Ledger[]>>(`/ledgers/byOwnerId/${ownerId}`);
    const result = deserializer<Ledger[]>(response);
    return result;
  },

  // 创建或更新账本
  save: async (ledger: Ledger) => {
    const result = await apiClient.post<Ledger>('/ledgers', ledger);
    return result;
  },

  // 删除账本
  delete: async (id: string) => {
    await apiClient.delete(`/ledgers/${id}`);
  },
};

// ==============================
// 预算 (Budgets) - 增删改查
// ==============================
export const budgetsService = {
  // 获取账本的预算
  getByLedgerId: async (ledgerId: number) => {
    const response = await apiClient.get<Response<Budget[]>>(`/budgets/byLedgerId/${ledgerId}`);
    const result = deserializer<Budget[]>(response);
    return result;
  },

  // 保存账本的预算
  save: async (budgets: Budget[]) => {
    const response = await apiClient.post<Response<Budget[]>>(`/budgets`, budgets);
    const result = deserializer(response);
    return result;
  },

  // 更新账本的预算
  update: async (budgets: Budget[]) => {
    const response = await apiClient.put<Response<Budget[]>>(`/budgets`, budgets);
    const result = deserializer(response);
    return result;
  },
};
