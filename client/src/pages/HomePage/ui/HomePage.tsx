import React from 'react';
import { useAppSelector, useAppDispatch } from '@/shared/lib/hooks';
import { fetchEvents } from '@/entities/Event/model/eventSlice';
import { setFilters, resetFilters } from '@/features/Filters/filterSlice';
import { useEffect } from 'react';
import { useEventList } from '@/features/EventList/model/useEventList';
import EventListWidget from '@/widgets/EventListWidget/ui/EventListWidget';
import Filters from '@/features/Filters/ui/Filters';
import DateStrip from '@/features/DateStrip/ui/DateStrip';
import styles from '@/pages/HomePage/HomePage.module.scss';
import { useHomePage } from '../model/useHomePage';
import AuthModal from '@/features/AuthModal/ui/AuthModal';
import AuthAlertModal from '@/shared/ui/AuthAlertModal';
import { fetchFavorites } from '@/features/AuthModal/model/authSlice';

const HomePage: React.FC = () => {
  const {
    loading,
    error,
    filteredEvents,
    handleAddToFavorites,
    handleRemoveFromFavorites,
    handleBuyTicket,
    handleDateSelect,
    handleRangeSelect,
    showAuthAlert,
    setShowAuthAlert,
    showAuthModal,
    setShowAuthModal,
  } = useHomePage();

  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [isAuthenticated, dispatch]);

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
            onRemoveFromFavorites={handleRemoveFromFavorites}
            onBuyTicket={handleBuyTicket}
            loading={loading}
            error={error}
          />
        </main>
      </div>
      <AuthAlertModal
        isOpen={showAuthAlert}
        onClose={() => setShowAuthAlert(false)}
        onAuthClick={() => {
          setShowAuthAlert(false);
          setShowAuthModal(true);
        }}
      />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default HomePage; 