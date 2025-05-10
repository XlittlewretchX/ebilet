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