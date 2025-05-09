import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchEvents } from '@/store/eventSlice';
import EventCard from '@/components/EventCard/EventCard';
import Filters from '@/components/Filters/Filters';
import styles from './HomePage.module.scss';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, loading, error } = useAppSelector((state) => state.event);
  const search = useAppSelector((state) => state.search.value);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleFilterChange = (filters: {
    date?: string;
    category?: string;
  }) => {
    console.log('Фильтры:', filters);
    // Логика фильтрации будет добавлена позже
  };

  const handleAddToFavorites = (id: number) => {
    console.log(`Добавлено в избранное: ${id}`);
    // Логика добавления в избранное будет добавлена позже
  };

  const handleBuyTicket = (id: number) => {
    console.log(`Куплен билет: ${id}`);
    // Логика покупки билета будет добавлена позже
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;

  // Фильтрация и сортировка событий по поисковому запросу
  const normalizedSearch = search.trim().toLowerCase();
  let filteredEvents = events;
  if (normalizedSearch) {
    const startsWith: any[] = [];
    const contains: any[] = [];
    for (const event of events) {
      const title = event.title.toLowerCase();
      if (title.startsWith(normalizedSearch)) {
        startsWith.push(event);
      } else if (title.includes(normalizedSearch)) {
        contains.push(event);
      }
    }
    filteredEvents = [...startsWith, ...contains];
  }

  return (
    <div className={styles.homePage}>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <Filters onFilterChange={handleFilterChange} />
        </aside>
        <main className={styles.main}>
          <div className={styles.eventsGrid}>
            {filteredEvents.map((event: any) => (
              <EventCard
                key={event.id}
                event={event}
                onAddToFavorites={handleAddToFavorites}
                onBuyTicket={handleBuyTicket}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
