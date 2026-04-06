import { computed, onUnmounted, ref, watch, type Ref } from 'vue';
import { subcategoriesMap } from './constants';
import { createInitialFilterState, type FilterState } from './types';

interface UseFiltersVueParams {
  filters: Ref<FilterState>;
  onFiltersChange: (nextFilters: FilterState) => void;
}

export const useFiltersVue = ({ filters, onFiltersChange }: UseFiltersVueParams) => {
  const isOpen = ref(false);

  const availableSubcategories = computed(() => {
    if (!filters.value.category) {
      return [];
    }

    return subcategoriesMap[filters.value.category] ?? [];
  });

  const applyFilters = (nextFilters: FilterState) => {
    onFiltersChange(nextFilters);
  };

  const handleCategoryChange = (value: string) => {
    applyFilters({
      ...filters.value,
      category: value,
      subcategory: '',
    });
  };

  const handleSubcategoryChange = (value: string) => {
    applyFilters({
      ...filters.value,
      subcategory: value.toLowerCase(),
    });
  };

  const handlePriceChange = (bound: 'min' | 'max', value: string) => {
    const parsed = Number(value);
    const safeNumber = Number.isFinite(parsed) ? parsed : 0;

    applyFilters({
      ...filters.value,
      priceRange: {
        ...filters.value.priceRange,
        [bound]: safeNumber,
      },
    });
  };

  const handleOnlyMyCityChange = (value: boolean) => {
    applyFilters({
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
    applyFilters(createInitialFilterState());
    closeFilters();
  };

  watch(isOpen, (open) => {
    document.body.classList.toggle('filters-mobile-locked', open);
  });

  onUnmounted(() => {
    document.body.classList.remove('filters-mobile-locked');
  });

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
