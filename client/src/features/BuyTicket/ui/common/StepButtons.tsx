import React from 'react';
import styles from './StepButtons.module.scss';

interface StepButtonsProps {
  onNext: () => void;
  onBack?: () => void;
  nextText?: string;
  isNextDisabled?: boolean;
  isLoading?: boolean;
}

const StepButtons: React.FC<StepButtonsProps> = ({
  onNext,
  onBack,
  nextText = 'Далее',
  isNextDisabled = false,
  isLoading = false,
}) => {
  return (
    <div className={styles.container}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className={styles.backButton}
        >
          Назад
        </button>
      )}
      <button
        type={nextText === 'Далее' ? 'button' : 'submit'}
        onClick={nextText === 'Далее' ? onNext : undefined}
        disabled={isNextDisabled || isLoading}
        className={styles.nextButton}
      >
        {isLoading ? 'Загрузка...' : nextText}
      </button>
    </div>
  );
};

export default StepButtons; 