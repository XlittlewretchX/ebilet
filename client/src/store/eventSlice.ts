import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { EventState } from '../types';
import { eventAPI } from '../services/api';

const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
};

export const fetchEvents = createAsyncThunk('event/fetchEvents', async () => {
  const response = await eventAPI.getAll();
  return response;
});

export const fetchEventById = createAsyncThunk(
  'event/fetchEventById',
  async (id: number) => {
    const response = await eventAPI.getById(id);
    return response;
  },
);

export const createEvent = createAsyncThunk(
  'event/createEvent',
  async (eventData: FormData) => {
    const response = await eventAPI.create(eventData);
    return response;
  },
);

export const fetchUserEvents = createAsyncThunk(
  'event/fetchUserEvents',
  async () => {
    const response = await eventAPI.getUserEvents();
    return response;
  },
);

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при загрузке событий';
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при создании события';
      })
      .addCase(fetchUserEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchUserEvents.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Ошибка при загрузке событий пользователя';
      });
  },
});

export const { clearError } = eventSlice.actions;
export default eventSlice.reducer;
