import React from 'react';
import EventCard from '@/entities/Event/ui/EventCard';
import styles from './EventListWidget.module.scss';
import clsx from 'clsx';

interface EventListWidgetProps {
  events: any[];
  onAddToFavorites: (id: number) => void;
  onBuyTicket: (id: number) => void;
  loading?: boolean;
  error?: string | null;
}

const SKELETON_COUNT = 6;

const EventListWidget: React.FC<EventListWidgetProps> = ({ events, onAddToFavorites, onBuyTicket, loading, error }) => {
  if (loading) return (
    <div className={styles.eventsGrid}>
      {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
        <div key={idx} className={clsx(styles.skeletonCard, styles.card)}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonText} />
            <div className={styles.skeletonText} />
            <div className={styles.skeletonActions} />
          </div>
        </div>
      ))}
    </div>
  );
  if (error) return <div className={styles.eventsGrid}><div style={{gridColumn: '1/-1', color: '#dc3545', textAlign: 'center', padding: '2rem'}}>Ошибка: {error}</div></div>;
  return (
    <div className={styles.eventsGrid}>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onAddToFavorites={onAddToFavorites}
          onBuyTicket={onBuyTicket}
        />
      ))}
    </div>
  );
};

export default EventListWidget; 