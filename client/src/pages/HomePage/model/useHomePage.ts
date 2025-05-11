import { useAppSelector, useAppDispatch } from '@/shared/lib/hooks';
import { fetchEvents } from '@/entities/Event/model/eventSlice';
import { setFilters } from '@/features/Filters/filterSlice';
import { useEffect, useState } from 'react';
import { useEventList } from '@/features/EventList/model/useEventList';
import { useDebounce } from '@/shared/lib/hooks';

export const useHomePage = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.event);
  const filters = useAppSelector((state) => state.filter);
  const debouncedFilters = useDebounce(filters, 300);
  const { filteredEvents } = useEventList();
  const [showLoader, setShowLoader] = useState(false);
  const search = useAppSelector((state) => state.search.value);
  const city = useAppSelector((state) => state.city.name);

  useEffect(() => {
    const filtersToSend: any = { ...debouncedFilters, search };
    if (debouncedFilters.onlyMyCity && city && city !== 'Город') {
      filtersToSend.city = city;
    } else {
      delete filtersToSend.city;
    }
    dispatch(fetchEvents(filtersToSend));
  }, [dispatch, debouncedFilters, search, city]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (loading) {
      timeout = setTimeout(() => setShowLoader(true), 250); // 250 мс задержка
    } else {
      setShowLoader(false);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [loading]);

  const handleAddToFavorites = (id: number) => {
    // Логика добавления в избранное будет добавлена позже
  };

  const handleBuyTicket = (id: number) => {
    // Логика покупки билета будет добавлена позже
  };

  const handleDateSelect = (date: string) => {
    dispatch(
      setFilters({
        ...filters,
        dateRange: { start: date, end: date },
      })
    );
  };

  const handleRangeSelect = (start: string, end: string) => {
    dispatch(
      setFilters({
        ...filters,
        dateRange: { start, end },
      })
    );
  };

  return {
    loading: showLoader,
    error,
    filteredEvents,
    handleAddToFavorites,
    handleBuyTicket,
    handleDateSelect,
    handleRangeSelect,
  };
}; 