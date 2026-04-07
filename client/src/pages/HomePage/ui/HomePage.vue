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
}
</style>
