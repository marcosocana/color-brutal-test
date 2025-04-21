
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Dictionary of translations
const translations = {
  es: {
    about: 'Sobre Nosotros',
    manifesto: 'Manifiesto',
    results: 'RESULTADOS',
    round: 'RONDA',
    score: 'PUNTOS',
    similarity: 'similitud',
    target: 'OBJETIVO',
    yourColor: 'TU COLOR',
    copyResults: 'COPIAR RESULTADOS',
    playAgain: 'JUGAR DE NUEVO',
    // Game screen translations
    colorTarget: 'COLOR OBJETIVO',
    yourSelection: 'TU SELECCIÓN',
    preparing: 'Preparando siguiente ronda...',
    // Feedback translations
    impressive: '¡IMPRESIONANTE! ¿Trabajas para Pantone o qué?',
    excellent: 'EXCELENTE OJO CROMÁTICO. Podrías ser diseñador.',
    goodJob: 'BUEN TRABAJO. Tu percepción del color es superior a la media.',
    notBad: 'NO ESTÁ MAL. Hay potencial en tu ojo para el color.',
    needsImprovement: 'MEJORABLE. ¿Quizás necesitas calibrar tu monitor?',
    concerning: 'PREOCUPANTE. ¿Has considerado hacerte una prueba de daltonismo?',
    colorblind: '¿ERES DISEÑADOR O DALTÓNICO? No lo tengo claro.',
    // Add more translations as needed
  },
  en: {
    about: 'About Us',
    manifesto: 'Manifesto',
    results: 'RESULTS',
    round: 'ROUND',
    score: 'POINTS',
    similarity: 'similarity',
    target: 'TARGET',
    yourColor: 'YOUR COLOR',
    copyResults: 'COPY RESULTS',
    playAgain: 'PLAY AGAIN',
    // Game screen translations
    colorTarget: 'TARGET COLOR',
    yourSelection: 'YOUR SELECTION',
    preparing: 'Preparing next round...',
    // Feedback translations
    impressive: 'IMPRESSIVE! Do you work for Pantone or what?',
    excellent: 'EXCELLENT COLOR VISION. You could be a designer.',
    goodJob: 'GOOD JOB. Your color perception is above average.',
    notBad: 'NOT BAD. There\'s potential in your eye for color.',
    needsImprovement: 'NEEDS IMPROVEMENT. Perhaps you need to calibrate your monitor?',
    concerning: 'CONCERNING. Have you considered taking a colorblindness test?',
    colorblind: 'ARE YOU A DESIGNER OR COLORBLIND? I\'m not sure.',
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
