 import React, { createContext, useContext, useState, useEffect } from 'react';//test
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const API_HOST = process.env.REACT_APP_API_BASE_URL; 
// Expected:
// - Local: REACT_APP_API_BASE_URL=http://localhost:5000
// - Netlify: REACT_APP_API_BASE_URL=https://mern-backend-ysw8.onrender.com

// If API_HOST is set, we force /api prefix because backend mounts routes under /api.
const API_BASE_URL = API_HOST
  ? `${API_HOST.replace(/\/$/, '')}/api`
  : '/api';

const API = axios.create({ baseURL: API_BASE_URL });

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.get('/auth/me')
        .then(({ data }) => setUser(data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    const { data } = await API.put('/auth/update-profile', profileData);
    setUser(data.user);
    return data;
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, isAdmin, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export { API };
export default AuthContext;
