import React, { useState, useEffect } from 'react';
import styles from './MyTicketPage.module.scss';
import { useAppSelector, useAppDispatch } from '@/shared/lib/hooks';
import EventListWidget from '@/widgets/EventListWidget/ui/EventListWidget';
import { fetchFavorites, fetchUserTickets, removeFavorite } from '@/features/AuthModal/model/authSlice';
import { fetchEvents } from '@/entities/Event/model/eventSlice';

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
  const userTickets = useAppSelector(state => state.auth.userTickets || []);

  // Группировка билетов по eventId
  const groupedTickets = userTickets.reduce((acc, ticket) => {
    if (!acc[ticket.eventId]) {
      acc[ticket.eventId] = {
        ...ticket,
        ticketCount: 1,
        ticketSeats: ticket.seat ? [ticket.seat] : [],
      };
    } else {
      acc[ticket.eventId].ticketCount += 1;
      if (ticket.seat) acc[ticket.eventId].ticketSeats.push(ticket.seat);
    }
    return acc;
  }, {} as Record<number, any>);
  const ticketsForWidget = Object.values(groupedTickets);

  const handleRemoveFromFavorites = async (eventId: number) => {
    await dispatch(removeFavorite(eventId));
    dispatch(fetchFavorites());
    dispatch(fetchEvents({}));
  };

  useEffect(() => {
    if (activeTab === 'tickets') {
      dispatch(fetchUserTickets());
    } else if (activeTab === 'favorites') {
      dispatch(fetchFavorites());
      dispatch(fetchEvents({}));
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
          ticketsForWidget.length > 0 ? (
            <EventListWidget
              events={ticketsForWidget.map(ticket => ({
                ...ticket,
                id: ticket.eventId,
                isTicket: true,
              }))}
              onAddToFavorites={() => {}}
              onRemoveFromFavorites={() => {}}
              onBuyTicket={() => {}}
              loading={loading}
              error={error}
            />
          ) : (
            <div className={styles.emptyStub}>
              <svg className={styles.emptyStubIcon} viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#e3eaff" stroke="#bfc8d6" strokeWidth="2"/><path d="M16 28c1.5-2 4.5-2 6 0s4.5 2 6 0" stroke="#bfc8d6" strokeWidth="2" strokeLinecap="round"/><circle cx="18" cy="20" r="2" fill="#bfc8d6"/><circle cx="30" cy="20" r="2" fill="#bfc8d6"/></svg>
              <div className={styles.emptyStubText}>У вас пока нет купленных билетов</div>
            </div>
          )
        ) : (
          favoriteEvents.length > 0 ? (
            <EventListWidget
              events={favoriteEvents}
              onAddToFavorites={() => {}}
              onRemoveFromFavorites={handleRemoveFromFavorites}
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
