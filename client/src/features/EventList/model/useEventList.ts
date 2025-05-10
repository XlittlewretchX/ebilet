import { useAppSelector } from '@/shared/lib/hooks';
import type { Event } from '@/shared/types';
import type { RootState } from '@/app/store';

export const useEventList = () => {
  const { events } = useAppSelector((state: RootState) => state.event);
  const search = useAppSelector((state: RootState) => state.search.value);
  const filters = useAppSelector((state: RootState) => state.filter);

  // Фильтрация и сортировка событий по поисковому запросу и фильтрам
  const normalizedSearch = search.trim().toLowerCase();
  let filteredEvents = events.filter((event: Event) => {
    // Поиск
    const title = event.title.toLowerCase();
    const matchesSearch = !normalizedSearch ||
      title.startsWith(normalizedSearch) ||
      title.includes(normalizedSearch);
    // Категория
    const matchesCategory =
      !filters.category ||
      (event.category && event.category.trim().toLowerCase() === filters.category.trim().toLowerCase());
    // Дата
    let matchesDate = true;
    const eventDate = (event.date || '').slice(0, 10);
    const filterStart = (filters.dateRange.start || '').slice(0, 10);
    const filterEnd = (filters.dateRange.end || '').slice(0, 10);
    if (filterStart && filterEnd) {
      matchesDate = eventDate >= filterStart && eventDate <= filterEnd;
    } else if (filterStart) {
      matchesDate = eventDate >= filterStart;
    } else if (filterEnd) {
      matchesDate = eventDate <= filterEnd;
    }
    // Цена
    const matchesPrice =
      event.price >= filters.priceRange.min &&
      event.price <= filters.priceRange.max;
    return matchesSearch && matchesCategory && matchesDate && matchesPrice;
  });

  // Сортировка: сначала те, что начинаются с поискового запроса, потом содержащие
  if (normalizedSearch) {
    const startsWith: Event[] = [];
    const contains: Event[] = [];
    for (const event of filteredEvents) {
      const title = event.title.toLowerCase();
      if (title.startsWith(normalizedSearch)) {
        startsWith.push(event);
      } else if (title.includes(normalizedSearch)) {
        contains.push(event);
      }
    }
    filteredEvents = [...startsWith, ...contains];
  }

  return { filteredEvents };
}; 