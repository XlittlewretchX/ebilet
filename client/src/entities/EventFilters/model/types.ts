import { createInitialDateRange, type DateRangeValue } from '@/shared/types/date';

export interface FilterState {
  category: string;
  subcategory: string;
  dateRange: DateRangeValue;
  priceRange: {
    min: number;
    max: number;
  };
  onlyMyCity: boolean;
}

export const createInitialFilterState = (): FilterState => ({
  category: '',
  subcategory: '',
  dateRange: createInitialDateRange(),
  priceRange: { min: 0, max: 10000 },
  onlyMyCity: false,
});
