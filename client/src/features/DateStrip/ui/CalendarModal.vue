<template>
  <!-- в рамках html верстки сделать компонент -->
  <Teleport to="body">
    <section v-if="isOpen" class="calendar-modal" @click="emit('close')">
      <aside
        class="calendar-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-modal-title"
        @click.stop
      >
        <section
          class="calendar-modal__calendar"
          aria-labelledby="calendar-modal-title"
        >
          <h2 id="calendar-modal-title" class="calendar-modal__title">
            Выбор периода
          </h2>
          <VueDatePicker
            v-model="pickerValue"
            class="calendar-modal__picker"
            :locale="ru"
            :range="{ partialRange: true }"
            :min-date="new Date()"
            :disable-year-select="true"
            :time-config="{ enableTimePicker: false }"
            inline
            auto-apply
            @update:model-value="handleDatePickerChange"
          />
        </section>

        <footer class="calendar-modal__footer">
          <button
            type="button"
            class="calendar-modal__action calendar-modal__action--secondary"
            @click="emit('clear')"
          >
            Очистить
          </button>
          <button
            type="button"
            class="calendar-modal__action calendar-modal__action--primary"
            @click="emit('close')"
          >
            Закрыть
          </button>
        </footer>
      </aside>
    </section>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRef, watch } from 'vue';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ru } from 'date-fns/locale';
import type { DatePickerValue, DateRange } from '../model/types';

const props = defineProps<{
  isOpen: boolean;
  selectedDate: Date | null;
  selectedRange: DateRange;
}>();

const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'clear'): void;
  (event: 'calendar-change', payload: DatePickerValue): void;
}>();

const isOpen = toRef(props, 'isOpen');
const selectedDate = toRef(props, 'selectedDate');
const selectedRange = toRef(props, 'selectedRange');

type PickerValue = DatePickerValue | null;

const pickerValue = ref<PickerValue>(null);

const normalizedModel = computed<PickerValue>(() => {
  const [rangeStart, rangeEnd] = selectedRange.value;

  if (rangeStart && rangeEnd) return [rangeStart, rangeEnd];
  if (rangeStart) return [rangeStart, null];
  if (selectedDate.value) return [selectedDate.value, null];

  return null;
});

const handleDatePickerChange = (value: PickerValue) => {
  if (value === null) {
    // DatePicker может вернуть null при очистке значения (например, через UI библиотеки).
    emit('clear');
    return;
  }

  if (Array.isArray(value)) {
    const [start, end] = value;
    emit('calendar-change', [start, end ?? null]);
    return;
  }

  emit('calendar-change', value);
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    emit('close');
  }
};

watch(
  normalizedModel,
  (nextValue) => {
    pickerValue.value = nextValue;
  },
  { immediate: true },
);

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped lang="scss">

.calendar-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
}

.calendar-modal__dialog {
  width: 100%;
  max-width: 25rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  padding: 1.25rem;
}

.calendar-modal__calendar {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}

.calendar-modal__title {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
}

.calendar-modal__picker {
  --dp-menu-min-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.calendar-modal__picker:deep(.dp__main),
.calendar-modal__picker:deep(.dp__menu),
.calendar-modal__picker:deep(.dp__instance_calendar),
.calendar-modal__picker:deep(.dp__calendar) {
  width: 100%;
}

.calendar-modal__picker:deep(.dp__menu) {
  min-width: 100%;
  width: 100%;
  border: none;
  border-radius: 12px;
  box-shadow: none;
  background: #ffffff;
}

.calendar-modal__picker:deep(.dp__menu_inner),
.calendar-modal__picker:deep(.dp__calendar_wrap) {
  width: 100%;
}

.calendar-modal__picker:deep(.dp__month_year_row) {
  background: #f8fbff;
  color: #1f2937;
  border-radius: 12px 12px 0 0;
  min-height: 3rem;
  padding: 0 0.45rem;
  border-bottom: 1px solid #dbe7ff;
}

.calendar-modal__picker:deep(.dp__inner_nav) {
  width: 1.95rem;
  height: 1.95rem;
  color: #2563eb !important;
  background: #e3eaff;
  border: 1px solid #c7d8ff;
}

.calendar-modal__picker:deep(.dp__inner_nav:hover) {
  background: #d6e5ff;
  color: #1746a2 !important;
}

.calendar-modal__picker:deep(.dp__month_year_select) {
  color: #1f2937 !important;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.15rem 0.4rem;
}

.calendar-modal__picker:deep(.dp__month_year_select:hover) {
  background: #e8f0ff;
  color: #1746a2 !important;
}

.calendar-modal__picker:deep(.dp__month_year_wrap) {
  gap: 0.25rem;
}

.calendar-modal__picker:deep(.dp__inner_nav svg) {
  color: currentColor;
}

.calendar-modal__picker:deep(.dp__overlay_cell) {
  color: #1f2937;
}

.calendar-modal__picker:deep(.dp__overlay_cell:hover) {
  background: #e8f0ff;
  color: #1746a2;
}

.calendar-modal__picker:deep(.dp__overlay_cell_active) {
  background: #2563eb;
  color: #ffffff;
}

.calendar-modal__picker:deep(.dp__calendar_header_item) {
  color: #dbe7ff;
  font-weight: 500;
  font-size: 0.84rem;
}

.calendar-modal__picker:deep(.dp__calendar_header_separator) {
  background: transparent;
}

.calendar-modal__picker:deep(.dp__calendar_item) {
  color: #1f2937;
}

.calendar-modal__picker:deep(.dp__cell_inner) {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 999px;
  font-size: 0.92rem;
  transition: all 0.2s ease;
}

.calendar-modal__picker:deep(.dp__cell_inner:hover) {
  background: #e3eaff;
  color: #2563eb;
}

.calendar-modal__picker:deep(.dp__today) {
  border-color: #2563eb;
  color: #2563eb;
  background: #e3eaff;
}

.calendar-modal__picker:deep(.dp__active_date),
.calendar-modal__picker:deep(.dp__range_start),
.calendar-modal__picker:deep(.dp__range_end) {
  background: #2563eb;
  color: #ffffff;
}

.calendar-modal__picker:deep(.dp__range_between) {
  background: #dbe7ff;
  color: #2563eb;
  border-color: #dbe7ff;
}

.calendar-modal__footer {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.calendar-modal__action {
  width: 100%;
  height: 2.35rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.calendar-modal__action--primary {
  background: #2563eb;
  color: #ffffff;
}

.calendar-modal__action--primary:hover {
  background: #1746a2;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.2);
}

.calendar-modal__action--secondary {
  background: #e3eaff;
  color: #2563eb;
}

.calendar-modal__action--secondary:hover {
  background: #d3e2ff;
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .calendar-modal__dialog {
    max-width: 20rem;
    padding: 1rem;
  }

  .calendar-modal__picker:deep(.dp__cell_inner) {
    width: 2rem;
    height: 2rem;
    font-size: 0.84rem;
  }

  .calendar-modal__picker:deep(.dp__calendar_header_item) {
    font-size: 0.75rem;
  }
}
</style>