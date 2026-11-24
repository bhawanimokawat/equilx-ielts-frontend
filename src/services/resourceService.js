
import { request } from "./authService";

const RESOURCE_BASE_URL = "/materials";

const resourceService = {
  // Get published study resources with filters and pagination.
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

    return request(
      `${RESOURCE_BASE_URL}?${params.toString()}`
    );
  },

  // Get one published material.
  getResourceById(resourceId) {
    if (!resourceId) {
      throw new Error("Resource ID is required.");
    }

    return request(
      `${RESOURCE_BASE_URL}/${encodeURIComponent(resourceId)}`
    );
  },

  // Get all saved materials of the logged-in user.
  getBookmarks() {
    return request(`${RESOURCE_BASE_URL}/bookmarks`);
  },

  // Save a material in PostgreSQL.
  addBookmark(resourceId) {
    if (!resourceId) {
      throw new Error("Resource ID is required.");
    }

    return request(
      `${RESOURCE_BASE_URL}/${encodeURIComponent(resourceId)}/bookmark`,
      { method: "POST" }
    );
  },

  // Remove a saved material from PostgreSQL.
  removeBookmark(resourceId) {
    if (!resourceId) {
      throw new Error("Resource ID is required.");
    }

    return request(
      `${RESOURCE_BASE_URL}/${encodeURIComponent(resourceId)}/bookmark`,
      { method: "DELETE" }
    );
  },
};

export default resourceService;
