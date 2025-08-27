import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate auth state on app load/refresh
  useEffect(() => {
    const savedAccess = localStorage.getItem("access_token");
    const savedRefresh = localStorage.getItem("refresh_token");

    if (savedAccess) {
      setAccessToken(savedAccess);

      // Fetch user profile from backend
      getUserProfile()
        .then((res) => {
          // Ensure role exists in user object
          setUser({
            ...res.data,
            role: res.data.role || "customer", // default to customer if role missing
          });
        })
        .catch(() => {
          // If token invalid, clear all
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          setUser(null);
          setAccessToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, access, refresh) => {
    setUser({
      ...userData,
      role: userData.role || "customer",
    });
    setAccessToken(access);

    localStorage.setItem("access_token", access);
    if (refresh) localStorage.setItem("refresh_token", refresh);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null, // expose role directly for Navbar
        accessToken,
        login,
        logout,
        isAuthenticated: !!accessToken,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
