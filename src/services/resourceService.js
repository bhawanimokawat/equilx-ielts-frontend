
import { request } from "./authService1";

const RESOURCE_BASE_URL = "/materials";

const resourceService = {
  // Get all study resources with pagination and filters
  getResources(page = 1, limit = 12, filters = {}) {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("limit", String(limit));

    if (filters.search?.trim()) {
      params.set("search", filters.search.trim());
    }

    if (filters.category && filters.category !== "All") {
      params.set("category", filters.category);
    }

    if (filters.type && filters.type !== "All") {
      params.set("type", filters.type);
    }

    if (filters.level && filters.level !== "All") {
      params.set("level", filters.level);
    }

    if (filters.sort) {
      params.set("sort", filters.sort);
    }

    return request(`${RESOURCE_BASE_URL}?${params.toString()}`);
  },

  // Get a single resource by ID
  getResourceById(resourceId) {
    if (!resourceId) {
      throw new Error("Resource ID is required.");
    }

    return request(
      `${RESOURCE_BASE_URL}/${encodeURIComponent(resourceId)}`
    );
  },
};

export default resourceService;
