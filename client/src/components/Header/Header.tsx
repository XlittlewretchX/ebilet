import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import AuthModal from '@/components/AuthModal/AuthModal';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [search, setSearch] = useState('');

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
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <nav className={styles.nav}>
          <Link to="/my-tickets" className={styles.link}>
            Мои события
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className={styles.link}>
                Профиль
              </Link>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button onClick={handleLogout} className={styles.button}>
                  Выйти
                </button>
                {showLogoutConfirm && (
                  <div className={styles.logoutPopover}>
                    <div>Выйти из аккаунта?</div>
                    <div className={styles.logoutActions}>
                      <button
                        onClick={confirmLogout}
                        className={styles.confirmBtn}
                      >
                        Да
                      </button>
                      <button
                        onClick={cancelLogout}
                        className={styles.cancelBtn}
                      >
                        Нет
                      </button>
                    </div>
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
