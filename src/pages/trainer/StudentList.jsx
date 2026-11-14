import React, { useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Mail,
  Phone,
  Layers,
  Clock,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  X,
  GraduationCap,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const initialStudents = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    batch: "Morning Batch",
    progress: 78,
    assignments: 12,
    completed: 9,
    lastActive: "Today",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Verma",
    email: "priya.verma@example.com",
    phone: "+91 98765 43211",
    batch: "Evening Batch",
    progress: 92,
    assignments: 15,
    completed: 14,
    lastActive: "Today",
    status: "Active",
  },
  {
    id: 3,
    name: "Rahul Meena",
    email: "rahul.meena@example.com",
    phone: "+91 98765 43212",
    batch: "Weekend Batch",
    progress: 42,
    assignments: 10,
    completed: 4,
    lastActive: "Yesterday",
    status: "Active",
  },
  {
    id: 4,
    name: "Sneha Gupta",
    email: "sneha.gupta@example.com",
    phone: "+91 98765 43213",
    batch: "Morning Batch",
    progress: 86,
    assignments: 14,
    completed: 12,
    lastActive: "Today",
    status: "Active",
  },
  {
    id: 5,
    name: "Rohan Singh",
    email: "rohan.singh@example.com",
    phone: "+91 98765 43214",
    batch: "Evening Batch",
    progress: 25,
    assignments: 8,
    completed: 2,
    lastActive: "3 days ago",
    status: "Inactive",
  },
  {
    id: 6,
    name: "Ananya Joshi",
    email: "ananya.joshi@example.com",
    phone: "+91 98765 43215",
    batch: "Weekend Batch",
    progress: 65,
    assignments: 11,
    completed: 7,
    lastActive: "Yesterday",
    status: "Active",
  },
];

const batchColors = [
  "bg-blue-50 text-blue-700 dark:bg-[#202b3b] dark:text-blue-300",
  "bg-purple-50 text-purple-700 dark:bg-[#30263d] dark:text-purple-300",
  "bg-orange-50 text-orange-700 dark:bg-[#3b3020] dark:text-orange-300",
];

const inputClass =
  "w-full rounded-xl border border-gray-200 dark:border-[#3b3441] bg-white dark:bg-[#19171e] dark:text-white dark:placeholder:text-[#91899b] px-3.5 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50 dark:focus:ring-[#202b3b]";

export default function StudentList() {
  const [students, setStudents] = useState(initialStudents);
  const [batches, setBatches] = useState([
    { name: "Morning Batch", schedule: "9:00 AM – 11:00 AM" },
    { name: "Evening Batch", schedule: "5:00 PM – 7:00 PM" },
    { name: "Weekend Batch", schedule: "Saturday – Sunday" },
  ]);

  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("All Batches");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showAdd, setShowAdd] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    batch: "Morning Batch",
  });

  const [batchForm, setBatchForm] = useState({
    name: "",
    schedule: "",
  });

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.phone.includes(query);

      const matchesBatch =
        batchFilter === "All Batches" || student.batch === batchFilter;

      const matchesStatus =
        statusFilter === "All Status" || student.status === statusFilter;

      return matchesSearch && matchesBatch && matchesStatus;
    });
  }, [students, search, batchFilter, statusFilter]);

  const activeCount = students.filter(
    (student) => student.status === "Active"
  ).length;

  const averageProgress = students.length
    ? Math.round(
        students.reduce((total, student) => total + student.progress, 0) /
          students.length
      )
    : 0;

  const updateForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError("");
  };

  const addStudent = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();

    if (!name || (!email && !phone) || !form.batch) {
      setError("Name, email or phone, and batch are required.");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (
      email &&
      students.some(
        (student) =>
          student.email.toLowerCase() === email &&
          student.email !== "Not provided"
      )
    ) {
      setError("This email address is already in the student list.");
      return;
    }

    if (
      phone &&
      students.some(
        (student) =>
          student.phone === phone && student.phone !== "Not provided"
      )
    ) {
      setError("This phone number is already in the student list.");
      return;
    }

    const student = {
      id: Date.now(),
      name,
      email: email || "Not provided",
      phone: phone || "Not provided",
      batch: form.batch,
      progress: 0,
      assignments: 0,
      completed: 0,
      lastActive: "Not active yet",
      status: "Active",
    };

    setStudents((previous) => [student, ...previous]);
    setSearch("");
    setBatchFilter("All Batches");
    setStatusFilter("All Status");
    setForm({
      name: "",
      email: "",
      phone: "",
      batch: batches[0]?.name || "",
    });
    setError("");
    setShowAdd(false);
  };

  const addBatch = (event) => {
    event.preventDefault();

    const name = batchForm.name.trim();
    const schedule = batchForm.schedule.trim();

    if (!name || !schedule) {
      setError("Please enter a batch name and schedule.");
      return;
    }

    if (batches.some((batch) => batch.name.toLowerCase() === name.toLowerCase())) {
      setError("This batch already exists.");
      return;
    }

    setBatches((previous) => [...previous, { name, schedule }]);
    setBatchForm({ name: "", schedule: "" });
    setError("");
    setShowBatch(false);
  };

  const removeStudent = (id) => {
    if (!window.confirm("Remove this student from the demo list?")) return;

    setStudents((previous) => previous.filter((student) => student.id !== id));
    setMenuId(null);

    if (selectedStudent?.id === id) {
      setSelectedStudent(null);
    }
  };

  const closeModals = () => {
    setShowAdd(false);
    setShowBatch(false);
    setSelectedStudent(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FF] text-[#10265F] transition-colors duration-300 dark:bg-[#17151B] dark:text-white">
      <Sidebar />

      <div className="min-w-0 lg:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Heading */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm text-gray-500 dark:text-[#b0a5bd]">
                Trainer Portal / Student Management
              </p>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Student List & Details
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-[#b0a5bd]">
                Add students by email or phone and organize them into batches.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setError("");
                  setShowBatch(true);
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-[#3b3441] bg-white dark:bg-[#211e27] px-4 py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-[#302b37]"
              >
                <Layers size={18} />
                Manage Batches
              </button>

              <button
                onClick={() => {
                  setForm({
                    name: "",
                    email: "",
                    phone: "",
                    batch: batches[0]?.name || "",
                  });
                  setError("");
                  setShowAdd(true);
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white hover:bg-[#e91d49]"
              >
                <UserPlus size={18} />
                Add Student
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Students"
              value={students.length}
              caption="Students in your list"
              icon={<Users size={22} />}
              color="blue"
            />
            <StatCard
              title="Active Students"
              value={activeCount}
              caption="Currently active"
              icon={<CheckCircle2 size={22} />}
              color="green"
            />
            <StatCard
              title="Total Batches"
              value={batches.length}
              caption="Learning groups"
              icon={<Layers size={22} />}
              color="purple"
            />
            <StatCard
              title="Average Progress"
              value={`${averageProgress}%`}
              caption="Across all students"
              icon={<ArrowUpRight size={22} />}
              color="orange"
            />
          </div>

          {/* Batch cards */}
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Your Batches</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-[#b0a5bd]">
                  Select a batch to see its students.
                </p>
              </div>
              <button
                onClick={() => {
                  setError("");
                  setShowBatch(true);
                }}
                className="text-sm font-semibold text-[#FF2454] hover:underline"
              >
                + Create Batch
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {batches.map((batch, index) => {
                const count = students.filter(
                  (student) => student.batch === batch.name
                ).length;

                return (
                  <button
                    key={batch.name}
                    onClick={() => {
                      setBatchFilter(batch.name);
                      setStatusFilter("All Status");
                      document
                        .getElementById("students-table")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="rounded-2xl border border-gray-100 dark:border-[#3b3441] bg-white dark:bg-[#211e27] p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-[#202b3b] dark:text-blue-300">
                        <GraduationCap size={24} />
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          batchColors[index % batchColors.length]
                        }`}
                      >
                        {count} students
                      </span>
                    </div>
                    <h3 className="mt-4 font-bold">{batch.name}</h3>
                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-[#b0a5bd]">
                      <Clock size={15} />
                      {batch.schedule}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-[#3b3441] pt-4 text-sm">
                      <span className="text-gray-500 dark:text-[#b0a5bd]">
                        View students
                      </span>
                      <ArrowUpRight size={17} className="text-[#FF2454]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Student list */}
          <section
            id="students-table"
            className="overflow-hidden rounded-2xl border border-gray-100 dark:border-[#3b3441] bg-white dark:bg-[#211e27] shadow-sm"
          >
            <div className="border-b border-gray-100 dark:border-[#3b3441] p-5 sm:p-6">
              <h2 className="font-bold">All Students</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-[#b0a5bd]">
                Search, filter and manage your students.
              </p>

              <div className="mt-5 flex flex-col gap-3 xl:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#91899b]"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name, email or phone..."
                    className={`${inputClass} bg-gray-50 dark:bg-[#19171e] pl-10`}
                  />
                </div>

                <div className="relative">
                  <Filter
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#91899b]"
                  />
                  <select
                    value={batchFilter}
                    onChange={(event) => setBatchFilter(event.target.value)}
                    className={`${inputClass} appearance-none pl-9 pr-9 sm:min-w-[180px]`}
                  >
                    <option>All Batches</option>
                    {batches.map((batch) => (
                      <option key={batch.name}>{batch.name}</option>
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
                    className={`${inputClass} appearance-none pr-9 sm:min-w-[145px]`}
                  >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#91899b]"
                  />
                </div>
              </div>

              {batchFilter !== "All Batches" && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="text-gray-500 dark:text-[#b0a5bd]">
                    Batch:
                  </span>
                  <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-blue-700 dark:bg-[#202b3b] dark:text-blue-300">
                    {batchFilter}
                  </span>
                  <button
                    onClick={() => setBatchFilter("All Batches")}
                    className="font-semibold text-[#FF2454]"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-gray-50 dark:bg-[#302b37]">
                  <tr className="text-xs uppercase tracking-wider text-gray-500 dark:text-[#b0a5bd]">
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Batch</th>
                    <th className="px-5 py-4">Progress</th>
                    <th className="px-5 py-4">Assignments</th>
                    <th className="px-5 py-4">Last Active</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-[#3b3441]">
                  {filteredStudents.map((student, index) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50/70 dark:hover:bg-[#302b37]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                              batchColors[index % batchColors.length]
                            }`}
                          >
                            {student.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold">{student.name}</p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-[#b0a5bd]">
                              {student.email}
                            </p>
                            <p className="mt-1 text-xs text-gray-400 dark:text-[#91899b]">
                              {student.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 dark:bg-[#202b3b] dark:text-blue-300">
                          {student.batch}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="w-28">
                          <p className="mb-2 text-sm font-semibold">
                            {student.progress}%
                          </p>
                          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-[#393441]">
                            <div
                              className="h-1.5 rounded-full bg-[#FF2454]"
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold">
                          {student.completed}/{student.assignments}
                        </p>
                        <p className="mt-1 text-xs text-gray-400 dark:text-[#91899b]">
                          Completed
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-500 dark:text-[#b0a5bd]">
                        {student.lastActive}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            student.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-[#1f352e] dark:text-emerald-300"
                              : "bg-gray-100 text-gray-500 dark:bg-[#393441] dark:text-[#b0a5bd]"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              setMenuId(menuId === student.id ? null : student.id)
                            }
                            className="rounded-lg p-2 text-gray-400 dark:text-[#91899b] hover:bg-gray-100 dark:hover:bg-[#393441]"
                            aria-label={`Actions for ${student.name}`}
                          >
                            <MoreHorizontal size={20} />
                          </button>

                          {menuId === student.id && (
                            <div className="absolute right-0 top-10 z-20 w-44 rounded-xl border border-gray-100 dark:border-[#3b3441] bg-white dark:bg-[#211e27] p-1.5 text-left shadow-xl">
                              <button
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setMenuId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-[#302b37]"
                              >
                                <Eye size={16} /> View Details
                              </button>
                              <button
                                onClick={() => {
                                  setForm({
                                    name: student.name,
                                    email:
                                      student.email === "Not provided"
                                        ? ""
                                        : student.email,
                                    phone:
                                      student.phone === "Not provided"
                                        ? ""
                                        : student.phone,
                                    batch: student.batch,
                                  });
                                  setSelectedStudent({
                                    ...student,
                                    editing: true,
                                  });
                                  setMenuId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-[#302b37]"
                              >
                                <Pencil size={16} /> Edit Student
                              </button>
                              <button
                                onClick={() => removeStudent(student.id)}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-[#39232f]"
                              >
                                <Trash2 size={16} /> Remove Student
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

            {filteredStudents.length === 0 && (
              <div className="px-6 py-14 text-center">
                <Users size={32} className="mx-auto text-gray-300 dark:text-[#625a6c]" />
                <p className="mt-3 font-semibold">No students found</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-[#b0a5bd]">
                  Change the search or filter to find students.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setBatchFilter("All Batches");
                    setStatusFilter("All Status");
                  }}
                  className="mt-3 text-sm font-semibold text-[#FF2454]"
                >
                  Clear filters
                </button>
              </div>
            )}

            <div className="flex flex-col gap-2 border-t border-gray-100 dark:border-[#3b3441] px-5 py-4 text-sm text-gray-500 dark:text-[#b0a5bd] sm:flex-row sm:justify-between">
              <p>
                Showing {filteredStudents.length} of {students.length} students
              </p>
              <p className="text-xs text-gray-400 dark:text-[#91899b]">
                Demo data · Backend integration pending
              </p>
            </div>
          </section>
        </main>
      </div>

      {/* Add Student Modal */}
      {showAdd && (
        <Modal title="Add New Student" onClose={closeModals}>
          <p className="mb-5 text-sm text-gray-500 dark:text-[#b0a5bd]">
            Enter student details and assign a batch.
          </p>

          <form onSubmit={addStudent} className="space-y-4">
            <Field label="Student Name" required>
              <input
                name="name"
                value={form.name}
                onChange={updateForm}
                placeholder="Enter full name"
                required
                className={inputClass}
              />
            </Field>

            <Field label="Email Address">
              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#91899b]"
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateForm}
                  placeholder="student@example.com"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <div className="text-center text-xs text-gray-400 dark:text-[#91899b]">
              OR
            </div>

            <Field label="Phone Number">
              <div className="relative">
                <Phone
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#91899b]"
                />
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={updateForm}
                  placeholder="+91 98765 43210"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <Field label="Assign Batch" required>
              <select
                name="batch"
                value={form.batch}
                onChange={updateForm}
                required
                className={inputClass}
              >
                <option value="">Select a batch</option>
                {batches.map((batch) => (
                  <option key={batch.name} value={batch.name}>
                    {batch.name}
                  </option>
                ))}
              </select>
            </Field>

            {error && (
              <p className="rounded-lg bg-red-50 dark:bg-[#39232f] p-3 text-sm text-red-600 dark:text-red-300">
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={closeModals}
                className="flex-1 rounded-xl border border-gray-200 dark:border-[#3b3441] px-4 py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-[#302b37]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-semibold text-white hover:bg-[#e91d49]"
              >
                Add Student
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Batch Modal */}
      {showBatch && (
        <Modal title="Create New Batch" onClose={closeModals}>
          <form onSubmit={addBatch} className="space-y-4">
            <Field label="Batch Name" required>
              <input
                value={batchForm.name}
                onChange={(event) => {
                  setBatchForm({ ...batchForm, name: event.target.value });
                  setError("");
                }}
                placeholder="e.g. Morning Batch"
                required
                className={inputClass}
              />
            </Field>

            <Field label="Batch Schedule" required>
              <input
                value={batchForm.schedule}
                onChange={(event) => {
                  setBatchForm({
                    ...batchForm,
                    schedule: event.target.value,
                  });
                  setError("");
                }}
                placeholder="e.g. 9 AM - 11 AM"
                required
                className={inputClass}
              />
            </Field>

            {error && (
              <p className="rounded-lg bg-red-50 dark:bg-[#39232f] p-3 text-sm text-red-600 dark:text-red-300">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={closeModals}
                className="flex-1 rounded-xl border border-gray-200 dark:border-[#3b3441] px-4 py-3 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-[#302b37]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[#10265F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#19377d] dark:bg-[#35466d] dark:hover:bg-[#425780]"
              >
                Create Batch
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Student Details / Edit Modal */}
      {selectedStudent && (
        <Modal
          title={selectedStudent.editing ? "Edit Student" : "Student Details"}
          onClose={closeModals}
        >
          {selectedStudent.editing ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();

                const name = form.name.trim();
                const email = form.email.trim().toLowerCase();
                const phone = form.phone.trim();

                if (!name || (!email && !phone) || !form.batch) {
                  setError("Name, email or phone, and batch are required.");
                  return;
                }

                if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  setError("Please enter a valid email.");
                  return;
                }

                const duplicate = students.some(
                  (student) =>
                    student.id !== selectedStudent.id &&
                    ((email &&
                      student.email.toLowerCase() === email &&
                      student.email !== "Not provided") ||
                      (phone &&
                        student.phone === phone &&
                        student.phone !== "Not provided"))
                );

                if (duplicate) {
                  setError("Another student uses this email or phone.");
                  return;
                }

                setStudents((previous) =>
                  previous.map((student) =>
                    student.id === selectedStudent.id
                      ? {
                          ...student,
                          name,
                          email: email || "Not provided",
                          phone: phone || "Not provided",
                          batch: form.batch,
                        }
                      : student
                  )
                );

                closeModals();
              }}
              className="space-y-4"
            >
              <Field label="Student Name" required>
                <input
                  name="name"
                  value={form.name}
                  onChange={updateForm}
                  required
                  className={inputClass}
                />
              </Field>

              <Field label="Email">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateForm}
                  className={inputClass}
                />
              </Field>

              <Field label="Phone">
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={updateForm}
                  className={inputClass}
                />
              </Field>

              <Field label="Batch" required>
                <select
                  name="batch"
                  value={form.batch}
                  onChange={updateForm}
                  required
                  className={inputClass}
                >
                  {batches.map((batch) => (
                    <option key={batch.name} value={batch.name}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </Field>

              {error && (
                <p className="rounded-lg bg-red-50 dark:bg-[#39232f] p-3 text-sm text-red-600 dark:text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-semibold text-white hover:bg-[#e91d49]"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div>
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 dark:bg-[#302b37] p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-blue-700 dark:bg-[#202b3b] dark:text-blue-300">
                  {selectedStudent.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold">{selectedStudent.name}</h3>
                  <p className="mt-1 break-all text-sm text-gray-500 dark:text-[#b0a5bd]">
                    {selectedStudent.email}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <Detail
                  icon={<Mail size={17} />}
                  label="Email"
                  value={selectedStudent.email}
                />
                <Detail
                  icon={<Phone size={17} />}
                  label="Phone"
                  value={selectedStudent.phone}
                />
                <Detail
                  icon={<Layers size={17} />}
                  label="Batch"
                  value={selectedStudent.batch}
                />
                <Detail
                  icon={<Clock size={17} />}
                  label="Last Active"
                  value={selectedStudent.lastActive}
                />
                <Detail
                  icon={<GraduationCap size={17} />}
                  label="Learning Progress"
                  value={`${selectedStudent.progress}%`}
                />
                <Detail
                  icon={<CheckCircle2 size={17} />}
                  label="Assignments"
                  value={`${selectedStudent.completed} of ${selectedStudent.assignments} completed`}
                />
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

function StatCard({ title, value, caption, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-[#202b3b] dark:text-blue-400",
    green: "bg-emerald-50 text-emerald-600 dark:bg-[#1f352e] dark:text-emerald-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-[#30263d] dark:text-purple-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-[#3b3020] dark:text-orange-400",
  };

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-[#3b3441] bg-white dark:bg-[#211e27] p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-[#b0a5bd]">{title}</p>
          <h3 className="mt-3 text-3xl font-bold">{value}</h3>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-400 dark:text-[#91899b]">{caption}</p>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}
        {required && <span className="ml-1 text-[#FF2454]">*</span>}
      </label>
      {children}
    </div>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400 dark:text-[#91899b]">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400 dark:text-[#91899b]">{label}</p>
        <p className="mt-1 break-words text-sm font-medium">{value}</p>
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
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 dark:text-[#91899b] hover:bg-gray-100 dark:hover:bg-[#393441] hover:text-gray-700 dark:hover:text-white"
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