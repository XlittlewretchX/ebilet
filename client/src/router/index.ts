import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage/ui/HomePage.vue';
import ProfilePage from '@/pages/ProfilePage/ProfilePage.vue';
import MyTicketsPage from '@/pages/MyTicketPage/MyTicketsPage.vue';
import BuyTicketPage from '@/pages/BuyTicketPage/BuyTicketPage.vue';
import ProtectedRoute from '@/shared/ui/ProtectedRoute.vue';

const base = process.env.NODE_ENV === 'production' ? '/ebilet/' : '/';

const router = createRouter({
  history: createWebHistory(base),
  routes: [
    {
      path: '/',
      component: HomePage,
    },
    {
      path: '/profile',
      component: ProtectedRoute,
      children: [
        {
          path: '',
          component: ProfilePage,
        },
      ],
    },
    {
      path: '/my-tickets',
      component: ProtectedRoute,
      children: [
        {
          path: '',
          component: MyTicketsPage,
        },
      ],
    },
    {
      path: '/buy/:eventId',
      component: BuyTicketPage,
    },
  ],
});

export default router;
