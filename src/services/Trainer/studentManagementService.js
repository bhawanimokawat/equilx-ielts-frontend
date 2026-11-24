
import { getToken } from "../authService";

const BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

const instituteId = () => {
  const id =
    localStorage.getItem("equilx_institute_id") ||
    import.meta.env.VITE_INSTITUTE_ID;

  if (!id) {
    throw new Error("Active institute ID is not configured.");
  }
  return encodeURIComponent(id);
};

const url = (path) => `/${instituteId()}${path}`;

async function request(path, options = {}) {
  const token = getToken();
  if (!token) throw new Error("Please log in again.");

  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Cannot connect to the Equilx backend.");
  }

  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.success === false) {
    const error = new Error(
      json.message ||
      json.error?.message ||
      `API request failed (${response.status})`
    );
    error.status = response.status;
    throw error;
  }

  return json.data ?? json;
}

function extractRows(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  return [];
}

function totalPages(data, limit) {
  const meta = data?.pagination ?? data?.meta ?? {};
  const pages = Number(meta.totalPages ?? meta.pages);
  if (Number.isFinite(pages) && pages > 0) return pages;

  const total = Number(meta.total ?? data?.total);
  if (Number.isFinite(total) && total >= 0) {
    return Math.max(1, Math.ceil(total / limit));
  }

  return null;
}

async function loadPages(fetchPage, key) {
  const limit = 100;
  const records = [];
  let complete = false;

  for (let page = 1; page <= 100; page++) {
    const data = await fetchPage(page, limit);
    const rows = extractRows(data, key);
    records.push(...rows);

    const pages = totalPages(data, limit);
    const hasNext =
      data?.pagination?.hasNextPage ??
      data?.pagination?.hasNext;

    if (
      rows.length === 0 ||
      (pages !== null && page >= pages) ||
      hasNext === false ||
      (pages === null && hasNext === undefined && rows.length < limit)
    ) {
      complete = true;
      break;
    }
  }

  return { records, complete };
}

const service = {
  async getBatches(page = 1, limit = 100) {
    return request(
      url(`/batches?page=${page}&limit=${limit}`)
    );
  },

  async getMembers(batchId, page = 1, limit = 100) {
    return request(
      url(
        `/batches/${encodeURIComponent(batchId)}/members?page=${page}&limit=${limit}`
      )
    );
  },

  async createBatch(name) {
    return request(url("/batches"), {
      method: "POST",
      body: JSON.stringify({ name: name.trim() }),
    });
  },

  async updateBatch(batchId, name) {
    return request(
      url(`/batches/${encodeURIComponent(batchId)}`),
      {
        method: "PATCH",
        body: JSON.stringify({ name: name.trim() }),
      }
    );
  },

  async deleteBatch(batchId) {
    return request(
      url(`/batches/${encodeURIComponent(batchId)}`),
      { method: "DELETE" }
    );
  },

  async addExistingStudent(batchId, userId) {
    return request(
      url(`/batches/${encodeURIComponent(batchId)}/members`),
      {
        method: "POST",
        body: JSON.stringify({ userIds: [userId] }),
      }
    );
  },

  async removeStudentFromBatch(batchId, userId) {
    return request(
      url(
        `/batches/${encodeURIComponent(batchId)}/members/${encodeURIComponent(userId)}`
      ),
      { method: "DELETE" }
    );
  },

  async getPageData() {
    const batchesResult = await loadPages(
      (page, limit) => service.getBatches(page, limit),
      "batches"
    );

    const batches = batchesResult.records;
    const results = await Promise.allSettled(
      batches.map((batch) =>
        loadPages(
          (page, limit) =>
            service.getMembers(batch.id, page, limit),
          "members"
        )
      )
    );

    const errors = [];
    const students = new Map();

    const enrichedBatches = batches.map((batch, index) => {
      const result = results[index];
      const members =
        result.status === "fulfilled"
          ? result.value.records
          : [];

      if (result.status === "rejected") {
        errors.push(
          `${batch.name}: ${result.reason?.message || "Members unavailable"}`
        );
      } else if (!result.value.complete) {
        errors.push(`${batch.name}: Member listing may be incomplete.`);
      }

      members.forEach((member) => {
        const user = member.user || {};
        const id = member.userId || user.id;
        if (!id) return;

        const previous = students.get(id) || {
          id,
          name:
            user.profile?.name ||
            user.profile?.fullName ||
            user.name ||
            user.email ||
            "Unnamed Student",
          email: user.email || "",
          phone: user.profile?.phone || user.phone || "",
          batches: [],
          progress: null,
          assignments: null,
          completed: null,
          lastActive: null,
          status: null,
        };

        if (!previous.batches.some((b) => b.id === batch.id)) {
          previous.batches.push({
            id: batch.id,
            name: batch.name,
          });
        }

        students.set(id, previous);
      });

      return {
        ...batch,
        members,
        membersComplete:
          result.status === "fulfilled" && result.value.complete,
      };
    });

    return {
      batches: enrichedBatches,
      students: [...students.values()],
      complete:
        batchesResult.complete &&
        enrichedBatches.every((batch) => batch.membersComplete),
      errors,
    };
  },
};

export default service;
