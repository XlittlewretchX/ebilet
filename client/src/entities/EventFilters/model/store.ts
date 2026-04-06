import { defineStore } from 'pinia';
import type { DateRangeValue } from '@/shared/types/date';
import { createInitialFilterState, type FilterState } from './types';

export const useEventFiltersStore = defineStore('eventFilters', {
  state: () => ({
    filters: createInitialFilterState() as FilterState,
  }),
  actions: {
    setFilters(value: FilterState) {
      this.filters = value;
    },
    setDateRange(value: DateRangeValue) {
      this.filters = {
        ...this.filters,
        dateRange: value,
      };
    },
    resetFilters() {
      this.filters = createInitialFilterState();
    },
  },
});
