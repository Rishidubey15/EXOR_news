import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import LoadingSpinner from "../components/core/LoadingSpinner";
import { ExternalLink, AlertTriangle } from 'lucide-react';


const ArticleDetailsPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/news/${id}`);
        setArticle(response.data);
      } catch (err) {
        setError("Failed to fetch article details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleGenerateSummary = async () => {
    // We use the 'id' from useParams() which corresponds to the article object ID
    if (!id) return; 

    try {
      setLoadingSummary(true);
      
      const summaryApiUrl = 'http://10.252.103.113:8888/sumzee/';
      
      const response = await api.get(summaryApiUrl, {
        params: {
          id: '68e8ca627dc3120512effce6' 
        }
      });
      
      setSummary(response.data.summary);

    } catch (err) {
      console.error("Failed to generate summary", err);
      setSummary("Could not generate a summary at this time.");
    } finally {
      setLoadingSummary(false);
    }
  };  

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!article) return <p>Article not found.</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {article.isFakeNews && (
          <div className="p-2 bg-red-400 dark:bg-yellow-600 text-white-900 dark:text-yellow-100 flex items-center text-sm font-semibold mb-4">
            <AlertTriangle size={16} className="mr-2" />
            <span>May Contain Fake News</span>
          </div>
      )}
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

      {/* Summarization Section */}
      <div className="my-6">
        <button
          onClick={handleGenerateSummary}
          disabled={loadingSummary}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {loadingSummary ? 'Generating...' : 'Generate AI Summary'}
        </button>
        {summary && (
          <div className="mt-4 p-4 bg-indigo-50 dark:bg-gray-800 border-l-4 border-indigo-500 rounded-r-lg">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Summary:</h3>
            <p className="text-gray-700 dark:text-gray-300 mt-2">{summary}</p>
          </div>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {article.description}
      </p>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {article.source} &middot; {new Date(article.publishedAt).toLocaleDateString()}
      </div>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-1 text-indigo-700 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 mt-4"
        aria-label="Read full article"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <span className="">Source Link</span> <ExternalLink size={18} />
      </a>
    </div>
  );
};

export default ArticleDetailsPage;
