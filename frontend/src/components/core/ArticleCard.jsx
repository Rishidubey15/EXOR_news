import React from 'react';
import { Bookmark, ExternalLink, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article, onSave, isSaved, unsaveMode = false }) => {
  const { title, source, summary, category, isFakeNews, url, publishedAt } = article;

  const handleSaveClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onSave(article._id);
  };

  return (
    <Link to={`/article/${article._id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer">
        {isFakeNews && (
          <div className="p-2 bg-yellow-400 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 flex items-center text-sm font-semibold">
            <AlertTriangle size={16} className="mr-2" />
            <span>Potentially Misleading Content</span>
          </div>
        )}
        <div className="p-6 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{category}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(publishedAt).toLocaleDateString()}</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-grow">{summary}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{source}</span>
          <div className="flex items-center space-x-4">
            {unsaveMode ? (
              <button
                onClick={handleSaveClick}
                className="p-2 rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 transition-colors duration-200"
                aria-label="Unsave article"
                onMouseDown={e => e.stopPropagation()}
              >
                <Bookmark size={18} fill={'currentColor'} />
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveClick}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    isSaved
                      ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                  }`}
                  aria-label={isSaved ? "Unsave article" : "Save article"}
                  onMouseDown={e => e.stopPropagation()}
                >
                  <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                </button>

                {/* Removed external link button for now, will add inside article details page */}
                {/* <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                  aria-label="Read full article"
                  onMouseDown={e => e.stopPropagation()}
                >
                  <ExternalLink size={18} />
                </a> */}
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
