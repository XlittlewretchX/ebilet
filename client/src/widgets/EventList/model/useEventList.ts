import { computed, ref, watch } from 'vue';
import type { WatchSource } from 'vue';
import type { Event } from '@/entities/Event';
import type { FilterState } from '@/features/FilterPanel';
import { authAPI, eventAPI } from '@/shared/api/api';
import {
  filterEvents,
  normalizeEvents,
} from '../config/utils';

interface EventListItem extends Event {
  favorite?: boolean;
}

interface LoadEventsParams {
  activeFilters: FilterState;
  searchQuery?: string;
  cityName?: string;
}

interface UseEventListOptions {
  favoriteIds?: WatchSource<number[] | undefined>;
}

export enum FavoriteAction {
  Add = 'add',
  Remove = 'remove',
}

interface UpdateFavoriteIdsParams {
  action: FavoriteAction;
  eventId: number;
  currentFavoriteIds: number[];
}

export const useEventList = ({ favoriteIds }: UseEventListOptions = {}) => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const events = ref<Event[]>([]);
  const localFavoriteIds = ref<number[]>([]);

  const syncFavoriteIds = (nextFavoriteIds: number[] = []) => {
    localFavoriteIds.value = Array.from(new Set(nextFavoriteIds));
  };

  if (favoriteIds) {
    watch(
      favoriteIds,
      (nextFavoriteIds) => {
        syncFavoriteIds(nextFavoriteIds ?? []);
      },
      { immediate: true },
    );
  }

  const eventsWithFavoriteState = computed<EventListItem[]>(() =>
    events.value.map((event) => {
      const eventWithMeta = event as Event & {
        favorite?: boolean;
        isFavorite?: boolean;
      };

      return {
        ...event,
        favorite:
          localFavoriteIds.value.includes(event.id) ||
          Boolean(eventWithMeta.favorite ?? eventWithMeta.isFavorite),
      };
    }),
  );

  const updateFavoriteIds = async ({
    action,
    eventId,
    currentFavoriteIds,
  }: UpdateFavoriteIdsParams): Promise<number[] | null> => {
    const isSuccess = action === FavoriteAction.Add
      ? await addToFavorites(eventId)
      : await removeFromFavorites(eventId);

    if (!isSuccess) {
      return null;
    }

    if (action === FavoriteAction.Add) {
      return Array.from(new Set([...currentFavoriteIds, eventId]));
    }

    return currentFavoriteIds.filter((id) => id !== eventId);
  };

  const loadEvents = async ({
    activeFilters,
    searchQuery,
    cityName,
  }: LoadEventsParams) => {
    isLoading.value = true;
    error.value = null;

    try {
      const payload = await eventAPI.getAll<Event[] | { events: Event[] }>({
        category: activeFilters.category === 'all'
          ? undefined
          : activeFilters.category || undefined,
        subcategory: activeFilters.subcategory || undefined,
        priceRange: activeFilters.priceRange,
        search: searchQuery?.trim() ? searchQuery : undefined,
        city: activeFilters.onlyMyCity ? cityName : undefined,
      });

      const nextEvents = normalizeEvents(payload);
      events.value = filterEvents(nextEvents, activeFilters, searchQuery ?? '');
    } catch {
      error.value = 'Не удалось загрузить список мероприятий';
      events.value = [];
    } finally {
      isLoading.value = false;
    }
  };

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
    isLoading,
    error,
    events: eventsWithFavoriteState,
    loadEvents,
    updateFavoriteIds,
  };
};
