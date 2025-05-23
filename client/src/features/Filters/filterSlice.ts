import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const initialState: FilterState = {
  category: '',
  subcategory: '',
  dateRange: { start: '', end: '' },
  priceRange: { min: 0, max: 10000 },
  onlyMyCity: false,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<FilterState>) {
      return action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer; 