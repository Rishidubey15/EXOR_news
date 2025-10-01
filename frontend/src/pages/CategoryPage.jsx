import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ArticleCard from '../components/core/ArticleCard';
import LoadingSpinner from '../components/core/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedArticles, setSavedArticles] = useState(new Set());
  const { isAuthenticated } = useAuth();


  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/news?category=${categoryName}`);
        setArticles(response.data);
      } catch (err) {
        setError(`Failed to fetch articles for ${categoryName}.`);
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
  }, [categoryName, isAuthenticated]);

    const handleSaveArticle = async (articleId) => {
        if (!isAuthenticated) return;
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

  return (
    <div>
      <h1 className="text-4xl font-extrabold capitalize mb-6 text-gray-900 dark:text-white">
        {categoryName}
      </h1>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.length > 0 ? (
            articles.map((article) => (
                <ArticleCard 
                    key={article._id} 
                    article={article}
                    onSave={handleSaveArticle}
                    isSaved={savedArticles.has(article._id)}
                />
            ))
          ) : (
            <p>No articles found in this category.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
