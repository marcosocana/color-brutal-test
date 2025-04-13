
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Dictionary of translations
const translations = {
  es: {
    about: 'About',
    manifesto: 'Manifesto',
    results: 'RESULTADOS',
    round: 'RONDA',
    score: 'PUNTOS',
    similarity: 'similitud',
    target: 'OBJETIVO',
    yourColor: 'TU COLOR',
    copyResults: 'COPIAR RESULTADOS',
    playAgain: 'JUGAR DE NUEVO',
    // Add more translations as needed
  },
  en: {
    about: 'About',
    manifesto: 'Manifesto',
    results: 'RESULTS',
    round: 'ROUND',
    score: 'POINTS',
    similarity: 'similarity',
    target: 'TARGET',
    yourColor: 'YOUR COLOR',
    copyResults: 'COPY RESULTS',
    playAgain: 'PLAY AGAIN',
    // Add more translations as needed
  }
};

type Language = 'es' | 'en';
type TranslationKey = keyof typeof translations.es;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es');

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
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
