import { useEffect, useState } from 'react';
import { eventAPI } from '@/shared/api/api';

export const MAX_SELECT = 10;

export function useChooseSeat(eventId: string) {
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    eventAPI.getBookedSeats(Number(eventId))
      .then((seats) => setBookedSeats(seats))
      .catch(() => setError('Ошибка загрузки мест'))
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleSelect = (seat: string) => {
    if (bookedSeats.includes(seat)) return;
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else if (selectedSeats.length < MAX_SELECT) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  return {
    bookedSeats,
    selectedSeats,
    setSelectedSeats,
    loading,
    error,
    handleSelect,
  };
} 