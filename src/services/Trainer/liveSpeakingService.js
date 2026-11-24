
const BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

const instituteId = () =>
  localStorage.getItem("equilx_institute_id") ||
  import.meta.env.VITE_INSTITUTE_ID ||
  "";

const token = () => localStorage.getItem("equilx_token") || "";

const enc = (value) => encodeURIComponent(String(value));

function path(url) {
  const id = instituteId();
  if (!id) throw new Error("Institute ID is missing.");
  return `/${enc(id)}${url}`;
}

async function get(url) {
  const authToken = token();
  if (!authToken) throw new Error("Login session is missing.");

  let response;
  try {
    response = await fetch(`${BASE}${url}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch {
    throw new Error("Unable to connect to the backend.");
  }

  const json = await response.json().catch(() => ({}));

  if (!response.ok || json.success === false) {
    throw new Error(
      json.message ||
      json.error?.message ||
      `Request failed (${response.status})`
    );
  }

  return json.data ?? json;
}

function rowsOf(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  return [];
}

async function getAll(fetchPage, key) {
  const records = [];
  let complete = false;

  for (let page = 1; page <= 100; page++) {
    const data = await fetchPage(page);
    const rows = rowsOf(data, key);
    records.push(...rows);

    const pagination = data?.pagination || data?.meta || {};
    const totalPages = Number(pagination.totalPages);
    const total = Number(pagination.total);

    if (
      rows.length === 0 ||
      (Number.isFinite(totalPages) &&
        totalPages > 0 &&
        page >= totalPages) ||
      (Number.isFinite(total) &&
        total >= 0 &&
        records.length >= total) ||
      pagination.hasNextPage === false ||
      (
        !Number.isFinite(totalPages) &&
        !Number.isFinite(total) &&
        pagination.hasNextPage === undefined &&
        rows.length < 100
      )
    ) {
      complete = true;
      break;
    }
  }

  return { records, complete };
}

export const liveSpeakingAdapters = {
  listSessions: null,
  getSession: null,
  scheduleSession: null,
  updateSession: null,
  saveScore: null,
  deleteSession: null,
};

function requireAdapter(name) {
  const adapter = liveSpeakingAdapters[name];

  if (typeof adapter !== "function") {
    throw new Error(
      `Trainer ${name} API is not connected yet. ` +
      "A verified trainer-authorized backend endpoint is required."
    );
  }

  return adapter;
}

function normalizeSession(item) {
  const student = item.student || item.user || {};
  const profile = student.profile || {};
  const scores = item.scores || item.assessment || {};

  return {
    id: String(item.id),
    studentId: String(
      item.studentId || item.userId || student.id || ""
    ),
    student:
      item.studentName ||
      profile.fullName ||
      profile.name ||
      student.name ||
      student.email ||
      "Unnamed Student",
    email: item.email || student.email || "",
    batchId: String(item.batchId || item.batch?.id || ""),
    batch: item.batchName || item.batch?.name || "—",
    date: item.date || item.scheduledDate || "",
    time: item.time || item.scheduledTime || "",
    scheduledAt: item.scheduledAt || null,
    duration: item.duration ?? item.durationMinutes ?? 15,
    type: item.type || "Full Speaking Test",
    status: item.status || "Upcoming",
    meetingLink: item.meetingLink || "",
    notes: item.notes || "",
    scores: {
      fluency: scores.fluency ?? null,
      vocabulary: scores.vocabulary ?? null,
      grammar: scores.grammar ?? null,
      pronunciation: scores.pronunciation ?? null,
    },
    overallBand: item.overallBand ?? null,
    feedback: item.feedback || "",
    createdAt: item.createdAt || null,
  };
}

const service = {
  connected(name) {
    return typeof liveSpeakingAdapters[name] === "function";
  },

  listBatches(page = 1) {
    return get(path(`/batches?page=${page}&limit=100`));
  },

  listMembers(batchId, page = 1) {
    return get(
      path(`/batches/${enc(batchId)}/members?page=${page}&limit=100`)
    );
  },

  async getStudentsAndBatches() {
    const batchesResult = await getAll(
      (page) => service.listBatches(page),
      "batches"
    );

    const errors = [];
    const studentsMap = new Map();

    const results = await Promise.allSettled(
      batchesResult.records.map((batch) =>
        getAll(
          (page) => service.listMembers(batch.id, page),
          "members"
        )
      )
    );

    results.forEach((result, index) => {
      const batch = batchesResult.records[index];

      if (result.status === "rejected") {
        errors.push(
          `${batch.name}: ${result.reason?.message || "Members unavailable"}`
        );
        return;
      }

      if (!result.value.complete) {
        errors.push(`${batch.name}: Members may be incomplete.`);
      }

      result.value.records.forEach((member) => {
        const user = member.user || member.student || {};
        const profile = user.profile || {};
        const id = member.userId || member.studentId || user.id;

        if (!id) return;

        const existing = studentsMap.get(String(id));

        if (existing) {
          if (!existing.batches.some((b) => b.id === batch.id)) {
            existing.batches.push({
              id: batch.id,
              name: batch.name,
            });
          }
          return;
        }

        studentsMap.set(String(id), {
          id: String(id),
          name:
            profile.fullName ||
            profile.name ||
            user.name ||
            user.email ||
            "Unnamed Student",
          email: user.email || "",
          batches: [{ id: batch.id, name: batch.name }],
        });
      });
    });

    return {
      students: [...studentsMap.values()],
      batches: batchesResult.records,
      errors,
      complete:
        batchesResult.complete &&
        results.every(
          (r) => r.status === "fulfilled" && r.value.complete
        ),
    };
  },

  async listSessions() {
    if (!this.connected("listSessions")) {
      return {
        sessions: [],
        connected: false,
        complete: false,
      };
    }

    const result = await requireAdapter("listSessions")();

    const data = Array.isArray(result)
      ? result
      : result?.sessions;

    if (!Array.isArray(data)) {
      throw new Error("Invalid live speaking sessions API response.");
    }

    return {
      sessions: data.map(normalizeSession),
      connected: true,
      complete:
        Array.isArray(result) ||
        result?.complete === true ||
        result?.pagination?.hasNextPage === false,
    };
  },

  async getSession(id) {
    if (!this.connected("getSession")) return null;

    const data = await requireAdapter("getSession")(id);
    return normalizeSession(data?.session || data);
  },

  scheduleSession(payload) {
    return requireAdapter("scheduleSession")(payload);
  },

  updateSession(id, payload) {
    return requireAdapter("updateSession")(id, payload);
  },

  saveScore(id, payload) {
    return requireAdapter("saveScore")(id, payload);
  },

  deleteSession(id) {
    return requireAdapter("deleteSession")(id);
  },
};

export default service;
