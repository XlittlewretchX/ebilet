import React from 'react';
import { Event } from '@/entities/Event/types';
import styles from './EventCard.module.scss';

interface EventCardProps {
  event: Event;
  isFavorite?: boolean;
  onAddToFavorites: (id: number) => void;
  onRemoveFromFavorites?: (id: number) => void;
  onBuyTicket: (id: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isFavorite,
  onAddToFavorites,
  onRemoveFromFavorites,
  onBuyTicket,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // @ts-ignore: ticketCount и ticketSeats могут быть только для билетов
  const ticketCount = (event as any).ticketCount;
  // @ts-ignore
  const ticketSeats = (event as any).ticketSeats;

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
        {(ticketCount || (ticketSeats && ticketSeats.length)) && (
          <div style={{margin: '8px 0', fontSize: '0.95em'}}>
            {ticketCount && <span style={{marginRight: 12}}>Куплено билетов: <b>{ticketCount}</b></span>}
            {ticketSeats && ticketSeats.length > 0 && (
              <span>Места: <b>{ticketSeats.join(', ')}</b></span>
            )}
          </div>
        )}
        <div className={styles.actions}>
          {!(event as any).isTicket && (
            <>
              {isFavorite ? (
                <button
                  className={styles.favoriteButton}
                  style={{ color: '#2563eb', fontWeight: 700 }}
                  onClick={() => onRemoveFromFavorites && onRemoveFromFavorites(event.id)}
                >
                  Из избранного
                </button>
              ) : (
                <button
                  className={styles.favoriteButton}
                  onClick={() => onAddToFavorites(event.id)}
                >
                  В избранное
                </button>
              )}
              <button
                className={styles.buyButton}
                onClick={() => onBuyTicket(event.id)}
              >
                Купить билет
              </button>
            </>
          )}
          {(event as any).isTicket && (
            <span style={{color:'#22c55e', fontWeight:600, fontSize:'1em'}}>Билет куплен</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
