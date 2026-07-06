import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Set default authorization header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Verify token and fetch user on load
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me');
        setUser(res.data.user);
      } catch (err) {
        console.error('Session verification failed, logging out:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  // Login handler
  const login = async (username, password, role = 'customer') => {
    try {
      const endpoint = role === 'admin' 
        ? 'http://localhost:5000/api/auth/admin-login' 
        : 'http://localhost:5000/api/auth/login';
        
      const res = await axios.post(endpoint, { username, password });
      const { token: newToken, user: userData } = res.data;
      
      if (role === 'admin' && userData.userType !== 'admin') {
        throw new Error('Not authorized as Admin');
      }
      if (role === 'customer' && userData.userType === 'admin') {
        throw new Error('Please select Admin role to login as administrator');
      }
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return userData;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Login failed');
    }
  };

  // Register handler
  const register = async (username, email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
      const { token: newToken, user: userData } = res.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return userData;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Registration failed');
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('http://localhost:5000/api/auth/profile', profileData);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Profile update failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
