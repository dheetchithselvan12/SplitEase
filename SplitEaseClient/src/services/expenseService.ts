import api, { unwrapApiArray, unwrapApiObject } from './api';
import { dashboardService } from './dashboardService';
import type { CreateExpenseRequest, Expense } from '../types/expense.types';

const normalizeExpenses = (payload: unknown): Expense[] => unwrapApiArray(payload) as Expense[];

export const expenseService = {
  getExpensesByGroup: async (groupId: number): Promise<Expense[]> => {
    const response = await api.get(`/Expense/ViewInit/${groupId}`);
    return normalizeExpenses(response.data);
  },

  createExpense: async (request: CreateExpenseRequest): Promise<Expense> => {
    const payload = {
      Expense: {
        GroupId: request.groupId,
        Description: request.description?.trim() ?? '',
        Amount: Number(request.amount),
        PaidByUserId: request.paidByUserId,
        ParticipantIds: Array.isArray(request.participantIds) ? request.participantIds : [],
      },
    };

    const response = await api.post('/Expense/Create', payload);
    const result = unwrapApiObject(response.data);
    return (result?.data ?? result?.result ?? result) as Expense;
  },

  getRecentExpenses: async (): Promise<Expense[]> => {
    const dashboard = await dashboardService.getPageInit();
    return dashboard.recentExpenses;
  },
};