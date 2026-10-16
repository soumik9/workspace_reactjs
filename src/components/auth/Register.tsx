import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layout/AuthLayout';
import { AuthForm } from './AuthForm';
import { useRegisterMutation } from '../../libs/redux/feature/auth/auth.api';
import type { IRegisterRequest } from '../../libs/interface/auth.interface';
import type { RootState } from '../../libs/redux/store/store.redux';
import { errorNotify, successNotify } from '../../libs/helper/notify.helper';

export const Register: React.FC = () => {

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Handle form submission
  const onSubmit = async (data: IRegisterRequest): Promise<string> => {
    try {
      const response = await register({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
      }).unwrap();

      successNotify(response.message || "Registration successful");
      navigate("/login", { replace: true });
      return response.message || "Registration successful";
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
        mode="register"
        onRegister={onSubmit}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
};
