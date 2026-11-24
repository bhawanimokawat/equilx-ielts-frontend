
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users, UserPlus, Search, Filter, Mail, Phone, Layers,
  Clock, ChevronDown, MoreHorizontal, Eye, Pencil,
  Trash2, X, GraduationCap, CheckCircle2, ArrowUpRight,
  RefreshCw, AlertCircle, LoaderCircle, UserRound,
  Plus, Save, CalendarDays,
} from "lucide-react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import studentManagementService from "../../services/Trainer/studentManagementService.js";

const COLORS = [
  "bg-blue-50 text-blue-700 dark:bg-[#202b3b] dark:text-blue-300",
  "bg-purple-50 text-purple-700 dark:bg-[#30263d] dark:text-purple-300",
  "bg-orange-50 text-orange-700 dark:bg-[#3b3020] dark:text-orange-300",
];

const INPUT =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm " +
  "outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50 " +
  "dark:border-[#3b3441] dark:bg-[#19171e] dark:text-white dark:focus:ring-[#202b3b]";

const BORDER = "border-gray-100 dark:border-[#3b3441]";
const MUTED = "text-gray-500 dark:text-[#b0a5bd]";
const PINK = "bg-[#FF2454] hover:bg-[#e91d49] text-white";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  batchId: "",
  userId: "",
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function initials(name) {
  return String(name || "ST")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
}

function display(value, fallback = "—") {
  return value === null || value === undefined || value === ""
    ? fallback
    : String(value);
}

function percent(value) {
  const number = Number(value);
  if (value === null || value === undefined || !Number.isFinite(number)) {
    return null;
  }
  return Math.max(0, Math.min(100, number));
}

function HoverCard({ children, className = "", onClick }) {
  const shell =
    `relative z-10 flex h-full w-full min-w-0 flex-col rounded-2xl ` +
    `border ${BORDER} bg-white text-left shadow-sm ` +
    `transition-transform duration-300 ease-out ` +
    `group-hover:-translate-y-1.5 dark:bg-[#211e27]`;

  return (
    <div className={`group relative isolate h-full min-w-0 pb-2 ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-2
          rounded-2xl bg-pink-100 opacity-0 transition-opacity duration-300
          group-hover:opacity-100 dark:bg-[#4A2538]"
      />
      {onClick ? (
        <button type="button" onClick={onClick} className={shell}>
          {children}
        </button>
      ) : (
        <div className={shell}>{children}</div>
      )}
    </div>
  );
}

function StatCard({ title, value, caption, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-[#202b3b]",
    green: "bg-emerald-50 text-emerald-600 dark:bg-[#1f352e]",
    purple: "bg-purple-50 text-purple-600 dark:bg-[#30263d]",
    orange: "bg-orange-50 text-orange-600 dark:bg-[#3b3020]",
  };

  return (
    <HoverCard>
      <div className="flex h-full min-h-[230px] flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-13 w-13 items-center justify-center
              rounded-2xl p-3 ${colors[color]}`}
          >
            <Icon size={23} />
          </div>
          <ArrowUpRight size={19} className={MUTED} />
        </div>
        <p className={`mt-5 text-sm font-semibold ${MUTED}`}>{title}</p>
        <p className="mt-3 text-3xl font-extrabold">{value}</p>
        <p className={`mt-auto pt-5 text-xs leading-5 ${MUTED}`}>
          {caption}
        </p>
      </div>
    </HoverCard>
  );
}

function Modal({ title, children, onClose }) {
  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center
        bg-black/55 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl
          border border-gray-100 bg-white shadow-2xl
          dark:border-[#3b3441] dark:bg-[#211e27]"
      >
        <div
          className={`sticky top-0 z-10 flex items-center justify-between
            border-b ${BORDER} bg-white px-5 py-4 dark:bg-[#211e27]`}
        >
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-[#302b37]"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      {children}
      {hint && (
        <span className={`mt-1.5 block text-xs leading-5 ${MUTED}`}>
          {hint}
        </span>
      )}
    </label>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className={`flex items-start gap-3 border-b py-3 last:border-0 ${BORDER}`}>
      <Icon size={17} className="mt-0.5 shrink-0 text-[#FF2454]" />
      <div className="min-w-0">
        <p className={`text-xs ${MUTED}`}>{label}</p>
        <p className="mt-1 break-words text-sm font-semibold">
          {display(value)}
        </p>
      </div>
    </div>
  );
}

function Progress({ value }) {
  const amount = percent(value);
  return (
    <div className="w-28">
      <p className="mb-2 text-sm font-semibold">
        {amount === null ? "—" : `${amount}%`}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-[#393441]">
        {amount !== null && (
          <div
            className="h-full rounded-full bg-[#FF2454]"
            style={{ width: `${amount}%` }}
          />
        )}
      </div>
    </div>
  );
}

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [complete, setComplete] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [showAdd, setShowAdd] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(false);
  const [menuId, setMenuId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [batchForm, setBatchForm] = useState({
    name: "",
    schedule: "",
  });

  const closeModals = useCallback(() => {
    if (saving) return;
    setShowAdd(false);
    setShowBatch(false);
    setSelectedStudent(null);
    setEditingStudent(false);
    setError("");
  }, [saving]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await studentManagementService.getPageData();
      setStudents(result.students);
      setBatches(result.batches);
      setComplete(result.complete);

      if (result.errors.length) {
        setError(result.errors.join(" | "));
      }
    } catch (err) {
      setStudents([]);
      setBatches([]);
      setComplete(false);
      setError(err.message || "Unable to load students.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !q ||
        [student.name, student.email, student.phone, student.id]
          .some((value) =>
            String(value || "").toLowerCase().includes(q)
          );

      const matchesBatch =
        batchFilter === "all" ||
        student.batches.some((batch) => batch.id === batchFilter);

      const matchesStatus =
        statusFilter === "all" ||
        (student.status &&
          student.status.toLowerCase() === statusFilter);

      return matchesSearch && matchesBatch && matchesStatus;
    });
  }, [students, search, batchFilter, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, batchFilter, statusFilter, pageSize]);

  const pages = Math.max(
    1,
    Math.ceil(filteredStudents.length / pageSize)
  );
  const currentPage = Math.min(page, pages);
  const visibleStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const activeKnown = students.filter(
    (s) => s.status?.toLowerCase() === "active"
  ).length;
  const hasStatuses = students.some((s) => s.status != null);
  const progressValues = students
    .map((s) => percent(s.progress))
    .filter((value) => value !== null);

  const averageProgress = progressValues.length
    ? Math.round(
        progressValues.reduce((a, b) => a + b, 0) /
          progressValues.length
      )
    : null;

  const totalStudents = complete ? students.length : "—";
  const totalBatches = complete ? batches.length : "—";

  const activeCount =
    complete && (hasStatuses || students.length === 0)
      ? activeKnown
      : "—";

  const changeForm = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };

  const runAction = async (action, successMessage) => {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      await action();
      await load();
      setNotice(successMessage);
      setShowAdd(false);
      setShowBatch(false);
      setSelectedStudent(null);
      setEditingStudent(false);
      setMenuId(null);
      return true;
    } catch (err) {
      setError(err.message || "Operation failed.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const addStudent = async (event) => {
    event.preventDefault();

    if (!form.batchId) {
      setError("Please select a batch.");
      return;
    }

    if (!UUID.test(form.userId.trim())) {
      setError(
        "Existing student UUID is required. This backend does not create a new user from name, email or phone."
      );
      return;
    }

    await runAction(
      () =>
        studentManagementService.addExistingStudent(
          form.batchId,
          form.userId.trim()
        ),
      "Existing student added to the selected batch."
    );
  };

  const addBatch = async (event) => {
    event.preventDefault();

    const name = batchForm.name.trim();
    if (name.length < 2) {
      setError("Batch name must contain at least 2 characters.");
      return;
    }

    if (
      batches.some(
        (batch) => batch.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      setError("A batch with this name already exists.");
      return;
    }

    await runAction(
      () => studentManagementService.createBatch(name),
      "Batch created successfully."
    );
  };

  const saveStudent = async (event) => {
    event.preventDefault();

    if (!selectedStudent || !form.batchId) {
      setError("Select a student and a destination batch.");
      return;
    }

    if (selectedStudent.batches.some((b) => b.id === form.batchId)) {
      setError("Student is already in this batch.");
      return;
    }

    await runAction(
      () =>
        studentManagementService.addExistingStudent(
          form.batchId,
          selectedStudent.id
        ),
      "Student assigned to another batch."
    );
  };

  const removeStudent = async (student) => {
    setMenuId(null);

    if (!student.batches.length) {
      setError("No batch membership found.");
      return;
    }

    const batch = student.batches[0];

    if (
      !window.confirm(
        `Remove ${student.name} from ${batch.name}? This will not delete their account.`
      )
    ) {
      return;
    }

    await runAction(
      () =>
        studentManagementService.removeStudentFromBatch(
          batch.id,
          student.id
        ),
      "Student removed from the selected batch."
    );
  };

  const openAdd = () => {
    setForm({
      ...EMPTY_FORM,
      batchId: batches[0]?.id || "",
    });
    setError("");
    setShowAdd(true);
  };

  const openEdit = (student) => {
    setSelectedStudent(student);
    setEditingStudent(true);
    setForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      userId: student.id,
      batchId: "",
    });
    setMenuId(null);
    setError("");
  };

  const showStudent = (student) => {
    setSelectedStudent(student);
    setEditingStudent(false);
    setMenuId(null);
    setError("");
  };

  const scrollToStudents = (batchId) => {
    setBatchFilter(batchId);
    setStatusFilter("all");
    document.getElementById("students-table")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

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
          <div
            className="flex flex-col justify-between gap-4
              sm:flex-row sm:items-center"
          >
            <div>
              <p className={`mb-2 text-sm ${MUTED}`}>
                Trainer Portal / Student Management
              </p>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Student List & Details
              </h1>
              <p className={`mt-2 text-sm ${MUTED}`}>
                View students, manage batches and assign existing students.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={load}
                disabled={loading}
                className={`flex items-center gap-2 rounded-xl border
                  ${BORDER} bg-white px-4 py-3 text-sm font-semibold
                  dark:bg-[#211e27] disabled:opacity-50`}
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
                  setShowBatch(true);
                }}
                className={`flex items-center gap-2 rounded-xl border
                  ${BORDER} bg-white px-4 py-3 text-sm font-semibold
                  dark:bg-[#211e27]`}
              >
                <Layers size={18} />
                Manage Batches
              </button>

              <button
                type="button"
                onClick={openAdd}
                className={`flex items-center gap-2 rounded-xl px-5
                  py-3 text-sm font-semibold ${PINK}`}
              >
                <UserPlus size={18} />
                Add Student
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border
                border-red-200 bg-red-50 p-4 text-sm text-red-700
                dark:border-red-500/20 dark:bg-red-500/10
                dark:text-red-300"
            >
              <AlertCircle size={18} className="shrink-0" />
              <p className="break-words">{error}</p>
            </div>
          )}

          {notice && (
            <div
              role="status"
              className="rounded-xl border border-emerald-200
                bg-emerald-50 p-4 text-sm text-emerald-700
                dark:border-emerald-500/20 dark:bg-emerald-500/10
                dark:text-emerald-300"
            >
              {notice}
            </div>
          )}

          {/* FOUR EQUAL SUMMARY CARDS */}
          <div
            className="grid grid-cols-1 items-stretch gap-4
              sm:grid-cols-2 xl:grid-cols-4"
          >
            <StatCard
              title="Total Students"
              value={loading ? "…" : totalStudents}
              caption="Unique students in your assigned batches"
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Active Students"
              value={loading ? "…" : activeCount}
              caption="Shown when student activity status is available"
              icon={CheckCircle2}
              color="green"
            />
            <StatCard
              title="Total Batches"
              value={loading ? "…" : totalBatches}
              caption="Learning groups"
              icon={Layers}
              color="purple"
            />
            <StatCard
              title="Average Progress"
              value={
                loading
                  ? "…"
                  : averageProgress === null
                    ? "—"
                    : `${averageProgress}%`
              }
              caption="Across students with available progress data"
              icon={ArrowUpRight}
              color="orange"
            />
          </div>

          {/* BATCH CARDS */}
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Your Batches</h2>
                <p className={`mt-1 text-sm ${MUTED}`}>
                  Select a batch to see its students.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setShowBatch(true);
                }}
                className="text-sm font-semibold text-[#FF2454] hover:underline"
              >
                + Create Batch
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <LoaderCircle
                  size={30}
                  className="animate-spin text-[#FF2454]"
                />
              </div>
            ) : batches.length === 0 ? (
              <div
                className={`rounded-2xl border ${BORDER}
                  bg-white p-10 text-center dark:bg-[#211e27]`}
              >
                <GraduationCap
                  size={32}
                  className="mx-auto text-gray-400"
                />
                <p className="mt-3 font-bold">No batches available</p>
                <p className={`mt-2 text-sm ${MUTED}`}>
                  Batches will appear here when available.
                </p>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 items-stretch gap-4
                  md:grid-cols-2 xl:grid-cols-3"
              >
                {batches.map((batch, index) => (
                  <HoverCard
                    key={batch.id}
                    onClick={() => scrollToStudents(batch.id)}
                  >
                    <div className="flex h-full min-h-[205px] flex-col p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="flex h-12 w-12 items-center
                            justify-center rounded-xl bg-blue-50
                            text-blue-700 dark:bg-[#202b3b]"
                        >
                          <GraduationCap size={24} />
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs
                            font-semibold ${COLORS[index % COLORS.length]}`}
                        >
                          {batch.membersComplete
                            ? `${batch.members.length} students`
                            : "Count unavailable"}
                        </span>
                      </div>

                      <h3 className="mt-4 font-bold">{batch.name}</h3>
                      <p className={`mt-2 flex items-center gap-2 text-sm ${MUTED}`}>
                        <Clock size={15} />
                        Schedule not provided by API
                      </p>

                      <div
                        className={`mt-auto flex items-center justify-between
                          border-t ${BORDER} pt-4 text-sm`}
                      >
                        <span className={MUTED}>View students</span>
                        <ArrowUpRight
                          size={17}
                          className="text-[#FF2454]"
                        />
                      </div>
                    </div>
                  </HoverCard>
                ))}
              </div>
            )}
          </section>

          {/* STUDENT TABLE */}
          <section
            id="students-table"
            className={`overflow-visible rounded-2xl border ${BORDER}
              bg-white shadow-sm dark:bg-[#211e27]`}
          >
            <div className={`border-b ${BORDER} p-5 sm:p-6`}>
              <h2 className="font-bold">All Students</h2>
              <p className={`mt-1 text-sm ${MUTED}`}>
                Search, filter and manage your students.
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
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name, email or phone..."
                    className={`${INPUT} pl-10`}
                  />
                </div>

                <div className="relative">
                  <Filter
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2
                      -translate-y-1/2 text-gray-400"
                  />
                  <select
                    value={batchFilter}
                    onChange={(event) =>
                      setBatchFilter(event.target.value)
                    }
                    className={`${INPUT} appearance-none pl-9 pr-9
                      sm:min-w-[180px]`}
                  >
                    <option value="all">All Batches</option>
                    {batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name}
                      </option>
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
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    className={`${INPUT} appearance-none pr-9
                      sm:min-w-[145px]`}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3
                      top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              {batchFilter !== "all" && (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <span className={MUTED}>Batch:</span>
                  <span
                    className="rounded-lg bg-blue-50 px-3 py-1.5
                      text-blue-700 dark:bg-[#202b3b]"
                  >
                    {batches.find((b) => b.id === batchFilter)?.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBatchFilter("all")}
                    className="font-semibold text-[#FF2454]"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-gray-50 dark:bg-[#302b37]">
                  <tr
                    className={`text-xs uppercase tracking-wider ${MUTED}`}
                  >
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Batch</th>
                    <th className="px-5 py-4">Progress</th>
                    <th className="px-5 py-4">Assignments</th>
                    <th className="px-5 py-4">Last Active</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody
                  className={`divide-y divide-gray-100
                    dark:divide-[#3b3441]`}
                >
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <LoaderCircle
                          size={27}
                          className="mx-auto animate-spin text-[#FF2454]"
                        />
                      </td>
                    </tr>
                  ) : visibleStudents.map((student, index) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50/70 dark:hover:bg-[#302b37]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0
                              items-center justify-center rounded-full
                              text-sm font-bold
                              ${COLORS[index % COLORS.length]}`}
                          >
                            {initials(student.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold">{student.name}</p>
                            <p className={`mt-1 text-xs ${MUTED}`}>
                              {display(student.email)}
                            </p>
                            <p className={`mt-1 text-xs ${MUTED}`}>
                              {display(student.phone)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {student.batches.map((batch) => (
                            <span
                              key={batch.id}
                              className="rounded-lg bg-blue-50
                                px-3 py-1.5 text-xs font-medium
                                text-blue-700 dark:bg-[#202b3b]"
                            >
                              {batch.name}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <Progress value={student.progress} />
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold">
                          {display(student.completed)}/
                          {display(student.assignments)}
                        </p>
                        <p className={`mt-1 text-xs ${MUTED}`}>
                          Completed
                        </p>
                      </td>

                      <td className={`px-5 py-4 text-sm ${MUTED}`}>
                        {display(student.lastActive)}
                      </td>

                      <td className="px-5 py-4">
                        {student.status ? (
                          <span
                            className={`rounded-full px-3 py-1.5
                              text-xs font-semibold ${
                                student.status.toLowerCase() === "active"
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-[#1f352e]"
                                  : "bg-gray-100 text-gray-500 dark:bg-[#393441]"
                              }`}
                          >
                            {student.status}
                          </span>
                        ) : (
                          <span className={MUTED}>—</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={() =>
                              setMenuId(
                                menuId === student.id ? null : student.id
                              )
                            }
                            aria-label={`Actions for ${student.name}`}
                            aria-expanded={menuId === student.id}
                            className="rounded-lg p-2 text-gray-400
                              hover:bg-gray-100 dark:hover:bg-[#393441]"
                          >
                            <MoreHorizontal size={20} />
                          </button>

                          {menuId === student.id && (
                            <div
                              className={`absolute right-0 top-10 z-30
                                w-48 rounded-xl border ${BORDER}
                                bg-white p-1.5 text-left shadow-xl
                                dark:bg-[#211e27]`}
                            >
                              <button
                                type="button"
                                onClick={() => showStudent(student)}
                                className="flex w-full items-center gap-2
                                  rounded-lg px-3 py-2.5 text-sm
                                  hover:bg-gray-50 dark:hover:bg-[#302b37]"
                              >
                                <Eye size={16} /> View Details
                              </button>

                              <button
                                type="button"
                                onClick={() => openEdit(student)}
                                className="flex w-full items-center gap-2
                                  rounded-lg px-3 py-2.5 text-sm
                                  hover:bg-gray-50 dark:hover:bg-[#302b37]"
                              >
                                <Pencil size={16} /> Edit Student
                              </button>

                              <button
                                type="button"
                                onClick={() => removeStudent(student)}
                                className="flex w-full items-center gap-2
                                  rounded-lg px-3 py-2.5 text-sm
                                  text-red-600 hover:bg-red-50
                                  dark:hover:bg-[#39232f]"
                              >
                                <Trash2 size={16} /> Remove from Batch
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!loading && filteredStudents.length === 0 && (
              <div className="px-6 py-14 text-center">
                <Users
                  size={32}
                  className="mx-auto text-gray-300 dark:text-[#625a6c]"
                />
                <p className="mt-3 font-semibold">No students found</p>
                <p className={`mt-1 text-sm ${MUTED}`}>
                  {students.length === 0
                    ? "Students will appear here when added to your batches."
                    : "Change the search or filters to find students."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setBatchFilter("all");
                    setStatusFilter("all");
                  }}
                  className="mt-3 text-sm font-semibold text-[#FF2454]"
                >
                  Clear filters
                </button>
              </div>
            )}

            <div
              className={`flex flex-col gap-3 border-t ${BORDER}
                px-5 py-4 text-sm sm:flex-row
                sm:items-center sm:justify-between`}
            >
              <p className={MUTED}>
                Showing {visibleStudents.length} of{" "}
                {filteredStudents.length} filtered students
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={pageSize}
                  onChange={(event) =>
                    setPageSize(Number(event.target.value))
                  }
                  aria-label="Rows per page"
                  className={`${INPUT} w-auto py-2`}
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>

                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className={`rounded-lg border ${BORDER} px-3 py-2
                    disabled:opacity-40`}
                >
                  Previous
                </button>

                <span className={`text-xs ${MUTED}`}>
                  {currentPage} / {pages}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= pages}
                  onClick={() => setPage((p) => p + 1)}
                  className={`rounded-lg border ${BORDER} px-3 py-2
                    disabled:opacity-40`}
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ADD STUDENT MODAL */}
      {showAdd && (
        <Modal title="Add New Student" onClose={closeModals}>
          <p className={`mb-5 text-sm leading-6 ${MUTED}`}>
            The existing backend can add a registered student to a
            batch using their user ID. New account creation by
            name, email or phone is not connected yet.
          </p>

          <form onSubmit={addStudent} className="space-y-4">
            <Field
              label="Student Name"
              hint="Reserved for future student creation API."
            >
              <input
                name="name"
                value={form.name}
                onChange={changeForm}
                placeholder="Enter full name"
                className={INPUT}
              />
            </Field>

            <Field
              label="Email Address"
              hint="Not submitted to the batch membership API."
            >
              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2
                    -translate-y-1/2 text-gray-400"
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={changeForm}
                  placeholder="student@example.com"
                  className={`${INPUT} pl-10`}
                />
              </div>
            </Field>

            <p className={`text-center text-xs ${MUTED}`}>OR</p>

            <Field
              label="Phone Number"
              hint="Reserved for future student creation API."
            >
              <div className="relative">
                <Phone
                  size={17}
                  className="absolute left-3.5 top-1/2
                    -translate-y-1/2 text-gray-400"
                />
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={changeForm}
                  placeholder="+91 98765 43210"
                  className={`${INPUT} pl-10`}
                />
              </div>
            </Field>

            <Field
              label="Existing Student User ID"
              hint="Required for the currently available batch membership API."
            >
              <input
                name="userId"
                value={form.userId}
                onChange={changeForm}
                placeholder="Registered student UUID"
                required
                className={INPUT}
              />
            </Field>

            <Field label="Assign Batch">
              <select
                name="batchId"
                value={form.batchId}
                onChange={changeForm}
                required
                className={INPUT}
              >
                <option value="">Select a batch</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
              </select>
            </Field>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm
                text-red-600 dark:bg-[#39232f]">
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={closeModals}
                disabled={saving}
                className={`flex-1 rounded-xl border ${BORDER}
                  px-4 py-3 text-sm font-semibold`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !batches.length}
                className={`flex-1 rounded-xl px-4 py-3
                  text-sm font-semibold disabled:opacity-50 ${PINK}`}
              >
                {saving ? "Saving..." : "Add to Batch"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MANAGE / CREATE BATCH MODAL */}
      {showBatch && (
        <Modal title="Manage Batches" onClose={closeModals}>
          <div className="mb-5 space-y-2">
            {batches.length === 0 ? (
              <p className={`text-sm ${MUTED}`}>
                No batches found.
              </p>
            ) : (
              batches.map((batch) => (
                <div
                  key={batch.id}
                  className={`flex items-center justify-between
                    gap-3 rounded-xl border ${BORDER} p-3`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {batch.name}
                    </p>
                    <p className={`mt-1 text-xs ${MUTED}`}>
                      {batch.membersComplete
                        ? `${batch.members.length} members`
                        : "Member count unavailable"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBatch(false);
                      scrollToStudents(batch.id);
                    }}
                    className="text-xs font-semibold text-[#FF2454]"
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>

          <h3 className="mb-4 font-bold">Create New Batch</h3>

          <form onSubmit={addBatch} className="space-y-4">
            <Field label="Batch Name">
              <input
                value={batchForm.name}
                onChange={(event) => {
                  setBatchForm((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }));
                  setError("");
                }}
                placeholder="e.g. Morning Batch"
                required
                minLength={2}
                className={INPUT}
              />
            </Field>

            <Field
              label="Batch Schedule"
              hint="Schedule is not supported by the current create-batch API. This field is retained for future integration."
            >
              <input
                value={batchForm.schedule}
                onChange={(event) =>
                  setBatchForm((prev) => ({
                    ...prev,
                    schedule: event.target.value,
                  }))
                }
                placeholder="e.g. 9 AM - 11 AM"
                className={INPUT}
              />
            </Field>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm
                text-red-600 dark:bg-[#39232f]">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={closeModals}
                disabled={saving}
                className={`flex-1 rounded-xl border ${BORDER}
                  px-4 py-3 text-sm font-semibold`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-[#10265F]
                  px-4 py-3 text-sm font-semibold text-white
                  disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Batch"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* STUDENT DETAILS / EDIT MODAL */}
      {selectedStudent && (
        <Modal
          title={editingStudent ? "Edit Student" : "Student Details"}
          onClose={closeModals}
        >
          {editingStudent ? (
            <form onSubmit={saveStudent} className="space-y-4">
              <p className={`text-sm leading-6 ${MUTED}`}>
                Profile editing is not supported by the verified
                batch API. You can assign this existing student
                to another batch. Their account details will not
                be changed.
              </p>

              <Field label="Student Name">
                <input
                  name="name"
                  value={form.name}
                  onChange={changeForm}
                  className={INPUT}
                />
              </Field>

              <Field label="Email">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={changeForm}
                  className={INPUT}
                />
              </Field>

              <Field label="Phone">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={changeForm}
                  className={INPUT}
                />
              </Field>

              <Field label="Assign to Another Batch">
                <select
                  name="batchId"
                  value={form.batchId}
                  onChange={changeForm}
                  required
                  className={INPUT}
                >
                  <option value="">Select destination batch</option>
                  {batches
                    .filter(
                      (batch) =>
                        !selectedStudent.batches.some(
                          (existing) => existing.id === batch.id
                        )
                    )
                    .map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name}
                      </option>
                    ))}
                </select>
              </Field>

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm
                  text-red-600 dark:bg-[#39232f]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className={`flex w-full items-center justify-center
                  gap-2 rounded-xl px-4 py-3 text-sm
                  font-semibold disabled:opacity-50 ${PINK}`}
              >
                <Save size={17} />
                {saving ? "Saving..." : "Assign to Batch"}
              </button>
            </form>
          ) : (
            <div>
              <div
                className="flex items-center gap-4 rounded-xl
                  bg-gray-50 p-4 dark:bg-[#302b37]"
              >
                <div
                  className="flex h-14 w-14 shrink-0 items-center
                    justify-center rounded-2xl bg-blue-100
                    text-lg font-bold text-blue-700 dark:bg-[#202b3b]"
                >
                  {initials(selectedStudent.name)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold">{selectedStudent.name}</h3>
                  <p className={`mt-1 break-all text-sm ${MUTED}`}>
                    {display(selectedStudent.email)}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <Detail
                  icon={Mail}
                  label="Email"
                  value={selectedStudent.email}
                />
                <Detail
                  icon={Phone}
                  label="Phone"
                  value={selectedStudent.phone}
                />
                <Detail
                  icon={Layers}
                  label="Batches"
                  value={selectedStudent.batches
                    .map((batch) => batch.name)
                    .join(", ")}
                />
                <Detail
                  icon={Clock}
                  label="Last Active"
                  value={selectedStudent.lastActive}
                />
                <Detail
                  icon={ArrowUpRight}
                  label="Progress"
                  value={
                    percent(selectedStudent.progress) === null
                      ? null
                      : `${percent(selectedStudent.progress)}%`
                  }
                />
                <Detail
                  icon={CheckCircle2}
                  label="Assignments Completed"
                  value={
                    selectedStudent.completed === null ||
                    selectedStudent.assignments === null
                      ? null
                      : `${selectedStudent.completed} of ${selectedStudent.assignments}`
                  }
                />
                <Detail
                  icon={UserRound}
                  label="Student ID"
                  value={selectedStudent.id}
                />
              </div>

              <button
                type="button"
                onClick={() => openEdit(selectedStudent)}
                className={`mt-5 flex w-full items-center
                  justify-center gap-2 rounded-xl px-4 py-3
                  text-sm font-semibold ${PINK}`}
              >
                <Pencil size={16} />
                Edit Student
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
