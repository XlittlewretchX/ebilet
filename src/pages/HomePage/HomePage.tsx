import React from 'react';
import styles from './HomePage.module.scss';

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Добро пожаловать в eBilet</h1>
    </div>
  );
};

export default HomePage;
