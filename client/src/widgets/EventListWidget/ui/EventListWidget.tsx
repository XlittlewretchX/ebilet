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
  if (error) return (
    <div className={styles.eventsGrid}>
      <div className={styles.errorStub}>
        <svg className={styles.errorStubIcon} viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#ffd6d6" stroke="#dc3545" strokeWidth="2"/><path d="M24 14v12" stroke="#dc3545" strokeWidth="3" strokeLinecap="round"/><circle cx="24" cy="33" r="2.5" fill="#dc3545"/></svg>
        <div className={styles.errorStubText}>Произошла ошибка при загрузке событий.<br/>Пожалуйста, попробуйте позже.</div>
      </div>
    </div>
  );
  if (!events.length) {
    return (
      <div className={styles.eventsGrid}>
        <div className={styles.emptyStub}>
          <svg className={styles.emptyStubIcon} viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#e3e8ee" stroke="#bfc8d6" strokeWidth="2"/><path d="M16 28c1.5-2 4.5-2 6 0s4.5 2 6 0" stroke="#bfc8d6" strokeWidth="2" strokeLinecap="round"/><circle cx="18" cy="20" r="2" fill="#bfc8d6"/><circle cx="30" cy="20" r="2" fill="#bfc8d6"/></svg>
          <div className={styles.emptyStubText}>Мероприятия не найдены по выбранным фильтрам</div>
        </div>
      </div>
    );
  }
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