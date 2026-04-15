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

    <aside :class="['filters__panel', { 'filters__panel--open': isOpen }]">
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
            <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
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
import { computed, onUnmounted, ref, toRef, watch } from 'vue';
import { capitalize } from '../config/utils';
import { categoryOptions, subcategoriesMap } from '../model/constants';
import { createDefaultFilters, type FilterState } from '../model/types';

const props = defineProps<{
  modelValue: FilterState;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: FilterState): void;
}>();

const filters = toRef(props, 'modelValue');
const isOpen = ref(false);

const availableSubcategories = computed(() =>
  filters.value.category && filters.value.category !== 'all'
    ? subcategoriesMap[filters.value.category] ?? []
    : [],
);

const handleCategoryChange = (value: string) => {
  emit('update:modelValue', {
    ...filters.value,
    category: value,
    subcategory: '',
  });
};

const handleSubcategoryChange = (value: string) => {
  emit('update:modelValue', {
    ...filters.value,
    subcategory: value.toLowerCase(),
  });
};

const handlePriceChange = (bound: 'min' | 'max', value: string) => {
  const parsed = Number(value);
  const safeNumber = Number.isFinite(parsed) ? parsed : 0;

  emit('update:modelValue', {
    ...filters.value,
    priceRange: {
      ...filters.value.priceRange,
      [bound]: safeNumber,
    },
  });
};

const handleOnlyMyCityChange = (value: boolean) => {
  emit('update:modelValue', {
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
  emit('update:modelValue', createDefaultFilters());
  closeFilters();
};

watch(isOpen, (open) => {
  document.body.classList.toggle('filters-mobile-locked', open);
});

onUnmounted(() => {
  document.body.classList.remove('filters-mobile-locked');
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
</script>

<style scoped lang="scss">
.filters {
  position: relative;

  &__toggle {
    display: none;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    margin-bottom: 1rem;
    padding: 0.875rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: #ffffff;
    color: #4a5568;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #f8fafc;
    }
  }

  &__toggle-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  &__backdrop {
    display: none;
  }

  &__panel {
    background: #ffffff;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &--open {
      transform: translateX(0);
    }
  }

  &__header {
    display: none;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding: 1rem;
    background: #ffffff;
    position: sticky;
    top: 0;
    z-index: 2;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &__title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #333333;
  }

  &__close-button {
    width: 2.5rem;
    height: 2.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    background: none;
    color: #4a5568;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background: #f7fafc;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
  }

  &__group {
    margin: 0 0 1.5rem;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  &__legend {
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  &__label {
    display: block;
    margin: 0 0 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
  }

  &__select {
    width: 100%;
    max-width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background-color: #ffffff;
    color: #4a5568;
    font-size: 0.875rem;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234a5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;

    &:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    }
  }

  &__price-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  &__input {
    width: 100%;
    max-width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    color: #4a5568;
    font-size: 0.875rem;

    &:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    }

    &::placeholder {
      color: #a0aec0;
    }
  }

  &__checkbox-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0;
  }

  &__checkbox {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid #e2e8f0;
    border-radius: 4px;
    appearance: none;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    }

    &:checked {
      background-color: #2563eb;
      border-color: #2563eb;

      &::after {
        content: '';
        position: absolute;
        left: 4px;
        top: 1px;
        width: 6px;
        height: 10px;
        border: solid #ffffff;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
    }
  }

  &__checkbox-label {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
  }

  &__reset-button {
    width: 100%;
    margin-top: 1.5rem;
    padding: 0.875rem 0;
    border: none;
    border-radius: 12px;
    background: #e3eaff;
    color: #2563eb;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #d1e0ff;
    }
  }

  @media (max-width: 768px) {
    &__toggle {
      display: inline-flex;
    }

    &__backdrop {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 999;
      border: none;
      background: rgba(15, 23, 42, 0.35);
    }

    &__panel {
      position: fixed;
      inset: 0;
      z-index: 1000;
      width: 100%;
      max-width: 100vw;
      padding: 1rem;
      border-radius: 0;
      background: #f8f9fa;
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
      overflow-y: auto;
    }

    &__header {
      display: flex;
    }

    &__group {
      margin-bottom: 0.75rem;
      padding: 0.75rem;
    }

    &__label {
      margin-bottom: 0.75rem;
      font-size: 0.8rem;
    }

    &__select,
    &__input {
      font-size: 0.9rem;
      padding: 0.875rem;
    }

    &__price-grid {
      gap: 0.5rem;
    }

    &__reset-button {
      margin-top: 1rem;
      padding: 1rem 0;
      font-size: 0.95rem;
    }
  }

  @media (max-width: 340px) {
    &__price-grid {
      grid-template-columns: 1fr;
    }

    &__select,
    &__input {
      font-size: 0.85rem;
      padding: 0.75rem;
    }
  }
}

:global(body.filters-mobile-locked) {
  overflow: hidden;
}

</style>
