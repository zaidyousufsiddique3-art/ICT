import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageSelectionPage } from './pages/LanguageSelectionPage';
import { KnowledgePage } from './pages/KnowledgePage';
import App from './App';
import { useLanguage } from './contexts/LanguageContext';

// Protected route component - requires language selection
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { language } = useLanguage();

    if (!language) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Language selection is the first mandatory screen */}
                <Route path="/" element={<LanguageSelectionPage />} />

                {/* Home page - protected, requires language */}
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <App />
                        </ProtectedRoute>
                    }
                />

                {/* Knowledge base - protected, requires language */}
                <Route
                    path="/knowledge"
                    element={
                        <ProtectedRoute>
                            <KnowledgePage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};
