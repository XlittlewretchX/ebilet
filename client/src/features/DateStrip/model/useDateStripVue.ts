import { ref, watch, type Ref } from 'vue';
import type { DatePickerValue, DateRange, SelectedDateRange } from './types';
import { formatDate, parseDateValue } from '../config/utils';

interface UseDateStripVueParams {
  modelValue: Ref<SelectedDateRange>;
  onDateRangeChange: (value: SelectedDateRange) => void;
}

export const useDateStripVue = ({
  modelValue,
  onDateRangeChange,
}: UseDateStripVueParams) => {
  const today = new Date();

  const calendarOpen = ref(false);
  const selectedDate = ref<Date | null>(null);
  const selectedRange = ref<DateRange>([null, null]);
  const month = ref(today.getMonth());
  const year = ref(today.getFullYear());

  const openCalendar = () => {
    calendarOpen.value = true;
  };

  const closeCalendar = () => {
    calendarOpen.value = false;
  };

  watch(
    modelValue,
    (nextRange) => {
      const startDate = parseDateValue(nextRange.start);
      const endDate = parseDateValue(nextRange.end);

      if (startDate && endDate) {
        if (nextRange.start === nextRange.end) {
          selectedDate.value = startDate;
          selectedRange.value = [null, null];
        } else {
          selectedDate.value = null;
          selectedRange.value = [startDate, endDate];
        }

        month.value = startDate.getMonth();
        year.value = startDate.getFullYear();
        return;
      }

      if (startDate) {
        selectedDate.value = null;
        selectedRange.value = [startDate, null];
        month.value = startDate.getMonth();
        year.value = startDate.getFullYear();
        return;
      }

      selectedDate.value = null;
      selectedRange.value = [null, null];
    },
    { immediate: true, deep: true },
  );

  const handleDateClick = (date: Date) => {
    selectedDate.value = date;
    selectedRange.value = [null, null];
    month.value = date.getMonth();
    year.value = date.getFullYear();

    const formattedDate = formatDate(date);

    onDateRangeChange({
      start: formattedDate,
      end: formattedDate,
    });
  };

  const handleCalendarChange = (value: DatePickerValue) => {
    if (Array.isArray(value)) {
      const [start, end] = value;

      if (!start) {
        return;
      }

      selectedRange.value = [start, end];
      selectedDate.value = null;
      month.value = start.getMonth();
      year.value = start.getFullYear();

      onDateRangeChange({
        start: formatDate(start),
        end: end ? formatDate(end) : '',
      });

      if (end) {
        closeCalendar();
      }

      return;
    }

    if (value instanceof Date) {
      selectedDate.value = value;
      selectedRange.value = [null, null];
      month.value = value.getMonth();
      year.value = value.getFullYear();

      const formattedDate = formatDate(value);

      onDateRangeChange({
        start: formattedDate,
        end: formattedDate,
      });

      closeCalendar();
    }
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (month.value === 0) {
        month.value = 11;
        year.value -= 1;
        return;
      }

      month.value -= 1;
      return;
    }

    if (month.value === 11) {
      month.value = 0;
      year.value += 1;
      return;
    }

    month.value += 1;
  };

  const handleClear = () => {
    selectedDate.value = null;
    selectedRange.value = [null, null];
    closeCalendar();

    onDateRangeChange({
      start: '',
      end: '',
    });
  };

  return {
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
  };
};
