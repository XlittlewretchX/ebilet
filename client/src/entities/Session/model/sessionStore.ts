import { defineStore } from 'pinia';
import { authAPI } from '@/shared/api/api';
import type { User } from '@/shared/types';

interface LoginPayload {
  username: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  email: string;
  city: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface SessionState {
  user: User | null;
  isChecking: boolean;
  isSubmitting: boolean;
}

export const useSessionStore = defineStore('session', {
  state: (): SessionState => ({
    user: null,
    isChecking: false,
    isSubmitting: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
  },
  actions: {
    clearSession() {
      localStorage.removeItem('token');
      this.user = null;
      this.isSubmitting = false;
    },
    async login(credentials: LoginPayload): Promise<string | null> {
      this.isSubmitting = true;

      try {
        const response = await authAPI.login(credentials) as AuthResponse;

        localStorage.setItem('token', response.token);
        this.user = response.user;

        return null;
      } catch (error: any) {
        return error?.response?.data?.message || error?.message || 'Ошибка при входе';
      } finally {
        this.isSubmitting = false;
      }
    },
    async register(userData: RegisterPayload): Promise<string | null> {
      this.isSubmitting = true;

      try {
        const response = await authAPI.register(userData) as AuthResponse;

        localStorage.setItem('token', response.token);
        this.user = response.user;

        return null;
      } catch (error: any) {
        return error?.response?.data?.message || error?.message || 'Ошибка при регистрации';
      } finally {
        this.isSubmitting = false;
      }
    },
    async checkSession() {
      if (this.isChecking) {
        return;
      }

      const token = localStorage.getItem('token');

      if (!token) {
        this.user = null;
        return;
      }

      this.isChecking = true;

      try {
        const response = await authAPI.checkAuth() as AuthResponse;
        localStorage.setItem('token', response.token);
        this.user = response.user;
      } catch {
        this.clearSession();
      } finally {
        this.isChecking = false;
      }
    },
    logout() {
      this.clearSession();
    },
  },
});
