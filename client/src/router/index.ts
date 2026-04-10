import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
import ProfilePage from '@/pages/ProfilePage/ProfilePage.vue';
import MyTicketsPage from '@/pages/MyTicketPage/MyTicketsPage.vue';
import BuyTicketPage from '@/pages/BuyTicketPage/BuyTicketPage.vue';
import { useSessionStore } from '@/entities/Session';
import { RouteName } from '@/shared/config/routeNames';

const base = process.env.NODE_ENV === 'production' ? '/ebilet/' : '/';

const resolveRedirectName = (routeName: string | symbol | null | undefined): RouteName => {
  if (routeName === RouteName.BuyTicket || routeName === RouteName.Profile) {
    return routeName;
  }

  return RouteName.MyTickets;
};

const router = createRouter({
  history: createWebHistory(base),
  routes: [
    {
      path: '/',
      name: RouteName.Home,
      component: HomePage,
    },
    {
      path: '/auth',
      name: RouteName.Auth,
      component: AuthPage,
    },
    {
      path: '/profile',
      name: RouteName.Profile,
      component: ProfilePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/my-tickets',
      name: RouteName.MyTickets,
      component: MyTicketsPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/buy/:eventId',
      name: RouteName.BuyTicket,
      component: BuyTicketPage,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) {
    return true;
  }

  const sessionStore = useSessionStore();
  const hasToken = Boolean(localStorage.getItem('token'));

  if (!sessionStore.user && hasToken && !sessionStore.isChecking) {
    await sessionStore.checkSession();
  }

  if (sessionStore.isAuthenticated) {
    return true;
  }

  const redirectName = resolveRedirectName(to.name);
  const redirectQuery: Record<string, string> = {
    'redirect-name': redirectName,
  };

  if (redirectName === RouteName.BuyTicket && typeof to.params.eventId === 'string') {
    redirectQuery['redirect-event-id'] = to.params.eventId;
  }

  return {
    name: RouteName.Auth,
    params: {},
    query: redirectQuery,
  };
});

export default router;
