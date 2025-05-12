import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import { updateCity } from '@/features/AuthModal/model/authSlice';
import { fetchCityByIP, setCity } from '@/features/ChangeCity/model/citySlice';
import AuthModal from '@/features/AuthModal/ui/AuthModal';
import CityPicker from '@/features/ChangeCity/ui/CityPicker';
import UserMenu from '@/features/UserMenu/ui/UserMenu';
import { MobileMenu } from '@/features/MobileMenu/ui/MobileMenu';
import { openMenu } from '@/features/MobileMenu/model/mobileMenuSlice';
import styles from '@/widgets/Header/Header.module.scss';
import SearchBar from '@/features/SearchBar/ui/SearchBar';
import { MobileMenuIcon } from '@/shared/ui/icons';
import type { RootState } from '@/app/store';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(fetchCityByIP()).then((result: any) => {
        if (fetchCityByIP.fulfilled.match(result)) {
          dispatch(setCity(result.payload));
        }
      });
    } else {
      if (!user?.city || user.city === 'Город') {
        dispatch(fetchCityByIP()).then((result: any) => {
          if (fetchCityByIP.fulfilled.match(result)) {
            dispatch(updateCity(result.payload));
            dispatch(setCity(result.payload));
          }
        });
      } else {
        dispatch(setCity(user.city));
      }
    }
  }, [isAuthenticated]);

  const avatarUrl = user?.avatarUrl
    ? (user.avatarUrl.startsWith('/uploads')
        ? `${process.env.REACT_APP_API_URL?.replace('/api', '')}${user.avatarUrl}`
        : user.avatarUrl)
    : '/img/default-avatar.svg';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          eBilet
        </Link>
        <SearchBar />
        <nav className={styles.nav}>
          <CityPicker />
          {isAuthenticated ? (
            <>
              <Link to="/my-tickets" className={styles.link}>
                Мои события
              </Link>
              <UserMenu user={user} avatarUrl={avatarUrl} />
            </>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className={styles.button}
            >
              Войти
            </button>
          )}
        </nav>
        <button
          className={styles.mobileMenuButton}
          onClick={() => dispatch(openMenu())}
          aria-label="Открыть меню"
        >
          <MobileMenuIcon />
        </button>
      </div>
      <MobileMenu
        isAuthenticated={isAuthenticated}
        onLoginClick={() => setIsAuthModalOpen(true)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};

export default Header; 