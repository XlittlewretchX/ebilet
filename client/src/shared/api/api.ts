import axios from 'axios';
import { User, Event } from '../types';
import type { FilterState } from '@/features/Filters/filterSlice';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    city: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateCity: async (city: string) => {
    const response = await api.patch('/auth/city', { city });
    return response.data;
  },
};

export const eventAPI = {
  getAll: async (filters: Partial<FilterState> & { search?: string; city?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.subcategory) params.append('subcategory', filters.subcategory);
    if (filters.priceRange && typeof filters.priceRange === 'object') {
      if (filters.priceRange.min !== undefined) params.append('minPrice', String(filters.priceRange.min));
      if (filters.priceRange.max !== undefined) params.append('maxPrice', String(filters.priceRange.max));
    }
    if (filters.search) params.append('search', filters.search);
    if (filters.city) params.append('city', filters.city);
    // Можно добавить другие фильтры по необходимости
    const response = await api.get('/events', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  create: async (eventData: FormData) => {
    const response = await api.post('/events', eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getUserEvents: async () => {
    const response = await api.get('/events/user/events');
    return response.data;
  },
};
