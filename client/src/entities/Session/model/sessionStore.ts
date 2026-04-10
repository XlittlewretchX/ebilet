import { defineStore } from 'pinia';
import type { LoginPayload, RegisterPayload } from '@/shared/api/api';
import { authAPI } from '@/shared/api/api';
import type { User } from '@/shared/types';

interface SessionState {
  user: User | null;
  isChecking: boolean;
  isSubmitting: boolean;
}

interface AuthResult {
  success: boolean;
  errorMessage?: string;
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
    async login(credentials: LoginPayload): Promise<AuthResult> {
      this.isSubmitting = true;

      try {
        const response = await authAPI.login(credentials);

        localStorage.setItem('token', response.token);
        this.user = response.user;

        return {
          success: true,
        };
      } catch (error: any) {
        return {
          success: false,
          errorMessage:
            error?.response?.data?.message || error?.message || 'Ошибка при входе',
        };
      } finally {
        this.isSubmitting = false;
      }
    },
    async register(userData: RegisterPayload): Promise<AuthResult> {
      this.isSubmitting = true;

      try {
        const response = await authAPI.register(userData);

        localStorage.setItem('token', response.token);
        this.user = response.user;

        return {
          success: true,
        };
      } catch (error: any) {
        return {
          success: false,
          errorMessage:
            error?.response?.data?.message || error?.message || 'Ошибка при регистрации',
        };
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
        const response = await authAPI.checkAuth();
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
