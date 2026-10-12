import api, { unwrapApiObject } from './api';
import type { BalanceSummary } from '../types/balance.types';

export const dashboardService = {
  getPageInit: async (): Promise<BalanceSummary> => {
    const response = await api.get('/Dashboard/PageInit');
    const payload = unwrapApiObject(response.data);
    const dashboard = payload.data ?? payload.result ?? payload;
    const summary = dashboard.summary ?? dashboard.Summary ?? {};
    const recentExpenses = Array.isArray(dashboard.recentExpenses)
      ? dashboard.recentExpenses
      : Array.isArray(dashboard.RecentExpenses)
        ? dashboard.RecentExpenses
        : [];

    return {
      totalOwed: Number(summary.totalOwed ?? summary.TotalOwed ?? 0),
      totalToReceive: Number(summary.totalToReceive ?? summary.TotalToReceive ?? 0),
      netBalance: Number(summary.netBalance ?? summary.NetBalance ?? 0),
      recentExpenses,
    };
  },
};
