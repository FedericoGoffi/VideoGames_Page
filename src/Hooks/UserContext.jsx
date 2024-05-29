import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    if (token && tokenExpiration) {
      const expirationDate = new Date(tokenExpiration);

      if (expirationDate > new Date()) {
        setAuthenticated(true);
        setUsername(localStorage.getItem('username'));
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('username');
      }
    }
  }, []);

  const logout = () => {
    setUsername(null);
    setAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('username');
  };

  return (
    <UserContext.Provider value={{ username, setUsername, isAuthenticated, setAuthenticated, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);