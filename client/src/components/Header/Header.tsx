import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, updateCity } from '@/store/authSlice';
import { fetchCityByIP, setCity } from '@/store/citySlice';
import AuthModal from '@/components/AuthModal/AuthModal';
import CityPicker from './CityPicker';
import styles from './Header.module.scss';
import { setSearch } from '@/store/searchSlice';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const search = useAppSelector((state) => state.search.value);

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

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  useEffect(() => {
    if (!showUserMenu) return;
    const handleClick = (e: MouseEvent) => {
      const menu = document.getElementById('user-menu-dropdown');
      if (menu && !menu.contains(e.target as Node)) {
        setShowUserMenu(false);
        setShowLogoutConfirm(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showUserMenu]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          EBilet
        </Link>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Поиск мероприятий..."
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
          />
        </div>
        <nav className={styles.nav}>
          <CityPicker />
          {isAuthenticated ? (
            <>
              <Link to="/my-tickets" className={styles.link}>
                Мои события
              </Link>
              <div className={styles.userMenuWrapper}>
                <button
                  className={styles.userMenuButton + (showUserMenu ? ' ' + styles.active : '')}
                  onClick={() => {
                    setShowUserMenu((v) => !v);
                    setShowLogoutConfirm(false);
                  }}
                  aria-haspopup="true"
                  aria-expanded={showUserMenu}
                >
                  <img
                    src={
                      user?.avatarUrl
                        ? (user.avatarUrl.startsWith('/uploads')
                            ? `${process.env.REACT_APP_API_URL?.replace('/api', '')}${user.avatarUrl}`
                            : user.avatarUrl)
                        : '/img/default-avatar.svg'
                    }
                    alt="avatar"
                    className={styles.avatar}
                  />
                  <span className={styles.userName}>{user?.username}</span>
                </button>
                {showUserMenu && (
                  <div
                    className={styles.menuDropdown}
                    id="user-menu-dropdown"
                  >
                    <Link
                      className={styles.menuItem}
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Мой профиль
                    </Link>
                    <div className={styles.menuDivider} />
                    {!showLogoutConfirm ? (
                      <button
                        className={styles.menuItem}
                        onClick={() => setShowLogoutConfirm(true)}
                      >
                        Выйти
                      </button>
                    ) : (
                      <div className={styles.menuLogoutConfirm}>
                        Выйти из аккаунта?
                        <div className={styles.menuLogoutActions}>
                          <button
                            className={styles.menuConfirmBtn}
                            onClick={() => {
                              dispatch(logout());
                              setShowLogoutConfirm(false);
                              setShowUserMenu(false);
                            }}
                          >
                            Да
                          </button>
                          <button
                            className={styles.menuCancelBtn}
                            onClick={() => setShowLogoutConfirm(false)}
                          >
                            Нет
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};

export default Header;
