
import React, { useMemo, useRef, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import {
  BookOpen,
  Search,
  Plus,
  Headphones,
  FileText,
  CircleCheck,
  Clock,
  MoreVertical,
  Upload,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Filter,
  CheckCircle2,
  AlertCircle,
  Volume2,
  ListChecks,
  BookMarked,
  ClipboardCheck,
} from "lucide-react";

const initialBooks = Array.from({ length: 21 }, (_, index) => ({
  id: index + 1,
  title: `Cambridge IELTS ${index + 1}`,
  tests: 4,
  modules: 4,
  passages: 12,
  questions: 160,
  status:
    index < 14
      ? "Published"
      : index < 18
        ? "Draft"
        : "In Progress",
  updated: `${26 - (index % 20)} Oct 2026`,
}));

const initialContent = [
  {
    id: 1,
    book: "Cambridge IELTS 18",
    test: "Test 1",
    module: "Reading",
    title: "The development of the bicycle",
    type: "Passage",
    questions: 13,
    status: "Published",
  },
  {
    id: 2,
    book: "Cambridge IELTS 18",
    test: "Test 1",
    module: "Listening",
    title: "Section 1 - Student accommodation",
    type: "Audio",
    questions: 10,
    status: "Published",
  },
  {
    id: 3,
    book: "Cambridge IELTS 19",
    test: "Test 2",
    module: "Reading",
    title: "The history of glass",
    type: "Passage",
    questions: 13,
    status: "Draft",
  },
  {
    id: 4,
    book: "Cambridge IELTS 20",
    test: "Test 1",
    module: "Writing",
    title: "Academic writing task 1",
    type: "Question",
    questions: 2,
    status: "In Progress",
  },
  {
    id: 5,
    book: "Cambridge IELTS 21",
    test: "Test 1",
    module: "Speaking",
    title: "Part 2 - Describe an experience",
    type: "Question",
    questions: 3,
    status: "Draft",
  },
];

const blankForm = {
  book: "Cambridge IELTS 21",
  test: "Test 1",
  module: "Reading",
  title: "",
  type: "Passage",
  questions: "13",
  status: "Draft",
  explanation: "",
  acceptedAnswers: "",
};

/* =====================================
   DARK MODE STYLES
===================================== */

const darkModeStyles = `
  html.dark .cambridge-content-manager,
  html[data-theme="dark"] .cambridge-content-manager {
    background-color: #17151B;
    color: #FFFFFF;
  }

  html.dark .cambridge-content-manager [class~="bg-white"],
  html[data-theme="dark"] .cambridge-content-manager [class~="bg-white"] {
    background-color: #211E27 !important;
  }

  html.dark .cambridge-content-manager [class*="bg-[#F5F7FF]"],
  html.dark .cambridge-content-manager [class*="bg-[#FBFCFF]"],
  html.dark .cambridge-content-manager [class*="bg-[#F8FAFF]"],
  html[data-theme="dark"] .cambridge-content-manager [class*="bg-[#F5F7FF]"],
  html[data-theme="dark"] .cambridge-content-manager [class*="bg-[#FBFCFF]"],
  html[data-theme="dark"] .cambridge-content-manager [class*="bg-[#F8FAFF]"] {
    background-color: #19171E !important;
  }

  html.dark .cambridge-content-manager [class*="border-[#E9EEFA]"],
  html.dark .cambridge-content-manager [class*="border-[#E4EAF8]"],
  html.dark .cambridge-content-manager [class*="border-[#EEF2FA]"],
  html.dark .cambridge-content-manager [class*="border-slate-100"],
  html.dark .cambridge-content-manager [class*="border-slate-200"],
  html[data-theme="dark"] .cambridge-content-manager [class*="border-[#E9EEFA]"],
  html[data-theme="dark"] .cambridge-content-manager [class*="border-[#E4EAF8]"],
  html[data-theme="dark"] .cambridge-content-manager [class*="border-[#EEF2FA]"],
  html[data-theme="dark"] .cambridge-content-manager [class*="border-slate-100"],
  html[data-theme="dark"] .cambridge-content-manager [class*="border-slate-200"] {
    border-color: #3B3441 !important;
  }

  html.dark .cambridge-content-manager [class*="text-[#10265F]"],
  html[data-theme="dark"] .cambridge-content-manager [class*="text-[#10265F]"] {
    color: #FFFFFF !important;
  }

  html.dark .cambridge-content-manager [class*="text-[#7183A7]"],
  html.dark .cambridge-content-manager [class*="text-[#8A9ABB]"],
  html.dark .cambridge-content-manager [class*="text-[#506995]"],
  html.dark .cambridge-content-manager [class*="text-[#9AA8C2]"],
  html[data-theme="dark"] .cambridge-content-manager [class*="text-[#7183A7]"],
  html[data-theme="dark"] .cambridge-content-manager [class*="text-[#8A9ABB]"],
  html[data-theme="dark"] .cambridge-content-manager [class*="text-[#506995]"],
  html[data-theme="dark"] .cambridge-content-manager [class*="text-[#9AA8C2]"] {
    color: #B0A5BD !important;
  }

  html.dark .cambridge-content-manager input:not([type="file"]),
  html.dark .cambridge-content-manager select,
  html.dark .cambridge-content-manager textarea,
  html[data-theme="dark"] .cambridge-content-manager input:not([type="file"]),
  html[data-theme="dark"] .cambridge-content-manager select,
  html[data-theme="dark"] .cambridge-content-manager textarea {
    background-color: #19171E;
    color: #FFFFFF;
    border-color: #3B3441;
  }

  html.dark .cambridge-content-manager input::placeholder,
  html.dark .cambridge-content-manager textarea::placeholder,
  html[data-theme="dark"] .cambridge-content-manager input::placeholder,
  html[data-theme="dark"] .cambridge-content-manager textarea::placeholder {
    color: #8F8499;
  }

  html.dark .cambridge-content-manager option,
  html[data-theme="dark"] .cambridge-content-manager option {
    background-color: #211E27;
    color: #FFFFFF;
  }

  html.dark .cambridge-content-manager thead,
  html[data-theme="dark"] .cambridge-content-manager thead {
    background-color: #19171E !important;
  }

  html.dark .cambridge-content-manager tbody tr:hover,
  html[data-theme="dark"] .cambridge-content-manager tbody tr:hover {
    background-color: #29242F !important;
  }

  html.dark .cambridge-content-manager [class*="divide-slate-100"] > :not(:last-child),
  html[data-theme="dark"] .cambridge-content-manager [class*="divide-slate-100"] > :not(:last-child) {
    border-color: #3B3441;
  }

  html.dark .cambridge-content-manager [class*="hover:bg-slate-50"]:hover,
  html.dark .cambridge-content-manager [class*="hover:bg-slate-100"]:hover,
  html[data-theme="dark"] .cambridge-content-manager [class*="hover:bg-slate-50"]:hover,
  html[data-theme="dark"] .cambridge-content-manager [class*="hover:bg-slate-100"]:hover {
    background-color: #302A36 !important;
  }

  html.dark .cambridge-content-manager .fixed.inset-0 form,
  html.dark .cambridge-content-manager .fixed.inset-0 > div > div,
  html[data-theme="dark"] .cambridge-content-manager .fixed.inset-0 form,
  html[data-theme="dark"] .cambridge-content-manager .fixed.inset-0 > div > div {
    background-color: #211E27 !important;
    color: #FFFFFF;
  }

  html.dark .cambridge-content-manager form .sticky,
  html.dark .cambridge-content-manager form > div:last-child,
  html[data-theme="dark"] .cambridge-content-manager form .sticky,
  html[data-theme="dark"] .cambridge-content-manager form > div:last-child {
    background-color: #19171E !important;
    border-color: #3B3441 !important;
  }

  html.dark .cambridge-content-manager [class*="rounded-xl"][class*="bg-[#F5F7FF]"],
  html[data-theme="dark"] .cambridge-content-manager [class*="rounded-xl"][class*="bg-[#F5F7FF]"] {
    background-color: #19171E !important;
  }

  html.dark .cambridge-content-manager [class*="border-dashed"],
  html[data-theme="dark"] .cambridge-content-manager [class*="border-dashed"] {
    border-color: #514657 !important;
  }

  html.dark .cambridge-content-manager [class*="text-[#FF2454]"],
  html[data-theme="dark"] .cambridge-content-manager [class*="text-[#FF2454]"] {
    color: #FF2454;
  }
`;

function StatCard({ icon: Icon, title, value, note, color }) {
  const styles = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/40",
    pink: "bg-rose-50 text-[#FF2454] dark:bg-rose-950/30",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30",
  };

  return (
    <div className="rounded-2xl border border-[#E9EEFA] bg-white p-4 shadow-sm sm:p-5 dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-[#7183A7] sm:text-sm dark:text-[#B0A5BD]">
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-[#10265F] dark:text-white">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles[color]}`}
        >
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-3 text-[11px] text-[#8A9ABB] dark:text-[#B0A5BD]">
        {note}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Published: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    Draft: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    "In Progress": "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
      }`}
    >
      {status}
    </span>
  );
}

export default function CambridgeContentManager() {
  const [books, setBooks] = useState(initialBooks);
  const [content, setContent] = useState(initialContent);
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState("All Books");
  const [selectedModule, setSelectedModule] = useState("All Modules");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [message, setMessage] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [answerFile, setAnswerFile] = useState(null);
  const [contentText, setContentText] = useState("");

  const audioInputRef = useRef(null);
  const answerInputRef = useRef(null);

  const filteredContent = useMemo(() => {
    const query = search.toLowerCase().trim();

    return content.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.book.toLowerCase().includes(query) ||
        item.test.toLowerCase().includes(query);

      const matchesBook =
        selectedBook === "All Books" || item.book === selectedBook;

      const matchesModule =
        selectedModule === "All Modules" ||
        item.module === selectedModule;

      const matchesStatus =
        selectedStatus === "All Statuses" ||
        item.status === selectedStatus;

      return (
        matchesSearch &&
        matchesBook &&
        matchesModule &&
        matchesStatus
      );
    });
  }, [content, search, selectedBook, selectedModule, selectedStatus]);

  const publishedCount = content.filter(
    (item) => item.status === "Published"
  ).length;

  const draftCount = content.filter(
    (item) => item.status === "Draft"
  ).length;

  const openCreateModal = () => {
    setEditingId(null);
    setForm(blankForm);
    setAudioFile(null);
    setAnswerFile(null);
    setContentText("");
    setMessage("");
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);

    setForm({
      ...blankForm,
      book: item.book,
      test: item.test,
      module: item.module,
      title: item.title,
      type: item.type,
      questions: String(item.questions),
      status: item.status,
    });

    setAudioFile(null);
    setAnswerFile(null);
    setContentText("");
    setMessage("");
    setModalOpen(true);
  };

  const updateForm = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setMessage("Please enter a content title.");
      return;
    }

    const itemData = {
      book: form.book,
      test: form.test,
      module: form.module,
      title: form.title.trim(),
      type: form.type,
      questions: Math.max(0, Number(form.questions) || 0),
      status: form.status,
    };

    if (editingId !== null) {
      setContent((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? { ...item, ...itemData }
            : item
        )
      );
    } else {
      setContent((previous) => [
        { id: Date.now(), ...itemData },
        ...previous,
      ]);
    }

    setModalOpen(false);
    setMessage("");
    setAudioFile(null);
    setAnswerFile(null);
  };

  const changeStatus = (id, status) => {
    setContent((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const deleteContent = (id) => {
    const confirmed = window.confirm(
      "Delete this content item?"
    );

    if (!confirmed) return;

    setContent((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  const publishBook = (id) => {
    setBooks((previous) =>
      previous.map((book) =>
        book.id === id
          ? { ...book, status: "Published" }
          : book
      )
    );
  };

  const exportCSV = () => {
    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = [
      [
        "Book",
        "Test",
        "Module",
        "Title",
        "Type",
        "Questions",
        "Status",
      ],
      ...filteredContent.map((item) => [
        item.book,
        item.test,
        item.module,
        item.title,
        item.type,
        item.questions,
        item.status,
      ]),
    ];

    const csv = rows
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "cambridge-content.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="cambridge-content-manager min-h-screen overflow-x-hidden bg-[#F5F7FF] dark:bg-[#17151B]">
      <style>{darkModeStyles}</style>

      <Sidebar />

      {/* Main content: left margin keeps it clear of the fixed sidebar */}
      <div className="flex min-h-screen min-w-0 flex-col lg:ml-[260px]">
        <Navbar />

        <main className="min-w-0 flex-1 space-y-5 overflow-x-hidden p-4 sm:p-5 lg:p-6">
          {/* Header */}
          <section className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-[#7183A7] dark:text-[#B0A5BD]">
                <span>Super Admin</span>
                <span>›</span>
                <span className="text-[#10265F] dark:text-white">
                  Cambridge Content Manager
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-[#10265F] sm:text-3xl dark:text-white">
                Cambridge{" "}
                <span className="text-[#FF2454]">
                  Content Manager
                </span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7183A7] dark:text-[#B0A5BD]">
                Manage books, tests, modules, passages, questions,
                listening audio and answer keys.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-rose-100 transition hover:bg-rose-600"
            >
              <Plus size={17} />
              Add Content
            </button>
          </section>

          {message && !modalOpen && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
              {message}
            </div>
          )}

          {/* Stats */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={BookOpen}
              title="Cambridge Books"
              value={books.length}
              note="Books 1–21 in the catalog"
              color="blue"
            />

            <StatCard
              icon={CircleCheck}
              title="Published Content"
              value={publishedCount}
              note="Content items currently published"
              color="green"
            />

            <StatCard
              icon={Clock}
              title="Draft Items"
              value={draftCount}
              note="Awaiting content review"
              color="pink"
            />

            <StatCard
              icon={ClipboardCheck}
              title="Content Items"
              value={content.length}
              note="Sample entries in this demo"
              color="purple"
            />
          </section>

          {/* Book library */}
          <section className="rounded-2xl border border-[#E9EEFA] bg-white p-4 shadow-sm sm:p-5 dark:border-[#3B3441] dark:bg-[#211E27]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#10265F] dark:text-white">
                  Cambridge Book Library
                </h2>

                <p className="mt-1 text-xs text-[#8A9ABB] dark:text-[#B0A5BD]">
                  Select a book to filter its content.
                </p>
              </div>

              <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                Books 1–21
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="rounded-xl border border-[#E9EEFA] p-4 transition hover:border-blue-200 hover:shadow-sm dark:border-[#3B3441] dark:hover:border-blue-800"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                      <BookOpen size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-[#10265F] dark:text-white">
                        {book.title}
                      </h3>

                      <p className="mt-1 text-[11px] text-[#8A9ABB] dark:text-[#B0A5BD]">
                        {book.tests} tests · {book.modules} modules
                      </p>

                      <div className="mt-2">
                        <StatusBadge status={book.status} />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedBook(book.title)}
                      title={`View ${book.title} content`}
                      className="rounded-lg p-2 text-[#7183A7] hover:bg-blue-50 hover:text-blue-600 dark:text-[#B0A5BD] dark:hover:bg-blue-950/40"
                    >
                      <Eye size={16} />
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-[#3B3441]">
                    <div>
                      <p className="text-[10px] text-[#8A9ABB] dark:text-[#B0A5BD]">
                        Passages
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#10265F] dark:text-white">
                        {book.passages}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-[#8A9ABB] dark:text-[#B0A5BD]">
                        Questions
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#10265F] dark:text-white">
                        {book.questions}
                      </p>
                    </div>
                  </div>

                  {book.status !== "Published" && (
                    <button
                      type="button"
                      onClick={() => publishBook(book.id)}
                      className="mt-3 w-full rounded-lg border border-emerald-100 bg-emerald-50 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400"
                    >
                      Mark Book Published
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Content management table */}
          <section className="overflow-hidden rounded-2xl border border-[#E9EEFA] bg-white shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]">
            <div className="flex flex-wrap items-start justify-between gap-3 p-4 sm:p-5">
              <div>
                <h2 className="text-base font-bold text-[#10265F] dark:text-white">
                  Tests, Passages & Questions
                </h2>

                <p className="mt-1 text-xs text-[#8A9ABB] dark:text-[#B0A5BD]">
                  Manage content, review status and answer materials.
                </p>
              </div>

              <button
                type="button"
                onClick={exportCSV}
                className="rounded-xl border border-[#E4EAF8] px-3 py-2 text-xs font-semibold text-[#506995] hover:bg-slate-50 dark:border-[#3B3441] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
              >
                Export CSV
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 border-y border-[#EEF2FA] bg-[#FBFCFF] p-4 md:grid-cols-2 xl:grid-cols-4 dark:border-[#3B3441] dark:bg-[#19171E]">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9ABB]"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search content..."
                  className="w-full rounded-xl border border-[#E4EAF8] bg-white py-2.5 pl-9 pr-3 text-xs outline-none focus:border-blue-300 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-white"
                />
              </div>

              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="rounded-xl border border-[#E4EAF8] bg-white px-3 py-2.5 text-xs text-[#506995] outline-none dark:border-[#3B3441] dark:bg-[#211E27] dark:text-white"
              >
                <option>All Books</option>
                {books.map((book) => (
                  <option key={book.id}>{book.title}</option>
                ))}
              </select>

              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="rounded-xl border border-[#E4EAF8] bg-white px-3 py-2.5 text-xs text-[#506995] outline-none dark:border-[#3B3441] dark:bg-[#211E27] dark:text-white"
              >
                <option>All Modules</option>
                <option>Listening</option>
                <option>Reading</option>
                <option>Writing</option>
                <option>Speaking</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-xl border border-[#E4EAF8] bg-white px-3 py-2.5 text-xs text-[#506995] outline-none dark:border-[#3B3441] dark:bg-[#211E27] dark:text-white"
              >
                <option>All Statuses</option>
                <option>Published</option>
                <option>Draft</option>
                <option>In Progress</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#F8FAFF] dark:bg-[#19171E]">
                  <tr className="text-[11px] font-semibold uppercase tracking-wide text-[#8A9ABB] dark:text-[#B0A5BD]">
                    <th className="px-5 py-4">Content</th>
                    <th className="px-4 py-4">Book / Test</th>
                    <th className="px-4 py-4">Module</th>
                    <th className="px-4 py-4">Type</th>
                    <th className="px-4 py-4">Questions</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-[#3B3441]">
                  {filteredContent.map((item) => (
                    <tr
                      key={item.id}
                      className="transition hover:bg-[#FBFCFF] dark:hover:bg-[#29242F]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            {item.type === "Audio" ? (
                              <Headphones size={17} />
                            ) : item.type === "Passage" ? (
                              <FileText size={17} />
                            ) : (
                              <ListChecks size={17} />
                            )}
                          </div>

                          <div>
                            <p className="max-w-[240px] text-xs font-bold text-[#10265F] dark:text-white">
                              {item.title}
                            </p>

                            <p className="mt-1 text-[10px] text-[#8A9ABB] dark:text-[#B0A5BD]">
                              ID: {item.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-xs font-semibold text-[#10265F] dark:text-white">
                          {item.book}
                        </p>

                        <p className="mt-1 text-[10px] text-[#8A9ABB] dark:text-[#B0A5BD]">
                          {item.test}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-xs text-[#506995] dark:text-[#B0A5BD]">
                        {item.module}
                      </td>

                      <td className="px-4 py-4 text-xs text-[#506995] dark:text-[#B0A5BD]">
                        {item.type}
                      </td>

                      <td className="px-4 py-4 text-xs font-semibold text-[#10265F] dark:text-white">
                        {item.questions}
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setPreviewItem(item)}
                            title="Preview content"
                            className="rounded-lg p-2 text-[#7183A7] hover:bg-blue-50 hover:text-blue-600 dark:text-[#B0A5BD] dark:hover:bg-blue-950/40"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            title="Edit content"
                            className="rounded-lg p-2 text-[#7183A7] hover:bg-purple-50 hover:text-purple-600 dark:text-[#B0A5BD] dark:hover:bg-purple-950/40"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteContent(item.id)}
                            title="Delete content"
                            className="rounded-lg p-2 text-[#7183A7] hover:bg-rose-50 hover:text-[#FF2454] dark:text-[#B0A5BD] dark:hover:bg-rose-950/30"
                          >
                            <Trash2 size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              changeStatus(
                                item.id,
                                item.status === "Published"
                                  ? "Draft"
                                  : "Published"
                              )
                            }
                            title={
                              item.status === "Published"
                                ? "Unpublish"
                                : "Publish"
                            }
                            className="rounded-lg p-2 text-[#7183A7] hover:bg-emerald-50 hover:text-emerald-600 dark:text-[#B0A5BD] dark:hover:bg-emerald-950/30"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredContent.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <Search size={25} className="text-slate-300" />

                          <p className="mt-3 text-sm font-semibold text-[#10265F] dark:text-white">
                            No content found
                          </p>

                          <p className="mt-1 text-xs text-[#8A9ABB] dark:text-[#B0A5BD]">
                            Try changing your filters or add new content.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 dark:border-[#3B3441]">
              <p className="text-xs text-[#8A9ABB] dark:text-[#B0A5BD]">
                Showing {filteredContent.length} of {content.length} content
                items
              </p>

              <div className="flex items-center gap-2 text-xs text-[#506995] dark:text-[#B0A5BD]">
                <button
                  type="button"
                  disabled
                  className="rounded-lg border border-slate-200 p-2 text-slate-300 dark:border-[#3B3441]"
                >
                  <ChevronLeft size={15} />
                </button>

                <span className="rounded-lg bg-[#10265F] px-3 py-2 font-semibold text-white">
                  1
                </span>

                <button
                  type="button"
                  disabled
                  className="rounded-lg border border-slate-200 p-2 text-slate-300 dark:border-[#3B3441]"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </section>

          {/* Content validation */}
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <div>
                <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400">
                  Content Validation
                </h3>

                <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-300">
                  Check question counts, answer keys, accepted answers and
                  explanations before publishing content.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
              <Volume2
                size={20}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>
                <h3 className="text-sm font-bold text-blue-800 dark:text-blue-400">
                  Listening Audio & Answer Keys
                </h3>

                <p className="mt-1 text-xs leading-5 text-blue-700 dark:text-blue-300">
                  Attach audio and answer-key files while creating or editing
                  a content entry. Permanent file storage needs backend
                  integration.
                </p>
              </div>
            </div>
          </section>

          <footer className="pb-2 text-center text-xs text-[#9AA8C2] dark:text-[#B0A5BD]">
            Equilx IELTS · Cambridge Content Management
          </footer>
        </main>
      </div>

      {/* Add/Edit Content Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10265F]/40 p-3 backdrop-blur-sm sm:p-5">
          <form
            onSubmit={handleSave}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-[#211E27]"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6 dark:border-[#3B3441] dark:bg-[#19171E]">
              <div>
                <h2 className="text-lg font-extrabold text-[#10265F] dark:text-white">
                  {editingId !== null
                    ? "Edit Content"
                    : "Add Cambridge Content"}
                </h2>

                <p className="mt-1 text-xs text-[#8A9ABB] dark:text-[#B0A5BD]">
                  Enter test details and content metadata.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#302A36]"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <label className="text-xs font-semibold text-[#10265F] dark:text-white">
                Cambridge Book
                <select
                  value={form.book}
                  onChange={(e) => updateForm("book", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white"
                >
                  {books.map((book) => (
                    <option key={book.id}>{book.title}</option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-semibold text-[#10265F] dark:text-white">
                Test
                <select
                  value={form.test}
                  onChange={(e) => updateForm("test", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white"
                >
                  <option>Test 1</option>
                  <option>Test 2</option>
                  <option>Test 3</option>
                  <option>Test 4</option>
                </select>
              </label>

              <label className="text-xs font-semibold text-[#10265F] dark:text-white">
                Module
                <select
                  value={form.module}
                  onChange={(e) => updateForm("module", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white"
                >
                  <option>Listening</option>
                  <option>Reading</option>
                  <option>Writing</option>
                  <option>Speaking</option>
                </select>
              </label>

              <label className="text-xs font-semibold text-[#10265F] dark:text-white">
                Content Type
                <select
                  value={form.type}
                  onChange={(e) => updateForm("type", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white"
                >
                  <option>Passage</option>
                  <option>Audio</option>
                  <option>Question</option>
                  <option>Answer Key</option>
                </select>
              </label>

              <label className="text-xs font-semibold text-[#10265F] sm:col-span-2 dark:text-white">
                Content Title
                <input
                  required
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  placeholder="Enter passage, section or question title"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white"
                />
              </label>

              <label className="text-xs font-semibold text-[#10265F] dark:text-white">
                Number of Questions
                <input
                  type="number"
                  min="0"
                  value={form.questions}
                  onChange={(e) => updateForm("questions", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white"
                />
              </label>

              <label className="text-xs font-semibold text-[#10265F] dark:text-white">
                Content Status
                <select
                  value={form.status}
                  onChange={(e) => updateForm("status", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white"
                >
                  <option>Draft</option>
                  <option>In Progress</option>
                  <option>Published</option>
                </select>
              </label>

              <label className="text-xs font-semibold text-[#10265F] sm:col-span-2 dark:text-white">
                Content / Passage Text
                <textarea
                  rows={4}
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  placeholder="Enter passage text, question instructions or content notes..."
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white"
                />
              </label>

              <label className="text-xs font-semibold text-[#10265F] sm:col-span-2 dark:text-white">
                Question Explanation
                <textarea
                  rows={3}
                  value={form.explanation}
                  onChange={(e) => updateForm("explanation", e.target.value)}
                  placeholder="Explain why an answer is correct..."
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white"
                />
              </label>

              <label className="text-xs font-semibold text-[#10265F] sm:col-span-2 dark:text-white">
                Accepted Answers
                <textarea
                  rows={2}
                  value={form.acceptedAnswers}
                  onChange={(e) =>
                    updateForm("acceptedAnswers", e.target.value)
                  }
                  placeholder="Enter accepted answers separated by commas..."
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white"
                />
              </label>

              {form.module === "Listening" && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-[#10265F] dark:text-white">
                    Listening Audio
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 dark:border-[#514657]">
                    <Headphones size={21} className="text-purple-600" />

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#10265F] dark:text-white">
                        {audioFile?.name || "Upload listening audio"}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Audio file selected locally for this demo
                      </p>
                    </div>

                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={(e) =>
                        setAudioFile(e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => audioInputRef.current?.click()}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#506995] hover:bg-slate-50 dark:border-[#3B3441] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
                    >
                      <Upload size={14} className="mr-1 inline" />
                      Choose Audio
                    </button>
                  </div>
                </div>
              )}

              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-[#10265F] dark:text-white">
                  Answer Key File
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 dark:border-[#514657]">
                  <FileText size={21} className="text-blue-600" />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#10265F] dark:text-white">
                      {answerFile?.name || "Upload answer key"}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      PDF or document file
                    </p>
                  </div>

                  <input
                    ref={answerInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) =>
                      setAnswerFile(e.target.files?.[0] || null)
                    }
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => answerInputRef.current?.click()}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#506995] hover:bg-slate-50 dark:border-[#3B3441] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
                  >
                    <Upload size={14} className="mr-1 inline" />
                    Choose File
                  </button>
                </div>
              </div>

              {message && (
                <p className="flex items-center gap-2 text-xs text-rose-600 sm:col-span-2">
                  <AlertCircle size={15} />
                  {message}
                </p>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 bg-[#FBFCFF] px-5 py-4 sm:px-6 dark:border-[#3B3441] dark:bg-[#19171E]">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#506995] hover:bg-slate-50 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600"
              >
                <Save size={16} />
                Save Content
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10265F]/40 p-4 backdrop-blur-sm">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6 dark:bg-[#211E27]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#FF2454]">
                  CONTENT PREVIEW
                </p>

                <h2 className="mt-2 text-xl font-extrabold text-[#10265F] dark:text-white">
                  {previewItem.title}
                </h2>

                <p className="mt-2 text-xs text-[#7183A7] dark:text-[#B0A5BD]">
                  {previewItem.book} · {previewItem.test} ·{" "}
                  {previewItem.module}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#302A36]"
                aria-label="Close preview"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-[#F5F7FF] p-4 dark:bg-[#19171E]">
                <p className="text-xs font-semibold text-[#10265F] dark:text-white">
                  Content type
                </p>

                <p className="mt-1 text-sm text-[#506995] dark:text-[#B0A5BD]">
                  {previewItem.type}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 p-4 dark:border-[#3B3441]">
                <p className="text-xs font-semibold text-[#10265F] dark:text-white">
                  Question count
                </p>

                <p className="mt-1 text-sm text-[#506995] dark:text-[#B0A5BD]">
                  {previewItem.questions}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 p-4 dark:border-[#3B3441]">
                <p className="text-xs font-semibold text-[#10265F] dark:text-white">
                  Publication status
                </p>

                <div className="mt-2">
                  <StatusBadge status={previewItem.status} />
                </div>
              </div>

              <p className="text-xs leading-5 text-slate-500 dark:text-[#B0A5BD]">
                This preview shows the saved metadata. Full passage, audio
                and answer-key previews require persisted content files and
                backend integration.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPreviewItem(null)}
              className="mt-5 w-full rounded-xl bg-[#10265F] py-3 text-sm font-semibold text-white hover:bg-[#18377E]"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
