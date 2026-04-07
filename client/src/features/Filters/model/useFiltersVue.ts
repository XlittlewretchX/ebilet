import { computed, ref, type Ref } from 'vue';
import { subcategoriesMap } from './constants';
import { createInitialFilterState, type FilterState } from './types';

interface UseFiltersVueParams {
  filters: Ref<FilterState>;
  onFiltersChange: (nextFilters: FilterState) => void;
}

export const useFiltersVue = ({ filters, onFiltersChange }: UseFiltersVueParams) => {
  const isOpen = ref(false);

  const availableSubcategories = computed(() =>
    filters.value.category && filters.value.category !== 'all'
      ? subcategoriesMap[filters.value.category] ?? []
      : [],
  );

  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters.value,
      category: value,
      subcategory: '',
    });
  };

  const handleSubcategoryChange = (value: string) => {
    onFiltersChange({
      ...filters.value,
      subcategory: value.toLowerCase(),
    });
  };

  const handlePriceChange = (bound: 'min' | 'max', value: string) => {
    const parsed = Number(value);
    const safeNumber = Number.isFinite(parsed) ? parsed : 0;

    onFiltersChange({
      ...filters.value,
      priceRange: {
        ...filters.value.priceRange,
        [bound]: safeNumber,
      },
    });
  };

  const handleOnlyMyCityChange = (value: boolean) => {
    onFiltersChange({
      ...filters.value,
      onlyMyCity: value,
    });
  };

  const closeFilters = () => {
    isOpen.value = false;
  };

  const toggleFilters = () => {
    isOpen.value = !isOpen.value;
  };

  const resetFilters = () => {
    onFiltersChange(createInitialFilterState());
    closeFilters();
  };

  return {
    filters,
    isOpen,
    availableSubcategories,
    handleCategoryChange,
    handleSubcategoryChange,
    handlePriceChange,
    handleOnlyMyCityChange,
    closeFilters,
    toggleFilters,
    resetFilters,
  };
};
