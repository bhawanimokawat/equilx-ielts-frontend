import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar";

import AuthContext from "../../context/AuthContext";
import batchService from "../../services/insitute/batchService";

import {
  Layers3,
  Users,
  GraduationCap,
  Plus,
  Download,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CalendarDays,
  X,
  Clock,
  Trash2,
  UserCheck,
} from "lucide-react";

// Avatar colors are only visual styling, not backend data.
const avatarColors = [
  "bg-orange-100 text-orange-600",
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600",
  "bg-purple-100 text-purple-600",
  "bg-pink-100 text-pink-600",
  "bg-violet-100 text-violet-600",
];

const PAGE_SIZE = 8;

// Safely extract an error message from Axios/backend responses.
function getApiError(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

// Format backend timestamps for display.
function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Generate initials for trainer avatars.
function getInitials(value) {
  if (!value) return "NA";

  return value
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Extract the actual trainer name from a membership response.
function getTrainerName(trainer) {
  return (
    trainer?.user?.profile?.name ||
    trainer?.user?.name ||
    trainer?.user?.email ||
    trainer?.email ||
    "Unknown trainer"
  );
}

// Summary card.
function StatCard({ title, value, icon: Icon, color, description }) {
  const styles = {
    rose: "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400",
    purple:
      "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    blue: "bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${styles[color]}`}
        >
          <Icon size={27} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#10265F] dark:text-slate-100">
            {title}
          </p>

          <p className="mt-1 text-3xl font-extrabold text-[#10265F] dark:text-white">
            {value}
          </p>

          <p className="text-[11px] text-slate-400 dark:text-[#91899B]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

// Reusable panel.
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

// Create batch modal.
// Backend currently accepts only name and trainerId.
function CreateBatchModal({
  onClose,
  onCreate,
  trainers,
  submitting,
}) {
  const [form, setForm] = useState({
    name: "",
    trainerId: "",
  });

  const update = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (form.name.trim().length < 2) return;

    await onCreate({
      name: form.name.trim(),
      trainerId: form.trainerId || null,
    });
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-pink-400 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-[#10265F] dark:text-slate-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:border dark:border-[#3B3441] dark:bg-[#211E27]"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#10265F] dark:text-white">
              Create New Batch
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-[#B0A5BD]">
              Create a batch and optionally assign an active trainer.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            disabled={submitting}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-[#302B36]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className={labelClass}>Batch Name</span>

            <input
              name="name"
              required
              minLength={2}
              maxLength={150}
              value={form.name}
              onChange={update}
              placeholder="e.g. IELTS Foundation Batch"
              className={inputClass}
            />
          </label>

          <label className="sm:col-span-2">
            <span className={labelClass}>Assign Trainer</span>

            <select
              name="trainerId"
              value={form.trainerId}
              onChange={update}
              className={inputClass}
            >
              <option value="">No trainer assigned</option>

              {trainers.map((trainer) => (
                <option key={trainer.userId} value={trainer.userId}>
                  {getTrainerName(trainer)}
                </option>
              ))}
            </select>

            {trainers.length === 0 && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                No active trainers were found in this institute.
              </p>
            )}
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-[#3B3441] dark:text-slate-300 dark:hover:bg-[#302B36]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting || form.name.trim().length < 2}
            className="rounded-xl bg-[#FF2454] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Batch"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Batches() {
  const { user } = useContext(AuthContext);

  // Find the active institute membership.
  // Admins can manage batches and load the trainer list.
  const instituteMembership = useMemo(() => {
    const memberships = user?.memberships || [];

    return (
      memberships.find(
        (membership) =>
          membership.role === "INSTITUTE_ADMIN" &&
          membership.status === "ACTIVE"
      ) ||
      memberships.find(
        (membership) =>
          membership.role === "TRAINER" &&
          membership.status === "ACTIVE"
      ) ||
      null
    );
  }, [user]);

  const instituteId = instituteMembership?.instituteId || null;

  const isInstituteAdmin =
    instituteMembership?.role === "INSTITUTE_ADMIN";

  // Backend data.
  const [batches, setBatches] = useState([]);
  const [trainers, setTrainers] = useState([]);

  // API pagination information.
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  // UI state.
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  // Request states.
  const [loading, setLoading] = useState(true);
  const [trainerLoading, setTrainerLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingBatchId, setDeletingBatchId] = useState(null);

  // Notice and error states.
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");
  const [error, setError] = useState("");

  // Load batches from the backend.
  const fetchBatches = useCallback(
    async (requestedPage = page, searchValue = search) => {
      if (!instituteId) {
        setBatches([]);
        setPagination({
          page: 1,
          limit: PAGE_SIZE,
          total: 0,
          totalPages: 0,
        });
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const params = {
          page: requestedPage,
          limit: PAGE_SIZE,
        };

        if (searchValue.trim()) {
          params.search = searchValue.trim();
        }

        const response = await batchService.getBatches(
          instituteId,
          params
        );

        // Backend list response:
        // { success: true, data: { batches: [], pagination: {} } }
        const result = response?.data;

        setBatches(result?.batches || []);

        setPagination(
          result?.pagination || {
            page: requestedPage,
            limit: PAGE_SIZE,
            total: result?.batches?.length || 0,
            totalPages: 1,
          }
        );
      } catch (requestError) {
        setBatches([]);
        setError(getApiError(requestError));
      } finally {
        setLoading(false);
      }
    },
    [instituteId, page, search]
  );

  // Fetch the current page whenever the page or search changes.
  // The debounce prevents sending an API request on every keystroke.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBatches(page, search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fetchBatches, page, search]);

  // Load active trainers.
  // Membership listing is restricted to institute admins.
  const fetchTrainers = useCallback(async () => {
    if (!instituteId || !isInstituteAdmin) {
      setTrainers([]);
      return;
    }

    setTrainerLoading(true);

    try {
      const response = await batchService.getTrainers(instituteId);

      // Membership response:
      // { success: true, data: [...], pagination: {...} }
      const memberships = response?.data || [];

      setTrainers(
        memberships.filter(
          (membership) =>
            membership.role === "TRAINER" &&
            membership.status === "ACTIVE"
        )
      );
    } catch (requestError) {
      setTrainers([]);
      setNotice(getApiError(requestError));
      setNoticeType("error");
    } finally {
      setTrainerLoading(false);
    }
  }, [instituteId, isInstituteAdmin]);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  // Map trainer IDs to their actual names from membership data.
  const trainerMap = useMemo(() => {
    const map = new Map();

    trainers.forEach((trainer) => {
      map.set(trainer.userId, getTrainerName(trainer));
    });

    return map;
  }, [trainers]);

  // Resolve trainer names.
  // Batch list currently returns trainer id and email.
  const getBatchTrainer = (batch) => {
    if (!batch.trainerId) {
      return "Not assigned";
    }

    return (
      trainerMap.get(batch.trainerId) ||
      batch.trainer?.email ||
      "Assigned trainer"
    );
  };

  // Summary data is calculated from actual API results.
  const totalBatches = pagination.total || 0;

  // This count represents only the batches loaded on the current page.
  const studentsOnCurrentPage = batches.reduce(
    (sum, batch) => sum + (batch._count?.members || 0),
    0
  );

  const assignedTrainersOnCurrentPage = new Set(
    batches
      .filter((batch) => batch.trainerId)
      .map((batch) => batch.trainerId)
  ).size;

  const unassignedBatchesOnCurrentPage = batches.filter(
    (batch) => !batch.trainerId
  ).length;

  // Backend pagination controls the current page and total pages.
  const currentPage = pagination.page || page;
  const totalPages = Math.max(1, pagination.totalPages || 1);
  const totalRecords = pagination.total || 0;

  const firstRecord = totalRecords
    ? (currentPage - 1) * PAGE_SIZE + 1
    : 0;

  const lastRecord = Math.min(
    currentPage * PAGE_SIZE,
    totalRecords
  );

  // Create a batch using the backend API.
  const createBatch = async (form) => {
    if (!instituteId) return;

    setSubmitting(true);
    setNotice("");
    setError("");

    try {
      const response = await batchService.createBatch(
        instituteId,
        {
          name: form.name,
          trainerId: form.trainerId,
        }
      );

      setShowModal(false);
      setPage(1);
      setSearch("");

      setNotice(
        response?.message || "Batch created successfully."
      );
      setNoticeType("success");

      // Refresh the actual backend list.
      await fetchBatches(1, "");
    } catch (requestError) {
      setNotice(getApiError(requestError));
      setNoticeType("error");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a batch using the backend API.
  const deleteBatch = async (batch) => {
    if (!instituteId || !batch?.id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${batch.name}"?`
    );

    if (!confirmed) {
      setActiveMenu(null);
      return;
    }

    setDeletingBatchId(batch.id);
    setActiveMenu(null);
    setNotice("");

    try {
      const response = await batchService.deleteBatch(
        instituteId,
        batch.id
      );

      setNotice(
        response?.message || "Batch deleted successfully."
      );
      setNoticeType("success");

      // If the last row on a page was deleted, move back one page.
      const nextPage =
        batches.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;

      setPage(nextPage);
      await fetchBatches(nextPage, search);
    } catch (requestError) {
      setNotice(getApiError(requestError));
      setNoticeType("error");
    } finally {
      setDeletingBatchId(null);
    }
  };

  // Export the currently loaded API results as CSV.
  const exportBatches = () => {
    if (!batches.length) {
      setNotice("There are no batches on this page to export.");
      setNoticeType("error");
      return;
    }

    const headers = [
      "Batch Name",
      "Trainer",
      "Trainer ID",
      "Students",
      "Created Date",
      "Updated Date",
    ];

    const rows = batches.map((batch) => [
      batch.name || "",
      getBatchTrainer(batch),
      batch.trainerId || "",
      batch._count?.members || 0,
      formatDate(batch.createdAt),
      formatDate(batch.updatedAt),
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`
          )
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
    link.download = `institute-batches-page-${currentPage}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  // Search changes reset server-side pagination to page 1.
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const showNotice = noticeType === "success";

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
                Batches <span className="mx-1">›</span> Manage Batches
              </p>

              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#10265F] dark:text-white">
                Batch <span className="text-[#FF2454]">Management</span>
              </h1>

              <p className="mt-2 text-sm text-[#7183A7] dark:text-[#B0A5BD]">
                Create and manage institute batches, assign trainers and
                view enrolled student counts.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={exportBatches}
                disabled={loading || batches.length === 0}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#10265F] shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-slate-200 dark:hover:bg-[#302B36]"
              >
                <Download size={17} />
                Export Batches
              </button>

              {isInstituteAdmin && (
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
                >
                  <Plus size={19} />
                  Create Batch
                </button>
              )}
            </div>
          </section>

          {/* Success and error notices */}
          {notice && (
            <div
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
                showNotice
                  ? "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400"
              }`}
            >
              <span>{notice}</span>

              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Institute membership error */}
          {!instituteId && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
              No active institute membership was found for this account.
              Please check your institute membership before managing batches.
            </div>
          )}

          {/* API error */}
          {error && (
            <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => fetchBatches(page, search)}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Summary cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title="Total Batches"
              value={loading ? "..." : totalBatches}
              description="Across this institute"
              icon={Layers3}
              color="rose"
            />

            <StatCard
              title="Total Students"
              value={loading ? "..." : studentsOnCurrentPage}
              description="In currently loaded batches"
              icon={Users}
              color="purple"
            />

            <StatCard
              title="Assigned Trainers"
              value={loading ? "..." : assignedTrainersOnCurrentPage}
              description="In currently loaded batches"
              icon={GraduationCap}
              color="blue"
            />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            {/* Main batch list */}
            <div className="min-w-0 xl:col-span-12">
              <Panel
                title="Manage Batches"
                action={
                  <div className="flex flex-wrap gap-2">
                    <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 dark:border-[#3B3441] dark:bg-[#19171E]">
                      <Search size={16} className="text-slate-400" />

                      <input
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search batch names..."
                        className="w-36 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 sm:w-48 dark:text-white dark:placeholder:text-[#91899B]"
                      />
                    </div>
                  </div>
                }
              >
                {/* Backend currently does not expose batch status filters. */}
                <div className="mb-4 flex flex-wrap gap-5 border-b border-slate-100 dark:border-[#3B3441]">
                  <div className="border-b-2 border-[#FF2454] pb-3 text-sm font-bold text-[#FF2454]">
                    All Batches ({totalRecords})
                  </div>
                </div>

                <div className="mb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-[#B0A5BD]">
                  <SlidersHorizontal size={15} />

                  <span>
                    Search by batch name. Student counts and trainer
                    assignments are loaded from the backend.
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] text-slate-500 dark:bg-[#19171E] dark:text-[#B0A5BD]">
                        {[
                          "#",
                          "Batch Name",
                          "Trainer",
                          "Students",
                          "Created Date",
                          "Updated Date",
                          "Progress",
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
                      {loading && (
                        <tr>
                          <td
                            colSpan="9"
                            className="px-4 py-12 text-center text-sm text-slate-500 dark:text-[#B0A5BD]"
                          >
                            Loading batches...
                          </td>
                        </tr>
                      )}

                      {!loading &&
                        batches.map((batch, index) => {
                          const trainerName = getBatchTrainer(batch);
                          const assigned = Boolean(batch.trainerId);

                          return (
                            <tr
                              key={batch.id}
                              className="border-b border-slate-100 text-xs transition hover:bg-slate-50/70 dark:border-[#3B3441] dark:hover:bg-[#302B36]/60"
                            >
                              <td className="px-3 py-4 text-slate-400 dark:text-[#91899B]">
                                {(currentPage - 1) * PAGE_SIZE +
                                  index +
                                  1}
                              </td>

                              <td className="px-3 py-4">
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                      avatarColors[
                                        index % avatarColors.length
                                      ]
                                    }`}
                                  >
                                    {getInitials(batch.name)}
                                  </span>

                                  <div>
                                    <p className="whitespace-nowrap font-bold text-[#10265F] dark:text-slate-100">
                                      {batch.name}
                                    </p>

                                    <p className="mt-1 text-[10px] text-slate-400 dark:text-[#91899B]">
                                      Batch ID: {batch.id.slice(0, 8)}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-3 py-4">
                                <div className="flex items-center gap-2">
                                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                                    {assigned
                                      ? getInitials(trainerName)
                                      : "—"}
                                  </span>

                                  <div>
                                    <p className="whitespace-nowrap font-medium text-[#10265F] dark:text-slate-200">
                                      {trainerName}
                                    </p>

                                    <span className="text-[10px] text-slate-400 dark:text-[#91899B]">
                                      {assigned
                                        ? "Assigned"
                                        : "Unassigned"}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="px-3 py-4 font-semibold text-[#10265F] dark:text-slate-200">
                                {batch._count?.members ?? 0}
                              </td>

                              <td className="whitespace-nowrap px-3 py-4 text-slate-500 dark:text-[#B0A5BD]">
                                {formatDate(batch.createdAt)}
                              </td>

                              <td className="whitespace-nowrap px-3 py-4 text-slate-500 dark:text-[#B0A5BD]">
                                {formatDate(batch.updatedAt)}
                              </td>

                              {/* Progress is not currently stored by the backend. */}
                              <td className="px-3 py-4 text-slate-400 dark:text-[#91899B]">
                                —
                              </td>

                              {/* Batch status is not currently stored by the backend. */}
                              <td className="px-3 py-4 text-slate-400 dark:text-[#91899B]">
                                —
                              </td>

                              <td className="relative px-3 py-4">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveMenu(
                                      activeMenu === batch.id
                                        ? null
                                        : batch.id
                                    )
                                  }
                                  aria-label={`Actions for ${batch.name}`}
                                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-[#B0A5BD] dark:hover:bg-[#302B36]"
                                >
                                  <MoreVertical size={17} />
                                </button>

                                {activeMenu === batch.id && (
                                  <div className="absolute right-8 top-10 z-20 w-44 rounded-xl border border-slate-100 bg-white p-1 shadow-xl dark:border-[#3B3441] dark:bg-[#211E27]">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setNotice(
                                          `${batch.name} · ${batch._count?.members || 0} students · Trainer: ${trainerName}`
                                        );
                                        setNoticeType("success");
                                        setActiveMenu(null);
                                      }}
                                      className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#10265F] transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-[#302B36]"
                                    >
                                      View batch details
                                    </button>

                                    {isInstituteAdmin && (
                                      <button
                                        type="button"
                                        disabled={
                                          deletingBatchId === batch.id
                                        }
                                        onClick={() => deleteBatch(batch)}
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                                      >
                                        <Trash2 size={14} />
                                        {deletingBatchId === batch.id
                                          ? "Deleting..."
                                          : "Delete batch"}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}

                      {!loading && batches.length === 0 && (
                        <tr>
                          <td
                            colSpan="9"
                            className="px-4 py-12 text-center text-sm text-slate-500 dark:text-[#B0A5BD]"
                          >
                            {error
                              ? "Unable to load batches."
                              : search
                                ? "No batches match your search."
                                : "No batches found. Create your first batch to get started."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Server-side pagination */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-[#3B3441]">
                  <p className="text-xs text-slate-500 dark:text-[#B0A5BD]">
                    Showing {firstRecord} to {lastRecord} of{" "}
                    {totalRecords} batches
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage <= 1 || loading}
                      onClick={() =>
                        setPage((value) => Math.max(1, value - 1))
                      }
                      aria-label="Previous page"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40 dark:border-[#3B3441] dark:text-slate-300 dark:hover:bg-[#302B36]"
                    >
                      <ChevronLeft size={17} />
                    </button>

                    <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#FF2454] px-3 text-xs font-bold text-white">
                      {currentPage}
                    </span>

                    <span className="text-xs text-slate-400">
                      of {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={
                        currentPage >= totalPages || loading
                      }
                      onClick={() =>
                        setPage((value) =>
                          Math.min(totalPages, value + 1)
                        )
                      }
                      aria-label="Next page"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40 dark:border-[#3B3441] dark:text-slate-300 dark:hover:bg-[#302B36]"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              </Panel>
            </div>

            {/* Right side information panels */}
            <div className="space-y-4 xl:col-span-12 2xl:col-span-4">
              {/* Replaces category distribution with real trainer assignment data. */}
              <Panel title="Batch Distribution">
                <div className="flex flex-col items-center gap-5 sm:flex-row xl:flex-col">
                  <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full border-[12px] border-slate-100 dark:border-[#3B3441]">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold text-[#10265F] dark:text-white">
                        {loading ? "..." : batches.length}
                      </span>

                      <span className="text-xs text-slate-500 dark:text-[#B0A5BD]">
                        Loaded
                      </span>
                    </div>
                  </div>

                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="flex items-center gap-2 text-slate-500 dark:text-[#B0A5BD]">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        Trainer assigned
                      </span>

                      <span className="font-semibold text-[#10265F] dark:text-slate-200">
                        {loading ? "..." : assignedTrainersOnCurrentPage}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="flex items-center gap-2 text-slate-500 dark:text-[#B0A5BD]">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        No trainer
                      </span>

                      <span className="font-semibold text-[#10265F] dark:text-slate-200">
                        {loading ? "..." : unassignedBatchesOnCurrentPage}
                      </span>
                    </div>

                    <p className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 dark:border-[#3B3441] dark:text-[#91899B]">
                      Based on the currently loaded page.
                    </p>
                  </div>
                </div>
              </Panel>

              {/* Activity API is not currently available. */}
              <Panel
                title="Recent Activity"
                action={
                  <span className="text-xs font-semibold text-blue-500">
                    Activity
                  </span>
                }
              >
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400">
                    <Clock size={22} />
                  </span>

                  <p className="mt-3 text-xs font-semibold text-[#10265F] dark:text-slate-100">
                    Activity feed unavailable
                  </p>

                  <p className="mt-1 max-w-xs text-[11px] text-slate-500 dark:text-[#B0A5BD]">
                    The current backend does not provide a batch activity
                    history endpoint.
                  </p>
                </div>
              </Panel>

              {/* Deadline fields are not currently available in the batch schema. */}
              <Panel title="Upcoming Batch Deadlines">
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-500 dark:bg-purple-500/10 dark:text-purple-400">
                    <CalendarDays size={22} />
                  </span>

                  <p className="mt-3 text-xs font-semibold text-[#10265F] dark:text-slate-100">
                    No deadline information
                  </p>

                  <p className="mt-1 max-w-xs text-[11px] text-slate-500 dark:text-[#B0A5BD]">
                    Batch start and end dates are not currently stored by
                    the backend.
                  </p>
                </div>
              </Panel>

              {/* Real summary based on currently loaded batches. */}
              <Panel title="Batch Summary">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-[#B0A5BD]">
                      Total batches
                    </span>

                    <span className="font-bold text-[#10265F] dark:text-slate-100">
                      {loading ? "..." : totalBatches}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-[#B0A5BD]">
                      Assigned trainers
                    </span>

                    <span className="font-bold text-[#10265F] dark:text-slate-100">
                      {loading ? "..." : assignedTrainersOnCurrentPage}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-[#3B3441]">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all"
                      style={{
                        width: `${
                          batches.length
                            ? (batches.filter((batch) => batch.trainerId)
                                .length /
                                batches.length) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-[#B0A5BD]">
                      Unassigned batches
                    </span>

                    <span className="font-bold text-[#10265F] dark:text-slate-100">
                      {loading ? "..." : unassignedBatchesOnCurrentPage}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm dark:border-[#3B3441]">
                    <span className="text-slate-500 dark:text-[#B0A5BD]">
                      Students in loaded batches
                    </span>

                    <span className="font-extrabold text-[#10265F] dark:text-white">
                      {loading ? "..." : studentsOnCurrentPage}
                    </span>
                  </div>
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
        <CreateBatchModal
          onClose={() => setShowModal(false)}
          onCreate={createBatch}
          trainers={trainers}
          submitting={submitting}
        />
      )}
    </div>
  );
}
