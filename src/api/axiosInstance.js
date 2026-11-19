import axios from "axios";
import { getErrorMessage, getErrorCode } from "../utils/getErrorMessage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const REQUEST_TIMEOUT_MS = 15000;

// Auth routes must NOT trigger an automatic refresh (a wrong password also
// returns 401). These two are the exceptions: they need a valid access token.
const REFRESHABLE_AUTH_PATHS = ["/auth/me", "/auth/change-password"];

// Every failed request reaches the app as an ApiError, so callers can use:
// error.message (friendly text), error.status, error.code, error.details
export class ApiError extends Error {
  constructor(message, { status = 0, code = null, details = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// The access token lives only in memory. It disappears on page reload,
// and the refresh cookie brings it back.
let accessToken = null;
let refreshPromise = null;
let sessionExpiredHandler = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token) => {
  accessToken = token || null;
};

// AuthContext registers a function here, so it can log the user out
// when the session cannot be restored.
export const setSessionExpiredHandler = (handler) => {
  sessionExpiredHandler = handler;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // sends the HTTP-only refresh cookie
  timeout: REQUEST_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

// A plain client without interceptors, used only for refresh.
// This prevents an endless refresh loop.
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: REQUEST_TIMEOUT_MS,
});

function canRefresh(url = "") {
  if (!url.startsWith("/auth/")) return true;
  return REFRESHABLE_AUTH_PATHS.some((path) => url.startsWith(path));
}

/**
 * Gets a new access token using the refresh cookie.
 * Only one refresh runs at a time. The backend cancels the old refresh
 * token on every use, so two refreshes at once would log the user out.
 * Everyone who asks while one is running gets the same result.
 */
export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh")
      .then((response) => {
        const data = response.data?.data;

        if (!data?.accessToken) {
          throw new Error("Invalid refresh response.");
        }

        setAccessToken(data.accessToken);
        return data; // { accessToken, user, ... }
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

// Add the access token to every request.
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// If the access token expired (401), refresh once and retry the request.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (
      status !== 401 ||
      !original ||
      original._retry ||
      !canRefresh(original.url)
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const { accessToken: newToken } = await refreshSession();
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshError) {
      // Log out only when the server really rejected the refresh.
      // A network problem must not log the user out.
      if (refreshError.response) {
        setAccessToken(null);
        sessionExpiredHandler?.();
      }
      return Promise.reject(error);
    }
  }
);


// Runs after the refresh logic above: converts any failure to an ApiError.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof ApiError) return Promise.reject(error);

    return Promise.reject(
      new ApiError(getErrorMessage(error), {
        status: error.response?.status ?? 0,
        code: getErrorCode(error),
        details: error.response?.data?.errors ?? null,
      })
    );
  }
);

export default api;