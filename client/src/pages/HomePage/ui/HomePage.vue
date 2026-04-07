<template>
  <section class="home-page">
    <DateStrip
      :model-value="filters.dateRange"
      @update:model-value="handleDateRangeChange"
    />
    <Filters
      :model-value="filters"
      @update:model-value="handleFiltersChange"
    />
  </section>
</template>

<script setup lang="ts">
import { CityPicker } from '@/features/CityPicker';
import { UserMenu } from '@/features/UserMenu';
import SearchBar from '@/features/SearchBar/ui/SearchBar.vue';
import DateStrip from '@/features/DateStrip/ui/DateStrip.vue';
import Filters from '@/features/Filters/ui/Filters.vue';
import { useHomePageVue } from '../model/useHomePageVue';

const { filters, handleFiltersChange, handleDateRangeChange } = useHomePageVue();
</script>

<style scoped lang="scss">
.home-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__city-preview {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  &__user-menu-preview {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background-color: #ffffff;
  }

  &__preview-title {
    margin: 0;
    color: #1f2937;
    font-size: 1rem;
    font-weight: 600;
  }
}
</style>
