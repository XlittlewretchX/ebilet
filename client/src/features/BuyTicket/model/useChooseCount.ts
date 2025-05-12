import { useState } from 'react';

export const MAX_COUNT = 10;

export function useChooseCount(initialCount = 1) {
  const [count, setCount] = useState(initialCount);
  const decrement = () => setCount(c => Math.max(1, c - 1));
  const increment = () => setCount(c => Math.min(MAX_COUNT, c + 1));
  const setSafeCount = (value: number) => setCount(Math.max(1, Math.min(MAX_COUNT, value)));
  return { count, setCount: setSafeCount, decrement, increment };
} 