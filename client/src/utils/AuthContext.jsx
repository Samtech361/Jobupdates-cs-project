import { createContext, useState, useContext, useEffect } from 'react';
import tokenService from './tokenRefresh';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const checkAuth = () => {
    const token = tokenService.getToken();
    const userData = localStorage.getItem('user');
    setIsAuthenticated(!!token && !tokenService.isTokenExpired(token));
    setUser(userData ? JSON.parse(userData) : null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (token, userData) => {
    tokenService.setToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    tokenService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);