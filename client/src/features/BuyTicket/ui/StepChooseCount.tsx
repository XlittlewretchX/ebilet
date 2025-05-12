import React from 'react';
import styles from './StepChooseCount.module.scss';
import { useChooseCount, MAX_COUNT } from '../model/useChooseCount';
import StepContainer from './common/StepContainer';
import StepButtons from './common/StepButtons';

interface StepChooseCountProps {
  onNext: (count: number) => void;
  onBack?: () => void;
  initialCount?: number;
}

const StepChooseCount: React.FC<StepChooseCountProps> = ({ onNext, onBack, initialCount = 1 }) => {
  const { count, decrement, increment, setCount } = useChooseCount(initialCount);

  return (
    <StepContainer title="Выбор количества билетов">
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
      <div className={styles.hint}>Максимум {MAX_COUNT} билетов за одну покупку</div>
      <StepButtons
        onNext={() => onNext(count)}
        onBack={onBack}
      />
    </StepContainer>
  );
};

export default StepChooseCount; 