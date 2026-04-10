import { storeToRefs } from 'pinia';
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '@/entities/Session';
import { RouteName } from '@/shared/config/routeNames';

const resolveCurrentRouteName = (routeName?: string | symbol) => {
  if (routeName === RouteName.BuyTicket) {
    return RouteName.BuyTicket;
  }

  if (routeName === RouteName.Profile) {
    return RouteName.Profile;
  }

  return RouteName.MyTickets;
};

export const useProtectedRouteGuard = () => {
  const sessionStore = useSessionStore();
  const { isChecking, user } = storeToRefs(sessionStore);

  const route = useRoute();
  const router = useRouter();

  const hasToken = computed(() => Boolean(localStorage.getItem('token')));
  const guardLoading = computed(
    () => isChecking.value || (hasToken.value && !user.value),
  );

  const redirectToAuth = async () => {
    const redirectName = resolveCurrentRouteName(route.name);
    const redirectQuery: Record<string, string> = {
      'redirect-name': redirectName,
    };

    if (redirectName === RouteName.BuyTicket && typeof route.params.eventId === 'string') {
      redirectQuery['redirect-event-id'] = route.params.eventId;
    }

    await router.replace({
      name: RouteName.Auth,
      params: {},
      query: redirectQuery,
    });
  };

  onMounted(async () => {
    if (!user.value && hasToken.value && !isChecking.value) {
      await sessionStore.checkSession();
    }

    if (!sessionStore.isAuthenticated) {
      await redirectToAuth();
    }
  });

  watch(
    [() => sessionStore.isAuthenticated, isChecking],
    async ([authenticated, checking]) => {
      if (checking || authenticated) {
        return;
      }

      await redirectToAuth();
    },
  );

  return guardLoading;
};
