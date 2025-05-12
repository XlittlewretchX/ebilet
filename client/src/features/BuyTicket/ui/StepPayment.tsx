import React from 'react';
import styles from './StepPayment.module.scss';
import { usePayment } from '../model/usePayment';

interface StepPaymentProps {
  eventTitle: string;
  amount: number;
  onPay: () => void;
  loading?: boolean;
  onBack?: () => void;
}

const StepPayment: React.FC<StepPaymentProps> = ({ eventTitle, amount, onPay, loading, onBack }) => {
  const {
    card, setCard,
    date, setDate,
    cvv, setCvv,
    touched, setTouched,
    dateRef, cvvRef,
    formatCardNumber,
    isCardValid, isDateValid, isCvvValid, isValid
  } = usePayment();

  return (
    <form
      className={styles.form}
      onSubmit={e => { e.preventDefault(); if (isValid && !loading) onPay(); }}
      autoComplete="off"
    >
      <h2 className={styles.title}>Оплата билета</h2>
      <div className={styles.summary}>
        <div className={styles.eventTitle}>{eventTitle}</div>
        <div className={styles.amount}>Сумма к оплате: <b>{amount} ₽</b></div>
      </div>
      <label className={styles.label}>
        <span>Номер карты</span>
        <input
          value={card}
          onChange={e => {
            const raw = e.target.value.replace(/[^\d ]/g, '');
            setCard(raw);
            if (raw.replace(/\s/g, '').length === 16 && dateRef.current) {
              dateRef.current.focus();
            }
          }}
          onBlur={e => {
            setTouched(t => ({...t, card:true}));
            setCard(formatCardNumber(e.target.value));
          }}
          placeholder="0000 0000 0000 0000"
          maxLength={19}
          className={[styles.input, touched.card && !isCardValid ? styles.inputError : ''].join(' ')}
        />
        {touched.card && !isCardValid && <span className={styles.error}>Введите 16 цифр</span>}
      </label>
      <div className={styles.row}>
        <label className={styles.label} style={{flex:1}}>
          <span>Срок</span>
          <input
            ref={dateRef}
            value={date}
            onChange={e => {
              let val = e.target.value.replace(/[^\d/]/g, '');
              if (val.length === 2 && date.length === 1) val += '/';
              if (val.length > 5) val = val.slice(0,5);
              setDate(val);
              if (/^\d{2}\/\d{2}$/.test(val) && isDateValid && cvvRef.current) {
                cvvRef.current.focus();
              }
            }}
            onBlur={() => setTouched(t => ({...t, date:true}))}
            placeholder="MM/YY"
            maxLength={5}
            className={[styles.input, touched.date && !isDateValid ? styles.inputError : ''].join(' ')}
          />
          {touched.date && !isDateValid && <span className={styles.error}>Месяц/год некорректны</span>}
        </label>
        <label className={styles.label} style={{flex:1}}>
          <span>CVV</span>
          <input
            ref={cvvRef}
            value={cvv}
            onChange={e => {
              const val = e.target.value.replace(/[^\d]/g, '').slice(0,3);
              setCvv(val);
            }}
            onBlur={() => setTouched(t => ({...t, cvv:true}))}
            placeholder="123"
            maxLength={3}
            className={[styles.input, touched.cvv && !isCvvValid ? styles.inputError : ''].join(' ')}
            type="password"
          />
          {touched.cvv && !isCvvValid && <span className={styles.error}>3 цифры</span>}
        </label>
      </div>
      <div className={styles.secure}>
        <span className={styles.secureIcon}>🔒</span> Платёж защищён
      </div>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        {onBack && (
          <button type="button" onClick={onBack} className={styles.prevButton}>Назад</button>
        )}
        <button
          type="submit"
          disabled={!isValid || loading}
          className={styles.payButton}
        >{loading ? 'Оплата...' : 'Оплатить'}</button>
      </div>
    </form>
  );
};

export default StepPayment; 