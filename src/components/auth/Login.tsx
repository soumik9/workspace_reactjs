import React from 'react';
import { AuthLayout } from '../layout/AuthLayout';
import { AuthForm } from './AuthForm';

export const Login: React.FC = () => {
  return (
    <AuthLayout>
      <AuthForm mode="login" />
    </AuthLayout>
  );
};
