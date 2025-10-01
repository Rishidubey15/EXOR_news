import React, { useState, useEffect } from 'react';
import api from '../services/api.jsx';
import ArticleCard from '../components/core/ArticleCard.jsx';
import LoadingSpinner from '../components/core/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { BookmarkX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SavedArticlesPage = () => {
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchSavedArticles = async () => {
      try {
        setLoading(true);
        const response = await api.get('/user/saved');
        setSavedArticles(response.data);
      } catch (err) {
        setError('Failed to fetch saved articles.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedArticles();
  }, [isAuthenticated, navigate]);

  const handleUnsaveArticle = async (articleId) => {
    try {
        await api.delete(`/user/remove/${articleId}`);
        setSavedArticles(prevArticles => prevArticles.filter(a => a._id !== articleId));
    } catch (error) {
        console.error('Failed to unsave article:', error);
    }
  };


  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900 dark:text-white">Your Saved Articles</h1>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {savedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedArticles.map((article) => (
                <ArticleCard 
                    key={article._id} 
                    article={article}
                    onSave={() => handleUnsaveArticle(article._id)}
                    isSaved={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
                <BookmarkX className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">No saved articles</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">You haven't saved any articles yet. Start exploring!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SavedArticlesPage;

