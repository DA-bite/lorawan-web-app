
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useLanguage } from '@/contexts/LanguageContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 animate-fade-in px-0 py-0">
      <div className="mb-8 text-center">
        <p className="text-muted-foreground">{t('sign_in_to_monitor')}</p>
      </div>
      
      <AuthForm mode="login" />
      
      <p className="mt-8 text-sm text-muted-foreground">
        {t('dont_have_account')}{' '}
        <button onClick={() => navigate('/register')} className="text-primary hover:underline">
          {t('create_account')}
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
