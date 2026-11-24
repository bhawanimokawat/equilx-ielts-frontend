
import { createContext, useState, useEffect } from "react";
import authService, { setToken } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Restore login session on page refresh
  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async () => {
      const token = localStorage.getItem("equilx_token");

      if (!token) {
        if (!cancelled) setLoading(false);
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

  // Login with email and password
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);

    try {
      const response = await authService.login(email, password);

      // OTP verification required
      if (response.data?.twoFactorRequired) {
        return {
          success: true,
          twoFactorRequired: true,
          challengeId: response.data.challengeId,
          expiresIn: response.data.expiresIn ?? 300,
        };
      }

      const token = response.data?.accessToken;
      const userData = response.data?.user;

      if (!token || !userData) {
        throw new Error("Invalid login response from server.");
      }

      setToken(token);
      setUser({
        ...userData,
        token,
      });

      return {
        success: true,
        user: userData,
      };
    } catch (error) {
      setAuthError(error.message);

      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    } finally {
      setLoading(false);
    }
  };

  // Verify login OTP and complete authentication
  const verifyLoginOtp = async (challengeId, otp) => {
    setLoading(true);
    setAuthError(null);

    try {
      const response = await authService.verifyLoginOtp(
        challengeId,
        otp
      );

      const token = response.data?.accessToken;
      const userData = response.data?.user;

      if (!token || !userData) {
        throw new Error("Invalid OTP verification response.");
      }

      // Save JWT token
      setToken(token);

      // Update authenticated user
      setUser({
        ...userData,
        token,
      });

      return {
        success: true,
        user: userData,
      };
    } catch (error) {
      setAuthError(error.message);

      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      setToken("");
      setUser(null);
      setAuthError(null);
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
        verifyLoginOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
