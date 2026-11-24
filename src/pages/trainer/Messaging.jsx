
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Search, Send, Paperclip, Smile, Phone, Video, Info,
  MessageCircle, Users, Plus, CheckCheck, ArrowLeft,
  X, UserRound, Bell, Pin, RefreshCw, LoaderCircle,
  MoreVertical, Pencil, Trash2, Archive, Check,
  AlertCircle, ChevronDown, MessageSquare, Save,
} from "lucide-react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import messagingService from "../../services/Trainer/messagingService.js";

const BORDER = "border-gray-100 dark:border-[#3B3441]";
const MUTED = "text-gray-500 dark:text-[#B0A5BD]";
const PINK = "bg-[#FF2454] text-white hover:bg-[#e91d49]";

const INPUT =
  "w-full rounded-xl border border-gray-200 bg-gray-50 " +
  "px-4 py-3 text-sm outline-none focus:border-blue-400 " +
  "dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white";

function getCurrentUserId() {
  const possibleKeys = [
    "equilx_user",
    "user",
    "auth_user",
  ];

  for (const key of possibleKeys) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      const id = value?.id || value?.user?.id;
      if (id) return String(id);
    } catch {
      // Ignore unavailable or malformed local profile data.
    }
  }

  return localStorage.getItem("equilx_user_id") || "";
}

function initials(name) {
  return String(name || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function timeText(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function dateText(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Avatar({ name, group = false, size = "md" }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full
        font-bold ${
          size === "lg"
            ? "h-14 w-14 text-lg"
            : "h-11 w-11 text-sm"
        } ${
          group
            ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
            : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
        }`}
    >
      {group ? <Users size={size === "lg" ? 25 : 20} /> : initials(name)}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center
        justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[90vh] w-full max-w-lg overflow-y-auto
          rounded-2xl border ${BORDER} bg-white shadow-2xl
          dark:bg-[#211E27]`}
      >
        <div
          className={`sticky top-0 z-10 flex items-center
            justify-between border-b ${BORDER} bg-white
            px-5 py-4 dark:bg-[#211E27]`}
        >
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 hover:bg-gray-100
              dark:hover:bg-[#393441]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="group relative isolate h-full pb-2">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0
          bottom-0 top-2 rounded-2xl bg-pink-100 opacity-0
          transition-opacity duration-300 group-hover:opacity-100
          dark:bg-[#4A2538]"
      />
      <div
        className={`relative z-10 flex h-full min-h-[135px]
          items-center gap-4 rounded-2xl border ${BORDER}
          bg-white p-5 shadow-sm transition-transform duration-300
          group-hover:-translate-y-1.5 dark:bg-[#211E27]`}
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center
            justify-center rounded-xl ${color}`}
        >
          <Icon size={22} />
        </div>
        <div className="min-w-0">
          <p className={`text-sm ${MUTED}`}>{title}</p>
          <p className="mt-2 text-3xl font-extrabold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon = MessageCircle, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center
      px-5 py-12 text-center"
    >
      <Icon size={35} className="text-gray-300" />
      <p className="mt-4 font-bold">{title}</p>
      <p className={`mt-2 max-w-sm text-sm leading-6 ${MUTED}`}>
        {description}
      </p>
    </div>
  );
}

export default function Messaging() {
  const [currentUserId] = useState(getCurrentUserId);

  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);

  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [chatFilter, setChatFilter] = useState("All");
  const [message, setMessage] = useState("");

  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);

  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatType, setNewChatType] = useState("direct");
  const [newChatStudent, setNewChatStudent] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupBatch, setNewGroupBatch] = useState("");
  const [groupParticipantIds, setGroupParticipantIds] = useState([]);

  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [renameTitle, setRenameTitle] = useState("");

  const [localPinnedIds, setLocalPinnedIds] = useState([]);

  const bottomRef = useRef(null);

  const selectedChat = chats.find(
    (chat) => chat.id === selectedChatId
  ) || null;

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result =
        await messagingService.getAllConversations(currentUserId);

      setChats(result.conversations);

      setSelectedChatId((previous) => {
        if (result.conversations.some((chat) => chat.id === previous)) {
          return previous;
        }
        return result.conversations[0]?.id || null;
      });

      if (!result.complete) {
        setNotice("Some conversations may not have loaded.");
      }
    } catch (err) {
      setError(err.message || "Unable to load conversations.");
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  const loadRecipients = useCallback(async () => {
    try {
      const result = await messagingService.getRecipients();
      setStudents(result.students);
      setBatches(result.batches);

      if (result.errors.length) {
        setNotice(result.errors.join(" | "));
      }
    } catch (err) {
      setNotice(
        `Student directory unavailable: ${err.message}`
      );
    }
  }, []);

  useEffect(() => {
    loadConversations();
    loadRecipients();
  }, [loadConversations, loadRecipients]);

  const loadMessages = useCallback(async (chatId) => {
    setMessagesLoading(true);
    setError("");
    setMessages([]);
    setHasMore(false);
    setNextCursor(null);

    try {
      const result = await messagingService.getMessages(
        chatId,
        currentUserId,
        { limit: 50 }
      );

      setMessages(result.messages);
      setHasMore(result.hasMore);
      setNextCursor(result.nextCursor);

      await messagingService.markRead(
        chatId,
        result.messages.at(-1)?.id
      ).catch(() => {});
    } catch (err) {
      setError(err.message || "Unable to load messages.");
    } finally {
      setMessagesLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId);
    } else {
      setMessages([]);
    }
  }, [selectedChatId, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, selectedChatId]);

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...chats]
      .filter((chat) => {
        const matchesSearch =
          !query ||
          [chat.name, chat.lastMessage, chat.batch]
            .some((value) =>
              String(value || "").toLowerCase().includes(query)
            );

        const matchesFilter =
          chatFilter === "All" ||
          (chatFilter === "Direct" && chat.type === "direct") ||
          (chatFilter === "Groups" && chat.type === "group") ||
          (chatFilter === "Unread" && (chat.unread || 0) > 0);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const aPinned = localPinnedIds.includes(a.id) ? 1 : 0;
        const bPinned = localPinnedIds.includes(b.id) ? 1 : 0;
        return bPinned - aPinned;
      });
  }, [chats, search, chatFilter, localPinnedIds]);

  const filteredStudents = useMemo(() => {
    if (!newGroupBatch) return students;

    return students.filter((student) =>
      student.batches.some((batch) => batch.id === newGroupBatch)
    );
  }, [students, newGroupBatch]);

  const submitMessage = async (event) => {
    event.preventDefault();

    const content = message.trim();
    if (!selectedChatId || !content || sending) return;

    if (content.length > 5000) {
      setError("Message must be 5000 characters or fewer.");
      return;
    }

    setSending(true);
    setError("");

    try {
      await messagingService.sendMessage(
        selectedChatId,
        content
      );

      setMessage("");
      await loadMessages(selectedChatId);
      await loadConversations();
    } catch (err) {
      setError(err.message || "Unable to send message.");
    } finally {
      setSending(false);
    }
  };

  const loadOlderMessages = async () => {
    if (!selectedChatId || !nextCursor || loadingOlder) return;

    setLoadingOlder(true);

    try {
      const result = await messagingService.getMessages(
        selectedChatId,
        currentUserId,
        { limit: 50, beforeId: nextCursor }
      );

      setMessages((previous) => {
        const ids = new Set(previous.map((item) => item.id));
        return [
          ...result.messages.filter((item) => !ids.has(item.id)),
          ...previous,
        ];
      });

      setHasMore(result.hasMore);
      setNextCursor(result.nextCursor);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingOlder(false);
    }
  };

  const selectChat = (chat) => {
    setSelectedChatId(chat.id);
    setMobileChatOpen(true);
    setShowInfo(false);
    setShowMenu(false);
    setEditingMessageId(null);
  };

  const createChat = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      let result;

      if (newChatType === "direct") {
        if (!newChatStudent) {
          throw new Error("Select a student.");
        }

        result = await messagingService.createDirect(newChatStudent);
      } else {
        if (newGroupName.trim().length < 2) {
          throw new Error("Group name must have at least 2 characters.");
        }

        if (!groupParticipantIds.length) {
          throw new Error("Select at least one group participant.");
        }

        result = await messagingService.createGroup({
          title: newGroupName.trim(),
          batchId: newGroupBatch || null,
          participantIds: groupParticipantIds,
        });
      }

      await loadConversations();

      const createdId =
        result?.id ||
        result?.conversation?.id;

      if (createdId) {
        setSelectedChatId(createdId);
        setMobileChatOpen(true);
      }

      setShowNewChat(false);
      setNewChatStudent("");
      setNewGroupName("");
      setNewGroupBatch("");
      setGroupParticipantIds([]);
      setNotice("Conversation created successfully.");
    } catch (err) {
      setError(err.message || "Unable to create conversation.");
    } finally {
      setSaving(false);
    }
  };

  const saveMessageEdit = async (id) => {
    if (!selectedChatId || !editingText.trim()) return;

    setSaving(true);
    setError("");

    try {
      await messagingService.editMessage(
        selectedChatId,
        id,
        editingText.trim()
      );

      setEditingMessageId(null);
      setEditingText("");
      await loadMessages(selectedChatId);
      await loadConversations();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!selectedChatId) return;
    if (!window.confirm("Delete this message?")) return;

    setSaving(true);
    setError("");

    try {
      await messagingService.deleteMessage(selectedChatId, id);
      await loadMessages(selectedChatId);
      await loadConversations();
      setNotice("Message deleted.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const archiveChat = async () => {
    if (!selectedChatId) return;
    if (!window.confirm("Archive this conversation?")) return;

    setSaving(true);
    setError("");

    try {
      await messagingService.archiveConversation(selectedChatId);
      setSelectedChatId(null);
      setMobileChatOpen(false);
      setShowInfo(false);
      setShowMenu(false);
      await loadConversations();
      setNotice("Conversation archived.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const renameGroup = async (event) => {
    event.preventDefault();

    if (!selectedChatId || !renameTitle.trim()) return;

    setSaving(true);
    setError("");

    try {
      await messagingService.updateConversation(
        selectedChatId,
        renameTitle
      );

      await loadConversations();
      setRenaming(false);
      setNotice("Group name updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const togglePin = () => {
    if (!selectedChatId) return;

    setLocalPinnedIds((previous) =>
      previous.includes(selectedChatId)
        ? previous.filter((id) => id !== selectedChatId)
        : [...previous, selectedChatId]
    );

    setShowMenu(false);
  };

  const toggleParticipant = (id) => {
    setGroupParticipantIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F7FF] text-[#10265F]
      transition-colors dark:bg-[#17151B] dark:text-gray-100"
    >
      <Sidebar />

      <div className="min-w-0 lg:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1600px] space-y-5 p-4 sm:p-6 lg:p-8">
          {/* HEADER */}
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className={`mb-2 text-sm ${MUTED}`}>
                Trainer Portal / Messaging
              </p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Chat & Messaging
              </h1>
              <p className={`mt-2 text-sm ${MUTED}`}>
                Communicate with students and manage batch conversations.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadConversations}
                disabled={loading}
                className={`inline-flex items-center justify-center gap-2
                  rounded-xl border ${BORDER} bg-white px-4 py-3
                  text-sm font-semibold disabled:opacity-50
                  dark:bg-[#211E27]`}
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setShowNewChat(true);
                }}
                className={`inline-flex items-center justify-center
                  gap-2 rounded-xl px-5 py-3 text-sm font-semibold ${PINK}`}
              >
                <Plus size={18} />
                New Conversation
              </button>
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl
                border border-red-200 bg-red-50 p-4 text-sm
                text-red-700 dark:bg-red-500/10 dark:text-red-300"
            >
              <AlertCircle size={18} className="shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {notice && (
            <div
              role="status"
              className="flex items-start justify-between gap-3
                rounded-xl bg-blue-50 p-4 text-sm text-blue-700
                dark:bg-blue-500/10 dark:text-blue-300"
            >
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss notice"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* THREE EQUAL SUMMARY CARDS */}
          <section className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-3">
            <StatCard
              icon={MessageCircle}
              title="Conversations"
              value={loading ? "…" : chats.length}
              color="bg-blue-50 text-blue-600 dark:bg-[#202B3B]"
            />
            <StatCard
              icon={Bell}
              title="Unread Messages"
              value="—"
              color="bg-orange-50 text-orange-600 dark:bg-[#3B3020]"
            />
            <StatCard
              icon={Users}
              title="Group Chats"
              value={
                loading
                  ? "…"
                  : chats.filter((chat) => chat.type === "group").length
              }
              color="bg-purple-50 text-purple-600 dark:bg-[#30263D]"
            />
          </section>

          {/* MESSAGING WORKSPACE */}
          <section
            className={`grid h-[min(76vh,780px)] min-h-[520px]
              grid-cols-1 overflow-hidden rounded-2xl border ${BORDER}
              bg-white shadow-sm dark:bg-[#211E27]
              md:grid-cols-[320px_minmax(0,1fr)]
              xl:grid-cols-[350px_minmax(0,1fr)]`}
          >
            {/* LEFT: CONVERSATIONS */}
            <aside
              className={`flex min-h-0 flex-col border-r ${BORDER}
                ${mobileChatOpen ? "hidden md:flex" : "flex"}`}
            >
              <div className={`border-b ${BORDER} p-4`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Messages</h2>
                  <button
                    type="button"
                    onClick={() => setShowNewChat(true)}
                    title="New conversation"
                    className="rounded-xl bg-pink-50 p-2.5
                      text-[#FF2454] dark:bg-[#4A2538]"
                  >
                    <Plus size={19} />
                  </button>
                </div>

                <div className="relative mt-4">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2
                      -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search conversations..."
                    className={`${INPUT} pl-10`}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {["All", "Unread", "Direct", "Groups"].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setChatFilter(filter)}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                        chatFilter === filter
                          ? PINK
                          : "bg-gray-100 text-gray-500 dark:bg-[#302B37] dark:text-[#B0A5BD]"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <LoaderCircle
                      size={28}
                      className="animate-spin text-[#FF2454]"
                    />
                  </div>
                ) : filteredChats.length === 0 ? (
                  <EmptyState
                    title="No conversations"
                    description={
                      chatFilter === "Unread"
                        ? "Unread counts are not available from the current conversation API."
                        : "Your real conversations will appear here when available."
                    }
                  />
                ) : (
                  filteredChats.map((chat) => (
                    <button
                      key={chat.id}
                      type="button"
                      onClick={() => selectChat(chat)}
                      className={`flex w-full items-start gap-3
                        border-b ${BORDER} p-4 text-left transition
                        hover:bg-pink-50/50 dark:hover:bg-[#302632] ${
                          selectedChatId === chat.id
                            ? "bg-pink-50/70 dark:bg-[#342634]"
                            : ""
                        }`}
                    >
                      <Avatar
                        name={chat.name}
                        group={chat.type === "group"}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-bold">
                            {chat.name}
                          </p>
                          {localPinnedIds.includes(chat.id) && (
                            <Pin
                              size={12}
                              className="shrink-0 text-[#FF2454]"
                            />
                          )}
                        </div>

                        <p className={`mt-1 truncate text-xs ${MUTED}`}>
                          {chat.lastMessage || "No messages yet"}
                        </p>

                        <p className={`mt-2 truncate text-xs ${MUTED}`}>
                          {chat.type === "group"
                            ? `${chat.participantCount} participants`
                            : chat.batch || "Direct message"}
                        </p>
                      </div>

                      <span className={`shrink-0 text-[11px] ${MUTED}`}>
                        {timeText(chat.lastMessageAt)}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </aside>

            {/* RIGHT: CHAT */}
            <div
              className={`min-h-0 min-w-0 flex-col
                ${mobileChatOpen ? "flex" : "hidden md:flex"}`}
            >
              {!selectedChat ? (
                <div className="flex flex-1 items-center justify-center">
                  <EmptyState
                    title="Select a conversation"
                    description="Choose an existing conversation or create a new one to start messaging."
                  />
                </div>
              ) : (
                <>
                  {/* CHAT HEADER */}
                  <header
                    className={`flex items-center justify-between
                      gap-3 border-b ${BORDER} px-4 py-3 sm:px-5`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setMobileChatOpen(false)}
                        aria-label="Back to conversations"
                        className="rounded-lg p-2 md:hidden"
                      >
                        <ArrowLeft size={20} />
                      </button>

                      <Avatar
                        name={selectedChat.name}
                        group={selectedChat.type === "group"}
                      />

                      <div className="min-w-0">
                        <h2 className="truncate font-bold">
                          {selectedChat.name}
                        </h2>
                        <p className={`mt-1 truncate text-xs ${MUTED}`}>
                          {selectedChat.type === "group"
                            ? `${selectedChat.participantCount} participants`
                            : selectedChat.batch || "Direct conversation"}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        title="Voice calling requires integration"
                        disabled
                        className="rounded-lg p-2 text-gray-300
                          dark:text-gray-600"
                      >
                        <Phone size={19} />
                      </button>

                      <button
                        type="button"
                        title="Video calling requires integration"
                        disabled
                        className="rounded-lg p-2 text-gray-300
                          dark:text-gray-600"
                      >
                        <Video size={19} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowInfo((value) => !value)}
                        title="Conversation information"
                        className="rounded-lg p-2 hover:bg-gray-100
                          dark:hover:bg-[#393441]"
                      >
                        <Info size={20} />
                      </button>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowMenu((value) => !value)}
                          aria-label="Conversation actions"
                          className="rounded-lg p-2 hover:bg-gray-100
                            dark:hover:bg-[#393441]"
                        >
                          <MoreVertical size={20} />
                        </button>

                        {showMenu && (
                          <div
                            className={`absolute right-0 top-10 z-30
                              w-48 rounded-xl border ${BORDER}
                              bg-white p-2 shadow-xl dark:bg-[#302B37]`}
                          >
                            <button
                              type="button"
                              onClick={togglePin}
                              className="flex w-full items-center gap-2
                                rounded-lg px-3 py-2 text-left text-sm
                                hover:bg-gray-50 dark:hover:bg-[#393441]"
                            >
                              <Pin size={16} />
                              {localPinnedIds.includes(selectedChatId)
                                ? "Unpin locally"
                                : "Pin locally"}
                            </button>

                            {selectedChat.type === "group" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setRenameTitle(selectedChat.name);
                                  setRenaming(true);
                                  setShowMenu(false);
                                }}
                                className="flex w-full items-center gap-2
                                  rounded-lg px-3 py-2 text-left text-sm
                                  hover:bg-gray-50 dark:hover:bg-[#393441]"
                              >
                                <Pencil size={16} />
                                Rename Group
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={archiveChat}
                              disabled={saving}
                              className="flex w-full items-center gap-2
                                rounded-lg px-3 py-2 text-left text-sm
                                text-red-600 hover:bg-red-50
                                dark:hover:bg-[#39232F]"
                            >
                              <Archive size={16} />
                              Archive Chat
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </header>

                  {/* CHAT INFORMATION */}
                  {showInfo && (
                    <div
                      className={`border-b ${BORDER} bg-gray-50
                        p-4 dark:bg-[#302B37]`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold">
                            Conversation Information
                          </h3>
                          <p className={`mt-1 text-xs ${MUTED}`}>
                            {selectedChat.type === "group"
                              ? "Group conversation"
                              : "Direct conversation"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowInfo(false)}
                          aria-label="Close info"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedChat.participants.map((participant) => (
                          <span
                            key={participant.id}
                            className={`rounded-full border ${BORDER}
                              bg-white px-3 py-1.5 text-xs
                              dark:bg-[#211E27]`}
                          >
                            {participant.name}
                          </span>
                        ))}
                      </div>

                      <p className={`mt-3 text-xs ${MUTED}`}>
                        Participant changes and presence updates depend
                        on backend permissions and live event integration.
                      </p>
                    </div>
                  )}

                  {/* MESSAGE HISTORY */}
                  <div
                    className="min-h-0 flex-1 space-y-4
                      overflow-y-auto bg-[#FBFCFF] p-4
                      dark:bg-[#1B1920] sm:p-6"
                  >
                    {hasMore && (
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={loadOlderMessages}
                          disabled={loadingOlder}
                          className="rounded-full border border-gray-200
                            bg-white px-4 py-2 text-xs font-semibold
                            disabled:opacity-50 dark:border-[#3B3441]
                            dark:bg-[#302B37]"
                        >
                          {loadingOlder
                            ? "Loading..."
                            : "Load older messages"}
                        </button>
                      </div>
                    )}

                    {messagesLoading ? (
                      <div className="flex justify-center py-12">
                        <LoaderCircle
                          size={28}
                          className="animate-spin text-[#FF2454]"
                        />
                      </div>
                    ) : messages.length === 0 ? (
                      <EmptyState
                        title="No messages yet"
                        description="Send the first message to start this conversation."
                      />
                    ) : (
                      messages.map((item) => (
                        <div
                          key={item.id}
                          className={`flex ${
                            item.mine
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[88%] sm:max-w-[75%] ${
                              item.mine
                                ? "items-end"
                                : "items-start"
                            } flex flex-col`}
                          >
                            {!item.mine &&
                              selectedChat.type === "group" && (
                                <span className={`mb-1 px-1 text-xs ${MUTED}`}>
                                  {item.senderName}
                                </span>
                              )}

                            <div
                              className={`rounded-2xl px-4 py-3
                                text-sm leading-6 shadow-sm ${
                                  item.mine
                                    ? "rounded-br-md bg-[#FF2454] text-white"
                                    : `rounded-bl-md border ${BORDER}
                                      bg-white dark:bg-[#302B37]`
                                }`}
                            >
                              {editingMessageId === item.id ? (
                                <div className="min-w-[220px] space-y-2">
                                  <textarea
                                    value={editingText}
                                    onChange={(event) =>
                                      setEditingText(event.target.value)
                                    }
                                    maxLength={10000}
                                    rows={3}
                                    className="w-full rounded-lg border
                                      border-gray-200 bg-white p-2
                                      text-sm text-gray-900"
                                  />

                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setEditingMessageId(null)
                                      }
                                      className="rounded-lg border
                                        border-white/50 px-3 py-1.5"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        saveMessageEdit(item.id)
                                      }
                                      disabled={saving || !editingText.trim()}
                                      className="rounded-lg bg-white
                                        px-3 py-1.5 font-bold
                                        text-[#FF2454] disabled:opacity-50"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="whitespace-pre-wrap break-words">
                                  {item.text}
                                </p>
                              )}

                              <div
                                className={`mt-2 flex items-center
                                  justify-end gap-1 text-[10px] ${
                                    item.mine
                                      ? "text-white/80"
                                      : MUTED
                                  }`}
                              >
                                <span>{timeText(item.createdAt)}</span>
                                {item.editedAt && <span>· Edited</span>}
                                {item.mine && <CheckCheck size={13} />}
                              </div>
                            </div>

                            {item.mine &&
                              editingMessageId !== item.id && (
                                <div className="mt-1 flex gap-1">
                                  <button
                                    type="button"
                                    title="Edit message"
                                    onClick={() => {
                                      setEditingMessageId(item.id);
                                      setEditingText(item.text);
                                    }}
                                    className={`rounded-lg p-1.5 ${MUTED}
                                      hover:bg-gray-100
                                      dark:hover:bg-[#302B37]`}
                                  >
                                    <Pencil size={13} />
                                  </button>

                                  <button
                                    type="button"
                                    title="Delete message"
                                    onClick={() => deleteMessage(item.id)}
                                    className="rounded-lg p-1.5
                                      text-red-400 hover:bg-red-50"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>
                      ))
                    )}

                    <div ref={bottomRef} />
                  </div>

                  {/* MESSAGE COMPOSER */}
                  <form
                    onSubmit={submitMessage}
                    className={`flex items-end gap-2 border-t ${BORDER}
                      bg-white p-3 dark:bg-[#211E27] sm:p-4`}
                  >
                    <button
                      type="button"
                      disabled
                      title="Attachment upload requires backend integration"
                      className="rounded-xl p-3 text-gray-300
                        dark:text-gray-600"
                    >
                      <Paperclip size={20} />
                    </button>

                    <div className="min-w-0 flex-1">
                      <textarea
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyDown={(event) => {
                          if (
                            event.key === "Enter" &&
                            !event.shiftKey
                          ) {
                            event.preventDefault();
                            event.currentTarget.form?.requestSubmit();
                          }
                        }}
                        rows={1}
                        maxLength={5000}
                        placeholder="Type your message..."
                        className={`${INPUT} max-h-32 min-h-[46px] resize-none`}
                      />
                    </div>

                    <button
                      type="button"
                      disabled
                      title="Emoji picker is not connected"
                      className="rounded-xl p-3 text-gray-300
                        dark:text-gray-600"
                    >
                      <Smile size={20} />
                    </button>

                    <button
                      type="submit"
                      disabled={!message.trim() || sending}
                      aria-label="Send message"
                      className={`flex h-12 w-12 shrink-0
                        items-center justify-center rounded-xl
                        disabled:opacity-50 ${PINK}`}
                    >
                      {sending ? (
                        <LoaderCircle
                          size={20}
                          className="animate-spin"
                        />
                      ) : (
                        <Send size={20} />
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* NEW CONVERSATION */}
      {showNewChat && (
        <Modal
          title="New Conversation"
          onClose={() => {
            if (!saving) setShowNewChat(false);
          }}
        >
          <form onSubmit={createChat} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "direct", label: "Direct Message", icon: UserRound },
                { id: "group", label: "Group Chat", icon: Users },
              ].map((type) => {
                const Icon = type.icon;

                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setNewChatType(type.id)}
                    className={`flex items-center justify-center
                      gap-2 rounded-xl border px-3 py-4 text-sm
                      font-semibold ${
                        newChatType === type.id
                          ? "border-[#FF2454] bg-pink-50 text-[#FF2454] dark:bg-[#4A2538]"
                          : `${BORDER} bg-white dark:bg-[#302B37]`
                      }`}
                  >
                    <Icon size={18} />
                    {type.label}
                  </button>
                );
              })}
            </div>

            {newChatType === "direct" ? (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">
                  Select Student
                </span>

                <select
                  value={newChatStudent}
                  onChange={(event) =>
                    setNewChatStudent(event.target.value)
                  }
                  className={INPUT}
                  required
                >
                  <option value="">Choose a student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                      {student.email ? ` (${student.email})` : ""}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">
                    Group Name
                  </span>
                  <input
                    value={newGroupName}
                    onChange={(event) =>
                      setNewGroupName(event.target.value)
                    }
                    placeholder="Enter group name"
                    minLength={2}
                    maxLength={150}
                    className={INPUT}
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">
                    Batch
                  </span>
                  <select
                    value={newGroupBatch}
                    onChange={(event) => {
                      setNewGroupBatch(event.target.value);
                      setGroupParticipantIds([]);
                    }}
                    className={INPUT}
                  >
                    <option value="">All Batches</option>
                    {batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div>
                  <p className="mb-2 text-sm font-semibold">
                    Select Participants
                  </p>

                  <div
                    className={`max-h-[230px] space-y-1
                      overflow-y-auto rounded-xl border ${BORDER} p-2`}
                  >
                    {filteredStudents.map((student) => (
                      <label
                        key={student.id}
                        className="flex cursor-pointer items-center
                          gap-3 rounded-lg p-3 hover:bg-gray-50
                          dark:hover:bg-[#302B37]"
                      >
                        <input
                          type="checkbox"
                          checked={groupParticipantIds.includes(student.id)}
                          onChange={() => toggleParticipant(student.id)}
                          className="accent-[#FF2454]"
                        />

                        <Avatar name={student.name} />

                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">
                            {student.name}
                          </span>
                          <span className={`block truncate text-xs ${MUTED}`}>
                            {student.email}
                          </span>
                        </span>
                      </label>
                    ))}

                    {!filteredStudents.length && (
                      <EmptyState
                        icon={Users}
                        title="No students available"
                        description="Students will appear when batch members are available."
                      />
                    )}
                  </div>

                  <p className={`mt-2 text-xs ${MUTED}`}>
                    {groupParticipantIds.length} selected · Maximum 100
                  </p>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNewChat(false)}
                disabled={saving}
                className={`flex-1 rounded-xl border ${BORDER}
                  px-4 py-3 text-sm font-semibold`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  saving ||
                  (newChatType === "direct"
                    ? !newChatStudent
                    : !newGroupName.trim() ||
                      !groupParticipantIds.length ||
                      groupParticipantIds.length > 100)
                }
                className={`flex flex-1 items-center justify-center
                  gap-2 rounded-xl px-4 py-3 text-sm
                  font-semibold disabled:opacity-50 ${PINK}`}
              >
                <Plus size={17} />
                {saving ? "Creating..." : "Create Conversation"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* RENAME GROUP */}
      {renaming && selectedChat && (
        <Modal
          title="Rename Group"
          onClose={() => setRenaming(false)}
        >
          <form onSubmit={renameGroup} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                Group Name
              </span>
              <input
                value={renameTitle}
                onChange={(event) => setRenameTitle(event.target.value)}
                minLength={2}
                maxLength={150}
                className={INPUT}
                required
              />
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRenaming(false)}
                className={`flex-1 rounded-xl border ${BORDER}
                  px-4 py-3 text-sm font-semibold`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving || renameTitle.trim().length < 2}
                className={`flex flex-1 items-center justify-center
                  gap-2 rounded-xl px-4 py-3 text-sm
                  font-semibold disabled:opacity-50 ${PINK}`}
              >
                <Save size={17} />
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
