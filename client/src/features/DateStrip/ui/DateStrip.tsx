import React from 'react';
import styles from './DateStrip.module.scss';
import { DateStripProps } from '../model/types';
import { useDateStrip } from '../model/useDateStrip';
import { getMonthDays } from '../lib/utils';
import { weekDays, months } from '../model/types';
import { CalendarModal } from './CalendarModal';

const DateStrip: React.FC<DateStripProps> = (props) => {
  const {
    state,
    setState,
    handleDateClick,
    handleCalendarChange,
    handleMonthChange,
    handleClear,
  } = useDateStrip(props);

  const today = new Date();
  const days = getMonthDays(state.year, state.month);
  let firstDay = new Date(state.year, state.month, 1).getDay();
  if (firstDay === 0) firstDay = 7;
  const emptyCells = Array(firstDay - 1).fill(null);

  return (
    <div className={styles.dateStrip}>
      <div className={styles.monthBlock}>
        <button 
          className={styles.arrow} 
          onClick={() => handleMonthChange('prev')}
        >
          &#8592;
        </button>
        <span className={styles.monthLabel}>
          {months[state.month]} {state.year}
        </span>
        <button 
          className={styles.arrow} 
          onClick={() => handleMonthChange('next')}
        >
          &#8594;
        </button>
      </div>
      <div className={styles.datesWrap}>
        <div className={styles.dates}>
          {days.map((date) => {
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = state.selectedDate && 
              date.toDateString() === state.selectedDate.toDateString();
            const weekDay = weekDays[(date.getDay() + 6) % 7];
            
            return (
              <button
                key={date.toISOString()}
                className={
                  styles.date +
                  (isSelected ? ' ' + styles.selected : '') +
                  (isToday ? ' ' + styles.today : '')
                }
                onClick={() => handleDateClick(date)}
              >
                <span className={styles.weekDay}>{weekDay}</span>
                <span className={styles.dayNum}>{date.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>
      <button 
        className={styles.calendarBtn} 
        onClick={() => setState(prev => ({ ...prev, calendarOpen: true }))}
      >
      </button>
      {state.calendarOpen && (
        <CalendarModal
          selectedDate={state.selectedDate}
          selectedRange={state.selectedRange}
          onCalendarChange={handleCalendarChange}
          onClose={() => setState(prev => ({ ...prev, calendarOpen: false }))}
          onClear={handleClear}
        />
      )}
    </div>
  );
};

export default DateStrip; 