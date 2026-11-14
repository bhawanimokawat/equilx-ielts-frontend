const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

function getToken() {
  try {
    return localStorage.getItem("equilx_token") || "";
  } catch {
    return "";
  }
}

export function setToken(token) {
  try {
    if (token) {
      localStorage.setItem("equilx_token", token);
    } else {
      localStorage.removeItem("equilx_token");
    }
  } catch {
    // Ignore storage issues
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message =
        data?.error?.message ||
        `Request failed with status ${res.status}`;
      const error = new Error(message);
      error.status = res.status;
      error.details = data?.error?.details || null;
      error.code = data?.error?.code || "REQUEST_FAILED";
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      const offlineError = new Error(
        "Could not connect to Equilx IELTS API. Ensure backend server is running on http://localhost:5000."
      );
      offlineError.status = 503;
      offlineError.code = "CONNECTION_REFUSED";
      throw offlineError;
    }
    throw error;
  }
}

export const api = {
  // Auth
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getCurrentUser: () => request("/auth/me"),

  // Public Test Catalog
  getTests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/tests${query ? `?${query}` : ""}`);
  },
  getTestById: (id) => request(`/tests/${id}`),

  // Admin CMS
  getCmsTests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/cms/tests${query ? `?${query}` : ""}`);
  },
  getCmsTestById: (id) => request(`/admin/cms/tests/${id}`),
  createCmsTest: (payload) =>
    request("/admin/cms/tests", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateCmsTest: (id, payload) =>
    request(`/admin/cms/tests/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteCmsTest: (id) =>
    request(`/admin/cms/tests/${id}`, {
      method: "DELETE",
    }),
  togglePublishTest: (id) =>
    request(`/admin/cms/tests/${id}/publish`, {
      method: "PATCH",
    }),
  updateQuestion: (id, payload) =>
    request(`/admin/cms/questions/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  // Exam Attempts & Runner
  startAttempt: (testId) =>
    request("/attempts/start", {
      method: "POST",
      body: JSON.stringify({ testId }),
    }),
  getAttempt: (id) => request(`/attempts/${id}`),
  saveAnswers: (attemptId, answers) =>
    request(`/attempts/${attemptId}/save-answers`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),
  submitAttempt: (attemptId) =>
    request(`/attempts/${attemptId}/submit`, {
      method: "POST",
    }),
  getAttemptResult: (attemptId) => request(`/attempts/${attemptId}/result`),
  getMyAttempts: () => request("/attempts/my-attempts"),
  // Bulk Import
  getImportTemplateUrl: (format = "csv") =>
    `${API_BASE}/admin/cms/import/template?format=${format}`,
  previewImport: (payload) =>
    request("/admin/cms/import/preview", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  executeImport: (payload) =>
    request("/admin/cms/import/execute", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Payments & Subscriptions (activation is confirmed only by a signed server webhook)
  getPaymentConfig: () => request("/payments/config"),
  getSubscriptionPlans: () => request("/payments/plans"),
  getInstitutePlans: () => request("/payments/institute-plans"),
  getMySubscription: () => request("/payments/my-subscription"),
  createPaymentOrder: (payload) =>
    request("/payments/create-order", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  createInstitutePaymentOrder: (payload) =>
    request("/payments/institute/create-order", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Evaluations & Scoring
  getEvaluationQueue: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/evaluations/queue${q ? `?${q}` : ""}`);
  },
  getEvaluationByAttempt: (attemptId) => request(`/evaluations/${attemptId}`),
  submitTrainerReview: (attemptId, payload) =>
    request(`/evaluations/${attemptId}/trainer-review`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getAiEstimate: (payload) =>
    request("/evaluations/ai-estimate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Institute & Batch Management
  getInstituteProfile: () => request("/institutes/me"),
  getBatches: () => request("/institutes/batches"),
  getInstituteStudents: () => request("/institutes/students"),
  provisionInstituteUser: (payload) =>
    request("/institutes/users", { method: "POST", body: JSON.stringify(payload) }),
  createBatch: (payload) =>
    request("/institutes/batches", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  assignTest: (payload) =>
    request("/institutes/assignments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getMyAssignments: () => request("/institutes/assignments/me"),
  getMyLinkedTrainers: () => request("/institutes/trainers/me"),
  addStudentToBatch: (batchId, studentId) =>
    request(`/institutes/batches/${encodeURIComponent(batchId)}/students/${encodeURIComponent(studentId)}`, {
      method: "POST",
    }),

  // Linked Trainer Speaking session scheduling and workflow
  getSpeakingSessions: () => request("/speaking-sessions"),
  requestSpeakingSession: (payload) => request("/speaking-sessions", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  updateSpeakingSession: (sessionId, payload) => request(`/speaking-sessions/${encodeURIComponent(sessionId)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }),
};

export default api;
