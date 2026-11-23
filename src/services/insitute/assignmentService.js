
import api from "../../api/axiosInstance";

const unwrap = (response) => response.data;

function requireId(value, name) {
  if (!value) {
    throw new Error(`${name} is required.`);
  }
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  return query.toString();
}

const assignmentService = {
  // List institute assignments with pagination and filters.
  getAssignments: (instituteId, params = {}) => {
    requireId(instituteId, "Institute ID");

    const query = buildQuery({
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      status: params.status,
      search: params.search,
    });

    return api
      .get(`/${instituteId}/assignments?${query}`)
      .then(unwrap);
  },

  // Get one assignment with its contents and recipients.
  getAssignmentDetails: (instituteId, assignmentId) => {
    requireId(instituteId, "Institute ID");
    requireId(assignmentId, "Assignment ID");

    return api
      .get(`/${instituteId}/assignments/${assignmentId}`)
      .then(unwrap);
  },

  // Create a draft assignment.
  createAssignment: (instituteId, payload) => {
    requireId(instituteId, "Institute ID");

    return api
      .post(`/${instituteId}/assignments`, payload)
      .then(unwrap);
  },

  // Update a draft assignment.
  updateAssignment: (instituteId, assignmentId, payload) => {
    requireId(instituteId, "Institute ID");
    requireId(assignmentId, "Assignment ID");

    return api
      .patch(`/${instituteId}/assignments/${assignmentId}`, payload)
      .then(unwrap);
  },

  // Publish a draft assignment.
  publishAssignment: (instituteId, assignmentId) => {
    requireId(instituteId, "Institute ID");
    requireId(assignmentId, "Assignment ID");

    return api
      .post(`/${instituteId}/assignments/${assignmentId}/publish`)
      .then(unwrap);
  },

  // Close a published assignment.
  closeAssignment: (instituteId, assignmentId) => {
    requireId(instituteId, "Institute ID");
    requireId(assignmentId, "Assignment ID");

    return api
      .post(`/${instituteId}/assignments/${assignmentId}/close`)
      .then(unwrap);
  },

  // Cancel an assignment.
  cancelAssignment: (instituteId, assignmentId) => {
    requireId(instituteId, "Institute ID");
    requireId(assignmentId, "Assignment ID");

    return api
      .post(`/${instituteId}/assignments/${assignmentId}/cancel`)
      .then(unwrap);
  },

  // Delete a draft assignment.
  deleteAssignment: (instituteId, assignmentId) => {
    requireId(instituteId, "Institute ID");
    requireId(assignmentId, "Assignment ID");

    return api
      .delete(`/${instituteId}/assignments/${assignmentId}`)
      .then(unwrap);
  },

  // Get assignment recipients and their statuses.
  getAssignmentTargets: (instituteId, assignmentId, params = {}) => {
    requireId(instituteId, "Institute ID");
    requireId(assignmentId, "Assignment ID");

    const query = buildQuery({
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      status: params.status,
    });

    return api
      .get(`/${instituteId}/assignments/${assignmentId}/targets?${query}`)
      .then(unwrap);
  },

  // Get assignment progress statistics.
  getAssignmentProgress: (instituteId, assignmentId) => {
    requireId(instituteId, "Institute ID");
    requireId(assignmentId, "Assignment ID");

    return api
      .get(`/${instituteId}/assignments/${assignmentId}/progress`)
      .then(unwrap);
  },

  // Get assignment submissions.
  getAssignmentSubmissions: (instituteId, assignmentId, params = {}) => {
    requireId(instituteId, "Institute ID");
    requireId(assignmentId, "Assignment ID");

    const query = buildQuery({
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    });

    return api
      .get(`/${instituteId}/assignments/${assignmentId}/submissions?${query}`)
      .then(unwrap);
  },

  // Student: list my institute assignments.
  getMyAssignments: (instituteId, params = {}) => {
    requireId(instituteId, "Institute ID");

    const query = buildQuery({
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      status: params.status,
    });

    return api
      .get(`/${instituteId}/my-assignments?${query}`)
      .then(unwrap);
  },

  // Student: get one assigned assignment.
  getMyAssignmentDetails: (instituteId, assignmentId) => {
    requireId(instituteId, "Institute ID");
    requireId(assignmentId, "Assignment ID");

    return api
      .get(`/${instituteId}/my-assignments/${assignmentId}`)
      .then(unwrap);
  },

  // Student: start an assignment test.
  startAssignmentAttempt: (instituteId, assignmentId, contentId) => {
    requireId(instituteId, "Institute ID");
    requireId(assignmentId, "Assignment ID");
    requireId(contentId, "Content ID");

    return api
      .post(
        `/${instituteId}/my-assignments/${assignmentId}/contents/${contentId}/start`
      )
      .then(unwrap);
  },

  // Student: submit an assignment completion.
  submitAssignmentAttempt: (instituteId, assignmentId, completionId) => {
    requireId(instituteId, "Institute ID");
    requireId(assignmentId, "Assignment ID");
    requireId(completionId, "Completion ID");

    return api
      .post(
        `/${instituteId}/my-assignments/${assignmentId}/completions/${completionId}/submit`
      )
      .then(unwrap);
  },
};

export default assignmentService;
