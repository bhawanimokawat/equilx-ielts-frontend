import axiosInstance from "../../api/axiosInstance";

// All batch APIs are scoped to an institute.
const getBatchBaseUrl = (instituteId) => {
  if (!instituteId) {
    throw new Error("Institute ID is required.");
  }

  return `/${instituteId}/batches`;
};

// All membership APIs are also scoped to an institute.
const getMembershipBaseUrl = (instituteId) => {
  if (!instituteId) {
    throw new Error("Institute ID is required.");
  }

  return `/${instituteId}/memberships`;
};

const batchService = {
  // Fetch batches with pagination and optional search/trainer filters.
  async getBatches(instituteId, params = {}) {
    const response = await axiosInstance.get(
      getBatchBaseUrl(instituteId),
      { params }
    );

    return response.data;
  },

  // Fetch one batch by its ID.
  async getBatchById(instituteId, batchId) {
    const response = await axiosInstance.get(
      `${getBatchBaseUrl(instituteId)}/${batchId}`
    );

    return response.data;
  },

  // Create a batch. Backend supports only name and trainerId.
  async createBatch(instituteId, batchData) {
    const response = await axiosInstance.post(
      getBatchBaseUrl(instituteId),
      batchData
    );

    return response.data;
  },

  // Update batch name or assigned trainer.
  async updateBatch(instituteId, batchId, batchData) {
    const response = await axiosInstance.patch(
      `${getBatchBaseUrl(instituteId)}/${batchId}`,
      batchData
    );

    return response.data;
  },

  // Delete a batch. Backend may reject deletion if assignment history exists.
  async deleteBatch(instituteId, batchId) {
    const response = await axiosInstance.delete(
      `${getBatchBaseUrl(instituteId)}/${batchId}`
    );

    return response.data;
  },

  // Fetch active trainers belonging to this institute.
  async getTrainers(instituteId) {
    const response = await axiosInstance.get(
      getMembershipBaseUrl(instituteId),
      {
        params: {
          role: "TRAINER",
          status: "ACTIVE",
          page: 1,
          limit: 100,
        },
      }
    );

    return response.data;
  },

  // Fetch students belonging to a particular batch.
  async getBatchMembers(instituteId, batchId, params = {}) {
    const response = await axiosInstance.get(
      `${getBatchBaseUrl(instituteId)}/${batchId}/members`,
      { params }
    );

    return response.data;
  },

  // Add students to a batch. userIds must be an array of UUIDs.
  async addBatchMembers(instituteId, batchId, userIds) {
    const response = await axiosInstance.post(
      `${getBatchBaseUrl(instituteId)}/${batchId}/members`,
      { userIds }
    );

    return response.data;
  },

  // Remove one student from a batch.
  async removeBatchMember(instituteId, batchId, userId) {
    const response = await axiosInstance.delete(
      `${getBatchBaseUrl(instituteId)}/${batchId}/members/${userId}`
    );

    return response.data;
  },

  // Fetch batches assigned to the logged-in student.
  async getMyBatches(instituteId, params = {}) {
    const response = await axiosInstance.get(
      `${getBatchBaseUrl(instituteId)}/my`,
      { params }
    );

    return response.data;
  },
};

export default batchService;
