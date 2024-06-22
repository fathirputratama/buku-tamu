import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isLoggedIn: false, token: null });

  const login = (token) => {
    setAuth({ isLoggedIn: true, token });
  };

  const logout = () => {
    localStorage.removeItem('token'); // Hapus token dari local storage
    setAuth({ isLoggedIn: false, token: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
