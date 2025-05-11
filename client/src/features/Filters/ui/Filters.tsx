import React from 'react';
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

  const handleChange = (field: keyof typeof filters, value: any) => {
    let newFilters = { ...filters, [field]: value };
    // Если меняется категория, сбрасываем подкатегорию
    if (field === 'category') {
      newFilters = { ...newFilters, subcategory: '' };
    }
    dispatch(setFilters(newFilters));
  };

  const handleReset = () => {
    dispatch(resetFilters());
    //window.dispatchEvent(new Event('reset-date-strip'));
  };

  return (
    <div className={styles.filters}>
      <h3 className={styles.title}>Фильтры</h3>

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
      <button
        className={styles.resetBtn}
        onClick={handleReset}
        style={{marginTop: '1.5rem', width: '100%', background:'#e3eaff', color:'#2563eb', border:'none', borderRadius:'6px', padding:'0.6rem 0', fontWeight:600, cursor:'pointer'}}
      >
        Сбросить фильтры
      </button>
    </div>
  );
};

export default Filters; 