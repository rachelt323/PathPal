import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/auth/status", {
          credentials: "include",
        });
        const data = await response.json();
        setLoggedIn(data.isLoggedIn);
        if (data.isLoggedIn) {
          setUserData(data.user);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Failed to check authentication status", error);
        setLoggedIn(false);
        setUserData(null);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
