import { defineStore } from 'pinia';
import { authAPI } from '@/shared/api/api';
import type { User } from '@/shared/types';

interface SessionState {
  user: User | null;
  isChecking: boolean;
}

const extractUser = (payload: unknown): User | null => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const maybePayloadWithUser = payload as { user?: unknown };
  const source = maybePayloadWithUser.user ?? payload;

  if (!source || typeof source !== 'object') {
    return null;
  }

  const candidate = source as Partial<User>;

  if (
    typeof candidate.id !== 'number' ||
    typeof candidate.username !== 'string' ||
    typeof candidate.email !== 'string' ||
    typeof candidate.city !== 'string'
  ) {
    return null;
  }

  return {
    id: candidate.id,
    username: candidate.username,
    email: candidate.email,
    city: candidate.city,
    avatarUrl: typeof candidate.avatarUrl === 'string' ? candidate.avatarUrl : undefined,
    favorites: Array.isArray(candidate.favorites)
      ? candidate.favorites.filter((id): id is number => typeof id === 'number')
      : undefined,
  };
};

export const useSessionStore = defineStore('session', {
  state: (): SessionState => ({
    user: null,
    isChecking: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
  },
  actions: {
    clearSession() {
      localStorage.removeItem('token');
      this.user = null;
    },
    async checkSession() {
      const token = localStorage.getItem('token');

      if (!token) {
        return;
      }

      this.isChecking = true;

      try {
        const response = await authAPI.checkAuth();
        const nextUser = extractUser(response);

        if (!nextUser) {
          this.clearSession();
          return;
        }

        this.user = nextUser;
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
