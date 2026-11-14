
import React, { useMemo, useState } from "react";
import {
  Plus,
  Search,
  ClipboardList,
  BookOpen,
  FileText,
  Users,
  Clock,
  CheckCircle2,
  CalendarDays,
  X,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Trash2,
  Filter,
  Target,
  Layers,
  Send,
  AlertCircle,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const initialAssignments = [
  {
    id: 1,
    title: "IELTS Reading Mock Test 01",
    type: "Mock Test",
    target: "Morning Batch",
    dueDate: "2026-10-30",
    assignedDate: "2026-10-24",
    students: 18,
    completed: 12,
    status: "In Progress",
    description: "Complete all three reading passages within 60 minutes.",
  },
  {
    id: 2,
    title: "Writing Task 2 - Essay Practice",
    type: "Practice Test",
    target: "All Students",
    dueDate: "2026-10-29",
    assignedDate: "2026-10-25",
    students: 56,
    completed: 34,
    status: "In Progress",
    description: "Write an essay of at least 250 words.",
  },
  {
    id: 3,
    title: "IELTS Listening Practice Set",
    type: "Practice Test",
    target: "Evening Batch",
    dueDate: "2026-11-02",
    assignedDate: "2026-10-26",
    students: 20,
    completed: 20,
    status: "Completed",
    description: "Complete the four listening sections.",
  },
  {
    id: 4,
    title: "IELTS Speaking Preparation Guide",
    type: "Study Material",
    target: "Weekend Batch",
    dueDate: "2026-11-05",
    assignedDate: "2026-10-27",
    students: 18,
    completed: 5,
    status: "In Progress",
    description: "Review the speaking guide before your next session.",
  },
  {
    id: 5,
    title: "Full IELTS Mock Test 02",
    type: "Mock Test",
    target: "Aarav Sharma",
    dueDate: "2026-10-28",
    assignedDate: "2026-10-23",
    students: 1,
    completed: 0,
    status: "Overdue",
    description: "Complete the full IELTS mock test.",
  },
];

const initialBatches = [
  "Morning Batch",
  "Evening Batch",
  "Weekend Batch",
];

const assignmentTypes = ["Mock Test", "Practice Test", "Study Material"];

const typeStyles = {
  "Mock Test":
    "bg-violet-50 text-violet-700 dark:bg-[#30263d] dark:text-violet-300",
  "Practice Test":
    "bg-blue-50 text-blue-700 dark:bg-[#202b3b] dark:text-blue-300",
  "Study Material":
    "bg-orange-50 text-orange-700 dark:bg-[#3b3020] dark:text-orange-300",
};

const inputClass =
  "w-full rounded-xl border border-gray-200 dark:border-[#3b3441] bg-white dark:bg-[#19171e] px-3.5 py-3 text-sm text-gray-700 dark:text-white outline-none transition placeholder:text-gray-400 dark:placeholder:text-[#91899b] focus:border-blue-400 focus:ring-2 focus:ring-blue-50 dark:focus:ring-[#202b3b]";

const today = new Date().toLocaleDateString("en-CA");

export default function Assignments() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [batches] = useState(initialBatches);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    type: "Mock Test",
    targetType: "Batch",
    target: "Morning Batch",
    dueDate: "",
    description: "",
  });

  const getStatus = (assignment) => {
    if (assignment.completed >= assignment.students) return "Completed";
    if (assignment.dueDate < today) return "Overdue";
    return "In Progress";
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        assignment.title.toLowerCase().includes(query) ||
        assignment.target.toLowerCase().includes(query) ||
        assignment.type.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "All Types" || assignment.type === typeFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        getStatus(assignment) === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [assignments, search, typeFilter, statusFilter]);

  const totalAssigned = assignments.reduce(
    (total, item) => total + item.students,
    0
  );

  const totalCompleted = assignments.reduce(
    (total, item) => total + item.completed,
    0
  );

  const completedCount = assignments.filter(
    (item) => getStatus(item) === "Completed"
  ).length;

  const overdueCount = assignments.filter(
    (item) => getStatus(item) === "Overdue"
  ).length;

  const updateForm = (event) => {
    const { name, value } = event.target;

    setForm((previous) => {
      const next = { ...previous, [name]: value };

      if (name === "targetType") {
        next.target =
          value === "Batch"
            ? batches[0]
            : value === "All Students"
              ? "All Students"
              : "";
      }

      return next;
    });

    setError("");
    setSuccess("");
  };

  const handleCreateAssignment = (event) => {
    event.preventDefault();

    const title = form.title.trim();

    if (!title || !form.dueDate || !form.target) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.dueDate < today) {
      setError("Due date cannot be in the past.");
      return;
    }

    let target = form.target;
    let studentCount = 1;

    if (form.targetType === "All Students") {
      target = "All Students";
      studentCount = 56;
    } else if (form.targetType === "Batch") {
      studentCount =
        target === "Morning Batch"
          ? 18
          : target === "Evening Batch"
            ? 20
            : 18;
    }

    const newAssignment = {
      id: Date.now(),
      title,
      type: form.type,
      target,
      dueDate: form.dueDate,
      assignedDate: today,
      students: studentCount,
      completed: 0,
      status: "In Progress",
      description: form.description.trim(),
    };

    setAssignments((previous) => [newAssignment, ...previous]);
    setSearch("");
    setTypeFilter("All Types");
    setStatusFilter("All Status");
    setForm({
      title: "",
      type: "Mock Test",
      targetType: "Batch",
      target: batches[0],
      dueDate: "",
      description: "",
    });
    setError("");
    setSuccess("Assignment added to the demo list.");
    setShowModal(false);
  };

  const removeAssignment = (id) => {
    if (!window.confirm("Remove this assignment from the demo list?")) return;

    setAssignments((previous) =>
      previous.filter((assignment) => assignment.id !== id)
    );

    setMenuId(null);

    if (selectedAssignment?.id === id) {
      setSelectedAssignment(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FF] text-[#10265F] transition-colors duration-300 dark:bg-[#17151B] dark:text-white">
      <Sidebar />

      <div className="min-w-0 lg:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Page heading */}
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm text-gray-500 dark:text-[#b0a5bd]">
                Trainer Portal / Assignments & Batches
              </p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Assignments & Batches
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-[#b0a5bd]">
                Assign mock tests, practice tests and study materials to
                individual students, batches or all students.
              </p>
            </div>

            <button
              onClick={() => {
                setError("");
                setSuccess("");
                setForm({
                  title: "",
                  type: "Mock Test",
                  targetType: "Batch",
                  target: batches[0],
                  dueDate: "",
                  description: "",
                });
                setShowModal(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e91d49]"
            >
              <Plus size={19} />
              Create Assignment
            </button>
          </section>

          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-[#315b48] dark:bg-[#1f352e] dark:text-emerald-300">
              <CheckCircle2 size={18} />
              {success}
              <button
                onClick={() => setSuccess("")}
                className="ml-auto"
                aria-label="Dismiss message"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Summary cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Assignments"
              value={assignments.length}
              subtitle="Created in this demo"
              icon={<ClipboardList size={22} />}
              color="blue"
            />

            <StatCard
              title="Students Assigned"
              value={totalAssigned}
              subtitle="Across listed assignments"
              icon={<Users size={22} />}
              color="purple"
            />

            <StatCard
              title="Completed Submissions"
              value={totalCompleted}
              subtitle={`${completedCount} assignments fully completed`}
              icon={<CheckCircle2 size={22} />}
              color="green"
            />

            <StatCard
              title="Overdue"
              value={overdueCount}
              subtitle="Past due date and incomplete"
              icon={<Clock size={22} />}
              color="orange"
            />
          </section>

          {/* Assignment type cards */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-bold">Assignment Categories</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-[#b0a5bd]">
                Select a category to filter the assignment list.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {assignmentTypes.map((type) => {
                const count = assignments.filter(
                  (item) => item.type === type
                ).length;

                const icon =
                  type === "Mock Test" ? (
                    <Target size={23} />
                  ) : type === "Practice Test" ? (
                    <ClipboardList size={23} />
                  ) : (
                    <BookOpen size={23} />
                  );

                const iconColor =
                  type === "Mock Test"
                    ? "bg-violet-50 text-violet-600 dark:bg-[#30263d] dark:text-violet-300"
                    : type === "Practice Test"
                      ? "bg-blue-50 text-blue-600 dark:bg-[#202b3b] dark:text-blue-300"
                      : "bg-orange-50 text-orange-600 dark:bg-[#3b3020] dark:text-orange-300";

                return (
                  <button
                    key={type}
                    onClick={() => {
                      setTypeFilter(typeFilter === type ? "All Types" : type);
                      document
                        .getElementById("assignment-list")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`rounded-2xl border bg-white dark:bg-[#211e27] p-5 text-left shadow-sm transition hover:shadow-md dark:hover:bg-[#28242e] ${
                      typeFilter === type
                        ? "border-[#FF2454] ring-2 ring-pink-50 dark:ring-[#49303d]"
                        : "border-gray-100 dark:border-[#3b3441]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconColor}`}
                      >
                        {icon}
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${typeStyles[type]}`}
                      >
                        {count} {count === 1 ? "assignment" : "assignments"}
                      </span>
                    </div>

                    <h3 className="mt-4 font-bold">{type}</h3>

                    <p className="mt-1 text-sm text-gray-500 dark:text-[#b0a5bd]">
                      {type === "Mock Test"
                        ? "Full-length IELTS assessments"
                        : type === "Practice Test"
                          ? "Skill-wise practice activities"
                          : "Guides, notes and learning resources"}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Assignment table */}
          <section
            id="assignment-list"
            className="overflow-hidden rounded-2xl border border-gray-100 dark:border-[#3b3441] bg-white dark:bg-[#211e27] shadow-sm"
          >
            <div className="border-b border-gray-100 dark:border-[#3b3441] p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-bold">All Assignments</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-[#b0a5bd]">
                  Monitor deadlines and student completion.
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 xl:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#91899b]"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search assignments or recipients..."
                    className={`${inputClass} bg-gray-50 dark:bg-[#19171e] pl-10`}
                  />
                </div>

                <div className="relative">
                  <Filter
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#91899b]"
                  />
                  <select
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value)}
                    className={`${inputClass} appearance-none pl-9 pr-9 sm:min-w-[180px]`}
                  >
                    <option>All Types</option>
                    {assignmentTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#91899b]"
                  />
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className={`${inputClass} appearance-none pr-9 sm:min-w-[155px]`}
                  >
                    <option>All Status</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Overdue</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#91899b]"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-gray-50 dark:bg-[#302b37]">
                  <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-[#b0a5bd]">
                    <th className="px-5 py-4">Assignment</th>
                    <th className="px-5 py-4">Assigned To</th>
                    <th className="px-5 py-4">Due Date</th>
                    <th className="px-5 py-4">Submissions</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-[#3b3441]">
                  {filteredAssignments.map((assignment) => {
                    const status = getStatus(assignment);
                    const progress = assignment.students
                      ? Math.round(
                          (assignment.completed / assignment.students) * 100
                        )
                      : 0;

                    return (
                      <tr
                        key={assignment.id}
                        className="transition hover:bg-gray-50/70 dark:hover:bg-[#302b37]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-[#202b3b] dark:text-blue-300">
                              {assignment.type === "Study Material" ? (
                                <BookOpen size={20} />
                              ) : (
                                <FileText size={20} />
                              )}
                            </div>

                            <div className="max-w-[270px]">
                              <p className="font-semibold text-[#10265F] dark:text-white">
                                {assignment.title}
                              </p>
                              <span
                                className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${typeStyles[assignment.type]}`}
                              >
                                {assignment.type}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Users
                              size={16}
                              className="text-gray-400 dark:text-[#91899b]"
                            />
                            <div>
                              <p className="text-sm font-medium">
                                {assignment.target}
                              </p>
                              <p className="mt-1 text-xs text-gray-400 dark:text-[#91899b]">
                                {assignment.students} students
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <CalendarDays
                              size={16}
                              className={
                                status === "Overdue"
                                  ? "text-red-500"
                                  : "text-gray-400 dark:text-[#91899b]"
                              }
                            />
                            <span
                              className={`text-sm ${
                                status === "Overdue"
                                  ? "font-semibold text-red-600 dark:text-red-400"
                                  : "text-gray-600 dark:text-[#b0a5bd]"
                              }`}
                            >
                              {new Date(
                                `${assignment.dueDate}T12:00:00`
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="w-32">
                            <div className="mb-2 flex justify-between gap-2 text-xs">
                              <span className="font-semibold text-[#10265F] dark:text-white">
                                {assignment.completed}/{assignment.students}
                              </span>
                              <span className="text-gray-400 dark:text-[#91899b]">
                                {progress}%
                              </span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-[#393441]">
                              <div
                                className={`h-full rounded-full ${
                                  status === "Completed"
                                    ? "bg-emerald-500"
                                    : "bg-[#FF2454]"
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={status} />
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="relative inline-block">
                            <button
                              onClick={() =>
                                setMenuId(
                                  menuId === assignment.id
                                    ? null
                                    : assignment.id
                                )
                              }
                              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-[#10265F] dark:text-[#91899b] dark:hover:bg-[#393441] dark:hover:text-white"
                              aria-label="Assignment actions"
                            >
                              <MoreHorizontal size={20} />
                            </button>

                            {menuId === assignment.id && (
                              <div className="absolute right-0 top-10 z-20 w-44 rounded-xl border border-gray-100 dark:border-[#3b3441] bg-white dark:bg-[#211e27] p-1.5 text-left shadow-xl">
                                <button
                                  onClick={() => {
                                    setSelectedAssignment(assignment);
                                    setMenuId(null);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-[#302b37]"
                                >
                                  <Eye size={16} />
                                  View Details
                                </button>
                                <button
                                  onClick={() =>
                                    removeAssignment(assignment.id)
                                  }
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-[#39232f]"
                                >
                                  <Trash2 size={16} />
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredAssignments.length === 0 && (
              <div className="px-6 py-14 text-center">
                <ClipboardList
                  size={34}
                  className="mx-auto text-gray-300 dark:text-[#625a6c]"
                />
                <h3 className="mt-3 font-semibold">No assignments found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-[#b0a5bd]">
                  Try changing your search or filters.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setTypeFilter("All Types");
                    setStatusFilter("All Status");
                  }}
                  className="mt-3 text-sm font-semibold text-[#FF2454]"
                >
                  Clear Filters
                </button>
              </div>
            )}

            <div className="flex flex-col gap-2 border-t border-gray-100 dark:border-[#3b3441] px-5 py-4 text-sm text-gray-500 dark:text-[#b0a5bd] sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {filteredAssignments.length} of {assignments.length}{" "}
                assignments
              </span>
              <span className="text-xs text-gray-400 dark:text-[#91899b]">
                Demo data · Backend integration pending
              </span>
            </div>
          </section>

          {/* Batch overview */}
          <section className="rounded-2xl border border-gray-100 dark:border-[#3b3441] bg-white dark:bg-[#211e27] p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-[#202b3b] dark:text-blue-300">
                <Layers size={22} />
              </div>
              <div>
                <h2 className="font-bold">Batch Assignment Overview</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-[#b0a5bd]">
                  Quick view of the learning groups available to your trainer
                  account.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {batches.map((batch, index) => {
                const count = assignments.filter(
                  (item) => item.target === batch
                ).length;

                return (
                  <div
                    key={batch}
                    className="rounded-xl border border-gray-100 dark:border-[#3b3441] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{batch}</p>
                      <span className="rounded-lg bg-gray-50 dark:bg-[#302b37] px-2.5 py-1 text-xs text-gray-500 dark:text-[#b0a5bd]">
                        {count} assignments
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-[#b0a5bd]">
                      {index === 0
                        ? "Morning learning group"
                        : index === 1
                          ? "Evening learning group"
                          : "Weekend learning group"}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      {/* Create Assignment Modal */}
      {showModal && (
        <Modal title="Create Assignment" onClose={closeModal}>
          <p className="mb-5 text-sm leading-6 text-gray-500 dark:text-[#b0a5bd]">
            Choose learning content, select recipients and set a deadline.
          </p>

          <form onSubmit={handleCreateAssignment} className="space-y-4">
            <Field label="Assignment Title" required>
              <input
                name="title"
                value={form.title}
                onChange={updateForm}
                placeholder="e.g. IELTS Reading Mock Test 03"
                required
                className={inputClass}
              />
            </Field>

            <Field label="Assignment Type" required>
              <select
                name="type"
                value={form.type}
                onChange={updateForm}
                required
                className={inputClass}
              >
                {assignmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Assign To" required>
              <select
                name="targetType"
                value={form.targetType}
                onChange={updateForm}
                className={inputClass}
              >
                <option value="Student">Individual Student</option>
                <option value="Batch">Entire Batch</option>
                <option value="All Students">All Students</option>
              </select>
            </Field>

            {form.targetType === "Batch" && (
              <Field label="Select Batch" required>
                <select
                  name="target"
                  value={form.target}
                  onChange={updateForm}
                  required
                  className={inputClass}
                >
                  {batches.map((batch) => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            {form.targetType === "Student" && (
              <Field label="Select Student" required>
                <select
                  name="target"
                  value={form.target}
                  onChange={updateForm}
                  required
                  className={inputClass}
                >
                  <option value="">Select a student</option>
                  {[
                    "Aarav Sharma",
                    "Priya Verma",
                    "Rahul Meena",
                    "Sneha Gupta",
                    "Rohan Singh",
                    "Ananya Joshi",
                  ].map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            {form.targetType === "All Students" && (
              <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-3.5 text-sm text-blue-800 dark:bg-[#202b3b] dark:text-blue-300">
                <Users size={19} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">All students selected</p>
                  <p className="mt-1 text-blue-700 dark:text-blue-300">
                    The assignment will target all students in this demo.
                  </p>
                </div>
              </div>
            )}

            <Field label="Due Date" required>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={updateForm}
                min={today}
                required
                className={inputClass}
              />
            </Field>

            <Field label="Instructions">
              <textarea
                name="description"
                value={form.description}
                onChange={updateForm}
                rows={3}
                placeholder="Add instructions for students..."
                className={`${inputClass} resize-y`}
              />
            </Field>

            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-[#39232f] dark:text-red-300">
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 rounded-xl border border-gray-200 dark:border-[#3b3441] px-4 py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-[#302b37]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-semibold text-white hover:bg-[#e91d49]"
              >
                <Send size={17} />
                Assign
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Assignment Details Modal */}
      {selectedAssignment && (
        <Modal
          title="Assignment Details"
          onClose={() => setSelectedAssignment(null)}
        >
          <div className="rounded-xl bg-gray-50 dark:bg-[#302b37] p-4">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${typeStyles[selectedAssignment.type]}`}
            >
              {selectedAssignment.type}
            </span>
            <h3 className="mt-3 text-lg font-bold">
              {selectedAssignment.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-[#b0a5bd]">
              {selectedAssignment.description || "No instructions provided."}
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <DetailRow
              icon={<Users size={17} />}
              label="Assigned To"
              value={selectedAssignment.target}
            />
            <DetailRow
              icon={<CalendarDays size={17} />}
              label="Due Date"
              value={selectedAssignment.dueDate}
            />
            <DetailRow
              icon={<Clock size={17} />}
              label="Assigned Date"
              value={selectedAssignment.assignedDate}
            />
            <DetailRow
              icon={<CheckCircle2 size={17} />}
              label="Submissions"
              value={`${selectedAssignment.completed} of ${selectedAssignment.students}`}
            />
            <DetailRow
              icon={<ClipboardList size={17} />}
              label="Status"
              value={getStatus(selectedAssignment)}
            />
          </div>

          <button
            onClick={() => setSelectedAssignment(null)}
            className="mt-6 w-full rounded-xl bg-[#10265F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#19377d] dark:bg-[#35466d] dark:hover:bg-[#425780]"
          >
            Close Details
          </button>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-[#202b3b] dark:text-blue-400",
    purple:
      "bg-purple-50 text-purple-600 dark:bg-[#30263d] dark:text-purple-400",
    green:
      "bg-emerald-50 text-emerald-600 dark:bg-[#1f352e] dark:text-emerald-400",
    orange:
      "bg-orange-50 text-orange-600 dark:bg-[#3b3020] dark:text-orange-400",
  };

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-[#3b3441] bg-white dark:bg-[#211e27] p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-[#b0a5bd]">
            {title}
          </p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight">{value}</h3>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-400 dark:text-[#91899b]">
        {subtitle}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Completed:
      "bg-emerald-50 text-emerald-700 dark:bg-[#1f352e] dark:text-emerald-300",
    "In Progress":
      "bg-blue-50 text-blue-700 dark:bg-[#202b3b] dark:text-blue-300",
    Overdue: "bg-red-50 text-red-700 dark:bg-[#39232f] dark:text-red-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${styles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "Completed"
            ? "bg-emerald-500"
            : status === "Overdue"
              ? "bg-red-500"
              : "bg-blue-500"
        }`}
      />
      {status}
    </span>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#10265F] dark:text-white">
        {label}
        {required && <span className="ml-1 text-[#FF2454]">*</span>}
      </label>
      {children}
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400 dark:text-[#91899b]">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400 dark:text-[#91899b]">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-[#10265F] dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#0B1739]/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="my-auto max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white dark:bg-[#211e27] p-5 shadow-2xl sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-[#10265F] dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:text-[#91899b] dark:hover:bg-[#393441] dark:hover:text-white"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
