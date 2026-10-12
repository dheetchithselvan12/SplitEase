import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth.types';

export const authService = {
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post('/Auth/Register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/Auth/Login', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};