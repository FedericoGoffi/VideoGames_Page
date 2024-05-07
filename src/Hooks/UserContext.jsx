import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);

  const logout = () => {
    setUsername(null);
    setAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ username, setUsername, isAuthenticated, setAuthenticated, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);