
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1";

// Access token management
export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem("equilx_token", token);
    } else {
      localStorage.removeItem("equilx_token");
    }
  } catch (error) {
    console.error("Token storage error:", error);
  }
};

export const getToken = () => {
  try {
    return localStorage.getItem("equilx_token") || "";
  } catch {
    return "";
  }
};

// Common API request function
const request = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(
        data?.message ||
        data?.error?.message ||
        `Request failed with status ${response.status}`
      );

      error.status = response.status;
      error.code = data?.code || data?.error?.code || "REQUEST_FAILED";
      error.details =
        data?.errors || data?.error?.details || null;

      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      const connectionError = new Error(
        "Unable to connect to Equilx IELTS API. Please check your backend server."
      );

      connectionError.status = 503;
      connectionError.code = "CONNECTION_REFUSED";

      throw connectionError;
    }

    throw error;
  }
};

// Authentication APIs
const authService = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  verifyEmail: (email, otp) =>
    request("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    }),

  resendOtp: (email) =>
    request("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  verifyLoginOtp: (challengeId, otp) =>
    request("/auth/verify-login-otp", {
      method: "POST",
      body: JSON.stringify({ challengeId, otp }),
    }),

  forgotPassword: (email) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (payload) =>
    request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  changePassword: (payload) =>
    request("/auth/change-password", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  getCurrentUser: () =>
    request("/auth/me"),

  refreshToken: () =>
    request("/auth/refresh", {
      method: "POST",
    }),

  logout: async () => {
    try {
      return await request("/auth/logout", {
        method: "POST",
      });
    } finally {
      setToken(null);
    }
  },
};

export default authService;
export { request };