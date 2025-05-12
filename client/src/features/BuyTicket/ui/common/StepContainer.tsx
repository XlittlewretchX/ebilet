import React from 'react';
import styles from './StepContainer.module.scss';

interface StepContainerProps {
  children: React.ReactNode;
  title: string;
}

const StepContainer: React.FC<StepContainerProps> = ({ children, title }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </div>
  );
};

export default StepContainer; 