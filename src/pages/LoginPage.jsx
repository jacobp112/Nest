import React from 'react';
import AuthCard from '../components/AuthCard';
import NestFinanceLandingPage from '../pages/NestFinanceLandingPage';

const LoginPage = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background text-text-primary">
        <NestFinanceLandingPage />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <AuthCard />
        </div>
    </div>
  );
};

export default LoginPage;
