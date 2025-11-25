import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react'; // 1. Import useMemo and useCallback
import api from '../services/api.jsx';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/me')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch current user profile after obtaining token
      const me = await api.get('/auth/me');
      setUser(me.data);
      navigate('/');
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  }, []);

  const register = useCallback(async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const me = await api.get('/auth/me');
      setUser(me.data);
      navigate('/');
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const updateUser = useCallback((newUser) => {
    setUser(newUser);
  }, []);

  // This ensures the object reference only changes when user or loading state changes.
  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateUser,
  }), [user, loading, login, register, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};