import type { DateRangeValue } from '@/shared/types/date';

export interface DateStripModelProps {
  modelValue: DateRangeValue;
}

export type SelectedDateRange = DateRangeValue;

export type DateRange = [Date | null, Date | null];
export type SingleDateValue = Date;
export type RangeDateValue = [Date, Date] | [Date, null];
export type DatePickerValue = SingleDateValue | RangeDateValue;

export interface CalendarModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  selectedRange: DateRange;
}

export const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

export const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];
