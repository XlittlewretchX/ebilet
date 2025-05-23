import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import { login, register, clearError } from '@/features/AuthModal/model/authSlice';
import styles from '@/features/AuthModal/ui/AuthModal.module.scss';
import type { RootState } from '@/app/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const city = useAppSelector((state: RootState) => state.city.name);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      dispatch(clearError());
      dispatch({ type: 'auth/register/rejected', payload: 'Пароли не совпадают' });
      return;
    }

    if (isLogin) {
      const { email, confirmPassword, ...loginData } = formData;
      await dispatch(login(loginData));
    } else {
      const { confirmPassword, ...registerData } = formData;
      const result = await dispatch(register({ ...registerData, city }));
      if (register.fulfilled.match(result)) {
        setSuccessMessage('Вы успешно зарегистрировались!');
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 1500);
      }
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated && isLogin) {
      onClose();
    }
  }, [isAuthenticated, isOpen, isLogin, onClose]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setSuccessMessage('');
      dispatch(clearError());
    }
  }, [isOpen, isLogin, dispatch]);

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    dispatch(clearError());
  };

  function getScrollbarWidth() {
    if (typeof window === 'undefined') return 0;
    const scrollDiv = document.createElement('div');
    scrollDiv.style.width = '100px';
    scrollDiv.style.height = '100px';
    scrollDiv.style.overflow = 'scroll';
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  }

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = getScrollbarWidth();
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="username"
              placeholder="Имя пользователя"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          {!isLogin && (
            <div className={styles.formGroup}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className={styles.formGroup}>
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {!isLogin && (
            <div className={styles.formGroup}>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Подтвердите пароль"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
          {error && <p className={styles.error}>{error}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}
        </form>
        <p className={styles.switch}>
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          <button onClick={handleModeSwitch}>
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
