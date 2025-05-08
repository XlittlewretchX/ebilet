import React from 'react';
import styles from './MyTicketPage.module.scss';

const MyTicketsPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Мои события</h1>
      <p>
        Здесь будут отображаться все купленные билеты пользователя на события.
      </p>
    </div>
  );
};

export default MyTicketsPage;
