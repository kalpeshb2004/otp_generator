import axios from 'axios';

const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL + '/api' });

API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

// Numbers
export const getNumbers = (params?: Record<string, unknown>) => API.get('/numbers', { params }).then(r => r.data);
export const getNumber = (id: string) => API.get(`/numbers/${id}`).then(r => r.data);
export const buyNumber = (body: Record<string, unknown>) => API.post('/numbers/buy', body).then(r => r.data);
export const cancelNumber = (id: string) => API.delete(`/numbers/${id}`).then(r => r.data);
export const getCountries = () => API.get('/numbers/countries').then(r => r.data);

// SMS
export const getNumberSMS = (id: string) => API.get(`/sms/number/${id}`).then(r => r.data);
export const getHistory = () => API.get('/sms/history').then(r => r.data);
export const getRecentSMS = () => API.get('/sms/recent').then(r => r.data);

// Auth
export const login = (body: { email: string; password: string }) => API.post('/auth/login', body).then(r => r.data);
export const register = (body: { email: string; password: string }) => API.post('/auth/register', body).then(r => r.data);
export const getMe = () => API.get('/auth/me').then(r => r.data);

// API Keys
export const getApiKeys = () => API.get('/keys').then(r => r.data);
export const createApiKey = (label: string) => API.post('/keys', { label }).then(r => r.data);
export const deleteApiKey = (id: string) => API.delete(`/keys/${id}`).then(r => r.data);
export const toggleApiKey = (id: string) => API.patch(`/keys/${id}/toggle`).then(r => r.data);

// Admin
export const getAdminStats = () => API.get('/admin/stats').then(r => r.data);
export const getAdminUsers = () => API.get('/admin/users').then(r => r.data);
export const getAdminNumbers = () => API.get('/admin/numbers').then(r => r.data);
export const updateCredits = (id: string, credits: number) => API.patch(`/admin/users/${id}/credits`, { credits }).then(r => r.data);
export const updateRole = (id: string, role: string) => API.patch(`/admin/users/${id}/role`, { role }).then(r => r.data);
