
import { request } from "./authService1";

const progressService = {
  getResults(page = 1, limit = 50, usageType) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (usageType) params.set("usageType", usageType);

    return request(`/results?${params.toString()}`);
  },

  getResultByAttemptId(attemptId) {
    if (!attemptId) throw new Error("Attempt ID is required.");

    return request(`/results/${encodeURIComponent(attemptId)}`);
  },

  getMockHistory(page = 1, limit = 50) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    return request(`/mock/history?${params.toString()}`);
  },

  getMockHistoryItem(attemptId) {
    if (!attemptId) throw new Error("Attempt ID is required.");

    return request(`/mock/history/${encodeURIComponent(attemptId)}`);
  },

  getPracticeHistory(page = 1, limit = 50) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    return request(`/practice/history?${params.toString()}`);
  },

  getPracticeHistoryItem(attemptId) {
    if (!attemptId) throw new Error("Attempt ID is required.");

    return request(`/practice/history/${encodeURIComponent(attemptId)}`);
  },
};

export default progressService;