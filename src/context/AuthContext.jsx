
import { createContext, useState, useEffect } from "react";
import authService, { setToken } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async () => {
      const token = localStorage.getItem("equilx_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setToken(token);
        const response = await authService.getCurrentUser();

        if (!cancelled) {
          setUser({
            ...response.data.user,
            token,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setUser(null);
          setToken("");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);

    try {
      const response = await authService.login(email, password);

      if (response.data?.twoFactorRequired) {
        return {
          success: true,
          twoFactorRequired: true,
          challengeId: response.data.challengeId,
        };
      }

      const token = response.data?.accessToken;
      const userData = response.data?.user;
      


      if (!token || !userData) {
        throw new Error("Invalid login response from server.");
      }

      setToken(token);
      setUser({ ...userData, token });

      return { success: true, user: userData };
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      setToken("");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.platformRole || "GUEST",
        isAuthenticated: Boolean(user?.token),
        loading,
        authError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
