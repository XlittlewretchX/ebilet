import React, { useState, useEffect } from 'react';
import styles from './DateStrip.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ru } from 'date-fns/locale';

interface DateStripProps {
  onDateSelect: (date: string) => void;
  onRangeSelect: (start: string, end: string) => void;
}

const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

const getMonthDays = (year: number, month: number) => {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const pad = (n: number) => n.toString().padStart(2, '0');
const formatDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const DateStrip: React.FC<DateStripProps> = ({ onDateSelect, onRangeSelect }) => {
  const today = new Date();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRange, setSelectedRange] = useState<[Date | null, Date | null]>([null, null]);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  // Сброс выделения при сбросе фильтров (если выбранная дата/диапазон сброшены)
  useEffect(() => {
    // Проверяем localStorage или глобальный фильтр, если нужно
    // Но проще: если выбранная дата вне текущего диапазона, сбрасываем выделение
    if (!selectedDate && !selectedRange[0] && !selectedRange[1]) return;
    // Проверяем, не сброшены ли фильтры (через window событие)
    const onReset = () => {
      setSelectedDate(null);
      setSelectedRange([null, null]);
    };
    window.addEventListener('reset-date-strip', onReset);
    return () => window.removeEventListener('reset-date-strip', onReset);
  }, [selectedDate, selectedRange]);

  const days = getMonthDays(year, month);
  // Определяем, сколько пустых ячеек нужно перед первым днём месяца
  // В JS неделя начинается с воскресенья (0), но у нас с понедельника (0 - ПН)
  let firstDay = new Date(year, month, 1).getDay();
  if (firstDay === 0) firstDay = 7; // воскресенье -> 7
  const emptyCells = Array(firstDay - 1).fill(null);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedRange([null, null]);
    const formatted = formatDate(date);
    onDateSelect(formatted);
    onRangeSelect(formatted, formatted);
  };

  const handleCalendarChange = (dates: [Date | null, Date | null] | Date | null) => {
    if (Array.isArray(dates)) {
      setSelectedRange(dates);
      setSelectedDate(null);
      if (dates[0] && dates[1]) {
        onRangeSelect(formatDate(dates[0]), formatDate(dates[1]));
        setCalendarOpen(false);
      }
    } else if (dates instanceof Date) {
      setSelectedDate(dates);
      setSelectedRange([null, null]);
      const formatted = formatDate(dates);
      onDateSelect(formatted);
      setCalendarOpen(false);
    }
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  // Модальное окно календаря
  const handleClear = () => {
    setSelectedDate(null);
    setSelectedRange([null, null]);
    onRangeSelect('', '');
    setCalendarOpen(false);
  };

  const CalendarModal = () => (
    <div className={styles.modalOverlay} onClick={() => setCalendarOpen(false)}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <DatePicker
          selected={selectedDate}
          onChange={handleCalendarChange}
          startDate={selectedRange[0]}
          endDate={selectedRange[1]}
          selectsRange
          inline
          locale={ru}
          dateFormat="dd.MM.yyyy"
        />
        <div style={{display:'flex', gap:'1rem', marginTop:'1rem'}}>
          <button className={styles.closeBtn} onClick={() => setCalendarOpen(false)}>Закрыть</button>
          <button className={styles.closeBtn} style={{background:'#e3eaff', color:'#2563eb'}} onClick={handleClear}>Очистить</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.dateStrip}>
      <div className={styles.monthBlock}>
        <button className={styles.arrow} onClick={prevMonth}>&#8592;</button>
        <span className={styles.monthLabel}>{months[month]} {year}</span>
        <button className={styles.arrow} onClick={nextMonth}>&#8594;</button>
      </div>
      <div className={styles.datesWrap}>
        <div className={styles.dates}>
          {days.map((date) => {
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const weekDay = weekDays[(date.getDay() + 6) % 7]; // ПН=0, ..., ВС=6
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
      <button className={styles.calendarBtn} onClick={() => setCalendarOpen(true)}>
        📅
      </button>
      {calendarOpen && <CalendarModal />}
    </div>
  );
};

export default DateStrip; 