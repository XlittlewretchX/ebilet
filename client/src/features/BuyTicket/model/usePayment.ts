import { useState, useRef } from 'react';

export function usePayment() {
  const [card, setCard] = useState('');
  const [date, setDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [touched, setTouched] = useState<{card?: boolean; date?: boolean; cvv?: boolean}>({});

  const dateRef = useRef<HTMLInputElement>(null);
  const cvvRef = useRef<HTMLInputElement>(null);

  // Форматирование номера карты в группы по 4 цифры
  const formatCardNumber = (value: string) => value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();

  // Валидация
  const isCardValid = card.replace(/\s/g, '').length === 16;
  const isDateValid = /^\d{2}\/\d{2}$/.test(date) && (() => {
    const [mm, yy] = date.split('/').map(Number);
    if (mm < 1 || mm > 12) return false;
    const now = new Date();
    const year = 2000 + yy;
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth() + 1;
    return year > thisYear || (year === thisYear && mm >= thisMonth);
  })();
  const isCvvValid = /^\d{3}$/.test(cvv);
  const isValid = isCardValid && isDateValid && isCvvValid;

  return {
    card, setCard,
    date, setDate,
    cvv, setCvv,
    touched, setTouched,
    dateRef, cvvRef,
    formatCardNumber,
    isCardValid, isDateValid, isCvvValid, isValid
  };
} 