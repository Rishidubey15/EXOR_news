import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const LoginPage = () => {
  // We remove the navbar for a focused auth experience.
  // The AuthForm itself is a full-page component.
  return <AuthForm isRegister={false} />;
};

export default LoginPage;
