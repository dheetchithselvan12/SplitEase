import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { expenseService } from '../../services/expenseService';
import type { CreateExpenseRequest, ExpenseState } from '../../types/expense.types';

const normalizeExpenses = (payload: unknown) => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.expenses)) return record.expenses;
    if (Array.isArray(record.data)) return record.data;
    if (Array.isArray(record.items)) return record.items;
  }
  return [];
};

const initialState: ExpenseState = {
  expenses: [],
  loading: false,
  error: null,
};

export const fetchExpensesByGroup = createAsyncThunk(
  'expenses/fetchByGroup',
  async (groupId: number, { rejectWithValue }) => {
    try {
      return await expenseService.getExpensesByGroup(groupId);
       
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to load expenses');
    }
  }
);

export const createExpense = createAsyncThunk(
  'expenses/create',
  async (payload: CreateExpenseRequest, { rejectWithValue }) => {
    try {
      return await expenseService.createExpense(payload);
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to add expense');
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    clearExpenses: (state) => {
      state.expenses = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpensesByGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpensesByGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = normalizeExpenses(action.payload);
      })
      .addCase(fetchExpensesByGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload);
      });
  },
});

export const { clearExpenses, clearError } = expenseSlice.actions;
export default expenseSlice.reducer;