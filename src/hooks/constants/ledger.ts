import { Ledger } from '@/types';

const now = new Date();

export const DEFAULT_LEDGER: Ledger = {
  id: now.getTime(),
  name: '职场',
  description: '记录工作相关收支，如差旅、办公、团建等',
  iconName: 'MonitorCog',
  iconColor: '#3B82F6',
  ownerId: 3001,
  userId: 3001,
  type: 0,
  isActived: true,
  joiningTime: now,
  shareStartTime: now,
  categories: [
    {
      name: '差旅费',
      type: 1,
      iconName: 'Plane',
      iconColor: '#3B82F6',
    },
    {
      name: '办公用品',
      type: 1,
      iconName: 'MonitorCloud',
      iconColor: '#60A5FA',
    },
    {
      name: '工作餐',
      type: 1,
      iconName: 'Soup',
      iconColor: '#93C5FD',
    },
    {
      name: '市内交通',
      type: 1,
      iconName: 'Bus',
      iconColor: '#BFDBFE',
    },
    {
      name: '通讯费',
      type: 1,
      iconName: 'PhoneCall',
      iconColor: '#3B82F6',
    },
    {
      name: '培训学习',
      type: 1,
      iconName: 'GraduationCap',
      iconColor: '#60A5FA',
    },
    {
      name: '团队建设',
      type: 1,
      iconName: 'UsersRound',
      iconColor: '#93C5FD',
    },
    {
      name: '办公设备',
      type: 1,
      iconName: 'MonitorCog',
      iconColor: '#BFDBFE',
    },
    {
      name: '报销款项',
      type: 1,
      iconName: 'BanknoteArrowDown',
      iconColor: '#10B981',
    },
    {
      name: '其他',
      type: 1,
      iconName: 'StickyNote',
      iconColor: '#CBD5E1',
    },
  ],
  budgets: [],
};
