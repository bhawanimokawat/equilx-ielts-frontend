
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar";
import assignmentService from "../../services/insitute/assignmentService";
import AuthContext from "../../context/AuthContext";

import {
  ClipboardList,
  Users,
  Clock,
  Plus,
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
  CalendarDays,
  FileText,
  Download,
} from "lucide-react";

// ---------------------------------------------------------
// UI COLORS
// ---------------------------------------------------------

const typeColors = {
  Assignment:
    "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
};

const statusColors = {
  DRAFT:
    "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",

  PUBLISHED:
    "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",

  CLOSED:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",

  CANCELLED:
    "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
};

// ---------------------------------------------------------
// REUSABLE STATISTICS CARD
// ---------------------------------------------------------

function StatCard({ title, value, change, icon: Icon, color }) {
  const colors = {
    rose: [
      "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400",
      "#FF3864",
    ],
    purple: [
      "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
      "#A044FF",
    ],
    blue: [
      "bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400",
      "#2995FF",
    ],
  };

  const [iconStyle, lineColor] = colors[color];

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconStyle}`}
        >
          <Icon size={26} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#10265F] dark:text-slate-100">
            {title}
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-3xl font-extrabold text-[#10265F] dark:text-slate-100">
              {value}
            </span>

            <span className="text-xs font-bold text-emerald-500">
              {change}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-[#91899B]">
            Current records
          </p>
        </div>
      </div>

      <svg
        viewBox="0 0 250 38"
        preserveAspectRatio="none"
        className="mt-3 h-9 w-full"
      >
        <path
          d="M0 32 C18 26 26 32 45 23 S76 6 96 15 S126 28 145 18 S177 24 196 12 S227 13 250 3 L250 38 L0 38 Z"
          fill={lineColor}
          fillOpacity=".12"
        />

        <path
          d="M0 32 C18 26 26 32 45 23 S76 6 96 15 S126 28 145 18 S177 24 196 12 S227 13 250 3"
          fill="none"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </section>
  );
}

// ---------------------------------------------------------
// REUSABLE PANEL
// ---------------------------------------------------------

function Panel({ title, children, action }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold text-[#10265F] dark:text-slate-100">
          {title}
        </h2>

        {action}
      </div>

      {children}
    </section>
  );
}

// ---------------------------------------------------------
// CREATE ASSIGNMENT MODAL
// ---------------------------------------------------------

function CreateAssignmentModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "Practice Test",
    batch: "Batch A",
    trainer: "Aman Sharma",
    dueDate: "",
  });

  const update = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const submit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.dueDate) return;

    // Creation is intentionally held until real batch IDs and
    // published test-version IDs are available in this form.
    onCreate(form);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-pink-400 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white dark:[color-scheme:dark]";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-[#10265F] dark:text-slate-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:border dark:border-[#3B3441] dark:bg-[#211E27]"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#10265F] dark:text-white">
              Create Assignment
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-[#B0A5BD]">
              Assign practice work or mock tests to a batch.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#302B36]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className={labelClass}>Assignment Title</span>

            <input
              name="title"
              required
              value={form.title}
              onChange={update}
              placeholder="Enter assignment title"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className={labelClass}>Description</span>

            <textarea
              name="description"
              value={form.description}
              onChange={update}
              placeholder="Add instructions or reference material"
              rows={2}
              className={`${inputClass} resize-y`}
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Assignment Type</span>

              <select
                name="type"
                value={form.type}
                onChange={update}
                className={inputClass}
              >
                <option>Mock Test</option>
                <option>Practice Test</option>
                <option>Study Material</option>
              </select>
            </label>

            <label>
              <span className={labelClass}>Assign Batch</span>

              <select
                name="batch"
                value={form.batch}
                onChange={update}
                className={inputClass}
              >
                <option>Batch A</option>
                <option>Batch B</option>
                <option>Batch C</option>
                <option>Batch D</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className={labelClass}>Trainer</span>

            <select
              name="trainer"
              value={form.trainer}
              onChange={update}
              className={inputClass}
            >
              <option>Aman Sharma</option>
              <option>Pooja Gupta</option>
              <option>Rahul Kumar</option>
              <option>Neha Singh</option>
              <option>Tanvi Mehta</option>
            </select>
          </label>

          <label className="block">
            <span className={labelClass}>Due Date</span>

            <input
              type="date"
              name="dueDate"
              required
              value={form.dueDate}
              onChange={update}
              className={inputClass}
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-[#3B3441] dark:text-slate-300 dark:hover:bg-[#302B36]"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-[#FF2454] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            Create Assignment
          </button>
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------
// DATE FORMATTER
// ---------------------------------------------------------

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ---------------------------------------------------------
// API RESPONSE HELPERS
// ---------------------------------------------------------

// assignmentService unwraps Axios response.data.
// Therefore, the API envelope is available directly here.
function getResponseData(response) {
  return response?.data ?? {};
}

// Convert the backend assignment into a consistent shape
// for the existing table and analytics UI.
function normalizeAssignment(assignment) {
  const trainer =
    assignment?.createdBy?.profile?.name ||
    assignment?.createdBy?.name ||
    assignment?.createdBy?.email ||
    "—";

  const initials = trainer
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const recipientCount = assignment?._count?.targets ?? 0;

  return {
    ...assignment,

    // Actual backend fields.
    id: assignment.id,
    title: assignment.title || "Untitled Assignment",
    status: assignment.status || "DRAFT",
    dueDate: assignment.dueAt || null,

    // These fields are display fallbacks because the list API
    // does not currently provide batch names or assignment types.
    description: assignment.instructions || "Assignment",
    type: "Assignment",
    batch: "Assigned recipients",
    students: recipientCount,

    trainer,
    initials: initials || "—",

    // Completion is not fabricated. It will be populated
    // when the progress API response is integrated.
    completion: null,
  };
}

// ---------------------------------------------------------
// MAIN ASSIGNMENTS PAGE
// ---------------------------------------------------------

export default function Assignments() {
  const { user } = useContext(AuthContext);

  // Find the active institute membership.
  const instituteId =
    user?.memberships?.find(
      (membership) =>
        membership.role === "INSTITUTE_ADMIN" &&
        membership.status === "ACTIVE"
    )?.instituteId || null;

  // -------------------------------------------------------
  // STATE
  // -------------------------------------------------------

  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState("All Types");
  const [batchFilter, setBatchFilter] = useState("All Batches");
  const [trainerFilter, setTrainerFilter] = useState("All Trainers");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showModal, setShowModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const [notice, setNotice] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // -------------------------------------------------------
  // LOAD ASSIGNMENTS
  // -------------------------------------------------------

  const loadAssignments = useCallback(async () => {
    if (!instituteId) {
      setAssignments([]);
      setPagination((previous) => ({
        ...previous,
        total: 0,
        totalPages: 1,
      }));
      setError("No active institute membership found.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Status is sent to the backend only when a real
      // backend lifecycle status has been selected.
      const response = await assignmentService.getAssignments(
        instituteId,
        {
          page: pagination.page,
          limit: pagination.limit,
          search: search.trim() || undefined,
          status:
            statusFilter !== "All Status"
              ? statusFilter
              : undefined,
        }
      );

      const result = getResponseData(response);

      // Expected response:
      // { success, message, data: { assignments, pagination } }
      const assignmentData = result.data || {};

      const records = Array.isArray(assignmentData.assignments)
        ? assignmentData.assignments
        : [];

      setAssignments(records.map(normalizeAssignment));

      setPagination((previous) => ({
        ...previous,
        ...(assignmentData.pagination || {}),
      }));
    } catch (err) {
      console.error("Failed to load assignments:", err);

      setAssignments([]);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load assignments."
      );
    } finally {
      setLoading(false);
    }
  }, [
    instituteId,
    pagination.page,
    pagination.limit,
    search,
    statusFilter,
  ]);

  // Reload whenever institute, page, search or status changes.
  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  // -------------------------------------------------------
  // REFRESH AFTER A SUCCESSFUL ACTION
  // -------------------------------------------------------

  const refreshAssignments = async (message) => {
    setActiveMenu(null);
    setNotice(message);

    await loadAssignments();
  };

  // -------------------------------------------------------
  // ASSIGNMENT LIFECYCLE ACTIONS
  // -------------------------------------------------------

  const publishAssignment = async (assignmentId) => {
    try {
      setActionLoading(true);

      await assignmentService.publishAssignment(
        instituteId,
        assignmentId
      );

      await refreshAssignments("Assignment published successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to publish assignment."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const closeAssignment = async (assignmentId) => {
    try {
      setActionLoading(true);

      await assignmentService.closeAssignment(
        instituteId,
        assignmentId
      );

      await refreshAssignments("Assignment closed successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to close assignment."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const cancelAssignment = async (assignmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this assignment?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await assignmentService.cancelAssignment(
        instituteId,
        assignmentId
      );

      await refreshAssignments("Assignment cancelled successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to cancel assignment."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const deleteAssignment = async (assignmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this draft assignment?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await assignmentService.deleteAssignment(
        instituteId,
        assignmentId
      );

      await refreshAssignments("Assignment deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete assignment."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // -------------------------------------------------------
  // ASSIGNMENT INFORMATION APIs
  // -------------------------------------------------------

  // These actions call the real endpoints and log the returned
  // data for now. We can build dedicated detail views later.
  const loadAssignmentInformation = async (assignmentId, type) => {
    try {
      setActionLoading(true);
      setActiveMenu(null);

      let response;

      switch (type) {
        case "details":
          response = await assignmentService.getAssignmentDetails(
            instituteId,
            assignmentId
          );
          break;

        case "targets":
          response = await assignmentService.getAssignmentTargets(
            instituteId,
            assignmentId
          );
          break;

        case "progress":
          response = await assignmentService.getAssignmentProgress(
            instituteId,
            assignmentId
          );
          break;

        case "submissions":
          response = await assignmentService.getAssignmentSubmissions(
            instituteId,
            assignmentId
          );
          break;

        default:
          return;
      }

      console.log(`Assignment ${type} response:`, response);

      setNotice(
        `Assignment ${type} loaded successfully. Check the browser console for the API response.`
      );
    } catch (err) {
      console.error(`Failed to load assignment ${type}:`, err);

      setError(
        err.response?.data?.message ||
          err.message ||
          `Unable to load assignment ${type}.`
      );
    } finally {
      setActionLoading(false);
    }
  };

  // -------------------------------------------------------
  // FILTERED RECORDS
  // -------------------------------------------------------

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assignments.filter((item) => {
      const searchableValues = [
        item.title,
        item.description,
        item.batch,
        item.trainer,
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      // The current list API does not return type or batch names.
      // Apply these filters only when the backend provides them.
      const matchesType =
        typeFilter === "All Types" ||
        !item.type ||
        item.type === typeFilter;

      const matchesBatch =
        batchFilter === "All Batches" ||
        !item.batch ||
        item.batch === batchFilter;

      const matchesTrainer =
        trainerFilter === "All Trainers" ||
        item.trainer === trainerFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesBatch &&
        matchesTrainer &&
        matchesStatus
      );
    });
  }, [
    assignments,
    search,
    typeFilter,
    batchFilter,
    trainerFilter,
    statusFilter,
  ]);

  // -------------------------------------------------------
  // STATISTICS
  // -------------------------------------------------------

  // These statistics use actual backend lifecycle statuses.
  const total = pagination.total;

  const published = assignments.filter(
    (item) => item.status === "PUBLISHED"
  ).length;

  const drafts = assignments.filter(
    (item) => item.status === "DRAFT"
  ).length;

  // -------------------------------------------------------
  // DISTRIBUTION
  // -------------------------------------------------------

  // The current list response does not include assignment type.
  // Avoid presenting invented type statistics.
  const distribution = [
    {
      label: "Assignments",
      type: "Assignment",
      color: "#FF7199",
      count: total,
    },
  ];

  // -------------------------------------------------------
  // SERVER-SIDE PAGINATION
  // -------------------------------------------------------

  const currentPage = pagination.page;
  const totalPages = Math.max(1, pagination.totalPages);

  // The API already returns one page of records, so we must
  // not slice the records again on the frontend.
  const visible = filtered;

  const changePage = (nextPage) => {
    setPagination((previous) => ({
      ...previous,
      page: nextPage,
    }));
  };

  // -------------------------------------------------------
  // CREATE ASSIGNMENT
  // -------------------------------------------------------

  const createAssignment = () => {
    setNotice(
      "Assignment creation will be enabled after connecting real batches and published test versions."
    );

    // Do not create fake local records or submit invalid payloads.
    return false;
  };

  // -------------------------------------------------------
  // CSV EXPORT
  // -------------------------------------------------------

  const exportCSV = () => {
    const headers = [
      "Title",
      "Status",
      "Assigned Recipients",
      "Trainer",
      "Due Date",
      "Created At",
    ];

    const rows = filtered.map((item) => [
      item.title,
      item.status,
      item.students,
      item.trainer,
      item.dueDate || "",
      item.createdAt || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "institute-assignments.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  // -------------------------------------------------------
  // UPCOMING DEADLINES
  // -------------------------------------------------------

  const upcomingDeadlines = useMemo(() => {
    return assignments
      .filter(
        (item) =>
          item.dueDate &&
          item.status === "PUBLISHED" &&
          !Number.isNaN(new Date(item.dueDate).getTime())
      )
      .slice()
      .sort(
        (a, b) =>
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
      )
      .slice(0, 4);
  }, [assignments]);

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#F5F7FF] transition-colors duration-300 dark:bg-[#17151B]">
      <Sidebar />

      <div className="ml-[260px] flex min-h-screen min-w-0 flex-col">
        <Navbar />

        <main className="min-w-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto p-4 md:p-6">

          {/* Page heading */}

          <section className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#6B7FA8] dark:text-[#B0A5BD]">
                Assignments <span className="mx-1">›</span> Manage Assignments
              </p>

              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#10265F] dark:text-white">
                Assignments{" "}
                <span className="text-[#FF2454]">Management</span>
              </h1>

              <p className="mt-2 text-sm text-[#7183A7] dark:text-[#B0A5BD]">
                Assign mock tests, practice tests and study materials to your
                students. Track completion and performance.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={exportCSV}
                disabled={filtered.length === 0}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#10265F] shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-slate-200 dark:hover:bg-[#302B36]"
              >
                <Download size={17} />
                Export
              </button>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
              >
                <Plus size={19} />
                Create Assignment
              </button>
            </div>
          </section>

          {/* Success notice */}

          {notice && (
            <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
              {notice}

              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss"
                className="rounded-md p-1 transition hover:bg-emerald-100 dark:hover:bg-emerald-500/10"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Error notice */}

          {error && (
            <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
              {error}

              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
                className="rounded-md p-1 transition hover:bg-rose-100 dark:hover:bg-rose-500/10"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Statistics */}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title="Total Assignments"
              value={total}
              change=""
              icon={ClipboardList}
              color="rose"
            />

            <StatCard
              title="Published"
              value={published}
              change=""
              icon={Users}
              color="purple"
            />

            <StatCard
              title="Drafts"
              value={drafts}
              change=""
              icon={Clock}
              color="blue"
            />
          </section>

          {/* Main table and right analytics */}

          <section className="grid grid-cols-1 items-start gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
            <Panel
              title="All Assignments"
              action={
                <span className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-[#FF2454] dark:bg-rose-500/10 dark:text-rose-400">
                  {pagination.total} results
                </span>
              }
            >

              {/* Filters */}

              <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
                <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 dark:border-[#3B3441] dark:bg-[#19171E] xl:col-span-2">
                  <Search
                    size={16}
                    className="shrink-0 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);

                      setPagination((previous) => ({
                        ...previous,
                        page: 1,
                      }));
                    }}
                    placeholder="Search assignments..."
                    className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-[#91899B]"
                  />
                </div>

                {[
                  {
                    value: typeFilter,
                    setter: setTypeFilter,
                    options: ["All Types", "Assignment"],
                  },
                  {
                    value: batchFilter,
                    setter: setBatchFilter,
                    options: ["All Batches"],
                  },
                  {
                    value: statusFilter,
                    setter: setStatusFilter,
                    options: [
                      "All Status",
                      "DRAFT",
                      "PUBLISHED",
                      "CLOSED",
                      "CANCELLED",
                    ],
                  },
                ].map((filter, index) => (
                  <select
                    key={index}
                    value={filter.value}
                    onChange={(event) => {
                      filter.setter(event.target.value);

                      if (filter.setter === setStatusFilter) {
                        setPagination((previous) => ({
                          ...previous,
                          page: 1,
                        }));
                      }
                    }}
                    className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-2 text-xs text-[#10265F] outline-none transition focus:border-pink-400 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-slate-200"
                  >
                    {filter.options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                ))}
              </div>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#B0A5BD]">
                  <Filter size={15} />
                  Filter by assignment type, batch, trainer or status.
                </div>

                <select
                  value={trainerFilter}
                  onChange={(event) => {
                    setTrainerFilter(event.target.value);
                  }}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-[#10265F] outline-none dark:border-[#3B3441] dark:bg-[#19171E] dark:text-slate-200"
                >
                  <option>All Trainers</option>

                  {Array.from(
                    new Set(
                      assignments
                        .map((item) => item.trainer)
                        .filter((trainer) => trainer && trainer !== "—")
                    )
                  ).map((trainer) => (
                    <option key={trainer}>{trainer}</option>
                  ))}
                </select>
              </div>

              {/* Table */}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] text-slate-500 dark:bg-[#19171E] dark:text-[#B0A5BD]">
                      {[
                        "#",
                        "Assignment Title",
                        "Type",
                        "Assigned To",
                        "Trainer",
                        "Due Date",
                        "Completion",
                        "Status",
                        "Actions",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-3 py-3 font-semibold"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="9"
                          className="px-4 py-12 text-center text-sm text-slate-500 dark:text-[#B0A5BD]"
                        >
                          Loading assignments...
                        </td>
                      </tr>
                    ) : (
                      <>
                        {visible.map((item, index) => (
                          <tr
                            key={item.id}
                            className="border-b border-slate-100 text-xs transition hover:bg-slate-50/70 dark:border-[#3B3441] dark:hover:bg-[#302B36]/60"
                          >
                            <td className="px-3 py-4 text-slate-400 dark:text-[#91899B]">
                              {(currentPage - 1) * pagination.limit + index + 1}
                            </td>

                            <td className="px-3 py-4">
                              <div className="flex items-center gap-2.5">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400">
                                  <FileText size={18} />
                                </span>

                                <div>
                                  <p className="whitespace-nowrap font-bold text-[#10265F] dark:text-slate-100">
                                    {item.title}
                                  </p>

                                  <p className="mt-1 whitespace-nowrap text-[10px] text-slate-400 dark:text-[#91899B]">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-3 py-4">
                              <span
                                className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${
                                  typeColors[item.type] ||
                                  "bg-slate-100 text-slate-600 dark:bg-[#302B36] dark:text-slate-300"
                                }`}
                              >
                                {item.type}
                              </span>
                            </td>

                            <td className="px-3 py-4">
                              <p className="font-semibold text-[#10265F] dark:text-slate-100">
                                {item.batch}
                              </p>

                              <p className="mt-1 text-[10px] text-slate-400 dark:text-[#91899B]">
                                {item.students} recipients
                              </p>
                            </td>

                            <td className="px-3 py-4">
                              <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                                  {item.initials}
                                </span>

                                <span className="whitespace-nowrap text-[#10265F] dark:text-slate-200">
                                  {item.trainer}
                                </span>
                              </div>
                            </td>

                            <td className="whitespace-nowrap px-3 py-4 text-slate-500 dark:text-[#B0A5BD]">
                              {formatDate(item.dueDate)}
                            </td>

                            <td className="px-3 py-4">
                              <div className="flex items-center gap-2">
                                <div className="h-2.5 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-[#3B3441]">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                                    style={{
                                      width: `${item.completion ?? 0}%`,
                                    }}
                                  />
                                </div>

                                <span className="text-[10px] text-slate-500 dark:text-[#B0A5BD]">
                                  {item.completion == null
                                    ? "—"
                                    : `${item.completion}%`}
                                </span>
                              </div>
                            </td>

                            <td className="px-3 py-4">
                              <span
                                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                                  statusColors[item.status] ||
                                  "bg-slate-100 text-slate-600 dark:bg-[#302B36] dark:text-slate-300"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>

                            <td className="relative px-3 py-4">
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveMenu(
                                    activeMenu === item.id ? null : item.id
                                  )
                                }
                                aria-label={`Actions for ${item.title}`}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-[#B0A5BD] dark:hover:bg-[#302B36]"
                              >
                                <MoreVertical size={17} />
                              </button>

                              {activeMenu === item.id && (
                                <div className="absolute right-8 top-10 z-20 w-48 rounded-xl border border-slate-100 bg-white p-1 shadow-xl dark:border-[#3B3441] dark:bg-[#211E27]">

                                  {/* Read operations */}

                                  {[
                                    ["View details", "details"],
                                    ["View targets", "targets"],
                                    ["View progress", "progress"],
                                    ["View submissions", "submissions"],
                                  ].map(([label, type]) => (
                                    <button
                                      key={type}
                                      type="button"
                                      disabled={actionLoading}
                                      onClick={() =>
                                        loadAssignmentInformation(
                                          item.id,
                                          type
                                        )
                                      }
                                      className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#10265F] transition hover:bg-slate-50 disabled:opacity-50 dark:text-slate-200 dark:hover:bg-[#302B36]"
                                    >
                                      {label}
                                    </button>
                                  ))}

                                  <div className="my-1 border-t border-slate-100 dark:border-[#3B3441]" />

                                  {/* DRAFT assignments can be published or deleted. */}

                                  {item.status === "DRAFT" && (
                                    <>
                                      <button
                                        type="button"
                                        disabled={actionLoading}
                                        onClick={() =>
                                          publishAssignment(item.id)
                                        }
                                        className="w-full rounded-lg px-3 py-2 text-left text-xs text-emerald-600 transition hover:bg-slate-50 disabled:opacity-50 dark:text-emerald-400 dark:hover:bg-[#302B36]"
                                      >
                                        Publish assignment
                                      </button>

                                      <button
                                        type="button"
                                        disabled={actionLoading}
                                        onClick={() =>
                                          deleteAssignment(item.id)
                                        }
                                        className="w-full rounded-lg px-3 py-2 text-left text-xs text-rose-600 transition hover:bg-slate-50 disabled:opacity-50 dark:text-rose-400 dark:hover:bg-[#302B36]"
                                      >
                                        Delete draft
                                      </button>
                                    </>
                                  )}

                                  {/* PUBLISHED assignments can be closed or cancelled. */}

                                  {item.status === "PUBLISHED" && (
                                    <>
                                      <button
                                        type="button"
                                        disabled={actionLoading}
                                        onClick={() =>
                                          closeAssignment(item.id)
                                        }
                                        className="w-full rounded-lg px-3 py-2 text-left text-xs text-emerald-600 transition hover:bg-slate-50 disabled:opacity-50 dark:text-emerald-400 dark:hover:bg-[#302B36]"
                                      >
                                        Close assignment
                                      </button>

                                      <button
                                        type="button"
                                        disabled={actionLoading}
                                        onClick={() =>
                                          cancelAssignment(item.id)
                                        }
                                        className="w-full rounded-lg px-3 py-2 text-left text-xs text-rose-600 transition hover:bg-slate-50 disabled:opacity-50 dark:text-rose-400 dark:hover:bg-[#302B36]"
                                      >
                                        Cancel assignment
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}

                        {visible.length === 0 && (
                          <tr>
                            <td
                              colSpan="9"
                              className="px-4 py-12 text-center text-sm text-slate-500 dark:text-[#B0A5BD]"
                            >
                              No assignments found. Try changing your search or
                              filters.
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-[#3B3441]">
                <p className="text-xs text-slate-500 dark:text-[#B0A5BD]">
                  Showing{" "}
                  {pagination.total
                    ? (currentPage - 1) * pagination.limit + 1
                    : 0}{" "}
                  to{" "}
                  {Math.min(
                    (currentPage - 1) * pagination.limit + visible.length,
                    pagination.total
                  )}{" "}
                  of {pagination.total} assignments
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1 || loading}
                    onClick={() => changePage(currentPage - 1)}
                    aria-label="Previous page"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40 dark:border-[#3B3441] dark:text-slate-300 dark:hover:bg-[#302B36]"
                  >
                    <ChevronLeft size={17} />
                  </button>

                  <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#FF2454] px-3 text-xs font-bold text-white">
                    {currentPage}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages || loading}
                    onClick={() => changePage(currentPage + 1)}
                    aria-label="Next page"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40 dark:border-[#3B3441] dark:text-slate-300 dark:hover:bg-[#302B36]"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            </Panel>

            {/* Right analytics */}

            <div className="space-y-4">
              <Panel title="Assignment Distribution">
                <div className="flex flex-col items-center gap-5 sm:flex-row 2xl:flex-col">
                  <div
                    className="relative h-36 w-36 shrink-0 rounded-full"
                    style={{
                      background: `conic-gradient(${distribution
                        .map((item, index) => {
                          const start = distribution
                            .slice(0, index)
                            .reduce(
                              (sum, previous) => sum + previous.count,
                              0
                            );

                          const end = start + item.count;

                          return `${
                            item.color
                          } ${
                            total ? (start / total) * 100 : 0
                          }% ${
                            total ? (end / total) * 100 : 0
                          }%`;
                        })
                        .join(", ")})`,
                    }}
                  >
                    <div className="absolute inset-7 flex flex-col items-center justify-center rounded-full bg-white dark:bg-[#211E27]">
                      <span className="text-2xl font-extrabold text-[#10265F] dark:text-white">
                        {total}
                      </span>

                      <span className="text-xs text-slate-500 dark:text-[#B0A5BD]">
                        Assignments
                      </span>
                    </div>
                  </div>

                  <div className="w-full space-y-3">
                    {distribution.map((item) => (
                      <div
                        key={item.type}
                        className="flex items-center justify-between gap-2 text-xs"
                      >
                        <span className="flex items-center gap-2 text-slate-500 dark:text-[#B0A5BD]">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: item.color }}
                          />
                          {item.label}
                        </span>

                        <span className="font-semibold text-[#10265F] dark:text-slate-200">
                          {item.count} (100%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>

              <Panel title="Completion Rate by Batch">
                <div className="flex h-44 items-center justify-center border-b border-l border-slate-100 px-3 pb-1 pt-4 dark:border-[#3B3441]">
                  <p className="text-center text-xs text-slate-400 dark:text-[#91899B]">
                    Completion statistics will appear here when assignment
                    progress data is connected to the batch analytics.
                  </p>
                </div>
              </Panel>

              <Panel
                title="Upcoming Deadlines"
                action={
                  <CalendarDays
                    size={17}
                    className="text-slate-400 dark:text-[#91899B]"
                  />
                }
              >
                <div className="space-y-4">
                  {upcomingDeadlines.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          index % 2 === 0
                            ? "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400"
                            : "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                        }`}
                      >
                        <ClipboardList size={19} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#10265F] dark:text-slate-100">
                          {item.title}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-500 dark:text-[#B0A5BD]">
                          {item.students} recipients
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-rose-500">
                          Due {formatDate(item.dueDate)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {upcomingDeadlines.length === 0 && (
                    <p className="py-4 text-center text-xs text-slate-400 dark:text-[#91899B]">
                      No upcoming deadlines found.
                    </p>
                  )}
                </div>
              </Panel>
            </div>
          </section>

          <footer className="pb-2 text-center text-xs text-slate-400 dark:text-[#91899B]">
            Equilx IELTS · Institute Admin Portal
          </footer>
        </main>
      </div>

      {showModal && (
        <CreateAssignmentModal
          onClose={() => setShowModal(false)}
          onCreate={createAssignment}
        />
      )}
    </div>
  );
}
