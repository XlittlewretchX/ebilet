import { defineStore } from 'pinia';
import type { DateRangeValue } from '@/shared/types/date';
import { createInitialFilterState, type FilterState } from '@/features/Filters/model/types';

export const useHomePageFiltersStore = defineStore('homePageFilters', {
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
