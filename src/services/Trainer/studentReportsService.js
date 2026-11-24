
const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

const getToken = () => localStorage.getItem("equilx_token") || "";

const getInstituteId = () =>
  localStorage.getItem("equilx_institute_id") ||
  import.meta.env.VITE_INSTITUTE_ID ||
  "";

function institutePath(path) {
  const id = getInstituteId();
  if (!id) throw new Error("Institute ID is missing.");
  return `/${encodeURIComponent(id)}${path}`;
}

async function request(path) {
  const token = getToken();
  if (!token) throw new Error("Please log in again.");

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error("Unable to connect to backend.");
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

function getRows(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  return [];
}

async function allPages(fetchPage, key) {
  const rows = [];
  let complete = false;

  for (let page = 1; page <= 100; page++) {
    const data = await fetchPage(page);
    const current = getRows(data, key);
    rows.push(...current);

    const pagination = data?.pagination || data?.meta || {};
    const pages = Number(
      pagination.totalPages ?? pagination.pages
    );
    const total = Number(pagination.total ?? data?.total);

    if (
      current.length === 0 ||
      (Number.isFinite(pages) && pages > 0 && page >= pages) ||
      (Number.isFinite(total) && total >= 0 && rows.length >= total) ||
      pagination.hasNextPage === false ||
      (
        !Number.isFinite(pages) &&
        !Number.isFinite(total) &&
        pagination.hasNextPage === undefined &&
        current.length < 100
      )
    ) {
      complete = true;
      break;
    }
  }

  return { rows, complete };
}

function normalizeMember(member, batch) {
  const user = member.user || member.student || {};
  const profile = user.profile || {};
  const id = member.userId || user.id || member.studentId;

  if (!id) return null;

  return {
    id,
    name:
      profile.fullName ||
      profile.name ||
      user.name ||
      user.email ||
      "Unnamed Student",
    email: user.email || "",
    phone: profile.phone || user.phone || "",
    batches: [{ id: batch.id, name: batch.name }],
  };
}

export function emptyStudentReport(studentId) {
  return {
    studentId,
    overall: null,
    listening: null,
    reading: null,
    writing: null,
    speaking: null,
    progress: null,
    active: null,
    history: [],
    attempts: [],
    writingFeedback: [],
    speakingFeedback: [],
    loaded: {
      scores: false,
      history: false,
      attempts: false,
      writingFeedback: false,
      speakingFeedback: false,
    },
  };
}

/*
  Future API integration:
  Implement these functions when trainer-authorized endpoints exist.

  Return real backend records only. Do not create demo records.

  Scores:
    { overall, listening, reading, writing, speaking, progress }

  History:
    [{ id, date, score }]

  Attempts:
    [{ id, title, date, listening, reading, writing,
       speaking, overall, status }]

  Feedback:
    [{ id, skill, title, date, score, reviewer, feedback }]
*/
export const reportAdapters = {
  scores: null,
  history: null,
  attempts: null,
  writingFeedback: null,
  speakingFeedback: null,
};

const service = {
  listBatches(page = 1) {
    return request(institutePath(`/batches?page=${page}&limit=100`));
  },

  listMembers(batchId, page = 1) {
    return request(
      institutePath(
        `/batches/${encodeURIComponent(batchId)}/members?page=${page}&limit=100`
      )
    );
  },

  async getStudents() {
    const batchesResult = await allPages(
      (page) => service.listBatches(page),
      "batches"
    );

    const errors = [];
    const studentsMap = new Map();

    const memberResults = await Promise.allSettled(
      batchesResult.rows.map((batch) =>
        allPages(
          (page) => service.listMembers(batch.id, page),
          "members"
        )
      )
    );

    memberResults.forEach((result, index) => {
      const batch = batchesResult.rows[index];

      if (result.status === "rejected") {
        errors.push(
          `${batch.name}: ${result.reason?.message || "Members unavailable"}`
        );
        return;
      }

      if (!result.value.complete) {
        errors.push(`${batch.name}: Member listing may be incomplete.`);
      }

      result.value.rows.forEach((member) => {
        const normalized = normalizeMember(member, batch);
        if (!normalized) return;

        const existing = studentsMap.get(normalized.id);

        if (!existing) {
          studentsMap.set(normalized.id, normalized);
        } else if (
          !existing.batches.some((item) => item.id === batch.id)
        ) {
          existing.batches.push({
            id: batch.id,
            name: batch.name,
          });
        }
      });
    });

    return {
      students: [...studentsMap.values()],
      batches: batchesResult.rows,
      complete:
        batchesResult.complete &&
        memberResults.every(
          (result) =>
            result.status === "fulfilled" && result.value.complete
        ),
      errors,
    };
  },

  async getStudentReport(studentId) {
    const report = emptyStudentReport(studentId);
    const errors = [];

    const keys = Object.keys(reportAdapters);

    const results = await Promise.allSettled(
      keys.map(async (key) => {
        const adapter = reportAdapters[key];

        if (typeof adapter !== "function") {
          return { connected: false, value: null };
        }

        const value = await adapter(studentId);
        return { connected: true, value };
      })
    );

    results.forEach((result, index) => {
      const key = keys[index];

      if (result.status === "rejected") {
        errors.push(
          `${key}: ${result.reason?.message || "Unable to load"}`
        );
        return;
      }

      if (!result.value.connected) return;

      const value = result.value.value;
      report.loaded[key] = true;

      if (key === "scores" && value && typeof value === "object") {
        for (const field of [
          "overall", "listening", "reading",
          "writing", "speaking", "progress", "active",
        ]) {
          if (Object.prototype.hasOwnProperty.call(value, field)) {
            report[field] = value[field];
          }
        }
      } else if (key !== "scores" && Array.isArray(value)) {
        report[key] = value;
      }
    });

    return { ...report, errors };
  },
};

export default service;
