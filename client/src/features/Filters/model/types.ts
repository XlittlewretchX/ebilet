export interface FilterState {
  category: string;
  subcategory: string;
  dateRange: {
    start: string;
    end: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  onlyMyCity: boolean;
}

export const createInitialFilterState = (): FilterState => ({
  category: 'all',
  subcategory: '',
  dateRange: { start: '', end: '' },
  priceRange: { min: 0, max: 10000 },
  onlyMyCity: false,
});
