import React from 'react';
import styles from '../UserMenu.module.scss';
import { useUserMenu } from '../model/useUserMenu';

interface UserMenuProps {
  user: any;
  avatarUrl: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, avatarUrl }) => {
  const {
    showUserMenu,
    showLogoutConfirm,
    setShowUserMenu,
    setShowLogoutConfirm,
    onLogout,
    onProfileClick
  } = useUserMenu();

  React.useEffect(() => {
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
  }, [showUserMenu, setShowUserMenu, setShowLogoutConfirm]);

  return (
    <div className={styles.userMenuWrapper}>
      <button
        className={styles.userMenuButton + (showUserMenu ? ' ' + styles.active : '')}
        onClick={() => {
          setShowUserMenu(!showUserMenu);
          setShowLogoutConfirm(false);
        }}
        aria-haspopup="true"
        aria-expanded={showUserMenu}
      >
        <img
          src={avatarUrl}
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
          <a
            className={styles.menuItem}
            href="/profile"
            onClick={e => {
              e.preventDefault();
              setShowUserMenu(false);
              onProfileClick();
            }}
          >
            Мой профиль
          </a>
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
                    onLogout();
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
  );
};

export default UserMenu; 