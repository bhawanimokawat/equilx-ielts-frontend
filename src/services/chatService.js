
import { request } from "./authService";

const getBase = (instituteId) => {
  if (!instituteId) {
    throw new Error("Institute ID is missing. Set VITE_INSTITUTE_ID in frontend .env.");
  }

  return `/${instituteId}/conversations`;
};

const chatService = {
  getConversations: (instituteId, params = {}) => {
    const query = new URLSearchParams({
      page: String(params.page || 1),
      limit: String(params.limit || 50),
      ...(params.search ? { search: params.search } : {}),
      ...(params.status ? { status: params.status } : {}),
    });

    return request(`${getBase(instituteId)}?${query}`);
  },

  getConversation: (instituteId, conversationId) =>
    request(`${getBase(instituteId)}/${conversationId}`),

  createDirectConversation: (instituteId, recipientUserId) =>
    request(`/${instituteId}/conversations/direct`, {
      method: "POST",
      body: JSON.stringify({ recipientUserId }),
    }),

  createGroupConversation: (instituteId, payload) =>
    request(`/${instituteId}/conversations/groups`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMessages: (instituteId, conversationId, params = {}) => {
    const query = new URLSearchParams({
      limit: String(params.limit || 50),
      ...(params.beforeId ? { beforeId: params.beforeId } : {}),
    });

    return request(
      `${getBase(instituteId)}/${conversationId}/messages?${query}`
    );
  },

  sendMessage: (instituteId, conversationId, content, clientMessageId) =>
    request(`${getBase(instituteId)}/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content, clientMessageId }),
    }),

  markRead: (instituteId, conversationId, lastMessageId) =>
    request(`${getBase(instituteId)}/${conversationId}/read`, {
      method: "POST",
      body: JSON.stringify(lastMessageId ? { lastMessageId } : {}),
    }),

  editMessage: (instituteId, conversationId, messageId, content) =>
    request(
      `${getBase(instituteId)}/${conversationId}/messages/${messageId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ content }),
      }
    ),

  deleteMessage: (instituteId, conversationId, messageId) =>
    request(
      `${getBase(instituteId)}/${conversationId}/messages/${messageId}`,
      { method: "DELETE" }
    ),

  archiveConversation: (instituteId, conversationId) =>
    request(`${getBase(instituteId)}/${conversationId}/archive`, {
      method: "POST",
    }),

  updateConversation: (instituteId, conversationId, title) =>
    request(`${getBase(instituteId)}/${conversationId}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    }),
};

export default chatService;
