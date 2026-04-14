<template>
  <main class="my-tickets-page" aria-labelledby="my-tickets-page-title">
    <section class="my-tickets-page__container">
      <header class="my-tickets-page__header">
        <h1 id="my-tickets-page-title" class="my-tickets-page__title">
          Мои события
        </h1>
        <p class="my-tickets-page__description">
          Управляйте купленными билетами и избранными мероприятиями.
        </p>
      </header>

      <nav class="my-tickets-page__tabs" aria-label="Разделы моих событий">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          :class="[
            'my-tickets-page__tab-button',
            {
              'my-tickets-page__tab-button--active': activeTab === tab.id,
            },
          ]"
          :aria-pressed="activeTab === tab.id"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <span class="my-tickets-page__tab-count">{{ tab.count }}</span>
        </button>
      </nav>

      <section class="my-tickets-page__content" :aria-busy="isLoading">
        <p
          v-if="isLoading"
          class="my-tickets-page__state my-tickets-page__state--loading"
        >
          Загружаем ваши события...
        </p>

        <p
          v-else-if="errorMessage"
          class="my-tickets-page__state my-tickets-page__state--error"
          role="alert"
        >
          {{ errorMessage }}
        </p>

        <section
          v-else
          class="my-tickets-page__section"
          :aria-label="currentTabContent.ariaLabel"
        >
          <event-list
            :events="currentTabContent.events"
            :show-ticket-meta="currentTabContent.showTicketMeta"
            :empty-message="currentTabContent.emptyMessage"
          />
        </section>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import type { Event } from '@/entities/Event';
import { useSessionStore } from '@/entities/Session';
import { authAPI } from '@/shared/api/api';
import { EventList } from '@/widgets/EventList';

const MY_TICKETS_TABS = [
  {
    id: 'tickets',
    label: 'Мои билеты',
    emptyMessage: 'У вас пока нет купленных билетов.',
    ariaLabel: 'Купленные билеты',
    showTicketMeta: true,
  },
  {
    id: 'favorites',
    label: 'Избранное',
    emptyMessage: 'У вас пока нет избранных событий.',
    ariaLabel: 'Избранные события',
    showTicketMeta: false,
  },
] as const;

interface UserTicketResponse {
  eventId: number;
  seat: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  imageUrl?: string;
  category: string;
  userId: number;
}

interface MyTicketsEventListItem extends Event {
  favorite?: boolean;
  ticketCount?: number;
  ticketSeats?: string[];
}

const route = useRoute();
const buildTicketEventListItems = (
  tickets: UserTicketResponse[],
): MyTicketsEventListItem[] => {
  const groupedTickets = Object.groupBy(
    tickets,
    (ticket) => String(ticket.eventId),
  ) as Record<string, UserTicketResponse[]>;

  return Object.keys(groupedTickets).map((eventId) => {
    const eventTickets = groupedTickets[eventId];
    const firstTicket = eventTickets[0];

    return {
      id: firstTicket.eventId,
      title: firstTicket.title,
      description: firstTicket.description,
      date: firstTicket.date,
      location: firstTicket.location,
      price: firstTicket.price,
      imageUrl: firstTicket.imageUrl,
      category: firstTicket.category,
      userId: firstTicket.userId,
      ticketCount: eventTickets.length,
      ticketSeats: eventTickets.map((ticket) => ticket.seat),
    };
  });
};

const buildFavoriteEventListItems = (
  favorites: Event[],
): MyTicketsEventListItem[] =>
  favorites.map((event) => ({
    ...event,
    favorite: true,
  }));

const resolveRequestError = (error: unknown, fallbackMessage: string): string => {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

const sessionStore = useSessionStore();
const { user } = storeToRefs(sessionStore);

const resolveTabId = (queryTab: unknown): (typeof MY_TICKETS_TABS)[number]['id'] => (
  queryTab === 'favorites' ? 'favorites' : 'tickets'
);

const activeTab = ref<(typeof MY_TICKETS_TABS)[number]['id']>(
  resolveTabId(route.query.tab),
);
const isLoading = ref(false);
const errorMessage = ref('');

const ticketEventsForList = ref<MyTicketsEventListItem[]>([]);
const favoriteEvents = ref<Event[]>([]);

const syncFavoriteIdsToSession = (events: Event[]) => {
  if (!sessionStore.user) {
    return;
  }

  sessionStore.user = {
    ...sessionStore.user,
    favorites: events.map((event) => event.id),
  };
};

const loadTabData = async (tab: string) => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    if (tab === 'tickets') {
      const response = await authAPI.getUserTickets();
      ticketEventsForList.value = buildTicketEventListItems(
        response as UserTicketResponse[],
      );
    } else {
      const response = await authAPI.getFavorites();
      favoriteEvents.value = response as Event[];
      syncFavoriteIdsToSession(response as Event[]);
    }
  } catch (error) {
    errorMessage.value = resolveRequestError(error, 'Не удалось загрузить данные');
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => route.query.tab,
  (queryTab) => {
    const nextTab = resolveTabId(queryTab);

    if (nextTab !== activeTab.value) {
      activeTab.value = nextTab;
    }
  },
);

watch(
  activeTab,
  (tab) => {
    void loadTabData(tab);
  },
  { immediate: true },
);

const favoriteEventsForList = computed<MyTicketsEventListItem[]>(() => {
  const favoriteIds = user.value?.favorites;

  if (!Array.isArray(favoriteIds)) {
    return buildFavoriteEventListItems(favoriteEvents.value);
  }

  const filteredFavorites = favoriteEvents.value.filter((event) =>
    favoriteIds.includes(event.id),
  );

  return buildFavoriteEventListItems(filteredFavorites);
});

const currentTabContent = computed(() => {
  const selectedTab =
    MY_TICKETS_TABS.find((tab) => tab.id === activeTab.value) ?? MY_TICKETS_TABS[0];

  return {
    ...selectedTab,
    events:
      selectedTab.id === 'tickets'
        ? ticketEventsForList.value
        : favoriteEventsForList.value,
  };
});

const tabs = computed(() => [
  ...MY_TICKETS_TABS.map((tab) => ({
    ...tab,
    count: tab.id === 'tickets'
      ? ticketEventsForList.value.length
      : favoriteEventsForList.value.length,
  })),
]);
</script>

<style scoped lang="scss">
.my-tickets-page {
  min-height: calc(100vh - 72px);
  padding: 1.5rem 1rem 2rem;
  background: linear-gradient(180deg, #f7faff 0%, #ffffff 100%);

  &__container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  &__header {
    margin-bottom: 1.25rem;
  }

  &__title {
    margin: 0;
    color: #111827;
    font-size: 2rem;
    line-height: 1.1;
    font-weight: 700;
  }

  &__description {
    margin: 0.5rem 0 0;
    color: #4b5563;
    font-size: 1rem;
  }

  &__tabs {
    display: flex;
    align-items: stretch;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  &__tab-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: 1px solid #dbe7ff;
    border-radius: 12px;
    background: #ffffff;
    color: #1d4ed8;
    padding: 0.6rem 1rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      background: #eff6ff;
      border-color: #bfdbfe;
    }

    &--active {
      background: #1d4ed8;
      border-color: #1d4ed8;
      color: #ffffff;
    }
  }

  &__tab-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    height: 1.5rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.18);
    font-size: 0.78rem;
    font-weight: 700;
  }

  &__content {
    min-height: 12rem;
  }

  &__section {
    display: block;
  }

  &__state {
    margin: 0;
    border-radius: 12px;
    padding: 1rem;
    font-size: 0.98rem;
    font-weight: 500;

    &--loading {
      background: #eff6ff;
      color: #1d4ed8;
    }

    &--error {
      background: #fff1f1;
      color: #b91c1c;
    }
  }
}

@media (max-width: 960px) {
  .my-tickets-page {
    padding: 1rem 0.75rem 1.5rem;

    &__title {
      font-size: 1.7rem;
    }
  }
}

@media (max-width: 640px) {
  .my-tickets-page {
    padding: 0.8rem 0.5rem 1rem;

    &__tabs {
      flex-direction: column;
      gap: 0.5rem;
    }

    &__tab-button {
      justify-content: space-between;
      width: 100%;
    }

    &__title {
      font-size: 1.45rem;
    }
  }
}
</style>
