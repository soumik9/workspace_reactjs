import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { ILoginRequest, IRegisterRequest } from '../../libs/interface/auth.interface';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';

type AuthFormProps = {
  mode: 'login';
  onLogin: (data: ILoginRequest) => Promise<void>;
  onRegister?: never;
  isLoading: boolean;
} | {
  mode: 'register';
  onLogin?: never;
  onRegister: (data: IRegisterRequest) => Promise<string>;
  isLoading: boolean;
};

interface AuthFormValues extends IRegisterRequest {
  confirmPassword: string;
}

export const AuthForm: React.FC<AuthFormProps> = (props) => {

  const { mode, isLoading } = props;

  const isRegister = mode === 'register';
  const { register, handleSubmit, getValues, setError, clearErrors, formState: { errors, isSubmitting: isFormSubmitting } } = useForm<AuthFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    shouldUnregister: true,
  });

  const isSubmitting = isLoading || isFormSubmitting;
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: AuthFormValues) => {
    if (isLoading) return;
    clearErrors('root');
    const { name, email, password } = data;
    try {
      if (props.mode === 'register') {
        await props.onRegister({ name, email, password });
      } else {
        await props.onLogin({ email, password });
      }
    } catch (error: unknown) {
      const response = error as { data?: { message?: string } };
      setError('root', { message: response.data?.message ?? 'Unable to connect. Please try again.' });
    }
  };

  const inputClassName = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500';

  return (
    <>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-purple-600">
        {isRegister ? 'Start something new' : 'Your space awaits'}
      </p>

      <h2 className="text-3xl font-semibold tracking-tight">
        {isRegister ? 'Create your account' : 'Welcome back'}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-gray-500">
        {isRegister ? 'A home for your files, folders, and ideas. Get started today.' : 'Sign in to pick up where you left off.'}
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        onChange={() => clearErrors('root')}
        className="mt-6 flex flex-col space-y-4 [@media(max-height:700px)]:mt-4 [@media(max-height:700px)]:space-y-2"
      >

        {isRegister && (
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
              Full name
            </label>

            <input
              id="name"
              type="text"
              autoComplete="name"
              {...register('name', {
                required: 'Please enter your name.',
                setValueAs: (value: string) => value.trim(),
              })}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              placeholder="Your full name"
              className={inputClassName}
            />
            {errors.name && <p id="name-error" role="alert" className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
            Email address
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email', {
              required: 'Please enter your email address.',
              setValueAs: value => value.trim(),
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address.' },
            })}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            placeholder="you@example.com"
            className={inputClassName}
          />
          {errors.email && <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              {...register('password', {
                required: 'Please enter your password.',
                minLength: { value: 6, message: 'Password must be at least 6 characters.' },
                deps: isRegister ? ['confirmPassword'] : undefined,
              })}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
              placeholder="Enter your password"
              className={`${inputClassName} pr-12`}
            />

            <button type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-4 text-gray-400 hover:text-purple-600 focus-visible:outline-2 focus-visible:outline-purple-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p id="password-error" role="alert" className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        {isRegister && (
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
              Confirm password
            </label>

            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('confirmPassword', {
                required: 'Please confirm your password.',
                validate: value => value === getValues('password') || 'Passwords do not match.',
              })}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              placeholder="Enter your password again"
              className={inputClassName}
            />
            {errors.confirmPassword && <p id="confirmPassword-error" role="alert" className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
          </div>
        )}
        {errors.root && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {errors.root.message}
        </p>}

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="flex w-full items-center justify-center space-x-3 rounded-lg bg-purple-600 mt-1.5 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <span>
            {isSubmitting ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
          </span>
          <FaArrowRight className="h-3 w-3" />
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-gray-500">
        {isRegister ? 'Already have an account? ' : 'New to Workspace? '}

        <Link
          to={isRegister ? '/login' : '/register'}
          className="font-semibold text-purple-600 hover:text-purple-700 hover:underline"
        >
          {isRegister ? 'Sign in' : 'Create an account'}
        </Link>
      </p>
    </>
  );
};
