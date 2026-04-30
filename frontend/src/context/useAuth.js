import { useContext } from "react";
import { AuthenticateContext } from "./auth-context";

export function useAuth() {
  return useContext(AuthenticateContext);
}