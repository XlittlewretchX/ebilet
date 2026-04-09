<template>
  <main class="home-page" aria-labelledby="home-page-title">
    <div class="home-page__container">
      <header class="home-page__header">
        <h1 id="home-page-title" class="home-page__title home-page__title--visually-hidden">
          Афиша мероприятий
        </h1>
      </header>

      <div class="home-page__layout">
        <aside class="home-page__sidebar" aria-label="Фильтры">
          <FilterPanel v-model="activeFilters" />
        </aside>

        <section class="home-page__content" aria-label="Лента мероприятий">
          <Search v-model="searchQuery" class="home-page__search" />

          <DateStrip v-model="activeFilters.dateRange" />

          <EventList
            class="home-page__events"
            :active-filters="activeFilters"
            :search-query="searchQuery"
          />
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DateStrip from '@/features/DateStrip';
import FilterPanel from '@/features/FilterPanel';
import { Search } from '@/features/Search';
import { createDefaultFilters, type FilterState } from '@/features/FilterPanel';
import { EventList } from '@/widgets/EventList';

const activeFilters = ref<FilterState>(createDefaultFilters());
const searchQuery = ref('');
</script>

<style scoped lang="scss">
.home-page {
  min-height: calc(100vh - 72px);
  padding: 1.5rem 1rem 2rem;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__header {
    margin-bottom: 1rem;
  }

  &__title {
    margin: 0;
    color: #1f2937;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.2;

    &--visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  }

  &__layout {
    display: grid;
    grid-template-columns: minmax(260px, 300px) minmax(0, 1fr);
    gap: 1rem;
    align-items: start;
  }

  &__sidebar {
    position: sticky;
    top: 5.75rem;
  }

  &__content {
    min-width: 0;
  }

  &__search {
    margin-bottom: 0.75rem;
  }

  &__events {
    margin-top: 0.5rem;
  }

  @media (max-width: 960px) {
    padding: 1rem 0.75rem 1.5rem;

    &__title {
      font-size: 1.5rem;
    }

    &__layout {
      grid-template-columns: 1fr;
    }

    &__sidebar {
      position: static;
    }
  }

  @media (max-width: 480px) {
    padding: 0.75rem 0.5rem 1rem;

    &__title {
      font-size: 1.25rem;
    }
  }
}

</style>
