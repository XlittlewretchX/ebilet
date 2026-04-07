import { defineStore, storeToRefs } from 'pinia';
import { createInitialFilterState, type FilterState } from '@/features/Filters/model/types';

const useHomePageFiltersStore = defineStore('homePageFilters', {
  state: () => ({
    filters: createInitialFilterState() as FilterState,
  }),
  actions: {
    setFilters(value: FilterState) {
      this.filters = value;
    },
    setDateRange(value: FilterState['dateRange']) {
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

export const useHomePageVue = () => {
  const filtersStore = useHomePageFiltersStore();
  const { filters } = storeToRefs(filtersStore);

  const handleFiltersChange = (nextFilters: FilterState) => {
    filtersStore.setFilters(nextFilters);
  };

  const handleDateRangeChange = (nextDateRange: FilterState['dateRange']) => {
    filtersStore.setDateRange(nextDateRange);
  };

  return {
    filters,
    handleFiltersChange,
    handleDateRangeChange,
  };
};
