export interface Settlement {
  settlementId: number;
  groupId: number;
  payerId: number;
  receiverId: number;
  amount: number;
  settledAt: string;
}

export interface CreateSettlementRequest {
  groupId: number;
  payerId: number;
  receiverId: number;
  amount: number;
}

export interface SettlementState {
  settlements: Settlement[];
  loading: boolean;
  error: string | null;
}