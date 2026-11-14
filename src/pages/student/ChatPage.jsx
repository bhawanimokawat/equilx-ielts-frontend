import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "./StudentLayout";
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
} from "lucide-react";

const initialContacts = [
  {
    id: 1,
    name: "IELTS Academic Trainer",
    role: "Your trainer",
    avatar: "AT",
    color: "bg-[#E9EDFF] text-[#3449A8]",
    online: true,
    unread: 2,
    pinned: true,
    messages: [
      {
        id: 101,
        text: "Hello! Welcome to your IELTS learning space.",
        time: "09:20 AM",
        from: "them",
        read: true,
      },
      {
        id: 102,
        text: "How is your speaking practice going?",
        time: "09:22 AM",
        from: "them",
        read: true,
      },
      {
        id: 103,
        text: "I've been practising Part 2 cue cards.",
        time: "09:25 AM",
        from: "me",
        read: true,
      },
      {
        id: 104,
        text: "That's great! Try to speak for the full two minutes. Give a clear example and explain why the topic matters to you.",
        time: "09:27 AM",
        from: "them",
        read: true,
      },
      {
        id: 105,
        text: "Would you like me to review your next practice answer?",
        time: "09:28 AM",
        from: "them",
        read: false,
      },
    ],
  },
  {
    id: 2,
    name: "Speaking Support",
    role: "Practice support",
    avatar: "SS",
    color: "bg-[#E4F8F0] text-[#008B66]",
    online: true,
    unread: 0,
    pinned: true,
    messages: [
      {
        id: 201,
        text: "You can use the Live Speaking section to practise all three parts.",
        time: "Yesterday",
        from: "them",
        read: true,
      },
      {
        id: 202,
        text: "Thank you, I'll practise today!",
        time: "Yesterday",
        from: "me",
        read: true,
      },
    ],
  },
  {
    id: 3,
    name: "Writing Feedback",
    role: "Writing support",
    avatar: "WF",
    color: "bg-[#FFF0F3] text-[#E92350]",
    online: false,
    unread: 0,
    pinned: false,
    messages: [
      {
        id: 301,
        text: "Remember to include a clear overview in IELTS Academic Writing Task 1.",
        time: "Yesterday",
        from: "them",
        read: true,
      },
    ],
  },
  {
    id: 4,
    name: "Study Group",
    role: "IELTS learners",
    avatar: "SG",
    color: "bg-[#F2EAFE] text-[#8241C9]",
    online: true,
    unread: 0,
    pinned: false,
    messages: [
      {
        id: 401,
        text: "What are you studying today?",
        time: "10:05 AM",
        from: "them",
        read: true,
      },
      {
        id: 402,
        text: "I am revising vocabulary for Reading.",
        time: "10:08 AM",
        from: "me",
        read: true,
      },
    ],
  },
];

const quickReplies = [
  "Thank you!",
  "Can you explain this?",
  "I'll practise today.",
];

function formatNow() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getLastMessage(contact) {
  return contact.messages[contact.messages.length - 1];
}

export default function ChatPage() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState(initialContacts);
  const [activeId, setActiveId] = useState(1);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [showContactMenu, setShowContactMenu] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [newChatRole, setNewChatRole] = useState("Study partner");
  const [attachmentMenu, setAttachmentMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("All");
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messageEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const activeContact = contacts.find(
    (contact) => contact.id === activeId
  );

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name
      .toLowerCase()
      .includes(search.toLowerCase());

    if (filter === "Unread") {
      return matchesSearch && contact.unread > 0;
    }

    if (filter === "Pinned") {
      return matchesSearch && contact.pinned;
    }

    return matchesSearch;
  });

  useEffect(() => {
    if (!activeContact) return;

    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [activeId, activeContact?.messages.length]);

  const openConversation = (id) => {
    setActiveId(id);
    setMobileChatOpen(true);
    setShowContactMenu(false);

    setContacts((previous) =>
      previous.map((contact) =>
        contact.id === id ? { ...contact, unread: 0 } : contact
      )
    );
  };

  const sendMessage = (event) => {
    event.preventDefault();

    const text = message.trim();
    if (!text || !activeContact) return;

    const newMessage = {
      id: Date.now(),
      text,
      time: formatNow(),
      from: "me",
      read: false,
    };

    setContacts((previous) =>
      previous.map((contact) =>
        contact.id === activeId
          ? {
              ...contact,
              messages: [...contact.messages, newMessage],
            }
          : contact
      )
    );

    setMessage("");
    setAttachmentMenu(false);
  };

  const createConversation = (event) => {
    event.preventDefault();

    const name = newChatName.trim();
    if (!name) return;

    const newContact = {
      id: Date.now(),
      name,
      role: newChatRole,
      avatar: name
        .split(/\s+/)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      color: "bg-[#EAF4FF] text-[#2466C2]",
      online: false,
      unread: 0,
      pinned: false,
      messages: [
        {
          id: Date.now() + 1,
          text: `Conversation created with ${name}. You can start typing below.`,
          time: formatNow(),
          from: "them",
          read: true,
        },
      ],
    };

    setContacts((previous) => [newContact, ...previous]);
    setActiveId(newContact.id);
    setMobileChatOpen(true);
    setNewChatName("");
    setShowNewChat(false);
    setNotice("A local demo conversation has been created.");
  };

  const togglePinned = () => {
    setContacts((previous) =>
      previous.map((contact) =>
        contact.id === activeId
          ? { ...contact, pinned: !contact.pinned }
          : contact
      )
    );

    setShowContactMenu(false);
  };

  const deleteConversation = () => {
    if (!activeContact) return;

    const remaining = contacts.filter(
      (contact) => contact.id !== activeId
    );

    setContacts(remaining);
    setActiveId(remaining[0]?.id ?? null);
    setMobileChatOpen(false);
    setShowContactMenu(false);
    setNotice("Conversation removed from this demo view.");
  };

  const handleAttachment = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileMessage = {
      id: Date.now(),
      text: `📎 ${file.name} (${Math.max(
        1,
        Math.round(file.size / 1024)
      )} KB)`,
      time: formatNow(),
      from: "me",
      read: false,
    };

    setContacts((previous) =>
      previous.map((contact) =>
        contact.id === activeId
          ? {
              ...contact,
              messages: [...contact.messages, fileMessage],
            }
          : contact
      )
    );

    setNotice(
      "File name added to this demo chat. Actual file upload needs backend storage."
    );

    event.target.value = "";
    setAttachmentMenu(false);
  };

  const handleQuickReply = (reply) => {
    setMessage(reply);
    messageInputRef.current?.focus();
  };

  const contactList = (
    <aside className="flex h-full min-h-0 flex-col bg-white">
      <div className="border-b border-[#E7ECF6] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[#10265F]">
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
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF2454] text-white shadow-md shadow-rose-100 transition hover:bg-[#E81745]"
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
            className="w-full rounded-xl border border-[#E7ECF6] bg-[#F8FAFF] py-3 pl-9 pr-3 text-xs outline-none transition focus:border-[#FF9BAF]"
          />
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {["All", "Unread", "Pinned"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`shrink-0 rounded-lg px-3 py-2 text-[10px] font-bold transition ${
                filter === item
                  ? "bg-[#10265F] text-white"
                  : "border border-[#E7ECF6] text-[#71809D] hover:bg-[#F5F7FF]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {filteredContacts.map((contact) => {
          const lastMessage = getLastMessage(contact);
          const selected = contact.id === activeId;

          return (
            <button
              type="button"
              key={contact.id}
              onClick={() => openConversation(contact.id)}
              className={`flex w-full items-start gap-3 border-b border-[#F0F2F9] px-4 py-4 text-left transition ${
                selected
                  ? "border-l-[3px] border-l-[#FF2454] bg-[#FFF7F9]"
                  : "border-l-[3px] border-l-transparent hover:bg-[#F8FAFF]"
              }`}
            >
              <div className="relative shrink-0">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-black ${contact.color}`}
                >
                  {contact.avatar}
                </span>

                {contact.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#00B884]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-extrabold text-[#10265F]">
                    {contact.name}
                  </p>

                  {lastMessage && (
                    <span className="shrink-0 text-[9px] text-[#9AA8C2]">
                      {lastMessage.time}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-[10px] text-[#9AA8C2]">
                  {contact.role}
                </p>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="truncate text-[11px] text-[#71809D]">
                    {lastMessage?.from === "me" && (
                      <span className="mr-1 text-[#1680E8]">
                        You:
                      </span>
                    )}

                    {lastMessage?.text || "Start a conversation"}
                  </p>

                  {contact.unread > 0 && (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#FF2454] px-1 text-[9px] font-bold text-white">
                      {contact.unread}
                    </span>
                  )}
                </div>

                {contact.pinned && (
                  <span className="mt-2 inline-flex items-center gap-1 text-[9px] text-[#8A9ABB]">
                    <Pin size={10} /> Pinned
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {filteredContacts.length === 0 && (
          <div className="p-6 text-center">
            <MessageCircle
              size={26}
              className="mx-auto text-[#C0CBE0]"
            />

            <p className="mt-3 text-xs font-bold text-[#506995]">
              No conversations found
            </p>

            <p className="mt-1 text-[10px] text-[#9AA8C2]">
              Try another search or filter.
            </p>
          </div>
        )}
      </div>
    </aside>
  );

  const conversationPanel = (
    <section className="flex h-full min-h-0 flex-col bg-[#F8FAFF]">
      {activeContact ? (
        <>
          {/* CHAT HEADER */}

          <header className="flex min-h-[76px] items-center justify-between gap-3 border-b border-[#E7ECF6] bg-white px-4 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileChatOpen(false)}
                className="rounded-lg p-2 text-[#71809D] hover:bg-[#F5F7FF] lg:hidden"
                aria-label="Back to conversations"
              >
                <ChevronLeft size={21} />
              </button>

              <div className="relative shrink-0">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-black ${activeContact.color}`}
                >
                  {activeContact.avatar}
                </span>

                {activeContact.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#00B884]" />
                )}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-sm font-black text-[#10265F]">
                  {activeContact.name}
                </h2>

                <p className="mt-1 flex items-center gap-1.5 text-[10px] text-[#71809D]">
                  {activeContact.online ? (
                    <>
                      <Circle
                        size={7}
                        fill="#00B884"
                        className="text-[#00B884]"
                      />
                      Online
                    </>
                  ) : (
                    <>
                      <Clock size={11} /> Offline
                    </>
                  )}

                  <span>·</span>
                  {activeContact.role}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setNotice(
                    "Voice calling is a UI preview. Connect a calling service to enable calls."
                  )
                }
                aria-label="Voice call"
                className="hidden rounded-xl p-2.5 text-[#71809D] transition hover:bg-[#F5F7FF] hover:text-[#FF2454] sm:block"
              >
                <Phone size={18} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setNotice(
                    "Video calling is a UI preview. Connect a video service to enable calls."
                  )
                }
                aria-label="Video call"
                className="hidden rounded-xl p-2.5 text-[#71809D] transition hover:bg-[#F5F7FF] hover:text-[#FF2454] sm:block"
              >
                <Video size={19} />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setShowContactMenu((previous) => !previous)
                  }
                  aria-label="Conversation options"
                  className="rounded-xl p-2.5 text-[#71809D] transition hover:bg-[#F5F7FF]"
                >
                  <MoreVertical size={19} />
                </button>

                {showContactMenu && (
                  <div className="absolute right-0 top-12 z-30 w-48 rounded-xl border border-[#E7ECF6] bg-white p-2 shadow-xl">
                    <button
                      type="button"
                      onClick={togglePinned}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#506995] hover:bg-[#F5F7FF]"
                    >
                      <Pin size={14} />
                      {activeContact.pinned
                        ? "Unpin conversation"
                        : "Pin conversation"}
                    </button>

                    <button
                      type="button"
                      onClick={deleteConversation}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#E92350] hover:bg-[#FFF0F3]"
                    >
                      <Trash2 size={14} /> Remove conversation
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* CHAT MESSAGES */}

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-5 sm:px-6">
            <div className="mx-auto mb-5 max-w-sm rounded-xl border border-[#E7ECF6] bg-white px-4 py-3 text-center">
              <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF0F3] text-[#FF2454]">
                <ShieldIcon />
              </span>

              <p className="mt-2 text-[10px] font-bold text-[#506995]">
                Your learning conversation
              </p>

              <p className="mt-1 text-[10px] leading-4 text-[#9AA8C2]">
                This is a local UI demo. Messages are not sent to a real trainer.
              </p>
            </div>

            {activeContact.messages.map((item, index) => {
              const mine = item.from === "me";
              const previous = activeContact.messages[index - 1];

              const showDate =
                !previous ||
                previous.time === "Yesterday" ||
                (item.time !== "Yesterday" &&
                  previous.time === "Yesterday");

              return (
                <React.Fragment key={item.id}>
                  {showDate && (
                    <div className="my-3 flex justify-center">
                      <span className="rounded-full border border-[#E7ECF6] bg-white px-3 py-1.5 text-[9px] font-semibold text-[#9AA8C2]">
                        {item.time === "Yesterday"
                          ? "Yesterday"
                          : "Today"}
                      </span>
                    </div>
                  )}

                  <div
                    className={`mb-3 flex items-end gap-2 ${
                      mine ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!mine && (
                      <span
                        className={`mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-black ${activeContact.color}`}
                      >
                        {activeContact.avatar}
                      </span>
                    )}

                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
                        mine
                          ? "rounded-br-sm bg-[#10265F] text-white"
                          : "rounded-bl-sm border border-[#E7ECF6] bg-white text-[#10265F]"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words text-xs leading-5">
                        {item.text}
                      </p>

                      <div
                        className={`mt-2 flex items-center justify-end gap-1.5 text-[9px] ${
                          mine ? "text-white/60" : "text-[#9AA8C2]"
                        }`}
                      >
                        {item.time}

                        {mine &&
                          (item.read ? (
                            <CheckCheck
                              size={13}
                              className="text-[#80D8FF]"
                            />
                          ) : (
                            <Check size={13} />
                          ))}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            <div ref={messageEndRef} />
          </div>

          {/* QUICK REPLIES */}

          <div className="border-t border-[#E7ECF6] bg-white px-3 pt-3 sm:px-5">
            <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="shrink-0 text-[10px] font-bold text-[#9AA8C2]">
                Quick reply:
              </span>

              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => handleQuickReply(reply)}
                  className="shrink-0 rounded-full border border-[#E7ECF6] px-3 py-1.5 text-[10px] font-semibold text-[#506995] transition hover:border-[#FF9BAF] hover:bg-[#FFF7F9]"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* MESSAGE COMPOSER */}

            <form
              onSubmit={sendMessage}
              className="flex items-end gap-2 pb-4"
            >
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setAttachmentMenu((previous) => !previous)
                  }
                  aria-label="Add attachment"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E7ECF6] text-[#71809D] transition hover:bg-[#F5F7FF]"
                >
                  <Paperclip size={18} />
                </button>

                {attachmentMenu && (
                  <div className="absolute bottom-14 left-0 z-30 w-44 rounded-xl border border-[#E7ECF6] bg-white p-2 shadow-xl">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#506995] hover:bg-[#F5F7FF]"
                    >
                      <FileText size={15} /> Attach a file
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setNotice(
                          "Image sharing requires backend upload integration."
                        );
                        setAttachmentMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#506995] hover:bg-[#F5F7FF]"
                    >
                      <Image size={15} /> Share an image
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

              <div className="flex min-w-0 flex-1 items-end rounded-xl border border-[#E7ECF6] bg-[#F8FAFF] px-3 transition focus-within:border-[#FF9BAF]">
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
                  placeholder="Type your message..."
                  className="max-h-28 min-h-[42px] flex-1 resize-y bg-transparent py-3 text-xs leading-5 text-[#10265F] outline-none placeholder:text-[#9AA8C2]"
                />

                <button
                  type="button"
                  onClick={() => handleQuickReply("😊")}
                  aria-label="Insert smiley"
                  className="mb-1 flex h-9 w-8 shrink-0 items-center justify-center text-[#9AA8C2] transition hover:text-[#FF2454]"
                >
                  <Smile size={18} />
                </button>
              </div>

              <button
                type="submit"
                disabled={!message.trim()}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF2454] text-white shadow-md shadow-rose-100 transition hover:bg-[#E81745] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={17} />
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#FF2454]">
            <MessageCircle size={30} />
          </span>

          <h2 className="mt-4 text-lg font-black">
            No conversation selected
          </h2>

          <p className="mt-2 max-w-xs text-xs leading-5 text-[#71809D]">
            Start a new conversation or choose one from your message list.
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
          html.dark .chat-page {
            color: #FFF8FA;
          }

          html.dark .chat-page [class*="bg-white"],
          html.dark .chat-page [class*="bg-[#F8FAFF]"],
          html.dark .chat-page [class*="bg-[#FFF7F9]"],
          html.dark .chat-page [class*="bg-[#FFF5F7]"] {
            background-color: #211e27 !important;
          }

          html.dark .chat-page [class*="border-[#E7ECF6]"],
          html.dark .chat-page [class*="border-[#F0F2F9]"],
          html.dark .chat-page [class*="border-[#E2E8F5]"] {
            border-color: #49333D !important;
          }

          html.dark .chat-page [class*="text-[#10265F]"],
          html.dark .chat-page [class*="text-[#506995]"] {
            color: #FFF8FA !important;
          }

          html.dark .chat-page [class*="text-[#71809D]"],
          html.dark .chat-page [class*="text-[#9AA8C2]"] {
            color: #C1B5C0 !important;
          }

          html.dark .chat-page [class*="hover:bg-[#F5F7FF]"]:hover,
          html.dark .chat-page [class*="hover:bg-[#F8FAFF]"]:hover {
            background-color: #30232B !important;
          }

          html.dark .chat-page input,
          html.dark .chat-page textarea,
          html.dark .chat-page select {
            color: #FFF8FA !important;
            background-color: #30232B;
            border-color: #49333D !important;
          }

          html.dark .chat-page input::placeholder,
          html.dark .chat-page textarea::placeholder {
            color: #A99AA5 !important;
          }

          html.dark .chat-page option {
            color: #FFF8FA;
            background: #211e27;
          }

          html.dark .chat-page [class*="bg-[#FFF0F3]"] {
            background-color: #3a2630 !important;
          }

          html.dark .chat-page [class*="border-[#F6D4DC]"] {
            border-color: #68404d !important;
          }

          html.dark .chat-page [class*="text-[#A51D42]"] {
            color: #ff9caf !important;
          }

          html.dark .chat-page [class*="border-l-[#FF2454]"] {
            border-left-color: #FF456C !important;
          }
        `}</style>

        {/* PAGE HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#FF2454]">
              <MessageCircle size={14} /> Student communication
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#10265F] sm:text-3xl">
              Chat & Messages
            </h1>

            <p className="mt-2 text-xs leading-5 text-[#71809D]">
              Ask questions, discuss practice and stay connected with your learning team.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowNewChat(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-xs font-bold text-white shadow-md shadow-rose-100 transition hover:bg-[#E81745]"
          >
            <Plus size={16} /> New message
          </button>
        </div>

        {notice && (
          <div className="flex items-start gap-2 rounded-xl border border-[#F6D4DC] bg-[#FFF5F7] p-3 text-xs text-[#A51D42]">
            <MessageCircle size={15} className="mt-0.5 shrink-0" />

            <p>{notice}</p>

            <button
              type="button"
              onClick={() => setNotice("")}
              className="ml-auto"
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* SUMMARY STRIP */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-[#E7ECF6] bg-white p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF2454]">
              <MessageCircle size={19} />
            </span>

            <div>
              <p className="text-xl font-black text-[#10265F]">
                {contacts.length}
              </p>

              <p className="text-[10px] text-[#71809D]">
                Conversations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#E7ECF6] bg-white p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F9F1] text-[#00A879]">
              <Circle size={17} fill="currentColor" />
            </span>

            <div>
              <p className="text-xl font-black text-[#10265F]">
                {contacts.filter((contact) => contact.online).length}
              </p>

              <p className="text-[10px] text-[#71809D]">
                Online now
              </p>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-3 rounded-2xl border border-[#E7ECF6] bg-white p-4 sm:col-span-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#1680E8]">
              <Users size={19} />
            </span>

            <div>
              <p className="text-xl font-black text-[#10265F]">
                {contacts.reduce(
                  (total, contact) => total + contact.unread,
                  0
                )}
              </p>

              <p className="text-[10px] text-[#71809D]">
                Unread messages
              </p>
            </div>
          </div>
        </div>

        {/* CHAT WINDOW */}

        <div className="h-[650px] overflow-hidden rounded-2xl border border-[#E7ECF6] bg-white shadow-[0_3px_14px_rgba(16,38,95,0.035)]">
          <div className="grid h-full grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div
              className={`h-full min-h-0 border-r border-[#E7ECF6] ${
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

        {/* LEARNING SHORTCUTS */}

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate("/live-speaking")}
            className="flex items-center gap-4 rounded-2xl border border-[#E7ECF6] bg-white p-4 text-left transition hover:border-[#FF9BAF] hover:shadow-sm"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF2454]">
              <Headphones size={21} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-extrabold text-[#10265F]">
                Live Speaking Practice
              </span>

              <span className="mt-1 block text-[11px] text-[#71809D]">
                Improve your fluency and confidence
              </span>
            </span>

            <ChevronLeft
              size={18}
              className="rotate-180 text-[#9AA8C2]"
            />
          </button>

          <button
            type="button"
            onClick={() => navigate("/study-resources")}
            className="flex items-center gap-4 rounded-2xl border border-[#E7ECF6] bg-white p-4 text-left transition hover:border-[#FF9BAF] hover:shadow-sm"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#1680E8]">
              <BookOpen size={21} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-extrabold text-[#10265F]">
                Study Resources
              </span>

              <span className="mt-1 block text-[11px] text-[#71809D]">
                Explore IELTS learning materials
              </span>
            </span>

            <ChevronLeft
              size={18}
              className="rotate-180 text-[#9AA8C2]"
            />
          </button>
        </div>
      </div>

      {/* NEW CONVERSATION MODAL */}

      {showNewChat && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#081633]/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={createConversation}
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FF2454]">
                  Messages
                </p>

                <h2 className="mt-2 text-xl font-black text-[#10265F]">
                  New conversation
                </h2>

                <p className="mt-1 text-xs text-[#71809D]">
                  Create a local demo chat contact.
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

            <label
              htmlFor="contact-name"
              className="mt-5 block text-xs font-bold text-[#10265F]"
            >
              Contact name
            </label>

            <input
              id="contact-name"
              type="text"
              value={newChatName}
              onChange={(event) => setNewChatName(event.target.value)}
              placeholder="Enter a name"
              required
              maxLength={60}
              className="mt-2 w-full rounded-xl border border-[#E2E8F5] px-3 py-3 text-sm outline-none focus:border-[#FF8199]"
            />

            <label
              htmlFor="contact-role"
              className="mt-4 block text-xs font-bold text-[#10265F]"
            >
              Contact type
            </label>

            <select
              id="contact-role"
              value={newChatRole}
              onChange={(event) => setNewChatRole(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E2E8F5] bg-white px-3 py-3 text-sm outline-none focus:border-[#FF8199]"
            >
              <option>Study partner</option>
              <option>Trainer</option>
              <option>Support team</option>
              <option>Study group</option>
            </select>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowNewChat(false)}
                className="flex-1 rounded-xl border border-[#E2E8F5] px-4 py-3 text-sm font-bold text-[#506995]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#E81745]"
              >
                <Plus size={16} /> Create chat
              </button>
            </div>
          </form>
        </div>
      )}
    </StudentLayout>
  );
}

function ShieldIcon() {
  return <Sparkles size={15} />;
}