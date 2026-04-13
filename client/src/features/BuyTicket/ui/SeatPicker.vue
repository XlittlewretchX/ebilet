<template>
  <section class="buy-ticket-picker" aria-labelledby="buy-ticket-picker-title">
    <header class="buy-ticket-picker__header">
      <h2 id="buy-ticket-picker-title" class="buy-ticket-picker__title">
        {{ isSeatMode ? 'Выбор мест' : 'Количество билетов' }}
      </h2>
      <p class="buy-ticket-picker__subtitle">
        {{
          isSeatMode
            ? 'Отметьте свободные места на схеме зала.'
            : 'Укажите количество билетов для покупки.'
        }}
      </p>
    </header>

    <p
      v-if="isSeatMode && isLoading"
      class="buy-ticket-picker__state buy-ticket-picker__state--loading"
    >
      Загружаем схему зала...
    </p>

    <p
      v-else-if="isSeatMode && errorMessage"
      class="buy-ticket-picker__state buy-ticket-picker__state--error"
      role="alert"
    >
      {{ errorMessage }}
    </p>

    <section v-else class="buy-ticket-picker__content">
      <section v-if="!isSeatMode" class="buy-ticket-picker__count" aria-label="Выбор количества">
        <div class="buy-ticket-picker__count-controls">
          <button
            type="button"
            class="buy-ticket-picker__count-button"
            :disabled="count <= 1"
            aria-label="Уменьшить количество билетов"
            @click="count > 1 && (count -= 1)"
          >
            −
          </button>

          <input
            class="buy-ticket-picker__count-input"
            type="number"
            min="1"
            :max="MAX_COUNT"
            step="1"
            inputmode="numeric"
            v-model.number="count"
          />

          <button
            type="button"
            class="buy-ticket-picker__count-button"
            :disabled="count >= MAX_COUNT"
            aria-label="Увеличить количество билетов"
            @click="count < MAX_COUNT && (count += 1)"
          >
            +
          </button>
        </div>

        <p class="buy-ticket-picker__hint">
          Максимум {{ MAX_COUNT }} билетов за одну покупку.
        </p>
      </section>

      <section v-else class="buy-ticket-picker__seats" aria-label="Схема мест">
        <ul class="buy-ticket-picker__legend" aria-label="Обозначения мест">
          <li class="buy-ticket-picker__legend-item">
            <span class="buy-ticket-picker__legend-box buy-ticket-picker__legend-box--free" />
            <span>Свободно</span>
          </li>
          <li class="buy-ticket-picker__legend-item">
            <span
              class="buy-ticket-picker__legend-box buy-ticket-picker__legend-box--selected"
            />
            <span>Выбрано</span>
          </li>
          <li class="buy-ticket-picker__legend-item">
            <span class="buy-ticket-picker__legend-box buy-ticket-picker__legend-box--booked" />
            <span>Занято</span>
          </li>
        </ul>

        <section class="buy-ticket-picker__scheme buy-ticket-picker__scheme--grid" aria-label="Схема мест по рядам">
          <p class="buy-ticket-picker__scene">Сцена</p>

          <div class="buy-ticket-picker__grid">
            <div
              v-for="row in gridRows"
              :key="row.rowLabel"
              class="buy-ticket-picker__grid-row"
            >
              <span class="buy-ticket-picker__row-label">{{ row.rowLabel }}</span>

              <button
                v-for="seat in row.seats"
                :key="seat"
                type="button"
                class="buy-ticket-picker__grid-seat"
                :class="{
                  'buy-ticket-picker__grid-seat--selected': isSelectedSeat(seat),
                  'buy-ticket-picker__grid-seat--booked': isBookedSeat(seat),
                }"
                :disabled="isBookedSeat(seat)"
                :aria-label="resolveSeatAriaLabel(seat)"
                :aria-pressed="isSelectedSeat(seat)"
                @click="toggleSeatSelection(seat)"
              >
                {{ seat }}
              </button>
            </div>
          </div>
        </section>

        <p v-if="selectedSeats.length" class="buy-ticket-picker__selected">
          Вы выбрали: <strong>{{ selectedSeats.join(', ') }}</strong>
        </p>
        <p v-if="selectedSeats.length === MAX_SELECT" class="buy-ticket-picker__hint">
          Достигнут лимит: {{ MAX_SELECT }} мест за одну покупку.
        </p>
      </section>

      <footer class="buy-ticket-picker__footer">
        <button
          type="button"
          class="buy-ticket-picker__next-button"
          :disabled="isSeatMode ? selectedSeats.length === 0 : count < 1"
          @click="handleSubmit"
        >
          Продолжить
        </button>
      </footer>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { eventAPI } from '@/shared/api/api';

interface SeatSelection {
  count: number;
  seats: string[] | null;
}

const MAX_COUNT = 10;
const MAX_SELECT = 10;

const props = defineProps<{
  eventId: number;
  seatingType: 'none' | 'grid' | 'circle';
  initialCount: number;
  initialSeats: string[] | null;
}>();

const emit = defineEmits<{
  (event: 'submit', payload: SeatSelection): void;
}>();

const isSeatMode = computed(() => props.seatingType !== 'none');

const count = ref(props.initialCount);
const bookedSeats = ref<string[]>([]);
const selectedSeats = ref<string[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');

const loadBookedSeats = async () => {
  if (!isSeatMode.value) {
    bookedSeats.value = [];
    selectedSeats.value = [];
    errorMessage.value = '';
    isLoading.value = false;
    return;
  }

  if (!Number.isFinite(props.eventId) || props.eventId <= 0) {
    bookedSeats.value = [];
    selectedSeats.value = [];
    errorMessage.value = 'Некорректный идентификатор события';
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    bookedSeats.value = await eventAPI.getBookedSeats(props.eventId);
    selectedSeats.value = selectedSeats.value.filter(
      (seat) => !bookedSeats.value.includes(seat),
    );
  } catch {
    errorMessage.value = 'Ошибка загрузки схемы мест';
  } finally {
    isLoading.value = false;
  }
};

const toggleSeatSelection = (seat: string) => {
  if (isBookedSeat(seat)) {
    return;
  }

  if (isSelectedSeat(seat)) {
    selectedSeats.value = selectedSeats.value.filter(
      (selectedSeat) => selectedSeat !== seat,
    );
    return;
  }

  if (selectedSeats.value.length < MAX_SELECT) {
    selectedSeats.value = [...selectedSeats.value, seat];
  }
};

watch(
  () => props.initialCount,
  (nextCount) => {
    count.value = nextCount;
  },
);

watch(
  () => props.initialSeats,
  (nextSeats) => {
    selectedSeats.value = nextSeats ?? [];
  },
  { immediate: true },
);

watch(
  [() => props.eventId, isSeatMode],
  () => {
    void loadBookedSeats();
  },
  { immediate: true },
);

const gridRows = computed(() =>
  Array.from({ length: 5 }, (_, rowIndex) => {
    const rowLabel = String.fromCharCode(65 + rowIndex);

    return {
      rowLabel,
      seats: Array.from({ length: 8 }, (_, seatIndex) => `${rowLabel}${seatIndex + 1}`),
    };
  }),
);

const isBookedSeat = (seat: string) => bookedSeats.value.includes(seat);
const isSelectedSeat = (seat: string) => selectedSeats.value.includes(seat);

const resolveSeatAriaLabel = (seat: string) => {
  if (isBookedSeat(seat)) {
    return `Место ${seat}, занято`;
  }

  if (isSelectedSeat(seat)) {
    return `Место ${seat}, выбрано`;
  }

  return `Место ${seat}, свободно`;
};

const handleSubmit = () => {
  emit(
    'submit',
    isSeatMode.value
      ? {
          count: selectedSeats.value.length,
          seats: [...selectedSeats.value],
        }
      : {
          count: count.value,
          seats: null,
        },
  );
};
</script>

<style scoped lang="scss">
.buy-ticket-picker {
  border-radius: 16px;
  background: #f8fbff;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.08);
  padding: 1.25rem;

  &__header {
    margin-bottom: 1rem;
    text-align: center;
  }

  &__title {
    margin: 0;
    color: #0f172a;
    font-size: 1.4rem;
    font-weight: 700;
  }

  &__subtitle {
    margin: 0.45rem 0 0;
    color: #475569;
    font-size: 0.93rem;
  }

  &__state {
    margin: 0;
    padding: 0.85rem;
    border-radius: 12px;

    &--loading {
      background: #eff6ff;
      color: #1d4ed8;
    }

    &--error {
      background: #fff1f2;
      color: #b91c1c;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  &__count-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
  }

  &__count-button {
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    background: #ffffff;
    color: #1d4ed8;
    font-size: 1.35rem;
    font-weight: 700;
    cursor: pointer;

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  }

  &__count-input {
    width: 4.8rem;
    height: 2.5rem;
    border: 1px solid #93c5fd;
    border-radius: 10px;
    text-align: center;
    color: #1d4ed8;
    font-size: 1.1rem;
    font-weight: 700;
    appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      appearance: none;
      margin: 0;
    }
  }

  &__legend {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.9rem;
  }

  &__legend-item {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: #334155;
    font-size: 0.9rem;
    font-weight: 600;
  }

  &__legend-box {
    width: 1rem;
    height: 1rem;
    border-radius: 4px;
    border: 1px solid #94a3b8;

    &--free {
      background: #ffffff;
    }

    &--selected {
      background: #2563eb;
      border-color: #1d4ed8;
    }

    &--booked {
      background: #cbd5e1;
    }
  }

  &__scheme {
    border: 1px solid #dbeafe;
    border-radius: 14px;
    background: #ffffff;
    padding: 0.9rem;
  }

  &__scene {
    margin: 0 0 0.6rem;
    text-align: center;
    color: #0f172a;
    font-size: 1rem;
    font-weight: 700;
  }

  &__grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  &__grid-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__row-label {
    width: 1.4rem;
    text-align: center;
    color: #475569;
    font-size: 0.85rem;
    font-weight: 700;
  }

  &__grid-seat {
    width: 2.2rem;
    height: 2.2rem;
    border: 1px solid #94a3b8;
    border-radius: 8px;
    background: #ffffff;
    color: #0f172a;
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;

    &--selected {
      border-color: #1d4ed8;
      background: #2563eb;
      color: #ffffff;
      font-weight: 700;
    }

    &--booked {
      cursor: not-allowed;
      border-color: #94a3b8;
      background: #cbd5e1;
      color: #64748b;
    }
  }

  &__selected {
    margin: 0;
    color: #1d4ed8;
    font-size: 0.95rem;
    text-align: center;
  }

  &__hint {
    margin: 0;
    color: #64748b;
    font-size: 0.9rem;
    text-align: center;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
  }

  &__next-button {
    border: none;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    background: #2563eb;
    color: #ffffff;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

@media (max-width: 560px) {
  .buy-ticket-picker {
    &__grid-seat {
      width: 1.95rem;
      height: 1.95rem;
      font-size: 0.68rem;
    }
  }
}
</style>
