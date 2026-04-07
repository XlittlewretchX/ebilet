import { ref } from 'vue';

export const useUserMenuVue = () => {
  const isMenuOpen = ref(false);
  const isLogoutConfirmOpen = ref(false);

  const openMenu = () => {
    isMenuOpen.value = true;
    isLogoutConfirmOpen.value = false;
  };

  const closeMenu = () => {
    isMenuOpen.value = false;
    isLogoutConfirmOpen.value = false;
  };

  const toggleMenu = () => {
    if (isMenuOpen.value) {
      closeMenu();
      return;
    }

    openMenu();
  };

  const requestLogoutConfirmation = () => {
    isLogoutConfirmOpen.value = true;
  };

  const cancelLogout = () => {
    isLogoutConfirmOpen.value = false;
  };

  const confirmLogout = () => {
    closeMenu();
  };

  return {
    isMenuOpen,
    isLogoutConfirmOpen,
    openMenu,
    closeMenu,
    toggleMenu,
    requestLogoutConfirmation,
    cancelLogout,
    confirmLogout,
  };
};
