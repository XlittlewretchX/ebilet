import React from 'react';
import styles from '@/features/ChangeCity/ui/CityPicker.module.scss';
import { useChangeCity } from '@/features/ChangeCity/model/useChangeCity';
import { CityIcon } from '@/shared/ui/icons';

const CityPicker: React.FC = () => {
  const {
    displayCity,
    editing,
    input,
    setEditing,
    setInput,
    handleSave
  } = useChangeCity();

  // Функция для получения сокращенного названия города
  const getShortenedCityName = (city: string) => {
    if (window.innerWidth <= 480) {
      return city.length > 8 ? `${city.slice(0, 8)}...` : city;
    }
    return city;
  };

  return (
    <div className={styles.cityPicker}>
      <button
        className={styles.cityButton}
        onClick={() => setEditing(true)}
        aria-label="Выбрать город"
      >
        <CityIcon />
        <span className={styles.cityName} title={displayCity}>
          {getShortenedCityName(displayCity)}
        </span>
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