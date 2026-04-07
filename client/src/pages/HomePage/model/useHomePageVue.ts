import { storeToRefs } from 'pinia';
import type { DateRangeValue } from '@/shared/types/date';
import type { FilterState } from '@/features/Filters/model/types';
import { useHomePageFiltersStore } from './homePageFiltersStore';

export const useHomePageVue = () => {
  const filtersStore = useHomePageFiltersStore();
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
