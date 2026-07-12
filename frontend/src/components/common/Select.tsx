import React from 'react';
import { cn } from '@/lib/utils/class-names';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, id, children, placeholder, className, ...props }, ref) => {
    const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const errorId = error ? `${fieldId}-error` : undefined;

    return (
      <div className="form-field">
        {label && (
          <label htmlFor={fieldId} className={cn('form-label', required && 'form-label-required')}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={fieldId}
          className={cn('aether-select', className)}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        {error && <p id={errorId} className="form-error" role="alert">{error}</p>}
        {hint && !error && <p className="form-hint">{hint}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
