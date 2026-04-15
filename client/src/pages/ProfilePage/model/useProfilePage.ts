import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useSessionStore } from '@/entities/Session';
import { authAPI } from '@/shared/api/api';
import type { Ticket } from '@/shared/types';

const DEFAULT_AVATAR_URL =
  process.env.REACT_APP_DEFAULT_AVATAR_URL || '/img/default-avatar.svg';
const apiOrigin = process.env.REACT_APP_API_URL?.replace(/\/api\/?$/, '') || '';

interface ProfileActionResult {
  ok: boolean;
  message?: string;
}

const resolveRequestError = (error: any, fallbackMessage: string): string =>
  error?.response?.data?.message || error?.message || fallbackMessage;

export const useProfilePage = () => {
  const sessionStore = useSessionStore();
  const { user } = storeToRefs(sessionStore);

  const tickets = ref<Ticket[]>([]);
  const isTicketsLoading = ref(false);
  const ticketsErrorMessage = ref('');
  const isUsernameUpdating = ref(false);
  const isAvatarUpdating = ref(false);

  const resolvedAvatarUrl = computed(() =>
    user.value?.avatarUrl
      ? `${apiOrigin}${user.value.avatarUrl}`
      : DEFAULT_AVATAR_URL,
  );

  const loadTickets = async () => {
    if (!user.value) {
      tickets.value = [];
      return;
    }

    ticketsErrorMessage.value = '';
    isTicketsLoading.value = true;

    try {
      tickets.value = await authAPI.getUserTickets();
    } catch (error) {
      ticketsErrorMessage.value = resolveRequestError(
        error,
        'Не удалось загрузить данные профиля.',
      );
    } finally {
      isTicketsLoading.value = false;
    }
  };

  const updateUsername = async (
    nextUsername: string,
  ): Promise<ProfileActionResult> => {
    if (isUsernameUpdating.value) {
      return { ok: false };
    }

    const currentUser = sessionStore.user!;
    const username = nextUsername.trim();

    if (!username) {
      return { ok: false, message: 'Имя пользователя не может быть пустым.' };
    }

    if (username === currentUser.username) {
      return {
        ok: false,
        message: 'Новое имя должно отличаться от текущего.',
      };
    }

    isUsernameUpdating.value = true;

    try {
      const response = await authAPI.updateUsername(username);

      sessionStore.user = {
        ...currentUser,
        username: response.username,
      };

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: resolveRequestError(
          error,
          'Не удалось обновить имя пользователя.',
        ),
      };
    } finally {
      isUsernameUpdating.value = false;
    }
  };

  const uploadAvatar = async (
    file: File
  ): Promise<ProfileActionResult> => {
    if (isAvatarUpdating.value) {
      return { ok: false };
    }

    const currentUser = sessionStore.user!;
    isAvatarUpdating.value = true;

    try {
      const response = await authAPI.uploadAvatar(file);

      sessionStore.user = {
        ...currentUser,
        avatarUrl: response.avatarUrl,
      };

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: resolveRequestError(error, 'Не удалось загрузить аватар.'),
      };
    } finally {
      isAvatarUpdating.value = false;
    }
  };

  const resetAvatar = async (): Promise<ProfileActionResult> => {
    if (isAvatarUpdating.value) {
      return { ok: false };
    }

    const currentUser = sessionStore.user!;
    isAvatarUpdating.value = true;

    try {
      await authAPI.resetAvatar();

      sessionStore.user = {
        ...currentUser,
        avatarUrl: undefined,
      };

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: resolveRequestError(error, 'Не удалось сбросить аватар.'),
      };
    } finally {
      isAvatarUpdating.value = false;
    }
  };

  return {
    user,
    tickets,
    isTicketsLoading,
    ticketsErrorMessage,
    resolvedAvatarUrl,
    isUsernameUpdating,
    isAvatarUpdating,
    loadTickets,
    updateUsername,
    uploadAvatar,
    resetAvatar,
  };
};
