import React, { useState, useEffect } from 'react';
import styles from './Filters.module.scss';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import { setFilters, resetFilters } from '@/features/Filters/filterSlice';

const subcategoriesMap: Record<string, string[]> = {
  concert: ['рок', 'поп', 'классика', 'джаз'],
  theater: ['драма', 'комедия', 'мюзикл'],
  exhibition: ['искусство', 'наука', 'технологии'],
  sport: ['футбол', 'баскетбол', 'теннис'],
};

const Filters: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filter);
  const [isOpen, setIsOpen] = useState(false);

  // Блокируем скролл при открытом фильтре на мобильных
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (field: keyof typeof filters, value: any) => {
    let newFilters = { ...filters, [field]: value };
    if (field === 'category') {
      newFilters = { ...newFilters, subcategory: '' };
    }
    dispatch(setFilters(newFilters));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  const closeFilters = () => {
    setIsOpen(false);
  };

  const FilterContent = () => (
    <>
      <div className={styles.mobileHeader}>
        <h3 className={styles.title}>Фильтры</h3>
        <button className={styles.closeButton} onClick={closeFilters} aria-label="Закрыть фильтры">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Категория</label>
        <select
          className={styles.select}
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="">Все категории</option>
          <option value="concert">Концерты</option>
          <option value="theater">Театр</option>
          <option value="exhibition">Выставки</option>
          <option value="sport">Спорт</option>
        </select>
      </div>

      {/* Подкатегория */}
      {filters.category && subcategoriesMap[filters.category] && (
        <div className={styles.section}>
          <label className={styles.label}>Подкатегория</label>
          <select
            className={styles.select}
            value={filters.subcategory}
            onChange={(e) => handleChange('subcategory', e.target.value.toLowerCase())}
          >
            <option value="">Все подкатегории</option>
            {subcategoriesMap[filters.category].map((subcat) => (
              <option key={subcat} value={subcat}>{subcat.charAt(0).toUpperCase() + subcat.slice(1)}</option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.section}>
        <label className={styles.label}>Цена</label>
        <div className={styles.priceRange}>
          <input
            type="number"
            className={styles.input}
            placeholder="От"
            value={filters.priceRange.min}
            onChange={(e) =>
              handleChange('priceRange', {
                ...filters.priceRange,
                min: Number(e.target.value),
              })
            }
          />
          <input
            type="number"
            className={styles.input}
            placeholder="До"
            value={filters.priceRange.max}
            onChange={(e) =>
              handleChange('priceRange', {
                ...filters.priceRange,
                max: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      {/* Чекбокс "Искать в моем городе" */}
      <div className={styles.section}>
        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            id="onlyMyCity"
            checked={filters.onlyMyCity}
            onChange={e => handleChange('onlyMyCity', e.target.checked)}
          />
          <label htmlFor="onlyMyCity" className={styles.label} style={{ margin: 0 }}>
            Искать в моем городе
          </label>
        </div>
      </div>

      <button
        className={styles.resetBtn}
        onClick={handleReset}
      >
        Сбросить фильтры
      </button>
    </>
  );

  return (
    <>
      <button className={styles.filterToggle} onClick={toggleFilters}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.33333 15H11.6667V13.3333H8.33333V15ZM2.5 5V6.66667H17.5V5H2.5ZM5 10.8333H15V9.16667H5V10.8333Z" fill="currentColor"/>
        </svg>
        Фильтры
      </button>

      <div className={`${styles.filters} ${isOpen ? styles.open : ''}`}>
        <FilterContent />
      </div>
    </>
  );
};

export default Filters; 