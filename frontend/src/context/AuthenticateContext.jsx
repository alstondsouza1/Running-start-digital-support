import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthenticateContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const runLogoutTimer = (exp) => {
    const remainingMs = exp * 1000 - Date.now();
    if (remainingMs <= 0) return logout();
    setTimeout(logout, remainingMs);
  };

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    const decoded = jwtDecode(newToken);
    setUser(decoded);
    if (decoded?.exp) runLogoutTimer(decoded.exp);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(storedToken);
      const now = Date.now() / 1000;

      if (!decoded?.exp || decoded.exp < now) {
        logout();
      } else {
        setUser(decoded);
        runLogoutTimer(decoded.exp);
      }
    } catch {
      logout();
    }

    setIsLoading(false);
  }, []);

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

export function useAuth() {
  return useContext(AuthenticateContext);
}