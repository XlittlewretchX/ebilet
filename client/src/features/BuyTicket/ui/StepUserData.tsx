import React from 'react';
import styles from './StepUserData.module.scss';
import { useUserData, validateEmail, validatePhone } from '../model/useUserData';

interface StepUserDataProps {
  initialEmail: string;
  onNext: (data: { name: string; phone: string; email: string }) => void;
  onBack?: () => void;
}

const StepUserData: React.FC<StepUserDataProps> = ({ initialEmail, onNext, onBack }) => {
  const { name, setName, phone, setPhone, email, setEmail, touched, setTouched, isValid } = useUserData(initialEmail);

  return (
    <form
      className={styles.form}
      onSubmit={e => { e.preventDefault(); if (isValid) onNext({ name, phone, email }); }}
      autoComplete="off"
    >
      <h2 className={styles.title}>Ваши данные</h2>
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
      <div style={{display:'flex', gap:8, marginTop:8}}>
        {onBack && (
          <button type="button" onClick={onBack} className={styles.prevButton}>Назад</button>
        )}
        <button
          type="submit"
          disabled={!isValid}
          className={styles.nextButton}
        >Далее</button>
      </div>
    </form>
  );
};

export default StepUserData; 