import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile } from "../api/api";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Rehydrate auth state on app load/refresh ---
  useEffect(() => {
    const savedAccess = localStorage.getItem("access_token");
    const savedRefresh = localStorage.getItem("refresh_token");
    const savedUser = localStorage.getItem("user");

    if (savedAccess && savedUser) {
      setAccessToken(savedAccess);
      setUser(JSON.parse(savedUser));
    }

    if (savedAccess) {
      // Verify or refresh token when app loads
      getUserProfile()
        .then((res) => {
          setUser({
            ...res.data,
            role: res.data.role || "customer",
          });
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(async (err) => {
          console.warn("Profile fetch failed:", err);

          // Try refreshing access token
          if (savedRefresh) {
            try {
              const refreshRes = await axios.post("/api/token/refresh/", {
                refresh: savedRefresh,
              });
              const newAccess = refreshRes.data.access;

              localStorage.setItem("access_token", newAccess);
              setAccessToken(newAccess);

              // retry profile fetch
              const profileRes = await getUserProfile();
              setUser(profileRes.data);
              localStorage.setItem("user", JSON.stringify(profileRes.data));
            } catch (refreshErr) {
              console.error("Refresh failed:", refreshErr);
              logout();
            }
          } else {
            logout();
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, access, refresh) => {
    setUser({ ...userData, role: userData.role || "customer" });
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
        role: user?.role || null,
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
