import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import SavedArticlesPage from './pages/SavedArticlesPage.jsx';
import PreferencesPage from './pages/PreferencesPage.jsx';

function App() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 lg:p-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/saved" element={<SavedArticlesPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

