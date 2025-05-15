import React, { useEffect } from 'react';

interface AuthAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthClick: () => void;
}

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

const modalStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
};

const boxStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: '2rem 2.5rem',
  boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
  minWidth: 320,
  maxWidth: '90vw',
  textAlign: 'center',
  position: 'relative',
};

const buttonStyle: React.CSSProperties = {
  marginTop: 24,
  padding: '0.7rem 2.2rem',
  borderRadius: 24,
  border: 'none',
  background: '#2563eb',
  color: '#fff',
  fontWeight: 600,
  fontSize: '1.1rem',
  cursor: 'pointer',
};

const closeStyle: React.CSSProperties = {
  position: 'absolute',
  top: 10,
  right: 16,
  fontSize: 22,
  color: '#888',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};

const AuthAlertModal: React.FC<AuthAlertModalProps> = ({ isOpen, onClose, onAuthClick }) => {
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
    <div style={modalStyle} onClick={onClose}>
      <div style={boxStyle} onClick={e => e.stopPropagation()}>
        <button style={closeStyle} onClick={onClose} aria-label="Закрыть">×</button>
        <div style={{ fontSize: '1.15rem', color: '#222', marginBottom: 16 }}>
          Для продолжения необходимо войти в аккаунт
        </div>
        <button style={buttonStyle} onClick={onAuthClick}>
          Войти или зарегистрироваться
        </button>
      </div>
    </div>
  );
};

export default AuthAlertModal; 