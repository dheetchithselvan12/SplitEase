import api, { unwrapApiArray } from './api';
import { dashboardService } from './dashboardService';
import type { BalanceSummary, Debt } from '../types/balance.types';

const getCurrentUserId = (): number => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return 0;

  try {
    return Number(JSON.parse(storedUser).userId ?? 0);
  } catch {
    return 0;
  }
};

const unwrapBalanceDebts = (payload: unknown): Debt[] => {
  const record = (payload && typeof payload === 'object' ? payload : {}) as Record<string, any>;
  const data = record.data ?? record.result ?? record;

  const rawDebts = Array.isArray(data?.debts)
    ? data.debts
    : Array.isArray(data?.Debt)
      ? data.Debt
      : Array.isArray(data?.Debts)
        ? data.Debts
        : unwrapApiArray(payload);

  return rawDebts.map((debt: any) => ({
    fromUserId: Number(debt.fromUserId ?? debt.FromUserId ?? 0),
    fromUserName: debt.fromUserName ?? debt.FromUserName ?? '',
    toUserId: Number(debt.toUserId ?? debt.ToUserId ?? 0),
    toUserName: debt.toUserName ?? debt.ToUserName ?? '',
    amount: Number(debt.amount ?? debt.Amount ?? 0),
  }));
};

const buildSummaryFromDebts = (debts: Debt[] = []): BalanceSummary => {
  const currentUserId = getCurrentUserId();

  const totalOwed = debts
    .filter((debt) => debt.fromUserId === currentUserId)
    .reduce((sum, debt) => sum + Number(debt.amount ?? 0), 0);

  const totalToReceive = debts
    .filter((debt) => debt.toUserId === currentUserId)
    .reduce((sum, debt) => sum + Number(debt.amount ?? 0), 0);

  return {
    totalOwed,
    totalToReceive,
    netBalance: totalToReceive - totalOwed,
    recentExpenses: [],
  };
};

export const balanceService = {
  getSummary: async (groupId?: number): Promise<BalanceSummary> => {
    if (groupId) {
      const response = await api.get(`/Balance/ViewInit/${groupId}`);
      return buildSummaryFromDebts(unwrapBalanceDebts(response.data));
    }

    return dashboardService.getPageInit();
  },

  getGroupBalances: async (groupId: number): Promise<Debt[]> => {
    const response = await api.get(`/Balance/ViewInit/${groupId}`);
    const debts = unwrapBalanceDebts(response.data);
    return debts;
  },

  getMyBalance: async (groupId: number): Promise<Debt[]> => {
    const debts = await balanceService.getGroupBalances(groupId);
    const currentUserId = getCurrentUserId();
    return debts.filter((debt) => debt.fromUserId === currentUserId || debt.toUserId === currentUserId);
  },
};