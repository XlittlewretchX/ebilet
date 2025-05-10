import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import { setCity } from '@/features/ChangeCity/model/citySlice';
import { updateCity } from '@/features/AuthModal/model/authSlice';
import type { RootState } from '@/app/store';

export function useChangeCity() {
  const dispatch = useAppDispatch();
  const { name } = useAppSelector((state: RootState) => state.city);
  const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState('');

  // Определяем отображаемый город
  const displayCity = isAuthenticated ? user?.city || 'Город' : name;

  const handleSave = () => {
    if (input.trim()) {
      if (isAuthenticated) {
        dispatch(updateCity(input.trim()));
        dispatch(setCity(input.trim()));
      } else {
        dispatch(setCity(input.trim()));
      }
      setEditing(false);
    }
  };

  useEffect(() => {
    setInput(displayCity);
  }, [displayCity]);

  return {
    displayCity,
    editing,
    input,
    setEditing,
    setInput,
    handleSave,
  };
} 