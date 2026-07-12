import React from 'react';
import { cn } from '@/lib/utils/class-names';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, id, className, ...props }, ref) => {
    const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const errorId = error ? `${fieldId}-error` : undefined;
    const hintId = hint ? `${fieldId}-hint` : undefined;

    return (
      <div className="form-field">
        {label && (
          <label htmlFor={fieldId} className={cn('form-label', required && 'form-label-required')}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={fieldId}
          className={cn('aether-input', className)}
          aria-invalid={!!error}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          {...props}
        />
        {hint && !error && <p id={hintId} className="form-hint">{hint}</p>}
        {error && <p id={errorId} className="form-error" role="alert">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
