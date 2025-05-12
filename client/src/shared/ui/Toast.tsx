import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const bgColors = {
  success: '#4BB543',
  error: '#e74c3c',
  info: '#2563eb',
};

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div style={{
      position: 'fixed',
      top: 24,
      right: 24,
      zIndex: 9999,
      background: bgColors[type],
      color: '#fff',
      padding: '14px 28px',
      borderRadius: 8,
      fontSize: 17,
      fontWeight: 600,
      boxShadow: '0 4px 16px #0002',
      minWidth: 220,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      animation: 'toast-in 0.3s',
    }}>
      {type === 'success' && <span style={{fontSize:22}}>✔️</span>}
      {type === 'error' && <span style={{fontSize:22}}>❌</span>}
      {type === 'info' && <span style={{fontSize:22}}>ℹ️</span>}
      <span>{message}</span>
      <button onClick={onClose} style={{marginLeft:'auto', background:'none', border:'none', color:'#fff', fontSize:20, cursor:'pointer'}}>×</button>
      <style>{`
        @keyframes toast-in { from { opacity: 0; transform: translateY(-20px);} to { opacity: 1; transform: none;}}
      `}</style>
    </div>
  );
};

export default Toast; 