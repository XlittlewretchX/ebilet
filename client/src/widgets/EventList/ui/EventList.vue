<template>
  <section class="event-list" aria-label="Список мероприятий">
    <p v-if="isLoading" class="event-list__state event-list__state--loading">
      Загрузка...
    </p>

    <p v-else-if="error" class="event-list__state event-list__state--error">
      Ошибка: {{ error }}
    </p>

    <p v-else-if="!events.length" class="event-list__state event-list__state--empty">
      Мероприятия не найдены по выбранным фильтрам
    </p>

    <ul v-else class="event-list__grid">
      <li
        v-for="eventItem in events"
        :key="eventItem.id"
        class="event-list__item"
      >
        <event-entity-card :event="eventItem">
          <template #actions>
            <event-card-actions
              :event-id="eventItem.id"
              :favorite="Boolean(eventItem.favorite)"
              :ticket="Boolean(eventItem.ticket)"
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
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { EventCard as EventEntityCard } from '@/entities/Event';
import { useCityStore } from '@/entities/City';
import { useSessionStore } from '@/entities/Session';
import type { FilterState } from '@/features/FilterPanel';
import { EventCardActions } from '@/features/EventCardActions';
import { RouteName } from '@/router';
import { FavoriteAction, useEventList } from '../model/useEventList';

const props = withDefaults(
  defineProps<{
    activeFilters: FilterState;
    searchQuery?: string;
  }>(),
  {
    searchQuery: '',
  },
);

const router = useRouter();
const cityStore = useCityStore();
const sessionStore = useSessionStore();

const { user } = storeToRefs(sessionStore);

const {
  isLoading,
  error,
  events,
  loadEvents,
  updateFavoriteIds,
} = useEventList({
  favoriteIds: () => user.value?.favorites,
});

watch(
  () => ({
    activeFilters: props.activeFilters,
    searchQuery: props.searchQuery,
    cityName: cityStore.name,
  }),
  () => {
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
