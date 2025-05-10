import { useState } from 'react';
import { useAppDispatch } from '@/shared/lib/hooks';
import { logout } from '@/features/AuthModal/model/authSlice';
import { useNavigate } from 'react-router-dom';

export function useUserMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    setShowLogoutConfirm(false);
    setShowUserMenu(false);
  };

  const onProfileClick = () => {
    setShowUserMenu(false);
    navigate('/profile');
  };

  return {
    showUserMenu,
    showLogoutConfirm,
    setShowUserMenu,
    setShowLogoutConfirm,
    onLogout,
    onProfileClick,
  };
} 