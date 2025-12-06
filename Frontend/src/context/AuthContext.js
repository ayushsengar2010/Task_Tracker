// client/src/context/AuthContext.js
'use client'; // Required for App Router

import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Note: different import for App Router

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Use environment variable or default
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'; 

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          // Optional: Validate token with backend
          try {
            const res = await axios.get(`${API_URL}/tasks`, {
              headers: { 'x-auth-token': storedToken }
            });
            setUser({ authenticated: true });
          } catch (err) {
            // Token is invalid, clear it
            localStorage.removeItem('token');
            setToken(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const res = await axios.post(`${API_URL}/auth/login`, { 
        email: email.toLowerCase(), 
        password 
      });

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser({ authenticated: true, email });
      setError(null);
      
      // Redirect to dashboard
      setTimeout(() => router.push('/dashboard'), 100);
      
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.message || 'Login failed';
      setError(errorMsg);
      console.error('Login error:', errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, confirmPassword) => {
    try {
      setError(null);
      setLoading(true);

      if (!email || !password || !confirmPassword) {
        throw new Error('All fields are required');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const res = await axios.post(`${API_URL}/auth/register`, { 
        email: email.toLowerCase(), 
        password 
      });

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser({ authenticated: true, email });
      setError(null);
      
      // Redirect to dashboard
      setTimeout(() => router.push('/dashboard'), 100);
      
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.message || 'Registration failed';
      setError(errorMsg);
      console.error('Registration error:', errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
    router.push('/');
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ 
      token, 
      user,
      loading,
      error,
      login, 
      register, 
      logout,
      clearError,
      API_URL 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};