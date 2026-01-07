import { AxiosResponse } from 'axios';
import { UserProfile, Transaction, Ledger, LedgerPlan, LedgerCategory, Category, LedgerSharingMember } from '@/types';
import apiClient from './http';

interface Response<T> {
  code: 0 | 1;
  data: T;
  msg: string;
}

// 1. 定义 ISO 8601 日期格式的正则
// 匹配形如：2023-12-01T12:00:00Z 或 2023-12-01T12:00:00.000Z
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

/**
 * 判断是否为日期字符串
 */
function isIsoDateString(value: any): boolean {
  return typeof value === 'string' && isoDateRegex.test(value);
}

/**
 * 递归遍历对象，将所有日期格式的字符串转换为 Date 对象
 */
function parseDates(body: any): any {
  if (body === null || body === undefined || typeof body !== 'object') {
    return body;
  }

  if (Array.isArray(body)) {
    return body.map(item => parseDates(item));
  }

  const newObj: any = {};
  for (const key of Object.keys(body)) {
    const value = body[key];

    // 如果是日期字符串，直接转换
    if (isIsoDateString(value)) {
      newObj[key] = new Date(value);
    }
    // 如果是对象或数组，递归处理
    else if (typeof value === 'object') {
      newObj[key] = parseDates(value);
    }
    // 其他情况保持原样
    else {
      newObj[key] = value;
    }
  }
  return newObj;
}

interface Response<T> {
  code: 0 | 1;
  data: T;
  msg: string;
}

// 修改你的 deserializationFromJson 函数
function deserializationFromJson<T>(response: AxiosResponse<Response<T>>): T {
  // 注意：这里返回类型直接写 T 即可，或者用你之前的 WithDateFields<T>
  // 如果你的 T 定义里已经是 Date 类型了（如 Ledger 接口），这里直接返回 T 最方便。

  const rawData = response.data.data;
  return parseDates(rawData) as T;
}

// ==============================
// 交易（Transactions）- 增删查
// ==============================
export const transactionService = {
  // 获取指定账本的交易
  getByLedgerId: async (ledgerId: number) => {
    const response = await apiClient.get<Response<Transaction[]>>(`/transactions/byLedgerId/${ledgerId}`);
    const result = deserializationFromJson<Transaction[]>(response);
    return result;
  },

  // 新增或保存交易
  save: async (transaction: Transaction) => {
    const result = await apiClient.post<Transaction>('/transactions', transaction);
    return result;
  },

  // 删除交易
  delete: async (id: number) => {
    await apiClient.delete(`/transactions/${id}`);
  },
};

// ==============================
// 账本 (Ledgers) - 增删改查
// ==============================
export const ledgersService = {
  // 获取一个用户的所有账本
  getByUserId: async (userId: number) => {
    const response = await apiClient.get<Response<Ledger[]>>(`/ledgers/byUserId/${userId}`);
    const result = deserializationFromJson(response);
    return result;
  },

  // 获取账本创建人的所有账本
  getByOwnerId: async (ownerId: number) => {
    const response = await apiClient.get<Response<Ledger[]>>(`/ledgers/byOwnerId/${ownerId}`);
    const result = deserializationFromJson(response);
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
// 计划（LedgerPlan） - 增删改查
// ==============================
export const ledgerPlanningService = {
  // 通过id获取账本所有的分类
  byLedgerId: async (ledgerId: number) => {
    const response = await apiClient.get<Response<LedgerPlan>>(`/ledger/plan/byLedgerId/${ledgerId}`);
    const result = deserializationFromJson(response);
    return result;
  },
};

// ==============================
// 分类 (Categories) - 增删改查
// ==============================
export const categoriesService = {
  // 获取分类
  get: async () => {
    const response = await apiClient.get<Response<Category[]>>(`/categories`, {
      params: {
        aaa: 'all',
      },
    });
    const result = deserializationFromJson(response);
    return result;
  },

  // 创建或更新账本的分类
  save: async (LedgerCategory: LedgerCategory) => {
    const result = await apiClient.post<Ledger>('/categories', LedgerCategory);
    return result;
  },

  // 删除账本的分类
  delete: async (id: string) => {
    await apiClient.delete(`/ledgers/categories/${id}`);
  },
};

// ==============================
// 加入他人账本 (JoinedLedgers) - 增删改查
// ==============================
export const joinedLedgersService = {
  // 通过MemberId获取所有账本
  getByMemberId: async (memberId: number) => {
    const response = await apiClient.get<Response<Ledger[]>>(`/ledgers/joined/byMemberId/${memberId}`);
    const result = deserializationFromJson(response);
    return result;
  },

  // 删除账本（退出他人账本）
  delete: async (id: string) => {
    await apiClient.delete(`/ledgers/joined/${id}`);
  },
};

// ==============================
// 用户 (User) - 查改
// ==============================
export const userService = {
  // 获取用户信息
  getProfile: async (userId: number) => {
    const response = await apiClient.get<Response<UserProfile[]>>(`/users/${userId}/profile`);
    const result = deserializationFromJson(response);
    return result;
  },

  // 更新用户信息
  update: async (user: UserProfile) => {
    const result = await apiClient.put<UserProfile>(`/users/${user.id}`, user);
    return result;
  },
};

// ==============================
// 账本成员 (LedgerSharingMembers) - 查改
// ==============================
export const ledgerSharingMembersService = {
  // 获取账本成员
  getByLedgerId: async (ledgerId: number) => {
    const response = await apiClient.get<Response<LedgerSharingMember[]>>(`/ledgers/${ledgerId}/members`);
    const result = deserializationFromJson(response);
    return result;
  },

  // 更新账本成员信息
};
