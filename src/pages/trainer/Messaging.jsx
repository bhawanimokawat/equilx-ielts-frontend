
import React, { useMemo, useState } from "react";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Info,
  MessageCircle,
  Users,
  Plus,
  CheckCheck,
  ArrowLeft,
  X,
  UserRound,
  Bell,
  Pin,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const initialChats = [
  {
    id: 1,
    name: "Aarav Sharma",
    type: "direct",
    batch: "Morning Batch",
    initials: "AS",
    color: "blue",
    unread: 2,
    online: true,
    pinned: true,
    lastMessage: "Sir, I have submitted my writing task.",
    time: "10:42 AM",
    messages: [
      { id: 1, sender: "them", text: "Good morning, sir!", time: "10:25 AM" },
      { id: 2, sender: "me", text: "Good morning, Aarav. How is your preparation going?", time: "10:30 AM" },
      { id: 3, sender: "them", text: "I have completed the reading practice test.", time: "10:36 AM" },
      { id: 4, sender: "them", text: "Sir, I have submitted my writing task.", time: "10:42 AM" },
    ],
  },
  {
    id: 2,
    name: "Morning Batch",
    type: "group",
    batch: "12 members",
    initials: "MB",
    color: "purple",
    unread: 5,
    online: false,
    pinned: true,
    lastMessage: "Trainer: Today's mock test starts at 11 AM.",
    time: "10:15 AM",
    messages: [
      { id: 1, sender: "me", text: "Good morning, everyone! Please complete your reading practice.", time: "Yesterday" },
      { id: 2, sender: "them", author: "Priya Verma", text: "Sir, should we complete all three passages?", time: "9:45 AM" },
      { id: 3, sender: "me", text: "Yes, please attempt all three passages within the time limit.", time: "9:50 AM" },
      { id: 4, sender: "me", text: "Today's mock test starts at 11 AM.", time: "10:15 AM" },
    ],
  },
  {
    id: 3,
    name: "Priya Verma",
    type: "direct",
    batch: "Evening Batch",
    initials: "PV",
    color: "pink",
    unread: 0,
    online: true,
    pinned: false,
    lastMessage: "Thank you for the feedback!",
    time: "Yesterday",
    messages: [
      { id: 1, sender: "them", text: "Sir, can you review my Task 2 essay?", time: "Yesterday" },
      { id: 2, sender: "me", text: "I have reviewed it. Please work on paragraph development.", time: "Yesterday" },
      { id: 3, sender: "them", text: "Thank you for the feedback!", time: "Yesterday" },
    ],
  },
  {
    id: 4,
    name: "Weekend Batch",
    type: "group",
    batch: "8 members",
    initials: "WB",
    color: "orange",
    unread: 0,
    online: false,
    pinned: false,
    lastMessage: "Rahul: Please share the speaking cue card.",
    time: "Yesterday",
    messages: [
      { id: 1, sender: "them", author: "Rahul Meena", text: "Sir, please share the speaking cue card.", time: "Yesterday" },
    ],
  },
  {
    id: 5,
    name: "Rahul Meena",
    type: "direct",
    batch: "Weekend Batch",
    initials: "RM",
    color: "green",
    unread: 0,
    online: false,
    pinned: false,
    lastMessage: "I will practice again today.",
    time: "Mon",
    messages: [
      { id: 1, sender: "me", text: "Please practise speaking for at least 15 minutes daily.", time: "Mon" },
      { id: 2, sender: "them", text: "I will practice again today.", time: "Mon" },
    ],
  },
  {
    id: 6,
    name: "Sneha Gupta",
    type: "direct",
    batch: "Morning Batch",
    initials: "SG",
    color: "teal",
    unread: 1,
    online: false,
    pinned: false,
    lastMessage: "Can we schedule a speaking session?",
    time: "Mon",
    messages: [
      { id: 1, sender: "them", text: "Can we schedule a speaking session?", time: "Mon" },
    ],
  },
];

const students = [
  { name: "Aarav Sharma", batch: "Morning Batch", initials: "AS" },
  { name: "Priya Verma", batch: "Evening Batch", initials: "PV" },
  { name: "Rahul Meena", batch: "Weekend Batch", initials: "RM" },
  { name: "Sneha Gupta", batch: "Morning Batch", initials: "SG" },
  { name: "Rohan Singh", batch: "Evening Batch", initials: "RS" },
  { name: "Ananya Joshi", batch: "Weekend Batch", initials: "AJ" },
];

const avatarColors = {
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
  pink: "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300",
  orange: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
  green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300",
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-400 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-gray-100 dark:placeholder:text-gray-500";

export default function Messaging() {
  const [chats, setChats] = useState(initialChats);
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [search, setSearch] = useState("");
  const [chatFilter, setChatFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatType, setNewChatType] = useState("direct");
  const [newChatStudent, setNewChatStudent] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [notice, setNotice] = useState("");

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    return chats.filter((chat) => {
      const matchesSearch =
        chat.name.toLowerCase().includes(query) ||
        chat.lastMessage.toLowerCase().includes(query) ||
        chat.batch.toLowerCase().includes(query);

      const matchesFilter =
        chatFilter === "All" ||
        (chatFilter === "Unread" && chat.unread > 0) ||
        (chatFilter === "Direct" && chat.type === "direct") ||
        (chatFilter === "Groups" && chat.type === "group");

      return matchesSearch && matchesFilter;
    });
  }, [chats, search, chatFilter]);

  const unreadTotal = chats.reduce((total, chat) => total + chat.unread, 0);

  const selectChat = (chat) => {
    setSelectedChatId(chat.id);
    setMobileChatOpen(true);
    setShowInfo(false);
    setChats((previous) =>
      previous.map((item) =>
        item.id === chat.id ? { ...item, unread: 0 } : item
      )
    );
  };

  const sendMessage = (event) => {
    event.preventDefault();

    const text = message.trim();
    if (!text || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text,
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChats((previous) =>
      previous.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: text,
              time: newMessage.time,
            }
          : chat
      )
    );

    setMessage("");
  };

  const createChat = (event) => {
    event.preventDefault();

    let name = "";
    let batch = "";
    let initials = "";
    const type = newChatType;

    if (type === "direct") {
      const student = students.find((item) => item.name === newChatStudent);

      if (!student) {
        setNotice("Please select a student.");
        return;
      }

      const existing = chats.find(
        (chat) => chat.type === "direct" && chat.name === student.name
      );

      if (existing) {
        setSelectedChatId(existing.id);
        setMobileChatOpen(true);
        setShowNewChat(false);
        setNotice("");
        return;
      }

      name = student.name;
      batch = student.batch;
      initials = student.initials;
    } else {
      name = newGroupName.trim();

      if (!name) {
        setNotice("Enter a group name.");
        return;
      }

      const existing = chats.find(
        (chat) =>
          chat.type === "group" &&
          chat.name.toLowerCase() === name.toLowerCase()
      );

      if (existing) {
        setNotice("A group with this name already exists.");
        return;
      }

      batch = "New group";
      initials = name
        .split(/\s+/)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }

    const newChat = {
      id: Date.now(),
      name,
      type,
      batch,
      initials,
      color: type === "group" ? "purple" : "blue",
      unread: 0,
      online: false,
      pinned: false,
      lastMessage: "Start a conversation",
      time: "Now",
      messages: [],
    };

    setChats((previous) => [newChat, ...previous]);
    setSelectedChatId(newChat.id);
    setMobileChatOpen(true);
    setShowNewChat(false);
    setNewChatStudent("");
    setNewGroupName("");
    setNotice("");
  };

  const togglePinned = () => {
    if (!selectedChat) return;

    setChats((previous) =>
      previous.map((chat) =>
        chat.id === selectedChat.id
          ? { ...chat, pinned: !chat.pinned }
          : chat
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F7FF] text-[#10265F] transition-colors dark:bg-[#17151B] dark:text-gray-100">
      <Sidebar />

      <div className="min-w-0 lg:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1600px] space-y-5 p-4 sm:p-6 lg:p-8">
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm text-gray-500 dark:text-[#B0A5BD]">
                Trainer Portal / Messaging
              </p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Chat & Messaging
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-[#B0A5BD]">
                Communicate with students and manage batch conversations.
              </p>
            </div>

            <button
              onClick={() => {
                setNotice("");
                setShowNewChat(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e91d49]"
            >
              <Plus size={18} />
              New Conversation
            </button>
          </section>

          {notice && !showNewChat && (
            <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              {notice}
              <button onClick={() => setNotice("")} aria-label="Dismiss">
                <X size={16} />
              </button>
            </div>
          )}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon={<MessageCircle size={21} />}
              title="Conversations"
              value={chats.length}
              color="blue"
            />
            <StatCard
              icon={<Bell size={21} />}
              title="Unread Messages"
              value={unreadTotal}
              color="pink"
            />
            <StatCard
              icon={<Users size={21} />}
              title="Group Chats"
              value={chats.filter((chat) => chat.type === "group").length}
              color="purple"
            />
          </section>

          <section className="flex h-[680px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27] sm:h-[760px]">
            {/* Conversation list */}
            <aside
              className={`w-full shrink-0 flex-col border-r border-gray-100 dark:border-[#3B3441] sm:w-[310px] lg:w-[350px] ${
                mobileChatOpen ? "hidden sm:flex" : "flex"
              }`}
            >
              <div className="border-b border-gray-100 p-4 dark:border-[#3B3441] sm:p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold">Messages</h2>
                  <button
                    onClick={() => setShowNewChat(true)}
                    className="rounded-lg p-2 text-[#FF2454] transition hover:bg-pink-50 dark:hover:bg-pink-500/10"
                    aria-label="New conversation"
                  >
                    <Plus size={19} />
                  </button>
                </div>

                <div className="relative mt-4">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search conversations..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-blue-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-gray-100 dark:placeholder:text-gray-500"
                  />
                </div>

                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {["All", "Unread", "Direct", "Groups"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setChatFilter(filter)}
                      className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition ${
                        chatFilter === filter
                          ? "bg-[#10265F] text-white dark:bg-[#FF2454]"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-[#302B36] dark:text-[#B0A5BD] dark:hover:bg-[#3B3441]"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredChats
                  .slice()
                  .sort((a, b) => Number(b.pinned) - Number(a.pinned))
                  .map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => selectChat(chat)}
                      className={`flex w-full items-start gap-3 border-b border-gray-50 px-4 py-4 text-left transition hover:bg-gray-50 dark:border-[#302B36] dark:hover:bg-[#302B36] ${
                        selectedChatId === chat.id
                          ? "bg-blue-50/70 dark:bg-[#302B36]"
                          : ""
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${
                            avatarColors[chat.color] || avatarColors.blue
                          }`}
                        >
                          {chat.type === "group" ? (
                            <Users size={19} />
                          ) : (
                            chat.initials
                          )}
                        </div>

                        {chat.online && chat.type === "direct" && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-[#211E27]" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold">
                            {chat.name}
                          </p>
                          <span className="shrink-0 text-[10px] text-gray-400 dark:text-[#91899B]">
                            {chat.time}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center justify-between gap-2">
                          <p className="truncate text-xs text-gray-500 dark:text-[#B0A5BD]">
                            {chat.lastMessage}
                          </p>
                          {chat.unread > 0 && (
                            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#FF2454] px-1.5 text-[10px] font-bold text-white">
                              {chat.unread}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <span className="rounded-md bg-gray-100 px-2 py-1 text-[10px] text-gray-500 dark:bg-[#302B36] dark:text-[#B0A5BD]">
                            {chat.type === "group" ? "Group" : chat.batch}
                          </span>
                          {chat.pinned && (
                            <Pin size={12} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}

                {filteredChats.length === 0 && (
                  <div className="px-5 py-12 text-center">
                    <MessageCircle
                      size={28}
                      className="mx-auto text-gray-300 dark:text-[#5F5668]"
                    />
                    <p className="mt-3 text-sm font-semibold">
                      No conversations found
                    </p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-[#91899B]">
                      Try another search or filter.
                    </p>
                  </div>
                )}
              </div>
            </aside>

            {/* Chat panel */}
            <div
              className={`min-w-0 flex-1 flex-col ${
                mobileChatOpen ? "flex" : "hidden sm:flex"
              }`}
            >
              {selectedChat ? (
                <>
                  <header className="flex items-center justify-between gap-3 border-b border-gray-100 px-3 py-4 dark:border-[#3B3441] sm:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        onClick={() => setMobileChatOpen(false)}
                        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-[#302B36] sm:hidden"
                        aria-label="Back to conversations"
                      >
                        <ArrowLeft size={19} />
                      </button>

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          avatarColors[selectedChat.color] || avatarColors.blue
                        }`}
                      >
                        {selectedChat.type === "group" ? (
                          <Users size={19} />
                        ) : (
                          selectedChat.initials
                        )}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-bold">
                          {selectedChat.name}
                        </h2>
                        <p className="mt-1 truncate text-xs text-gray-500 dark:text-[#B0A5BD]">
                          {selectedChat.type === "group"
                            ? selectedChat.batch
                            : selectedChat.online
                              ? "Online"
                              : selectedChat.batch}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() =>
                          setNotice(
                            "Calling requires a configured voice/video calling service."
                          )
                        }
                        className="hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-[#B0A5BD] dark:hover:bg-[#302B36] sm:block"
                        aria-label="Voice call"
                        title="Voice call"
                      >
                        <Phone size={18} />
                      </button>

                      <button
                        onClick={() =>
                          setNotice(
                            "Video calling requires a configured video provider."
                          )
                        }
                        className="hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-[#B0A5BD] dark:hover:bg-[#302B36] sm:block"
                        aria-label="Video call"
                        title="Video call"
                      >
                        <Video size={19} />
                      </button>

                      <button
                        onClick={() => setShowInfo(!showInfo)}
                        className={`rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-[#302B36] ${
                          showInfo
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                            : "text-gray-500 dark:text-[#B0A5BD]"
                        }`}
                        aria-label="Conversation information"
                      >
                        <Info size={19} />
                      </button>

                      <button
                        onClick={togglePinned}
                        className={`rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-[#302B36] ${
                          selectedChat.pinned
                            ? "text-[#FF2454]"
                            : "text-gray-500 dark:text-[#B0A5BD]"
                        }`}
                        aria-label="Pin conversation"
                        title="Pin conversation"
                      >
                        <Pin size={18} />
                      </button>
                    </div>
                  </header>

                  <div className="flex min-h-0 flex-1">
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex-1 space-y-5 overflow-y-auto bg-[#F8FAFF] p-4 dark:bg-[#19171E] sm:p-6">
                        <div className="mx-auto w-fit rounded-full bg-white px-3 py-1.5 text-[10px] text-gray-400 shadow-sm dark:bg-[#302B36] dark:text-[#B0A5BD]">
                          Conversation messages
                        </div>

                        {selectedChat.messages.map((item) => {
                          const isMe = item.sender === "me";

                          return (
                            <div
                              key={item.id}
                              className={`flex ${
                                isMe ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[88%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
                                  isMe
                                    ? "rounded-br-sm bg-[#10265F] text-white dark:bg-[#5141A8]"
                                    : "rounded-bl-sm border border-gray-100 bg-white text-gray-700 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27] dark:text-gray-200"
                                }`}
                              >
                                {item.author && (
                                  <p className="mb-1 text-[11px] font-bold text-[#FF2454]">
                                    {item.author}
                                  </p>
                                )}

                                <p className="whitespace-pre-wrap break-words text-sm leading-6">
                                  {item.text}
                                </p>

                                <div
                                  className={`mt-2 flex items-center justify-end gap-1 text-[10px] ${
                                    isMe
                                      ? "text-blue-200"
                                      : "text-gray-400 dark:text-[#91899B]"
                                  }`}
                                >
                                  {item.time}
                                  {isMe && <CheckCheck size={13} />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <form
                        onSubmit={sendMessage}
                        className="border-t border-gray-100 bg-white p-3 dark:border-[#3B3441] dark:bg-[#211E27] sm:p-4"
                      >
                        <div className="flex items-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setNotice(
                                "File attachments need an upload API and storage configuration."
                              )
                            }
                            className="hidden rounded-lg p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-[#302B36] sm:block"
                            aria-label="Attach file"
                          >
                            <Paperclip size={20} />
                          </button>

                          <div className="flex min-w-0 flex-1 items-end rounded-2xl border border-gray-200 bg-gray-50 px-3 dark:border-[#3B3441] dark:bg-[#19171E]">
                            <textarea
                              value={message}
                              onChange={(event) =>
                                setMessage(event.target.value)
                              }
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
                              placeholder="Type your message..."
                              className="max-h-28 min-h-[44px] flex-1 resize-y bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setMessage((previous) => previous + " 🙂")
                              }
                              className="mb-1.5 rounded-lg p-2 text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3B3441]"
                              aria-label="Add emoji"
                            >
                              <Smile size={19} />
                            </button>
                          </div>

                          <button
                            type="submit"
                            disabled={!message.trim()}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF2454] text-white transition hover:bg-[#e91d49] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Send message"
                          >
                            <Send size={18} />
                          </button>
                        </div>

                        <p className="mt-2 hidden text-[10px] text-gray-400 dark:text-[#91899B] sm:block">
                          Press Enter to send · Shift + Enter for a new line
                        </p>
                      </form>
                    </div>

                    {/* Conversation info panel */}
                    {showInfo && (
                      <aside className="hidden w-[230px] shrink-0 border-l border-gray-100 bg-white p-4 dark:border-[#3B3441] dark:bg-[#211E27] lg:block">
                        <div className="text-center">
                          <div
                            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold ${
                              avatarColors[selectedChat.color] ||
                              avatarColors.blue
                            }`}
                          >
                            {selectedChat.type === "group" ? (
                              <Users size={25} />
                            ) : (
                              selectedChat.initials
                            )}
                          </div>

                          <h3 className="mt-3 break-words text-sm font-bold">
                            {selectedChat.name}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500 dark:text-[#B0A5BD]">
                            {selectedChat.batch}
                          </p>
                        </div>

                        <div className="mt-6 space-y-3 border-t border-gray-100 pt-4 dark:border-[#3B3441]">
                          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-[#91899B]">
                            Conversation
                          </p>

                          <InfoButton
                            icon={<Pin size={16} />}
                            label={
                              selectedChat.pinned ? "Unpin chat" : "Pin chat"
                            }
                            onClick={togglePinned}
                          />

                          <InfoButton
                            icon={<Search size={16} />}
                            label="Search messages"
                            onClick={() =>
                              setNotice(
                                "Use the conversation search field to find chats. Message-level search can be added later."
                              )
                            }
                          />

                          <InfoButton
                            icon={<Bell size={16} />}
                            label="Notification settings"
                            onClick={() =>
                              setNotice(
                                "Notification preferences will be available after backend integration."
                              )
                            }
                          />
                        </div>

                        <div className="mt-6 border-t border-gray-100 pt-4 dark:border-[#3B3441]">
                          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-[#91899B]">
                            Media & Files
                          </p>
                          <p className="mt-3 text-xs leading-5 text-gray-500 dark:text-[#B0A5BD]">
                            Shared files and media will appear here once
                            attachment support is connected.
                          </p>
                        </div>
                      </aside>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                    <MessageCircle size={30} />
                  </div>
                  <h2 className="mt-4 text-lg font-bold">
                    Your conversations
                  </h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-[#B0A5BD]">
                    Select a student or group from the conversation list to
                    start messaging.
                  </p>
                </div>
              )}
            </div>
          </section>

          <p className="text-xs leading-5 text-gray-400 dark:text-[#91899B]">
            Demo interface: messages are stored in React state and will reset
            on refresh. Persistent messaging requires authenticated backend
            APIs, database storage and appropriate institute-level access
            controls.
          </p>
        </main>
      </div>

      {/* New conversation modal */}
      {showNewChat && (
        <Modal
          title="New Conversation"
          onClose={() => {
            setShowNewChat(false);
            setNotice("");
          }}
        >
          <p className="mb-5 text-sm leading-6 text-gray-500 dark:text-[#B0A5BD]">
            Start a direct conversation with a student or create a batch group.
          </p>

          <div className="mb-5 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setNewChatType("direct");
                setNotice("");
              }}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
                newChatType === "direct"
                  ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-300"
                  : "border-gray-200 text-gray-500 dark:border-[#3B3441] dark:text-[#B0A5BD]"
              }`}
            >
              <UserRound size={17} />
              Direct Chat
            </button>

            <button
              onClick={() => {
                setNewChatType("group");
                setNotice("");
              }}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
                newChatType === "group"
                  ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-300"
                  : "border-gray-200 text-gray-500 dark:border-[#3B3441] dark:text-[#B0A5BD]"
              }`}
            >
              <Users size={17} />
              Group Chat
            </button>
          </div>

          <form onSubmit={createChat} className="space-y-4">
            {newChatType === "direct" ? (
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Select Student
                </label>
                <select
                  value={newChatStudent}
                  onChange={(event) => setNewChatStudent(event.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">Choose a student</option>
                  {students.map((student) => (
                    <option key={student.name} value={student.name}>
                      {student.name} — {student.batch}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Group Name
                </label>
                <input
                  value={newGroupName}
                  onChange={(event) => setNewGroupName(event.target.value)}
                  placeholder="e.g. IELTS Reading Practice"
                  className={inputClass}
                  required
                />
                <p className="mt-2 text-xs text-gray-400 dark:text-[#91899B]">
                  This demo creates a group conversation shell. Add actual
                  members through your backend group-management API.
                </p>
              </div>
            )}

            {notice && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300">
                {notice}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setShowNewChat(false);
                  setNotice("");
                }}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold transition hover:bg-gray-50 dark:border-[#3B3441] dark:hover:bg-[#302B36]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e91d49]"
              >
                <Plus size={17} />
                Create Conversation
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
    pink: "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-300",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300",
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-[#B0A5BD]">
            {title}
          </p>
          <h3 className="mt-3 text-3xl font-bold">{value}</h3>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:text-[#B0A5BD] dark:hover:bg-[#302B36]"
    >
      <span className="text-gray-400">{icon}</span>
      {label}
    </button>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#0B1739]/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="my-auto max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 text-gray-800 shadow-2xl dark:bg-[#211E27] dark:text-gray-100 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-[#10265F] dark:text-gray-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-[#302B36] dark:hover:text-gray-200"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
