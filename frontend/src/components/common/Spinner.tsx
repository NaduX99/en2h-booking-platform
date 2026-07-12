import React from 'react';
import { cn } from '@/lib/utils/class-names';
import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 20, className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(styles.spinner, className)}
      style={{ width: size, height: size }}
    />
  );
}
