import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ru } from 'date-fns/locale';
import styles from './CalendarModal.module.scss';

interface CalendarModalProps {
  selectedDate: Date | null;
  selectedRange: [Date | null, Date | null];
  onCalendarChange: (dates: [Date | null, Date | null] | Date | null) => void;
  onClose: () => void;
  onClear: () => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  selectedDate,
  selectedRange,
  onCalendarChange,
  onClose,
  onClear,
}) => (
  <div className={styles.modalOverlay} onClick={onClose}>
    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
      <DatePicker
        selected={selectedDate}
        onChange={onCalendarChange}
        startDate={selectedRange[0]}
        endDate={selectedRange[1]}
        selectsRange
        inline
        locale={ru}
        dateFormat="dd.MM.yyyy"
      />
      <div style={{display:'flex', gap:'1rem', marginTop:'1rem'}}>
        <button className={styles.closeBtn} onClick={onClose}>Закрыть</button>
        <button 
          className={styles.closeBtn} 
          style={{background:'#e3eaff', color:'#2563eb'}} 
          onClick={onClear}
        >
          Очистить
        </button>
      </div>
    </div>
  </div>
); 