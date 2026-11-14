
import React, { useMemo, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar";
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
  BookOpen,
  Clock,
  TrendingUp,
} from "lucide-react";

const initialBatches = [
  {
    id: 1,
    name: "Foundation Batch A",
    type: "Regular",
    trainer: "Aman Sharma",
    initials: "AS",
    extraTrainers: 1,
    students: 32,
    start: "01 Aug 2025",
    end: "30 Sep 2025",
    progress: 80,
    status: "Active",
    category: "Foundation",
  },
  {
    id: 2,
    name: "IELTS Pro Batch B",
    type: "Weekend",
    trainer: "Pooja Gupta",
    initials: "PG",
    extraTrainers: 0,
    students: 28,
    start: "15 Jul 2025",
    end: "15 Oct 2025",
    progress: 65,
    status: "Active",
    category: "IELTS Pro",
  },
  {
    id: 3,
    name: "Speaking Special C",
    type: "Evening",
    trainer: "Rahul Kumar",
    initials: "RK",
    extraTrainers: 1,
    students: 24,
    start: "10 Aug 2025",
    end: "10 Nov 2025",
    progress: 72,
    status: "Active",
    category: "Speaking",
  },
  {
    id: 4,
    name: "Writing Masterclass",
    type: "Weekend",
    trainer: "Neha Singh",
    initials: "NS",
    extraTrainers: 0,
    students: 18,
    start: "01 Sep 2025",
    end: "01 Dec 2025",
    progress: 40,
    status: "Active",
    category: "Writing",
  },
  {
    id: 5,
    name: "Reading Focus A",
    type: "Regular",
    trainer: "Vikram Patel",
    initials: "VP",
    extraTrainers: 0,
    students: 26,
    start: "05 Jul 2025",
    end: "05 Oct 2025",
    progress: 90,
    status: "Active",
    category: "Reading",
  },
  {
    id: 6,
    name: "Listening Booster",
    type: "Weekend",
    trainer: "Tanvi Mehta",
    initials: "TM",
    extraTrainers: 0,
    students: 20,
    start: "12 Aug 2025",
    end: "12 Nov 2025",
    progress: 55,
    status: "Active",
    category: "Listening",
  },
  {
    id: 7,
    name: "Crash Course Sep",
    type: "Intensive",
    trainer: "Aman Sharma",
    initials: "AS",
    extraTrainers: 2,
    students: 18,
    start: "01 Sep 2025",
    end: "30 Sep 2025",
    progress: 25,
    status: "Active",
    category: "Foundation",
  },
  {
    id: 8,
    name: "Mock Test Batch",
    type: "Regular",
    trainer: "Pooja Gupta",
    initials: "PG",
    extraTrainers: 0,
    students: 22,
    start: "01 Jul 2025",
    end: "30 Sep 2025",
    progress: 100,
    status: "Completed",
    category: "Others",
  },
];

const avatarColors = [
  "bg-orange-100 text-orange-600",
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600",
  "bg-purple-100 text-purple-600",
  "bg-pink-100 text-pink-600",
  "bg-violet-100 text-violet-600",
];

function StatCard({ title, value, change, icon: Icon, color }) {
  const styles = {
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

  const [iconStyle, lineColor] = styles[color];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconStyle}`}
        >
          <Icon size={27} />
        </div>

        <div>
          <p className="text-sm font-semibold text-[#10265F] dark:text-slate-100">
            {title}
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-3xl font-extrabold text-[#10265F] dark:text-white">
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
          d="M0 32 C20 24 26 34 45 25 S72 7 94 15 S125 29 145 20 S176 23 196 12 S225 14 250 3 L250 38 L0 38 Z"
          fill={lineColor}
          fillOpacity=".10"
        />

        <path
          d="M0 32 C20 24 26 34 45 25 S72 7 94 15 S125 29 145 20 S176 23 196 12 S225 14 250 3"
          fill="none"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
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

function CreateBatchModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "",
    trainer: "Aman Sharma",
    type: "Regular",
    students: 0,
    start: "",
    end: "",
    category: "Foundation",
  });

  const update = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.start || !form.end) return;
    if (form.end < form.start) return;

    onCreate(form);
    onClose();
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-pink-400 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white dark:[color-scheme:dark]";

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
              Set up a batch and assign its trainer.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#302B36]"
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
              value={form.name}
              onChange={update}
              placeholder="e.g. IELTS Foundation Batch"
              className={inputClass}
            />
          </label>

          <label>
            <span className={labelClass}>Batch Type</span>
            <select
              name="type"
              value={form.type}
              onChange={update}
              className={inputClass}
            >
              <option>Regular</option>
              <option>Weekend</option>
              <option>Evening</option>
              <option>Intensive</option>
            </select>
          </label>

          <label>
            <span className={labelClass}>Category</span>
            <select
              name="category"
              value={form.category}
              onChange={update}
              className={inputClass}
            >
              <option>Foundation</option>
              <option>IELTS Pro</option>
              <option>Speaking</option>
              <option>Writing</option>
              <option>Reading</option>
              <option>Listening</option>
              <option>Others</option>
            </select>
          </label>

          <label className="sm:col-span-2">
            <span className={labelClass}>Assign Trainer</span>
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
              <option>Vikram Patel</option>
              <option>Tanvi Mehta</option>
            </select>
          </label>

          <label>
            <span className={labelClass}>Start Date</span>
            <input
              type="date"
              name="start"
              required
              value={form.start}
              onChange={update}
              className={inputClass}
            />
          </label>

          <label>
            <span className={labelClass}>End Date</span>
            <input
              type="date"
              name="end"
              required
              min={form.start || undefined}
              value={form.end}
              onChange={update}
              className={inputClass}
            />
          </label>

          <label className="sm:col-span-2">
            <span className={labelClass}>Initial Student Count</span>
            <input
              type="number"
              name="students"
              min="0"
              max="1000"
              value={form.students}
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
            Create Batch
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Batches() {
  const [batches, setBatches] = useState(initialBatches);
  const [activeTab, setActiveTab] = useState("All Batches");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [showModal, setShowModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState(1);

  const activeCount = batches.filter(
    (batch) => batch.status === "Active"
  ).length;

  const completedCount = batches.filter(
    (batch) => batch.status === "Completed"
  ).length;

  const totalStudents = batches.reduce(
    (sum, batch) => sum + batch.students,
    0
  );

  const filteredBatches = useMemo(() => {
    const query = search.trim().toLowerCase();

    return batches.filter((batch) => {
      const matchesSearch =
        !query ||
        [batch.name, batch.trainer, batch.type, batch.category].some(
          (value) => value.toLowerCase().includes(query)
        );

      const matchesTab =
        activeTab === "All Batches" ||
        (activeTab === "Active" && batch.status === "Active") ||
        (activeTab === "Completed" && batch.status === "Completed") ||
        (activeTab === "Upcoming" && batch.status === "Upcoming");

      const matchesCategory =
        category === "All Categories" || batch.category === category;

      return matchesSearch && matchesTab && matchesCategory;
    });
  }, [batches, activeTab, search, category]);

  const pageSize = 8;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredBatches.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);

  const visibleBatches = filteredBatches.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const createBatch = (form) => {
    const trainerInitials = form.trainer
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();

    const formatDate = (value) =>
      new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    const newBatch = {
      ...form,
      id: Date.now(),
      initials: trainerInitials,
      extraTrainers: 0,
      students: Number(form.students) || 0,
      start: formatDate(form.start),
      end: formatDate(form.end),
      progress: 0,
      status: "Active",
    };

    setBatches((previous) => [newBatch, ...previous]);
    setActiveTab("All Batches");
    setCategory("All Categories");
    setSearch("");
    setPage(1);
    setNotice("Batch created in the current demo list.");
  };

  const toggleBatchStatus = (id) => {
    setBatches((previous) =>
      previous.map((batch) =>
        batch.id === id
          ? {
              ...batch,
              status:
                batch.status === "Active" ? "Completed" : "Active",
              progress: batch.status === "Active" ? 100 : batch.progress,
            }
          : batch
      )
    );

    setActiveMenu(null);
    setNotice("Batch status updated in the demo list.");
  };

  const exportBatches = () => {
    const headers = [
      "Batch Name",
      "Trainer",
      "Students",
      "Start Date",
      "End Date",
      "Progress",
      "Status",
    ];

    const rows = filteredBatches.map((batch) => [
      batch.name,
      batch.trainer,
      batch.students,
      batch.start,
      batch.end,
      `${batch.progress}%`,
      batch.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
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
    link.download = "institute-batches.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const distribution = [
    {
      label: "Foundation",
      count: batches.filter((b) => b.category === "Foundation").length,
      color: "#FF7199",
    },
    {
      label: "IELTS Pro",
      count: batches.filter((b) => b.category === "IELTS Pro").length,
      color: "#A044FF",
    },
    {
      label: "Speaking",
      count: batches.filter((b) => b.category === "Speaking").length,
      color: "#2995FF",
    },
    {
      label: "Writing",
      count: batches.filter((b) => b.category === "Writing").length,
      color: "#06C99A",
    },
    {
      label: "Reading",
      count: batches.filter((b) => b.category === "Reading").length,
      color: "#FFAD42",
    },
    {
      label: "Others",
      count: batches.filter((b) => b.category === "Others").length,
      color: "#A5B4C9",
    },
  ];

  const totalCategories = distribution.reduce(
    (sum, item) => sum + item.count,
    0
  );

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
                Create, manage and track your batches. Assign students, map
                trainers and monitor progress.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={exportBatches}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#10265F] shadow-sm transition hover:bg-slate-50 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-slate-200 dark:hover:bg-[#302B36]"
              >
                <Download size={17} />
                Export Batches
              </button>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
              >
                <Plus size={19} />
                Create Batch
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
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Summary cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title="Total Batches"
              value={batches.length}
              change="+2"
              icon={Layers3}
              color="rose"
            />

            <StatCard
              title="Total Students"
              value={totalStudents}
              change="+12%"
              icon={Users}
              color="purple"
            />

            <StatCard
              title="Active Batches"
              value={activeCount}
              change="+1"
              icon={GraduationCap}
              color="blue"
            />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            {/* Main list */}
            <div className="min-w-0 xl:col-span-12">
              <Panel
                title="Manage Batches"
                action={
                  <div className="flex flex-wrap gap-2">
                    <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 dark:border-[#3B3441] dark:bg-[#19171E]">
                      <Search size={16} className="text-slate-400" />

                      <input
                        value={search}
                        onChange={(event) => {
                          setSearch(event.target.value);
                          setPage(1);
                        }}
                        placeholder="Search batches..."
                        className="w-36 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 sm:w-48 dark:text-white dark:placeholder:text-[#91899B]"
                      />
                    </div>

                    <select
                      value={category}
                      onChange={(event) => {
                        setCategory(event.target.value);
                        setPage(1);
                      }}
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-[#10265F] outline-none dark:border-[#3B3441] dark:bg-[#19171E] dark:text-slate-200"
                    >
                      <option>All Categories</option>
                      {distribution.map((item) => (
                        <option key={item.label}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                }
              >
                <div className="mb-4 flex flex-wrap gap-5 border-b border-slate-100 dark:border-[#3B3441]">
                  {[
                    ["All Batches", batches.length],
                    ["Active", activeCount],
                    ["Completed", completedCount],
                    [
                      "Upcoming",
                      batches.filter((b) => b.status === "Upcoming").length,
                    ],
                  ].map(([tab, count]) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab);
                        setPage(1);
                      }}
                      className={`border-b-2 pb-3 text-sm transition ${
                        activeTab === tab
                          ? "border-[#FF2454] font-bold text-[#FF2454]"
                          : "border-transparent text-slate-500 hover:text-[#10265F] dark:text-[#B0A5BD] dark:hover:text-white"
                      }`}
                    >
                      {tab} ({count})
                    </button>
                  ))}
                </div>

                <div className="mb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-[#B0A5BD]">
                  <SlidersHorizontal size={15} />
                  <span>
                    Filter by batch name, trainer, category or status.
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
                          "Start Date",
                          "End Date",
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
                      {visibleBatches.map((batch, index) => {
                        const trainerIndex = initialBatches.findIndex(
                          (item) => item.initials === batch.initials
                        );

                        return (
                          <tr
                            key={batch.id}
                            className="border-b border-slate-100 text-xs transition hover:bg-slate-50/70 dark:border-[#3B3441] dark:hover:bg-[#302B36]/60"
                          >
                            <td className="px-3 py-4 text-slate-400 dark:text-[#91899B]">
                              {(currentPage - 1) * pageSize + index + 1}
                            </td>

                            <td className="px-3 py-4">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    avatarColors[
                                      trainerIndex < 0
                                        ? index % avatarColors.length
                                        : trainerIndex % avatarColors.length
                                    ]
                                  }`}
                                >
                                  {batch.name
                                    .split(" ")
                                    .map((word) => word[0])
                                    .join("")
                                    .slice(0, 2)}
                                </span>

                                <div>
                                  <p className="whitespace-nowrap font-bold text-[#10265F] dark:text-slate-100">
                                    {batch.name}
                                  </p>
                                  <p className="mt-1 text-[10px] text-slate-400 dark:text-[#91899B]">
                                    {batch.type}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-3 py-4">
                              <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                                  {batch.initials}
                                </span>

                                <div>
                                  <p className="whitespace-nowrap font-medium text-[#10265F] dark:text-slate-200">
                                    {batch.trainer}
                                  </p>

                                  {batch.extraTrainers > 0 && (
                                    <span className="text-[10px] text-slate-400 dark:text-[#91899B]">
                                      +{batch.extraTrainers} trainers
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-3 py-4 font-semibold text-[#10265F] dark:text-slate-200">
                              {batch.students}
                            </td>

                            <td className="whitespace-nowrap px-3 py-4 text-slate-500 dark:text-[#B0A5BD]">
                              {batch.start}
                            </td>

                            <td className="whitespace-nowrap px-3 py-4 text-slate-500 dark:text-[#B0A5BD]">
                              {batch.end}
                            </td>

                            <td className="px-3 py-4">
                              <div className="flex items-center gap-2">
                                <div className="h-2.5 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-[#3B3441]">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                                    style={{
                                      width: `${batch.progress}%`,
                                    }}
                                  />
                                </div>

                                <span className="text-[10px] text-slate-500 dark:text-[#B0A5BD]">
                                  {batch.progress}%
                                </span>
                              </div>
                            </td>

                            <td className="px-3 py-4">
                              <span
                                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                                  batch.status === "Active"
                                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                    : batch.status === "Completed"
                                      ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                      : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                                }`}
                              >
                                {batch.status}
                              </span>
                            </td>

                            <td className="relative px-3 py-4">
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveMenu(
                                    activeMenu === batch.id ? null : batch.id
                                  )
                                }
                                aria-label={`Actions for ${batch.name}`}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-[#B0A5BD] dark:hover:bg-[#302B36]"
                              >
                                <MoreVertical size={17} />
                              </button>

                              {activeMenu === batch.id && (
                                <div className="absolute right-8 top-10 z-20 w-40 rounded-xl border border-slate-100 bg-white p-1 shadow-xl dark:border-[#3B3441] dark:bg-[#211E27]">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNotice(
                                        `${batch.name}: ${batch.students} students · Trainer: ${batch.trainer}`
                                      );
                                      setActiveMenu(null);
                                    }}
                                    className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#10265F] transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-[#302B36]"
                                  >
                                    View batch details
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleBatchStatus(batch.id)
                                    }
                                    className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#10265F] transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-[#302B36]"
                                  >
                                    {batch.status === "Active"
                                      ? "Mark completed"
                                      : "Reactivate batch"}
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}

                      {visibleBatches.length === 0 && (
                        <tr>
                          <td
                            colSpan="9"
                            className="px-4 py-12 text-center text-sm text-slate-500 dark:text-[#B0A5BD]"
                          >
                            No batches found. Try changing the search or
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
                    {filteredBatches.length
                      ? (currentPage - 1) * pageSize + 1
                      : 0}{" "}
                    to{" "}
                    {Math.min(
                      currentPage * pageSize,
                      filteredBatches.length
                    )}{" "}
                    of {filteredBatches.length} batches
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
            </div>

            {/* Right side */}
            <div className="space-y-4 xl:col-span-12 2xl:col-span-4">
              <Panel title="Batch Distribution">
                <div className="flex flex-col items-center gap-5 sm:flex-row xl:flex-col">
                  <div
                    className="relative h-36 w-36 shrink-0 rounded-full"
                    style={{
                      background: `conic-gradient(${distribution
                        .map((item, index) => {
                          const previous = distribution
                            .slice(0, index)
                            .reduce(
                              (sum, entry) => sum + entry.count,
                              0
                            );

                          const start = totalCategories
                            ? (previous / totalCategories) * 100
                            : 0;

                          const end = totalCategories
                            ? ((previous + item.count) / totalCategories) *
                              100
                            : 0;

                          return `${item.color} ${start}% ${end}%`;
                        })
                        .join(", ")})`,
                    }}
                  >
                    <div className="absolute inset-7 flex flex-col items-center justify-center rounded-full bg-white dark:bg-[#211E27]">
                      <span className="text-2xl font-extrabold text-[#10265F] dark:text-white">
                        {batches.length}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-[#B0A5BD]">
                        Batches
                      </span>
                    </div>
                  </div>

                  <div className="w-full space-y-3">
                    {distribution.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between gap-3 text-xs"
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
                          {totalCategories
                            ? Math.round(
                                (item.count / totalCategories) * 100
                              )
                            : 0}
                          %)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>

              <Panel
                title="Recent Activity"
                action={
                  <span className="text-xs font-semibold text-blue-500">
                    Activity
                  </span>
                }
              >
                <div className="space-y-4">
                  {[
                    {
                      icon: Layers3,
                      title: "New batch created",
                      description: "Crash Course Sep",
                      time: "2 hours ago",
                      color:
                        "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400",
                    },
                    {
                      icon: Users,
                      title: "Students added to batch",
                      description: "IELTS Pro Batch B",
                      time: "4 hours ago",
                      color:
                        "bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400",
                    },
                    {
                      icon: BookOpen,
                      title: "Batch assignment created",
                      description: "Writing Task 2 Practice",
                      time: "6 hours ago",
                      color:
                        "bg-purple-50 text-purple-500 dark:bg-purple-500/10 dark:text-purple-400",
                    },
                    {
                      icon: TrendingUp,
                      title: "Batch progress updated",
                      description: "Foundation Batch A",
                      time: "8 hours ago",
                      color:
                        "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400",
                    },
                  ].map((activity) => (
                    <div
                      key={activity.title}
                      className="flex items-start gap-3"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${activity.color}`}
                      >
                        <activity.icon size={19} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#10265F] dark:text-slate-100">
                          {activity.title}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-500 dark:text-[#B0A5BD]">
                          {activity.description}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400 dark:text-[#91899B]">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Upcoming Batch Deadlines">
                <div className="space-y-4">
                  {batches
                    .filter((batch) => batch.status === "Active")
                    .slice(0, 3)
                    .map((batch, index) => (
                      <div
                        key={batch.id}
                        className="flex items-start gap-3"
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            avatarColors[index % avatarColors.length]
                          }`}
                        >
                          <CalendarDays size={19} />
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#10265F] dark:text-slate-100">
                            {batch.name}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-500 dark:text-[#B0A5BD]">
                            {batch.students} students
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-[10px] text-rose-500">
                            <Clock size={12} />
                            Ends {batch.end}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </Panel>

              <Panel title="Batch Summary">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-[#B0A5BD]">
                      Active batches
                    </span>
                    <span className="font-bold text-[#10265F] dark:text-slate-100">
                      {activeCount}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-[#3B3441]">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{
                        width: `${
                          batches.length
                            ? (activeCount / batches.length) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-[#B0A5BD]">
                      Completed batches
                    </span>
                    <span className="font-bold text-[#10265F] dark:text-slate-100">
                      {completedCount}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-[#3B3441]">
                    <div
                      className="h-full rounded-full bg-blue-400"
                      style={{
                        width: `${
                          batches.length
                            ? (completedCount / batches.length) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm dark:border-[#3B3441]">
                    <span className="text-slate-500 dark:text-[#B0A5BD]">
                      Total enrolled students
                    </span>
                    <span className="font-extrabold text-[#10265F] dark:text-white">
                      {totalStudents}
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
        />
      )}
    </div>
  );
}
