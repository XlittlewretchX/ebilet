export const normalizeTicketCount = (rawValue: number): number => {
  if (!Number.isFinite(rawValue) || rawValue < 0) {
    return 0;
  }

  return Math.trunc(rawValue);
};
