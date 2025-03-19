
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">LoRaWatchdog</h1>
        <p className="text-muted-foreground">Sign in to monitor your devices</p>
      </div>
      
      <AuthForm mode="login" />
      
      <p className="mt-8 text-sm text-muted-foreground">
        Don't have an account?{' '}
        <button 
          onClick={() => navigate('/register')} 
          className="text-primary hover:underline"
        >
          Create an account
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
