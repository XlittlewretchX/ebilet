import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/AuthModal/model/authSlice';
import eventReducer from '@/entities/Event/model/eventSlice';
import cityReducer from '@/features/CityPicker/model/citySlice';
import filterReducer from '@/features/FilterPanel/filterPanelSlice';
import mobileMenuReducer from '@/features/MobileMenu/model/mobileMenuSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    city: cityReducer,
    filter: filterReducer,
    mobileMenu: mobileMenuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
