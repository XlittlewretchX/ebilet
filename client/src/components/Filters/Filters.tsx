import React, { useState } from 'react';
import styles from './Filters.module.scss';

interface FiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  category: string;
  dateRange: {
    start: string;
    end: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    dateRange: {
      start: '',
      end: '',
    },
    priceRange: {
      min: 0,
      max: 10000,
    },
  });

  const handleChange = (field: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
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

      <div className={styles.section}>
        <label className={styles.label}>Дата</label>
        <div className={styles.dateRange}>
          <input
            type="date"
            className={styles.input}
            value={filters.dateRange.start}
            onChange={(e) =>
              handleChange('dateRange', {
                ...filters.dateRange,
                start: e.target.value,
              })
            }
          />
        </div>
      </div>

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
    </div>
  );
};

export default Filters;
