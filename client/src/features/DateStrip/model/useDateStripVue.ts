import { computed, ref, watch, type Ref } from 'vue';
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
  const month = ref(today.getMonth());
  const year = ref(today.getFullYear());

  const parsedSelection = computed(() => {
    const start = parseDateValue(modelValue.value.start);
    const end = parseDateValue(modelValue.value.end);

    return {
      start,
      end,
      isSingleDay:
        Boolean(start && end) && modelValue.value.start === modelValue.value.end,
    };
  });

  const selectedDate = computed<Date | null>(() => {
    const { start, isSingleDay } = parsedSelection.value;
    return isSingleDay ? start : null;
  });

  const selectedRange = computed<DateRange>(() => {
    const { start, end, isSingleDay } = parsedSelection.value;

    if (!start || isSingleDay) {
      return [null, null];
    }

    return [start, end ?? null];
  });

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
      if (!startDate) {
        return;
      }

      month.value = startDate.getMonth();
      year.value = startDate.getFullYear();
    },
    { immediate: true, deep: true },
  );

  const handleDateClick = (date: Date) => {
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
