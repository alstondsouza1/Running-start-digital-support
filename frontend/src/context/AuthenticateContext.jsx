import { useState, useEffect, useRef, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthenticateContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const logoutTimerRef = useRef(null);

  const clearLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, []);

  const logout = useCallback(() => {
    clearLogoutTimer();
    localStorage.removeItem("token");
    setUser(null);
  }, [clearLogoutTimer]);

  const runLogoutTimer = useCallback(
    (exp) => {
      clearLogoutTimer();

      const remainingMs = exp * 1000 - Date.now();

      if (remainingMs <= 0) {
        logout();
        return;
      }

      logoutTimerRef.current = setTimeout(() => {
        logout();
      }, remainingMs);
    },
    [clearLogoutTimer, logout]
  );

  const login = useCallback(
    (newToken) => {
      localStorage.setItem("token", newToken);
      const decoded = jwtDecode(newToken);
      setUser(decoded);

      if (decoded?.exp) {
        runLogoutTimer(decoded.exp);
      }
    },
    [runLogoutTimer]
  );

  useEffect(() => {
    let nextUser = null;
    let tokenExp = null;
  
    const storedToken = localStorage.getItem("token");
  
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        const now = Date.now() / 1000;
  
        if (!decoded?.exp || decoded.exp < now) {
          localStorage.removeItem("token");
        } else {
          nextUser = decoded;
          tokenExp = decoded.exp; // store it, don’t call timer yet
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  
    queueMicrotask(() => {
      setUser(nextUser);
      setIsLoading(false);
  
      if (tokenExp) {
        runLogoutTimer(tokenExp);
      }
    });
  
    return () => {
      clearLogoutTimer();
    };
  }, [clearLogoutTimer, runLogoutTimer]);

  const value = {
    isAdmin: !!user,
    adminInfo: user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthenticateContext.Provider value={value}>
      {children}
    </AuthenticateContext.Provider>
  );
}