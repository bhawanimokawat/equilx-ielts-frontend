import axiosInstance from "../../api/axiosInstance";

const studentService = {
  async getStudents(instituteId, params = {}) {
    const response = await axiosInstance.get(
      `/${instituteId}/memberships`,
      {
        params: {
          role: "INSTITUTE_STUDENT",
          page: params.page || 1,
          limit: params.limit || 100,
          ...(params.status ? { status: params.status } : {}),
        },
      }
    );

    return response.data;
  },

  async getStudentById(instituteId, membershipId) {
    const response = await axiosInstance.get(
      `/${instituteId}/memberships/${membershipId}`
    );

    return response.data;
  },

  async updateStudentStatus(instituteId, membershipId, status) {
    const response = await axiosInstance.patch(
      `/${instituteId}/memberships/${membershipId}`,
      { status }
    );

    return response.data;
  },
};

export default studentService;
