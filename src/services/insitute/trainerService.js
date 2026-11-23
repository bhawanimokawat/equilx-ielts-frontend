import axiosInstance from "../../api/axiosInstance";

const trainerService = {
  async getTrainers(instituteId, params = {}) {
    const response = await axiosInstance.get(
      `/${instituteId}/memberships`,
      {
        params: {
          role: "TRAINER",
          page: params.page || 1,
          limit: params.limit || 20,
          ...(params.status ? { status: params.status } : {}),
        },
      }
    );

    return response.data;
  },

  async getTrainerById(instituteId, membershipId) {
    const response = await axiosInstance.get(
      `/${instituteId}/memberships/${membershipId}`
    );

    return response.data;
  },

  async createTrainer(instituteId, userId) {
    const response = await axiosInstance.post(
      `/${instituteId}/memberships`,
      {
        userId,
        role: "TRAINER",
      }
    );

    return response.data;
  },

  async updateTrainerStatus(instituteId, membershipId, status) {
    const response = await axiosInstance.patch(
      `/${instituteId}/memberships/${membershipId}`,
      { status }
    );

    return response.data;
  },
};

export default trainerService;
