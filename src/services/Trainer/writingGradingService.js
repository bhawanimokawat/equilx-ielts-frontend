
const empty = () => [];

export const writingGradingAdapters = {
  listSubmissions: null,
  getSubmission: null,
  saveGrade: null,
  saveComment: null,
};

function assertAdapter(name) {
  const adapter = writingGradingAdapters[name];
  if (typeof adapter !== "function") {
    throw new Error(
      `${name} API is not connected yet. A trainer-authorized backend endpoint is required.`
    );
  }
  return adapter;
}

function normalizeSubmission(item) {
  const student = item.student || item.user || {};
  const profile = student.profile || {};
  const evaluation = item.evaluation || {};

  return {
    id: String(item.id),
    student:
      item.studentName ||
      profile.fullName ||
      profile.name ||
      student.name ||
      student.email ||
      "Unnamed Student",
    email: item.email || student.email || "",
    batch:
      item.batchName ||
      item.batch?.name ||
      "—",
    title:
      item.title ||
      item.taskTitle ||
      `Writing Task ${item.taskNumber || ""}`.trim(),
    type:
      item.type ||
      (Number(item.taskNumber) === 1
        ? "Writing Task 1"
        : Number(item.taskNumber) === 2
          ? "Writing Task 2"
          : "Writing Task"),
    submitted: item.submittedAt || item.createdAt || null,
    due: item.dueAt || null,
    status: item.status || "Pending Review",
    wordCount: item.wordCount ?? null,
    estimatedBand:
      item.estimatedBand ??
      evaluation.overallBand ??
      null,
    finalBand: item.finalBand ?? null,
    essay: item.essay ?? item.responseText ?? "",
    aiFeedback:
      item.aiFeedback ??
      evaluation.feedback ??
      "",
    descriptors: {
      task: item.descriptors?.task ?? null,
      coherence: item.descriptors?.coherence ?? null,
      vocabulary: item.descriptors?.vocabulary ?? null,
      grammar: item.descriptors?.grammar ?? null,
    },
    comments: Array.isArray(item.comments) ? item.comments : [],
  };
}

const writingGradingService = {
  connected: {
    listSubmissions: () =>
      typeof writingGradingAdapters.listSubmissions === "function",
    getSubmission: () =>
      typeof writingGradingAdapters.getSubmission === "function",
    saveGrade: () =>
      typeof writingGradingAdapters.saveGrade === "function",
    saveComment: () =>
      typeof writingGradingAdapters.saveComment === "function",
  },

  async listSubmissions() {
    if (!this.connected.listSubmissions()) {
      return { submissions: [], connected: false };
    }

    const result = await assertAdapter("listSubmissions")();

    const records = Array.isArray(result)
      ? result
      : result?.submissions;

    if (!Array.isArray(records)) {
      throw new Error("Invalid writing queue API response.");
    }

    return {
      submissions: records.map(normalizeSubmission),
      connected: true,
    };
  },

  async getSubmission(id) {
    if (!this.connected.getSubmission()) {
      return null;
    }

    const result = await assertAdapter("getSubmission")(id);
    return normalizeSubmission(result?.submission || result);
  },

  async saveGrade(id, payload) {
    return assertAdapter("saveGrade")(id, payload);
  },

  async saveComment(id, text) {
    return assertAdapter("saveComment")(id, { text });
  },
};

export default writingGradingService;
