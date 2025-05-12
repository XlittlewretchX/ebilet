export interface DateStripProps {
  onDateSelect: (date: string) => void;
  onRangeSelect: (start: string, end: string) => void;
}

export interface DateStripState {
  calendarOpen: boolean;
  selectedDate: Date | null;
  selectedRange: [Date | null, Date | null];
  month: number;
  year: number;
}

export const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

export const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]; 