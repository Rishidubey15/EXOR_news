import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const UploadArticlePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!isAuthenticated) {
      setError('You must be logged in to upload an article.');
      return;
    }
    if (!url.trim()) {
      setError('Please enter a valid URL.');
      return;
    }
    try {
      setLoading(true);
      // const uploadApi =
      await api.post('/news/upload', { url: url.trim() });
      // Redirect to home; HomePage will re-fetch articles
      navigate('/');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to add article';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Upload Article</h2>
      <p className="text-sm text-gray-500 mb-4">Paste an article link below to add it to the feed.</p>
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="https://example.com/article-link"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700"
        />
        <div className="flex items-center space-x-2">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Adding...' : 'Add Article'}
          </button>
          <button type="button" onClick={() => navigate('/')} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UploadArticlePage;
