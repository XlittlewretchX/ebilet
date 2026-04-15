import type { Event } from '@/entities/Event';
import type { FilterState } from '@/features/FilterPanel/model/types';

export const normalizeEvents = (payload: Event[] | { events: Event[] }): Event[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object' && 'events' in payload) {
    return Array.isArray(payload.events) ? payload.events : [];
  }

  return [];
};

export const filterEvents = (
  sourceEvents: Event[],
  filters: FilterState,
  searchValue: string,
) => {
  const normalizedSearch = searchValue.trim().toLowerCase();
  const filterStart = (filters.dateRange.start || '').slice(0, 10);
  const filterEnd = (filters.dateRange.end || '').slice(0, 10);

  const filtered = sourceEvents.filter((event) => {
    const title = event.title.toLowerCase();
    const matchesSearch = !normalizedSearch ||
      title.startsWith(normalizedSearch) ||
      title.includes(normalizedSearch);

    const matchesCategory =
      !filters.category ||
      filters.category === 'all' ||
      event.category.trim().toLowerCase() === filters.category.trim().toLowerCase();

    const eventDate = (event.date || '').slice(0, 10);
    let matchesDate = true;
    if (filterStart && filterEnd) {
      matchesDate = eventDate >= filterStart && eventDate <= filterEnd;
    } else if (filterStart) {
      matchesDate = eventDate >= filterStart;
    } else if (filterEnd) {
      matchesDate = eventDate <= filterEnd;
    }

    const matchesPrice =
      event.price >= filters.priceRange.min &&
      event.price <= filters.priceRange.max;

    return matchesSearch && matchesCategory && matchesDate && matchesPrice;
  });

  if (!normalizedSearch) {
    return filtered;
  }

  const startsWith = filtered.filter((event) =>
    event.title.toLowerCase().startsWith(normalizedSearch),
  );
  const contains = filtered.filter((event) => {
    const title = event.title.toLowerCase();
    return !title.startsWith(normalizedSearch) && title.includes(normalizedSearch);
  });

  return [...startsWith, ...contains];
};
