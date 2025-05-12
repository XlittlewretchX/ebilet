import React from 'react';
import styles from './StepUserData.module.scss';
import { useUserData, validateEmail, validatePhone } from '../model/useUserData';
import StepContainer from './common/StepContainer';
import StepButtons from './common/StepButtons';

interface StepUserDataProps {
  initialEmail: string;
  initialData?: { name: string; phone: string; email: string } | null;
  onNext: (data: { name: string; phone: string; email: string }) => void;
  onBack?: () => void;
}

const StepUserData: React.FC<StepUserDataProps> = ({ initialEmail, initialData, onNext, onBack }) => {
  const { 
    name, setName, 
    phone, setPhone, 
    email, setEmail, 
    touched, setTouched, 
    isValid 
  } = useUserData(initialData?.email || initialEmail);

  // Устанавливаем начальные значения при монтировании
  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPhone(initialData.phone);
      setEmail(initialData.email);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onNext({ name, phone, email });
    }
  };

  return (
    <StepContainer title="Ваши данные">
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        {/* ФИО */}
        <label className={styles.label}>
          <span style={{marginBottom:2}}>ФИО</span>
          <div className={styles.inputWrapper}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={() => setTouched(t => ({...t, name:true}))}
              placeholder="Иванов Иван Иванович"
              className={[
                styles.input,
                touched.name && name.trim().length < 3 ? styles.inputError : ''
              ].join(' ')}
              autoComplete="off"
            />
            <span className={styles.icon}>👤</span>
          </div>
          {touched.name && name.trim().length < 3 && <span className={styles.error}>Введите полное имя</span>}
        </label>
        {/* Телефон */}
        <label className={styles.label}>
          <span style={{marginBottom:2}}>Телефон</span>
          <div className={styles.inputWrapper}>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onBlur={() => setTouched(t => ({...t, phone:true}))}
              placeholder="+79991234567"
              className={[
                styles.input,
                touched.phone && !validatePhone(phone) ? styles.inputError : ''
              ].join(' ')}
              autoComplete="off"
            />
            <span className={styles.icon}>📱</span>
          </div>
          {touched.phone && !validatePhone(phone) && <span className={styles.error}>Введите корректный телефон</span>}
        </label>
        {/* Email */}
        <label className={styles.label}>
          <span style={{marginBottom:2}}>Email</span>
          <div className={styles.inputWrapper}>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setTouched(t => ({...t, email:true}))}
              placeholder="email@example.com"
              className={[
                styles.input,
                touched.email && !validateEmail(email) ? styles.inputError : ''
              ].join(' ')}
              autoComplete="off"
            />
            <span className={styles.icon}>✉️</span>
          </div>
          {touched.email && !validateEmail(email) && <span className={styles.error}>Введите корректный email</span>}
        </label>
        <StepButtons
          onNext={() => {
            if (isValid) {
              onNext({ name, phone, email });
            }
          }}
          onBack={onBack}
          isNextDisabled={!isValid}
          nextText="Далее"
        />
      </form>
    </StepContainer>
  );
};

export default StepUserData; 