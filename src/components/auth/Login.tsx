import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layout/AuthLayout';
import { AuthForm } from './AuthForm';
import { useLoginMutation } from '../../libs/redux/feature/auth/auth.api';
import type { ILoginRequest } from '../../libs/interface/auth.interface';
import type { RootState } from '../../libs/redux/store/store.redux';
import { errorNotify, successNotify } from '../../libs/helper/notify.helper';

export const Login: React.FC = () => {

  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Handle form submission
  const onSubmit = async (data: ILoginRequest): Promise<void> => {
    try {
      const response = await login({
        email: data.email.trim(),
        password: data.password,
      }).unwrap();

      successNotify(response.message || "Login successful");
      navigate("/", { replace: true });
    } catch (error: unknown) {
      const response = error as { data?: { message?: string } };
      errorNotify(response.data?.message || "Something went wrong");
      throw error;
    }
  };

  // Redirect if already logged
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout>
      <AuthForm
        mode="login"
        onLogin={onSubmit}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
};
