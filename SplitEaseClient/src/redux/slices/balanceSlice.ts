import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { balanceService } from '../../services/balanceService';
import type { BalanceState } from '../../types/balance.types';

const initialState: BalanceState = {
  summary: null,
  groupDebts: [],
  loading: false,
  error: null,
};

export const fetchBalanceSummary = createAsyncThunk(
  'balances/fetchSummary',
  async (groupId?: number, thunkApi: any = {}) => {
    const { rejectWithValue } = thunkApi;

    try {
      return await balanceService.getSummary(groupId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch balances');
    }
  }
);

export const fetchGroupBalances = createAsyncThunk(
  'balances/fetchGroup',
  async (groupId: number, { rejectWithValue }) => {
    try {
      return await balanceService.getGroupBalances(groupId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch group balances');
    }
  }
);

const balanceSlice = createSlice({
  name: 'balances',
  initialState,
  reducers: {
    clearBalances: (state) => {
      state.summary = null;
      state.groupDebts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalanceSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalanceSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchBalanceSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchGroupBalances.fulfilled, (state, action) => {
        state.groupDebts = action.payload;
      });
  },
});

export const { clearBalances } = balanceSlice.actions;
export default balanceSlice.reducer;