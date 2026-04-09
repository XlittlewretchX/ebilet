<template>
  <section class="event-card-actions" aria-label="Действия с событием">
    <template v-if="!props.ticket">
      <button
        type="button"
        :class="[
          'event-card-actions__button',
          'event-card-actions__button--favorite',
          {
            'event-card-actions__button--favorite-active': props.favorite,
          },
        ]"
        @click="handleFavoriteClick"
      >
        {{ favoriteButtonText }}
      </button>

      <button
        type="button"
        class="event-card-actions__button event-card-actions__button--buy"
        @click="emit('buy-ticket', props.eventId)"
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
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    eventId: number;
    favorite?: boolean;
    ticket?: boolean;
  }>(),
  {
    favorite: false,
    ticket: false,
  },
);

const emit = defineEmits<{
  (event: 'add-to-favorites', id: number): void;
  (event: 'remove-from-favorites', id: number): void;
  (event: 'buy-ticket', id: number): void;
}>();

const favoriteButtonText = computed(() =>
  props.favorite ? 'Из избранного' : 'В избранное',
);

const handleFavoriteClick = () => {
  emit(
    props.favorite ? 'remove-from-favorites' : 'add-to-favorites',
    props.eventId,
  );
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
