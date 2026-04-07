<template>
  <section class="filters" aria-label="Фильтры мероприятий">
    <button type="button" class="filters__toggle" @click="toggleFilters">
      <svg
        class="filters__toggle-icon"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.33333 15H11.6667V13.3333H8.33333V15ZM2.5 5V6.66667H17.5V5H2.5ZM5 10.8333H15V9.16667H5V10.8333Z"
          fill="currentColor"
        />
      </svg>
      Фильтры
    </button>

    <button
      v-if="isOpen"
      type="button"
      class="filters__backdrop"
      aria-label="Закрыть фильтры"
      @click="closeFilters"
    />

    <aside class="filters__panel" :class="{ 'filters__panel--open': isOpen }">
      <header class="filters__header">
        <h2 class="filters__title">Фильтры</h2>
        <button
          type="button"
          class="filters__close-button"
          aria-label="Закрыть фильтры"
          @click="closeFilters"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </header>

      <form class="filters__form" @submit.prevent>
        <fieldset class="filters__group">
          <legend class="filters__legend">Категория</legend>
          <label class="filters__label" for="filters-category">Категория</label>
          <select
            id="filters-category"
            class="filters__select"
            :value="filters.category"
            @change="onCategorySelect"
          >
            <option v-for="option in categoryOptions" :key="option.value || 'all'" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </fieldset>

        <fieldset v-if="availableSubcategories.length" class="filters__group">
          <legend class="filters__legend">Подкатегория</legend>
          <label class="filters__label" for="filters-subcategory">Подкатегория</label>
          <select
            id="filters-subcategory"
            class="filters__select"
            :value="filters.subcategory"
            @change="onSubcategorySelect"
          >
            <option value="">Все подкатегории</option>
            <option v-for="subcategory in availableSubcategories" :key="subcategory" :value="subcategory">
              {{ capitalize(subcategory) }}
            </option>
          </select>
        </fieldset>

        <fieldset class="filters__group">
          <legend class="filters__legend">Цена</legend>
          <p class="filters__label">Диапазон цены</p>
          <div class="filters__price-grid">
            <input
              type="number"
              class="filters__input"
              placeholder="От"
              :value="filters.priceRange.min"
              @input="onPriceInput('min', $event)"
            />
            <input
              type="number"
              class="filters__input"
              placeholder="До"
              :value="filters.priceRange.max"
              @input="onPriceInput('max', $event)"
            />
          </div>
        </fieldset>

        <fieldset class="filters__group">
          <legend class="filters__legend">Локация</legend>
          <div class="filters__checkbox-row">
            <input
              id="filters-only-city"
              type="checkbox"
              class="filters__checkbox"
              :checked="filters.onlyMyCity"
              @change="onOnlyCityToggle"
            />
            <label class="filters__checkbox-label" for="filters-only-city">Искать в моем городе</label>
          </div>
        </fieldset>

        <button type="button" class="filters__reset-button" @click="resetFilters">
          Сбросить фильтры
        </button>
      </form>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { categoryOptions } from '../model/constants';
import type { FilterState } from '../model/types';
import { useFiltersVue } from '../model/useFiltersVue';

const props = defineProps<{
  modelValue: FilterState;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: FilterState): void;
}>();

const {
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
} = useFiltersVue({
  filters: toRef(props, 'modelValue'),
  onFiltersChange: (nextFilters) => emit('update:modelValue', nextFilters),
});

const getSelectTarget = (event: Event): HTMLSelectElement | null =>
  event.target instanceof HTMLSelectElement ? event.target : null;

const getInputTarget = (event: Event): HTMLInputElement | null =>
  event.target instanceof HTMLInputElement ? event.target : null;

const onCategorySelect = (event: Event) => {
  const target = getSelectTarget(event);
  if (!target) return;
  handleCategoryChange(target.value);
};

const onSubcategorySelect = (event: Event) => {
  const target = getSelectTarget(event);
  if (!target) return;
  handleSubcategoryChange(target.value);
};

const onPriceInput = (bound: 'min' | 'max', event: Event) => {
  const target = getInputTarget(event);
  if (!target) return;
  handlePriceChange(bound, target.value);
};

const onOnlyCityToggle = (event: Event) => {
  const target = getInputTarget(event);
  if (!target) return;
  handleOnlyMyCityChange(target.checked);
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
</script>

<style scoped lang="scss" src="./Filters.scss"></style>
