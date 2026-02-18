export interface UserProfile {
  id: number;
  account: string;
  nickname: string;
  phone: string;
  email: string;
  gender: number; //性别（1-男、2-女、0-未知（默认））
  avatar: string;
  isVip: number;
  token?: string;
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
  catName: string; //交易分类名称（静态的）
  iconName: string; //交易分类名称（静态的）
  iconColor: string; //交易分类颜色（静态的）
  // isDeleted: boolean; //是否删除
  // createdAt: Date; //创建时间
  // updatedAt: Date; //更新时间
}

export interface Ledger extends LedgerInfo {
  categories: LedgerCategory[];
  budget: Budget;
}

export interface LedgerInfo {
  id: number; //账本ID
  name: string; //账本名称
  description: string; //账本描述
  iconName: string; //账本的组件名称
  iconColor: string; //账本的组件颜色
  ownerId: number; //账本所有者ID
  type: number; //账本类型（0-未激活，1-已激活）
  isActived: boolean; //账本是否激活（被选中）
}

export interface LedgerCategory {
  catId: number; //分类ID
  name: string; //名称（中文）
  type: number; //分类类型(0-初始化,1-手工填写，2-ai生成)
  iconName: string; //分类ID
  iconColor: string; //分类组件颜色
}

export interface Budget {
  amount: number; //预算金额
  month: number; //做预算的月份（0对应1月，以此类推）
  year: number; //做预算的年份
}

export interface ChatMessage {
  id: number;
  type: 'text' | 'image' | 'video';
  content: string; // Text content or URL for media
  sender: 'user' | 'support';
  timestamp: Date;
}
