import { createContext, useState, useEffect } from "react";
import { api, setToken } from "../components/services/api.js";

const AuthContext = createContext(null);

function readStoredSession() {
  try {
    const stored = JSON.parse(localStorage.getItem("equilx_user") || "null");
    const token = stored?.token || localStorage.getItem("equilx_token") || "";
    return token ? { stored, token } : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [initialSession] = useState(readStoredSession);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(initialSession));
  const [authError, setAuthError] = useState(null);

  // A cached browser profile is only a hint. Revalidate every stored session
  // against the backend before rendering any protected route.
  useEffect(() => {
    let cancelled = false;
    if (!initialSession) {
      setToken("");
      return () => { cancelled = true; };
    }

    setToken(initialSession.token);
    api.getCurrentUser()
      .then((response) => {
        if (!cancelled) setUser({ ...response.data.user, token: initialSession.token });
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setToken("");
          try { localStorage.removeItem("equilx_user"); } catch { /* storage may be unavailable */ }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [initialSession]);

  useEffect(() => {
    if (user?.token) {
      setToken(user.token);
      try {
        localStorage.setItem("equilx_user", JSON.stringify(user));
      } catch {
        // Keep the in-memory session usable if browser storage is unavailable.
      }
    } else {
      setToken("");
      try { localStorage.removeItem("equilx_user"); } catch { /* storage may be unavailable */ }
    }
  }, [user]);

  const loginWithCredentials = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await api.login(email, password);
      const userData = { ...response.data.user, token: response.data.tokens.accessToken };
      setUser(userData);
      return { success: true };
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "GUEST",
        isAuthenticated: Boolean(user?.token),
        loading,
        authError,
        login: loginWithCredentials,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
