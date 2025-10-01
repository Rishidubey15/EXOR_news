import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ArticleCard from '../components/core/ArticleCard';
import LoadingSpinner from '../components/core/LoadingSpinner';
import Sidebar from '../components/layout/Sidebar';
import { Search } from 'lucide-react';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedArticles, setSavedArticles] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const endpoint = isAuthenticated ? '/news/personalized' : '/news';
        const response = await api.get(endpoint);
        setArticles(response.data);
      } catch (err) {
        setError('Failed to fetch articles. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedArticles = async () => {
        if (isAuthenticated) {
            try {
                const response = await api.get('/user/saved');
                const savedIds = new Set(response.data.map(a => a._id));
                setSavedArticles(savedIds);
            } catch (error) {
                console.error("Could not fetch saved articles", error);
            }
        }
    }

    fetchArticles();
    fetchSavedArticles();
  }, [isAuthenticated]);

  const handleSaveArticle = async (articleId) => {
    if (!isAuthenticated) {
        // Optionally, redirect to login or show a message
        alert("Please log in to save articles.");
        return;
    }
    try {
        const isCurrentlySaved = savedArticles.has(articleId);
        if (isCurrentlySaved) {
            await api.delete(`/user/remove/${articleId}`);
            setSavedArticles(prev => {
                const newSet = new Set(prev);
                newSet.delete(articleId);
                return newSet;
            });
        } else {
            await api.post(`/user/save/${articleId}`);
            setSavedArticles(prev => new Set(prev).add(articleId));
        }
    } catch (error) {
        console.error('Failed to update saved articles:', error);
    }
  };
  
  const filteredArticles = articles.filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {isAuthenticated && (
        <div className="lg:w-1/4">
          <Sidebar />
        </div>
      )}
      <div className={isAuthenticated ? "lg:w-3/4" : "w-full"}>
        <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                {isAuthenticated ? `Welcome back, ${user.username}!` : 'Latest Headlines'}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
                {isAuthenticated ? 'Your personalized news feed.' : 'Top stories from around the world.'}
            </p>
        </div>

        <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>


        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                    <ArticleCard 
                        key={article._id} 
                        article={article} 
                        onSave={handleSaveArticle} 
                        isSaved={savedArticles.has(article._id)}
                    />
                ))
            ) : (
                <p>No articles found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
