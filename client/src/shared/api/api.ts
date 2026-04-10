import axios from 'axios';
import { User, Event } from '../types';
import type { FilterState } from '@/features/FilterPanel/model/types';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  email: string;
  city: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (userData: RegisterPayload): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: LoginPayload): Promise<AuthResponse> => {
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

  resetAvatar: async () => {
    const response = await api.delete('/auth/avatar');
    return response.data;
  },

  updateCity: async (city: string) => {
    const response = await api.patch('/auth/city', { city });
    return response.data;
  },

  addFavorite: async (eventId: number) => {
    const response = await api.post('/auth/favorite', { eventId });
    return response.data;
  },

  removeFavorite: async (eventId: number) => {
    const response = await api.delete('/auth/favorite', { data: { eventId } });
    return response.data;
  },

  getFavorites: async () => {
    const response = await api.get('/auth/favorites');
    return response.data;
  },

  buyTicket: async (data: { eventId: number; seat?: string | string[] | null; name: string; phone: string; email: string }) => {
    const response = await api.post('/auth/buy-ticket', data);
    return response.data;
  },

  getUserTickets: async () => {
    const response = await api.get('/auth/my-tickets');
    return response.data;
  },

  checkAuth: async (): Promise<AuthResponse> => {
    const response = await api.get('/auth/check');
    return response.data;
  },

  updateUsername: async (username: string) => {
    const response = await api.patch('/auth/username', { username });
    return response.data;
  },
};

export const eventAPI = {
  getAll: async <T = Event[]>(
    filters: Partial<FilterState> & { search?: string; city?: string } = {},
  ): Promise<T> => {
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
    return response.data as T;
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

  getBookedSeats: async (eventId: number) => {
    const response = await api.get(`/events/${eventId}/booked-seats`);
    return response.data;
  },
};
