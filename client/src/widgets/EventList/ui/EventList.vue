<template>
  <section class="event-list" aria-label="Список мероприятий">
    <p v-if="listState.isLoading" class="event-list__state event-list__state--loading">
      Загрузка...
    </p>

    <p v-else-if="listState.error" class="event-list__state event-list__state--error">
      Ошибка: {{ listState.error }}
    </p>

    <p v-else-if="!listState.events.length" class="event-list__state event-list__state--empty">
      {{ props.emptyMessage }}
    </p>

    <ul v-else class="event-list__grid">
      <li
        v-for="eventItem in listState.events"
        :key="eventItem.id"
        class="event-list__item"
      >
        <event-entity-card v-if="props.showTicketMeta" :event="eventItem">
          <template #meta>
            <event-card-meta
              :ticket-count="eventItem.ticketCount"
              :ticket-seats="eventItem.ticketSeats ?? []"
            />
          </template>
        </event-entity-card>

        <event-entity-card v-else :event="eventItem">
          <template #actions>
            <event-card-actions
              :event-id="eventItem.id"
              :favorite="Boolean(eventItem.favorite)"
              @add-to-favorites="handleFavoriteAction(FavoriteAction.Add, $event)"
              @remove-from-favorites="handleFavoriteAction(FavoriteAction.Remove, $event)"
              @buy-ticket="handleBuyTicket"
            />
          </template>
        </event-entity-card>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { EventCard as EventEntityCard } from '@/entities/Event';
import type { Event } from '@/entities/Event';
import { useCityStore } from '@/entities/City';
import { useSessionStore } from '@/entities/Session';
import type { FilterState } from '@/features/FilterPanel';
import { EventCardActions } from '@/features/EventCardActions';
import { EventCardMeta } from '@/features/EventCardMeta';
import { RouteName } from '@/shared/config/routeNames';
import { FavoriteAction, useEventList } from '../model/useEventList';

interface EventListItem extends Event {
  favorite?: boolean;
  ticketCount?: number;
  ticketSeats?: string[];
}

const props = withDefaults(
  defineProps<{
    activeFilters?: FilterState;
    searchQuery?: string;
    events?: EventListItem[];
    isLoading?: boolean;
    error?: string | null;
    emptyMessage?: string;
    showTicketMeta?: boolean;
  }>(),
  {
    searchQuery: '',
    isLoading: false,
    error: null,
    emptyMessage: 'Мероприятия не найдены по выбранным фильтрам',
    showTicketMeta: false,
  },
);

const router = useRouter();
const cityStore = useCityStore();
const sessionStore = useSessionStore();

const { user } = storeToRefs(sessionStore);

const {
  isLoading: localIsLoading,
  error: localError,
  events: localEvents,
  loadEvents,
  updateFavoriteIds,
} = useEventList({
  favoriteIds: () => user.value?.favorites,
});

const listState = computed<{
  isLoading: boolean;
  error: string | null;
  events: EventListItem[];
}>(() => {
  if (Array.isArray(props.events)) {
    return {
      isLoading: Boolean(props.isLoading),
      error: props.error,
      events: props.events,
    };
  }

  return {
    isLoading: localIsLoading.value,
    error: localError.value,
    events: localEvents.value as EventListItem[],
  };
});

watch(
  () => ({
    activeFilters: props.activeFilters,
    searchQuery: props.searchQuery,
    cityName: cityStore.name,
    events: props.events,
  }),
  () => {
    if (Array.isArray(props.events) || !props.activeFilters) {
      return;
    }

    void loadEvents({
      activeFilters: props.activeFilters,
      searchQuery: props.searchQuery,
      cityName: cityStore.name,
    });
  },
  { deep: true, immediate: true },
);

const handleFavoriteAction = async (
  action: FavoriteAction,
  eventId: number,
) => {
  if (!sessionStore.isAuthenticated || !sessionStore.user) {
    return;
  }

  const nextFavoriteIds = await updateFavoriteIds({
    action,
    eventId,
    currentFavoriteIds: sessionStore.user.favorites ?? [],
  });

  if (!nextFavoriteIds) {
    return;
  }

  sessionStore.user = {
    ...sessionStore.user,
    favorites: nextFavoriteIds,
  };
};

const handleBuyTicket = (eventId: number) => {
  void router.push({
    name: RouteName.BuyTicket,
    params: {
      eventId: String(eventId),
    },
  });
};
</script>

<style scoped lang="scss">
  .event-list {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 1rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    min-width: 0;
  }

  &__state {
    margin: 0;
    padding: 1rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 500;

    &--loading {
      background: #eff6ff;
      color: #1d4ed8;
    }

    &--error {
      background: #fff1f1;
      color: #b91c1c;
    }

    &--empty {
      background: #f8faff;
      color: #4b5563;
    }
  }
}
</style>
