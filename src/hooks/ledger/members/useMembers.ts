import { useState, useEffect } from 'react';
import { ledgerSharingMembersService } from '@/services/ledger-api';
import { LedgerSharingMember } from '@/types';

export const useLedgerSharingMember = (ledgerId: number) => {
  const [ledgerSharingMembers, setLedgerSharingMembers] = useState<LedgerSharingMember[]>([]);

  const fetchData = async () => {
    const fetchedUser = await ledgerSharingMembersService.getByLedgerId(ledgerId);
    setLedgerSharingMembers(fetchedUser);
  };

  const updateLedgerSharingMember = (
    id: number,
    updates: Partial<Pick<LedgerSharingMember, 'nickname' | 'avatar' | 'isSharing'>>
  ) => {
    setLedgerSharingMembers(prev =>
      prev?.map(member =>
        member.id !== id
          ? member
          : {
              ...member,
              ...updates,
              updatedAt: new Date(),
            }
      )
    );
  };

  const addLedgerSharingMember = (id: number, nickname: string, avatar: string, isSharing: boolean, joinTime: Date) => {
    const updated = {
      id: id,
      nickname: nickname,
      avatar: avatar,
      isSharing: isSharing,
      joinTime: joinTime,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };

    setLedgerSharingMembers(prev => [...(prev || []), updated]);
  };

  // 专门用于逻辑删除（不修改其他字段）
  const deleteLedgerSharingMember = (id: number) => {
    setLedgerSharingMembers(
      prev =>
        prev.map(member => (member.id === id ? { ...member, isDeleted: true, updatedAt: new Date() } : member)) || []
    );
  };

  useEffect(() => {
    fetchData();
  }, [ledgerId]);
  return {
    ledgerSharingMembers,
    setLedgerSharingMembers,
    updateLedgerSharingMember,
    addLedgerSharingMember,
    deleteLedgerSharingMember,
  };
};
