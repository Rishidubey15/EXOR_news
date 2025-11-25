import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Newspaper, User, LogOut, Menu, X, Bookmark, Settings } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const categories = ['Technology', 'Business', 'Sports', 'Health', 'Science', 'Entertainment'];

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Main Nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">
              <Newspaper size={28} />
              <span>E-XOR NEWS</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              {categories.map((cat) => (
                <NavLink
                  key={cat}
                  to={`/category/${cat.toLowerCase()}`}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors duration-200 ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                    }`
                  }
                >
                  {cat}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Auth buttons and Profile Dropdown */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                
                <div className="relative flex items-center space-x-4">
                  {/* Button for user to add a new article */}
                  <button onClick={() => navigate('/upload')} className="mr-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md transition-colors duration-200">
                    Upload Article
                  </button>

                  <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2 focus:outline-none">
                    <span className="font-medium text-sm">{user?.username}</span>
                    <User className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 p-1.5 text-gray-600 dark:text-gray-300" />
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-40 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                      <Link to="/saved" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Bookmark className="mr-2" size={16} /> Saved Articles
                      </Link>
                       <Link to="/preferences" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Settings className="mr-2" size={16} /> Preferences
                      </Link>
                    
                      <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <LogOut className="mr-2" size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Login
                  </Link>
                  <Link to="/register" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors duration-200">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </div>
       {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {categories.map((cat) => (
                <NavLink
                  key={cat}
                  to={`/category/${cat.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive ? 'bg-indigo-50 dark:bg-gray-900 text-indigo-700 dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                    }`
                  }
                >
                  {cat}
                </NavLink>
              ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              {isAuthenticated ? (
                <div className="px-2 space-y-1">
                    <div className="px-3 py-2">
                        <p className="text-base font-medium text-gray-800 dark:text-white">{user?.username}</p>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    <Link to="/saved" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Saved Articles</Link>
                    <Link to="/preferences" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Preferences</Link>
                    <Link to="/upload" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Upload Article</Link>
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Logout</button>
                </div>
              ) : (
                <div className="px-2 space-y-1">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Login</Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">Sign Up</Link>
                </div>
              )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
