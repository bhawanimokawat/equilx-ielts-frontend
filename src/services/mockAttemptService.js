
import { request } from "./authService";

const encodeId = (value) => {
  if (value === undefined || value === null || value === "") {
    throw new Error("A valid ID is required.");
  }

  return encodeURIComponent(String(value));
};

const attemptPath = (attemptId) =>
  `/attempts/${encodeId(attemptId)}`;

const mockAttemptService = {
  // Fetch existing attempt details
  getAttempt: (attemptId) =>
    request(attemptPath(attemptId)),

  // Fetch real questions from backend
  getQuestions: (attemptId) =>
    request(`${attemptPath(attemptId)}/questions`),

  // Fetch previously saved answers
  getAnswers: (attemptId) =>
    request(`${attemptPath(attemptId)}/answers`),

  // Save or update an answer
  saveAnswer: (attemptId, questionId, answer) =>
    request(
      `${attemptPath(attemptId)}/answers/${encodeId(questionId)}`,
      {
        method: "PUT",
        body: JSON.stringify({ answer }),
      }
    ),

  // Submit completed attempt
  submitAttempt: (attemptId) =>
    request(`${attemptPath(attemptId)}/submit`, {
      method: "POST",
    }),

  // Fetch actual evaluation result
  getResult: (attemptId) =>
    request(`${attemptPath(attemptId)}/result`),
};

export default mockAttemptService;
