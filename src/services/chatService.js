
import { request } from "./authService";

/*
 * Institute Chat
 * Existing endpoints are preserved.
 */
const getBase = (instituteId) => {
  if (!instituteId) {
    throw new Error(
      "Institute ID is missing. An active institute membership is required for Institute Chat."
    );
  }

  return `/${encodeURIComponent(instituteId)}/conversations`;
};

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      query.set(key, String(value));
    }
  });

  const value = query.toString();
  return value ? `?${value}` : "";
};

const encodeId = (value, label = "ID") => {
  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return encodeURIComponent(String(value));
};

/*
 * Equilx Support Chat
 * No institute ID is required.
 */
const SUPPORT_BASE = "/support-chat/conversations";

const chatService = {
  // ============================================
  // INSTITUTE CHAT — EXISTING METHODS
  // ============================================

  getConversations: (instituteId, params = {}) => {
    const query = new URLSearchParams({
      page: String(params.page || 1),
      limit: String(params.limit || 50),
      ...(params.search
        ? { search: params.search }
        : {}),
      ...(params.status
        ? { status: params.status }
        : {}),
    });

    return request(`${getBase(instituteId)}?${query}`);
  },

  getConversation: (instituteId, conversationId) =>
    request(
      `${getBase(instituteId)}/${encodeId(
        conversationId,
        "Conversation ID"
      )}`
    ),

  createDirectConversation: (
    instituteId,
    recipientUserId
  ) =>
    request(`${getBase(instituteId)}/direct`, {
      method: "POST",
      body: JSON.stringify({ recipientUserId }),
    }),

  createGroupConversation: (instituteId, payload) =>
    request(`${getBase(instituteId)}/groups`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMessages: (
    instituteId,
    conversationId,
    params = {}
  ) => {
    const query = new URLSearchParams({
      limit: String(params.limit || 50),
      ...(params.beforeId
        ? { beforeId: params.beforeId }
        : {}),
    });

    return request(
      `${getBase(instituteId)}/${encodeId(
        conversationId,
        "Conversation ID"
      )}/messages?${query}`
    );
  },

  sendMessage: (
    instituteId,
    conversationId,
    content,
    clientMessageId
  ) =>
    request(
      `${getBase(instituteId)}/${encodeId(
        conversationId,
        "Conversation ID"
      )}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          content,
          clientMessageId,
        }),
      }
    ),

  markRead: (
    instituteId,
    conversationId,
    lastMessageId
  ) =>
    request(
      `${getBase(instituteId)}/${encodeId(
        conversationId,
        "Conversation ID"
      )}/read`,
      {
        method: "POST",
        body: JSON.stringify(
          lastMessageId ? { lastMessageId } : {}
        ),
      }
    ),

  editMessage: (
    instituteId,
    conversationId,
    messageId,
    content
  ) =>
    request(
      `${getBase(instituteId)}/${encodeId(
        conversationId,
        "Conversation ID"
      )}/messages/${encodeId(messageId, "Message ID")}`,
      {
        method: "PATCH",
        body: JSON.stringify({ content }),
      }
    ),

  deleteMessage: (
    instituteId,
    conversationId,
    messageId
  ) =>
    request(
      `${getBase(instituteId)}/${encodeId(
        conversationId,
        "Conversation ID"
      )}/messages/${encodeId(messageId, "Message ID")}`,
      {
        method: "DELETE",
      }
    ),

  archiveConversation: (
    instituteId,
    conversationId
  ) =>
    request(
      `${getBase(instituteId)}/${encodeId(
        conversationId,
        "Conversation ID"
      )}/archive`,
      {
        method: "POST",
      }
    ),

  updateConversation: (
    instituteId,
    conversationId,
    title
  ) =>
    request(
      `${getBase(instituteId)}/${encodeId(
        conversationId,
        "Conversation ID"
      )}`,
      {
        method: "PATCH",
        body: JSON.stringify({ title }),
      }
    ),

  // ============================================
  // EQUILX SUPPORT CHAT — NEW METHODS
  // ============================================

  getSupportConversations: (params = {}) =>
    request(
      `${SUPPORT_BASE}${buildQuery(params)}`
    ),

  createSupportConversation: (payload = {}) =>
    request(SUPPORT_BASE, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getSupportConversation: (conversationId) =>
    request(
      `${SUPPORT_BASE}/${encodeId(
        conversationId,
        "Support conversation ID"
      )}`
    ),

  getSupportMessages: (
    conversationId,
    params = {}
  ) =>
    request(
      `${SUPPORT_BASE}/${encodeId(
        conversationId,
        "Support conversation ID"
      )}/messages${buildQuery(params)}`
    ),

  sendSupportMessage: (conversationId, content) =>
    request(
      `${SUPPORT_BASE}/${encodeId(
        conversationId,
        "Support conversation ID"
      )}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ content }),
      }
    ),

  closeSupportConversation: (conversationId) =>
    request(
      `${SUPPORT_BASE}/${encodeId(
        conversationId,
        "Support conversation ID"
      )}/close`,
      {
        method: "PATCH",
      }
    ),
};

export default chatService;
