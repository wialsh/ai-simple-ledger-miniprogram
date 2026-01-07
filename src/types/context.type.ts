import { LedgerPick } from './common.type';
import {
  Ledger,
  UserProfile,
  UserProfileUpdatable,
  Transaction,
  TotalTransaction,
  Category,
  LedgerCategory,
  LedgerSharingMember,
  Budget,
} from './data.type';
import { CategoriesSpend, TrendData } from './stat.type';

export interface AppContextType {
  // 基础信息
  currentDate: Date;
  setCurrentDate: (d: Date) => void;
  //用户信息
  userProfile: UserProfile;
  updateUserProfile: (updated: UserProfileUpdatable) => void;

  //交易
  allCategories: Category[];

  // 交易
  transactions: Transaction[];
  monthlyTransactions: Transaction[];
  dailyTotalTransactions: TotalTransaction[];
  addTransaction: (amount: number, recordDate: Date, remark: string, category: LedgerCategory) => void;

  // 账本
  currentLedger: Ledger;
  activateLedger: (ledgerId: number) => void;
  updateLedgerBudget: (updated: Budget) => void;
  allLedgers: Ledger[];
  displayLedgers: Ledger[];
  createLedger: (ledgerName: string, componentName: string, ledgerCategories: LedgerCategory[]) => void;
  addLedger: (t: Ledger) => void;
  updateLedger: (ledgerId: number, updates: Partial<Pick<Ledger, LedgerPick>>) => void;
  deleteLedger: (ledgerId: number) => void;
  mineLedgers: Ledger[];
  joinedLedgers: Ledger[];

  //账本成员
  ledgerSharingMembers: LedgerSharingMember[];
  setLedgerSharingMembers: React.Dispatch<React.SetStateAction<LedgerSharingMember[]>>;
  updateLedgerSharingMember: (
    id: number,
    updates: Partial<Pick<LedgerSharingMember, 'nickname' | 'avatar' | 'isSharing'>>
  ) => void;
  addLedgerSharingMember: (id: number, nickname: string, avatar: string, isSharing: boolean, joinTime: Date) => void;
  deleteLedgerSharingMember: (id: number) => void;

  // 预算统计
  monthlyBudget: number;

  // 消费统计
  monthlySpent: number;
  dailySpent: number;
  categoriesData: CategoriesSpend[];
  trendData: TrendData[];
}
