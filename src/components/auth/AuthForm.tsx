import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {

  const isRegister = mode === 'register';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (isRegister && !name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setMessage('This form is ready. Account authentication will be available once the API is connected.');
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
        onSubmit={handleSubmit}
        onChange={() => { setError(''); setMessage(''); }}
        className="mt-6 flex flex-col space-y-4 [@media(max-height:700px)]:mt-4 [@media(max-height:700px)]:space-y-2"
      >

        {isRegister && (
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className={inputClassName}
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </div>

        {isRegister && (
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
              Confirm password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter your password again"
              className={inputClassName}
            />
          </div>
        )}
        {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>}
        {message && <p role="status" className="rounded-lg bg-purple-50 px-4 py-3 text-sm text-purple-700">
          {message}
        </p>}

        <button
          type="submit"
          className="flex w-full items-center justify-center space-x-3 rounded-lg bg-purple-600 mt-1.5 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <span>
            {isRegister ? 'Create account' : 'Sign in'}
          </span>
          <FaArrowRight className="h-3 w-3" />
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-gray-500">
        {isRegister ? 'Already have an account? ' : 'New to Workspace? '}
        <Link to={isRegister ? '/login' : '/register'} className="font-semibold text-purple-600 hover:text-purple-700 hover:underline">{isRegister ? 'Sign in' : 'Create an account'}</Link>
      </p>
    </>
  );
};
