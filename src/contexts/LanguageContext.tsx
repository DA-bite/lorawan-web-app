
import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, formatDistanceToNow as formatDistanceToNowFn } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ru } from 'date-fns/locale';
import { russianTranslations, englishTranslations } from '@/translations';

type Language = 'english' | 'russian';

type TranslationsType = {
  [key: string]: string;
};

interface LanguageContextType {
  language: Language;
  translations: TranslationsType;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  formatDate: (date: Date | number, formatStr?: string) => string;
  formatTime: (date: Date | number) => string;
  formatDateTime: (date: Date | number) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  formatDistanceToNow: (date: Date | number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get the language from localStorage
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'english';
  });
  
  const [translations, setTranslations] = useState<TranslationsType>(
    language === 'english' ? englishTranslations : russianTranslations
  );

  // Update translations when language changes
  useEffect(() => {
    setTranslations(language === 'english' ? englishTranslations : russianTranslations);
    localStorage.setItem('language', language);
    // Update document lang attribute for accessibility
    document.documentElement.lang = language === 'english' ? 'en' : 'ru';
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[key] || key;
  };
  
  // Date formatting functions that respect language preferences
  const formatDate = (date: Date | number, formatStr?: string): string => {
    const dateFormat = formatStr || 'PP'; // Default: 'Apr 29, 2023' in English
    return format(date, dateFormat, {
      locale: language === 'english' ? enUS : ru
    });
  };
  
  const formatTime = (date: Date | number): string => {
    const timeFormat = language === 'english' ? 'h:mm a' : 'HH:mm';
    return format(date, timeFormat, {
      locale: language === 'english' ? enUS : ru
    });
  };
  
  const formatDateTime = (date: Date | number): string => {
    const dateTimeFormat = language === 'english' ? 'PPp' : 'PP p';
    return format(date, dateTimeFormat, {
      locale: language === 'english' ? enUS : ru
    });
  };
  
  // Number formatting with proper locale settings
  const formatNumber = (num: number, options?: Intl.NumberFormatOptions): string => {
    const locale = language === 'english' ? 'en-US' : 'ru-RU';
    return new Intl.NumberFormat(locale, options).format(num);
  };
  
  // Relative time formatting (e.g., "2 days ago")
  const formatDistanceToNow = (date: Date | number): string => {
    return formatDistanceToNowFn(date, {
      addSuffix: true,
      locale: language === 'english' ? enUS : ru
    });
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      translations, 
      setLanguage, 
      t,
      formatDate,
      formatTime,
      formatDateTime,
      formatNumber,
      formatDistanceToNow
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
