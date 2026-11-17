
import { request } from "./authService";

const studentService = {
  // Get logged-in student's profile
  getProfile: () => request("/users/me"),

  // Get all student attempts
  getAttempts: () => request("/attempts"),

  // Get student results
  getResults: (page = 1, limit = 5) =>
    request(`/results?page=${page}&limit=${limit}`),

  // Get practice history
  getPracticeHistory: (page = 1, limit = 5) =>
    request(`/practice/history?page=${page}&limit=${limit}`),

  // Get mock test history
  getMockHistory: (page = 1, limit = 5) =>
    request(`/mock/history?page=${page}&limit=${limit}`),
};

export default studentService;
