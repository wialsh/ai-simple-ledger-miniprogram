import type { LedgerPick } from './common.type';
import type {
  Ledger,
  UserProfile,
  UserProfileUpdatable,
  Transaction,
  Budget,
  Category,
  LedgerCategory,
  LedgerSharingMember,
  ChatMessage,
} from './data.type';
import type { CategoriesSpend, TrendData, TotalTransaction } from './stat.type';

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
  selectLedger: (ledgerId: number) => void;
  updateLedgerBudget: (updated: Budget) => void;
  allLedgers: Ledger[];
  displayLedgers: Ledger[];
  createLedger: (ledgerName: string, componentName: string, ledgerCategories: LedgerCategory[]) => void;
  addLedger: (t: Ledger) => void;
  updateLedger: (ledgerId: number, updates: Partial<Pick<Ledger, LedgerPick>>) => void;
  deleteLedger: (ledgerId: number) => void;
  mineLedgers: Ledger[];
  joinedLedgers: Ledger[];
  deleteLedgerCategory: (categoryId: string) => void;

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

  // 消息
  chatMessages: ChatMessage[];
  updateChatMessage: (content: string, sender: 'user' | 'support', type: 'text' | 'image' | 'video') => void;
}
