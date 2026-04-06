<template>
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
            class="calendar-modal__action calendar-modal__action--ghost"
            @click="emit('clear')"
          >
            Очистить
          </button>
          <button
            type="button"
            class="calendar-modal__action calendar-modal__action--secondary"
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
import { toRefs } from 'vue';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ru } from 'date-fns/locale';
import { useCalendarModal } from '../model/useCalendarModal';
import type { CalendarModalProps, DatePickerValue } from '../model/types';

const props = defineProps<CalendarModalProps>();

const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'clear'): void;
  (event: 'calendar-change', payload: DatePickerValue): void;
}>();

const { isOpen, selectedDate, selectedRange } = toRefs(props);

const { pickerValue, handleDatePickerChange } = useCalendarModal({
  isOpen,
  selectedDate,
  selectedRange,
  onClose: () => emit('close'),
  onClear: () => emit('clear'),
  onCalendarChange: (value) => emit('calendar-change', value),
});
</script>

<style scoped lang="scss" src="./CalendarModal.scss"></style>
