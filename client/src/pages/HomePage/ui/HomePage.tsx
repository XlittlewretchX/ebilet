import React from 'react';
import { useAppSelector, useAppDispatch } from '@/shared/lib/hooks';
import { fetchEvents } from '@/entities/Event/model/eventSlice';
import { setFilters, resetFilters } from '@/features/Filters/filterSlice';
import { useEffect } from 'react';
import { useEventList } from '@/features/EventList/model/useEventList';
import EventListWidget from '@/widgets/EventListWidget/ui/EventListWidget';
import Filters from '@/features/Filters/ui/Filters';
import DateStrip from '@/features/DateStrip/DateStrip';
import styles from '@/pages/HomePage/HomePage.module.scss';
import { useHomePage } from '../model/useHomePage';

const HomePage: React.FC = () => {
  const {
    loading,
    error,
    filteredEvents,
    handleAddToFavorites,
    handleBuyTicket,
    handleDateSelect,
    handleRangeSelect,
  } = useHomePage();

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;

  return (
    <div className={styles.homePage}>
      <div style={{display:'flex', alignItems:'center', gap:'1.5rem', marginBottom:'-1.5rem'}}>
        <DateStrip onDateSelect={handleDateSelect} onRangeSelect={handleRangeSelect} />
      </div>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <Filters />
        </aside>
        <main className={styles.main}>
          <EventListWidget
            events={filteredEvents}
            onAddToFavorites={handleAddToFavorites}
            onBuyTicket={handleBuyTicket}
          />
        </main>
      </div>
    </div>
  );
};

export default HomePage; 