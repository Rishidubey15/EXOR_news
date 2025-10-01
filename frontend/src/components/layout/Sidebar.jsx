import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Bookmark, Settings, Hash } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) {
    return null; // Don't render sidebar if not logged in
  }

  return (
    <aside className="w-full lg:w-64 xl:w-72 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-fit sticky top-24">
      <div className="flex flex-col items-center mb-6">
        <User className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 p-3 text-gray-600 dark:text-gray-300 mb-3" />
        <h2 className="text-xl font-bold">{user.username}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
      </div>
      <nav className="space-y-2">
        <Link to="/preferences" className="flex items-center p-3 text-base font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <Settings className="text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white" />
          <span className="ml-3">Manage Preferences</span>
        </Link>
        <Link to="/saved" className="flex items-center p-3 text-base font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <Bookmark className="text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white" />
          <span className="ml-3">Saved Articles</span>
        </Link>
      </nav>
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-3 flex items-center"><Hash size={20} className="mr-2" /> Your Topics</h3>
        <div className="flex flex-wrap gap-2">
          {user.preferences && user.preferences.length > 0 ? (
             user.preferences.map(pref => (
              <span key={pref} className="px-3 py-1 text-sm font-medium text-indigo-800 bg-indigo-100 dark:text-indigo-200 dark:bg-indigo-900 rounded-full">{pref}</span>
             ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No preferences set.</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
