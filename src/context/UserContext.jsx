import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const handleLoginSuccess = (data) => {
    const { password, ...userData } = data.user; // Destructure and remove password
    setUserData(userData);
  };

  // ... other context functions and state management logic

  return (
    <UserContext.Provider value={{ userData, handleLoginSuccess }}>
      {children}
    </UserContext.Provider>
  );
};