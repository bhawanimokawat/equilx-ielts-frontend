
import { request } from "./authService";
import { setToken } from "./authService";

const settingsService = {
  getProfile: () => request("/users/me"),

  updateProfile: (payload) =>
    request("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  getSecurity: () => request("/users/me/security"),

  changePassword: (currentPassword, newPassword) =>
    request("/auth/change-password", {
      method: "PATCH",
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    }),

  async logout() {
    const result = await request("/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
    });

    setToken(null);
    return result;
  },
};

export default settingsService;
