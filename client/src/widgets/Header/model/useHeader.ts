import { storeToRefs } from 'pinia';
import { useSessionStore } from '@/entities/Session';

export const useHeader = () => {
  const sessionStore = useSessionStore();
  const { user, isChecking: isAuthChecking, isAuthenticated } = storeToRefs(sessionStore);

  const logout = () => {
    sessionStore.logout();
  };

  return {
    user,
    isAuthChecking,
    isAuthenticated,
    logout,
  };
};
