
import { getToken } from "../authService";

const BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

const enc = (value) => encodeURIComponent(String(value));

function institutePath(suffix) {
  const instituteId =
    localStorage.getItem("equilx_institute_id") ||
    import.meta.env.VITE_INSTITUTE_ID;

  if (!instituteId) {
    throw new Error("Institute ID missing. Select an institute first.");
  }

  return `/${enc(instituteId)}${suffix}`;
}

async function request(path, { method = "GET", body } = {}) {
  const token = getToken();
  if (!token) throw new Error("Login session missing. Please log in.");

  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      credentials: "include",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(body !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error("Unable to connect to the messaging server.");
  }

  const json = await response.json().catch(() => ({}));

  if (!response.ok || json.success === false) {
    throw new Error(
      json.message ||
      json.error?.message ||
      `Request failed (${response.status})`
    );
  }

  return json.data ?? json;
}

function ensureItems(result, label) {
  if (!Array.isArray(result?.items)) {
    throw new Error(`Invalid ${label} API response: items missing.`);
  }
  return result.items;
}

function getDisplayName(user) {
  return (
    user?.profile?.name ||
    user?.name ||
    user?.email ||
    "Unknown User"
  );
}

export function normalizeConversation(item, currentUserId = "") {
  const participants = (item.participants || [])
    .filter((participant) => !participant.leftAt)
    .map((participant) => ({
      id: participant.userId || participant.user?.id,
      name: getDisplayName(participant.user),
      email: participant.user?.email || "",
      role: participant.role || "",
    }));

  const others = participants.filter(
    (participant) => participant.id !== currentUserId
  );

  const type = String(item.type || "").toUpperCase();
  const isGroup =
    type.includes("GROUP") ||
    type.includes("BATCH") ||
    type.includes("INSTITUTE");

  const lastMessage = item.messages?.[0] || null;

  return {
    id: item.id,
    type: isGroup ? "group" : "direct",
    rawType: item.type,
    name: isGroup
      ? item.title || "Unnamed Group"
      : others.map((participant) => participant.name).join(", ") ||
        item.title ||
        "Direct Conversation",
    batch: item.batch?.name || "",
    batchId: item.batchId || "",
    participants,
    participantCount: participants.length,
    lastMessage: lastMessage?.content || "",
    lastMessageAt: lastMessage?.createdAt || item.updatedAt || null,
    lastMessageId: lastMessage?.id || null,
    status: item.status || "ACTIVE",
    unread: null,
    online: null,
    pinned: false,
  };
}

export function normalizeMessage(item, currentUserId = "") {
  return {
    id: item.id,
    conversationId: item.conversationId,
    senderId: item.senderId,
    senderName: getDisplayName(item.sender),
    mine: Boolean(currentUserId && item.senderId === currentUserId),
    text: item.content || "",
    createdAt: item.createdAt || null,
    editedAt: item.editedAt || null,
    deletedAt: item.deletedAt || null,
    status: item.status || "",
    attachments: Array.isArray(item.attachments)
      ? item.attachments
      : [],
  };
}

const service = {
  async listConversations({
    page = 1,
    limit = 100,
    status = "ACTIVE",
    search = "",
  } = {}) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (status) params.set("status", status);
    if (search.trim()) params.set("search", search.trim());

    return request(institutePath(`/conversations?${params}`));
  },

  async getAllConversations(currentUserId = "", status = "") {
    const all = [];
    let complete = false;

    for (let page = 1; page <= 100; page++) {
      const data = await this.listConversations({
        page,
        limit: 100,
        status,
      });

      const rows = ensureItems(data, "conversations");
      all.push(...rows);

      const pages = Number(data.pagination?.totalPages);

      if (
        rows.length === 0 ||
        (Number.isFinite(pages) && page >= pages) ||
        (!Number.isFinite(pages) && rows.length < 100)
      ) {
        complete = true;
        break;
      }
    }

    return {
      conversations: all.map((item) =>
        normalizeConversation(item, currentUserId)
      ),
      complete,
    };
  },

  getConversation(id) {
    return request(institutePath(`/conversations/${enc(id)}`));
  },

  createDirect(recipientUserId) {
    return request(institutePath("/conversations/direct"), {
      method: "POST",
      body: { recipientUserId },
    });
  },

  createGroup({ title, batchId = null, participantIds }) {
    return request(institutePath("/conversations/groups"), {
      method: "POST",
      body: {
        title: title.trim(),
        batchId: batchId || null,
        participantIds: [...new Set(participantIds)],
      },
    });
  },

  updateConversation(id, title) {
    return request(institutePath(`/conversations/${enc(id)}`), {
      method: "PATCH",
      body: { title: title.trim() },
    });
  },

  addParticipants(id, userIds) {
    return request(
      institutePath(`/conversations/${enc(id)}/participants`),
      {
        method: "POST",
        body: { userIds },
      }
    );
  },

  removeParticipant(id, userId) {
    return request(
      institutePath(
        `/conversations/${enc(id)}/participants/${enc(userId)}`
      ),
      { method: "DELETE" }
    );
  },

  archiveConversation(id) {
    return request(
      institutePath(`/conversations/${enc(id)}/archive`),
      { method: "POST" }
    );
  },

  listMessages(id, { limit = 50, beforeId } = {}) {
    const params = new URLSearchParams({
      limit: String(limit),
    });

    if (beforeId) params.set("beforeId", beforeId);

    return request(
      institutePath(
        `/conversations/${enc(id)}/messages?${params}`
      )
    );
  },

  async getMessages(id, currentUserId, options = {}) {
    const result = await this.listMessages(id, options);

    return {
      messages: ensureItems(result, "messages").map((item) =>
        normalizeMessage(item, currentUserId)
      ),
      hasMore: Boolean(result.pagination?.hasMore),
      nextCursor: result.pagination?.nextCursor || null,
    };
  },

  sendMessage(id, content) {
    const clientMessageId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : null;

    if (!clientMessageId) {
      throw new Error("Secure message ID generation unavailable.");
    }

    return request(
      institutePath(`/conversations/${enc(id)}/messages`),
      {
        method: "POST",
        body: {
          content: content.trim(),
          clientMessageId,
        },
      }
    );
  },

  editMessage(conversationId, messageId, content) {
    return request(
      institutePath(
        `/conversations/${enc(conversationId)}/messages/${enc(messageId)}`
      ),
      {
        method: "PATCH",
        body: { content: content.trim() },
      }
    );
  },

  deleteMessage(conversationId, messageId) {
    return request(
      institutePath(
        `/conversations/${enc(conversationId)}/messages/${enc(messageId)}`
      ),
      { method: "DELETE" }
    );
  },

  markRead(id, lastMessageId) {
    return request(
      institutePath(`/conversations/${enc(id)}/read`),
      {
        method: "POST",
        body: lastMessageId ? { lastMessageId } : {},
      }
    );
  },

  listBatches(page = 1) {
    return request(
      institutePath(`/batches?page=${page}&limit=100`)
    );
  },

  listBatchMembers(batchId, page = 1) {
    return request(
      institutePath(
        `/batches/${enc(batchId)}/members?page=${page}&limit=100`
      )
    );
  },

  async getRecipients() {
    const batches = [];
    const students = new Map();
    const errors = [];

    for (let page = 1; page <= 100; page++) {
      const data = await this.listBatches(page);
      const rows = ensureItems(
        { items: data.batches || data.items },
        "batches"
      );

      batches.push(...rows);

      const pages = Number(data.pagination?.totalPages);
      if (
        rows.length === 0 ||
        (Number.isFinite(pages) && page >= pages) ||
        (!Number.isFinite(pages) && rows.length < 100)
      ) {
        break;
      }
    }

    const results = await Promise.allSettled(
      batches.map(async (batch) => {
        const members = [];

        for (let page = 1; page <= 100; page++) {
          const data = await this.listBatchMembers(batch.id, page);
          const rows = data.members || data.items || [];

          if (!Array.isArray(rows)) {
            throw new Error("Invalid batch members response.");
          }

          members.push(...rows);

          const pages = Number(data.pagination?.totalPages);
          if (
            rows.length === 0 ||
            (Number.isFinite(pages) && page >= pages) ||
            (!Number.isFinite(pages) && rows.length < 100)
          ) {
            break;
          }
        }

        return { batch, members };
      })
    );

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        errors.push(
          `${batches[index].name}: ${result.reason.message}`
        );
        return;
      }

      const { batch, members } = result.value;

      members.forEach((member) => {
        const user = member.user || member.student || {};
        const id = member.userId || member.studentId || user.id;

        if (!id) return;

        if (!students.has(id)) {
          students.set(id, {
            id,
            name: getDisplayName(user),
            email: user.email || "",
            batches: [],
          });
        }

        const student = students.get(id);

        if (!student.batches.some((item) => item.id === batch.id)) {
          student.batches.push({
            id: batch.id,
            name: batch.name,
          });
        }
      });
    });

    return {
      students: [...students.values()],
      batches,
      errors,
    };
  },
};

export default service;
