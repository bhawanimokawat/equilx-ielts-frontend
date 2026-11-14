
import React, { useMemo, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar";
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
  CheckCircle2,
  Download,
} from "lucide-react";

const initialAssignments = [
  {
    id: 1,
    title: "Mock Test 3 - Full Length",
    description: "Cambridge Book 15",
    type: "Mock Test",
    batch: "Batch A",
    students: 32,
    trainer: "Aman Sharma",
    initials: "AS",
    dueDate: "2026-11-02",
    completion: 75,
    status: "In Progress",
  },
  {
    id: 2,
    title: "Writing Task 2 Practice",
    description: "Agree/Disagree Essay",
    type: "Practice Test",
    batch: "Batch B",
    students: 28,
    trainer: "Pooja Gupta",
    initials: "PG",
    dueDate: "2026-10-30",
    completion: 100,
    status: "Completed",
  },
  {
    id: 3,
    title: "Reading Section Practice",
    description: "Passage 1 - 3",
    type: "Practice Test",
    batch: "Batch A",
    students: 32,
    trainer: "Rahul Kumar",
    initials: "RK",
    dueDate: "2026-10-29",
    completion: 60,
    status: "In Progress",
  },
  {
    id: 4,
    title: "Listening Test 2",
    description: "Cambridge Book 14",
    type: "Mock Test",
    batch: "Batch C",
    students: 24,
    trainer: "Neha Singh",
    initials: "NS",
    dueDate: "2026-11-04",
    completion: 90,
    status: "In Progress",
  },
  {
    id: 5,
    title: "Speaking Part 1 Practice",
    description: "Common Topics",
    type: "Practice Test",
    batch: "Batch B",
    students: 28,
    trainer: "Pooja Gupta",
    initials: "PG",
    dueDate: "2026-11-06",
    completion: 40,
    status: "Pending",
  },
  {
    id: 6,
    title: "Grammar & Vocabulary",
    description: "Unit 1-5",
    type: "Study Material",
    batch: "Batch C",
    students: 24,
    trainer: "Tanvi Mehta",
    initials: "TM",
    dueDate: "2026-11-08",
    completion: 100,
    status: "Completed",
  },
  {
    id: 7,
    title: "Mock Test 4 - Full Length",
    description: "Cambridge Book 16",
    type: "Mock Test",
    batch: "Batch A",
    students: 32,
    trainer: "Aman Sharma",
    initials: "AS",
    dueDate: "2026-11-10",
    completion: 25,
    status: "Pending",
  },
  {
    id: 8,
    title: "Writing Task 1 Practice",
    description: "Graph & Chart",
    type: "Practice Test",
    batch: "Batch B",
    students: 28,
    trainer: "Rahul Kumar",
    initials: "RK",
    dueDate: "2026-11-12",
    completion: 80,
    status: "In Progress",
  },
];

const typeColors = {
  "Mock Test":
    "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  "Practice Test":
    "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  "Study Material":
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
};

const statusColors = {
  Completed:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  "In Progress":
    "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  Pending:
    "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
};

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
            from last month
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
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.dueDate) return;

    onCreate(form);
    onClose();
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

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Assignments() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [batchFilter, setBatchFilter] = useState("All Batches");
  const [trainerFilter, setTrainerFilter] = useState("All Trainers");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showModal, setShowModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assignments.filter((item) => {
      const matchesSearch =
        !query ||
        [item.title, item.description, item.batch, item.trainer].some(
          (value) => value.toLowerCase().includes(query)
        );

      return (
        matchesSearch &&
        (typeFilter === "All Types" || item.type === typeFilter) &&
        (batchFilter === "All Batches" || item.batch === batchFilter) &&
        (trainerFilter === "All Trainers" || item.trainer === trainerFilter) &&
        (statusFilter === "All Status" || item.status === statusFilter)
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

  const total = assignments.length;

  const completed = assignments.filter(
    (item) => item.status === "Completed"
  ).length;

  const inProgress = assignments.filter(
    (item) => item.status === "In Progress"
  ).length;

  const distribution = [
    { label: "Mock Tests", type: "Mock Test", color: "#FF7199" },
    { label: "Practice Tests", type: "Practice Test", color: "#A044FF" },
    { label: "Study Material", type: "Study Material", color: "#2995FF" },
  ].map((item) => ({
    ...item,
    count: assignments.filter(
      (assignment) => assignment.type === item.type
    ).length,
  }));

  const pageSize = 8;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const currentPage = Math.min(page, totalPages);

  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const createAssignment = (form) => {
    const trainerInitials = form.trainer
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();

    const batchCounts = {
      "Batch A": 32,
      "Batch B": 28,
      "Batch C": 24,
      "Batch D": 20,
    };

    setAssignments((previous) => [
      {
        ...form,
        id: Date.now(),
        initials: trainerInitials,
        students: batchCounts[form.batch] || 0,
        completion: 0,
        status: "Pending",
      },
      ...previous,
    ]);

    setSearch("");
    setTypeFilter("All Types");
    setBatchFilter("All Batches");
    setTrainerFilter("All Trainers");
    setStatusFilter("All Status");
    setPage(1);
    setNotice("Assignment created in the current demo list.");
  };

  const updateStatus = (id, status) => {
    setAssignments((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              completion:
                status === "Completed" ? 100 : item.completion,
            }
          : item
      )
    );

    setActiveMenu(null);
    setNotice("Assignment status updated in the demo list.");
  };

  const exportCSV = () => {
    const headers = [
      "Title",
      "Type",
      "Batch",
      "Trainer",
      "Due Date",
      "Completion",
      "Status",
    ];

    const rows = filtered.map((item) => [
      item.title,
      item.type,
      item.batch,
      item.trainer,
      item.dueDate,
      `${item.completion}%`,
      item.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
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
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#10265F] shadow-sm transition hover:bg-slate-50 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-slate-200 dark:hover:bg-[#302B36]"
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

          {/* Notice */}

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

          {/* Statistics */}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title="Total Assignments"
              value={total}
              change="+12%"
              icon={ClipboardList}
              color="rose"
            />

            <StatCard
              title="Completed"
              value={completed}
              change="+18%"
              icon={Users}
              color="purple"
            />

            <StatCard
              title="In Progress"
              value={inProgress}
              change="+5%"
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
                  {filtered.length} results
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
                      setPage(1);
                    }}
                    placeholder="Search assignments..."
                    className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-[#91899B]"
                  />
                </div>

                {[
                  {
                    value: typeFilter,
                    setter: setTypeFilter,
                    options: [
                      "All Types",
                      "Mock Test",
                      "Practice Test",
                      "Study Material",
                    ],
                  },
                  {
                    value: batchFilter,
                    setter: setBatchFilter,
                    options: [
                      "All Batches",
                      "Batch A",
                      "Batch B",
                      "Batch C",
                      "Batch D",
                    ],
                  },
                  {
                    value: statusFilter,
                    setter: setStatusFilter,
                    options: [
                      "All Status",
                      "Pending",
                      "In Progress",
                      "Completed",
                    ],
                  },
                ].map((filter, index) => (
                  <select
                    key={index}
                    value={filter.value}
                    onChange={(event) => {
                      filter.setter(event.target.value);
                      setPage(1);
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
                    setPage(1);
                  }}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-[#10265F] outline-none dark:border-[#3B3441] dark:bg-[#19171E] dark:text-slate-200"
                >
                  <option>All Trainers</option>

                  {Array.from(
                    new Set(assignments.map((item) => item.trainer))
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
                    {visible.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-100 text-xs transition hover:bg-slate-50/70 dark:border-[#3B3441] dark:hover:bg-[#302B36]/60"
                      >
                        <td className="px-3 py-4 text-slate-400 dark:text-[#91899B]">
                          {(currentPage - 1) * pageSize + index + 1}
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
                                {item.description || "Assignment"}
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
                            {item.students} students
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
                                style={{ width: `${item.completion}%` }}
                              />
                            </div>

                            <span className="text-[10px] text-slate-500 dark:text-[#B0A5BD]">
                              {item.completion}%
                            </span>
                          </div>
                        </td>

                        <td className="px-3 py-4">
                          <span
                            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold ${statusColors[item.status]}`}
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
                            <div className="absolute right-8 top-10 z-20 w-44 rounded-xl border border-slate-100 bg-white p-1 shadow-xl dark:border-[#3B3441] dark:bg-[#211E27]">
                              {["Pending", "In Progress", "Completed"].map(
                                (status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() =>
                                      updateStatus(item.id, status)
                                    }
                                    className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#10265F] transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-[#302B36]"
                                  >
                                    Mark {status}
                                  </button>
                                )
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
                  </tbody>
                </table>
              </div>

              {/* Pagination */}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-[#3B3441]">
                <p className="text-xs text-slate-500 dark:text-[#B0A5BD]">
                  Showing{" "}
                  {filtered.length ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                  {Math.min(currentPage * pageSize, filtered.length)} of{" "}
                  {filtered.length} assignments
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
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

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
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
                          {item.count} (
                          {total
                            ? Math.round((item.count / total) * 100)
                            : 0}
                          %)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>

              <Panel title="Completion Rate by Batch">
                <div className="flex h-44 items-end justify-around gap-3 border-b border-l border-slate-100 px-3 pb-1 pt-4 dark:border-[#3B3441]">
                  {["Batch A", "Batch B", "Batch C", "Batch D"].map(
                    (batch, index) => {
                      const values = [78, 62, 85, 56];
                      const colors = [
                        "#FF7199",
                        "#A044FF",
                        "#2995FF",
                        "#06C99A",
                      ];

                      return (
                        <div
                          key={batch}
                          className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                        >
                          <span className="text-xs font-bold text-[#10265F] dark:text-slate-100">
                            {values[index]}%
                          </span>

                          <div
                            className="flex w-full max-w-12 items-end"
                            style={{ height: "75%" }}
                          >
                            <div
                              className="w-full rounded-t-md"
                              style={{
                                height: `${values[index]}%`,
                                backgroundColor: colors[index],
                                opacity: 0.75,
                              }}
                            />
                          </div>

                          <span className="whitespace-nowrap text-[10px] text-slate-500 dark:text-[#B0A5BD]">
                            {batch}
                          </span>
                        </div>
                      );
                    }
                  )}
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
                  {assignments
                    .filter((item) => item.status !== "Completed")
                    .slice()
                    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
                    .slice(0, 4)
                    .map((item, index) => (
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
                            {item.batch} · {item.students} students
                          </p>

                          <p className="mt-1 text-[10px] font-medium text-rose-500">
                            Due {formatDate(item.dueDate)}
                          </p>
                        </div>
                      </div>
                    ))}
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
