
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

const getToken = () => {
  try {
    return localStorage.getItem("equilx_token") || "";
  } catch {
    return "";
  }
};

const getInstituteId = () => {
  try {
    return (
      localStorage.getItem("equilx_institute_id") ||
      import.meta.env.VITE_INSTITUTE_ID ||
      ""
    );
  } catch {
    return import.meta.env.VITE_INSTITUTE_ID || "";
  }
};

const setInstituteId = (id) => {
  if (!id) throw new Error("Valid institute ID required.");
  localStorage.setItem("equilx_institute_id", String(id));
};

const clearInstituteId = () => {
  localStorage.removeItem("equilx_institute_id");
};

const requireInstituteId = () => {
  const id = getInstituteId();
  if (!id) {
    const error = new Error("Active institute is not configured.");
    error.code = "INSTITUTE_ID_REQUIRED";
    throw error;
  }
  return encodeURIComponent(id);
};

const queryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  return query.size ? `?${query}` : "";
};

const request = async (path, options = {}) => {
  const token = getToken();
  if (!token) {
    const error = new Error("Please log in again.");
    error.code = "AUTH_REQUIRED";
    throw error;
  }

  const { body, headers, ...rest } = options;
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      ...rest,
      credentials: "include",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(body !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
        ...headers,
      },
      ...(body !== undefined ? { body } : {}),
    });
  } catch (cause) {
    const error = new Error("Cannot connect to Equilx API.");
    error.code = "CONNECTION_ERROR";
    error.cause = cause;
    throw error;
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    const error = new Error(
      result.message ||
      result.error?.message ||
      `Request failed (${response.status})`
    );
    error.status = response.status;
    error.code =
      result.code || result.error?.code || "REQUEST_FAILED";
    throw error;
  }

  return result;
};

const readData = (result) => result?.data ?? result ?? {};

const collection = (data, key) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  return [];
};

const paginationOf = (data) =>
  data?.pagination ?? data?.meta?.pagination ?? data?.meta ?? null;

const numberOrNull = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

// Reads paginated records without guessing missing records.
const allPages = async (loader, key, limit = 100) => {
  const records = [];
  let pagination = null;
  let complete = false;

  for (let page = 1; page <= 100; page++) {
    const data = await loader({ page, limit });
    const rows = collection(data, key);
    const meta = paginationOf(data);

    if (page === 1) pagination = meta;
    records.push(...rows);

    const totalPages = numberOrNull(
      meta?.totalPages ?? meta?.pages ?? meta?.lastPage
    );
    const total = numberOrNull(
      meta?.total ?? meta?.totalCount
    );
    const calculatedPages =
      totalPages ??
      (total !== null ? Math.ceil(total / limit) : null);

    const hasNext = meta?.hasNextPage ?? meta?.hasNext;

    if (
      rows.length === 0 ||
      (calculatedPages !== null && page >= calculatedPages) ||
      hasNext === false ||
      (calculatedPages === null &&
        hasNext === undefined &&
        rows.length < limit)
    ) {
      complete = true;
      break;
    }
  }

  return { records, pagination, complete };
};

const trainerService = {
  getToken,
  getInstituteId,
  setInstituteId,
  clearInstituteId,

  async getAssignments(params = {}) {
    const instituteId = requireInstituteId();
    const result = await request(
      `/${instituteId}/assignments${queryString({
        page: params.page ?? 1,
        limit: params.limit ?? 100,
        status: params.status,
        search: params.search,
      })}`
    );
    return readData(result);
  },

  async getBatches(params = {}) {
    const instituteId = requireInstituteId();
    const result = await request(
      `/${instituteId}/batches${queryString({
        page: params.page ?? 1,
        limit: params.limit ?? 100,
        search: params.search,
        trainerId: params.trainerId,
      })}`
    );
    return readData(result);
  },

  async getBatchMembers(batchId, params = {}) {
    if (!batchId) throw new Error("Batch ID required.");
    const instituteId = requireInstituteId();
    const result = await request(
      `/${instituteId}/batches/${encodeURIComponent(batchId)}/members${queryString({
        page: params.page ?? 1,
        limit: params.limit ?? 100,
        search: params.search,
      })}`
    );
    return readData(result);
  },

  async getAssignmentProgress(assignmentId) {
    if (!assignmentId) throw new Error("Assignment ID required.");
    const instituteId = requireInstituteId();
    const result = await request(
      `/${instituteId}/assignments/${encodeURIComponent(assignmentId)}/progress`
    );
    return readData(result);
  },

  async getAssignmentSubmissions(assignmentId, params = {}) {
    if (!assignmentId) throw new Error("Assignment ID required.");
    const instituteId = requireInstituteId();
    const result = await request(
      `/${instituteId}/assignments/${encodeURIComponent(assignmentId)}/submissions${queryString({
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      })}`
    );
    return readData(result);
  },

  async getDashboardData() {
    requireInstituteId();

    const [assignmentResult, batchResult] =
      await Promise.allSettled([
        allPages(
          (params) => trainerService.getAssignments(params),
          "assignments"
        ),
        allPages(
          (params) => trainerService.getBatches(params),
          "batches"
        ),
      ]);

    const assignmentPage =
      assignmentResult.status === "fulfilled"
        ? assignmentResult.value
        : { records: [], pagination: null, complete: false };

    const batchPage =
      batchResult.status === "fulfilled"
        ? batchResult.value
        : { records: [], pagination: null, complete: false };

    const assignments = assignmentPage.records;
    const batches = batchPage.records;

    const memberResults = await Promise.allSettled(
      batches.map((batch) =>
        batch.id
          ? allPages(
              (params) =>
                trainerService.getBatchMembers(batch.id, params),
              "members"
            )
          : Promise.reject(new Error("Batch ID missing."))
      )
    );

    const batchesWithMembers = batches.map((batch, index) => {
      const result = memberResults[index];
      return {
        ...batch,
        members:
          result.status === "fulfilled"
            ? result.value.records
            : [],
        membersComplete:
          result.status === "fulfilled"
            ? result.value.complete
            : false,
        membersError:
          result.status === "rejected"
            ? result.reason?.message || "Cannot load members."
            : "",
      };
    });

    const recentAssignments = [...assignments]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 3);

    const progressResults = await Promise.allSettled(
      recentAssignments.map((assignment) =>
        assignment.id
          ? trainerService.getAssignmentProgress(assignment.id)
          : Promise.reject(new Error("Assignment ID missing."))
      )
    );

    const assignmentProgress = {};

    recentAssignments.forEach((assignment, index) => {
      const result = progressResults[index];
      if (!assignment.id) return;

      assignmentProgress[assignment.id] = {
        data:
          result.status === "fulfilled" ? result.value : null,
        error:
          result.status === "rejected"
            ? result.reason?.message || "Progress unavailable."
            : null,
      };
    });

    return {
      assignments,
      batches: batchesWithMembers,
      assignmentProgress,

      // Future-ready collections.
      // No API endpoint is invented here.
      skillPerformance: [],
      speakingSessions: [],
      recentActivities: [],
      writingReviews: [],
      unreadMessages: null,

      connected: {
        skillPerformance: false,
        speakingSessions: false,
        recentActivities: false,
        writingReviews: false,
        messages: false,
      },

      completeness: {
        assignments: assignmentPage.complete,
        batches: batchPage.complete,
        members: batchesWithMembers.every(
          (batch) => batch.membersComplete
        ),
      },

      pagination: {
        assignments: assignmentPage.pagination,
        batches: batchPage.pagination,
      },

      errors: {
        assignments:
          assignmentResult.status === "rejected"
            ? assignmentResult.reason
            : null,
        batches:
          batchResult.status === "rejected"
            ? batchResult.reason
            : null,
      },
    };
  },
};

export default trainerService;
