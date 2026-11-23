import axiosInstance from "../../api/axiosInstance";

const crmBase = (instituteId) =>
  `/institutes/${instituteId}/crm`;

const crmService = {
  // Leads
  async getLeads(instituteId, params = {}) {
    const response = await axiosInstance.get(
      `${crmBase(instituteId)}/leads`,
      { params }
    );
    return response.data;
  },

  async getLeadById(instituteId, leadId) {
    const response = await axiosInstance.get(
      `${crmBase(instituteId)}/leads/${leadId}`
    );
    return response.data;
  },

  async createLead(instituteId, leadData) {
    const response = await axiosInstance.post(
      `${crmBase(instituteId)}/leads`,
      leadData
    );
    return response.data;
  },

  async updateLead(instituteId, leadId, leadData) {
    const response = await axiosInstance.patch(
      `${crmBase(instituteId)}/leads/${leadId}`,
      leadData
    );
    return response.data;
  },

  async deleteLead(instituteId, leadId) {
    const response = await axiosInstance.delete(
      `${crmBase(instituteId)}/leads/${leadId}`
    );
    return response.data;
  },

  // Lead status and history
  async updateLeadStatus(instituteId, leadId, status, reason) {
    const response = await axiosInstance.patch(
      `${crmBase(instituteId)}/leads/${leadId}/status`,
      { status, ...(reason ? { reason } : {}) }
    );
    return response.data;
  },

  async getLeadStatusHistory(instituteId, leadId) {
    const response = await axiosInstance.get(
      `${crmBase(instituteId)}/leads/${leadId}/status-history`
    );
    return response.data;
  },

  // Lead assignment
  async getAssignableUsers(instituteId) {
    const response = await axiosInstance.get(
      `${crmBase(instituteId)}/leads/assignable-users`
    );
    return response.data;
  },

  async assignLead(instituteId, leadId, assignedToId, note) {
    const response = await axiosInstance.patch(
      `${crmBase(instituteId)}/leads/${leadId}/assignment`,
      {
        assignedToId,
        ...(note ? { note } : {}),
      }
    );
    return response.data;
  },

  async getLeadAssignmentHistory(instituteId, leadId) {
    const response = await axiosInstance.get(
      `${crmBase(instituteId)}/leads/${leadId}/assignment-history`
    );
    return response.data;
  },

  // Follow-ups
  async createFollowUp(instituteId, leadId, followUpData) {
    const response = await axiosInstance.post(
      `${crmBase(instituteId)}/leads/${leadId}/follow-ups`,
      followUpData
    );
    return response.data;
  },

  async getFollowUps(instituteId, params = {}) {
    const response = await axiosInstance.get(
      `${crmBase(instituteId)}/follow-ups`,
      { params }
    );
    return response.data;
  },

  async completeFollowUp(instituteId, followUpId) {
    const response = await axiosInstance.patch(
      `${crmBase(instituteId)}/follow-ups/${followUpId}/complete`
    );
    return response.data;
  },

  async cancelFollowUp(instituteId, followUpId) {
    const response = await axiosInstance.patch(
      `${crmBase(instituteId)}/follow-ups/${followUpId}/cancel`
    );
    return response.data;
  },

  // Lead activities
  async createActivity(instituteId, leadId, activityData) {
    const response = await axiosInstance.post(
      `${crmBase(instituteId)}/leads/${leadId}/activities`,
      activityData
    );
    return response.data;
  },

  async getLeadActivities(instituteId, leadId, params = {}) {
    const response = await axiosInstance.get(
      `${crmBase(instituteId)}/leads/${leadId}/activities`,
      { params }
    );
    return response.data;
  },

  // Lead sources
  async getLeadSources(instituteId) {
    const response = await axiosInstance.get(
      `${crmBase(instituteId)}/lead-sources`
    );
    return response.data;
  },

  async createLeadSource(instituteId, name) {
    const response = await axiosInstance.post(
      `${crmBase(instituteId)}/lead-sources`,
      { name }
    );
    return response.data;
  },

  async updateLeadSource(instituteId, sourceId, sourceData) {
    const response = await axiosInstance.patch(
      `${crmBase(instituteId)}/lead-sources/${sourceId}`,
      sourceData
    );
    return response.data;
  },

  // CSV import/export
  async exportLeads(instituteId) {
    const response = await axiosInstance.get(
      `${crmBase(instituteId)}/leads/export`,
      { responseType: "blob" }
    );
    return response.data;
  },

  async importLeads(instituteId, csv) {
    const response = await axiosInstance.post(
      `${crmBase(instituteId)}/leads/import`,
      { csv }
    );
    return response.data;
  },
};

export default crmService;
