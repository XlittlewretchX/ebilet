const DATE_LOCALE = 'ru-RU';

export const parseEventDate = (rawDate: string): Date => new Date(rawDate);

export const isValidEventDate = (date: Date): boolean =>
  !Number.isNaN(date.getTime());

export const formatEventDate = (date: Date, fallbackValue: string): string => {
  if (!isValidEventDate(date)) {
    return fallbackValue;
  }

  return date.toLocaleDateString(DATE_LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const resolveEventImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) {
    return '';
  }

  if (!imageUrl.startsWith('/uploads')) {
    return imageUrl;
  }

  const apiBase = process.env.REACT_APP_API_URL?.replace('/api', '');
  return apiBase ? `${apiBase}${imageUrl}` : imageUrl;
};
