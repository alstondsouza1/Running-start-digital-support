const rawApiBase =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? "http://localhost:5001/api" : "");

export const API_BASE = rawApiBase.replace(/\/+$/, "");
export const ADMIN_SESSION_MESSAGE_KEY = "adminSessionMessage";
export const ADMIN_SESSION_EXPIRED_EVENT = "admin-session-expired";
export const ADMIN_SESSION_EXPIRED_MESSAGE =
  "Your admin session expired. Please log in again.";

export function apiUrl(path) {
  if (!API_BASE) {
    throw new Error(
      "Missing VITE_API_BASE. Set it to the backend API URL, for example https://your-backend-url/api."
    );
  }

  const normalizedPath = String(path || "").replace(/^\/+/, "");
  return `${API_BASE}/${normalizedPath}`;
}

export function isAuthExpiredResponse(response) {
  return response?.status === 401 || response?.status === 403;
}

export function notifyAdminSessionExpired() {
  localStorage.setItem(ADMIN_SESSION_MESSAGE_KEY, ADMIN_SESSION_EXPIRED_MESSAGE);
  window.dispatchEvent(new Event(ADMIN_SESSION_EXPIRED_EVENT));
}

export function handleAuthErrorResponse(response) {
  if (isAuthExpiredResponse(response)) {
    notifyAdminSessionExpired();
  }
}
