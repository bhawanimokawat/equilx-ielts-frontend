import React, { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import api from "../../api/axiosInstance.js";
import cmsService from "../../services/super-admin/cmsService.js"
import {
  BookOpen,
  Search,
  Plus,
  Headphones,
  FileText,
  CircleCheck,
  Clock,
  Eye,
  Pencil,
  ChevronRight,
  ChevronLeft,
  X,
  Save,
  Filter,
  CheckCircle2,
  AlertCircle,
  Volume2,
  ListChecks,
  BookMarked,
  ClipboardCheck,
  RefreshCw,
  Layers3,
  GraduationCap,
  FilePlus2,
  FolderOpen,
  ArrowLeft,
  Upload,
  Send,
  Loader2,
  BookCopy,
  CircleHelp,
  Archive,
  Calculator,
} from "lucide-react";

/* =========================================================
   CONSTANTS
========================================================= */

const CMS_BASE = "/cms";

const SECTIONS = [
  "LISTENING",
  "READING",
  "WRITING",
  "SPEAKING",
];

const QUESTION_TYPES = [
  "MULTIPLE_CHOICE",
  "MULTIPLE_SELECT",
  "TRUE_FALSE_NOT_GIVEN",
  "YES_NO_NOT_GIVEN",
  "SHORT_ANSWER",
  "SENTENCE_COMPLETION",
  "SUMMARY_COMPLETION",
  "NOTE_COMPLETION",
  "FORM_COMPLETION",
  "TABLE_COMPLETION",
  "MATCHING",
  "MATCHING_HEADINGS",
  "MATCHING_INFORMATION",
  "MATCHING_FEATURES",
  "MAP_LABELING",
  "DIAGRAM_LABELING",
  "FLOW_CHART_COMPLETION",
  "GAP_FILL",
  "ESSAY",
  "LETTER",
  "REPORT",
  "SPEAKING_RESPONSE",
];

const VERSION_STATUSES = [
  "DRAFT",
  "IN_REVIEW",
  "PUBLISHED",
  "ARCHIVED",
];

const CATEGORY_OPTIONS = [
  { value: "ACADEMIC", label: "Academic" },
  { value: "GENERAL_TRAINING", label: "General Training" },
];

const EMPTY_BOOK_FORM = {
  title: "",
  bookNumber: "",
  publisher: "",
  category: "ACADEMIC",
  isActive: true,
};

const EMPTY_TEST_FORM = {
  title: "",
  testNumber: 1,
  category: "ACADEMIC",
};

const EMPTY_MODULE_FORM = {
  section: "LISTENING",
  position: 1,
  durationSeconds: 1800,
  instructions: "",
};

const EMPTY_PART_FORM = {
  title: "",
  position: 1,
  instructions: "",
  audioAssetKey: "",
};

const EMPTY_GROUP_FORM = {
  title: "",
  position: 1,
  instructions: "",
  passage: "",
};

const EMPTY_QUESTION_FORM = {
  questionNumber: 1,
  questionType: "MULTIPLE_CHOICE",
  position: 1,
  marks: 1,
  content: "",
  acceptedAnswers: "",
  explanation: "",
};

const EMPTY_BAND_FORM = {
  section: "LISTENING",
  category: "ACADEMIC",
  payload: "",
};

// Adjust this template to match your backend band-conversion DTO.
const BAND_TEMPLATE = `{
  "section": "LISTENING",
  "category": "ACADEMIC",
  "mappings": [
    { "minScore": 39, "maxScore": 40, "band": 9 },
    { "minScore": 37, "maxScore": 38, "band": 8.5 }
  ]
}`;

/* =========================================================
   HELPERS
========================================================= */

const getData = (response) => response?.data?.data ?? response?.data ?? {};

// For responses coming from cmsService (it already returns response.data)
const unwrap = (response, key) => {
  const data = response?.data ?? response ?? {};
  return data?.[key] || data;
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

const getArray = (value) => (Array.isArray(value) ? value : []);

const formatStatus = (status = "DRAFT") =>
  String(status)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatSection = (section = "") =>
  String(section)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());

const getVersionStatusStyle = (status) => {
  const styles = {
    PUBLISHED:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    DRAFT:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    IN_REVIEW:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    ARCHIVED:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  };

  return styles[status] || styles.DRAFT;
};

const getBookName = (book) =>
  book?.title || `Cambridge Book ${book?.bookNumber || ""}`;

const extractItems = (data, key) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const parseJsonField = (value, fallback = {}) => {
  if (!value?.trim()) return fallback;

  try {
    return JSON.parse(value);
  } catch {
    throw new Error("Please enter valid JSON.");
  }
};

const stringifyJson = (value) =>
  value ? JSON.stringify(value, null, 2) : "";

/* =========================================================
   DARK MODE STYLES
========================================================= */

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

  html.dark .cambridge-content-manager input:not([type="checkbox"]),
  html.dark .cambridge-content-manager select,
  html.dark .cambridge-content-manager textarea,
  html[data-theme="dark"] .cambridge-content-manager input:not([type="checkbox"]),
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

  html.dark .cambridge-content-manager .cms-modal,
  html[data-theme="dark"] .cambridge-content-manager .cms-modal {
    background-color: #211E27 !important;
    color: #FFFFFF;
  }
`;

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function StatCard({ icon: Icon, title, value, note, color = "blue" }) {
  const styles = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/40",
    pink: "bg-rose-50 text-[#FF2454] dark:bg-rose-950/30",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30",
  };

  return (
    <div className="rounded-2xl border border-[#E9EEFA] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-[#7183A7] dark:text-[#B0A5BD]">
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-[#10265F] dark:text-white">
            {value}
          </h3>
        </div>

        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles[color]}`}>
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
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${getVersionStatusStyle(status)}`}
    >
      {formatStatus(status)}
    </span>
  );
}

function SectionHeading({ title, description, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-bold text-[#10265F] dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs text-[#8A9ABB] dark:text-[#B0A5BD]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function EmptyState({ icon: Icon = FolderOpen, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCE4F3] px-5 py-12 text-center dark:border-[#514657]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <Icon size={25} />
      </div>
      <h3 className="mt-4 text-sm font-bold text-[#10265F] dark:text-white">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-xs leading-5 text-[#8A9ABB] dark:text-[#B0A5BD]">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function FormField({ label, children, className = "" }) {
  return (
    <label className={`block text-xs font-semibold text-[#10265F] dark:text-white ${className}`}>
      {label}
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#E4EAF8] bg-white px-3 py-3 text-sm font-normal outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white dark:focus:ring-blue-950";

const outlineButtonClass =
  "flex items-center justify-center gap-2 rounded-xl border border-[#E4EAF8] px-3 py-2 text-xs font-semibold text-[#506995] transition hover:bg-slate-50 dark:border-[#3B3441] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]";

function Modal({ title, description, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#10265F]/50 p-3 backdrop-blur-sm sm:p-5">
      <div className="cms-modal flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-[#3B3441]">
          <div>
            <h2 className="text-lg font-extrabold text-[#10265F] dark:text-white">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-xs text-[#8A9ABB] dark:text-[#B0A5BD]">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-[#302A36]"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        <div className="overflow-y-auto p-5">{children}</div>

        {footer && (
          <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-slate-100 bg-[#FBFCFF] px-5 py-4 dark:border-[#3B3441] dark:bg-[#19171E]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CambridgeContentManager() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [versionDetails, setVersionDetails] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationResult, setValidationResult] = useState(null);
  const [bandResult, setBandResult] = useState(null);

  const [modalType, setModalType] = useState(null);
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState("");

  /* -------------------------------------------------------
     LOAD BOOKS
  ------------------------------------------------------- */

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`${CMS_BASE}/books`, {
        params: {
          page: 1,
          limit: 100,
        },
      });

      const data = getData(response);
      setBooks(extractItems(data, "items"));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  /* -------------------------------------------------------
     LOAD BOOK DETAILS
  ------------------------------------------------------- */

  const openBook = async (book) => {
    setSelectedBook(book);
    setSelectedTest(null);
    setSelectedVersion(null);
    setVersionDetails(null);
    setValidationResult(null);
    setDetailLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.get(`${CMS_BASE}/books/${book.id}`);
      const data = getData(response);
      const bookDetails = data.book || data;

      setSelectedBook(bookDetails);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setDetailLoading(false);
    }
  };

  /* -------------------------------------------------------
     LOAD TEST DETAILS
  ------------------------------------------------------- */

  const openTest = async (test) => {
    setSelectedTest(test);
    setSelectedVersion(null);
    setVersionDetails(null);
    setValidationResult(null);
    setDetailLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.get(`${CMS_BASE}/tests/${test.id}`);
      const data = getData(response);
      setSelectedTest(data.test || data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setDetailLoading(false);
    }
  };

  /* -------------------------------------------------------
     LOAD VERSION DETAILS
  ------------------------------------------------------- */

  const openVersion = async (version) => {
    setSelectedVersion(version);
    setVersionDetails(null);
    setValidationResult(null);
    setDetailLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.get(
        `${CMS_BASE}/test-versions/${version.id}`
      );

      const data = getData(response);

      console.log("VERSION RESPONSE:", response.data);   // ← add this
      console.log("PARSED:", data);


      setVersionDetails(
        data.version && typeof data.version === "object" ? data.version : data
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setDetailLoading(false);
    }
  };

  /* -------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------- */

  const goToBooks = () => {
    setSelectedBook(null);
    setSelectedTest(null);
    setSelectedVersion(null);
    setVersionDetails(null);
    setValidationResult(null);
    setError("");
    setSuccess("");
  };

  const goToBook = () => {
    setSelectedTest(null);
    setSelectedVersion(null);
    setVersionDetails(null);
    setValidationResult(null);
    setError("");
    setSuccess("");
  };

  const goToTest = () => {
    setSelectedVersion(null);
    setVersionDetails(null);
    setValidationResult(null);
    setError("");
    setSuccess("");
  };

  /* -------------------------------------------------------
     MODAL HELPERS
  ------------------------------------------------------- */

  const openModal = (type, initial = {}) => {
    setModalType(type);
    setForm(initial);
    setFormError("");
  };

  const closeModal = () => {
    if (saving) return;
    setModalType(null);
    setForm({});
    setFormError("");
  };

  const updateForm = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  /* -------------------------------------------------------
     EDIT PREFILL HELPERS
  ------------------------------------------------------- */

  const openEditBook = () =>
    openModal("book", {
      id: selectedBook.id,
      title: selectedBook.title || "",
      bookNumber: selectedBook.bookNumber || "",
      publisher: selectedBook.publisher || "",
      category: selectedBook.category || "ACADEMIC",
      isActive: Boolean(selectedBook.isActive),
    });

  const openEditTest = () =>
    openModal("test", {
      id: selectedTest.id,
      title: selectedTest.title || "",
      testNumber: selectedTest.testNumber ?? 1,
      category: selectedTest.category || "ACADEMIC",
    });

  const openEditModule = async (module) => {
    try {
      const response = await cmsService.getTestModuleById(module.id);
      const item = unwrap(response, "module");

      openModal("module", {
        id: item.id || module.id,
        section: item.section || module.section,
        position: item.position ?? 1,
        durationSeconds: item.durationSeconds ?? 1800,
        instructions: stringifyJson(item.instructions),
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const openEditPart = async (part) => {
    try {
      const response = await cmsService.getTestPartById(part.id);
      const item = unwrap(response, "part");

      openModal("part", {
        id: item.id || part.id,
        moduleId: item.testModuleId,
        title: item.title || "",
        position: item.position ?? 1,
        audioAssetKey: item.audioAssetKey || "",
        instructions: stringifyJson(item.instructions),
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const openEditGroup = async (group) => {
    try {
      const response = await cmsService.getQuestionGroupById(group.id);
      const item = unwrap(response, "group");

      openModal("group", {
        id: item.id || group.id,
        partId: item.testPartId,
        title: item.title || "",
        position: item.position ?? 1,
        passage:
          typeof item.passage === "string"
            ? item.passage
            : stringifyJson(item.passage),
        instructions: stringifyJson(item.instructions),
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const openEditQuestion = async (question) => {
    try {
      const response = await cmsService.getQuestionById(question.id);
      const item = unwrap(response, "question");
      const key = item.answerKey || question.answerKey || null;

      openModal("question", {
        id: item.id || question.id,
        partId: item.testPartId,
        groupId: item.questionGroupId || "",
        questionNumber: item.questionNumber ?? question.questionNumber,
        questionType: item.questionType || question.questionType,
        position: item.position ?? 1,
        marks: item.marks ?? 1,
        content: JSON.stringify(item.content ?? {}, null, 2),
        answerKeyId: key?.id || "",
        acceptedAnswers: key?.acceptedAnswers
          ? JSON.stringify(key.acceptedAnswers, null, 2)
          : "",
        explanation: key?.explanation?.text || "",
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  /* -------------------------------------------------------
     CREATE / UPDATE BOOK
  ------------------------------------------------------- */

  const createBook = async () => {
    if (!form.title?.trim()) {
      setFormError("Book title is required.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const payload = {
        title: form.title.trim(),
        bookNumber: form.bookNumber ? Number(form.bookNumber) : undefined,
        publisher: form.publisher?.trim() || undefined,
        category: form.category || undefined,
        isActive: Boolean(form.isActive),
      };

      const isEdit = Boolean(form.id);

      if (isEdit) {
        await cmsService.updateBook(form.id, payload);
      } else {
        await api.post(`${CMS_BASE}/books`, payload);
      }

      closeModal();
      setSaving(false);
      await loadBooks();

      if (isEdit) {
        await openBook(selectedBook);
      }

      setSuccess(
        isEdit ? "Book updated successfully." : "Book created successfully."
      );
    } catch (requestError) {
      setFormError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------
     CREATE / UPDATE TEST
  ------------------------------------------------------- */

  const createTest = async () => {
    if (!form.title?.trim()) {
      setFormError("Test title is required.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const payload = {
        title: form.title.trim(),
        testNumber: Number(form.testNumber),
        category: form.category || selectedBook.category || "ACADEMIC",
      };

      const isEdit = Boolean(form.id);

      if (isEdit) {
        await cmsService.updateTest(form.id, payload);
      } else {
        await api.post(`${CMS_BASE}/books/${selectedBook.id}/tests`, payload);
      }

      closeModal();
      setSaving(false);

      if (isEdit) {
        await openTest(selectedTest);
      } else {
        await openBook(selectedBook);
      }

      setSuccess(
        isEdit ? "Test updated successfully." : "Test created successfully."
      );
    } catch (requestError) {
      setFormError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------
     ARCHIVE TEST
  ------------------------------------------------------- */

  const archiveCurrentTest = async () => {
    const confirmed = window.confirm(
      "Archive this test? It will no longer be available for new attempts."
    );

    if (!confirmed) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await cmsService.archiveTest(selectedTest.id);
      setSaving(false);
      await openBook(selectedBook);
      setSuccess("Test archived successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------
     CREATE TEST VERSION
  ------------------------------------------------------- */

  const createVersion = async () => {
    setSaving(true);
    setFormError("");

    try {
      await api.post(`${CMS_BASE}/tests/${selectedTest.id}/versions`, {});

      closeModal();
      setSuccess("Test version created successfully.");
      await openTest(selectedTest);
    } catch (requestError) {
      setFormError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------
     CREATE / UPDATE MODULE
  ------------------------------------------------------- */

  const createModule = async () => {
    setSaving(true);
    setFormError("");

    try {
      const instructions = parseJsonField(form.instructions, {});

      const payload = {
        section: form.section,
        position: Number(form.position),
        durationSeconds: Number(form.durationSeconds),
        instructions,
      };

      const isEdit = Boolean(form.id);

      if (isEdit) {
        await cmsService.updateTestModule(form.id, payload);
      } else {
        await api.post(`${CMS_BASE}/test-modules`, {
          testVersionId: selectedVersion.id,
          ...payload,
        });
      }

      closeModal();
      setSuccess(
        isEdit
          ? `${formatSection(form.section)} module updated.`
          : `${formatSection(form.section)} module created.`
      );
      await openVersion(selectedVersion);
    } catch (requestError) {
      setFormError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------
     CREATE / UPDATE PART
  ------------------------------------------------------- */

  const createPart = async () => {
    setSaving(true);
    setFormError("");

    try {
      const instructions = parseJsonField(form.instructions, null);

      const payload = {
        title: (form.title || "").trim(),
        position: Number(form.position),
        instructions,
        audioAssetKey: form.audioAssetKey?.trim() || null,
      };

      const isEdit = Boolean(form.id);

      if (isEdit) {
        await cmsService.updateTestPart(form.id, payload);
      } else {
        await api.post(`${CMS_BASE}/test-parts`, {
          testModuleId: form.moduleId,
          ...payload,
        });
      }

      closeModal();
      setSuccess(
        isEdit ? "Part updated successfully." : "Part created successfully."
      );
      await openVersion(selectedVersion);
    } catch (requestError) {
      setFormError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------
     CREATE / UPDATE QUESTION GROUP
  ------------------------------------------------------- */

  const createGroup = async () => {
    setSaving(true);
    setFormError("");

    try {
      const instructions = parseJsonField(form.instructions, null);
      const passage = parseJsonField(form.passage, null);

      const payload = {
        title: form.title?.trim() || null,
        position: Number(form.position),
        instructions,
        passage,
      };

      const isEdit = Boolean(form.id);

      if (isEdit) {
        await cmsService.updateQuestionGroup(form.id, payload);
      } else {
        await api.post(`${CMS_BASE}/question-groups`, {
          testPartId: form.partId,
          ...payload,
        });
      }

      closeModal();
      setSuccess(
        isEdit
          ? "Question group updated successfully."
          : "Question group created successfully."
      );
      await openVersion(selectedVersion);
    } catch (requestError) {
      setFormError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------
     CREATE / UPDATE QUESTION + ANSWER KEY
  ------------------------------------------------------- */

  const createQuestion = async () => {
    setSaving(true);
    setFormError("");

    try {
      const content = parseJsonField(form.content, null);

      if (!content || typeof content !== "object") {
        throw new Error("Question content must be a valid JSON object.");
      }

      const questionPayload = {
        questionGroupId: form.groupId || null,
        questionNumber: Number(form.questionNumber),
        questionType: form.questionType,
        content,
        marks: Number(form.marks),
        position: Number(form.position),
      };

      const isEdit = Boolean(form.id);
      let questionId = form.id;

      if (isEdit) {
        await cmsService.updateQuestion(form.id, questionPayload);
      } else {
        const questionResponse = await api.post(`${CMS_BASE}/questions`, {
          testPartId: form.partId,
          ...questionPayload,
        });

        const questionData = getData(questionResponse);
        const question = questionData.question || questionData;
        questionId = question.id;
      }

      if (form.acceptedAnswers?.trim()) {
        const acceptedAnswers = parseJsonField(form.acceptedAnswers, null);

        const keyPayload = {
          acceptedAnswers,
          explanation: form.explanation?.trim()
            ? { text: form.explanation.trim() }
            : null,
          markingRules: null,
        };

        if (form.answerKeyId) {
          await cmsService.updateAnswerKey(form.answerKeyId, keyPayload);
        } else {
          await api.post(`${CMS_BASE}/answer-keys`, {
            questionId,
            ...keyPayload,
          });
        }
      }

      closeModal();
      setSuccess(
        isEdit
          ? "Question updated successfully."
          : "Question created successfully."
      );
      await openVersion(selectedVersion);
    } catch (requestError) {
      setFormError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------
     BAND CONVERSION
  ------------------------------------------------------- */

  const submitBandConversion = async () => {
    setSaving(true);
    setFormError("");

    try {
      const payload = parseJsonField(form.payload, null);

      if (!payload || typeof payload !== "object") {
        throw new Error("Band conversion must be a valid JSON object.");
      }

      const response = await cmsService.createBandConversion({
        ...payload,
        section: payload.section || form.section,
        category: payload.category || form.category,
      });

      setBandResult(unwrap(response, "bandConversion"));
      closeModal();
      setSuccess("Band conversion saved successfully.");
    } catch (requestError) {
      setFormError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const lookupBandConversion = async () => {
    const id = window.prompt("Enter band conversion ID");

    if (!id?.trim()) return;

    try {
      const response = await cmsService.getBandConversionById(id.trim());
      setBandResult(unwrap(response, "bandConversion"));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  /* -------------------------------------------------------
     BULK IMPORT
  ------------------------------------------------------- */

  const handleImportFile = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => updateForm("json", String(reader.result || ""));
    reader.readAsText(file);
  };

  const submitBulkImport = async () => {
    setSaving(true);
    setFormError("");

    try {
      const payload = parseJsonField(form.json, null);

      if (!payload) {
        throw new Error("Paste or upload the import JSON first.");
      }

      await cmsService.bulkImportTest(payload);

      closeModal();
      setSaving(false);
      await loadBooks();
      setSuccess("Bulk import completed successfully.");
    } catch (requestError) {
      setFormError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------
     VALIDATE VERSION
  ------------------------------------------------------- */

  const validateVersion = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post(
        `${CMS_BASE}/test-versions/${selectedVersion.id}/validate`
      );

      const data = getData(response);
      setValidationResult(data);
      setSuccess(
        data.valid
          ? "Version validation passed."
          : "Validation completed. Please review the errors."
      );
    } catch (requestError) {
      const responseData = requestError?.response?.data;
      setValidationResult(responseData?.data || null);
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------
     PUBLISH VERSION
  ------------------------------------------------------- */

  const publishVersion = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to publish this test version?"
    );

    if (!confirmed) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.post(
        `${CMS_BASE}/test-versions/${selectedVersion.id}/publish`
      );

      setSuccess("Test version published successfully.");
      await openTest(selectedTest);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------
     FILTER BOOKS
  ------------------------------------------------------- */

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch =
        !query ||
        book.title?.toLowerCase().includes(query) ||
        String(book.bookNumber || "").includes(query);

      const matchesCategory =
        categoryFilter === "ALL" ||
        book.category === categoryFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" ? book.isActive : !book.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [books, search, categoryFilter, statusFilter]);

  /* -------------------------------------------------------
     DERIVED DATA
  ------------------------------------------------------- */

  const tests = getArray(selectedBook?.tests);
  const versions = getArray(selectedTest?.versions);

  const modules = getArray(
    versionDetails?.modules || versionDetails?.testModules
  );

  const activeBookCount = books.filter((book) => book.isActive).length;

  const publishedVersionCount = books.reduce((total, book) => {
    const bookTests = getArray(book.tests);

    return (
      total +
      bookTests.reduce(
        (testTotal, test) =>
          testTotal +
          getArray(test.versions).filter(
            (version) => version.status === "PUBLISHED"
          ).length,
        0
      )
    );
  }, 0);

  const moduleCount = modules.length;

  const isDraft = selectedVersion?.status === "DRAFT";

  /* -------------------------------------------------------
     QUESTION ROW RENDERER
  ------------------------------------------------------- */

  const renderQuestionRow = (question) => (
  <div
    key={question.id}
    onClick={() => openEditQuestion(question)}
    className="mt-2 flex cursor-pointer flex-wrap items-center justify-between gap-2 rounded-lg border-t border-slate-100 px-1 pt-2 transition hover:bg-[#F8FAFF] dark:border-[#3B3441] dark:hover:bg-[#29242F]"
  >
    <span className="text-[10px] font-semibold text-[#10265F] dark:text-white">
      Question {question.questionNumber}
    </span>

    <div className="flex items-center gap-3">
      <span className="text-[10px] text-[#8A9ABB] dark:text-[#B0A5BD]">
        {formatSection(question.questionType)}
      </span>

      {question.answerKey || question.hasAnswerKey ? (
        <span title="Answer key added">
          <CheckCircle2 size={13} className="text-emerald-500" />
        </span>
      ) : (
        <span title="No answer key">
          <AlertCircle size={13} className="text-amber-500" />
        </span>
      )}

      <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
        {isDraft ? (
          <>
            <Pencil size={12} className="mr-1 inline" />
            Edit
          </>
        ) : (
          <>
            <Eye size={12} className="mr-1 inline" />
            View
          </>
        )}
      </span>
    </div>
  </div>
);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="cambridge-content-manager min-h-screen overflow-x-hidden bg-[#F5F7FF] dark:bg-[#17151B]">
      <style>{darkModeStyles}</style>

      <Sidebar />

      <div className="flex min-h-screen min-w-0 flex-col lg:ml-[260px]">
        <Navbar />

        <main className="min-w-0 flex-1 space-y-5 overflow-x-hidden p-3 sm:p-5 lg:p-6">

          {/* PAGE HEADER */}

          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-[#7183A7] dark:text-[#B0A5BD]">
                <span>Super Admin</span>
                <span>›</span>
                <span>Content Management</span>
                {selectedBook && (
                  <>
                    <span>›</span>
                    <button type="button" onClick={goToBooks} className="hover:text-blue-600">
                      Books
                    </button>
                  </>
                )}
                {selectedBook && (
                  <>
                    <span>›</span>
                    <span className="text-[#10265F] dark:text-white">
                      {getBookName(selectedBook)}
                    </span>
                  </>
                )}
                {selectedTest && (
                  <>
                    <span>›</span>
                    <span className="text-[#10265F] dark:text-white">
                      {selectedTest.title}
                    </span>
                  </>
                )}
                {selectedVersion && (
                  <>
                    <span>›</span>
                    <span className="text-[#10265F] dark:text-white">
                      Version {selectedVersion.versionNumber || selectedVersion.version || ""}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-[#10265F] sm:text-3xl dark:text-white">
                Cambridge{" "}
                <span className="text-[#FF2454]">Content Manager</span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7183A7] dark:text-[#B0A5BD]">
                Manage Cambridge books, IELTS tests, test versions, modules,
                passages, questions and answer keys.
              </p>
            </div>

            {!selectedBook && (
              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openModal("band", { ...EMPTY_BAND_FORM, payload: BAND_TEMPLATE })
                  }
                  className="flex items-center gap-2 rounded-xl border border-[#E4EAF8] bg-white px-3 py-3 text-xs font-semibold text-[#506995] transition hover:bg-slate-50 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-[#B0A5BD]"
                >
                  <Calculator size={15} />
                  Band conversion
                </button>

                <button
                  type="button"
                  onClick={() => openModal("bulk", { json: "" })}
                  className="flex items-center gap-2 rounded-xl border border-[#E4EAF8] bg-white px-3 py-3 text-xs font-semibold text-[#506995] transition hover:bg-slate-50 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-[#B0A5BD]"
                >
                  <Upload size={15} />
                  Bulk import
                </button>

                <button
                  type="button"
                  onClick={() => openModal("book", EMPTY_BOOK_FORM)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-rose-100 transition hover:bg-rose-600"
                >
                  <Plus size={17} />
                  Add Book
                </button>
              </div>
            )}
          </section>

          {/* ALERTS */}

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p className="min-w-0 flex-1">{error}</p>
              <button type="button" onClick={() => setError("")}>
                <X size={16} />
              </button>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <p className="min-w-0 flex-1">{success}</p>
              <button type="button" onClick={() => setSuccess("")}>
                <X size={16} />
              </button>
            </div>
          )}

          {/* BAND CONVERSION RESULT */}

          {bandResult && (
            <section className="rounded-2xl border border-[#E9EEFA] bg-white p-4 shadow-sm sm:p-5 dark:border-[#3B3441] dark:bg-[#211E27]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-[#10265F] dark:text-white">
                  Band conversion
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={lookupBandConversion}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400"
                  >
                    Look up by ID
                  </button>
                  <button type="button" onClick={() => setBandResult(null)} aria-label="Close band conversion">
                    <X size={16} />
                  </button>
                </div>
              </div>
              <pre className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[#F8FAFF] p-3 text-[11px] text-[#506995] dark:bg-[#19171E] dark:text-[#B0A5BD]">
                {JSON.stringify(bandResult, null, 2)}
              </pre>
            </section>
          )}

          {/* =================================================
              BOOK LIBRARY
          ================================================= */}

          {!selectedBook && (
            <>
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  icon={BookOpen}
                  title="Total Books"
                  value={books.length}
                  note="Books in CMS catalog"
                  color="blue"
                />
                <StatCard
                  icon={CircleCheck}
                  title="Active Books"
                  value={activeBookCount}
                  note="Books currently active"
                  color="green"
                />
                <StatCard
                  icon={ClipboardCheck}
                  title="Published Versions"
                  value={publishedVersionCount}
                  note="Published versions in loaded book data"
                  color="purple"
                />
                <StatCard
                  icon={Layers3}
                  title="Available Books"
                  value={filteredBooks.length}
                  note="Books matching your filters"
                  color="pink"
                />
              </section>

              <section className="rounded-2xl border border-[#E9EEFA] bg-white p-4 shadow-sm sm:p-5 dark:border-[#3B3441] dark:bg-[#211E27]">
                <SectionHeading
                  title="Cambridge Book Library"
                  description="Select a book card to open its tests and versions."
                  action={
                    <button
                      type="button"
                      onClick={loadBooks}
                      disabled={loading}
                      className="flex items-center gap-2 rounded-xl border border-[#E4EAF8] px-3 py-2 text-xs font-semibold text-[#506995] transition hover:bg-slate-50 disabled:opacity-50 dark:border-[#3B3441] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
                    >
                      <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                      Refresh
                    </button>
                  }
                />

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  <div className="relative sm:col-span-2 xl:col-span-1">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9ABB]"
                    />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search Cambridge books..."
                      className={`${inputClass} pl-9`}
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                    className={inputClass}
                  >
                    <option value="ALL">All Categories</option>
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className={inputClass}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20 text-sm text-[#7183A7] dark:text-[#B0A5BD]">
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Loading books...
                  </div>
                ) : filteredBooks.length === 0 ? (
                  <div className="mt-5">
                    <EmptyState
                      icon={BookOpen}
                      title="No books found"
                      description={
                        books.length
                          ? "Try changing your search or filters."
                          : "Your CMS catalog is empty. Create your first Cambridge book to get started."
                      }
                      action={
                        books.length === 0 ? (
                          <button
                            type="button"
                            onClick={() => openModal("book", EMPTY_BOOK_FORM)}
                            className="rounded-xl bg-[#FF2454] px-4 py-2.5 text-xs font-semibold text-white"
                          >
                            <Plus size={14} className="mr-1 inline" />
                            Create First Book
                          </button>
                        ) : null
                      }
                    />
                  </div>
                ) : (
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {filteredBooks.map((book) => (
                      <button
                        type="button"
                        key={book.id}
                        onClick={() => openBook(book)}
                        className="group relative overflow-hidden rounded-2xl border border-[#E9EEFA] bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-[#3B3441] dark:bg-[#211E27] dark:hover:border-blue-800"
                      >
                        <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-blue-50/80 transition group-hover:scale-125 dark:bg-blue-950/20" />

                        <div className="relative flex items-start justify-between gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 dark:from-blue-950/50 dark:to-indigo-950/40 dark:text-blue-300">
                            <BookMarked size={23} />
                          </div>

                          <StatusBadge status={book.isActive ? "PUBLISHED" : "ARCHIVED"} />
                        </div>

                        <div className="relative mt-5">
                          <h3 className="text-base font-extrabold text-[#10265F] dark:text-white">
                            {getBookName(book)}
                          </h3>

                          <p className="mt-1 text-xs text-[#8A9ABB] dark:text-[#B0A5BD]">
                            {book.category
                              ? formatSection(book.category)
                              : "Category not set"}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {book.bookNumber && (
                              <span className="rounded-lg bg-[#F5F7FF] px-2.5 py-1.5 text-[10px] font-semibold text-[#506995] dark:bg-[#19171E] dark:text-[#B0A5BD]">
                                Book No. {book.bookNumber}
                              </span>
                            )}
                            {book.publisher && (
                              <span className="max-w-full truncate rounded-lg bg-[#F5F7FF] px-2.5 py-1.5 text-[10px] font-semibold text-[#506995] dark:bg-[#19171E] dark:text-[#B0A5BD]">
                                {book.publisher}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="relative mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-[#3B3441]">
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            Open book details
                          </span>
                          <ChevronRight
                            size={17}
                            className="text-[#8A9ABB] transition group-hover:translate-x-1 group-hover:text-blue-600"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {/* =================================================
              BOOK DETAILS / TEST LIST
          ================================================= */}

          {selectedBook && !selectedTest && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={goToBooks}
                  className="flex items-center gap-2 text-xs font-semibold text-[#506995] transition hover:text-blue-600 dark:text-[#B0A5BD]"
                >
                  <ArrowLeft size={16} />
                  Back to Books
                </button>

                <button
                  type="button"
                  onClick={() => openModal("test", {
                    ...EMPTY_TEST_FORM,
                    category: selectedBook.category || "ACADEMIC",
                  })}
                  className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-4 py-2.5 text-xs font-semibold text-white hover:bg-rose-600"
                >
                  <Plus size={15} />
                  Add Test
                </button>
              </div>

              <section className="rounded-2xl border border-[#E9EEFA] bg-white p-5 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                    <BookOpen size={30} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#FF2454]">
                      Book Details
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold text-[#10265F] dark:text-white">
                      {getBookName(selectedBook)}
                    </h2>
                    <p className="mt-1 text-xs text-[#8A9ABB] dark:text-[#B0A5BD]">
                      {formatSection(selectedBook.category || "Not specified")}
                      {selectedBook.publisher ? ` · ${selectedBook.publisher}` : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={openEditBook}
                      className={outlineButtonClass}
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <StatusBadge status={selectedBook.isActive ? "PUBLISHED" : "ARCHIVED"} />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-[#E9EEFA] bg-white p-4 shadow-sm sm:p-5 dark:border-[#3B3441] dark:bg-[#211E27]">
                <SectionHeading
                  title="Tests"
                  description="Select a test to view its versions and publication status."
                />

                {detailLoading ? (
                  <div className="flex items-center justify-center py-16 text-sm text-[#7183A7] dark:text-[#B0A5BD]">
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Loading book details...
                  </div>
                ) : tests.length === 0 ? (
                  <div className="mt-5">
                    <EmptyState
                      icon={GraduationCap}
                      title="No tests in this book"
                      description="Create the first test for this Cambridge book."
                      action={
                        <button
                          type="button"
                          onClick={() => openModal("test", EMPTY_TEST_FORM)}
                          className="rounded-xl bg-[#FF2454] px-4 py-2.5 text-xs font-semibold text-white"
                        >
                          <Plus size={14} className="mr-1 inline" />
                          Create Test
                        </button>
                      }
                    />
                  </div>
                ) : (
                  <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {tests.map((test) => (
                      <button
                        type="button"
                        key={test.id}
                        onClick={() => openTest(test)}
                        className="group rounded-2xl border border-[#E9EEFA] p-4 text-left transition hover:border-blue-200 hover:shadow-md dark:border-[#3B3441] dark:hover:border-blue-800"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                            <ClipboardCheck size={21} />
                          </div>
                          <ChevronRight size={18} className="text-[#8A9ABB] transition group-hover:translate-x-1" />
                        </div>

                        <h3 className="mt-4 text-sm font-bold text-[#10265F] dark:text-white">
                          {test.title || `Test ${test.testNumber}`}
                        </h3>

                        <p className="mt-1 text-xs text-[#8A9ABB] dark:text-[#B0A5BD]">
                          Test Number: {test.testNumber}
                        </p>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-[#3B3441]">
                          <span className="text-xs text-[#7183A7] dark:text-[#B0A5BD]">
                            {getArray(test.versions).length} versions
                          </span>
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            View versions
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {/* =================================================
              TEST DETAILS / VERSION LIST
          ================================================= */}

          {selectedTest && !selectedVersion && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={goToBook}
                  className="flex items-center gap-2 text-xs font-semibold text-[#506995] hover:text-blue-600 dark:text-[#B0A5BD]"
                >
                  <ArrowLeft size={16} />
                  Back to {getBookName(selectedBook)}
                </button>

                <button
                  type="button"
                  onClick={() => openModal("version", {})}
                  className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-4 py-2.5 text-xs font-semibold text-white hover:bg-rose-600"
                >
                  <Plus size={15} />
                  Create Version
                </button>
              </div>

              <section className="rounded-2xl border border-[#E9EEFA] bg-white p-5 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                    <GraduationCap size={27} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#FF2454]">
                      {getBookName(selectedBook)}
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold text-[#10265F] dark:text-white">
                      {selectedTest.title}
                    </h2>
                    <p className="mt-1 text-xs text-[#8A9ABB] dark:text-[#B0A5BD]">
                      Test Number {selectedTest.testNumber} · {formatSection(selectedTest.category)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={openEditTest}
                      className={outlineButtonClass}
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={archiveCurrentTest}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/30"
                    >
                      <Archive size={14} />
                      Archive
                    </button>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-[#E9EEFA] bg-white p-4 shadow-sm sm:p-5 dark:border-[#3B3441] dark:bg-[#211E27]">
                <SectionHeading
                  title="Test Versions"
                  description="Each version has its own modules, questions, answer keys and publication workflow."
                />

                {detailLoading ? (
                  <div className="flex items-center justify-center py-16 text-sm text-[#7183A7] dark:text-[#B0A5BD]">
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Loading test...
                  </div>
                ) : versions.length === 0 ? (
                  <div className="mt-5">
                    <EmptyState
                      icon={Layers3}
                      title="No versions created"
                      description="Create a draft version to start adding Listening, Reading, Writing and Speaking modules."
                      action={
                        <button
                          type="button"
                          onClick={() => openModal("version", {})}
                          className="rounded-xl bg-[#FF2454] px-4 py-2.5 text-xs font-semibold text-white"
                        >
                          <Plus size={14} className="mr-1 inline" />
                          Create First Version
                        </button>
                      }
                    />
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    {versions.map((version) => (
                      <button
                        type="button"
                        key={version.id}
                        onClick={() => openVersion(version)}
                        className="group flex w-full flex-col gap-3 rounded-2xl border border-[#E9EEFA] p-4 text-left transition hover:border-blue-200 hover:shadow-sm sm:flex-row sm:items-center dark:border-[#3B3441] dark:hover:border-blue-800"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                          <BookCopy size={21} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-[#10265F] dark:text-white">
                            Version {version.versionNumber || version.version || "—"}
                          </h3>
                          <p className="mt-1 text-xs text-[#8A9ABB] dark:text-[#B0A5BD]">
                            {version.publishedAt
                              ? `Published ${new Date(version.publishedAt).toLocaleDateString()}`
                              : "Not published"}
                          </p>
                        </div>

                        <StatusBadge status={version.status} />

                        <ChevronRight size={18} className="hidden text-[#8A9ABB] transition group-hover:translate-x-1 sm:block" />
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {/* =================================================
              VERSION WORKSPACE
          ================================================= */}

          {selectedVersion && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={goToTest}
                  className="flex items-center gap-2 text-xs font-semibold text-[#506995] hover:text-blue-600 dark:text-[#B0A5BD]"
                >
                  <ArrowLeft size={16} />
                  Back to Versions
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={validateVersion}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-400"
                  >
                    <ClipboardCheck size={15} />
                    Validate
                  </button>

                  {selectedVersion.status !== "PUBLISHED" &&
                    selectedVersion.status !== "ARCHIVED" && (
                      <button
                        type="button"
                        onClick={publishVersion}
                        disabled={saving}
                        className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
                      >
                        <Send size={15} />
                        Publish Version
                      </button>
                    )}
                </div>
              </div>

              <section className="rounded-2xl border border-[#E9EEFA] bg-white p-5 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                    <Layers3 size={27} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#FF2454]">
                      Version Workspace
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold text-[#10265F] dark:text-white">
                      {getBookName(selectedBook)} · {selectedTest.title}
                    </h2>
                    <p className="mt-1 text-xs text-[#8A9ABB] dark:text-[#B0A5BD]">
                      Version {selectedVersion.versionNumber || selectedVersion.version || "—"}
                    </p>
                  </div>

                  <StatusBadge status={versionDetails?.status || selectedVersion.status} />
                </div>
              </section>

              {detailLoading ? (
                <div className="flex items-center justify-center rounded-2xl border border-[#E9EEFA] bg-white py-16 text-sm text-[#7183A7] dark:border-[#3B3441] dark:bg-[#211E27] dark:text-[#B0A5BD]">
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Loading version details...
                </div>
              ) : (
                <>
                  <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {SECTIONS.map((section) => {
                      const module = modules.find((item) => item.section === section);

                      return (
                        <div
                          key={section}
                          className="rounded-2xl border border-[#E9EEFA] bg-white p-4 dark:border-[#3B3441] dark:bg-[#211E27]"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#10265F] dark:text-white">
                              {formatSection(section)}
                            </span>
                            {module ? (
                              <CheckCircle2 size={17} className="text-emerald-500" />
                            ) : (
                              <Clock size={17} className="text-amber-500" />
                            )}
                          </div>
                          <p className="mt-3 text-2xl font-extrabold text-[#10265F] dark:text-white">
                            {module ? "Added" : "—"}
                          </p>
                          <p className="mt-1 text-[11px] text-[#8A9ABB] dark:text-[#B0A5BD]">
                            {module
                              ? `${getArray(module.parts).length} parts`
                              : "Module not found in response"}
                          </p>
                        </div>
                      );
                    })}
                  </section>

                  <section className="rounded-2xl border border-[#E9EEFA] bg-white p-4 shadow-sm sm:p-5 dark:border-[#3B3441] dark:bg-[#211E27]">
                    <SectionHeading
                      title="Test Modules"
                      description="Build the four IELTS sections inside this version."
                      action={
                        selectedVersion.status === "DRAFT" ? (
                          <button
                            type="button"
                            onClick={() => openModal("module", EMPTY_MODULE_FORM)}
                            className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-3 py-2.5 text-xs font-semibold text-white hover:bg-rose-600"
                          >
                            <Plus size={14} />
                            Add Module
                          </button>
                        ) : null
                      }
                    />

                    {modules.length === 0 ? (
                      <div className="mt-5">
                        <EmptyState
                          icon={Layers3}
                          title="No modules available in this response"
                          description="The current version detail endpoint may not include module lists. You can create modules while the version is in Draft status. To display previously created modules, the backend needs a list endpoint or nested modules in its version response."
                          action={
                            selectedVersion.status === "DRAFT" ? (
                              <button
                                type="button"
                                onClick={() => openModal("module", EMPTY_MODULE_FORM)}
                                className="rounded-xl bg-[#FF2454] px-4 py-2.5 text-xs font-semibold text-white"
                              >
                                <Plus size={14} className="mr-1 inline" />
                                Create Module
                              </button>
                            ) : null
                          }
                        />
                      </div>
                    ) : (
                      <div className="mt-5 space-y-4">
                        {modules.map((module) => {
                          const parts = getArray(module.parts);

                          return (
                            <div
                              key={module.id}
                              className="rounded-2xl border border-[#E9EEFA] p-4 dark:border-[#3B3441]"
                            >
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                  {module.section === "LISTENING" ? (
                                    <Headphones size={21} />
                                  ) : module.section === "READING" ? (
                                    <BookOpen size={21} />
                                  ) : module.section === "WRITING" ? (
                                    <FileText size={21} />
                                  ) : (
                                    <Volume2 size={21} />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h3 className="text-sm font-bold text-[#10265F] dark:text-white">
                                    {formatSection(module.section)}
                                  </h3>
                                  <p className="mt-1 text-xs text-[#8A9ABB] dark:text-[#B0A5BD]">
                                    {Math.round((module.durationSeconds || 0) / 60)} minutes · {parts.length} parts
                                  </p>
                                </div>

                                {selectedVersion.status === "DRAFT" && (
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      onClick={() => openEditModule(module)}
                                      className={outlineButtonClass}
                                    >
                                      <Pencil size={14} />
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openModal("part", {
                                          ...EMPTY_PART_FORM,
                                          moduleId: module.id,
                                        })
                                      }
                                      className={outlineButtonClass}
                                    >
                                      <Plus size={14} />
                                      Add Part
                                    </button>
                                  </div>
                                )}
                              </div>

                              {parts.length > 0 && (
                                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 dark:border-[#3B3441]">
                                  {parts.map((part) => {
                                    const groups = getArray(part.questionGroups || part.groups);
                                    const questions = getArray(part.questions);

                                    return (
                                      <div
                                        key={part.id}
                                        className="rounded-xl bg-[#F8FAFF] p-3 dark:bg-[#19171E]"
                                      >
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                          <div className="min-w-0 flex-1">
                                            <h4 className="text-xs font-bold text-[#10265F] dark:text-white">
                                              {part.title || `Part ${part.position}`}
                                            </h4>
                                            <p className="mt-1 text-[10px] text-[#8A9ABB] dark:text-[#B0A5BD]">
                                              {groups.length} groups · {questions.length} direct questions
                                            </p>
                                          </div>

                                          {selectedVersion.status === "DRAFT" && (
                                            <div className="flex flex-wrap gap-2">
                                              <button
                                                type="button"
                                                onClick={() => openEditPart(part)}
                                                className="rounded-lg border border-[#E4EAF8] px-2.5 py-2 text-[10px] font-semibold text-[#506995] dark:border-[#3B3441] dark:text-[#B0A5BD]"
                                              >
                                                <Pencil size={12} className="mr-1 inline" />
                                                Edit
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  openModal("group", {
                                                    ...EMPTY_GROUP_FORM,
                                                    partId: part.id,
                                                  })
                                                }
                                                className="rounded-lg border border-[#E4EAF8] px-2.5 py-2 text-[10px] font-semibold text-[#506995] dark:border-[#3B3441] dark:text-[#B0A5BD]"
                                              >
                                                <Plus size={12} className="mr-1 inline" />
                                                Group
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  openModal("question", {
                                                    ...EMPTY_QUESTION_FORM,
                                                    partId: part.id,
                                                    groupId: "",
                                                  })
                                                }
                                                className="rounded-lg border border-[#E4EAF8] px-2.5 py-2 text-[10px] font-semibold text-[#506995] dark:border-[#3B3441] dark:text-[#B0A5BD]"
                                              >
                                                <Plus size={12} className="mr-1 inline" />
                                                Question
                                              </button>
                                            </div>
                                          )}
                                        </div>

                                        {part.audioAssetKey && (
                                          <p className="mt-2 break-all text-[10px] text-purple-600 dark:text-purple-400">
                                            <Headphones size={12} className="mr-1 inline" />
                                            Audio: {part.audioAssetKey}
                                          </p>
                                        )}

                                        {groups.map((group) => (
                                          <div
                                            key={group.id}
                                            className="mt-3 rounded-lg border border-[#E9EEFA] bg-white p-3 dark:border-[#3B3441] dark:bg-[#211E27]"
                                          >
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                              <h5 className="text-xs font-bold text-[#10265F] dark:text-white">
                                                {group.title || `Group ${group.position}`}
                                              </h5>
                                              {selectedVersion.status === "DRAFT" && (
                                                <div className="flex items-center gap-3">
                                                  <button
                                                    type="button"
                                                    onClick={() => openEditGroup(group)}
                                                    className="text-[10px] font-semibold text-[#506995] dark:text-[#B0A5BD]"
                                                  >
                                                    <Pencil size={12} className="mr-1 inline" />
                                                    Edit group
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      openModal("question", {
                                                        ...EMPTY_QUESTION_FORM,
                                                        partId: part.id,
                                                        groupId: group.id,
                                                      })
                                                    }
                                                    className="text-[10px] font-semibold text-blue-600 dark:text-blue-400"
                                                  >
                                                    <Plus size={12} className="mr-1 inline" />
                                                    Add Question
                                                  </button>
                                                </div>
                                              )}
                                            </div>

                                            {group.passage && (
                                              <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[#F8FAFF] p-2 text-[10px] text-[#506995] dark:bg-[#19171E] dark:text-[#B0A5BD]">
                                                {typeof group.passage === "string"
                                                  ? group.passage
                                                  : JSON.stringify(group.passage, null, 2)}
                                              </pre>
                                            )}

                                            {getArray(group.questions).map(renderQuestionRow)}
                                          </div>
                                        ))}

                                        {questions.length > 0 && (
                                          <div className="mt-3 rounded-lg border border-[#E9EEFA] bg-white p-3 dark:border-[#3B3441] dark:bg-[#211E27]">
                                            <h5 className="text-xs font-bold text-[#10265F] dark:text-white">
                                              Direct questions
                                            </h5>
                                            {questions.map(renderQuestionRow)}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>

                  {/* VALIDATION RESULT */}

                  {validationResult && (
                    <section className="rounded-2xl border border-[#E9EEFA] bg-white p-5 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-base font-bold text-[#10265F] dark:text-white">
                            Version Validation
                          </h3>
                          <p className="mt-1 text-xs text-[#8A9ABB] dark:text-[#B0A5BD]">
                            Review validation errors and warnings before publishing.
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${validationResult.valid
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                            }`}
                        >
                          {validationResult.valid ? "VALID" : "NEEDS ATTENTION"}
                        </span>
                      </div>

                      {validationResult.summary && (
                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {Object.entries(validationResult.summary).map(([key, value]) => (
                            <div key={key} className="rounded-xl bg-[#F8FAFF] p-3 dark:bg-[#19171E]">
                              <p className="text-[10px] capitalize text-[#8A9ABB] dark:text-[#B0A5BD]">
                                {key}
                              </p>
                              <p className="mt-1 text-lg font-bold text-[#10265F] dark:text-white">
                                {typeof value === "number" ? value : String(value)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {getArray(validationResult.errors).length > 0 && (
                        <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/20">
                          <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400">
                            Errors
                          </h4>
                          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-rose-700 dark:text-rose-300">
                            {validationResult.errors.map((item, index) => (
                              <li key={index}>
                                {typeof item === "string" ? item : item.message || JSON.stringify(item)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {getArray(validationResult.warnings).length > 0 && (
                        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
                          <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">
                            Warnings
                          </h4>
                          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-amber-700 dark:text-amber-300">
                            {validationResult.warnings.map((item, index) => (
                              <li key={index}>
                                {typeof item === "string" ? item : item.message || JSON.stringify(item)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </section>
                  )}

                  {/* VERSION API LIMITATION NOTE */}

                  <section className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
                    <CircleHelp size={19} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h3 className="text-xs font-bold text-blue-800 dark:text-blue-400">
                        CMS data structure
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-blue-700 dark:text-blue-300">
                        Existing modules and nested questions can only be displayed when the version API returns them.
                        Your current route list does not include collection endpoints for modules, parts, groups or questions.
                        A backend list endpoint will be needed for a complete reloadable workspace if those records are not nested in the version response.
                      </p>
                    </div>
                  </section>
                </>
              )}
            </>
          )}

          <footer className="pb-2 pt-2 text-center text-xs text-[#9AA8C2] dark:text-[#B0A5BD]">
            Equilx IELTS · Cambridge Content Management
          </footer>
        </main>
      </div>

      {/* =====================================================
          MODALS
      ===================================================== */}

      {modalType === "book" && (
        <Modal
          title={form.id ? "Edit Cambridge Book" : "Create Cambridge Book"}
          description={
            form.id
              ? "Update this book's details."
              : "Add a book to your Cambridge content catalog."
          }
          onClose={closeModal}
          footer={
            <>
              <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#506995] dark:border-[#3B3441] dark:text-[#B0A5BD]">
                Cancel
              </button>
              <button type="button" onClick={createBook} disabled={saving} className="rounded-xl bg-[#FF2454] px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-50">
                {saving ? "Saving..." : form.id ? "Save Changes" : "Create Book"}
              </button>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Book Title" className="sm:col-span-2">
              <input className={inputClass} value={form.title || ""} onChange={(e) => updateForm("title", e.target.value)} placeholder="Cambridge IELTS 22" />
            </FormField>
            <FormField label="Book Number">
              <input type="number" min="1" className={inputClass} value={form.bookNumber || ""} onChange={(e) => updateForm("bookNumber", e.target.value)} placeholder="22" />
            </FormField>
            <FormField label="Publisher">
              <input className={inputClass} value={form.publisher || ""} onChange={(e) => updateForm("publisher", e.target.value)} placeholder="Cambridge University Press" />
            </FormField>
            <FormField label="Category">
              <select className={inputClass} value={form.category || "ACADEMIC"} onChange={(e) => updateForm("category", e.target.value)}>
                {CATEGORY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </FormField>
            <label className="flex items-center gap-2 self-end pb-3 text-xs font-semibold text-[#506995] dark:text-[#B0A5BD]">
              <input type="checkbox" checked={Boolean(form.isActive)} onChange={(e) => updateForm("isActive", e.target.checked)} />
              Active book
            </label>
          </div>
          {formError && <p className="mt-4 text-xs text-rose-600">{formError}</p>}
        </Modal>
      )}

      {modalType === "test" && (
        <Modal
          title={form.id ? "Edit Test" : "Create Test"}
          description={
            form.id
              ? `Update this test in ${getBookName(selectedBook)}.`
              : `Add a test to ${getBookName(selectedBook)}.`
          }
          onClose={closeModal}
          footer={
            <>
              <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#506995] dark:border-[#3B3441] dark:text-[#B0A5BD]">Cancel</button>
              <button type="button" onClick={createTest} disabled={saving} className="rounded-xl bg-[#FF2454] px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : form.id ? "Save Changes" : "Create Test"}</button>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Test Title" className="sm:col-span-2">
              <input className={inputClass} value={form.title || ""} onChange={(e) => updateForm("title", e.target.value)} placeholder="Test 1" />
            </FormField>
            <FormField label="Test Number">
              <input type="number" min="1" className={inputClass} value={form.testNumber ?? 1} onChange={(e) => updateForm("testNumber", e.target.value)} />
            </FormField>
            <FormField label="Category">
              <select className={inputClass} value={form.category || "ACADEMIC"} onChange={(e) => updateForm("category", e.target.value)}>
                {CATEGORY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </FormField>
          </div>
          {formError && <p className="mt-4 text-xs text-rose-600">{formError}</p>}
        </Modal>
      )}

      {modalType === "version" && (
        <Modal
          title="Create Test Version"
          description={`Create a new draft version for ${selectedTest?.title}.`}
          onClose={closeModal}
          footer={
            <>
              <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#506995] dark:border-[#3B3441] dark:text-[#B0A5BD]">Cancel</button>
              <button type="button" onClick={createVersion} disabled={saving} className="rounded-xl bg-[#FF2454] px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-50">{saving ? "Creating..." : "Create Draft Version"}</button>
            </>
          }
        >
          <div className="rounded-xl bg-blue-50 p-4 text-xs leading-5 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
            A new draft version will be created. You can then add the four IELTS modules, their parts, question groups, questions and answer keys.
          </div>
          {formError && <p className="mt-4 text-xs text-rose-600">{formError}</p>}
        </Modal>
      )}

      {modalType === "module" && (
        <Modal
          title={form.id ? "Edit Test Module" : "Create Test Module"}
          description={
            form.id
              ? "Update this IELTS section."
              : "Add one IELTS section to this test version."
          }
          onClose={closeModal}
          footer={
            <>
              <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#506995] dark:border-[#3B3441] dark:text-[#B0A5BD]">Cancel</button>
              <button type="button" onClick={createModule} disabled={saving} className="rounded-xl bg-[#FF2454] px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : form.id ? "Save Changes" : "Create Module"}</button>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="IELTS Section">
              <select
                className={inputClass}
                value={form.section || "LISTENING"}
                disabled={Boolean(form.id)}
                onChange={(e) => updateForm("section", e.target.value)}
              >
                {SECTIONS.map((section) => <option key={section} value={section}>{formatSection(section)}</option>)}
              </select>
            </FormField>
            <FormField label="Position">
              <input type="number" min="1" className={inputClass} value={form.position ?? 1} onChange={(e) => updateForm("position", e.target.value)} />
            </FormField>
            <FormField label="Duration (seconds)" className="sm:col-span-2">
              <input type="number" min="1" className={inputClass} value={form.durationSeconds ?? 1800} onChange={(e) => updateForm("durationSeconds", e.target.value)} />
            </FormField>
            <FormField label="Instructions JSON (optional)" className="sm:col-span-2">
              <textarea rows={3} className={inputClass} value={form.instructions || ""} onChange={(e) => updateForm("instructions", e.target.value)} placeholder='{"text":"Complete all questions."}' />
            </FormField>
          </div>
          {formError && <p className="mt-4 text-xs text-rose-600">{formError}</p>}
        </Modal>
      )}

      {modalType === "part" && (
        <Modal
          title={form.id ? "Edit Test Part" : "Create Test Part"}
          description={
            form.id
              ? "Update this part of the IELTS module."
              : "Add a part to the selected IELTS module."
          }
          onClose={closeModal}
          footer={
            <>
              <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#506995] dark:border-[#3B3441] dark:text-[#B0A5BD]">Cancel</button>
              <button type="button" onClick={createPart} disabled={saving} className="rounded-xl bg-[#FF2454] px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : form.id ? "Save Changes" : "Create Part"}</button>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Part Title" className="sm:col-span-2">
              <input className={inputClass} value={form.title || ""} onChange={(e) => updateForm("title", e.target.value)} placeholder="Part 1 - Student Accommodation" />
            </FormField>
            <FormField label="Position">
              <input type="number" min="1" className={inputClass} value={form.position ?? 1} onChange={(e) => updateForm("position", e.target.value)} />
            </FormField>
            <FormField label="Audio Asset Key (optional)">
              <input className={inputClass} value={form.audioAssetKey || ""} onChange={(e) => updateForm("audioAssetKey", e.target.value)} placeholder="listening/audio-file-key" />
            </FormField>
            <FormField label="Instructions JSON (optional)" className="sm:col-span-2">
              <textarea rows={3} className={inputClass} value={form.instructions || ""} onChange={(e) => updateForm("instructions", e.target.value)} placeholder='{"text":"Listen and answer questions 1-10."}' />
            </FormField>
          </div>
          {formError && <p className="mt-4 text-xs text-rose-600">{formError}</p>}
        </Modal>
      )}

      {modalType === "group" && (
        <Modal
          title={form.id ? "Edit Question Group" : "Create Question Group"}
          description={
            form.id
              ? "Update this passage or group of related questions."
              : "Add a passage or group of related questions."
          }
          onClose={closeModal}
          footer={
            <>
              <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#506995] dark:border-[#3B3441] dark:text-[#B0A5BD]">Cancel</button>
              <button type="button" onClick={createGroup} disabled={saving} className="rounded-xl bg-[#FF2454] px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : form.id ? "Save Changes" : "Create Group"}</button>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField label="Group Title">
              <input className={inputClass} value={form.title || ""} onChange={(e) => updateForm("title", e.target.value)} placeholder="Reading Passage 1" />
            </FormField>
            <FormField label="Position">
              <input type="number" min="1" className={inputClass} value={form.position ?? 1} onChange={(e) => updateForm("position", e.target.value)} />
            </FormField>
            <FormField label="Passage JSON (optional)">
              <textarea rows={4} className={inputClass} value={form.passage || ""} onChange={(e) => updateForm("passage", e.target.value)} placeholder='{"text":"Paste passage content here..."}' />
            </FormField>
            <FormField label="Instructions JSON (optional)">
              <textarea rows={3} className={inputClass} value={form.instructions || ""} onChange={(e) => updateForm("instructions", e.target.value)} placeholder='{"text":"Read the passage and answer questions 1-13."}' />
            </FormField>
          </div>
          {formError && <p className="mt-4 text-xs text-rose-600">{formError}</p>}
        </Modal>
      )}

      {modalType === "question" && (
        <Modal
          title={form.id ? "Edit Question" : "Create Question"}
          description={
            form.id
              ? "Update this question and its answer key."
              : "Create a question and optionally attach its answer key."
          }
          onClose={closeModal}
          footer={
            <>
              <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#506995] dark:border-[#3B3441] dark:text-[#B0A5BD]">Cancel</button>
              <button type="button" onClick={createQuestion} disabled={saving} className="rounded-xl bg-[#FF2454] px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : form.id ? "Save Changes" : "Create Question"}</button>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Question Number">
              <input type="number" min="1" className={inputClass} value={form.questionNumber ?? 1} onChange={(e) => updateForm("questionNumber", e.target.value)} />
            </FormField>
            <FormField label="Position">
              <input type="number" min="1" className={inputClass} value={form.position ?? 1} onChange={(e) => updateForm("position", e.target.value)} />
            </FormField>
            <FormField label="Question Type" className="sm:col-span-2">
              <select className={inputClass} value={form.questionType || "MULTIPLE_CHOICE"} onChange={(e) => updateForm("questionType", e.target.value)}>
                {QUESTION_TYPES.map((type) => <option key={type} value={type}>{formatSection(type)}</option>)}
              </select>
            </FormField>
            <FormField label="Marks">
              <input type="number" min="0.01" max="999.99" step="0.01" className={inputClass} value={form.marks ?? 1} onChange={(e) => updateForm("marks", e.target.value)} />
            </FormField>
            <div className="hidden sm:block" />
            <FormField label="Question Content JSON" className="sm:col-span-2">
              <textarea rows={5} className={`${inputClass} font-mono text-xs`} value={form.content || ""} onChange={(e) => updateForm("content", e.target.value)} placeholder={'{\n  "question": "What is the correct answer?",\n  "options": ["A", "B", "C", "D"]\n}'} />
            </FormField>
            <FormField label="Accepted Answers JSON (optional)" className="sm:col-span-2">
              <textarea rows={3} className={`${inputClass} font-mono text-xs`} value={form.acceptedAnswers || ""} onChange={(e) => updateForm("acceptedAnswers", e.target.value)} placeholder={'["answer one", "answer 1"]'} />
            </FormField>
            <FormField label="Explanation (optional)" className="sm:col-span-2">
              <textarea rows={3} className={inputClass} value={form.explanation || ""} onChange={(e) => updateForm("explanation", e.target.value)} placeholder="Explain why the answer is correct..." />
            </FormField>
          </div>
          {formError && <p className="mt-4 text-xs text-rose-600">{formError}</p>}
        </Modal>
      )}

      {modalType === "band" && (
        <Modal
          title="Create Band Conversion"
          description="Map raw scores to IELTS band scores."
          onClose={closeModal}
          footer={
            <>
              <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#506995] dark:border-[#3B3441] dark:text-[#B0A5BD]">Cancel</button>
              <button type="button" onClick={submitBandConversion} disabled={saving} className="rounded-xl bg-[#FF2454] px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save Conversion"}</button>
            </>
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Section">
              <select className={inputClass} value={form.section || "LISTENING"} onChange={(e) => updateForm("section", e.target.value)}>
                {["LISTENING", "READING"].map((section) => <option key={section} value={section}>{formatSection(section)}</option>)}
              </select>
            </FormField>
            <FormField label="Category">
              <select className={inputClass} value={form.category || "ACADEMIC"} onChange={(e) => updateForm("category", e.target.value)}>
                {CATEGORY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </FormField>
            <FormField label="Conversion JSON" className="sm:col-span-2">
              <textarea rows={10} className={`${inputClass} font-mono text-xs`} value={form.payload || ""} onChange={(e) => updateForm("payload", e.target.value)} />
            </FormField>
          </div>
          {formError && <p className="mt-4 text-xs text-rose-600">{formError}</p>}
        </Modal>
      )}

      {modalType === "bulk" && (
        <Modal
          title="Bulk Import Test"
          description="Upload or paste a full test as JSON."
          onClose={closeModal}
          footer={
            <>
              <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#506995] dark:border-[#3B3441] dark:text-[#B0A5BD]">Cancel</button>
              <button type="button" onClick={submitBulkImport} disabled={saving} className="rounded-xl bg-[#FF2454] px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-50">{saving ? "Importing..." : "Import Test"}</button>
            </>
          }
        >
          <div className="space-y-4">
            <FormField label="JSON File">
              <input type="file" accept="application/json,.json" onChange={handleImportFile} className={inputClass} />
            </FormField>
            <FormField label="Import JSON">
              <textarea rows={12} className={`${inputClass} font-mono text-xs`} value={form.json || ""} onChange={(e) => updateForm("json", e.target.value)} placeholder='{ "book": { ... }, "test": { ... } }' />
            </FormField>
          </div>
          {formError && <p className="mt-4 text-xs text-rose-600">{formError}</p>}
        </Modal>
      )}
    </div>
  );
}
