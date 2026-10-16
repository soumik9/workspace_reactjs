import React from 'react';
import { AuthLayout } from '../layout/AuthLayout';
import { AuthForm } from './AuthForm';

export const Register: React.FC = () => {
  return (
    <AuthLayout>
      <AuthForm mode="register" />
    </AuthLayout>
  );
};
