
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus, Search, ClipboardList, BookOpen, FileText, Users,
  Clock, CheckCircle2, CalendarDays, X, ChevronDown,
  MoreHorizontal, Eye, Trash2, Filter, Target, Layers,
  Send, AlertCircle, RefreshCw, LoaderCircle, Pencil,
  Save, Ban, Lock, UserRound, ArrowUpRight,
} from "lucide-react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import assignmentService from "../../services/Trainer/assignmentService.js";

const TYPES = ["Mock Test", "Practice Test", "Study Material"];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 " +
  "text-sm outline-none transition focus:border-blue-400 " +
  "focus:ring-2 focus:ring-blue-50 dark:border-[#3b3441] " +
  "dark:bg-[#19171e] dark:text-white dark:focus:ring-[#202b3b]";

const muted = "text-gray-500 dark:text-[#b0a5bd]";
const border = "border-gray-100 dark:border-[#3b3441]";
const pink = "bg-[#FF2454] text-white hover:bg-[#e91d49]";

const EMPTY_FORM = {
  title: "",
  type: "Mock Test",
  targetType: "Batch",
  batchId: "",
  studentIds: "",
  testVersionIds: "",
  dueDate: "",
  description: "",
};

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function HoverCard({ children, onClick, className = "" }) {
  const surface =
    `relative z-10 flex h-full w-full min-w-0 flex-col rounded-2xl ` +
    `border ${border} bg-white text-left shadow-sm transition-transform ` +
    `duration-300 group-hover:-translate-y-1.5 dark:bg-[#211e27]`;

  return (
    <div className={`group relative isolate h-full min-w-0 pb-2 ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-2
          rounded-2xl bg-pink-100 opacity-0 transition-opacity
          duration-300 group-hover:opacity-100 dark:bg-[#4A2538]"
      />
      {onClick ? (
        <button type="button" onClick={onClick} className={surface}>
          {children}
        </button>
      ) : (
        <div className={surface}>{children}</div>
      )}
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-[#202b3b]",
    purple: "bg-purple-50 text-purple-600 dark:bg-[#30263d]",
    green: "bg-emerald-50 text-emerald-600 dark:bg-[#1f352e]",
    orange: "bg-orange-50 text-orange-600 dark:bg-[#3b3020]",
  };

  return (
    <HoverCard>
      <div className="flex h-full min-h-[225px] flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center
              rounded-2xl ${colors[color]}`}
          >
            <Icon size={23} />
          </div>
          <ArrowUpRight size={18} className={muted} />
        </div>
        <p className={`mt-5 text-sm font-semibold ${muted}`}>{title}</p>
        <p className="mt-3 text-3xl font-extrabold">{value}</p>
        <p className={`mt-auto pt-5 text-xs leading-5 ${muted}`}>
          {subtitle}
        </p>
      </div>
    </HoverCard>
  );
}

function Modal({ title, children, onClose, wide = false }) {
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
        justify-center bg-black/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl
          border ${border} bg-white shadow-2xl dark:bg-[#211e27]
          ${wide ? "max-w-3xl" : "max-w-xl"}`}
      >
        <div
          className={`sticky top-0 z-10 flex items-center justify-between
            border-b ${border} bg-white px-5 py-4 dark:bg-[#211e27]`}
        >
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 hover:bg-gray-100
              dark:hover:bg-[#302b37]"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      {children}
      {hint && (
        <span className={`mt-1.5 block text-xs leading-5 ${muted}`}>
          {hint}
        </span>
      )}
    </label>
  );
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function statusOf(item) {
  const status = item.status || "DRAFT";
  if (
    status === "PUBLISHED" &&
    item.dueAt &&
    new Date(item.dueAt).getTime() < Date.now() &&
    item.assignedCount !== null &&
    item.completedCount !== null &&
    item.completedCount < item.assignedCount
  ) {
    return "OVERDUE";
  }
  return status;
}

function statusStyle(status) {
  if (status === "PUBLISHED")
    return "bg-blue-50 text-blue-700 dark:bg-[#202b3b]";
  if (status === "OVERDUE")
    return "bg-red-50 text-red-700 dark:bg-[#39232f]";
  if (status === "CLOSED")
    return "bg-emerald-50 text-emerald-700 dark:bg-[#1f352e]";
  if (status === "CANCELLED")
    return "bg-gray-100 text-gray-600 dark:bg-[#393441]";
  return "bg-orange-50 text-orange-700 dark:bg-[#3b3020]";
}

function ProgressBar({ completed, total }) {
  const known = completed !== null && total !== null;
  const value =
    known && total > 0
      ? Math.round((completed / total) * 100)
      : known && total === 0
        ? 0
        : null;

  return (
    <div className="min-w-[130px]">
      <div className="mb-2 flex justify-between gap-2 text-xs">
        <span className="font-semibold">
          {known ? `${completed}/${total}` : "—"}
        </span>
        <span className={muted}>
          {value === null ? "—" : `${value}%`}
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full
          bg-gray-100 dark:bg-[#393441]"
      >
        {value !== null && (
          <div
            className="h-full rounded-full bg-[#FF2454]"
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          />
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div
      className={`flex flex-col gap-1 border-b ${border}
        py-3 last:border-0 sm:flex-row sm:justify-between sm:gap-4`}
    >
      <span className={`text-sm ${muted}`}>{label}</span>
      <span className="break-words text-sm font-semibold">
        {value ?? "—"}
      </span>
    </div>
  );
}

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [complete, setComplete] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [menuId, setMenuId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await assignmentService.getPageData();
      setAssignments(result.assignments);
      setBatches(result.batches);
      setComplete(result.complete);

      if (result.errors.length) {
        setError(result.errors.join(" | "));
      }
    } catch (err) {
      setAssignments([]);
      setBatches([]);
      setComplete(false);
      setError(err.message || "Unable to load assignments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return assignments.filter((item) => {
      const matchesSearch =
        !q ||
        [item.title, item.status, item.createdBy?.email]
          .some((value) =>
            String(value || "").toLowerCase().includes(q)
          );

      const matchesType =
        typeFilter === "All Types" ||
        (item.category || "Uncategorized") === typeFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        statusOf(item) === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [assignments, search, typeFilter, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, statusFilter, pageSize]);

  const pageCount = Math.max(
    1,
    Math.ceil(filtered.length / pageSize)
  );
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const countsKnown =
    complete &&
    assignments.every(
      (a) => a.assignedCount !== null && a.completedCount !== null
    );

  const assigned = countsKnown
    ? assignments.reduce((sum, a) => sum + a.assignedCount, 0)
    : null;

  const completed = countsKnown
    ? assignments.reduce((sum, a) => sum + a.completedCount, 0)
    : null;

  const overdue = countsKnown
    ? assignments.filter((a) => statusOf(a) === "OVERDUE").length
    : null;

  const changeForm = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
  };

  const closeModals = useCallback(() => {
    if (saving) return;
    setShowModal(false);
    setEditing(null);
    setSelectedAssignment(null);
    setDetail(null);
    setError("");
  }, [saving]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      batchId: batches[0]?.id || "",
    });
    setError("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setMenuId(null);
    setEditing(item);
    setForm({
      ...EMPTY_FORM,
      title: item.title || "",
      dueDate: item.dueAt
        ? new Date(item.dueAt).toISOString().slice(0, 16)
        : "",
      description: "",
    });
    setError("");
    setShowModal(true);
  };

  const openDetails = async (item) => {
    setMenuId(null);
    setSelectedAssignment(item);
    setDetail(null);
    setDetailLoading(true);
    setError("");

    try {
      const [assignmentResult, targetResult, submissionResult] =
        await Promise.allSettled([
          assignmentService.getAssignment(item.id),
          assignmentService.getTargets(item.id),
          assignmentService.getSubmissions(item.id),
        ]);

      setDetail({
        assignment:
          assignmentResult.status === "fulfilled"
            ? assignmentResult.value
            : item,
        targets:
          targetResult.status === "fulfilled"
            ? targetResult.value.targets || []
            : item.targets || [],
        submissions:
          submissionResult.status === "fulfilled"
            ? submissionResult.value.submissions || []
            : [],
        targetsTotal:
          targetResult.status === "fulfilled"
            ? targetResult.value.pagination?.total ?? null
            : item.assignedCount,
        submissionsTotal:
          submissionResult.status === "fulfilled"
            ? submissionResult.value.pagination?.total ?? null
            : null,
        partial:
          [assignmentResult, targetResult, submissionResult].some(
            (r) => r.status === "rejected"
          ),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const runAction = async (action, message) => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await action();
      await load();
      setSuccess(message);
      setShowModal(false);
      setEditing(null);
      setSelectedAssignment(null);
      setDetail(null);
      setMenuId(null);
      return true;
    } catch (err) {
      setError(err.message || "Action failed.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveAssignment = async (event) => {
    event.preventDefault();

    const title = form.title.trim();
    if (title.length < 3) {
      setError("Title must contain at least 3 characters.");
      return;
    }

    const dueAt = form.dueDate
      ? new Date(form.dueDate).toISOString()
      : null;

    if (editing) {
      await runAction(
        () =>
          assignmentService.updateAssignment(editing.id, {
            title,
            instructions: form.description.trim() || null,
            dueAt,
          }),
        "Assignment updated successfully."
      );
      return;
    }

    const testVersionIds = form.testVersionIds
      .split(/[\s,]+/)
      .map((id) => id.trim())
      .filter(Boolean);

    if (!testVersionIds.length || testVersionIds.some((id) => !UUID.test(id))) {
      setError("Enter at least one valid Test Version UUID.");
      return;
    }

    const studentIds = form.studentIds
      .split(/[\s,]+/)
      .map((id) => id.trim())
      .filter(Boolean);

    if (studentIds.some((id) => !UUID.test(id))) {
      setError("Every student ID must be a valid UUID.");
      return;
    }

    let batchIds = [];
    let directUserIds = [];

    if (form.targetType === "Batch") {
      if (!form.batchId) {
        setError("Please select a batch.");
        return;
      }
      batchIds = [form.batchId];
    } else if (form.targetType === "Student") {
      if (!studentIds.length) {
        setError("Please enter at least one student UUID.");
        return;
      }
      directUserIds = studentIds;
    } else {
      setError(
        "All Students targeting needs a backend-supported recipient selection. Select Batch or Student."
      );
      return;
    }

    const payload = {
      title,
      instructions: form.description.trim() || null,
      dueAt,
      contents: testVersionIds.map((testVersionId, index) => ({
        testVersionId,
        position: index + 1,
      })),
      directUserIds,
      batchIds,
    };

    await runAction(
      () => assignmentService.createAssignment(payload),
      "Assignment created successfully."
    );
  };

  const changeStatus = async (item, action) => {
    setMenuId(null);

    const descriptions = {
      publish: "Publish this assignment?",
      close: "Close this assignment?",
      cancel: "Cancel this assignment?",
      delete: "Delete this assignment?",
    };

    if (!window.confirm(descriptions[action])) return;

    const actions = {
      publish: () => assignmentService.publishAssignment(item.id),
      close: () => assignmentService.closeAssignment(item.id),
      cancel: () => assignmentService.cancelAssignment(item.id),
      delete: () => assignmentService.deleteAssignment(item.id),
    };

    await runAction(
      actions[action],
      `Assignment ${action === "delete" ? "deleted" : action + "d"} successfully.`
    );
  };

  const categoryCount = (type) =>
    assignments.filter((item) => item.category === type).length;

  const categoryCards = [
    {
      title: "Mock Test",
      description: "Full-length IELTS assessments",
      icon: Target,
      color: "bg-violet-50 text-violet-600 dark:bg-[#30263d]",
    },
    {
      title: "Practice Test",
      description: "Skill-wise practice activities",
      icon: ClipboardList,
      color: "bg-blue-50 text-blue-600 dark:bg-[#202b3b]",
    },
    {
      title: "Study Material",
      description: "Guides, notes and learning resources",
      icon: BookOpen,
      color: "bg-orange-50 text-orange-600 dark:bg-[#3b3020]",
    },
  ];

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#F5F7FF]
        text-[#10265F] transition-colors duration-300
        dark:bg-[#17151B] dark:text-white"
    >
      <Sidebar />

      <div className="min-w-0 lg:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* HEADER */}
          <section
            className="flex flex-col justify-between gap-4
              sm:flex-row sm:items-center"
          >
            <div>
              <p className={`mb-2 text-sm ${muted}`}>
                Trainer Portal / Assignments & Batches
              </p>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Assignments & Batches
              </h1>
              <p className={`mt-2 max-w-2xl text-sm leading-6 ${muted}`}>
                Assign tests and learning content to students and batches,
                and monitor their completion.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={load}
                disabled={loading}
                className={`flex items-center gap-2 rounded-xl border
                  ${border} bg-white px-4 py-3 text-sm font-semibold
                  disabled:opacity-50 dark:bg-[#211e27]`}
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={openCreate}
                className={`flex items-center gap-2 rounded-xl
                  px-5 py-3 text-sm font-semibold ${pink}`}
              >
                <Plus size={19} />
                Create Assignment
              </button>
            </div>
          </section>

          {/* FEEDBACK */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border
                border-red-200 bg-red-50 p-4 text-sm text-red-700
                dark:border-red-500/20 dark:bg-red-500/10
                dark:text-red-300"
            >
              <AlertCircle size={19} className="shrink-0" />
              <span className="break-words">{error}</span>
            </div>
          )}

          {success && (
            <div
              role="status"
              className="flex items-center gap-3 rounded-xl border
                border-emerald-200 bg-emerald-50 p-4 text-sm
                text-emerald-700 dark:border-emerald-500/20
                dark:bg-emerald-500/10 dark:text-emerald-300"
            >
              <CheckCircle2 size={18} />
              <span>{success}</span>
              <button
                type="button"
                onClick={() => setSuccess("")}
                className="ml-auto"
                aria-label="Dismiss"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* FOUR EQUAL SUMMARY CARDS */}
          <section
            className="grid grid-cols-1 items-stretch gap-4
              sm:grid-cols-2 xl:grid-cols-4"
          >
            <StatCard
              title="Total Assignments"
              value={loading ? "…" : complete ? assignments.length : "—"}
              subtitle="Assignments retrieved from backend"
              icon={ClipboardList}
              color="blue"
            />
            <StatCard
              title="Students Assigned"
              value={loading ? "…" : assigned ?? "—"}
              subtitle="Assignment recipients across all records"
              icon={Users}
              color="purple"
            />
            <StatCard
              title="Completed Submissions"
              value={loading ? "…" : completed ?? "—"}
              subtitle="Completed assignment targets"
              icon={CheckCircle2}
              color="green"
            />
            <StatCard
              title="Overdue"
              value={loading ? "…" : overdue ?? "—"}
              subtitle="Published assignments past due with incomplete targets"
              icon={Clock}
              color="orange"
            />
          </section>

          {/* CATEGORY CARDS */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-bold">Assignment Categories</h2>
              <p className={`mt-1 text-sm ${muted}`}>
                Select a category to filter the assignment list.
              </p>
            </div>

            <div
              className="grid grid-cols-1 items-stretch gap-4
                md:grid-cols-3"
            >
              {categoryCards.map((category) => {
                const Icon = category.icon;
                return (
                  <HoverCard
                    key={category.title}
                    onClick={() => {
                      setTypeFilter(
                        typeFilter === category.title
                          ? "All Types"
                          : category.title
                      );
                      document.getElementById("assignment-list")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <div className="flex h-full min-h-[185px] flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`flex h-12 w-12 items-center
                            justify-center rounded-xl ${category.color}`}
                        >
                          <Icon size={23} />
                        </div>
                        <span
                          className="rounded-full bg-gray-100 px-3 py-1
                            text-xs font-semibold dark:bg-[#393441]"
                        >
                          {categoryCount(category.title)}
                        </span>
                      </div>
                      <h3 className="mt-4 font-bold">{category.title}</h3>
                      <p className={`mt-auto pt-2 text-sm ${muted}`}>
                        {category.description}
                      </p>
                    </div>
                  </HoverCard>
                );
              })}
            </div>

            <p className={`mt-2 text-xs ${muted}`}>
              Category cards are ready for future API category data.
              Current assignment listing does not return a category field.
            </p>
          </section>

          {/* ASSIGNMENT TABLE */}
          <section
            id="assignment-list"
            className={`rounded-2xl border ${border}
              bg-white shadow-sm dark:bg-[#211e27]`}
          >
            <div className={`border-b ${border} p-5 sm:p-6`}>
              <h2 className="text-lg font-bold">All Assignments</h2>
              <p className={`mt-1 text-sm ${muted}`}>
                Monitor deadlines and student completion.
              </p>

              <div className="mt-5 flex flex-col gap-3 xl:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2
                      -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search assignments..."
                    className={`${inputClass} pl-10`}
                  />
                </div>

                <div className="relative">
                  <Filter
                    size={16}
                    className="pointer-events-none absolute left-3
                      top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className={`${inputClass} appearance-none
                      pl-9 pr-9 sm:min-w-[180px]`}
                  >
                    <option>All Types</option>
                    {TYPES.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3
                      top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`${inputClass} appearance-none
                      pr-9 sm:min-w-[155px]`}
                  >
                    <option>All Status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="CLOSED">Closed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="OVERDUE">Overdue</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3
                      top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left">
                <thead className="bg-gray-50 dark:bg-[#302b37]">
                  <tr className={`text-xs uppercase tracking-wide ${muted}`}>
                    <th className="px-5 py-4">Assignment</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Recipients</th>
                    <th className="px-5 py-4">Due Date</th>
                    <th className="px-5 py-4">Progress</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody
                  className="divide-y divide-gray-100
                    dark:divide-[#3b3441]"
                >
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-14 text-center">
                        <LoaderCircle
                          size={28}
                          className="mx-auto animate-spin text-[#FF2454]"
                        />
                      </td>
                    </tr>
                  ) : (
                    visible.map((item) => {
                      const status = statusOf(item);

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50/70
                            dark:hover:bg-[#302b37]"
                        >
                          <td className="px-5 py-4">
                            <p className="max-w-[240px] font-semibold">
                              {item.title}
                            </p>
                            <p className={`mt-1 text-xs ${muted}`}>
                              Created {formatDate(item.createdAt)}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <span className={`text-sm ${muted}`}>
                              {item.category || "—"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <Users size={16} className={muted} />
                              <span className="text-sm font-semibold">
                                {item.assignedCount ?? "—"}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="flex items-center gap-2 text-sm">
                              <CalendarDays size={16} className={muted} />
                              {formatDate(item.dueAt)}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <ProgressBar
                              completed={item.completedCount}
                              total={item.assignedCount}
                            />
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1.5
                                text-xs font-semibold ${statusStyle(status)}`}
                            >
                              {status}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="relative inline-block">
                              <button
                                type="button"
                                onClick={() =>
                                  setMenuId(
                                    menuId === item.id ? null : item.id
                                  )
                                }
                                aria-label={`Actions for ${item.title}`}
                                className="rounded-lg p-2 text-gray-400
                                  hover:bg-gray-100 dark:hover:bg-[#393441]"
                              >
                                <MoreHorizontal size={20} />
                              </button>

                              {menuId === item.id && (
                                <div
                                  className={`absolute right-0 top-10 z-30
                                    w-48 rounded-xl border ${border}
                                    bg-white p-1.5 text-left shadow-xl
                                    dark:bg-[#211e27]`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => openDetails(item)}
                                    className="flex w-full items-center
                                      gap-2 rounded-lg px-3 py-2.5 text-sm
                                      hover:bg-gray-50 dark:hover:bg-[#302b37]"
                                  >
                                    <Eye size={16} /> View Details
                                  </button>

                                  {item.status === "DRAFT" && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => openEdit(item)}
                                        className="flex w-full items-center
                                          gap-2 rounded-lg px-3 py-2.5 text-sm
                                          hover:bg-gray-50 dark:hover:bg-[#302b37]"
                                      >
                                        <Pencil size={16} /> Edit
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          changeStatus(item, "publish")
                                        }
                                        className="flex w-full items-center
                                          gap-2 rounded-lg px-3 py-2.5 text-sm
                                          hover:bg-gray-50 dark:hover:bg-[#302b37]"
                                      >
                                        <Send size={16} /> Publish
                                      </button>
                                    </>
                                  )}

                                  {item.status === "PUBLISHED" && (
                                    <button
                                      type="button"
                                      onClick={() => changeStatus(item, "close")}
                                      className="flex w-full items-center
                                        gap-2 rounded-lg px-3 py-2.5 text-sm
                                        hover:bg-gray-50 dark:hover:bg-[#302b37]"
                                    >
                                      <Lock size={16} /> Close
                                    </button>
                                  )}

                                  {["DRAFT", "PUBLISHED"].includes(
                                    item.status
                                  ) && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        changeStatus(item, "cancel")
                                      }
                                      className="flex w-full items-center
                                        gap-2 rounded-lg px-3 py-2.5 text-sm
                                        hover:bg-gray-50 dark:hover:bg-[#302b37]"
                                    >
                                      <Ban size={16} /> Cancel
                                    </button>
                                  )}

                                  {item.status === "DRAFT" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        changeStatus(item, "delete")
                                      }
                                      className="flex w-full items-center
                                        gap-2 rounded-lg px-3 py-2.5
                                        text-sm text-red-600
                                        hover:bg-red-50 dark:hover:bg-[#39232f]"
                                    >
                                      <Trash2 size={16} /> Delete
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {!loading && filtered.length === 0 && (
              <div className="px-6 py-14 text-center">
                <ClipboardList
                  size={34}
                  className="mx-auto text-gray-300"
                />
                <p className="mt-3 font-semibold">
                  No assignments found
                </p>
                <p className={`mt-2 text-sm ${muted}`}>
                  {assignments.length === 0
                    ? "Assignments will appear here when available."
                    : "Try changing your search or filters."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setTypeFilter("All Types");
                    setStatusFilter("All Status");
                  }}
                  className="mt-3 text-sm font-semibold text-[#FF2454]"
                >
                  Clear filters
                </button>
              </div>
            )}

            <div
              className={`flex flex-col gap-3 border-t ${border}
                px-5 py-4 text-sm sm:flex-row sm:items-center
                sm:justify-between`}
            >
              <span className={muted}>
                Showing {visible.length} of {filtered.length} assignments
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className={`${inputClass} w-auto py-2`}
                  aria-label="Rows per page"
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>

                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className={`rounded-lg border ${border}
                    px-3 py-2 disabled:opacity-40`}
                >
                  Previous
                </button>

                <span className={`text-xs ${muted}`}>
                  {currentPage} / {pageCount}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= pageCount}
                  onClick={() => setPage((p) => p + 1)}
                  className={`rounded-lg border ${border}
                    px-3 py-2 disabled:opacity-40`}
                >
                  Next
                </button>
              </div>
            </div>
          </section>

          {/* BATCHES */}
          <section>
            <h2 className="text-lg font-bold">Available Batches</h2>
            <p className={`mb-4 mt-1 text-sm ${muted}`}>
              Real batches available for assignment targeting.
            </p>

            {batches.length === 0 ? (
              <div
                className={`rounded-2xl border ${border}
                  bg-white p-10 text-center dark:bg-[#211e27]`}
              >
                <Layers size={30} className="mx-auto text-gray-400" />
                <p className="mt-3 font-semibold">No batches available</p>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 items-stretch gap-4
                  sm:grid-cols-2 xl:grid-cols-3"
              >
                {batches.map((batch) => (
                  <HoverCard
                    key={batch.id}
                    onClick={() => {
                      setForm({
                        ...EMPTY_FORM,
                        batchId: batch.id,
                      });
                      setEditing(null);
                      setShowModal(true);
                    }}
                  >
                    <div className="flex h-full min-h-[150px] flex-col p-5">
                      <Layers size={22} className="text-[#FF2454]" />
                      <h3 className="mt-4 font-bold">{batch.name}</h3>
                      <p className={`mt-auto pt-4 text-sm ${muted}`}>
                        Create assignment for this batch
                      </p>
                    </div>
                  </HoverCard>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* CREATE / EDIT ASSIGNMENT MODAL */}
      {showModal && (
        <Modal
          title={editing ? "Edit Assignment" : "Create Assignment"}
          onClose={closeModals}
        >
          <form onSubmit={saveAssignment} className="space-y-4">
            <Field label="Assignment Title">
              <input
                name="title"
                value={form.title}
                onChange={changeForm}
                placeholder="Enter assignment title"
                required
                minLength={3}
                className={inputClass}
              />
            </Field>

            <Field
              label="Assignment Type"
              hint="Category UI is future-ready. The current create API does not store this field."
            >
              <select
                name="type"
                value={form.type}
                onChange={changeForm}
                className={inputClass}
              >
                {TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </Field>

            {!editing && (
              <>
                <Field label="Assign To">
                  <select
                    name="targetType"
                    value={form.targetType}
                    onChange={changeForm}
                    className={inputClass}
                  >
                    <option value="Batch">Batch</option>
                    <option value="Student">Individual Student</option>
                    <option value="All Students">All Students</option>
                  </select>
                </Field>

                {form.targetType === "Batch" && (
                  <Field label="Select Batch">
                    <select
                      name="batchId"
                      value={form.batchId}
                      onChange={changeForm}
                      className={inputClass}
                      required
                    >
                      <option value="">Select a batch</option>
                      {batches.map((batch) => (
                        <option key={batch.id} value={batch.id}>
                          {batch.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}

                {form.targetType === "Student" && (
                  <Field
                    label="Student UUIDs"
                    hint="Enter one or more existing student IDs separated by commas."
                  >
                    <textarea
                      name="studentIds"
                      value={form.studentIds}
                      onChange={changeForm}
                      rows={3}
                      placeholder="student-uuid-1, student-uuid-2"
                      className={inputClass}
                    />
                  </Field>
                )}

                {form.targetType === "All Students" && (
                  <p
                    className="rounded-xl bg-orange-50 p-3
                      text-sm text-orange-700 dark:bg-[#3b3020]"
                  >
                    All Students targeting needs a verified recipient
                    selection API. This option is retained for future
                    integration and will not create a fake assignment.
                  </p>
                )}

                <Field
                  label="Test Version UUIDs"
                  hint="Required by the current backend. Enter published test version IDs, separated by commas. Each becomes one assignment content item."
                >
                  <textarea
                    name="testVersionIds"
                    value={form.testVersionIds}
                    onChange={changeForm}
                    rows={3}
                    placeholder="Enter valid test version UUIDs"
                    required
                    className={inputClass}
                  />
                </Field>
              </>
            )}

            <Field label="Due Date">
              <input
                type="datetime-local"
                name="dueDate"
                value={form.dueDate}
                onChange={changeForm}
                className={inputClass}
              />
            </Field>

            <Field label="Instructions / Description">
              <textarea
                name="description"
                value={form.description}
                onChange={changeForm}
                rows={4}
                placeholder="Enter assignment instructions"
                className={inputClass}
              />
            </Field>

            {error && (
              <p
                className="rounded-lg bg-red-50 p-3 text-sm
                  text-red-600 dark:bg-[#39232f]"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={closeModals}
                disabled={saving}
                className={`flex-1 rounded-xl border ${border}
                  px-4 py-3 text-sm font-semibold`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`flex-1 rounded-xl px-4 py-3
                  text-sm font-semibold disabled:opacity-50 ${pink}`}
              >
                {saving
                  ? "Saving..."
                  : editing
                    ? "Save Changes"
                    : "Create Assignment"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ASSIGNMENT DETAILS MODAL */}
      {selectedAssignment && (
        <Modal
          title="Assignment Details"
          onClose={closeModals}
          wide
        >
          {detailLoading ? (
            <div className="flex justify-center py-12">
              <LoaderCircle
                size={28}
                className="animate-spin text-[#FF2454]"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div
                className="rounded-xl bg-gray-50 p-4
                  dark:bg-[#302b37]"
              >
                <h3 className="text-lg font-bold">
                  {selectedAssignment.title}
                </h3>
                <p className={`mt-2 text-sm ${muted}`}>
                  Assignment ID: {selectedAssignment.id}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                <DetailRow
                  label="Status"
                  value={selectedAssignment.status}
                />
                <DetailRow
                  label="Due Date"
                  value={formatDate(selectedAssignment.dueAt)}
                />
                <DetailRow
                  label="Created"
                  value={formatDate(selectedAssignment.createdAt)}
                />
                <DetailRow
                  label="Published"
                  value={formatDate(selectedAssignment.publishedAt)}
                />
                <DetailRow
                  label="Assigned Students"
                  value={selectedAssignment.assignedCount}
                />
                <DetailRow
                  label="Completed"
                  value={selectedAssignment.completedCount}
                />
                <DetailRow
                  label="Content Items"
                  value={selectedAssignment._count?.contents}
                />
                <DetailRow
                  label="Created By"
                  value={selectedAssignment.createdBy?.profile?.name ||
                    selectedAssignment.createdBy?.email}
                />
              </div>

              <section>
                <h3 className="mb-3 font-bold">Instructions</h3>
                <p className={`text-sm leading-6 ${muted}`}>
                  {detail?.assignment?.instructions ||
                    "No instructions available."}
                </p>
              </section>

              <section>
                <h3 className="mb-3 font-bold">
                  Assigned Students
                  {detail?.targetsTotal !== null &&
                    detail?.targetsTotal !== undefined &&
                    ` (${detail.targetsTotal})`}
                </h3>

                <div
                  className={`overflow-x-auto rounded-xl border ${border}`}
                >
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-[#302b37]">
                      <tr>
                        <th className="px-4 py-3">Student</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Progress</th>
                        <th className="px-4 py-3">Assigned</th>
                      </tr>
                    </thead>
                    <tbody
                      className="divide-y divide-gray-100
                        dark:divide-[#3b3441]"
                    >
                      {(detail?.targets || []).map((target) => (
                        <tr key={target.id}>
                          <td className="px-4 py-3">
                            {target.user?.profile?.name ||
                              target.user?.email ||
                              target.userId}
                          </td>
                          <td className="px-4 py-3">
                            {target.status}
                          </td>
                          <td className="px-4 py-3">
                            {target.completions?.[0]?.progress ?? "—"}
                          </td>
                          <td className="px-4 py-3">
                            {formatDate(target.assignedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {!detail?.targets?.length && (
                    <p className={`p-6 text-center text-sm ${muted}`}>
                      No target records available.
                    </p>
                  )}
                </div>
              </section>

              <section>
                <h3 className="mb-3 font-bold">
                  Submissions
                  {detail?.submissionsTotal !== null &&
                    detail?.submissionsTotal !== undefined &&
                    ` (${detail.submissionsTotal})`}
                </h3>

                <div
                  className={`overflow-x-auto rounded-xl border ${border}`}
                >
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-[#302b37]">
                      <tr>
                        <th className="px-4 py-3">Student</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Completed</th>
                      </tr>
                    </thead>
                    <tbody
                      className="divide-y divide-gray-100
                        dark:divide-[#3b3441]"
                    >
                      {(detail?.submissions || []).map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            {item.user?.profile?.name ||
                              item.user?.email ||
                              item.userId}
                          </td>
                          <td className="px-4 py-3">{item.status}</td>
                          <td className="px-4 py-3">
                            {formatDate(item.completedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {!detail?.submissions?.length && (
                    <p className={`p-6 text-center text-sm ${muted}`}>
                      No submissions available.
                    </p>
                  )}
                </div>
              </section>

              {detail?.partial && (
                <p
                  className="rounded-xl bg-orange-50 p-3
                    text-sm text-orange-700 dark:bg-[#3b3020]"
                >
                  Some assignment details could not be loaded.
                </p>
              )}

              <p className={`text-xs ${muted}`}>
                Student and submission previews show the first API page.
                Full lists can be connected through the paginated service.
              </p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
