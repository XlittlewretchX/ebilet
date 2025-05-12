import React from 'react';
import styles from './StepChooseCount.module.scss';
import { useChooseCount, MAX_COUNT } from '../model/useChooseCount';

interface StepChooseCountProps {
  onNext: (count: number) => void;
  onBack?: () => void;
}

const StepChooseCount: React.FC<StepChooseCountProps> = ({ onNext, onBack }) => {
  const { count, decrement, increment, setCount } = useChooseCount(1);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Выбор количества билетов</h2>
      <div className={styles.counterRow}>
        <button
          onClick={decrement}
          disabled={count === 1}
          className={styles.button}
          aria-label="Уменьшить количество"
        >-</button>
        <input
          type="number"
          min={1}
          max={MAX_COUNT}
          value={count}
          onChange={e => setCount(Number(e.target.value))}
          className={styles.input}
          aria-label="Количество билетов"
        />
        <button
          onClick={increment}
          disabled={count === MAX_COUNT}
          className={styles.button}
          aria-label="Увеличить количество"
        >+</button>
      </div>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        {onBack && (
          <button 
            onClick={onBack} 
            className={styles.prevButton}
          >Назад</button>
        )}
        <button
          onClick={() => onNext(count)}
          className={styles.nextButton}
        >Далее</button>
      </div>
      <div className={styles.hint}>Максимум {MAX_COUNT} билетов за одну покупку</div>
    </div>
  );
};

export default StepChooseCount; 