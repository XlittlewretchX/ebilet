import React, { useState, useEffect } from 'react';
import styles from './MyTicketPage.module.scss';
import { useAppSelector, useAppDispatch } from '@/shared/lib/hooks';
import EventListWidget from '@/widgets/EventListWidget/ui/EventListWidget';
import { fetchFavorites } from '@/features/AuthModal/model/authSlice';

const TABS = [
  { key: 'tickets', label: 'Мои билеты' },
  { key: 'favorites', label: 'Избранное' },
];

const MyTicketsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'favorites'>('tickets');
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.auth.user?.favorites || []);
  const allEvents = useAppSelector(state => state.event.events);
  const favoriteEvents = allEvents.filter(e => favorites.includes(e.id)).map(e => ({ ...e, isFavorite: true }));
  const loading = useAppSelector(state => state.auth.loading);
  const error = useAppSelector(state => state.auth.error);

  useEffect(() => {
    if (activeTab === 'favorites') {
      dispatch(fetchFavorites());
    }
  }, [activeTab, dispatch]);

  return (
    <div className={styles.container}>
      <h1>Мои события</h1>
      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab(tab.key as 'tickets' | 'favorites')}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {activeTab === 'tickets' ? (
          <div className={styles.emptyStub}>
            <svg className={styles.emptyStubIcon} viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#e3eaff" stroke="#bfc8d6" strokeWidth="2"/><path d="M16 28c1.5-2 4.5-2 6 0s4.5 2 6 0" stroke="#bfc8d6" strokeWidth="2" strokeLinecap="round"/><circle cx="18" cy="20" r="2" fill="#bfc8d6"/><circle cx="30" cy="20" r="2" fill="#bfc8d6"/></svg>
            <div className={styles.emptyStubText}>У вас пока нет купленных билетов</div>
          </div>
        ) : (
          favoriteEvents.length > 0 ? (
            <EventListWidget
              events={favoriteEvents}
              onAddToFavorites={() => {}}
              onRemoveFromFavorites={() => {}}
              onBuyTicket={() => {}}
              loading={loading}
              error={error}
            />
          ) : (
            <div className={styles.emptyStub}>
              <svg className={styles.emptyStubIcon} viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#e3eaff" stroke="#bfc8d6" strokeWidth="2"/><path d="M16 28c1.5-2 4.5-2 6 0s4.5 2 6 0" stroke="#bfc8d6" strokeWidth="2" strokeLinecap="round"/><circle cx="18" cy="20" r="2" fill="#bfc8d6"/><circle cx="30" cy="20" r="2" fill="#bfc8d6"/></svg>
              <div className={styles.emptyStubText}>У вас пока нет избранных событий</div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;
