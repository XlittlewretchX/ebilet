import { computed } from 'vue';
import { DEFAULT_CITY, useCityStore } from '@/entities/City';
import { cities } from '@/features/CityPicker/config/cities';
import { SUGGESTIONS_LIMIT } from '@/features/CityPicker/config/constants';

export const useCityPicker = () => {
  const cityStore = useCityStore();

  const displayCity = computed(() => cityStore.name.trim() || DEFAULT_CITY);

  const getSuggestions = (value: string): string[] => {
    const normalizedValue = value.trim().toLowerCase();

    if (!normalizedValue) {
      return [];
    }

    return cities
      .filter((city) => city.toLowerCase().startsWith(normalizedValue))
      .slice(0, SUGGESTIONS_LIMIT);
  };

  const saveCity = (rawValue: string) => {
    const nextCity = rawValue.trim();

    if (!nextCity) {
      return null;
    }

    cityStore.setCity(nextCity);
    return nextCity;
  };

  return {
    displayCity,
    getSuggestions,
    saveCity,
  };
};
