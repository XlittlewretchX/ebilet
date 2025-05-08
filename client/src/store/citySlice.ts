import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CityState } from '@/types';

const initialState: CityState = {
  name: 'Город',
  showPicker: false,
};

/**
 * Thunk для получения города по IP через IPGeolocation.io
 * Возвращает название города или отклоняет с сообщением об ошибке.
 */
export const fetchCityByIP = createAsyncThunk<
  string, // возвращаемый тип
  void, // аргумент
  { rejectValue: string }
>('city/fetchByIP', async (_, { rejectWithValue }) => {
  try {
    const apiKey = process.env.REACT_APP_IPGEO_API_KEY;
    if (!apiKey) {
      return rejectWithValue('API key is not defined');
    }
    const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      return rejectWithValue(`Ошибка API: ${response.status}`);
    }
    const data = await response.json();
    return data.city || 'Город';
  } catch (error) {
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
