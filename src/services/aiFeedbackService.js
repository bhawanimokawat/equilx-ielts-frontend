import { request } from "./authService1";

const aiFeedbackService = {
  // Get student's Writing submission history
  getWritingSubmissions(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (filters.taskNumber) {
      params.set("taskNumber", String(filters.taskNumber));
    }

    if (filters.status) {
      params.set("status", filters.status);
    }

    return request(`/writing/submissions?${params.toString()}`);
  },

  // Get one Writing submission with its AI evaluation
  getWritingSubmission(submissionId) {
    if (!submissionId) {
      throw new Error("Submission ID is required.");
    }

    return request(
      `/writing/submissions/${encodeURIComponent(submissionId)}`
    );
  },

  // Submit Writing response for AI evaluation
  submitWriting(attemptId, taskNumber, responseText) {
    if (!attemptId) {
      throw new Error("Attempt ID is required.");
    }

    return request(
      `/writing/attempts/${encodeURIComponent(attemptId)}/submissions`,
      {
        method: "POST",
        body: JSON.stringify({
          taskNumber: Number(taskNumber),
          responseText,
        }),
      }
    );
  },

  // Create Speaking submission
  createSpeakingSubmission(attemptId, partNumber, consentStatus) {
    if (!attemptId) {
      throw new Error("Attempt ID is required.");
    }

    return request(
      `/speaking/attempts/${encodeURIComponent(attemptId)}/submissions`,
      {
        method: "POST",
        body: JSON.stringify({
          partNumber: Number(partNumber),
          consentStatus,
        }),
      }
    );
  },

  // Upload Speaking recording
  uploadSpeakingRecording(submissionId, recording, durationSeconds) {
    if (!submissionId || !recording) {
      throw new Error("Submission ID and recording are required.");
    }

    const formData = new FormData();
    formData.append("recording", recording);

    if (durationSeconds !== undefined) {
      formData.append("durationSeconds", String(durationSeconds));
    }

    return request(
      `/speaking/submissions/${encodeURIComponent(submissionId)}/recordings`,
      {
        method: "POST",
        body: formData,
      }
    );
  },

  // Complete Speaking submission and queue transcription
  completeSpeakingSubmission(submissionId) {
    if (!submissionId) {
      throw new Error("Submission ID is required.");
    }

    return request(
      `/speaking/submissions/${encodeURIComponent(submissionId)}/complete`,
      {
        method: "POST",
      }
    );
  },
};

export default aiFeedbackService;