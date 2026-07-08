import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthResponse } from '../types/healthcare';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
  timeout: 8000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('healthcare.accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;
    if (message) {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}
