export interface User {
  id: number;
  username: string;
  email: string;
  city: string;
  avatarUrl?: string;
  favorites?: number[];
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  imageUrl?: string;
  category: string;
  userId: number;
}

export interface Ticket {
  id: number;
  userId: number;
  eventId: number;
  seat?: string | null;
  name?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  title: string;
  date: string;
  location: string;
  price: number;
  imageUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  userTickets?: Ticket[];
}

export interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

export interface CityState {
  name: string;
  showPicker: boolean;
}

export interface RootState {
  auth: AuthState;
  event: EventState;
}
