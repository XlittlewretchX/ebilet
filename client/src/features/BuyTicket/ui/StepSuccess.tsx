import React from 'react';
import styles from './StepSuccess.module.scss';

interface StepSuccessProps {
  eventTitle: string;
  places?: string[];
  count?: number;
  onGoToTickets: () => void;
  onGoHome: () => void;
}

const StepSuccess: React.FC<StepSuccessProps> = ({
  eventTitle, places, count, onGoToTickets, onGoHome
}) => (
  <div className={styles.container}>
    <div className={styles.emoji}>🎉</div>
    <h2 className={styles.title}>Покупка успешна!</h2>
    <div className={styles.summary}>
      <div className={styles.eventTitle}>{eventTitle}</div>
      {places && places.length > 0 && (
        <div className={styles.info}>
          Места: {places.join(', ')}
        </div>
      )}
      {count && (
        <div className={styles.info}>
          Количество: {count}
        </div>
      )}
    </div>
    <button
      onClick={onGoToTickets}
      className={styles.buttonPrimary}
    >Мои билеты</button>
    <button
      onClick={onGoHome}
      className={styles.buttonSecondary}
    >На главную</button>
    <div className={styles.thankYou}>
      Спасибо за покупку! Желаем приятного посещения 🎫
    </div>
  </div>
);

export default StepSuccess; 