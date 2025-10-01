import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CategoryPage from './pages/CategoryPage';
import SavedArticlesPage from './pages/SavedArticlesPage';
import PreferencesPage from './pages/PreferencesPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/saved" element={<SavedArticlesPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
