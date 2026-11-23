import api from "../../api/axiosInstance";

// ==================================================
// PLANS
// ==================================================

export const listPublicPlans = async (params = {}) => {
  const response = await api.get("/plans", { params });
  return response.data;
};

export const getPublicPlanByCode = async (code) => {
  const response = await api.get(
    `/plans/${encodeURIComponent(code)}`
  );
  return response.data;
};

export const listAdminPlans = async (params = {}) => {
  const response = await api.get("/plans/admin", { params });
  return response.data;
};

export const getAdminPlanById = async (planId) => {
  const response = await api.get(`/plans/admin/${planId}`);
  return response.data;
};

export const createPlan = async (payload) => {
  const response = await api.post("/plans/admin", payload);
  return response.data;
};

export const updatePlan = async (planId, payload) => {
  const response = await api.patch(
    `/plans/admin/${planId}`,
    payload
  );
  return response.data;
};

export const updatePlanStatus = async (planId, isActive) => {
  const response = await api.patch(
    `/plans/admin/${planId}/status`,
    { isActive }
  );
  return response.data;
};

export const createPlanVersion = async (planId, payload) => {
  const response = await api.post(
    `/plans/admin/${planId}/versions`,
    payload
  );
  return response.data;
};

// ==================================================
// PAYMENTS
// ==================================================

export const getPaymentHistory = async (params = {}) => {
  const response = await api.get("/payments/history", {
    params,
  });
  return response.data;
};

export const getPaymentById = async (paymentId) => {
  const response = await api.get(`/payments/${paymentId}`);
  return response.data;
};

export const createRefund = async (paymentId, payload) => {
  const response = await api.post(
    `/payments/${paymentId}/refund`,
    payload
  );
  return response.data;
};

// ==================================================
// INVOICES
// ==================================================

export const getInvoices = async (params = {}) => {
  const response = await api.get("/invoices", { params });
  return response.data;
};

export const getInvoiceById = async (invoiceId) => {
  const response = await api.get(`/invoices/${invoiceId}`);
  return response.data;
};

export const downloadInvoice = async (invoiceId) => {
  const response = await api.get(
    `/invoices/${invoiceId}/download`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};
