
import api from "../../api/axiosInstance";

const BASE_URL = "/admin/ai";

const aiAdminService = {
  // AI Models
  getModels: async () => {
    const response = await api.get(`${BASE_URL}/models`);
    return response.data;
  },

  createModel: async (data) => {
    const response = await api.post(`${BASE_URL}/models`, data);
    return response.data;
  },

  updateModel: async (modelId, data) => {
    const response = await api.patch(
      `${BASE_URL}/models/${modelId}`,
      data
    );
    return response.data;
  },

  // AI Routing
  createRoute: async (data) => {
    const response = await api.post(`${BASE_URL}/routes`, data);
    return response.data;
  },

  updateRoute: async (routeId, data) => {
    const response = await api.patch(
      `${BASE_URL}/routes/${routeId}`,
      data
    );
    return response.data;
  },

  deleteRoute: async (routeId) => {
    const response = await api.delete(
      `${BASE_URL}/routes/${routeId}`
    );
    return response.data;
  },

  // Prompt Management
  getPrompts: async () => {
    const response = await api.get(`${BASE_URL}/prompts`);
    return response.data;
  },

  getPromptHistory: async (promptKey) => {
    const response = await api.get(
      `${BASE_URL}/prompts/${encodeURIComponent(promptKey)}`
    );
    return response.data;
  },

  createPrompt: async (data) => {
    const response = await api.post(`${BASE_URL}/prompts`, data);
    return response.data;
  },

  updatePrompt: async (promptId, data) => {
    const response = await api.patch(
      `${BASE_URL}/prompts/${promptId}`,
      data
    );
    return response.data;
  },

  publishPrompt: async (promptId) => {
    const response = await api.post(
      `${BASE_URL}/prompts/${promptId}/publish`
    );
    return response.data;
  },

  rollbackPrompt: async (promptId) => {
    const response = await api.post(
      `${BASE_URL}/prompts/${promptId}/rollback`
    );
    return response.data;
  },

  // Configuration
  getConfig: async () => {
    const response = await api.get(`${BASE_URL}/config`);
    return response.data;
  },

  updateConfig: async (data) => {
    const response = await api.patch(`${BASE_URL}/config`, data);
    return response.data;
  },

  // Limits
  getLimits: async () => {
    const response = await api.get(`${BASE_URL}/limits`);
    return response.data;
  },

  updateLimits: async (data) => {
    const response = await api.patch(`${BASE_URL}/limits`, data);
    return response.data;
  },

  // Usage & Cost Analytics
  getUsageSummary: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/usage/summary`, {
      params,
    });
    return response.data;
  },

  getUsageBreakdown: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/usage/breakdown`, {
      params,
    });
    return response.data;
  },

  getUsageTrends: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/usage/trends`, {
      params,
    });
    return response.data;
  },

  exportUsage: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/usage/export`, {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  // Evaluation Quality
  getQualitySummary: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/quality/summary`, {
      params,
    });
    return response.data;
  },

  getQualityBreakdown: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/quality/breakdown`, {
      params,
    });
    return response.data;
  },

  getQualityTrends: async (params = {}) => {
    const response = await api.get(`${BASE_URL}/quality/trends`, {
      params,
    });
    return response.data;
  },
};

export default aiAdminService;
