export interface User {
  userId: number;
  name: string;
  mobile: string;
}

export interface RegisterRequest {
  name: string;
  mobile: string;
  password: string;
}

export interface LoginRequest {
  mobile: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  mobile: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}