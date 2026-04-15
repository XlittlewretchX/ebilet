<template>
  <section class="event-card-meta" aria-label="Информация о купленных билетах">
    <p v-if="normalizedTicketCount" class="event-card-meta__text">
      Куплено билетов: <strong>{{ normalizedTicketCount }}</strong>
    </p>
    <p v-if="props.ticketSeats.length" class="event-card-meta__text">
      Места: <strong>{{ props.ticketSeats.join(', ') }}</strong>
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { normalizeTicketCount } from '../config/utils';

const props = withDefaults(
  defineProps<{
    ticketCount?: number;
    ticketSeats?: string[];
  }>(),
  {
    ticketCount: 0,
    ticketSeats: () => [],
  },
);

const normalizedTicketCount = computed(() =>
  normalizeTicketCount(props.ticketCount),
);
</script>

<style scoped lang="scss">
.event-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  background: #f8faff;

  &__text {
    margin: 0;
    color: #374151;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .event-card-meta {
    &__text {
      font-size: 0.85rem;
    }
  }
}
</style>
