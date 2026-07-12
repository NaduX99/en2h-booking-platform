'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { registerSchema, RegisterFormData } from '@/lib/validation/auth.schemas';
import styles from './AuthForm.module.css';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
      <Input
        label="Full Name"
        type="text"
        required
        autoComplete="name"
        placeholder="Jane Smith"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="form-field">
        <label htmlFor="reg-password" className="form-label form-label-required">Password</label>
        <div className={styles.passwordWrapper}>
          <input
            id="reg-password"
            type={showPw ? 'text' : 'password'}
            className={`aether-input ${styles.passwordInput}`}
            autoComplete="new-password"
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            aria-invalid={!!errors.password}
            aria-describedby="reg-pw-hint reg-pw-error"
            {...register('password')}
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPw(!showPw)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p id="reg-pw-hint" className="form-hint">At least 8 characters, 1 uppercase, 1 number</p>
        {errors.password && (
          <p id="reg-pw-error" className="form-error" role="alert">{errors.password.message}</p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="confirm-password" className="form-label form-label-required">Confirm Password</label>
        <input
          id="confirm-password"
          type={showPw ? 'text' : 'password'}
          className="aether-input"
          autoComplete="new-password"
          placeholder="Repeat password"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirm-pw-error' : undefined}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p id="confirm-pw-error" className="form-error" role="alert">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
        Create Account
      </Button>
    </form>
  );
}
