import axios from 'axios';
import { User, Event } from '../types';

const API_URL = 'https://ebilet-backend.onrender.com/api';

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
};

export const eventAPI = {
  getAll: async () => {
    const response = await api.get('/events');
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
