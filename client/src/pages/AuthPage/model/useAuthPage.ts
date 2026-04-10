import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '@/entities/Session';
import { RouteName } from '@/shared/config/routeNames';
import type { AuthMode } from '@/features/AuthForm/model/useAuthForm';

const resolveRedirectName = (queryName?: string) => {
  if (queryName === RouteName.BuyTicket) {
    return RouteName.BuyTicket;
  }

  if (queryName === RouteName.Profile) {
    return RouteName.Profile;
  }

  return RouteName.MyTickets;
};

export const useAuthPage = () => {
  const route = useRoute();
  const router = useRouter();
  const sessionStore = useSessionStore();
  const { isChecking } = storeToRefs(sessionStore);

  const initialMode = computed<AuthMode>(() => {
    const mode = route.query.mode;
    return mode === 'register' ? 'register' : 'login';
  });

  const redirectName = computed(() => {
    const queryValue = route.query['redirect-name'];
    const queryName = typeof queryValue === 'string' ? queryValue : undefined;
    return resolveRedirectName(queryName);
  });

  const redirectParams = computed<Record<string, string>>(() => {
    const params: Record<string, string> = {};

    if (redirectName.value !== RouteName.BuyTicket) {
      return params;
    }

    const eventId = route.query['redirect-event-id'];
    if (typeof eventId !== 'string' || !eventId) {
      return params;
    }

    params.eventId = eventId;
    return params;
  });

  const formKey = computed(
    () =>
      `${initialMode.value}:${redirectName.value}:${redirectParams.value.eventId ?? ''}`,
  );

  watch(
    [() => sessionStore.isAuthenticated, isChecking],
    async ([authenticated, checking]) => {
      if (checking || !authenticated) {
        return;
      }

      await router.replace({
        name: redirectName.value,
        params: redirectParams.value,
      });
    },
    { immediate: true },
  );

  return {
    initialMode,
    redirectName,
    redirectParams,
    formKey,
  };
};
