import api from './api';
import type { CreateSettlementRequest, Settlement } from '../types/settlement.types';

export const settlementService = {
  createSettlement: async (data: CreateSettlementRequest): Promise<Settlement> => {
    const response = await api.post('/Settlement/Create', data);
    return response.data;
  },

  getSettlementsByGroup: async (groupId: number): Promise<Settlement[]> => {
    const response = await api.get(`/Settlement/ViewInit/${groupId}`);
    return response.data;
  },
};