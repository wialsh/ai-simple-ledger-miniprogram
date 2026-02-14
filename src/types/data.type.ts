export interface UserProfile {
  id: number;
  account: string;
  nickname: string;
  phone: string;
  email: string;
  gender: number; //性别（1-男、2-女、0-未知（默认））
  avatar: string;
  isVip: number;
  token: string;
}

export interface UserProfileUpdatable {
  account?: string;
  nickname?: string;
  phone?: string;
  gender?: number;
  avatar?: string;
}

export interface Transaction {
  transId: number; //交易ID
  amount: number; //交易金额
  remark: string; //备注
  recordDate: Date; //交易记录时间
  userId: number; //记录人ID
  ledgerId: number; //记录的账本ID
  ownerId: number; //记录的账本所有者ID
  iconName: string; //交易分类名称（静态的）
  iconColor: string; //交易分类颜色（静态的）
  isDeleted: boolean; //是否删除
  createdAt: Date; //创建时间
  updatedAt: Date; //更新时间
}

export interface Ledger {
  id: number; //账本ID
  name: string; //账本名称
  description: string; //账本描述
  iconName: string; //账本的组件名称
  iconColor: string; //账本的组件颜色
  ownerId: number; //账本所有者ID
  userId: number; //账本成员ID（当type=1时，ownerId等于userId）
  type: number; //账本类型（自己创建未分享（默认）-0、自己创建已分享-1、他人分享-2）
  isActived: boolean; //账本是否激活（被选中）
  joiningTime: Date; //加入账本的时间
  shareStartTime: Date; //可协同的开始时间
  categories: LedgerCategory[];
  budgets?: Budget[];
}

export interface LedgerCategory {
  // id: number; //分类ID（数据库自增ID，前端不使用）
  // ledgerId: number; //账本ID（数据库外键，前端不使用）
  name: string; //分类名称（中文）
  type: number; //分类的类型(0-未设置（默认）,1-支出，2-收入)
  iconName: string; //分类ID
  iconColor: string; //分类组件颜色
}

export interface Category {
  id: number; //分类ID
  name: string; //分类名称（iconName）
  color: string; //分类icon颜色（iconColor）
  createdAt: Date; //创建时间
  updatedAt: Date; //更新时间
  isDeleted: boolean; //是否删除
}

export interface Budget {
  amounts: number[]; //预算金额，1月～12月（0对应1月，以此类推）
  year: number; //做预算的年份
}

export interface PlanBill {
  amount: number; //计划金额
  planDate: Date; //计划时间（每月月初）
  type: string; //计划类型
}

export interface LedgerPlan {
  id: number; //计划ID
  planBills: PlanBill[];
  ledgerId: number; //账本ID
  createdAt: Date; //创建时间
  updatedAt: Date; //更新时间
  isDeleted: boolean; //是否删除
}

export interface LedgerSharingMember {
  id: number; //账本分享的成员id
  nickname: string;
  avatar: string;
  isSharing: boolean; //是否分享（false-未分享，true-分享）
  joinTime: Date; //成员的加入时间
  ledgerId: number;
  createdAt: Date; //创建时间
  updatedAt: Date; //更新时间
  isDeleted: boolean; //是否删除
}

export interface ChatMessage {
  id: number;
  type: 'text' | 'image' | 'video';
  content: string; // Text content or URL for media
  sender: 'user' | 'support';
  timestamp: Date;
}
