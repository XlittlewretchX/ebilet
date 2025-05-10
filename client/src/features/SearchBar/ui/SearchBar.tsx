import React from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import { setSearch } from '@/features/SearchBar/model/searchSlice';
import styles from '@/features/SearchBar/ui/SearchBar.module.scss';

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.search.value);

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Поиск мероприятий..."
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
      />
    </div>
  );
};

export default SearchBar; 