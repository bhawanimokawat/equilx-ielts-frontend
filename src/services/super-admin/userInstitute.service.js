import api from "../../api/axiosInstance";

 
// USERS
 

export const getUsers = async (params = {}) => {
  const response = await api.get("/users", { params });
  return response.data;
};

export const updateUserStatus = async (userId, isActive) => {
  const response = await api.patch(`/users/${userId}/status`, {
    isActive,
  });

  return response.data;
};

 
// ORGANIZATIONS / INSTITUTES
 

export const getOrganizations = async (params = {}) => {
  const response = await api.get("/organizations", { params });
  return response.data;
};

export const getOrganizationById = async (organizationId) => {
  const response = await api.get(`/organizations/${organizationId}`);
  return response.data;
};

export const createOrganization = async (data) => {
  const response = await api.post("/organizations", {
    name: data.name,
    slug: data.slug,
  });

  return response.data;
};

export const updateOrganization = async (organizationId, data) => {
  const response = await api.patch(`/organizations/${organizationId}`, {
    name: data.name,
    slug: data.slug,
  });

  return response.data;
};

export const getOrganizationMembers = async (
  organizationId,
  params = {}
) => {
  const response = await api.get(
    `/organizations/${organizationId}/members`,
    { params }
  );

  return response.data;
};
 
 
// INSTITUTE MEMBERSHIPS
 

export const getInstituteMemberships = async (
  instituteId,
  params = {}
) => {
  const response = await api.get(
    `/institutes/${instituteId}/memberships`,
    { params }
  );

  return response.data;
};

export const createInstituteMembership = async (
  instituteId,
  data
) => {
  const response = await api.post(
    `/institutes/${instituteId}/memberships`,
    {
      userId: data.userId,
      role: data.role,
    }
  );

  return response.data;
};

export const getInstituteMembershipById = async (
  instituteId,
  membershipId
) => {
  const response = await api.get(
    `/institutes/${instituteId}/memberships/${membershipId}`
  );

  return response.data;
};

export const updateInstituteMembership = async (
  instituteId,
  membershipId,
  data
) => {
  const response = await api.patch(
    `/institutes/${instituteId}/memberships/${membershipId}`,
    data
  );

  return response.data;
};

 
// STUDENT INVITATIONS
 

export const getStudentInvitations = async (
  instituteId,
  params = {}
) => {
  const response = await api.get(
    `/institutes/${instituteId}/student-invitations`,
    { params }
  );

  return response.data;
};

export const createStudentInvitation = async (
  instituteId,
  data
) => {
  const response = await api.post(
    `/institutes/${instituteId}/student-invitations`,
    {
      email: data.email,
      name: data.name,
      phone: data.phone,
    }
  );

  return response.data;
};

export const createBulkStudentInvitations = async (
  instituteId,
  students
) => {
  const response = await api.post(
    `/institutes/${instituteId}/student-invitations/bulk`,
    { students }
  );

  return response.data;
};

export const resendStudentInvitation = async (
  instituteId,
  invitationId
) => {
  const response = await api.post(
    `/institutes/${instituteId}/student-invitations/${invitationId}/resend`
  );

  return response.data;
};

export const cancelStudentInvitation = async (
  instituteId,
  invitationId
) => {
  const response = await api.patch(
    `/institutes/${instituteId}/student-invitations/${invitationId}/cancel`
  );

  return response.data;
};

export const approveStudentInvitation = async (
  instituteId,
  invitationId
) => {
  const response = await api.patch(
    `/institutes/${instituteId}/student-invitations/${invitationId}/approve`
  );

  return response.data;
};

export const rejectStudentInvitation = async (
  instituteId,
  invitationId
) => {
  const response = await api.patch(
    `/institutes/${instituteId}/student-invitations/${invitationId}/reject`
  );

  return response.data;
};