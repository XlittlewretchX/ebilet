import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import { fetchUserEvents } from '@/entities/Event/model/eventSlice';
import { uploadAvatar, logout, updateUsername, resetAvatar, fetchUserTickets } from '@/features/AuthModal/model/authSlice';
import EventCard from '@/entities/Event/ui/EventCard';
import styles from './ProfilePage.module.scss';
import type { Event } from '@/shared/types';
import type { RootState } from '@/app/store';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { events, loading, error } = useAppSelector((state: RootState) => state.event);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [updateError, setUpdateError] = useState<string | null>(null);
  const userTickets = useAppSelector((state: RootState) => state.auth.userTickets || []);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserEvents());
      dispatch(fetchUserTickets());
    }
  }, [dispatch, user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await dispatch(uploadAvatar(file));
    }
  };

  const handleResetAvatar = async () => {
    await dispatch(resetAvatar());
  };

  const handleUsernameSave = async () => {
    setUpdateError(null);
    if (username.trim() && username !== user?.username) {
      const result = await dispatch(updateUsername(username));
      if (updateUsername.fulfilled.match(result)) {
        setIsEditing(false);
      } else if (updateUsername.rejected.match(result)) {
        setUpdateError(result.payload as string || 'Ошибка при обновлении имени');
      }
    } else {
      setIsEditing(false);
    }
  };

  if (!user) {
    return <div className={styles.error}>Пожалуйста, войдите в систему</div>;
  }

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <div className={styles.profileMain}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarBg} />
            <img
              src={
                user.avatarUrl
                  ? (user.avatarUrl.startsWith('/uploads')
                      ? `${process.env.REACT_APP_API_URL?.replace('/api', '')}${user.avatarUrl}`
                      : user.avatarUrl)
                  : process.env.REACT_APP_DEFAULT_AVATAR_URL || '/img/default-avatar.svg'
              }
              alt="Avatar"
              className={styles.avatar}
            />
            <div className={styles.avatarActions}>
              <label className={styles.avatarUpload}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M4 7a2 2 0 012-2h2.172a2 2 0 001.414-.586l.828-.828A2 2 0 0112.828 3h2.344a2 2 0 011.414.586l.828.828A2 2 0 0020 5h2a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V7zm8 3a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 110 4 2 2 0 010-4z" fill="#2563eb"/></svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </label>
              {user.avatarUrl && (
                <button 
                  className={styles.avatarReset}
                  onClick={handleResetAvatar}
                  title="Сбросить аватар"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="#dc3545" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
              )}
            </div>
          </div>
          <div className={styles.greetingBlock}>
            <div className={styles.greeting}>
              {isEditing ? (
                <div className={styles.usernameEdit}>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.usernameInput}
                    placeholder="Введите имя"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUsernameSave();
                      } else if (e.key === 'Escape') {
                        setUsername(user.username);
                        setIsEditing(false);
                        setUpdateError(null);
                      }
                    }}
                  />
                  <div className={styles.usernameActions}>
                    <button 
                      type="button" 
                      className={styles.saveButton}
                      onClick={handleUsernameSave}
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button 
                      type="button" 
                      className={styles.cancelButton}
                      onClick={() => {
                        setUsername(user.username);
                        setIsEditing(false);
                        setUpdateError(null);
                      }}
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                  {updateError && (
                    <div className={styles.updateError}>{updateError}</div>
                  )}
                </div>
              ) : (
                <>
                  Привет, {user.username}!
                  <button
                    className={styles.editButton}
                    onClick={() => setIsEditing(true)}
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M4 17.25V19a.75.75 0 00.75.75h1.75a.75.75 0 00.53-.22l9.72-9.72a.75.75 0 000-1.06l-2.25-2.25a.75.75 0 00-1.06 0l-9.72 9.72a.75.75 0 00-.22.53z" stroke="#2563eb" strokeWidth="2"/><path d="M15.5 6.5l2 2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                </>
              )}
            </div>
          </div>
          <div className={styles.userInfo}>
            <div>Email: {user.email}</div>
            <div>Город: {user.city}</div>
          </div>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{userTickets.length}</div>
              <div className={styles.statLabel}>Куплено билетов</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{user.favorites ? user.favorites.length : 0}</div>
              <div className={styles.statLabel}>Избранное</div>
            </div>
          </div>
          <div className={styles.quickActions}>
            <button className={styles.quickActionBtn} type="button" onClick={() => navigate('/my-tickets')}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M4 7.5A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5v9A2.5 2.5 0 0117.5 19h-11A2.5 2.5 0 014 16.5v-9z" stroke="#2563eb" strokeWidth="2"/><path d="M8 9h8M8 13h5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
              Мои билеты
            </button>
            <button className={styles.quickActionBtn} type="button" onClick={() => navigate('/my-tickets', { state: { tab: 'favorites' } })}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 21s-7-5.686-7-10.5A5.5 5.5 0 0112 5a5.5 5.5 0 017 5.5C19 15.314 12 21 12 21z" stroke="#2563eb" strokeWidth="2"/></svg>
              Избранное
            </button>
            <div className={styles.logoutWrapper}>
              <button className={styles.quickActionBtn + ' ' + styles.logoutBtn} type="button" onClick={() => setShowLogoutConfirm(true)}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
                Выйти
              </button>
              {showLogoutConfirm && (
                <div className={styles.logoutConfirmBox}>
                  <div className={styles.logoutConfirmText}>Выйти из аккаунта?</div>
                  <div className={styles.logoutConfirmActions}>
                    <button className={styles.confirmBtn} onClick={() => { dispatch(logout()); setShowLogoutConfirm(false); }}>Выйти</button>
                    <button className={styles.cancelBtn} onClick={() => setShowLogoutConfirm(false)}>Отмена</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
