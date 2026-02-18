import { useState, useMemo, useEffect } from 'react';
import { ledgerInfoService } from '@/services';
import type { LedgerPick, LedgerInfo } from '@/types';

export const useLedgerInfo = (userId: number) => {
  const [ledgerInfo, setLedgerInfo] = useState<LedgerInfo>();

  useEffect(() => {
    if (ledgerInfo && ledgerInfo.id) {
      ledgerInfoService.save(ledgerInfo);
    }
  }, [ledgerInfo]);

  // ---------------------------------------------------------
  // 计算属性 (useMemo)
  // ---------------------------------------------------------
  const ledgerId = useMemo(() => ledgerInfo?.id || 0, [ledgerInfo]);

  // ---------------------------------------------------------
  // 业务操作方法 (Action)
  // ---------------------------------------------------------
  const updateLedgerInfo = (updates: Partial<Pick<LedgerInfo, LedgerPick>>) => {
    setLedgerInfo(prev => (prev ? { ...prev, ...updates } : prev));
  };

  useEffect(() => {
    ledgerInfoService
      .get(userId)
      .then(res => {
        if (res) {
          setLedgerInfo(res.ledgerInfo);
        } else {
          setLedgerInfo(undefined);
        }
      })
      .catch(err => {
        console.error('获取账本数据失败', err);
        setLedgerInfo(undefined);
      });
  }, [userId]);

  return {
    ledgerId,
    ledgerInfo,
    updateLedgerInfo,
  };
};
