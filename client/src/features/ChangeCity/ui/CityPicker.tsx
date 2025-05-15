import React, { useState, useEffect, useRef } from 'react';
import styles from '@/features/ChangeCity/ui/CityPicker.module.scss';
import { useChangeCity } from '@/features/ChangeCity/model/useChangeCity';
import { CityIcon } from '@/shared/ui/icons';
import { russianCities } from '@/shared/data/cities';
import { useAppDispatch } from '@/shared/lib/hooks';
import { setCity } from '@/features/ChangeCity/model/citySlice';
import { updateCity } from '@/features/AuthModal/model/authSlice';
import { useAppSelector } from '@/shared/lib/hooks';

const CityPicker: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const {
    displayCity,
    editing,
    input,
    setEditing,
    setInput,
    handleSave
  } = useChangeCity();

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Функция для получения сокращенного названия города
  const getShortenedCityName = (city: string) => {
    if (window.innerWidth <= 480) {
      return city.length > 8 ? `${city.slice(0, 8)}...` : city;
    }
    return city;
  };

  // Обработка изменений в поле ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    
    if (value.trim()) {
      const filteredCities = russianCities.filter(city =>
        city.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredCities.slice(0, 5));
      setActiveSuggestionIndex(-1);
    } else {
      setSuggestions([]);
    }
  };

  // Обработка выбора города из списка
  const handleSuggestionClick = (city: string) => {
    if (isAuthenticated) {
      dispatch(updateCity(city));
    }
    dispatch(setCity(city));
    setEditing(false);
  };

  // Обработка клавиатурной навигации
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[activeSuggestionIndex]);
        } else {
          handleSave();
        }
        break;
      case 'Escape':
        setSuggestions([]);
        break;
    }
  };

  // Закрытие списка при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              ref={inputRef}
              className={styles.cityInput}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Введите город"
              autoFocus
            />
            {suggestions.length > 0 && (
              <div className={styles.citySuggestions} ref={suggestionsRef}>
                {suggestions.map((city, index) => (
                  <div
                    key={city}
                    className={`${styles.citySuggestion} ${
                      index === activeSuggestionIndex ? styles.citySuggestionActive : ''
                    }`}
                    onClick={() => handleSuggestionClick(city)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
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