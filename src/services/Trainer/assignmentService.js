
const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

const getInstituteId = () =>
  localStorage.getItem("equilx_institute_id") ||
  import.meta.env.VITE_INSTITUTE_ID ||
  "";

const getToken = () =>
  localStorage.getItem("equilx_token") || "";

const encode = (value) => encodeURIComponent(String(value));

function institutePath(path) {
  const instituteId = getInstituteId();
  if (!instituteId) {
    throw new Error("Institute ID missing. Please select your institute.");
  }
  return `/${encode(instituteId)}${path}`;
}

async function request(path, options = {}) {
  const token = getToken();
  if (!token) throw new Error("Login session missing. Please log in.");

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error("Unable to connect to backend.");
  }

  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.success === false) {
    const error = new Error(
      json.message ||
      json.error?.message ||
      `Request failed (${response.status})`
    );
    error.status = response.status;
    throw error;
  }

  return json.data ?? json;
}

async function getAllPages(fetchPage, key) {
  const records = [];
  let complete = false;

  for (let page = 1; page <= 100; page++) {
    const data = await fetchPage(page, 100);
    const rows = Array.isArray(data)
      ? data
      : Array.isArray(data?.[key])
        ? data[key]
        : [];

    records.push(...rows);

    const totalPages = Number(data?.pagination?.totalPages);
    if (
      rows.length === 0 ||
      (Number.isFinite(totalPages) && page >= totalPages) ||
      (!Number.isFinite(totalPages) && rows.length < 100)
    ) {
      complete = true;
      break;
    }
  }

  return { records, complete };
}

const assignmentService = {
  listAssignments(page = 1, limit = 100) {
    return request(
      institutePath(`/assignments?page=${page}&limit=${limit}`)
    );
  },

  getAssignment(id) {
    return request(institutePath(`/assignments/${encode(id)}`));
  },

  getTargets(id, page = 1, limit = 100) {
    return request(
      institutePath(
        `/assignments/${encode(id)}/targets?page=${page}&limit=${limit}`
      )
    );
  },

  getSubmissions(id, page = 1, limit = 100) {
    return request(
      institutePath(
        `/assignments/${encode(id)}/submissions?page=${page}&limit=${limit}`
      )
    );
  },

  getProgress(id) {
    return request(
      institutePath(`/assignments/${encode(id)}/progress`)
    );
  },

  listBatches(page = 1, limit = 100) {
    return request(
      institutePath(`/batches?page=${page}&limit=${limit}`)
    );
  },

  listBatchMembers(id, page = 1, limit = 100) {
    return request(
      institutePath(
        `/batches/${encode(id)}/members?page=${page}&limit=${limit}`
      )
    );
  },

  createAssignment(payload) {
    return request(institutePath("/assignments"), {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateAssignment(id, payload) {
    return request(institutePath(`/assignments/${encode(id)}`), {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  publishAssignment(id) {
    return request(
      institutePath(`/assignments/${encode(id)}/publish`),
      { method: "POST" }
    );
  },

  closeAssignment(id) {
    return request(
      institutePath(`/assignments/${encode(id)}/close`),
      { method: "POST" }
    );
  },

  cancelAssignment(id) {
    return request(
      institutePath(`/assignments/${encode(id)}/cancel`),
      { method: "POST" }
    );
  },

  deleteAssignment(id) {
    return request(institutePath(`/assignments/${encode(id)}`), {
      method: "DELETE",
    });
  },

  async getPageData() {
    const [assignmentsResult, batchesResult] = await Promise.allSettled([
      getAllPages(
        (page, limit) => this.listAssignments(page, limit),
        "assignments"
      ),
      getAllPages(
        (page, limit) => this.listBatches(page, limit),
        "batches"
      ),
    ]);

    if (assignmentsResult.status === "rejected") {
      throw assignmentsResult.reason;
    }

    const errors = [];
    const assignmentRows = assignmentsResult.value.records;

    const batches =
      batchesResult.status === "fulfilled"
        ? batchesResult.value.records
        : [];

    if (batchesResult.status === "rejected") {
      errors.push(
        `Batches: ${batchesResult.reason?.message || "Unavailable"}`
      );
    }

    const targetResults = await Promise.allSettled(
      assignmentRows.map((item) =>
        getAllPages(
          (page, limit) => this.getTargets(item.id, page, limit),
          "targets"
        )
      )
    );

    const assignments = assignmentRows.map((item, index) => {
      const result = targetResults[index];
      const targets =
        result.status === "fulfilled" ? result.value.records : [];

      if (result.status === "rejected") {
        errors.push(
          `${item.title}: ${result.reason?.message || "Targets unavailable"}`
        );
      }

      return {
        ...item,
        targets,
        targetsLoaded:
          result.status === "fulfilled" && result.value.complete,
        assignedCount:
          result.status === "fulfilled" && result.value.complete
            ? targets.length
            : null,
        completedCount:
          result.status === "fulfilled" && result.value.complete
            ? targets.filter((t) => t.status === "COMPLETED").length
            : null,
      };
    });

    return {
      assignments,
      batches,
      errors,
      complete:
        assignmentsResult.value.complete &&
        assignments.every((a) => a.targetsLoaded),
    };
  },
};

export default assignmentService;
