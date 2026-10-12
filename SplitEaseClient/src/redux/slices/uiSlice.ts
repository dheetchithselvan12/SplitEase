import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail: string;
}

interface UIState {
  sidebarOpen: boolean;
  toast: Toast | null;
}

const initialState: UIState = {
  sidebarOpen: false,
  toast: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    showToast: (state, action: PayloadAction<Toast>) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },
});

export const { toggleSidebar, showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;