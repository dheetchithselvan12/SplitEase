export interface ExpenseSplit {
  userId: number;
  userName?: string;
  share: number;
  net: number;
}

export interface Expense {
  expenseId: number;
  groupId: number;
  groupName?: string;
  description: string;
  amount: number;
  paidByUserId: number;
  paidByName?: string;
  splits: ExpenseSplit[];
  createdAt: string;
}

export interface CreateExpenseRequest {
  groupId: number;
  description: string;
  amount: number;
  paidByUserId: number;
  participantIds: number[];
}

export interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}