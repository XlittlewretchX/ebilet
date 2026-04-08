import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage/ui/HomePage.vue';
import ProfilePage from '@/pages/ProfilePage/ProfilePage.vue';
import MyTicketsPage from '@/pages/MyTicketPage/MyTicketsPage.vue';
import BuyTicketPage from '@/pages/BuyTicketPage/BuyTicketPage.vue';
import ProtectedRoute from '@/shared/ui/ProtectedRoute.vue';

export enum RouteName {
  Home = 'home',
  Profile = 'profile',
  MyTickets = 'my-tickets',
  BuyTicket = 'buy-ticket',
}

const base = process.env.NODE_ENV === 'production' ? '/ebilet/' : '/';

const router = createRouter({
  history: createWebHistory(base),
  routes: [
    {
      path: '/',
      name: RouteName.Home,
      component: HomePage,
    },
    {
      path: '/profile',
      component: ProtectedRoute,
      children: [
        {
          path: '',
          name: RouteName.Profile,
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
          name: RouteName.MyTickets,
          component: MyTicketsPage,
        },
      ],
    },
    {
      path: '/buy/:eventId',
      name: RouteName.BuyTicket,
      component: BuyTicketPage,
    },
  ],
});

export default router;
