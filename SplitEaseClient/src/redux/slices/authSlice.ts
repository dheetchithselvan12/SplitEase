import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import type { AuthState, AuthResponse, LoginRequest, RegisterRequest, User } from '../../types/auth.types';

const readLocalStorageItem = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;

  try {
    const value = localStorage.getItem(key);
    if (!value) return null;

    if (key === 'token') return value as T;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage`, error);
    return null;
  }
};

const persistAuth = (token: string | null, user: User | null) => {
  if (typeof window === 'undefined') return;

  try {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  } catch (error) {
    console.error('Failed to persist auth data to localStorage', error);
  }
};

const storedUser = readLocalStorageItem<User>('user');
const storedToken = readLocalStorageItem<string>('token');

const initialState: AuthState = {
  user: storedUser,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      return await authService.register(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      return await authService.login(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      authService.logout();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, _action: PayloadAction<User>) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const payload = (((action.payload as any)?.data ?? action.payload) as Partial<AuthResponse> & {
          user?: Partial<User>;
          data?: Partial<AuthResponse>;
          accessToken?: string;
          jwt?: string;
          [key: string]: any;
        });

        const token =
          payload.token ??
          payload.accessToken ??
          payload.jwt ??
          payload.data?.token ??
          null;

        const user = payload.user
          ? {
              userId: payload.user.userId ?? payload.userId ?? 0,
              name: payload.user.name ?? payload.name ?? '',
              mobile: payload.user.mobile ?? payload.mobile ?? '',
            }
          : {
              userId: payload.userId ?? 0,
              name: payload.name ?? '',
              mobile: payload.mobile ?? '',
            };

        state.loading = false;

        if (!token) {
          state.isAuthenticated = false;
          state.token = null;
          state.user = null;
          persistAuth(null, null);
          state.error = 'Login response did not include a token';
          return;
        }

        state.isAuthenticated = true;
        state.token = token;
        state.user = user;
        persistAuth(token, user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;