<template>
  <section class="buy-ticket-success-step" aria-labelledby="buy-ticket-success-title" aria-live="polite">
    <header class="buy-ticket-success-step__header">
      <p class="buy-ticket-success-step__icon" aria-hidden="true">🎉</p>
      <h2 id="buy-ticket-success-title" class="buy-ticket-success-step__title">
        Покупка завершена
      </h2>
      <p class="buy-ticket-success-step__subtitle">
        Билеты успешно оформлены и уже доступны в вашем профиле.
      </p>
    </header>

    <article class="buy-ticket-success-step__summary" aria-label="Детали покупки">
      <h3 class="buy-ticket-success-step__event-title">{{ props.eventTitle }}</h3>

      <p v-if="props.places?.length" class="buy-ticket-success-step__info">
        Места: {{ props.places.join(', ') }}
      </p>

      <p v-else-if="props.count !== undefined" class="buy-ticket-success-step__info">
        Количество билетов: {{ props.count }}
      </p>
    </article>

    <nav class="buy-ticket-success-step__actions" aria-label="Дальнейшие действия">
      <button
        type="button"
        class="buy-ticket-success-step__button buy-ticket-success-step__button--primary"
        @click="emit('go-to-tickets')"
      >
        Мои билеты
      </button>

      <button
        type="button"
        class="buy-ticket-success-step__button buy-ticket-success-step__button--secondary"
        @click="emit('go-home')"
      >
        На главную
      </button>
    </nav>

    <p class="buy-ticket-success-step__thanks">
      Спасибо за покупку. Приятного посещения мероприятия!
    </p>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  eventTitle: string;
  places?: string[];
  count?: number;
}>();

const emit = defineEmits<{
  (event: 'go-to-tickets'): void;
  (event: 'go-home'): void;
}>();
</script>

<style scoped lang="scss">
.buy-ticket-success-step {
  border-radius: 16px;
  background: #f8fbff;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.08);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  align-items: center;

  &__header {
    text-align: center;
  }

  &__icon {
    margin: 0;
    font-size: 3rem;
    line-height: 1;
  }

  &__title {
    margin: 0.35rem 0 0;
    color: #0f172a;
    font-size: 1.35rem;
    font-weight: 700;
  }

  &__subtitle {
    margin: 0.45rem 0 0;
    color: #475569;
    font-size: 0.93rem;
  }

  &__summary {
    width: 100%;
    border: 1px solid #dbeafe;
    border-radius: 12px;
    background: #ffffff;
    padding: 1rem;
    text-align: center;
  }

  &__event-title {
    margin: 0;
    color: #0f172a;
    font-size: 1.1rem;
    font-weight: 700;
  }

  &__info {
    margin: 0.5rem 0 0;
    color: #1d4ed8;
    font-size: 0.95rem;
    font-weight: 600;
  }

  &__actions {
    width: 100%;
    display: flex;
    gap: 0.6rem;
  }

  &__button {
    flex: 1;
    border: none;
    border-radius: 10px;
    padding: 0.75rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease;

    &:hover {
      transform: translateY(-1px);
    }

    &--primary {
      background: #2563eb;
      color: #ffffff;
      box-shadow: 0 8px 16px rgba(37, 99, 235, 0.24);

      &:hover {
        background: #1d4ed8;
      }
    }

    &--secondary {
      background: #d7dee9;
      color: #0f172a;

      &:hover {
        background: #c6d0dd;
      }
    }
  }

  &__thanks {
    margin: 0;
    color: #64748b;
    font-size: 0.9rem;
    text-align: center;
  }
}

@media (max-width: 520px) {
  .buy-ticket-success-step {
    &__actions {
      flex-direction: column;
    }
  }
}
</style>
