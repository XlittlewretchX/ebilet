import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CityState } from '@/shared/types';

const initialState: CityState = {
  name: 'Город',
  showPicker: false,
};

/**
 * Thunk для получения города по IP через IPGeolocation.io,
 * затем получения названия города на русском через Nominatim.
 */
export const fetchCityByIP = createAsyncThunk<
  string, // возвращаемый тип
  void, // аргумент
  { rejectValue: string }
>('city/fetchByIP', async (_, { rejectWithValue }) => {
  try {
    const apiKey = process.env.REACT_APP_IPGEO_API_KEY;
    console.log('[fetchCityByIP] Используемый API-ключ:', apiKey);
    if (!apiKey) {
      console.error('[fetchCityByIP] API key is not defined');
      return rejectWithValue('API key is not defined');
    }
    const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`;
    console.log('[fetchCityByIP] URL запроса:', url);
    const response = await fetch(url);
    console.log('[fetchCityByIP] Статус ответа:', response.status);
    if (!response.ok) {
      console.error('[fetchCityByIP] Ошибка API:', response.status);
      return rejectWithValue(`Ошибка API: ${response.status}`);
    }
    const data = await response.json();
    console.log('[fetchCityByIP] Данные от ipgeolocation:', data);
    const { city, latitude, longitude } = data;
    if (!latitude || !longitude) {
      console.warn('[fetchCityByIP] Нет координат, возвращаю город:', city);
      return city || 'Город';
    }
    // Второй запрос к Nominatim для получения города на русском
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=ru`;
    console.log('[fetchCityByIP] URL запроса к Nominatim:', nominatimUrl);
    const nomRes = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'ebilet-app/1.0 (your@email.com)'
      }
    });
    console.log('[fetchCityByIP] Статус ответа Nominatim:', nomRes.status);
    if (nomRes.ok) {
      const nomData = await nomRes.json();
      console.log('[fetchCityByIP] Данные от Nominatim:', nomData);
      // Варианты: city, town, village, state
      const ruCity = nomData.address?.city || nomData.address?.town || nomData.address?.village || nomData.address?.state;
      if (ruCity) {
        console.log('[fetchCityByIP] Город на русском найден:', ruCity);
        return ruCity;
      }
    }
    // Fallback: английское название
    console.warn('[fetchCityByIP] Город на русском не найден, возвращаю:', city);
    return city || 'Город';
  } catch (error) {
    console.error('[fetchCityByIP] Ошибка:', error);
    return rejectWithValue((error as Error).message);
  }
});

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    openPicker(state) {
      state.showPicker = true;
    },
    closePicker(state) {
      state.showPicker = false;
    },
    setCity(state, action: PayloadAction<string>) {
      state.name = action.payload;
      state.showPicker = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCityByIP.fulfilled, (state, { payload }) => {
        state.name = payload;
        state.showPicker = false;
      })
      .addCase(fetchCityByIP.rejected, (state) => {
        state.showPicker = true;
      });
  },
});

export const { openPicker, closePicker, setCity } = citySlice.actions;
export default citySlice.reducer;
