import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import { logout } from '@/features/AuthModal/model/authSlice';
import { openMenu, closeMenu, showLogoutConfirm, hideLogoutConfirm } from '../model/mobileMenuSlice';
import CityPicker from '@/features/ChangeCity/ui/CityPicker';
import styles from './MobileMenu.module.scss';
import {
  CloseIcon,
  ProfileIcon,
  EventsIcon,
  LogoutIcon,
  LoginIcon,
} from '@/shared/ui/icons';

interface MobileMenuProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isAuthenticated, onLoginClick }) => {
  const dispatch = useAppDispatch();
  const { isOpen, showLogoutConfirm: isLogoutConfirmShown } = useAppSelector((state) => state.mobileMenu);

  const handleClose = () => {
    dispatch(closeMenu());
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
  };

  return (
    <div className={`${styles.mobileMenu} ${isOpen ? styles.active : ''}`}>
      <div className={styles.mobileMenuHeader}>
        <Link to="/" className={styles.logo} onClick={handleClose}>
          eBilet
        </Link>
        <button className={styles.mobileMenuClose} onClick={handleClose}>
          <CloseIcon />
        </button>
      </div>
      <div className={styles.mobileMenuContent}>
        <div className={styles.mobileCityPicker}>
          <CityPicker />
        </div>
        {isAuthenticated ? (
          <>
            <Link to="/my-tickets" className={styles.mobileMenuItem} onClick={handleClose}>
              <EventsIcon />
              Мои события
            </Link>
            <Link to="/profile" className={styles.mobileMenuItem} onClick={handleClose}>
              <ProfileIcon />
              Мой профиль
            </Link>
            {!isLogoutConfirmShown ? (
              <button
                className={styles.mobileMenuItem}
                onClick={() => dispatch(showLogoutConfirm())}
              >
                <LogoutIcon />
                Выйти
              </button>
            ) : (
              <div className={styles.menuLogoutConfirm}>
                Выйти из аккаунта?
                <div className={styles.menuLogoutActions}>
                  <button
                    className={styles.menuConfirmBtn}
                    onClick={handleLogout}
                  >
                    Да
                  </button>
                  <button
                    className={styles.menuCancelBtn}
                    onClick={() => dispatch(hideLogoutConfirm())}
                  >
                    Нет
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <button
            className={styles.mobileLoginButton}
            onClick={() => {
              onLoginClick();
              handleClose();
            }}
          >
            <LoginIcon />
            Войти
          </button>
        )}
      </div>
    </div>
  );
}; 