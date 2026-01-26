export interface UserProfile {
  id: number;
  account: string;
  nickname: string;
  phone: string;
  email: string;
  gender: number; //性别（1-男、2-女、0-未知（默认））
  avatar: string;
  isVip: number;
  isDeleted: boolean; //是否删除
  updatedAt: Date; //更新时间
  createdAt: Date; //创建时间
}

export interface UserProfileUpdatable {
  account?: string;
  nickname?: string;
  phone?: string;
  gender?: number;
  avatar?: string;
}

export interface Transaction {
  id: number;
  transId: number; //交易ID
  amount: number; //交易金额
  remark: string; //备注
  recordDate: Date; //交易记录时间
  userId: number; //记录人ID
  ledgerId: number; //记录的账本ID
  ownerId: number; //记录的账本所有者ID
  categoryId: string; //记录的账本的分类ID
  categoryName: string; //记录的账本的分类名称（静态的）
  componentName: string; //记录的账本的分类的组件名称
  componentColor: string; //记录的账本的分类的组件颜色
  isDeleted: boolean; //是否删除
  createdAt: Date; //创建时间
  updatedAt: Date; //更新时间
}

export interface Ledger {
  id: number; //账本ID
  name: string; //账本名称
  desc: string; //账本描述
  componentName: string; //账本的组件名称
  componentColor: string; //账本的组件颜色
  ownerId: number; //账本所有者ID
  ownerNickname: string; //账本所有者名称
  ownerAvatar: string; //账本所有者头像
  userId: number; //账本成员ID（当type=1时，ownerId等于userId）
  type: number; //账本类型（自己创建未分享（默认）-0、自己创建已分享-1、他人分享-2）
  isActived: boolean; //账本是否激活（被选中）
  joiningTime: Date; //加入账本的时间
  shareStartTime: Date; //可协同的开始时间
  categories: LedgerCategory[];
  Budgets?: Budget[];
  createdAt: Date; //创建时间
  updatedAt: Date; //更新时间
  isDeleted: boolean; //是否删除
}

export interface LedgerCategory {
  id: number;
  // ledgerId: number; //账本ID
  catId: string; //分类ID
  name: string; //分类名称（中文）
  type: number; //分类的类型(0-未设置（默认）,1-支出，2-收入)
  componentName: string; //分类组件名称
  componentColor: string; //分类组件颜色
}

export interface Category {
  id: string; //分类ID
  name: string; //分类名称（ComponentName）
  color: string; //分类icon颜色（ComponentColor）
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
