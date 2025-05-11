import { useAppSelector, useAppDispatch } from '@/shared/lib/hooks';
import { fetchEvents } from '@/entities/Event/model/eventSlice';
import { setFilters } from '@/features/Filters/filterSlice';
import { useEffect, useState } from 'react';
import { useEventList } from '@/features/EventList/model/useEventList';
import { useDebounce } from '@/shared/lib/hooks';
import { addFavorite, removeFavorite } from '@/features/AuthModal/model/authSlice';

export const useHomePage = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.event);
  const filters = useAppSelector((state) => state.filter);
  const debouncedFilters = useDebounce(filters, 300);
  const { filteredEvents } = useEventList();
  const [showLoader, setShowLoader] = useState(false);
  const search = useAppSelector((state) => state.search.value);
  const city = useAppSelector((state) => state.city.name);
  const favorites = useAppSelector((state) => state.auth.user?.favorites || []);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
    if (!isAuthenticated) {
      setShowAuthAlert(true);
      return;
    }
    dispatch(addFavorite(id));
  };

  const handleRemoveFromFavorites = (id: number) => {
    dispatch(removeFavorite(id));
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

  // Обогащаем события флагом избранного
  const eventsWithFavorite = filteredEvents.map(event => ({
    ...event,
    isFavorite: favorites.includes(event.id),
  }));

  return {
    loading: showLoader,
    error,
    filteredEvents: eventsWithFavorite,
    handleAddToFavorites,
    handleRemoveFromFavorites,
    handleBuyTicket,
    handleDateSelect,
    handleRangeSelect,
    showAuthAlert,
    setShowAuthAlert,
    showAuthModal,
    setShowAuthModal,
    isAuthenticated,
  };
}; 