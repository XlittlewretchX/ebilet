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
import { getMonthDays, formatDate } from '../lib/utils';
import type { DateStripModelProps, SelectedDateRange } from '../model/types';
import { months, weekDays } from '../model/types';
import { useDateStripVue } from '../model/useDateStripVue';
import CalendarModal from './CalendarModal.vue';

const props = defineProps<DateStripModelProps>();

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

<style scoped lang="scss" src="./DateStrip.scss"></style>
