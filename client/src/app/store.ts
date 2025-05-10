import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/AuthModal/model/authSlice';
import eventReducer from '@/entities/Event/model/eventSlice';
import cityReducer from '@/features/ChangeCity/model/citySlice';
import searchReducer from '@/features/SearchBar/model/searchSlice';
import filterReducer from '@/features/Filters/filterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    city: cityReducer,
    search: searchReducer,
    filter: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
