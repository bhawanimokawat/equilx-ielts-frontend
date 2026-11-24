import api from "../../api/axiosInstance"; // adjust depth if needed

const instituteId = () =>
  localStorage.getItem("equilx_institute_id") ||
  import.meta.env.VITE_INSTITUTE_ID ||
  "";

const enc = (value) => encodeURIComponent(String(value));

function crmPath(path = "") {
  const id = instituteId();

  if (!id) {
    throw new Error("Institute ID missing. Select an institute first.");
  }

  return `/institutes/${enc(id)}/crm${path}`;
}

// Builds the same readable message the old code produced (field errors first).
function crmError(data, status, fallback) {
  const details = data?.error?.details
    ?.map((item) => `${item.field}: ${item.message}`)
    .join("; ");

  const error = new Error(
    details ||
      data?.error?.message ||
      data?.message ||
      fallback ||
      `CRM request failed${status ? ` (${status})` : ""}`
  );
  error.status = status;
  return error;
}

// The shared `api` instance adds the access token and refreshes it when needed.
async function request(
  path,
  { method = "GET", body, raw = false } = {}
) {
  let response;

  try {
    response = await api.request({
      url: crmPath(path),
      method,
      data: body,
      headers: { Accept: raw ? "text/csv" : "application/json" },
      ...(raw ? { responseType: "blob" } : {}),
    });
  } catch (error) {
    let data = error?.response?.data;

    // Error bodies of blob requests arrive as a Blob: read them as JSON.
    if (typeof Blob !== "undefined" && data instanceof Blob) {
      try {
        data = JSON.parse(await data.text());
      } catch {
        data = {};
      }
    }

    const offline = error?.request && !error?.response;
    throw crmError(
      data,
      error?.response?.status ?? error?.status,
      offline ? "Unable to connect to CRM backend." : error?.message
    );
  }

  if (raw) return response.data; // Blob for CSV export

  const json = response.data ?? {};

  if (json.success === false) {
    throw crmError(json, response.status);
  }

  return json;
}

function unwrap(result) {
  return result.data ?? result;
}

function getItems(result, key) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.items)) return result.items;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.[key])) return result[key];
  if (Array.isArray(result?.data?.[key])) {
    return result.data[key];
  }

  throw new Error(`Invalid CRM response: ${key} array missing.`);
}

async function collectPages(fetchPage, key) {
  const records = [];
  let complete = false;

  for (let page = 1; page <= 100; page++) {
    const result = await fetchPage(page);
    const rows = getItems(result, key);

    records.push(...rows);

    const pagination =
      result.pagination ||
      result.data?.pagination ||
      {};

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

const query = (params) => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      search.set(key, String(value));
    }
  });

  return search.toString();
};

const leadCRMService = {
  listLeads(params = {}) {
    return request(
      `/leads?${query({
        page: 1,
        limit: 100,
        ...params,
      })}`
    );
  },

  async getAllLeads(filters = {}) {
    const result = await collectPages(
      (page) =>
        this.listLeads({
          ...filters,
          page,
          limit: 100,
        }),
      "leads"
    );

    return {
      leads: result.records,
      complete: result.complete,
    };
  },

  async getLead(id) {
    return unwrap(await request(`/leads/${enc(id)}`));
  },

  async createLead(payload) {
    return unwrap(
      await request("/leads", {
        method: "POST",
        body: payload,
      })
    );
  },

  async updateLead(id, payload) {
    return unwrap(
      await request(`/leads/${enc(id)}`, {
        method: "PATCH",
        body: payload,
      })
    );
  },

  deleteLead(id) {
    return request(`/leads/${enc(id)}`, {
      method: "DELETE",
    });
  },

  updateStatus(id, status, reason = null) {
    return request(`/leads/${enc(id)}/status`, {
      method: "PATCH",
      body: { status, reason },
    });
  },

  getStatusHistory(id) {
    return request(`/leads/${enc(id)}/status-history`);
  },

  assignLead(id, assignedToId, note = null) {
    return request(`/leads/${enc(id)}/assignment`, {
      method: "PATCH",
      body: { assignedToId, note },
    });
  },

  getAssignmentHistory(id) {
    return request(`/leads/${enc(id)}/assignment-history`);
  },

  async getAssignableUsers() {
    return getItems(
      await request("/leads/assignable-users"),
      "users"
    );
  },

  async listSources() {
    return getItems(
      await request("/lead-sources"),
      "sources"
    );
  },

  createSource(name) {
    return request("/lead-sources", {
      method: "POST",
      body: { name },
    });
  },

  updateSource(id, payload) {
    return request(`/lead-sources/${enc(id)}`, {
      method: "PATCH",
      body: payload,
    });
  },

  listFollowUps(params = {}) {
    return request(
      `/follow-ups?${query({
        page: 1,
        limit: 100,
        ...params,
      })}`
    );
  },

  async getAllFollowUps(filters = {}) {
    const result = await collectPages(
      (page) =>
        this.listFollowUps({
          ...filters,
          page,
          limit: 100,
        }),
      "followUps"
    );

    return {
      followUps: result.records,
      complete: result.complete,
    };
  },

  createFollowUp(leadId, payload) {
    return request(`/leads/${enc(leadId)}/follow-ups`, {
      method: "POST",
      body: payload,
    });
  },

  completeFollowUp(id) {
    return request(`/follow-ups/${enc(id)}/complete`, {
      method: "PATCH",
    });
  },

  cancelFollowUp(id) {
    return request(`/follow-ups/${enc(id)}/cancel`, {
      method: "PATCH",
    });
  },

  async getActivities(leadId, params = {}) {
    const result = await request(
      `/leads/${enc(leadId)}/activities?${query({
        page: 1,
        limit: 100,
        ...params,
      })}`
    );

    return {
      activities: getItems(result, "activities"),
      pagination: result.pagination || {},
    };
  },

  createActivity(leadId, payload) {
    return request(`/leads/${enc(leadId)}/activities`, {
      method: "POST",
      body: payload,
    });
  },

  exportCsv() {
    return request("/leads/export", { raw: true });
  },

  importCsv(csv) {
    return request("/leads/import", {
      method: "POST",
      body: { csv },
    });
  },
};

export default leadCRMService;
