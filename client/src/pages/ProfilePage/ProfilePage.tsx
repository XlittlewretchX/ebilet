import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserEvents } from '@/store/eventSlice';
import { uploadAvatar } from '@/store/authSlice';
import EventCard from '@/components/EventCard/EventCard';
import styles from './ProfilePage.module.scss';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { events, loading, error } = useAppSelector((state) => state.event);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    city: user?.city || '',
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchUserEvents());
    }
  }, [dispatch, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await dispatch(uploadAvatar(file));
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
        <div className={styles.profile}>
          <div className={styles.avatarSection}>
            <img
              src={
                user.avatarUrl
                  ? (user.avatarUrl.startsWith('/uploads')
                      ? `${process.env.REACT_APP_API_URL?.replace('/api', '')}${user.avatarUrl}`
                      : user.avatarUrl)
                  : '/img/default-avatar.svg'
              }
              alt="Avatar"
              className={styles.avatar}
            />
            <label className={styles.avatarUpload}>
              Изменить фото
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <div className={styles.info}>
            {isEditing ? (
              <form className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Имя пользователя</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Город</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.actions}>
                  <button type="submit" className={styles.saveButton}>
                    Сохранить
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setIsEditing(false)}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2>{user.username}</h2>
                <p>{user.email}</p>
                <p>{user.city}</p>
                <button
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  Редактировать профиль
                </button>
              </>
            )}
          </div>
        </div>
        <div className={styles.events}>
          <h3>Мои события</h3>
          <div className={styles.eventsGrid}>
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onAddToFavorites={() => {}}
                onBuyTicket={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
