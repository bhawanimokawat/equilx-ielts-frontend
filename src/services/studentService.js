import api from "../api/axiosInstance";

// Every function returns the backend body: { success, data, ... }
const unwrap = (response) => response.data;

const studentService = {
  // Logged-in student's profile
  getProfile: () => api.get("/users/me").then(unwrap),

  // All student attempts
  getAttempts: () => api.get("/attempts").then(unwrap),

  // Student results (paginated)
  getResults: (page = 1, limit = 5) =>
    api.get("/results", { params: { page, limit } }).then(unwrap),

  // Practice history (paginated)
  getPracticeHistory: (page = 1, limit = 5) =>
    api.get("/practice/history", { params: { page, limit } }).then(unwrap),

  // Mock test history (paginated)
  getMockHistory: (page = 1, limit = 5) =>
    api.get("/mock/history", { params: { page, limit } }).then(unwrap),
};

export default studentService;