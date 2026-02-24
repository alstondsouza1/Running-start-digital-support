import { createContext, useState, useContext, useEffect } from "react";
import * as jwtDecodePkg from "jwt-decode"; // <-- fix for Vite
const jwtDecode = (token) => jwtDecodePkg(token); // <-- wrapper

const AuthenticateContext = createContext(null);

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [isLoading, setIsLoading] = useState(true);

   const logout = () => {
      localStorage.removeItem("token");
      setUser(null);
   };

   const runLogoutTimer = (expirationTime) => {
      const remainingTime = (expirationTime * 1000) - Date.now();
      if (remainingTime > 0) {
         setTimeout(() => {
            logout();
         }, remainingTime);
      } else {
         logout();
      }
   };

   const login = (newToken) => {
      localStorage.setItem("token", newToken);
      const decoded = jwtDecode(newToken);
      setUser(decoded);
      runLogoutTimer(decoded.exp);
   };

   useEffect(() => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
         try {
            const decoded = jwtDecode(storedToken);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
               logout();
            } else {
               setUser(decoded);
               runLogoutTimer(decoded.exp);
            }
         } catch (error) {
            logout();
         }
      }
      setIsLoading(false);
   }, []);

   const value = {
      isAdmin: !!user,
      adminInfo: user,
      login,
      logout,
      isLoading
   };

   return (
      <AuthenticateContext.Provider value={value}>
         {!isLoading && children}
      </AuthenticateContext.Provider>
   );
}

export function useAuth() {
   return useContext(AuthenticateContext);
}