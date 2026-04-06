import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import type { DatePickerValue, DateRange } from './types';

type PickerValue = DatePickerValue | null;

interface UseCalendarModalParams {
  isOpen: Ref<boolean>;
  selectedDate: Ref<Date | null>;
  selectedRange: Ref<DateRange>;
  onClose: () => void;
  onClear: () => void;
  onCalendarChange: (value: DatePickerValue) => void;
}

export const useCalendarModal = ({
  isOpen,
  selectedDate,
  selectedRange,
  onClose,
  onClear,
  onCalendarChange,
}: UseCalendarModalParams) => {
  const pickerValue = ref<PickerValue>(null);

  const normalizedModel = computed<PickerValue>(() => {
    const [rangeStart, rangeEnd] = selectedRange.value;

    if (rangeStart && rangeEnd) {
      return [rangeStart, rangeEnd];
    }

    if (rangeStart) {
      return [rangeStart, null];
    }

    if (selectedDate.value) {
      return [selectedDate.value, null];
    }

    return null;
  });

  const handleDatePickerChange = (value: PickerValue) => {
    if (Array.isArray(value)) {
      const start = value[0];
      const end = value[1] instanceof Date ? value[1] : null;

      if (start instanceof Date) {
        onCalendarChange([start, end]);
        return;
      }

      onClear();
      return;
    }

    if (value instanceof Date) {
      onCalendarChange(value);
      return;
    }

    if (value === null) {
      onClear();
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen.value) {
      onClose();
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

  return {
    pickerValue,
    handleDatePickerChange,
  };
};
