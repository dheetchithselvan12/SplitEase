import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const isPublicAuthRequest = (url?: string) =>
  url === '/Auth/Register' || url === '/Auth/Login';

export const unwrapApiArray = (payload: unknown): any[] => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  const record = payload as Record<string, any>;

  const directCandidates = [
    record.data,
    record.Data,
    record.result,
    record.Result,
    record.items,
    record.groups,
    record.Groups,
    record.groupList,
    record.GroupList,
    record.expenses,
    record.Expenses,
    record.expenseList,
    record.ExpenseList,
    record.list,
    record.value,
    record.records,
  ];

  for (const candidate of directCandidates) {
    if (Array.isArray(candidate)) return candidate;
    if (candidate && typeof candidate === 'object') {
      const unwrapped = unwrapApiArray(candidate);
      if (unwrapped.length > 0) return unwrapped;
    }
  }

  for (const value of Object.values(record)) {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
      const unwrapped = unwrapApiArray(value);
      if (unwrapped.length > 0) return unwrapped;
    }
  }

  const nestedObjectCandidates = [record.group, record.data?.group, record.result?.group];
  for (const candidate of nestedObjectCandidates) {
    const unwrapped = unwrapApiArray(candidate);
    if (unwrapped.length > 0) return unwrapped;
  }

  return [];
};

export const unwrapApiObject = (payload: unknown): Record<string, any> => {
  if (!payload || typeof payload !== 'object') return {};

  const record = payload as Record<string, any>;
  const nested = [
    record.data,
    record.Data,
    record.result,
    record.Result,
    record.group,
    record.Group,
    record.groupDetail,
    record.GroupDetail,
    record.groupMembers,
    record.GroupMembers,
  ];

  for (const candidate of nested) {
    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
      return { ...candidate, ...record };
    }
  }

  return record;
};

// Request interceptor - attach token to protected endpoints only
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !isPublicAuthRequest(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isPublicAuthRequest(error.config?.url)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
