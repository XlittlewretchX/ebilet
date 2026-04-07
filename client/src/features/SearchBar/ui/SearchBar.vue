<template>
  <section class="search-bar" aria-label="Поиск мероприятий">
    <form class="search-bar__form" role="search" @submit.prevent>
      <label
        class="search-bar__label search-bar__label--hidden"
        for="search-bar-input"
      >
        Поиск мероприятий
      </label>
      <div class="search-bar__field">
        <input
          id="search-bar-input"
          v-model.trim="search"
          class="search-bar__input"
          type="search"
          name="search"
          autocomplete="off"
          placeholder="Поиск мероприятий..."
          @keydown.esc="handleClearSearch"
        />
        <button
          v-if="search"
          type="button"
          class="search-bar__clear-button"
          aria-label="Очистить поиск"
          @click="handleClearSearch"
        >
          &#10005;
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { useSearchBarVue } from '../model/useSearchBarVue';

const { search, clearSearch } = useSearchBarVue();

const handleClearSearch = () => {
  if (!search.value) {
    return;
  }

  clearSearch();
};
</script>

<style scoped lang="scss">
.search-bar {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem 2rem;

  &__form {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  &__field {
    position: relative;
    width: 100%;
    max-width: 350px;
  }

  &__label {
    &--hidden {
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

  &__input {
    width: 100%;
    padding: 0.5rem 2.25rem 0.5rem 1rem;
    border: 1px solid #dddddd;
    border-radius: 20px;
    font-size: 1rem;
    transition: border-color 0.2s;
    outline: none;

    &[type='search']::-webkit-search-cancel-button,
    &[type='search']::-webkit-search-decoration,
    &[type='search']::-webkit-search-results-button,
    &[type='search']::-webkit-search-results-decoration {
      -webkit-appearance: none;
      appearance: none;
    }

    &::placeholder {
      color: #999999;
    }

    &:focus {
      border-color: #007bff;
    }
  }

  &__clear-button {
    position: absolute;
    top: 50%;
    right: 0.5rem;
    transform: translateY(-50%);
    width: 1.5rem;
    height: 1.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: #6b7280;
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
    transition:
      background-color 0.2s,
      color 0.2s;

    &:hover {
      background-color: #f3f4f6;
      color: #374151;
    }
  }
}

@media (max-width: 768px) {
  .search-bar {
    margin: 0 1rem;

    &__field {
      max-width: 200px;
    }
  }
}

@media (max-width: 480px) {
  .search-bar {
    margin: 0 0.5rem;

    &__field {
      max-width: 150px;
    }

    &__input {
      font-size: 0.875rem;
      padding: 0.4rem 2rem 0.4rem 0.75rem;
    }

    &__clear-button {
      right: 0.35rem;
      width: 1.35rem;
      height: 1.35rem;
      font-size: 0.9rem;
    }
  }
}
</style>
