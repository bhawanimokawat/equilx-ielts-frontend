import api, { refreshSession, setAccessToken } from "../api/axiosInstance";

// Every service function returns the backend body: { success, message, data }
const unwrap = (response) => response.data;

// Accepts a promise: request(api.get("/x"))
// or a function:     request(() => api.get("/x"))
// and returns the backend body.
const request = async (call) => {
  const response = typeof call === "function" ? await call() : await call;
  return unwrap(response);
};

const cleanEmail = (email) => String(email || "").trim();

const authService = {
  // The backend rejects any extra field (strict validation),
  // so we send only the fields it accepts.
  register: ({ name, email, password }) =>
    request(
      api.post("/auth/register", {
        name: String(name || "").trim(),
        email: cleanEmail(email),
        password,
      })
    ),

  verifyEmail: (email, otp) =>
    request(api.post("/auth/verify-email", { email: cleanEmail(email), otp })),

  resendOtp: (email) =>
    request(api.post("/auth/resend-otp", { email: cleanEmail(email) })),

  // May return { data: { twoFactorRequired: true, challengeId } } for staff accounts
  login: (email, password) =>
    request(api.post("/auth/login", { email: cleanEmail(email), password })),

  verifyLoginOtp: (challengeId, otp) =>
    request(api.post("/auth/verify-login-otp", { challengeId, otp })),

  googleLogin: (idToken) =>
    request(api.post("/auth/google", { idToken })),

  forgotPassword: (email) =>
    request(api.post("/auth/forgot-password", { email: cleanEmail(email) })),

  resetPassword: ({ token, newPassword }) =>
    request(api.post("/auth/reset-password", { token, newPassword })),

  changePassword: ({ currentPassword, newPassword }) =>
    request(api.patch("/auth/change-password", { currentPassword, newPassword })),

  getCurrentUser: () => request(api.get("/auth/me")),

  // Restores the session from the refresh cookie (used when the page loads)
  refresh: async () => {
    const data = await refreshSession();
    return { success: true, data };
  },

  // The access token is always cleared, even if the server call fails
  logout: async () => {
    try {
      return await request(api.post("/auth/logout"));
    } finally {
      setAccessToken(null);
    }
  },
};

export default authService;
export { request };