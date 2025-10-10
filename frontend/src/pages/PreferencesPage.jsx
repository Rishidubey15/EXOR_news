import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const ALL_CATEGORIES = ['Technology', 'Business', 'Sports', 'Health', 'Science', 'Entertainment', 'Politics'];

const PreferencesPage = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.preferences) {
      setSelectedPrefs(user.preferences);
    }
  }, [user, isAuthenticated, navigate]);

  const handleTogglePreference = (pref) => {
    setSelectedPrefs(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await api.put('/user/preferences', { preferences: selectedPrefs });
      setMessage('Preferences updated successfully!');
      // Update user in AuthContext so preferences reflect immediately
      if (user) {
        updateUser({ ...user, preferences: selectedPrefs });
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update preferences. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Manage Your Preferences</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Select the topics you're most interested in to personalize your news feed.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ALL_CATEGORIES.map(category => (
              <button
                type="button"
                key={category}
                onClick={() => handleTogglePreference(category)}
                className={`p-4 rounded-lg text-center font-medium transition-all duration-200 border-2 ${
                  selectedPrefs.includes(category)
                    ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-transparent hover:border-indigo-500'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isLoading ? 'Saving...' : 'Save Preferences'}
          </button>
          {message && <p className={`text-sm ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
        </div>
      </form>
    </div>
  );
};

export default PreferencesPage;
