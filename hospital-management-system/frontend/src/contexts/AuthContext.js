import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage for token on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const userData = localStorage.getItem('currentUser');

    if (storedToken) {
      setIsAuthenticated(true);
      setUserRole(role || 'HOSPITAL_MANAGER');
      setToken(storedToken);
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    }

    setLoading(false);
  }, []);

  const login = (token, role = 'HOSPITAL_MANAGER', userInfo = null) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    if (userInfo) {
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      setCurrentUser(userInfo);
    }
    setIsAuthenticated(true);
    setUserRole(role);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userRole,
      currentUser,
      token,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;