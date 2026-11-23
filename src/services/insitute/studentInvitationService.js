import axiosInstance from "../../api/axiosInstance";

const studentInvitationService = {
  async getInvitations(instituteId, params = {}) {
    const response = await axiosInstance.get(
      `/${instituteId}/student-invitations`,
      {
        params: {
          page: params.page || 1,
          limit: params.limit || 100,
          ...(params.status ? { status: params.status } : {}),
        },
      }
    );

    return response.data;
  },

  async createInvitation(instituteId, student) {
    const response = await axiosInstance.post(
      `/${instituteId}/student-invitations`,
      student
    );

    return response.data;
  },

  async createBulkInvitations(instituteId, students) {
    const response = await axiosInstance.post(
      `/${instituteId}/student-invitations/bulk`,
      { students }
    );

    return response.data;
  },

  async resendInvitation(instituteId, invitationId) {
    const response = await axiosInstance.post(
      `/${instituteId}/student-invitations/${invitationId}/resend`
    );

    return response.data;
  },

  async cancelInvitation(instituteId, invitationId) {
    const response = await axiosInstance.patch(
      `/${instituteId}/student-invitations/${invitationId}/cancel`
    );

    return response.data;
  },

  async approveInvitation(instituteId, invitationId) {
    const response = await axiosInstance.patch(
      `/${instituteId}/student-invitations/${invitationId}/approve`
    );

    return response.data;
  },

  async rejectInvitation(instituteId, invitationId) {
    const response = await axiosInstance.patch(
      `/${instituteId}/student-invitations/${invitationId}/reject`
    );

    return response.data;
  },
};

export default studentInvitationService;
