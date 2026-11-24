
import { request } from "./authService1";

const mockService = {
  // Get published mock tests
  getTests(page = 1, limit = 10, category = "") {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (category) {
      params.set("category", category);
    }

    return request(`/mock/tests?${params.toString()}`);
  },

  // Get complete test details
  getTestDetails(testId) {
    if (!testId) {
      throw new Error("Test ID is required.");
    }

    return request(`/mock/tests/${testId}`);
  },

  // Start a FULL_MOCK attempt
  startTest(testVersionId) {
    if (!testVersionId) {
      throw new Error("Published test version ID is required.");
    }

    return request(`/mock/tests/${testVersionId}/start`, {
      method: "POST",
    });
  },

  // Get logged-in student's mock history
  getHistory(page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    return request(`/mock/history?${params.toString()}`);
  },

  // Get one mock attempt's details
  getHistoryItem(attemptId) {
    if (!attemptId) {
      throw new Error("Attempt ID is required.");
    }

    return request(`/mock/history/${attemptId}`);
  },
};

export default mockService;