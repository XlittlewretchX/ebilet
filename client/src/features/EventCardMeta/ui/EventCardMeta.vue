<template>
  <section
    v-if="hasTicketMeta"
    class="event-card-meta"
    aria-label="Информация о купленных билетах"
  >
    <p v-if="normalizedTicketCount > 0" class="event-card-meta__text">
      Куплено билетов: <strong>{{ normalizedTicketCount }}</strong>
    </p>
    <p v-if="hasTicketSeats" class="event-card-meta__text">
      Места: <strong>{{ joinedTicketSeats }}</strong>
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import {
  formatTicketSeats,
  normalizeTicketCount,
  normalizeTicketSeats,
} from '../config/utils';

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

const ticketCount = toRef(props, 'ticketCount');
const ticketSeats = computed(() =>
  Array.isArray(props.ticketSeats) ? props.ticketSeats : [],
);

const normalizedTicketCount = computed(() =>
  normalizeTicketCount(ticketCount.value),
);
const normalizedTicketSeats = computed(() =>
  normalizeTicketSeats(ticketSeats.value),
);
const hasTicketSeats = computed(() => normalizedTicketSeats.value.length > 0);
const hasTicketMeta = computed(
  () => normalizedTicketCount.value > 0 || hasTicketSeats.value,
);

const joinedTicketSeats = computed(() =>
  formatTicketSeats(normalizedTicketSeats.value),
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
