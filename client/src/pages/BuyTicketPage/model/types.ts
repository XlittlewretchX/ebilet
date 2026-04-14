export type SeatingType = 'none' | 'grid' | 'circle';

export interface TicketUserData {
  name: string;
  phone: string;
  email: string;
}

export interface PurchaseFormState {
  count: number;
  seat: string[] | null;
  userData: TicketUserData | null;
}

export interface SeatSelection {
  count: number;
  seats: string[] | null;
}

export type BuyTicketStep = 'picker' | 'user-data' | 'payment' | 'success';
