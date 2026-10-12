import type { Expense } from './expense.types';

export interface Debt {
  fromUserId: number;
  fromUserName?: string;
  toUserId: number;
  toUserName?: string;
  amount: number;
}

export interface BalanceSummary {
  totalOwed: number;
  totalToReceive: number;
  netBalance: number;
  recentExpenses: Expense[];
}

export interface BalanceState {
  summary: BalanceSummary | null;
  groupDebts: Debt[];
  loading: boolean;
  error: string | null;
}