
import { request } from "./authService";

const practiceService = {
  // Get published practice tests
  getTests: (page = 1, limit = 10, category = "") => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (category) {
      params.set("category", category);
    }

    return request(`/practice/tests?${params.toString()}`);
  },

  // Get one practice test with modules, parts and questions
  getTestDetails: (testId) => {
    if (!testId) {
      throw new Error("Test ID is required.");
    }

    return request(`/practice/tests/${testId}`);
  },

  // Start practice with exactly one moduleId or partId
  startAttempt: (testVersionId, selection) => {
    if (!testVersionId) {
      throw new Error("Test version ID is required.");
    }

    const hasModule = Boolean(selection?.moduleId);
    const hasPart = Boolean(selection?.partId);

    if (hasModule === hasPart) {
      throw new Error("Select exactly one module or part.");
    }

    return request(`/practice/tests/${testVersionId}/start`, {
      method: "POST",
      body: JSON.stringify(selection),
    });
  },

  // Get logged-in student's practice history
  getHistory: (page = 1, limit = 10) => {
    return request(`/practice/history?page=${page}&limit=${limit}`);
  },

  // Get one practice attempt's details
  getHistoryItem: (attemptId) => {
    if (!attemptId) {
      throw new Error("Attempt ID is required.");
    }

    return request(`/practice/history/${attemptId}`);
  },
};

export default practiceService;