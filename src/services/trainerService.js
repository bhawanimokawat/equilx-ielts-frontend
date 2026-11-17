const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const getToken = () =>
  localStorage.getItem("equilx_token") || "";

const getInstituteId = () =>
  import.meta.env.VITE_INSTITUTE_ID ||
  localStorage.getItem("equilx_institute_id") ||
  "";

const request = async (endpoint) => {
  const token = getToken();

  if (!token) {
    throw new Error("Login session not found. Please log in again.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      result.message ||
        result.error?.message ||
        `Request failed (${response.status})`
    );
    error.status = response.status;
    error.code = result.code || result.error?.code;
    throw error;
  }

  return result;
};

const readData = (result) => result?.data ?? result ?? {};

const trainerService = {
  async getDashboardData() {
    const instituteId = getInstituteId();

    if (!instituteId) {
      const error = new Error(
        "Institute ID is not configured. Add VITE_INSTITUTE_ID to your frontend .env file."
      );
      error.code = "INSTITUTE_ID_REQUIRED";
      throw error;
    }

    const encodedInstituteId = encodeURIComponent(instituteId);

    const [assignmentResult, batchResult] = await Promise.allSettled([
      request(`/${encodedInstituteId}/assignments?page=1&limit=100`),
      request(`/${encodedInstituteId}/batches?page=1&limit=100`),
    ]);

    const assignmentsData =
      assignmentResult.status === "fulfilled"
        ? readData(assignmentResult.value)
        : {};

    const batchesData =
      batchResult.status === "fulfilled"
        ? readData(batchResult.value)
        : {};

    const assignments = Array.isArray(assignmentsData.assignments)
      ? assignmentsData.assignments
      : [];

    const batches = Array.isArray(batchesData.batches)
      ? batchesData.batches
      : [];

    const memberResults = await Promise.allSettled(
      batches.map((batch) =>
        request(
          `/${encodedInstituteId}/batches/${encodeURIComponent(
            batch.id
          )}/members?page=1&limit=100`
        )
      )
    );

    const batchesWithMembers = batches.map((batch, index) => {
      const memberResult = memberResults[index];

      if (memberResult.status !== "fulfilled") {
        return {
          ...batch,
          members: [],
          membersError: memberResult.reason?.message || "Unable to load members",
        };
      }

      const memberData = readData(memberResult.value);

      return {
        ...batch,
        members: Array.isArray(memberData.members) ? memberData.members : [],
        membersError: "",
      };
    });

    return {
      assignments,
      batches: batchesWithMembers,
      errors: {
        assignments:
          assignmentResult.status === "rejected"
            ? assignmentResult.reason
            : null,
        batches:
          batchResult.status === "rejected" ? batchResult.reason : null,
      },
    };
  },
};

export default trainerService;