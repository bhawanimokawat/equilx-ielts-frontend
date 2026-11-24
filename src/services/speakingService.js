
import { request, getToken } from "./authService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const uploadRecording = async (submissionId, audioBlob, durationSeconds) => {
  const token = getToken();
  const formData = new FormData();

  const mimeType = audioBlob.type.split(";")[0].toLowerCase();

  const extensionMap = {
    "audio/webm": "webm",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/ogg": "ogg",
    "audio/aac": "aac",
    "audio/flac": "flac",
  };

  const extension = extensionMap[mimeType];

  if (!extension) {
    throw new Error("Unsupported recording format. Please record in a supported audio format.");
  }

  if (audioBlob.size > 25 * 1024 * 1024) {
    throw new Error("Recording cannot exceed 25 MB.");
  }

  formData.append(
    "recording",
    audioBlob,
    `speaking-recording.${extension}`
  );
  formData.append("durationSeconds", String(durationSeconds));

  const response = await fetch(
    `${API_BASE_URL}/speaking/submissions/${submissionId}/recordings`,
    {
      method: "POST",
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
      credentials: "include",
      body: formData,
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || data.error?.message || "Recording upload failed."
    );
    error.status = response.status;
    error.code = data.code;
    throw error;
  }

  return data;
};

const speakingService = {
  // Public published test catalogue
  getPracticeTests: () =>
    request("/practice/tests?page=1&limit=50"),

  // Published test details
  getPracticeTestDetails: (testId) =>
    request(`/practice/tests/${testId}`),

  // Actual backend route: POST /practice/tests/:testVersionId/start
  // Body must contain exactly one of moduleId or partId.
  startPracticeAttempt: (testVersionId, scope) =>
    request(`/practice/tests/${testVersionId}/start`, {
      method: "POST",
      body: JSON.stringify(scope),
    }),

  // Actual attempt questions
  getAttemptQuestions: (attemptId) =>
    request(`/attempts/${attemptId}/questions`),

  // Previously saved answers
  getAttemptAnswers: (attemptId) =>
    request(`/attempts/${attemptId}/answers`),

  // Actual answer payload: { answer: ... }
  saveAnswer: (attemptId, questionId, answer) =>
    request(`/attempts/${attemptId}/answers/${questionId}`, {
      method: "PUT",
      body: JSON.stringify({ answer }),
    }),

  // Create speaking submission. partNumber must be 1, 2 or 3.
  createSubmission: (attemptId, partNumber) =>
    request(`/speaking/attempts/${attemptId}/submissions`, {
      method: "POST",
      body: JSON.stringify({
        partNumber,
        consentStatus: "GRANTED",
      }),
    }),

  uploadRecording,

  // Backend queues transcription; it does not return a band score here.
  completeSubmission: (submissionId) =>
    request(`/speaking/submissions/${submissionId}/complete`, {
      method: "POST",
    }),

  withdrawConsent: (submissionId) =>
    request(
      `/speaking/submissions/${submissionId}/withdraw-consent`,
      { method: "POST" }
    ),

  getPracticeHistory: () =>
    request("/practice/history?page=1&limit=50"),

  getPracticeHistoryItem: (attemptId) =>
    request(`/practice/history/${attemptId}`),
};

export default speakingService;