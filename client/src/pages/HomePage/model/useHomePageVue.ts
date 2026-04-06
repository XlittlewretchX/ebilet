import { storeToRefs } from 'pinia';
import type { DateRangeValue } from '@/shared/types/date';
import { useEventFiltersStore } from '@/entities/EventFilters/model/store';
import type { FilterState } from '@/entities/EventFilters/model/types';

export const useHomePageVue = () => {
  const filtersStore = useEventFiltersStore();
  const { filters } = storeToRefs(filtersStore);

  const handleFiltersChange = (nextFilters: FilterState) => {
    filtersStore.setFilters(nextFilters);
  };

  const handleDateRangeChange = (nextDateRange: DateRangeValue) => {
    filtersStore.setDateRange(nextDateRange);
  };

  return {
    filters,
    handleFiltersChange,
    handleDateRangeChange,
  };
};
