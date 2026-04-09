<template>
  <section class="event-card-actions" aria-label="Действия с событием">
    <template v-if="!isTicket">
      <button
        type="button"
        :class="[
          'event-card-actions__button',
          'event-card-actions__button--favorite',
          {
            'event-card-actions__button--favorite-active': isFavorite,
          },
        ]"
        @click="handleFavoriteClick"
      >
        {{ favoriteButtonText }}
      </button>

      <button
        type="button"
        class="event-card-actions__button event-card-actions__button--buy"
        @click="handleBuyTicket"
      >
        Купить билет
      </button>
    </template>

    <p v-else class="event-card-actions__ticket-status" aria-live="polite">
      Билет куплен
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';

const props = withDefaults(
  defineProps<{
    eventId: number;
    isFavorite?: boolean;
    isTicket?: boolean;
  }>(),
  {
    isFavorite: false,
    isTicket: false,
  },
);

const emit = defineEmits<{
  (event: 'add-to-favorites', id: number): void;
  (event: 'remove-from-favorites', id: number): void;
  (event: 'buy-ticket', id: number): void;
}>();

const eventId = toRef(props, 'eventId');
const isFavorite = computed(() => props.isFavorite);
const isTicket = computed(() => props.isTicket);
const favoriteAction = computed<'add-to-favorites' | 'remove-from-favorites'>(() =>
  isFavorite.value ? 'remove-from-favorites' : 'add-to-favorites',
);
const favoriteButtonText = computed(() =>
  isFavorite.value ? 'Из избранного' : 'В избранное',
);

const emitFavoriteAction = (action: 'add-to-favorites' | 'remove-from-favorites') => {
  emit(action, eventId.value);
};

const emitBuyTicket = () => {
  emit('buy-ticket', eventId.value);
};

const handleFavoriteClick = () => {
  emitFavoriteAction(favoriteAction.value);
};

const handleBuyTicket = () => {
  emitBuyTicket();
};
</script>

<style scoped lang="scss">
.event-card-actions {
  display: flex;
  gap: 0.75rem;

  &__button {
    flex: 1;
    border: none;
    border-radius: 12px;
    padding: 0.75rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      background-color 0.2s ease,
      border-color 0.2s ease;

    &:active {
      transform: translateY(0);
    }

    &--favorite {
      background: #f8faff;
      border: 2px solid #e3eaff;
      color: #2563eb;

      &:hover {
        background: #e3eaff;
        transform: translateY(-2px);
      }
    }

    &--favorite-active {
      background: #fff1f1;
      border-color: #ffd6d6;
      color: #dc3545;

      &:hover {
        background: #ffe4e4;
        border-color: #dc3545;
      }
    }

    &--buy {
      background: #2563eb;
      border: 2px solid #2563eb;
      color: #ffffff;

      &:hover {
        background: #1d4ed8;
        transform: translateY(-2px);
      }
    }
  }

  &__ticket-status {
    margin: 0;
    color: #22c55e;
    font-size: 1rem;
    font-weight: 600;
  }
}

@media (max-width: 768px) {
  .event-card-actions {
    gap: 0.5rem;

    &__button {
      padding: 0.6rem;
      font-size: 0.85rem;
    }
  }
}

@media (max-width: 480px) {
  .event-card-actions {
    gap: 0.35rem;

    &__button {
      padding: 0.4rem;
      border-radius: 8px;
      font-size: 0.8rem;
    }
  }
}
</style>
