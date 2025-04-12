
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, translations, setLanguage, t }}>
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
