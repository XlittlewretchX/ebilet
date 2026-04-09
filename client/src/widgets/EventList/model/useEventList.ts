import { computed, ref } from 'vue';
import type { Event } from '@/entities/Event';
import type { FilterState } from '@/features/FilterPanel';
import { authAPI, eventAPI } from '@/shared/api/api';
import { filterEvents, normalizeEvents } from '../config/utils';

interface EventListItem extends Event {
  isFavorite?: boolean;
  isTicket?: boolean;
}

interface LoadEventsParams {
  activeFilters: FilterState;
  searchQuery?: string;
  cityName?: string;
}

export const useEventList = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const events = ref<Event[]>([]);
  const localFavoriteIds = ref<number[]>([]);

  const setFavoriteIds = (favoriteIds: number[]) => {
    localFavoriteIds.value = Array.from(new Set(favoriteIds));
  };

  const loadEvents = async ({
    activeFilters,
    searchQuery = '',
    cityName,
  }: LoadEventsParams) => {
    loading.value = true;
    error.value = null;

    try {
      const payload = await eventAPI.getAll({
        category: activeFilters.category === 'all' ? '' : activeFilters.category,
        subcategory: activeFilters.subcategory,
        priceRange: activeFilters.priceRange,
        search: searchQuery || undefined,
        city: activeFilters.onlyMyCity ? cityName : undefined,
      });

      const nextEvents = normalizeEvents(payload);
      events.value = filterEvents(nextEvents, activeFilters, searchQuery);
    } catch {
      error.value = 'Не удалось загрузить список мероприятий';
      events.value = [];
    } finally {
      loading.value = false;
    }
  };

  const eventItems = computed<EventListItem[]>(() =>
    events.value.map((event) => ({
      ...event,
      isFavorite: localFavoriteIds.value.includes(event.id),
    })),
  );

  const addToFavorites = async (eventId: number) => {
    if (localFavoriteIds.value.includes(eventId)) {
      return false;
    }

    localFavoriteIds.value = [...localFavoriteIds.value, eventId];

    try {
      await authAPI.addFavorite(eventId);
      return true;
    } catch {
      localFavoriteIds.value = localFavoriteIds.value.filter((id) => id !== eventId);
      return false;
    }
  };

  const removeFromFavorites = async (eventId: number) => {
    if (!localFavoriteIds.value.includes(eventId)) {
      return false;
    }

    const previousFavoriteIds = [...localFavoriteIds.value];
    localFavoriteIds.value = localFavoriteIds.value.filter((id) => id !== eventId);

    try {
      await authAPI.removeFavorite(eventId);
      return true;
    } catch {
      localFavoriteIds.value = previousFavoriteIds;
      return false;
    }
  };

  return {
    loading,
    error,
    events: eventItems,
    loadEvents,
    setFavoriteIds,
    addToFavorites,
    removeFromFavorites,
  };
};
