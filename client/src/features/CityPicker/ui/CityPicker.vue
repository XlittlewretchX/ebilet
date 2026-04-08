<template>
  <section class="city-picker" aria-label="Выбор города">
    <button
      type="button"
      class="city-picker__trigger"
      aria-haspopup="dialog"
      :aria-expanded="isEditing"
      @click="openPicker"
    >
      <span class="city-picker__icon" aria-hidden="true">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3C8.69 3 6 5.69 6 9C6 13.5 12 21 12 21C12 21 18 13.5 18 9C18 5.69 15.31 3 12 3ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span class="city-picker__name" :title="displayCity">{{ displayCity }}</span>
    </button>

    <div
      v-if="isEditing"
      class="city-picker__overlay"
      role="presentation"
      @click="closePicker"
    >
      <section
        class="city-picker__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="city-picker-title"
        @click.stop
      >
        <header class="city-picker__header">
          <h2 id="city-picker-title" class="city-picker__title">Выбор города</h2>
        </header>

        <form class="city-picker__form" @submit.prevent="handleSave">
          <label class="city-picker__label city-picker__label--hidden" for="city-picker-input">
            Введите город
          </label>
          <div class="city-picker__input-wrap">
            <input
              id="city-picker-input"
              ref="inputRef"
              v-model="cityQuery"
              class="city-picker__input"
              type="text"
              name="city"
              autocomplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-controls="city-picker-suggestions"
              :aria-expanded="hasSuggestions"
              :aria-activedescendant="activeSuggestionId"
              placeholder="Введите город"
              @input="handleInput"
              @keydown="handleKeydown"
            />

            <ul
              v-if="hasSuggestions"
              id="city-picker-suggestions"
              ref="suggestionsRef"
              class="city-picker__suggestions"
              role="listbox"
              aria-label="Список городов"
            >
              <li
                v-for="(city, index) in suggestions"
                :id="getSuggestionId(city)"
                :key="city"
                class="city-picker__suggestion-item"
                role="option"
                :aria-selected="index === activeSuggestionIndex"
              >
                <button
                  type="button"
                  :class="[
                    'city-picker__suggestion-button',
                    {
                      'city-picker__suggestion-button--active':
                        index === activeSuggestionIndex,
                    },
                  ]"
                  @click="handleSuggestionClick(city)"
                >
                  {{ city }}
                </button>
              </li>
            </ul>
          </div>

          <footer class="city-picker__actions">
            <button
              type="submit"
              class="city-picker__action-button city-picker__action-button--save"
            >
              Сохранить
            </button>
            <button
              type="button"
              class="city-picker__action-button city-picker__action-button--cancel"
              @click="closePicker"
            >
              Отмена
            </button>
          </footer>
        </form>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { DEFAULT_CITY, useCityStore } from '@/entities/City';
import { cities } from '../config/cities';
import { SUGGESTIONS_LIMIT } from '../config/constants';

const cityStore = useCityStore();
const displayCity = computed(() => cityStore.name?.trim() || DEFAULT_CITY);

const isEditing = ref(false);
const cityQuery = ref(displayCity.value);
const suggestions = ref<string[]>([]);
const activeSuggestionIndex = ref(-1);

const inputRef = ref<HTMLInputElement | null>(null);
const suggestionsRef = ref<HTMLUListElement | null>(null);
const hasSuggestions = computed(() => suggestions.value.length > 0);

const getSuggestions = (value: string): string[] => {
  const normalizedValue = value.trim().toLowerCase();
  if (!normalizedValue) {
    return [];
  }

  return cities
    .filter((city) => city.toLowerCase().startsWith(normalizedValue))
    .slice(0, SUGGESTIONS_LIMIT);
};

const saveCity = (rawValue: string): string | null => {
  const nextCity = rawValue.trim();
  if (!nextCity) {
    return null;
  }

  cityStore.setCity(nextCity);
  return nextCity;
};

const getSuggestionId = (city: string) => (
  `city-picker-suggestion-${city.toLowerCase().replace(/\s+/g, '-')}`
);

const clearSuggestions = () => {
  suggestions.value = [];
  activeSuggestionIndex.value = -1;
};

const closePicker = () => {
  isEditing.value = false;
  cityQuery.value = displayCity.value;
  clearSuggestions();
};

const openPicker = () => {
  isEditing.value = true;
  cityQuery.value = displayCity.value;
  clearSuggestions();
};

const updateQuery = (value: string) => {
  cityQuery.value = value;
  suggestions.value = getSuggestions(value);
  activeSuggestionIndex.value = -1;
};

const saveCurrentCity = (rawValue = cityQuery.value) => {
  const savedCity = saveCity(rawValue);
  if (!savedCity) {
    return false;
  }

  closePicker();
  return true;
};

const selectSuggestion = (city: string) => {
  saveCurrentCity(city);
};

const selectNextSuggestion = () => {
  if (!hasSuggestions.value) {
    return;
  }

  const nextIndex = activeSuggestionIndex.value + 1;
  activeSuggestionIndex.value = nextIndex >= suggestions.value.length ? 0 : nextIndex;
};

const selectPreviousSuggestion = () => {
  if (!hasSuggestions.value) {
    return;
  }

  const previousIndex = activeSuggestionIndex.value - 1;
  activeSuggestionIndex.value = previousIndex < 0 ? suggestions.value.length - 1 : previousIndex;
};

const selectActiveSuggestion = () => {
  const activeCity = suggestions.value[activeSuggestionIndex.value];
  if (!activeCity) {
    return false;
  }

  selectSuggestion(activeCity);
  return true;
};

const activeSuggestionId = computed(() => {
  const activeCity = suggestions.value[activeSuggestionIndex.value];
  return activeCity ? getSuggestionId(activeCity) : undefined;
});

watch(isEditing, async (isOpen) => {
  if (!isOpen) {
    return;
  }

  await nextTick();
  inputRef.value?.focus();
  inputRef.value?.select();
});

watch(
  displayCity,
  (nextCity) => {
    if (isEditing.value) {
      return;
    }

    cityQuery.value = nextCity;
  },
  { immediate: true },
);

const handleInput = (event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }

  updateQuery(event.target.value);
};

const handleSuggestionClick = (city: string) => {
  selectSuggestion(city);
};

const handleSave = () => {
  saveCurrentCity();
};

const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      selectNextSuggestion();
      break;
    case 'ArrowUp':
      event.preventDefault();
      selectPreviousSuggestion();
      break;
    case 'Enter':
      event.preventDefault();
      if (!selectActiveSuggestion()) {
        saveCurrentCity();
      }
      break;
    case 'Escape':
      if (hasSuggestions.value) {
        clearSuggestions();
      } else {
        closePicker();
      }
      break;
  }
};

const handleDocumentMouseDown = (event: MouseEvent) => {
  if (!isEditing.value || !hasSuggestions.value) {
    return;
  }

  if (!(event.target instanceof Node)) {
    return;
  }

  const clickedInsideSuggestions =
    suggestionsRef.value?.contains(event.target) ?? false;
  const clickedInsideInput = inputRef.value?.contains(event.target) ?? false;

  if (!clickedInsideSuggestions && !clickedInsideInput) {
    clearSuggestions();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleDocumentMouseDown);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleDocumentMouseDown);
});
</script>

<style scoped lang="scss">

.city-picker {
  position: relative;
  display: flex;
  align-items: center;

  &__trigger {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.75rem;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: #333333;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f1f1f1;
    }
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #007bff;
  }

  &__name {
    max-width: 10rem;
    font-size: 1rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 2vh;
    background: rgba(0, 0, 0, 0.2);
    overflow-y: auto;
  }

  &__dialog {
    width: min(420px, calc(100vw - 2rem));
    margin-bottom: 2rem;
    padding: 1.25rem;
    border-radius: 10px;
    background: #ffffff;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.16);
  }

  &__header {
    margin-bottom: 0.75rem;
  }

  &__title {
    margin: 0;
    font-size: 1.1rem;
    color: #1f2937;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__label {
    &--hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      border: 0;
      padding: 0;
      white-space: nowrap;
      clip: rect(0, 0, 0, 0);
      overflow: hidden;
    }
  }

  &__input-wrap {
    position: relative;
  }

  &__input {
    width: 100%;
    padding: 0.55rem 0.95rem;
    border: 1px solid #d1d5db;
    border-radius: 999px;
    font-size: 0.95rem;
    color: #1f2937;
    outline: none;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: #007bff;
    }
  }

  &__suggestions {
    position: absolute;
    left: 0;
    right: 0;
    top: calc(100% + 0.35rem);
    margin: 0;
    padding: 0.35rem 0;
    list-style: none;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    max-height: 220px;
    overflow-y: auto;
    z-index: 2;
  }

  &__suggestion-item {
    margin: 0;
    padding: 0;
  }

  &__suggestion-button {
    width: 100%;
    border: none;
    background: transparent;
    color: #1f2937;
    padding: 0.45rem 0.9rem;
    text-align: left;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f3f4f6;
    }

    &--active {
      background-color: #eff6ff;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__action-button {
    min-width: 96px;
    border: none;
    border-radius: 6px;
    padding: 0.45rem 0.95rem;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &--save {
      background: #007bff;
      color: #ffffff;

      &:hover {
        background: #0056b3;
      }
    }

    &--cancel {
      background: #f1f1f1;
      color: #333333;

      &:hover {
        background: #e2e2e2;
      }
    }
  }
}

@media (max-width: 480px) {
  .city-picker {
    &__name {
      font-size: 0.875rem;
    }

    &__dialog {
      width: calc(100vw - 1.25rem);
      padding: 1rem;
    }

    &__input {
      font-size: 0.875rem;
    }

    &__suggestion-button {
      font-size: 0.875rem;
    }

    &__action-button {
      min-width: 80px;
      font-size: 0.875rem;
    }
  }
}
</style>
