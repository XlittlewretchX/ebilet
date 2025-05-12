import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState } from '@/shared/types';
import { authAPI } from '@/shared/api/api';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
  userTickets: [],
};

export const register = createAsyncThunk(
  'auth/register',
  async (
    userData: {
      username: string;
      email: string;
      password: string;
      city: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.token);
      return response;
    } catch (err) {
      const error = err as any;
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Ошибка при регистрации');
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: { username: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.token);
      return response;
    } catch (err) {
      const error = err as any;
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Ошибка при входе');
    }
  },
);

export const uploadAvatar = createAsyncThunk(
  'auth/uploadAvatar',
  async (file: File) => {
    const response = await authAPI.uploadAvatar(file);
    return response;
  },
);

export const updateCity = createAsyncThunk(
  'auth/updateCity',
  async (city: string, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateCity(city);
      return response.city;
    } catch (err) {
      return rejectWithValue('Ошибка при обновлении города');
    }
  }
);

export const addFavorite = createAsyncThunk(
  'auth/addFavorite',
  async (eventId: number, { rejectWithValue }) => {
    try {
      await authAPI.addFavorite(eventId);
      return eventId;
    } catch (err) {
      return rejectWithValue('Ошибка при добавлении в избранное');
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'auth/removeFavorite',
  async (eventId: number, { rejectWithValue }) => {
    try {
      await authAPI.removeFavorite(eventId);
      return eventId;
    } catch (err) {
      return rejectWithValue('Ошибка при удалении из избранного');
    }
  }
);

export const fetchFavorites = createAsyncThunk(
  'auth/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const favorites = await authAPI.getFavorites();
      return favorites;
    } catch (err) {
      return rejectWithValue('Ошибка при получении избранного');
    }
  }
);

export const buyTicket = createAsyncThunk(
  'auth/buyTicket',
  async (
    data: { eventId: number; seat?: string | string[] | null; name: string; phone: string; email: string },
    { rejectWithValue },
  ) => {
    try {
      const ticket = await authAPI.buyTicket(data);
      return ticket;
    } catch (err) {
      return rejectWithValue('Ошибка при покупке билета');
    }
  }
);

export const fetchUserTickets = createAsyncThunk(
  'auth/fetchUserTickets',
  async (_, { rejectWithValue }) => {
    try {
      const tickets = await authAPI.getUserTickets();
      return tickets;
    } catch (err) {
      return rejectWithValue('Ошибка при получении билетов');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Ошибка при регистрации';
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Ошибка при входе';
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        if (state.user) {
          state.user.avatarUrl = action.payload.avatarUrl;
        }
      })
      .addCase(updateCity.fulfilled, (state, action) => {
        if (state.user) {
          state.user.city = action.payload;
        }
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        if (state.user) {
          if (!state.user.favorites) state.user.favorites = [];
          if (!state.user.favorites.includes(action.payload)) {
            state.user.favorites.push(action.payload);
          }
        }
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        if (state.user && state.user.favorites) {
          state.user.favorites = state.user.favorites.filter(id => id !== action.payload);
        }
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        if (state.user) {
          state.user.favorites = action.payload.map((event: any) => event.id);
        }
      })
      .addCase(buyTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(buyTicket.fulfilled, (state, action) => {
        state.loading = false;
        // Можно добавить ticket в отдельный state.tickets, если потребуется
      })
      .addCase(buyTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Ошибка при покупке билета';
      })
      .addCase(fetchUserTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.userTickets = action.payload;
      })
      .addCase(fetchUserTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Ошибка при получении билетов';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
