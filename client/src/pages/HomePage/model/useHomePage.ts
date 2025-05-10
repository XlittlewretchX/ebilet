import { useAppSelector, useAppDispatch } from '@/shared/lib/hooks';
import { fetchEvents } from '@/entities/Event/model/eventSlice';
import { setFilters } from '@/features/Filters/filterSlice';
import { useEffect } from 'react';
import { useEventList } from '@/features/EventList/model/useEventList';

export const useHomePage = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.event);
  const filters = useAppSelector((state) => state.filter);
  const { filteredEvents } = useEventList();

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

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
    loading,
    error,
    filteredEvents,
    handleAddToFavorites,
    handleBuyTicket,
    handleDateSelect,
    handleRangeSelect,
  };
}; 