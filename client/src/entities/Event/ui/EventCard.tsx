import React from 'react';
import { Event } from '@/entities/Event/types';
import styles from './EventCard.module.scss';

interface EventCardProps {
  event: Event;
  onAddToFavorites: (id: number) => void;
  onBuyTicket: (id: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onAddToFavorites,
  onBuyTicket,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className={styles.card}>
      {event.imageUrl && (
        <div className={styles.imageContainer}>
          <img
            src={event.imageUrl.startsWith('/uploads')
              ? `${process.env.REACT_APP_API_URL?.replace('/api', '')}${event.imageUrl}`
              : event.imageUrl}
            alt={event.title}
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.description}>{event.description}</p>
        <div className={styles.details}>
          <span className={styles.date}>{formatDate(event.date)}</span>
          <span className={styles.location}>{event.location}</span>
          <span className={styles.price}>{event.price} ₽</span>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.favoriteButton}
            onClick={() => onAddToFavorites(event.id)}
          >
            В избранное
          </button>
          <button
            className={styles.buyButton}
            onClick={() => onBuyTicket(event.id)}
          >
            Купить билет
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
