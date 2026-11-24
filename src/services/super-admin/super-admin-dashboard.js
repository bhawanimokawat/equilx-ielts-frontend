
import api from "../../api/axiosInstance";

const AI_BASE_URL = "/admin/ai";
const USERS_BASE_URL = "/users";

const dashboardService = {
  // ==========================================
  // USERS
  // ==========================================

  getUsers: async (params = {}) => {
    const response = await api.get(USERS_BASE_URL, { params });
    return response.data;
  },

  // ==========================================
  // AI USAGE ANALYTICS
  // ==========================================

  getAIUsageSummary: async (params = {}) => {
    const response = await api.get(
      `${AI_BASE_URL}/usage/summary`,
      { params }
    );

    return response.data;
  },

  getAIUsageBreakdown: async (params = {}) => {
    const response = await api.get(
      `${AI_BASE_URL}/usage/breakdown`,
      { params }
    );

    return response.data;
  },

  getAIUsageTrends: async (params = {}) => {
    const response = await api.get(
      `${AI_BASE_URL}/usage/trends`,
      { params }
    );

    return response.data;
  },

  // ==========================================
  // AI USAGE CSV EXPORT
  // ==========================================

  exportAIUsage: async (params = {}) => {
    const response = await api.get(
      `${AI_BASE_URL}/usage/export`,
      {
        params,
        responseType: "blob",
      }
    );

    return response.data;
  },
};

export default dashboardService;
