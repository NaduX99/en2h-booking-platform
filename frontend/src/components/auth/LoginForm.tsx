'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { loginSchema, LoginFormData } from '@/lib/validation/auth.schemas';
import styles from './AuthForm.module.css';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
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
        <label htmlFor="password" className="form-label form-label-required">Password</label>
        <div className={styles.passwordWrapper}>
          <input
            id="password"
            type={showPw ? 'text' : 'password'}
            className={`aether-input ${styles.passwordInput}`}
            autoComplete="current-password"
            placeholder="Enter password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
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
        {errors.password && (
          <p id="password-error" className="form-error" role="alert">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
        Login
      </Button>
    </form>
  );
}
