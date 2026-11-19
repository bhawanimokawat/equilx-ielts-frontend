
import api from "../api/axiosInstance";

const unwrap = (response) => response.data;

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

    return api.get(`/practice/tests?${params.toString()}`).then(unwrap);
  },

  // Get one practice test with modules, parts and questions
  getTestDetails: (testId) => {
    if (!testId) {
      throw new Error("Test ID is required.");
    }

    return api.get(`/practice/tests/${testId}`).then(unwrap);
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

    return api
      .post(`/practice/tests/${testVersionId}/start`, selection)
      .then(unwrap);
  },

  // Get logged-in student's practice history
  getHistory: (page = 1, limit = 10) => {
    return api
      .get(`/practice/history?page=${page}&limit=${limit}`)
      .then(unwrap);
  },

  // Get one practice attempt's details
  getHistoryItem: (attemptId) => {
    if (!attemptId) {
      throw new Error("Attempt ID is required.");
    }

    return api.get(`/practice/history/${attemptId}`).then(unwrap);
  },
};

export default practiceService;
