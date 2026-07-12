import React from 'react';
import { cn } from '@/lib/utils/class-names';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, required, id, className, ...props }, ref) => {
    const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const errorId = error ? `${fieldId}-error` : undefined;

    return (
      <div className="form-field">
        {label && (
          <label htmlFor={fieldId} className={cn('form-label', required && 'form-label-required')}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={fieldId}
          className={cn('aether-textarea', className)}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...props}
        />
        {error && <p id={errorId} className="form-error" role="alert">{error}</p>}
        {hint && !error && <p className="form-hint">{hint}</p>}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
