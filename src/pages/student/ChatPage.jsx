
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "./StudentLayout";
import chatService from "../../services/chatService";
import {
  Search,
  Plus,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  ChevronLeft,
  Check,
  CheckCheck,
  MessageCircle,
  Users,
  Headphones,
  BookOpen,
  Clock,
  Image,
  FileText,
  X,
  ArrowDown,
  Sparkles,
  Circle,
  Mic,
  Trash2,
  Pin,
  Archive,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const INSTITUTE_ID = import.meta.env.VITE_INSTITUTE_ID || "";

const unwrap = (response) => response?.data ?? response ?? {};

const getName = (participant) =>
  participant?.user?.profile?.name ||
  participant?.user?.name ||
  participant?.user?.email ||
  "Conversation member";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getTime = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getLastMessage = (conversation) =>
  conversation?.messages?.[0] || null;

const getOtherParticipant = (conversation) => {
  const participants = conversation?.participants || [];

  return (
    participants.find((participant) => participant.role !== "ADMIN") ||
    participants[0]
  );
};

const getConversationName = (conversation) => {
  if (conversation?.title) return conversation.title;

  const other = getOtherParticipant(conversation);

  return other ? getName(other) : "Conversation";
};

const getMessageText = (message) => {
  if (message?.status === "DELETED" || message?.deletedAt) {
    return "This message was deleted.";
  }

  return message?.content || "";
};

const getError = (error) =>
  error?.message || "Something went wrong. Please try again.";

const quickReplies = [
  "Thank you!",
  "Can you explain this?",
  "I'll practise today.",
];

export default function ChatPage() {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  const [activeId, setActiveId] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [showContactMenu, setShowContactMenu] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatType, setNewChatType] = useState("direct");
  const [recipientUserId, setRecipientUserId] = useState("");
  const [groupTitle, setGroupTitle] = useState("");
  const [participantIds, setParticipantIds] = useState("");

  const [attachmentMenu, setAttachmentMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [creating, setCreating] = useState(false);

  const [pagination, setPagination] = useState(null);
  const [loadingOlder, setLoadingOlder] = useState(false);

  const [editingMessageId, setEditingMessageId] = useState("");
  const [editingText, setEditingText] = useState("");

  const messageEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeId
  );

  const currentUserId = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("equilx_user") || "null");
      return user?.id || "";
    } catch {
      return "";
    }
  }, []);

  const loadConversations = useCallback(async () => {
    if (!INSTITUTE_ID) {
      setError("Institute ID missing. Add VITE_INSTITUTE_ID to your frontend .env file.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await chatService.getConversations(INSTITUTE_ID, {
        page: 1,
        limit: 50,
        search: search.trim() || undefined,
        status: "ACTIVE",
      });

      const payload = unwrap(response);
      const items = Array.isArray(payload.items) ? payload.items : [];

      setConversations(items);

      if (activeId && !items.some((item) => item.id === activeId)) {
        setActiveId("");
        setMessages([]);
      }
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  }, [activeId, search]);

  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;

    setMessagesLoading(true);
    setError("");

    try {
      const response = await chatService.getMessages(
        INSTITUTE_ID,
        conversationId,
        { limit: 50 }
      );

      const payload = unwrap(response);
      const items = Array.isArray(payload.items) ? payload.items : [];

      setMessages(items);
      setPagination(payload.pagination || null);

      const lastMessage = items[items.length - 1];

      await chatService.markRead(
        INSTITUTE_ID,
        conversationId,
        lastMessage?.id
      );

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                unreadCount: 0,
              }
            : conversation
        )
      );
    } catch (err) {
      setError(getError(err));
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (activeId) {
      loadMessages(activeId);
    }
  }, [activeId, loadMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages.length]);

  const openConversation = (id) => {
    setActiveId(id);
    setMobileChatOpen(true);
    setShowContactMenu(false);
    setEditingMessageId("");
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    const content = message.trim();

    if (!content || !activeId || sending) return;

    setSending(true);
    setError("");
    setNotice("");

    try {
      const clientMessageId = crypto.randomUUID();

      const response = await chatService.sendMessage(
        INSTITUTE_ID,
        activeId,
        content,
        clientMessageId
      );

      const savedMessage = unwrap(response);

      if (savedMessage?.id) {
        setMessages((previous) => {
          if (previous.some((item) => item.id === savedMessage.id)) {
            return previous;
          }

          return [...previous, savedMessage];
        });
      } else {
        await loadMessages(activeId);
      }

      setMessage("");
      setAttachmentMenu(false);
      await loadConversations();
    } catch (err) {
      setError(getError(err));
    } finally {
      setSending(false);
    }
  };

  const createConversation = async (event) => {
    event.preventDefault();

    setCreating(true);
    setError("");
    setNotice("");

    try {
      let response;

      if (newChatType === "direct") {
        const recipient = recipientUserId.trim();

        if (!recipient) {
          throw new Error("Enter the actual recipient user ID.");
        }

        response = await chatService.createDirectConversation(
          INSTITUTE_ID,
          recipient
        );
      } else {
        const ids = participantIds
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);

        if (!groupTitle.trim() || !ids.length) {
          throw new Error("Enter a group title and at least one participant user ID.");
        }

        response = await chatService.createGroupConversation(
          INSTITUTE_ID,
          {
            title: groupTitle.trim(),
            participantIds: ids,
          }
        );
      }

      const created = unwrap(response);

      if (!created?.id) {
        throw new Error("Backend did not return the created conversation.");
      }

      setShowNewChat(false);
      setRecipientUserId("");
      setGroupTitle("");
      setParticipantIds("");

      await loadConversations();

      setActiveId(created.id);
      setMobileChatOpen(true);
      setNotice("Conversation created successfully.");
    } catch (err) {
      setError(getError(err));
    } finally {
      setCreating(false);
    }
  };

  const archiveConversation = async () => {
    if (!activeId) return;

    setError("");

    try {
      await chatService.archiveConversation(INSTITUTE_ID, activeId);

      setConversations((previous) =>
        previous.filter((conversation) => conversation.id !== activeId)
      );

      setActiveId("");
      setMessages([]);
      setMobileChatOpen(false);
      setShowContactMenu(false);
      setNotice("Conversation archived successfully.");
    } catch (err) {
      setError(getError(err));
    }
  };

  const startEditing = (item) => {
    setEditingMessageId(item.id);
    setEditingText(item.content || "");
  };

  const saveEditedMessage = async (event) => {
    event.preventDefault();

    if (!editingMessageId || !editingText.trim() || !activeId) return;

    try {
      const response = await chatService.editMessage(
        INSTITUTE_ID,
        activeId,
        editingMessageId,
        editingText.trim()
      );

      const updated = unwrap(response);

      setMessages((previous) =>
        previous.map((item) =>
          item.id === editingMessageId ? updated : item
        )
      );

      setEditingMessageId("");
      setEditingText("");
      setNotice("Message updated successfully.");
    } catch (err) {
      setError(getError(err));
    }
  };

  const deleteMessage = async (messageId) => {
    if (!activeId) return;

    try {
      await chatService.deleteMessage(INSTITUTE_ID, activeId, messageId);

      setMessages((previous) =>
        previous.map((item) =>
          item.id === messageId
            ? { ...item, content: "", status: "DELETED" }
            : item
        )
      );

      setNotice("Message deleted successfully.");
    } catch (err) {
      setError(getError(err));
    }
  };

  const loadOlderMessages = async () => {
    if (!activeId || !pagination?.hasMore || !pagination?.nextCursor) return;

    setLoadingOlder(true);

    try {
      const response = await chatService.getMessages(
        INSTITUTE_ID,
        activeId,
        {
          limit: 50,
          beforeId: pagination.nextCursor,
        }
      );

      const payload = unwrap(response);
      const older = Array.isArray(payload.items) ? payload.items : [];

      setMessages((previous) => {
        const ids = new Set(previous.map((item) => item.id));
        return [...older.filter((item) => !ids.has(item.id)), ...previous];
      });

      setPagination(payload.pagination || null);
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoadingOlder(false);
    }
  };

  const handleQuickReply = (reply) => {
    setMessage(reply);
    messageInputRef.current?.focus();
  };

  const handleAttachment = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setNotice(
        "File attachment upload is not implemented in the inspected backend chat routes. The file has not been sent."
      );
    }

    event.target.value = "";
    setAttachmentMenu(false);
  };

  const filteredConversations = conversations.filter((conversation) => {
    const name = getConversationName(conversation).toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase());

    if (filter === "Pinned") return false;

    if (filter === "Unread") {
      return matchesSearch && Number(conversation.unreadCount || 0) > 0;
    }

    return matchesSearch;
  });

  const totalUnread = conversations.reduce(
    (total, conversation) =>
      total + Number(conversation.unreadCount || 0),
    0
  );

  const onlineCount = 0;

  const contactList = (
    <aside className="flex h-full min-h-0 flex-col bg-white dark:bg-[#211e27]">
      <div className="border-b border-[#E7ECF6] p-4 dark:border-[#49333D]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[#10265F] dark:text-white">
              Messages
            </h2>
            <p className="mt-1 text-[11px] text-[#71809D]">
              Connect with your learning team
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowNewChat(true)}
            aria-label="Start a new conversation"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF2454] text-white"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="relative mt-4">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA8C2]"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-xl border border-[#E7ECF6] bg-[#F8FAFF] py-3 pl-9 pr-3 text-xs outline-none focus:border-[#FF9BAF] dark:border-[#49333D] dark:bg-[#30232B] dark:text-white"
          />
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {["All", "Unread", "Pinned"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`shrink-0 rounded-lg px-3 py-2 text-[10px] font-bold ${
                filter === item
                  ? "bg-[#10265F] text-white"
                  : "border border-[#E7ECF6] text-[#71809D] dark:border-[#49333D]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 size={24} className="mx-auto animate-spin text-[#FF2454]" />
            <p className="mt-3 text-xs text-[#71809D]">
              Loading conversations...
            </p>
          </div>
        ) : filteredConversations.length ? (
          filteredConversations.map((conversation) => {
            const lastMessage = getLastMessage(conversation);
            const selected = conversation.id === activeId;
            const name = getConversationName(conversation);
            const unread = Number(conversation.unreadCount || 0);

            return (
              <button
                type="button"
                key={conversation.id}
                onClick={() => openConversation(conversation.id)}
                className={`flex w-full items-start gap-3 border-b border-[#F0F2F9] px-4 py-4 text-left transition dark:border-[#49333D] ${
                  selected
                    ? "border-l-[3px] border-l-[#FF2454] bg-[#FFF7F9] dark:bg-[#30232B]"
                    : "border-l-[3px] border-l-transparent hover:bg-[#F8FAFF] dark:hover:bg-[#30232B]"
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E9EDFF] text-xs font-black text-[#3449A8]">
                  {getInitials(name)}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-extrabold text-[#10265F] dark:text-white">
                      {name}
                    </span>
                    <span className="shrink-0 text-[9px] text-[#9AA8C2]">
                      {getTime(lastMessage?.createdAt)}
                    </span>
                  </span>

                  <span className="mt-1 block text-[10px] text-[#9AA8C2]">
                    {conversation.type || "Conversation"}
                  </span>

                  <span className="mt-2 flex items-center justify-between gap-2">
                    <span className="truncate text-[11px] text-[#71809D]">
                      {lastMessage?.content || "No messages yet"}
                    </span>
                    {unread > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF2454] px-1 text-[9px] font-bold text-white">
                        {unread}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            );
          })
        ) : (
          <div className="p-6 text-center">
            <MessageCircle size={26} className="mx-auto text-[#C0CBE0]" />
            <p className="mt-3 text-xs font-bold text-[#506995] dark:text-white">
              No conversations found
            </p>
            <p className="mt-1 text-[10px] text-[#9AA8C2]">
              Start a new conversation with an institute member.
            </p>
          </div>
        )}
      </div>
    </aside>
  );

  const conversationPanel = (
    <section className="flex h-full min-h-0 flex-col bg-[#F8FAFF] dark:bg-[#171419]">
      {activeConversation ? (
        <>
          <header className="flex min-h-[76px] items-center justify-between gap-3 border-b border-[#E7ECF6] bg-white px-4 py-3 dark:border-[#49333D] dark:bg-[#211e27] sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileChatOpen(false)}
                className="rounded-lg p-2 text-[#71809D] hover:bg-[#F5F7FF] lg:hidden"
                aria-label="Back to conversations"
              >
                <ChevronLeft size={21} />
              </button>

              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9EDFF] text-xs font-black text-[#3449A8]">
                {getInitials(getConversationName(activeConversation))}
              </span>

              <div className="min-w-0">
                <h2 className="truncate text-sm font-black text-[#10265F] dark:text-white">
                  {getConversationName(activeConversation)}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-[10px] text-[#71809D]">
                  <Circle size={7} />
                  {activeConversation.type || "Conversation"}
                </p>
              </div>
            </div>

            <div className="relative flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setNotice("Voice calling is not implemented in the backend chat routes.")
                }
                aria-label="Voice call"
                className="hidden rounded-xl p-2.5 text-[#71809D] sm:block"
              >
                <Phone size={18} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setNotice("Video calling is not implemented in the backend chat routes.")
                }
                aria-label="Video call"
                className="hidden rounded-xl p-2.5 text-[#71809D] sm:block"
              >
                <Video size={19} />
              </button>

              <button
                type="button"
                onClick={() => setShowContactMenu((previous) => !previous)}
                aria-label="Conversation options"
                className="rounded-xl p-2.5 text-[#71809D]"
              >
                <MoreVertical size={19} />
              </button>

              {showContactMenu && (
                <div className="absolute right-0 top-12 z-30 w-48 rounded-xl border border-[#E7ECF6] bg-white p-2 shadow-xl dark:border-[#49333D] dark:bg-[#211e27]">
                  <button
                    type="button"
                    onClick={archiveConversation}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#E92350] hover:bg-[#FFF0F3]"
                  >
                    <Archive size={14} />
                    Archive conversation
                  </button>
                </div>
              )}
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-5 sm:px-6">
            {pagination?.hasMore && (
              <button
                type="button"
                onClick={loadOlderMessages}
                disabled={loadingOlder}
                className="mx-auto mb-4 flex items-center gap-2 rounded-xl border border-[#E7ECF6] bg-white px-4 py-2 text-xs font-bold text-[#506995] dark:border-[#49333D] dark:bg-[#211e27] dark:text-white"
              >
                {loadingOlder ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ArrowDown size={14} />
                )}
                Load older messages
              </button>
            )}

            {messagesLoading ? (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 size={25} className="animate-spin text-[#FF2454]" />
              </div>
            ) : messages.length ? (
              messages.map((item) => {
                const mine = item.senderId === currentUserId;

                return (
                  <div
                    key={item.id}
                    className={`mb-3 flex items-end gap-2 ${
                      mine ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!mine && (
                      <span className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E9EDFF] text-[9px] font-black text-[#3449A8]">
                        {getInitials(item.sender?.profile?.name || item.sender?.email)}
                      </span>
                    )}

                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
                        mine
                          ? "rounded-br-sm bg-[#10265F] text-white"
                          : "rounded-bl-sm border border-[#E7ECF6] bg-white text-[#10265F] dark:border-[#49333D] dark:bg-[#211e27] dark:text-white"
                      }`}
                    >
                      {editingMessageId === item.id ? (
                        <form onSubmit={saveEditedMessage}>
                          <textarea
                            value={editingText}
                            onChange={(event) => setEditingText(event.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-[#E7ECF6] bg-white p-2 text-xs text-[#10265F] outline-none"
                          />
                          <div className="mt-2 flex gap-2">
                            <button
                              type="submit"
                              className="rounded-lg bg-[#FF2454] px-3 py-1.5 text-[10px] font-bold text-white"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingMessageId("")}
                              className="rounded-lg border px-3 py-1.5 text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <p className="whitespace-pre-wrap break-words text-xs leading-5">
                          {getMessageText(item)}
                        </p>
                      )}

                      <div
                        className={`mt-2 flex items-center justify-end gap-1.5 text-[9px] ${
                          mine ? "text-white/60" : "text-[#9AA8C2]"
                        }`}
                      >
                        {getTime(item.createdAt)}
                        {mine && <Check size={13} />}
                      </div>

                      {mine && item.status !== "DELETED" && !editingMessageId && (
                        <div className="mt-2 flex justify-end gap-3 text-[10px]">
                          <button
                            type="button"
                            onClick={() => startEditing(item)}
                            className="underline opacity-75"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteMessage(item.id)}
                            className="underline opacity-75"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <MessageCircle size={30} className="text-[#C0CBE0]" />
                <p className="mt-3 text-sm font-bold text-[#506995] dark:text-white">
                  No messages yet
                </p>
                <p className="mt-1 text-xs text-[#9AA8C2]">
                  Send a message to start the conversation.
                </p>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>

          <div className="border-t border-[#E7ECF6] bg-white px-3 pt-3 dark:border-[#49333D] dark:bg-[#211e27] sm:px-5">
            <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="shrink-0 text-[10px] font-bold text-[#9AA8C2]">
                Quick reply:
              </span>
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => handleQuickReply(reply)}
                  className="shrink-0 rounded-full border border-[#E7ECF6] px-3 py-1.5 text-[10px] font-semibold text-[#506995] dark:border-[#49333D] dark:text-white"
                >
                  {reply}
                </button>
              ))}
            </div>

            <form onSubmit={sendMessage} className="flex items-end gap-2 pb-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAttachmentMenu((previous) => !previous)}
                  aria-label="Add attachment"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E7ECF6] text-[#71809D] dark:border-[#49333D]"
                >
                  <Paperclip size={18} />
                </button>

                {attachmentMenu && (
                  <div className="absolute bottom-14 left-0 z-30 w-44 rounded-xl border border-[#E7ECF6] bg-white p-2 shadow-xl dark:border-[#49333D] dark:bg-[#211e27]">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#506995] hover:bg-[#F5F7FF] dark:text-white"
                    >
                      <FileText size={15} />
                      Attach a file
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNotice("Image/file upload is not available in the inspected chat backend.");
                        setAttachmentMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#506995] dark:text-white"
                    >
                      <Image size={15} />
                      Share an image
                    </button>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleAttachment}
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              />

              <div className="flex min-w-0 flex-1 items-end rounded-xl border border-[#E7ECF6] bg-[#F8FAFF] px-3 dark:border-[#49333D] dark:bg-[#30232B]">
                <textarea
                  ref={messageInputRef}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey &&
                      !event.nativeEvent.isComposing
                    ) {
                      event.preventDefault();
                      sendMessage(event);
                    }
                  }}
                  rows={1}
                  maxLength={5000}
                  placeholder="Type your message..."
                  className="max-h-28 min-h-[42px] flex-1 resize-y bg-transparent py-3 text-xs leading-5 text-[#10265F] outline-none placeholder:text-[#9AA8C2] dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => handleQuickReply("😊")}
                  aria-label="Insert smiley"
                  className="mb-1 flex h-9 w-8 shrink-0 items-center justify-center text-[#9AA8C2]"
                >
                  <Smile size={18} />
                </button>
              </div>

              <button
                type="submit"
                disabled={!message.trim() || sending}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF2454] text-white disabled:opacity-40"
              >
                {sending ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Send size={17} />
                )}
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#FF2454]">
            <MessageCircle size={30} />
          </span>
          <h2 className="mt-4 text-lg font-black text-[#10265F] dark:text-white">
            No conversation selected
          </h2>
          <p className="mt-2 max-w-xs text-xs leading-5 text-[#71809D]">
            Choose a conversation from your message list.
          </p>
          <button
            type="button"
            onClick={() => setShowNewChat(true)}
            className="mt-5 rounded-xl bg-[#FF2454] px-5 py-3 text-xs font-bold text-white"
          >
            Start a conversation
          </button>
        </div>
      )}
    </section>
  );

  return (
    <StudentLayout>
      <div className="chat-page mx-auto max-w-[1800px] space-y-5">
        <style>{`
          html.dark .chat-page { color: #FFF8FA; }
          html.dark .chat-page [class*="bg-white"] { background-color: #211e27 !important; }
          html.dark .chat-page [class*="border-[#E7ECF6]"],
          html.dark .chat-page [class*="border-[#F0F2F9]"] { border-color: #49333D !important; }
          html.dark .chat-page [class*="text-[#10265F]"],
          html.dark .chat-page [class*="text-[#506995]"] { color: #FFF8FA !important; }
          html.dark .chat-page [class*="text-[#71809D]"],
          html.dark .chat-page [class*="text-[#9AA8C2]"] { color: #C1B5C0 !important; }
          html.dark .chat-page input,
          html.dark .chat-page textarea,
          html.dark .chat-page select { color: #FFF8FA !important; background-color: #30232B; border-color: #49333D !important; }
        `}</style>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#FF2454]">
              <MessageCircle size={14} />
              Student communication
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#10265F] dark:text-white sm:text-3xl">
              Chat & Messages
            </h1>
            <p className="mt-2 text-xs leading-5 text-[#71809D]">
              Ask questions, discuss practice and stay connected with your learning team.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadConversations}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E7ECF6] bg-white px-4 py-3 text-xs font-bold text-[#506995] dark:border-[#49333D] dark:bg-[#211e27] dark:text-white"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setShowNewChat(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-xs font-bold text-white"
            >
              <Plus size={16} />
              New message
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <p className="flex-1">{error}</p>
            <button type="button" onClick={() => setError("")}>
              <X size={15} />
            </button>
          </div>
        )}

        {notice && (
          <div className="flex items-start gap-2 rounded-xl border border-[#F6D4DC] bg-[#FFF5F7] p-3 text-xs text-[#A51D42]">
            <MessageCircle size={15} className="mt-0.5 shrink-0" />
            <p className="flex-1">{notice}</p>
            <button type="button" onClick={() => setNotice("")}>
              <X size={15} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-[#E7ECF6] bg-white p-4 dark:border-[#49333D] dark:bg-[#211e27]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF2454]">
              <MessageCircle size={19} />
            </span>
            <div>
              <p className="text-xl font-black text-[#10265F] dark:text-white">
                {conversations.length}
              </p>
              <p className="text-[10px] text-[#71809D]">Conversations</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#E7ECF6] bg-white p-4 dark:border-[#49333D] dark:bg-[#211e27]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F9F1] text-[#00A879]">
              <Circle size={17} fill="currentColor" />
            </span>
            <div>
              <p className="text-xl font-black text-[#10265F] dark:text-white">
                {onlineCount}
              </p>
              <p className="text-[10px] text-[#71809D]">Online now</p>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-3 rounded-2xl border border-[#E7ECF6] bg-white p-4 dark:border-[#49333D] dark:bg-[#211e27] sm:col-span-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#1680E8]">
              <Users size={19} />
            </span>
            <div>
              <p className="text-xl font-black text-[#10265F] dark:text-white">
                {totalUnread}
              </p>
              <p className="text-[10px] text-[#71809D]">Unread messages</p>
            </div>
          </div>
        </div>

        <div className="h-[650px] overflow-hidden rounded-2xl border border-[#E7ECF6] bg-white shadow-[0_3px_14px_rgba(16,38,95,0.035)] dark:border-[#49333D] dark:bg-[#211e27]">
          <div className="grid h-full grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div
              className={`h-full min-h-0 border-r border-[#E7ECF6] dark:border-[#49333D] ${
                mobileChatOpen ? "hidden lg:block" : "block"
              }`}
            >
              {contactList}
            </div>
            <div
              className={`h-full min-h-0 ${
                mobileChatOpen ? "block" : "hidden lg:block"
              }`}
            >
              {conversationPanel}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate("/live-speaking")}
            className="flex items-center gap-4 rounded-2xl border border-[#E7ECF6] bg-white p-4 text-left transition hover:border-[#FF9BAF] hover:shadow-sm dark:border-[#49333D] dark:bg-[#211e27]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF2454]">
              <Headphones size={21} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-extrabold text-[#10265F] dark:text-white">
                Live Speaking Practice
              </span>
              <span className="mt-1 block text-[11px] text-[#71809D]">
                Improve your fluency and confidence
              </span>
            </span>
            <ChevronLeft size={18} className="rotate-180 text-[#9AA8C2]" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/study-resources")}
            className="flex items-center gap-4 rounded-2xl border border-[#E7ECF6] bg-white p-4 text-left transition hover:border-[#FF9BAF] hover:shadow-sm dark:border-[#49333D] dark:bg-[#211e27]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#1680E8]">
              <BookOpen size={21} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-extrabold text-[#10265F] dark:text-white">
                Study Resources
              </span>
              <span className="mt-1 block text-[11px] text-[#71809D]">
                Explore IELTS learning materials
              </span>
            </span>
            <ChevronLeft size={18} className="rotate-180 text-[#9AA8C2]" />
          </button>
        </div>

        {showNewChat && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#081633]/60 p-4 backdrop-blur-sm">
            <form
              onSubmit={createConversation}
              className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:bg-[#211e27] sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FF2454]">
                    Messages
                  </p>
                  <h2 className="mt-2 text-xl font-black text-[#10265F] dark:text-white">
                    New conversation
                  </h2>
                  <p className="mt-1 text-xs text-[#71809D]">
                    Create a direct or group conversation with actual institute members.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNewChat(false)}
                  className="rounded-lg p-2 text-[#71809D] hover:bg-[#F5F7FF]"
                  aria-label="Close new conversation"
                >
                  <X size={18} />
                </button>
              </div>

              <label className="mt-5 block text-xs font-bold text-[#10265F] dark:text-white">
                Conversation type
              </label>
              <select
                value={newChatType}
                onChange={(event) => setNewChatType(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[#E2E8F5] bg-white px-3 py-3 text-sm outline-none dark:border-[#49333D] dark:bg-[#30232B]"
              >
                <option value="direct">Direct conversation</option>
                <option value="group">Group conversation</option>
              </select>

              {newChatType === "direct" ? (
                <>
                  <label className="mt-4 block text-xs font-bold text-[#10265F] dark:text-white">
                    Recipient user ID
                  </label>
                  <input
                    value={recipientUserId}
                    onChange={(event) => setRecipientUserId(event.target.value)}
                    placeholder="Enter actual recipient UUID"
                    required
                    className="mt-2 w-full rounded-xl border border-[#E2E8F5] px-3 py-3 text-sm outline-none focus:border-[#FF8199] dark:border-[#49333D] dark:bg-[#30232B]"
                  />
                </>
              ) : (
                <>
                  <label className="mt-4 block text-xs font-bold text-[#10265F] dark:text-white">
                    Group title
                  </label>
                  <input
                    value={groupTitle}
                    onChange={(event) => setGroupTitle(event.target.value)}
                    placeholder="Enter group title"
                    required
                    maxLength={150}
                    className="mt-2 w-full rounded-xl border border-[#E2E8F5] px-3 py-3 text-sm outline-none focus:border-[#FF8199] dark:border-[#49333D] dark:bg-[#30232B]"
                  />

                  <label className="mt-4 block text-xs font-bold text-[#10265F] dark:text-white">
                    Participant user IDs
                  </label>
                  <textarea
                    value={participantIds}
                    onChange={(event) => setParticipantIds(event.target.value)}
                    placeholder="Enter UUIDs separated by commas"
                    required
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-[#E2E8F5] px-3 py-3 text-sm outline-none focus:border-[#FF8199] dark:border-[#49333D] dark:bg-[#30232B]"
                  />
                </>
              )}

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewChat(false)}
                  className="flex-1 rounded-xl border border-[#E2E8F5] px-4 py-3 text-sm font-bold text-[#506995] dark:border-[#49333D] dark:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  {creating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}
                  Create chat
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
