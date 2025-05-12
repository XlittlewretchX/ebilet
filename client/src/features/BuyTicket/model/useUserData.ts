import { useState } from 'react';

export function validateEmail(email: string) {
  return /.+@.+\..+/.test(email);
}
export function validatePhone(phone: string) {
  return /^\+?\d{10,15}$/.test(phone.replace(/\D/g, ''));
}

export function useUserData(initialEmail: string) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [touched, setTouched] = useState<{ name?: boolean; phone?: boolean; email?: boolean }>({});

  const isValid = name.trim().length > 2 && validatePhone(phone) && validateEmail(email);

  return {
    name, setName,
    phone, setPhone,
    email, setEmail,
    touched, setTouched,
    isValid
  };
} 