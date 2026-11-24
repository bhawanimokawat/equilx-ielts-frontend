import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

import authService from "../services/authService";
import {
  setAccessToken,
  setSessionExpiredHandler,
} from "../api/axiosInstance";

const AuthContext = createContext(null);

// The backend returns slightly different user shapes (login, refresh, /auth/me).
// We make them one shape and remove fields the UI never needs.
function normalizeUser(user) {
  if (!user) return null;

  const normalized = { ...user };
  delete normalized.tokenVersion;
  normalized.emailVerified = Boolean(
    user.emailVerifiedAt ?? user.emailVerified
  );

  return normalized;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // true only while we restore the session on the first page load
  const [loading, setLoading] = useState(true);

  // Restore the session from the refresh cookie when the app starts.
  useEffect(() => {
    let cancelled = false;

    // Remove the old insecure token saved by the previous version of the app.
    try {
      localStorage.removeItem("equilx_token");
    } catch {
      // storage not available, nothing to clean
    }

    authService
      .refresh()
      .then(({ data }) => {
        if (!cancelled) setUser(normalizeUser(data.user));
      })
      .catch(() => {
        // No valid cookie: the visitor is simply logged out.
        if (!cancelled) {
          setAccessToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // axiosInstance calls this when the session cannot be renewed anymore.
  useEffect(() => {
    setSessionExpiredHandler(() => {
      setUser(null);
      toast.error("Your session has expired. Please log in again.", {
        id: "session-expired", // same id: the toast never shows twice
      });
    });

    return () => setSessionExpiredHandler(null);
  }, []);

  // Shared by login, OTP login and Google login.
  const completeLogin = useCallback((body) => {
    const data = body?.data;

    // Staff accounts need a second step (OTP sent by email).
    if (data?.twoFactorRequired) {
      return {
        success: true,
        twoFactorRequired: true,
        challengeId: data.challengeId,
        expiresIn: data.expiresIn,
      };
    }

    if (!data?.accessToken || !data?.user) {
      throw new Error("Invalid response from the server. Please try again.");
    }

    setAccessToken(data.accessToken);
    const nextUser = normalizeUser(data.user);
    setUser(nextUser);

    return {
      success: true,
      user: nextUser,
      isNewUser: Boolean(data.isNewUser),
    };
  }, []);

  // Runs an auth request and always returns { success, ... } instead of throwing.
  const runAuthAction = useCallback(
    async (action) => {
      try {
        return completeLogin(await action());
      } catch (error) {
        return {
          success: false,
          error: error.message || "Unable to continue. Please try again.",
          code: error.code || null,
          status: error.status || 0,
        };
      }
    },
    [completeLogin]
  );

  const login = useCallback(
    (email, password) =>
      runAuthAction(() => authService.login(email, password)),
    [runAuthAction]
  );

  const verifyLoginOtp = useCallback(
    (challengeId, otp) =>
      runAuthAction(() => authService.verifyLoginOtp(challengeId, otp)),
    [runAuthAction]
  );

  const googleLogin = useCallback(
    (idToken) => runAuthAction(() => authService.googleLogin(idToken)),
    [runAuthAction]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Even if the server call fails, the user is logged out on this device.
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  // useMemo: the value changes only when something really changed,
  // so pages that use useAuth() do not re-render for no reason.
  const value = useMemo(
    () => ({
      user,
      role: user?.platformRole || "GUEST",
      isAuthenticated: Boolean(user),
      loading,
      login,
      verifyLoginOtp,
      googleLogin,
      logout,
    }),
    [user, loading, login, verifyLoginOtp, googleLogin, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export default AuthContext;