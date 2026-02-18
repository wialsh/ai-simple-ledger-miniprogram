import { LedgerCategory, LedgerInfo } from '@/types';
import { hashIdByCrypto } from '@/utils';

const now = new Date();

const RAW_CATEGORIES: LedgerCategory[] = [
  {
    catId: 1,
    name: '差旅费',
    type: 0,
    iconName: 'Plane',
    iconColor: '#3B82F6',
  },
  {
    catId: 2,
    name: '办公用品',
    type: 0,
    iconName: 'MonitorCloud',
    iconColor: '#60A5FA',
  },
  {
    catId: 3,
    name: '工作餐',
    type: 0,
    iconName: 'Soup',
    iconColor: '#93C5FD',
  },
  {
    catId: 4,
    name: '市内交通',
    type: 0,
    iconName: 'Bus',
    iconColor: '#BFDBFE',
  },
  {
    catId: 5,
    name: '通讯费',
    type: 0,
    iconName: 'PhoneCall',
    iconColor: '#3B82F6',
  },
  {
    catId: 6,
    name: '培训学习',
    type: 0,
    iconName: 'GraduationCap',
    iconColor: '#60A5FA',
  },
  {
    catId: 7,
    name: '团队建设',
    type: 0,
    iconName: 'UsersRound',
    iconColor: '#93C5FD',
  },
  {
    catId: 8,
    name: '办公设备',
    type: 0,
    iconName: 'MonitorCog',
    iconColor: '#BFDBFE',
  },
  {
    catId: 9,
    name: '报销款项',
    type: 0,
    iconName: 'BanknoteArrowDown',
    iconColor: '#10B981',
  },
  {
    catId: 10,
    name: '其他',
    type: 0,
    iconName: 'StickyNote',
    iconColor: '#CBD5E1',
  },
];

export const ledgerConstants = {
  // 💡 获取默认账本信息（每次调用生成新的 ID）
  getDefault: (userId: number): LedgerInfo => {
    const ledgerInfo: LedgerInfo = {
      id: now.getTime(),
      name: '',
      description: '',
      iconName: 'MonitorCog',
      iconColor: '#3B82F6',
      ownerId: userId,
      type: 0,
      isActived: true,
    };
    return ledgerInfo;
  },

  // 💡 获取默认分类（明确标记为异步函数）
  getDefaultCategories: (): LedgerCategory[] => {
    return RAW_CATEGORIES.map(cat => {
      // 使用名称 + userId 生成唯一 Hash，防止不同用户的账本的分类 ID 冲突
      const catId = hashIdByCrypto(cat.name);
      return {
        ...cat,
        catId: Number(catId.toString().substring(0, 15)), // 确保是数字类型
      };
    });
  },
};
