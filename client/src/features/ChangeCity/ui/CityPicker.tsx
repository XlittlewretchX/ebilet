import React from 'react';
import styles from '@/features/ChangeCity/ui/CityPicker.module.scss';
import { useChangeCity } from '@/features/ChangeCity/model/useChangeCity';

const CityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 6 }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#007bff"/>
  </svg>
);

const CityPicker: React.FC = () => {
  const {
    displayCity,
    editing,
    input,
    setEditing,
    setInput,
    handleSave
  } = useChangeCity();

  return (
    <div className={styles.cityPicker}>
      <button
        className={styles.cityButton}
        onClick={() => setEditing(true)}
        aria-label="Выбрать город"
      >
        <CityIcon />
        <span className={styles.cityName}>{displayCity}</span>
      </button>
      {editing && (
        <div className={styles.cityModalOverlay} onClick={() => setEditing(false)}>
          <div className={styles.cityModal} onClick={e => e.stopPropagation()}>
            <input
              className={styles.cityInput}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Введите город"
              autoFocus
            />
            <div className={styles.cityModalActions}>
              <button className={styles.menuConfirmBtn} onClick={handleSave}>Сохранить</button>
              <button className={styles.menuCancelBtn} onClick={() => setEditing(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityPicker; 