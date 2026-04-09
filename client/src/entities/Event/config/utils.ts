const DATE_LOCALE = 'ru-RU';

export const formatEventDate = (rawDate: string): string => {
  const parsedDate = new Date(rawDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return rawDate;
  }

  return parsedDate.toLocaleDateString(DATE_LOCALE, {
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
