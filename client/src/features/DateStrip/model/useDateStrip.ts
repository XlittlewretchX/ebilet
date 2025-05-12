import { useState, useEffect } from 'react';
import { DateStripProps, DateStripState } from '../model/types';
import { formatDate } from '../lib/utils';

export const useDateStrip = ({ onDateSelect, onRangeSelect }: DateStripProps) => {
  const today = new Date();
  const [state, setState] = useState<DateStripState>({
    calendarOpen: false,
    selectedDate: null,
    selectedRange: [null, null],
    month: today.getMonth(),
    year: today.getFullYear(),
  });

  useEffect(() => {
    if (!state.selectedDate && !state.selectedRange[0] && !state.selectedRange[1]) return;
    
    const onReset = () => {
      setState(prev => ({
        ...prev,
        selectedDate: null,
        selectedRange: [null, null],
      }));
    };
    
    window.addEventListener('reset-date-strip', onReset);
    return () => window.removeEventListener('reset-date-strip', onReset);
  }, [state.selectedDate, state.selectedRange]);

  const handleDateClick = (date: Date) => {
    setState(prev => ({
      ...prev,
      selectedDate: date,
      selectedRange: [null, null],
    }));
    const formatted = formatDate(date);
    onDateSelect(formatted);
    onRangeSelect(formatted, formatted);
  };

  const handleCalendarChange = (dates: [Date | null, Date | null] | Date | null) => {
    if (Array.isArray(dates)) {
      setState(prev => ({
        ...prev,
        selectedRange: dates,
        selectedDate: null,
      }));
      if (dates[0] && dates[1]) {
        onRangeSelect(formatDate(dates[0]), formatDate(dates[1]));
        setState(prev => ({ ...prev, calendarOpen: false }));
      }
    } else if (dates instanceof Date) {
      setState(prev => ({
        ...prev,
        selectedDate: dates,
        selectedRange: [null, null],
      }));
      const formatted = formatDate(dates);
      onDateSelect(formatted);
      setState(prev => ({ ...prev, calendarOpen: false }));
    }
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setState(prev => {
      const newMonth = direction === 'prev' 
        ? (prev.month === 0 ? 11 : prev.month - 1)
        : (prev.month === 11 ? 0 : prev.month + 1);
      
      const newYear = direction === 'prev' && prev.month === 0
        ? prev.year - 1
        : direction === 'next' && prev.month === 11
          ? prev.year + 1
          : prev.year;

      return {
        ...prev,
        month: newMonth,
        year: newYear,
      };
    });
  };

  const handleClear = () => {
    setState(prev => ({
      ...prev,
      selectedDate: null,
      selectedRange: [null, null],
      calendarOpen: false,
    }));
    onRangeSelect('', '');
  };

  return {
    state,
    setState,
    handleDateClick,
    handleCalendarChange,
    handleMonthChange,
    handleClear,
  };
}; 