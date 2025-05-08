import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchEvents } from '@/store/eventSlice';
import EventCard from '@/components/EventCard/EventCard';
import Filters from '@/components/Filters/Filters';
import styles from './HomePage.module.scss';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, loading, error } = useAppSelector((state) => state.event);

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

  return (
    <div className={styles.homePage}>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <Filters onFilterChange={handleFilterChange} />
        </aside>
        <main className={styles.main}>
          <div className={styles.eventsGrid}>
            {events.map((event: any) => (
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
