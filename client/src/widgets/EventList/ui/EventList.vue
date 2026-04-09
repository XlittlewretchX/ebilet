<template>
  <section class="event-list" aria-label="Список мероприятий">
    <p v-if="loading" class="event-list__state event-list__state--loading">
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
        <EventEntityCard :event="eventItem">
          <template #actions>
            <EventCardActions
              :event-id="eventItem.id"
              :is-favorite="Boolean(eventItem.isFavorite)"
              :is-ticket="Boolean(eventItem.isTicket)"
              @add-to-favorites="handleAddToFavorites"
              @remove-from-favorites="handleRemoveFromFavorites"
              @buy-ticket="handleBuyTicket"
            />
          </template>
        </EventEntityCard>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, toRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { EventCard as EventEntityCard } from '@/entities/Event';
import { useCityStore } from '@/entities/City';
import { useSessionStore } from '@/entities/Session';
import type { FilterState } from '@/features/FilterPanel';
import { EventCardActions } from '@/features/EventCardActions';
import { useEventList } from '../model/useEventList';

const props = withDefaults(
  defineProps<{
    activeFilters: FilterState;
    searchQuery?: string;
  }>(),
  {
    searchQuery: '',
  },
);

const activeFilters = toRef(props, 'activeFilters');
const searchQuery = computed(() => props.searchQuery);
const router = useRouter();
const cityStore = useCityStore();
const sessionStore = useSessionStore();

const { user } = storeToRefs(sessionStore);

const {
  loading,
  error,
  events,
  loadEvents,
  setFavoriteIds,
  addToFavorites,
  removeFromFavorites,
} = useEventList();

watch(
  () => [
    activeFilters.value.category,
    activeFilters.value.subcategory,
    activeFilters.value.dateRange.start,
    activeFilters.value.dateRange.end,
    activeFilters.value.priceRange.min,
    activeFilters.value.priceRange.max,
    activeFilters.value.onlyMyCity,
    searchQuery.value,
    cityStore.name,
  ],
  () => {
    void loadEvents({
      activeFilters: activeFilters.value,
      searchQuery: searchQuery.value,
      cityName: cityStore.name,
    });
  },
  { immediate: true },
);

watch(
  () => user.value?.favorites,
  (favoriteIds) => {
    setFavoriteIds(favoriteIds ?? []);
  },
  { immediate: true },
);

const handleAddToFavorites = async (eventId: number) => {
  if (!sessionStore.isAuthenticated) {
    return;
  }

  const isAdded = await addToFavorites(eventId);
  if (!isAdded || !sessionStore.user) {
    return;
  }

  const existingFavorites = sessionStore.user.favorites ?? [];
  sessionStore.user = {
    ...sessionStore.user,
    favorites: Array.from(new Set([...existingFavorites, eventId])),
  };
};

const handleRemoveFromFavorites = async (eventId: number) => {
  if (!sessionStore.isAuthenticated) {
    return;
  }

  const isRemoved = await removeFromFavorites(eventId);
  if (!isRemoved || !sessionStore.user) {
    return;
  }

  sessionStore.user = {
    ...sessionStore.user,
    favorites: (sessionStore.user.favorites ?? []).filter((id) => id !== eventId),
  };
};

const handleBuyTicket = (eventId: number) => {
  void router.push(`/buy/${eventId}`);
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
