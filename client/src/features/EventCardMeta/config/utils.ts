export const normalizeTicketCount = (rawValue: number): number => {
  const parsedValue = Number(rawValue);
  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return Math.trunc(parsedValue);
};

export const normalizeTicketSeats = (rawSeats: string[]): string[] =>
  rawSeats
    .map((seat) => seat.trim())
    .filter((seat) => seat.length > 0);

export const formatTicketSeats = (ticketSeats: string[]): string =>
  ticketSeats.join(', ');
