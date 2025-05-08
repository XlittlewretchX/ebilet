import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import eventReducer from './eventSlice';
import cityReducer from './citySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    city: cityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
