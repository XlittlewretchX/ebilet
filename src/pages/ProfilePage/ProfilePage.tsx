import React from 'react';
import styles from './ProfilePage.module.scss';

const ProfilePage: React.FC = () => {
  const user = {
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    city: 'Москва',
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ваш профиль</h1>
      <div className={styles.profileInfo}>
        <div className={styles.profileInfo__item}>
          <strong>Имя:</strong> {user.name}
        </div>
        <div className={styles.profileInfo__item}>
          <strong>Email:</strong> {user.email}
        </div>
        <div className={styles.profileInfo__item}>
          <strong>Город:</strong> {user.city}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
