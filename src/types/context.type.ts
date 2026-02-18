import type { LedgerPick, UserProfilePick } from './common.type';
import type { Ledger, UserProfile, Transaction, Budget, LedgerCategory, ChatMessage, LedgerInfo } from './data.type';
import type { CategoriesSpend, TotalTransaction } from './stat.type';

export interface AppContextType {
  // 基础信息
  currentDate: Date;
  setCurrentDate: (date: Date) => void;

  // 用户信息
  userId: number;
  userProfile: UserProfile | null;
  updateUserProfile: (updated: Partial<Pick<UserProfile, UserProfilePick>>) => void;

  // 分类
  // allCategories,

  // 交易
  transactions: Transaction[];
  addTransaction: (amount: number, recordDate: Date, remark: string, category: LedgerCategory) => void;
  monthlyTransactions: Transaction[];
  dailyTotalTransactions: TotalTransaction[];

  // 账本
  ledgerId: string;
  ledgerInfo: Ledger | null;
  updateLedgerInfo: (updates: Partial<Pick<LedgerInfo, LedgerPick>>) => void;
  categories: LedgerCategory[];
  updateLedgerCategories: (updates: LedgerCategory[]) => void;
  deleteLedgerCategory: (catId: number) => void;
  budgets: Budget[];
  updateLedgerBudgets: (budgets: Budget[]) => void;

  // 消费统计
  monthlySpent: number;
  dailySpent: any[];
  categoriesData: CategoriesSpend[];
  monthlyBudget: number;

  // 消息
  chatMessages: ChatMessage[];
  updateChatMessage: (content: string, sender: 'user' | 'support', type: 'text' | 'image' | 'video') => void;
}
