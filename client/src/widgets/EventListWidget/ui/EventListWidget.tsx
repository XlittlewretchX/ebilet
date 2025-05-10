import React from 'react';
import EventCard from '@/entities/Event/ui/EventCard';
import styles from './EventListWidget.module.scss';

interface EventListWidgetProps {
  events: any[];
  onAddToFavorites: (id: number) => void;
  onBuyTicket: (id: number) => void;
}

const EventListWidget: React.FC<EventListWidgetProps> = ({ events, onAddToFavorites, onBuyTicket }) => {
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