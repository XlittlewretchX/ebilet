import { useAppSelector } from '@/shared/lib/hooks';
import type { Event } from '@/shared/types';
import type { RootState } from '@/app/store';

export const useEventList = () => {
  const { events } = useAppSelector((state: RootState) => state.event);
  const filters = useAppSelector((state: RootState) => state.filter);

  // Фильтрация и сортировка событий по поисковому запросу и фильтрам
  
}; 