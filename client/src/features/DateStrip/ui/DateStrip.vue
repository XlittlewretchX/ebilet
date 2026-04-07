<template>
  <section class="date-strip" aria-label="Выбор даты мероприятия">
    <header class="date-strip__header">
      <nav class="date-strip__month-nav" aria-label="Навигация по месяцам">
        <button
          type="button"
          class="date-strip__nav-button"
          aria-label="Предыдущий месяц"
          @click="handleMonthChange('prev')"
        >
          &#8592;
        </button>
        <p class="date-strip__month-label">{{ months[month] }} {{ year }}</p>
        <button
          type="button"
          class="date-strip__nav-button"
          aria-label="Следующий месяц"
          @click="handleMonthChange('next')"
        >
          &#8594;
        </button>
      </nav>
    </header>

    <div class="date-strip__content">
      <ul class="date-strip__days" role="list">
        <li
          v-for="date in days"
          :key="date.toISOString()"
          class="date-strip__day-item"
        >
          <button
            type="button"
            :class="[
              'date-strip__day-button',
              { 'date-strip__day-button--selected': isSelected(date) },
              { 'date-strip__day-button--today': isToday(date) },
            ]"
            :aria-pressed="isSelected(date)"
            @click="handleDateClick(date)"
          >
            <span class="date-strip__weekday">{{ getWeekday(date) }}</span>
            <time class="date-strip__day-number" :datetime="toIsoDate(date)">
              {{ date.getDate() }}
            </time>
          </button>
        </li>
      </ul>

      <button
        type="button"
        class="date-strip__calendar-button"
        @click="openCalendar"
      >
        Открыть календарь
      </button>
    </div>

    <CalendarModal
      :is-open="calendarOpen"
      :selected-date="selectedDate"
      :selected-range="selectedRange"
      @calendar-change="handleCalendarChange"
      @close="closeCalendar"
      @clear="handleClear"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import { getMonthDays, formatDate } from '../config/utils';
import type { SelectedDateRange } from '../model/types';
import { months, weekDays } from '../config/constants';
import { useDateStripVue } from '../model/useDateStripVue';
import CalendarModal from './CalendarModal.vue';

const props = defineProps<{
  modelValue: SelectedDateRange;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: SelectedDateRange): void;
}>();

const {
  calendarOpen,
  selectedDate,
  selectedRange,
  month,
  year,
  openCalendar,
  closeCalendar,
  handleDateClick,
  handleCalendarChange,
  handleMonthChange,
  handleClear,
} = useDateStripVue({
  modelValue: toRef(props, 'modelValue'),
  onDateRangeChange: (dateRange) => emit('update:modelValue', dateRange),
});

const days = computed(() => getMonthDays(year.value, month.value));
const today = new Date();

const isToday = (date: Date) => date.toDateString() === today.toDateString();

const isSelected = (date: Date) =>
  selectedDate.value
    ? date.toDateString() === selectedDate.value.toDateString()
    : false;

const getWeekday = (date: Date) => weekDays[(date.getDay() + 6) % 7];

const toIsoDate = (date: Date) => formatDate(date);
</script>

<style scoped lang="scss">

.date-strip {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}

.date-strip__header {
  flex-shrink: 0;
}

.date-strip__month-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-strip__nav-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid transparent;
  border-radius: 50%;
  background-color: transparent;
  color: #2563eb;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.date-strip__nav-button:hover {
  background-color: #e3eaff;
  border-color: #c7d8ff;
}

.date-strip__month-label {
  margin: 0;
  min-width: 9rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
}

.date-strip__content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.date-strip__days {
  display: flex;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-x: auto;
  scrollbar-width: thin;
}

.date-strip__day-item {
  flex: 0 0 auto;
}

.date-strip__day-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  min-width: 3rem;
  padding: 0.3rem 0.7rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background-color: transparent;
  color: #1f2937;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.date-strip__day-button:hover {
  background-color: #f1f5ff;
}

.date-strip__day-button--selected {
  background-color: #2563eb;
  color: #ffffff;
}

.date-strip__day-button--today:not(.date-strip__day-button--selected) {
  border-color: #2563eb;
  color: #2563eb;
}

.date-strip__weekday {
  font-size: 0.72rem;
  font-weight: 500;
  color: #94a3b8;
}

.date-strip__day-button--selected .date-strip__weekday {
  color: rgba(255, 255, 255, 0.82);
}

.date-strip__day-number {
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.1;
}

.date-strip__calendar-button {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.95rem;
  border: 1px solid #c7d8ff;
  border-radius: 8px;
  background-color: #eaf1ff;
  color: #1746a2;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.date-strip__calendar-button::before {
  content: '\1F4C5';
  font-size: 1rem;
}

.date-strip__calendar-button:hover {
  background-color: #dce8ff;
  border-color: #b0c6ff;
}

@media (max-width: 768px) {
  .date-strip {
    flex-direction: column;
    align-items: stretch;
    padding: 0.9rem;
  }

  .date-strip__month-label {
    min-width: auto;
  }

  .date-strip__content {
    flex-direction: column;
    align-items: stretch;
  }

  .date-strip__calendar-button {
    justify-content: center;
  }
}

</style>
