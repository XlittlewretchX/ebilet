import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MobileMenuState {
  isOpen: boolean;
  showLogoutConfirm: boolean;
}

const initialState: MobileMenuState = {
  isOpen: false,
  showLogoutConfirm: false,
};

const mobileMenuSlice = createSlice({
  name: 'mobileMenu',
  initialState,
  reducers: {
    openMenu: (state) => {
      state.isOpen = true;
    },
    closeMenu: (state) => {
      state.isOpen = false;
      state.showLogoutConfirm = false;
    },
    showLogoutConfirm: (state) => {
      state.showLogoutConfirm = true;
    },
    hideLogoutConfirm: (state) => {
      state.showLogoutConfirm = false;
    },
  },
});

export const { openMenu, closeMenu, showLogoutConfirm, hideLogoutConfirm } = mobileMenuSlice.actions;
export default mobileMenuSlice.reducer; 