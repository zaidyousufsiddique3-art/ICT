import React, { createContext, useContext, useState, useEffect } from 'react';

// Supported languages
export type Language = 'english' | 'tamil' | 'sinhala';

// Language context type
interface LanguageContextType {
    language: Language | null;
    setLanguage: (lang: Language) => void;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language | null>(() => {
        // Try to load from localStorage
        const saved = localStorage.getItem('selectedLanguage');
        return saved as Language | null;
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('selectedLanguage', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Hook to use language context
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};
