import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import { KnowledgePage } from './pages/KnowledgePage';

export const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/knowledge" element={<KnowledgePage />} />
            </Routes>
        </Router>
    );
};
