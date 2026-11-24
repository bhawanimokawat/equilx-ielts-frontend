import api, { refreshSession, setAccessToken } from "../api/axiosInstance";

// Every service function returns the backend body: { success, message, data }
const unwrap = (response) => response.data;

const cleanEmail = (email) => String(email || "").trim();

const authService = {
  // The backend rejects any extra field (strict validation),
  // so we send only the fields it accepts.
  register: ({ name, email, password }) =>
    api
      .post("/auth/register", { name: String(name || "").trim(), email: cleanEmail(email), password })
      .then(unwrap),

  verifyEmail: (email, otp) =>
    api.post("/auth/verify-email", { email: cleanEmail(email), otp }).then(unwrap),

  resendOtp: (email) =>
    api.post("/auth/resend-otp", { email: cleanEmail(email) }).then(unwrap),

  // May return { data: { twoFactorRequired: true, challengeId } } for staff accounts
  login: (email, password) =>
    api.post("/auth/login", { email: cleanEmail(email), password }).then(unwrap),

  verifyLoginOtp: (challengeId, otp) =>
    api.post("/auth/verify-login-otp", { challengeId, otp }).then(unwrap),

  googleLogin: (idToken) =>
    api.post("/auth/google", { idToken }).then(unwrap),

  forgotPassword: (email) =>
    api.post("/auth/forgot-password", { email: cleanEmail(email) }).then(unwrap),

  resetPassword: ({ token, newPassword }) =>
    api.post("/auth/reset-password", { token, newPassword }).then(unwrap),

  changePassword: ({ currentPassword, newPassword }) =>
    api.patch("/auth/change-password", { currentPassword, newPassword }).then(unwrap),

  getCurrentUser: () => api.get("/auth/me").then(unwrap),

  // Restores the session from the refresh cookie (used when the page loads)
  refresh: async () => {
    const data = await refreshSession();
    return { success: true, data };
  },

  // The access token is always cleared, even if the server call fails
  logout: async () => {
    try {
      return await api.post("/auth/logout").then(unwrap);
    } finally {
      setAccessToken(null);
    }
  },
};

export default authService;

