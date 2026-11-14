
import React, { useMemo, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar";
import {
  Users,
  UserRound,
  GraduationCap,
  UserX,
  Search,
  Upload,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  X,
} from "lucide-react";

const initialStudents = [
  {
    id: "S001",
    name: "Riya Sharma",
    email: "riya@gmail.com",
    phone: "+91 98765 43210",
    batch: "Batch A",
    trainers: ["AS", "PG"],
    joined: "12 Aug 2025",
    activity: "2 days ago",
    status: "Active",
    band: "7.5",
  },
  {
    id: "S002",
    name: "Aman Verma",
    email: "aman@gmail.com",
    phone: "+91 87654 32109",
    batch: "Batch B",
    trainers: ["PG"],
    joined: "10 Aug 2025",
    activity: "1 day ago",
    status: "Active",
    band: "6.0",
  },
  {
    id: "S003",
    name: "Sneha Patel",
    email: "sneha@gmail.com",
    phone: "+91 76543 21098",
    batch: "Batch A",
    trainers: ["RK", "AS"],
    joined: "08 Aug 2025",
    activity: "3 hours ago",
    status: "Active",
    band: "8.0",
  },
  {
    id: "S004",
    name: "Karan Singh",
    email: "karan@gmail.com",
    phone: "+91 65432 10987",
    batch: "Batch C",
    trainers: ["NS"],
    joined: "05 Aug 2025",
    activity: "5 days ago",
    status: "Active",
    band: "6.5",
  },
  {
    id: "S005",
    name: "Priya Mehta",
    email: "priya@gmail.com",
    phone: "+91 54321 09876",
    batch: "Batch B",
    trainers: ["VP", "PG", "AS"],
    joined: "01 Aug 2025",
    activity: "1 day ago",
    status: "Active",
    band: "7.0",
  },
  {
    id: "S006",
    name: "Rohit Kumar",
    email: "rohit@gmail.com",
    phone: "+91 43210 98765",
    batch: "Batch A",
    trainers: ["AS"],
    joined: "28 Jul 2025",
    activity: "1 week ago",
    status: "Inactive",
    band: "5.5",
  },
  {
    id: "S007",
    name: "Neha Singh",
    email: "neha@gmail.com",
    phone: "+91 32109 87654",
    batch: "Batch C",
    trainers: ["PG"],
    joined: "25 Jul 2025",
    activity: "2 days ago",
    status: "Active",
    band: "6.0",
  },
  {
    id: "S008",
    name: "Vikram Patel",
    email: "vikram@gmail.com",
    phone: "+91 21098 76543",
    batch: "Batch B",
    trainers: ["RK", "NS"],
    joined: "20 Jul 2025",
    activity: "3 hours ago",
    status: "Active",
    band: "7.0",
  },
];

const avatarColors = [
  "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
  "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
  "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
];

// Statistics Card
function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  trend = "up",
  subtitle = "from last month",
}) {
  const styles = {
    rose: {
      icon: "bg-rose-50 text-rose-500 dark:bg-rose-500/15 dark:text-rose-400",
      line: "#FF3864",
    },
    green: {
      icon: "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-400",
      line: "#08C99A",
    },
    purple: {
      icon: "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
      line: "#A044FF",
    },
    orange: {
      icon: "bg-orange-50 text-orange-500 dark:bg-orange-500/15 dark:text-orange-400",
      line: "#FF962E",
    },
  };

  const style = styles[color];

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${style.icon}`}
        >
          <Icon size={27} strokeWidth={2.4} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#10265F] dark:text-white">
            {title}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-[#10265F] dark:text-white">
              {value}
            </span>

            <span
              className={`flex items-center gap-0.5 text-xs font-bold ${
                trend === "down" ? "text-rose-500" : "text-emerald-500"
              }`}
            >
              {trend === "down" ? (
                <ArrowDownRight size={15} />
              ) : (
                <ArrowUpRight size={15} />
              )}
              {change}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-[#91899B]">
            {subtitle}
          </p>
        </div>
      </div>

      <svg
        viewBox="0 0 250 40"
        preserveAspectRatio="none"
        className="mt-3 h-9 w-full"
      >
        <defs>
          <linearGradient
            id={`fill-${color}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={style.line} stopOpacity=".2" />
            <stop offset="100%" stopColor={style.line} stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M0 33 C18 27 22 32 40 26 S68 10 86 17 S116 28 135 19 S164 23 185 12 S222 15 250 3 L250 40 L0 40 Z"
          fill={`url(#fill-${color})`}
        />

        <path
          d="M0 33 C18 27 22 32 40 26 S68 10 86 17 S116 28 135 19 S164 23 185 12 S222 15 250 3"
          fill="none"
          stroke={style.line}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </section>
  );
}

// Filter Select
function FilterSelect({ value, onChange, options, label }) {
  return (
    <div className="relative min-w-0">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-xs font-medium text-[#10265F] outline-none transition focus:border-pink-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white dark:focus:border-[#FF2454]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-3 text-slate-500 dark:text-[#91899B]"
      />
    </div>
  );
}

// Student Avatar
function StudentAvatar({ name, index }) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
        avatarColors[index % avatarColors.length]
      }`}
    >
      {name.charAt(0)}
    </span>
  );
}

// Add Student Modal
function AddStudentModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    batch: "Batch A",
    status: "Active",
  });

  const update = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) return;

    onAdd(form);
    onClose();
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#10265F] outline-none focus:border-pink-400 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white dark:placeholder:text-[#91899B]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <form
        onSubmit={submit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl transition-colors duration-300 dark:border dark:border-[#3B3441] dark:bg-[#211E27]"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#10265F] dark:text-white">
              Add Student
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-[#B0A5BD]">
              Enter the student's basic information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {[
            { label: "Full Name", name: "name", type: "text" },
            { label: "Email Address", name: "email", type: "email" },
            { label: "Phone Number", name: "phone", type: "tel" },
          ].map((field) => (
            <label key={field.name} className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#10265F] dark:text-[#E8E1ED]">
                {field.label}
              </span>

              <input
                required={field.name !== "phone"}
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={update}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className={inputClass}
              />
            </label>
          ))}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#10265F] dark:text-[#E8E1ED]">
              Batch
            </span>

            <select
              name="batch"
              value={form.batch}
              onChange={update}
              className={inputClass}
            >
              <option>Batch A</option>
              <option>Batch B</option>
              <option>Batch C</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-[#3B3441] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-[#FF2454] px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600"
          >
            Add Student
          </button>
        </div>
      </form>
    </div>
  );
}

// Main Students Page
export default function Students() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [batch, setBatch] = useState("All Batches");
  const [trainer, setTrainer] = useState("All Trainers");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selected, setSelected] = useState([]);
  const [notice, setNotice] = useState("");

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        [
          student.name,
          student.email,
          student.phone,
          student.id,
          student.batch,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesBatch =
        batch === "All Batches" || student.batch === batch;

      const matchesTrainer =
        trainer === "All Trainers" || student.trainers.includes(trainer);

      const matchesStatus =
        status === "All Status" || student.status === status;

      return (
        matchesSearch &&
        matchesBatch &&
        matchesTrainer &&
        matchesStatus
      );
    });
  }, [students, search, batch, trainer, status]);

  const pageSize = 8;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / pageSize)
  );
  const currentPage = Math.min(page, totalPages);

  const visibleStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const addStudent = (form) => {
    const newStudent = {
      ...form,
      id: `S${String(Date.now()).slice(-6)}`,
      trainers: [],
      joined: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      activity: "Just now",
      band: "—",
    };

    setStudents((previous) => [newStudent, ...previous]);
    setSearch("");
    setBatch("All Batches");
    setTrainer("All Trainers");
    setStatus("All Status");
    setPage(1);
    setNotice("Student added to the current demo list.");
  };

  const toggleAll = (checked) => {
    setSelected(
      checked ? visibleStudents.map((student) => student.id) : []
    );
  };

  const toggleOne = (id, checked) => {
    setSelected((previous) =>
      checked
        ? [...previous, id]
        : previous.filter((item) => item !== id)
    );
  };

  const exportStudents = () => {
    const headers = [
      "Student ID",
      "Name",
      "Email",
      "Phone",
      "Batch",
      "Status",
      "Band Score",
    ];

    const rows = filteredStudents.map((student) => [
      student.id,
      student.name,
      student.email,
      student.phone,
      student.batch,
      student.status,
      student.band,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "institute-students.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const inputClass =
    "w-full min-w-0 bg-transparent text-xs text-[#10265F] outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-[#91899B]";

  return (
  <div className="min-h-screen bg-[#F5F7FF] transition-colors duration-300 dark:bg-[#17151B]">
  <Sidebar />

  <div className="ml-[260px] flex min-h-screen min-w-0 flex-col">
    <Navbar />

        <main className="min-w-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto p-4 md:p-6">

          {/* Page Heading */}
          <section className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#6B7FA8] dark:text-[#B0A5BD]">
                Students <span className="mx-1">›</span> Manage Students
              </p>

              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#10265F] dark:text-white">
                Students{" "}
                <span className="text-[#FF2454]">Management</span>
              </h1>

              <p className="mt-2 text-sm text-[#7183A7] dark:text-[#91899B]">
                Add, manage and track all students of your institute.
                Assign trainers, batches and monitor their progress.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={exportStudents}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#10265F] shadow-sm transition hover:border-blue-200 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-white dark:hover:border-blue-400"
              >
                <Upload size={18} />
                Export Students
              </button>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
              >
                <Plus size={19} />
                Add Student
              </button>
            </div>
          </section>

          {/* Notification */}
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

          {/* Statistics */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            <StatCard
              title="Total Students"
              value="248"
              change="12%"
              icon={Users}
              color="rose"
            />

            <StatCard
              title="Active Students"
              value="212"
              change="8%"
              icon={UserRound}
              color="green"
            />

            <StatCard
              title="New Enrollments"
              value="36"
              change="20%"
              icon={GraduationCap}
              color="purple"
            />

            <StatCard
              title="Inactive Students"
              value="28"
              change="10%"
              icon={UserX}
              color="orange"
              trend="down"
            />
          </section>

          {/* Search and Filters */}
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-[#3B3441] dark:bg-[#211E27]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.8fr)_minmax(130px,0.8fr)_minmax(130px,0.8fr)_minmax(130px,0.8fr)_auto]">
              <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-pink-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:focus-within:border-[#FF2454]">
                <Search
                  size={18}
                  className="shrink-0 text-slate-400 dark:text-[#91899B]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by name, email, phone or ID..."
                  className={inputClass}
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={15} className="text-slate-400" />
                  </button>
                )}
              </div>

              <FilterSelect
                label="Filter by batch"
                value={batch}
                onChange={(value) => {
                  setBatch(value);
                  setPage(1);
                }}
                options={[
                  "All Batches",
                  "Batch A",
                  "Batch B",
                  "Batch C",
                ]}
              />

              <FilterSelect
                label="Filter by trainer"
                value={trainer}
                onChange={(value) => {
                  setTrainer(value);
                  setPage(1);
                }}
                options={[
                  "All Trainers",
                  "AS",
                  "PG",
                  "RK",
                  "NS",
                  "VP",
                ]}
              />

              <FilterSelect
                label="Filter by status"
                value={status}
                onChange={(value) => {
                  setStatus(value);
                  setPage(1);
                }}
                options={["All Status", "Active", "Inactive"]}
              />

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setBatch("All Batches");
                  setTrainer("All Trainers");
                  setStatus("All Status");
                  setPage(1);
                }}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-[#10265F] hover:bg-slate-50 dark:border-[#3B3441] dark:text-white dark:hover:bg-[#302A36]"
              >
                <SlidersHorizontal size={16} />
                Reset
              </button>
            </div>

            {/* Selected Row Actions */}
            {selected.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-rose-50 px-4 py-3 dark:border dark:border-rose-500/20 dark:bg-rose-500/10">
                <p className="text-sm font-semibold text-[#10265F] dark:text-white">
                  {selected.length} student(s) selected
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setStudents((previous) =>
                      previous.map((student) =>
                        selected.includes(student.id)
                          ? {
                              ...student,
                              status:
                                student.status === "Active"
                                  ? "Inactive"
                                  : "Active",
                            }
                          : student
                      )
                    );

                    setSelected([]);
                    setNotice(
                      "Selected students' statuses were toggled in the demo list."
                    );
                  }}
                  className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-[#211E27] dark:hover:bg-rose-500/10"
                >
                  Toggle Status
                </button>
              </div>
            )}

            {/* Student Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-semibold text-[#62769C] dark:bg-[#19171E] dark:text-[#B0A5BD]">
                    <th className="w-10 rounded-l-lg px-3 py-3">
                      <input
                        type="checkbox"
                        checked={
                          visibleStudents.length > 0 &&
                          visibleStudents.every((student) =>
                            selected.includes(student.id)
                          )
                        }
                        onChange={(event) =>
                          toggleAll(event.target.checked)
                        }
                        aria-label="Select all visible students"
                        className="h-4 w-4 accent-rose-500"
                      />
                    </th>

                    <th className="px-3 py-3">#</th>
                    <th className="px-3 py-3">Student</th>
                    <th className="px-3 py-3">Email / Phone</th>
                    <th className="px-3 py-3">Batch</th>
                    <th className="px-3 py-3">Trainer(s)</th>
                    <th className="px-3 py-3">Joined On</th>
                    <th className="px-3 py-3">Last Activity</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Overall Band</th>
                    <th className="rounded-r-lg px-3 py-3 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleStudents.map((student, index) => (
                    <tr
                      key={student.id}
                      className="border-b border-slate-100 text-xs transition hover:bg-slate-50/70 dark:border-[#3B3441] dark:hover:bg-[#302A36]/50"
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selected.includes(student.id)}
                          onChange={(event) =>
                            toggleOne(student.id, event.target.checked)
                          }
                          aria-label={`Select ${student.name}`}
                          className="h-4 w-4 accent-rose-500"
                        />
                      </td>

                      <td className="px-3 py-3 text-slate-400 dark:text-[#91899B]">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <StudentAvatar name={student.name} index={index} />

                          <div>
                            <p className="whitespace-nowrap font-bold text-[#10265F] dark:text-white">
                              {student.name}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-400 dark:text-[#91899B]">
                              ID: {student.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3">
                        <p className="whitespace-nowrap text-[#506995] dark:text-[#B0A5BD]">
                          {student.email}
                        </p>

                        <p className="mt-1 whitespace-nowrap text-slate-400 dark:text-[#91899B]">
                          {student.phone || "—"}
                        </p>
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                            student.batch === "Batch A"
                              ? "bg-rose-50 text-rose-500 dark:bg-rose-500/15 dark:text-rose-400"
                              : student.batch === "Batch B"
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
                              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                          }`}
                        >
                          {student.batch}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          {student.trainers.slice(0, 2).map((initial, trainerIndex) => (
                            <span
                              key={`${student.id}-${initial}-${trainerIndex}`}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-600 dark:bg-purple-500/15 dark:text-purple-400"
                            >
                              {initial}
                            </span>
                          ))}

                          {student.trainers.length > 2 && (
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-600 dark:bg-[#302A36] dark:text-[#B0A5BD]">
                              +{student.trainers.length - 2}
                            </span>
                          )}

                          {student.trainers.length === 0 && (
                            <span className="text-slate-400 dark:text-[#91899B]">
                              Unassigned
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-3 py-3 text-slate-500 dark:text-[#B0A5BD]">
                        {student.joined}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3 text-slate-500 dark:text-[#B0A5BD]">
                        {student.activity}
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                            student.status === "Active"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-500 dark:bg-rose-500/15 dark:text-rose-400"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                            student.band !== "—" &&
                            Number(student.band) < 6
                              ? "bg-rose-50 text-rose-500 dark:bg-rose-500/15 dark:text-rose-400"
                              : "bg-blue-50 text-[#10265F] dark:bg-blue-500/15 dark:text-blue-400"
                          }`}
                        >
                          {student.band}
                        </span>
                      </td>

                      <td className="relative px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenu(
                              activeMenu === student.id ? null : student.id
                            )
                          }
                          aria-label={`Actions for ${student.name}`}
                          className="rounded-lg p-2 text-[#506995] hover:bg-slate-100 dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
                        >
                          <MoreVertical size={17} />
                        </button>

                        {activeMenu === student.id && (
                          <div className="absolute right-8 top-10 z-20 w-36 rounded-xl border border-slate-100 bg-white p-1 text-left shadow-xl dark:border-[#3B3441] dark:bg-[#211E27]">
                            <button
                              type="button"
                              onClick={() => {
                                setNotice(
                                  `${student.name}: ${student.email}, ${student.batch}, ${student.status}`
                                );
                                setActiveMenu(null);
                              }}
                              className="block w-full rounded-lg px-3 py-2 text-xs text-[#10265F] hover:bg-slate-50 dark:text-white dark:hover:bg-[#302A36]"
                            >
                              View Details
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setStudents((previous) =>
                                  previous.map((item) =>
                                    item.id === student.id
                                      ? {
                                          ...item,
                                          status:
                                            item.status === "Active"
                                              ? "Inactive"
                                              : "Active",
                                        }
                                      : item
                                  )
                                );

                                setActiveMenu(null);
                              }}
                              className="block w-full rounded-lg px-3 py-2 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                            >
                              Toggle Status
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  {visibleStudents.length === 0 && (
                    <tr>
                      <td
                        colSpan="11"
                        className="px-4 py-12 text-center"
                      >
                        <Users
                          size={30}
                          className="mx-auto mb-3 text-slate-300 dark:text-[#554D5D]"
                        />

                        <p className="font-semibold text-[#10265F] dark:text-white">
                          No students found
                        </p>

                        <p className="mt-1 text-xs text-slate-400 dark:text-[#91899B]">
                          Try changing your search or filters.
                        </p>
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
                {filteredStudents.length === 0
                  ? 0
                  : (currentPage - 1) * pageSize + 1}
                {" "}to{" "}
                {Math.min(
                  currentPage * pageSize,
                  filteredStudents.length
                )}
                {" "}of {filteredStudents.length} students
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setPage((value) => Math.max(1, value - 1))
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-[#3B3441] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={17} />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                )
                  .slice(0, 5)
                  .map((number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() => setPage(number)}
                      className={`h-9 min-w-9 rounded-lg border px-2 text-xs font-semibold ${
                        currentPage === number
                          ? "border-[#FF2454] bg-[#FF2454] text-white"
                          : "border-slate-200 text-[#506995] hover:bg-slate-50 dark:border-[#3B3441] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                {totalPages > 5 && (
                  <>
                    <span className="px-1 text-slate-400">...</span>

                    <button
                      type="button"
                      onClick={() => setPage(totalPages)}
                      className={`h-9 min-w-9 rounded-lg border px-2 text-xs ${
                        currentPage === totalPages
                          ? "border-[#FF2454] bg-[#FF2454] text-white"
                          : "border-slate-200 text-[#506995] dark:border-[#3B3441] dark:text-[#B0A5BD]"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setPage((value) =>
                      Math.min(totalPages, value + 1)
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-[#3B3441] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
                  aria-label="Next page"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </section>

          <footer className="pb-2 text-center text-xs text-slate-400 dark:text-[#91899B]">
            Equilx IELTS · Institute Admin Portal
          </footer>
        </main>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <AddStudentModal
          onClose={() => setShowModal(false)}
          onAdd={addStudent}
        />
      )}
    </div>
  );
}
