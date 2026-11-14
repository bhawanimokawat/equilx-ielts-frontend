import React, { useMemo, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar";
import {
  Users,
  UserRound,
  ChartNoAxesCombined,
  CircleCheck,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ArrowUpRight,
  X,
  Star,
  Eye,
  UserPlus,
} from "lucide-react";

const initialTrainers = [
  {
    id: 1,
    name: "Aman Sharma",
    initials: "AS",
    email: "aman@example.com",
    phone: "+91 98765 43210",
    skills: "Speaking, Writing",
    students: 48,
    batches: 4,
    joined: "12 Jan 2024",
    status: "Active",
    rating: 4.8,
    completion: 88,
    bandIncrease: "+1.2",
    sessions: 24,
  },
  {
    id: 2,
    name: "Pooja Gupta",
    initials: "PG",
    email: "pooja@example.com",
    phone: "+91 87654 32109",
    skills: "Listening, Reading",
    students: 36,
    batches: 3,
    joined: "18 Feb 2024",
    status: "Active",
    rating: 4.6,
    completion: 82,
    bandIncrease: "+0.9",
    sessions: 18,
  },
  {
    id: 3,
    name: "Rahul Kumar",
    initials: "RK",
    email: "rahul@example.com",
    phone: "+91 76543 21098",
    skills: "Writing, Reading",
    students: 28,
    batches: 2,
    joined: "05 Mar 2024",
    status: "Active",
    rating: 4.5,
    completion: 78,
    bandIncrease: "+1.0",
    sessions: 16,
  },
  {
    id: 4,
    name: "Neha Singh",
    initials: "NS",
    email: "neha@example.com",
    phone: "+91 65432 10987",
    skills: "Speaking, Listening",
    students: 24,
    batches: 3,
    joined: "22 Mar 2024",
    status: "Active",
    rating: 4.7,
    completion: 85,
    bandIncrease: "+1.3",
    sessions: 20,
  },
  {
    id: 5,
    name: "Vikram Patel",
    initials: "VP",
    email: "vikram@example.com",
    phone: "+91 54321 09876",
    skills: "Reading, Writing",
    students: 20,
    batches: 2,
    joined: "10 Apr 2024",
    status: "Inactive",
    rating: 4.3,
    completion: 70,
    bandIncrease: "+0.6",
    sessions: 12,
  },
  {
    id: 6,
    name: "Kriti Verma",
    initials: "KV",
    email: "kriti@example.com",
    phone: "+91 43210 98765",
    skills: "Speaking, Writing",
    students: 26,
    batches: 3,
    joined: "15 May 2024",
    status: "Active",
    rating: 4.9,
    completion: 91,
    bandIncrease: "+1.4",
    sessions: 22,
  },
];

const palette = [
  "bg-purple-100 text-purple-600",
  "bg-blue-100 text-blue-600",
  "bg-rose-100 text-rose-600",
  "bg-emerald-100 text-emerald-600",
  "bg-violet-100 text-violet-600",
];

function StatCard({ title, value, change, icon: Icon, color }) {
  const styles = {
    rose: {
      icon: "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400",
      line: "#FF3864",
    },
    blue: {
      icon: "bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400",
      line: "#2995FF",
    },
    purple: {
      icon: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
      line: "#A044FF",
    },
    green: {
      icon: "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400",
      line: "#06C99A",
    },
  };

  const style = styles[color];

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${style.icon}`}
        >
          <Icon size={27} strokeWidth={2.4} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#10265F] dark:text-slate-100">
            {title}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-3xl font-extrabold text-[#10265F] dark:text-white">
              {value}
            </span>

            <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-500">
              <ArrowUpRight size={15} />
              {change}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-[#91899B]">
            from last month
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
            id={`trainer-fill-${color}`}
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
          fill={`url(#trainer-fill-${color})`}
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

function Panel({ title, children, action, className = "" }) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27] ${className}`}
    >
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

function TrainerAvatar({ trainer, index, size = "h-9 w-9" }) {
  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center rounded-full text-xs font-bold ${palette[index % palette.length]}`}
    >
      {trainer.initials}
    </span>
  );
}

function WorkloadChart({ trainers }) {
  const chartTrainers = trainers.slice(0, 6);

  const maxValue = Math.max(
    80,
    ...chartTrainers.map((trainer) => trainer.students)
  );

  return (
    <Panel title="Trainer Workload" className="xl:col-span-5">
      <div className="mb-4 flex flex-wrap gap-4">
        {[
          { label: "Students", color: "#FF7199" },
          { label: "Assignments", color: "#A044FF" },
          { label: "Pending Reviews", color: "#2995FF" },
        ].map((item) => (
          <span
            key={item.label}
            className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#B0A5BD]"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[480px]">
          <div className="relative h-56 border-b border-l border-slate-200 dark:border-[#3B3441]">
            {[0, 20, 40, 60, 80].map((tick) => (
              <div
                key={tick}
                className="absolute left-0 right-0 border-t border-slate-100 dark:border-[#3B3441]"
                style={{ bottom: `${(tick / 80) * 100}%` }}
              >
                <span className="absolute -left-7 -top-2.5 text-[10px] text-slate-400 dark:text-[#91899B]">
                  {tick}
                </span>
              </div>
            ))}

            <div className="relative z-10 flex h-full items-end justify-around px-3">
              {chartTrainers.map((trainer) => {
                const assignmentCount = Math.round(trainer.students * 0.6);
                const pending = Math.round(trainer.students * 0.35);

                return (
                  <div
                    key={trainer.id}
                    className="flex h-full flex-1 items-end justify-center gap-1 px-1"
                  >
                    {[trainer.students, assignmentCount, pending].map(
                      (value, barIndex) => {
                        const colors = ["#FF7199", "#A044FF", "#2995FF"];

                        return (
                          <div
                            key={barIndex}
                            title={`${value}`}
                            className="w-3 rounded-t-sm sm:w-4"
                            style={{
                              height: `${(value / maxValue) * 85}%`,
                              backgroundColor: colors[barIndex],
                            }}
                          />
                        );
                      }
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex justify-around gap-1">
            {chartTrainers.map((trainer) => (
              <span
                key={trainer.id}
                className="flex-1 text-center text-[10px] text-slate-500 dark:text-[#B0A5BD]"
              >
                {trainer.name.split(" ")[0]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function PerformanceTable({ trainers }) {
  return (
    <Panel
      title="Trainer Performance"
      className="xl:col-span-7"
      action={
        <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-[#10265F] outline-none dark:border-[#3B3441] dark:bg-[#19171E] dark:text-slate-200">
          <option>Last 3 Months</option>
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[510px] text-left text-xs">
          <thead className="bg-slate-50 text-[10px] text-slate-500 dark:bg-[#19171E] dark:text-[#B0A5BD]">
            <tr>
              <th className="rounded-l-lg px-3 py-3">Trainer</th>
              <th className="px-3 py-3">Avg. Band Increase</th>
              <th className="px-3 py-3">Assignment Completion</th>
              <th className="px-3 py-3">Live Sessions</th>
              <th className="rounded-r-lg px-3 py-3">Rating</th>
            </tr>
          </thead>

          <tbody>
            {trainers.slice(0, 4).map((trainer, index) => (
              <tr
                key={trainer.id}
                className="border-b border-slate-100 last:border-0 dark:border-[#3B3441]"
              >
                <td className="whitespace-nowrap px-3 py-3">
                  <div className="flex items-center gap-2">
                    <TrainerAvatar
                      trainer={trainer}
                      index={index}
                      size="h-8 w-8"
                    />
                    <span className="font-semibold text-[#10265F] dark:text-slate-100">
                      {trainer.name}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-3">
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    {trainer.bandIncrease}
                  </span>
                </td>

                <td className="px-3 py-3">
                  <span
                    className={`rounded-full px-3 py-1.5 font-semibold ${
                      trainer.completion >= 85
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                    }`}
                  >
                    {trainer.completion}%
                  </span>
                </td>

                <td className="px-3 py-3 text-[#10265F] dark:text-slate-200">
                  {trainer.sessions}
                </td>

                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-1 font-semibold text-[#10265F] dark:text-slate-200">
                    <Star
                      size={14}
                      className="fill-amber-400 text-amber-400"
                    />
                    {trainer.rating}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function InviteTrainerModal({ onClose, onInvite }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "Speaking, Writing",
  });

  const update = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) return;

    onInvite(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:border dark:border-[#3B3441] dark:bg-[#211E27]"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#10265F] dark:text-white">
              Invite Trainer
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-[#B0A5BD]">
              Add a trainer to your institute demo list.
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

        <div className="space-y-4">
          {[
            { label: "Full Name", name: "name", type: "text" },
            { label: "Email Address", name: "email", type: "email" },
            { label: "Phone Number", name: "phone", type: "tel" },
          ].map((field) => (
            <label key={field.name} className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#10265F] dark:text-slate-200">
                {field.label}
              </span>

              <input
                name={field.name}
                type={field.type}
                required={["name", "email"].includes(field.name)}
                value={form[field.name]}
                onChange={update}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-pink-400 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white dark:placeholder:text-[#91899B]"
              />
            </label>
          ))}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#10265F] dark:text-slate-200">
              Teaching Skills
            </span>

            <select
              name="skills"
              value={form.skills}
              onChange={update}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-pink-400 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white"
            >
              <option>Speaking, Writing</option>
              <option>Listening, Reading</option>
              <option>Reading, Writing</option>
              <option>Speaking, Listening</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-[#3B3441] dark:text-slate-300 dark:hover:bg-[#302B36]"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-[#FF2454] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            Send Invite
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Trainers() {
  const [trainers, setTrainers] = useState(initialTrainers);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Trainers");
  const [showModal, setShowModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState(1);

  const filteredTrainers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return trainers.filter((trainer) => {
      const matchesSearch =
        !query ||
        [trainer.name, trainer.email, trainer.phone, trainer.skills].some(
          (value) => value.toLowerCase().includes(query)
        );

      const matchesStatus =
        status === "All Trainers" ||
        (status === "Active" && trainer.status === "Active") ||
        (status === "Inactive" && trainer.status === "Inactive");

      return matchesSearch && matchesStatus;
    });
  }, [trainers, search, status]);

  const pageSize = 5;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTrainers.length / pageSize)
  );
  const currentPage = Math.min(page, totalPages);

  const visibleTrainers = filteredTrainers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const inviteTrainer = (form) => {
    const initials = form.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const newTrainer = {
      ...form,
      id: Date.now(),
      initials,
      students: 0,
      batches: 0,
      joined: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Active",
      rating: 0,
      completion: 0,
      bandIncrease: "+0.0",
      sessions: 0,
    };

    setTrainers((previous) => [newTrainer, ...previous]);
    setSearch("");
    setStatus("All Trainers");
    setPage(1);
    setNotice("Trainer added to the current demo list.");
  };

  const toggleStatus = (id) => {
    setTrainers((previous) =>
      previous.map((trainer) =>
        trainer.id === id
          ? {
              ...trainer,
              status:
                trainer.status === "Active" ? "Inactive" : "Active",
            }
          : trainer
      )
    );

    setActiveMenu(null);
    setNotice("Trainer status updated in the demo list.");
  };

  const activeCount = trainers.filter(
    (trainer) => trainer.status === "Active"
  ).length;

  const averageStudents = trainers.length
    ? Math.round(
        trainers.reduce((sum, trainer) => sum + trainer.students, 0) /
          trainers.length
      )
    : 0;

  return (
    <div className="min-h-screen bg-[#F5F7FF] transition-colors duration-300 dark:bg-[#17151B]">
  <Sidebar />

  <div className="ml-[260px] flex min-h-screen min-w-0 flex-col">
    <Navbar />

        <main className="min-w-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {/* Heading */}
          <section className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#6B7FA8] dark:text-[#B0A5BD]">
                Trainers <span className="mx-1">›</span> Manage Trainers
              </p>

              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#10265F] dark:text-white">
                Trainer <span className="text-[#FF2454]">Management</span>
              </h1>

              <p className="mt-2 text-sm text-[#7183A7] dark:text-[#B0A5BD]">
                Invite, manage and track trainers. Assign students, manage
                workload and monitor performance.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
            >
              <Plus size={19} />
              Invite Trainer
            </button>
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

          {/* Stats */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            <StatCard
              title="Total Trainers"
              value={trainers.length}
              change="20%"
              icon={Users}
              color="rose"
            />

            <StatCard
              title="Active Trainers"
              value={activeCount}
              change="11%"
              icon={UserRound}
              color="blue"
            />

            <StatCard
              title="Average Students per Trainer"
              value={averageStudents}
              change="8%"
              icon={ChartNoAxesCombined}
              color="purple"
            />

            <StatCard
              title="Trainer Activity Rate"
              value={`${
                trainers.length
                  ? Math.round((activeCount / trainers.length) * 100)
                  : 0
              }%`}
              change="6%"
              icon={CircleCheck}
              color="green"
            />
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <WorkloadChart trainers={filteredTrainers} />
            <PerformanceTable trainers={filteredTrainers} />
          </section>

          {/* Trainer table */}
          <Panel
            title="All Trainers"
            action={
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 dark:text-[#91899B]">
                  {filteredTrainers.length} trainers
                </span>

                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-[#FF2454] transition hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20"
                >
                  <UserPlus size={15} />
                  Add Trainer
                </button>
              </div>
            }
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-4">
                {["All Trainers", "Active", "Inactive"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setStatus(tab);
                      setPage(1);
                    }}
                    className={`border-b-2 pb-2 text-sm transition ${
                      status === tab
                        ? "border-[#FF2454] font-bold text-[#FF2454]"
                        : "border-transparent text-slate-500 hover:text-[#10265F] dark:text-[#B0A5BD] dark:hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex h-10 min-w-[220px] items-center gap-2 rounded-xl border border-slate-200 px-3 dark:border-[#3B3441] dark:bg-[#19171E]">
                  <Search
                    size={17}
                    className="shrink-0 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Search by name, email or phone..."
                    className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-[#91899B]"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatus("All Trainers");
                    setPage(1);
                  }}
                  className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-[#10265F] transition hover:bg-slate-50 dark:border-[#3B3441] dark:text-slate-200 dark:hover:bg-[#302B36]"
                >
                  <SlidersHorizontal size={15} />
                  Reset
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead>
                  <tr className="bg-slate-50 text-[11px] text-slate-500 dark:bg-[#19171E] dark:text-[#B0A5BD]">
                    {[
                      "#",
                      "Trainer",
                      "Email / Phone",
                      "Students",
                      "Active Batches",
                      "Join Date",
                      "Status",
                      "Rating",
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
                  {visibleTrainers.map((trainer, index) => (
                    <tr
                      key={trainer.id}
                      className="border-b border-slate-100 text-xs transition hover:bg-slate-50/70 dark:border-[#3B3441] dark:hover:bg-[#302B36]/60"
                    >
                      <td className="px-3 py-3 text-slate-400 dark:text-[#91899B]">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <TrainerAvatar
                            trainer={trainer}
                            index={index}
                          />

                          <div>
                            <p className="whitespace-nowrap font-bold text-[#10265F] dark:text-slate-100">
                              {trainer.name}
                            </p>

                            <p className="mt-1 whitespace-nowrap text-[10px] text-slate-400 dark:text-[#91899B]">
                              {trainer.skills}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3">
                        <p className="whitespace-nowrap text-[#506995] dark:text-slate-300">
                          {trainer.email}
                        </p>

                        <p className="mt-1 whitespace-nowrap text-slate-400 dark:text-[#91899B]">
                          {trainer.phone || "—"}
                        </p>
                      </td>

                      <td className="px-3 py-3 font-semibold text-[#10265F] dark:text-slate-200">
                        {trainer.students}
                      </td>

                      <td className="px-3 py-3 text-[#10265F] dark:text-slate-200">
                        {trainer.batches}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3 text-slate-500 dark:text-[#B0A5BD]">
                        {trainer.joined}
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                            trainer.status === "Active"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400"
                          }`}
                        >
                          {trainer.status}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1 font-semibold text-[#10265F] dark:text-slate-200">
                          <Star
                            size={14}
                            className="fill-amber-400 text-amber-400"
                          />
                          {trainer.rating || "—"}
                        </span>
                      </td>

                      <td className="relative px-3 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setNotice(
                                `${trainer.name}: ${trainer.email} · ${trainer.skills}`
                              )
                            }
                            aria-label={`View ${trainer.name}`}
                            className="rounded-lg border border-slate-200 px-3 py-2 font-semibold text-[#10265F] transition hover:bg-slate-50 dark:border-[#3B3441] dark:text-slate-200 dark:hover:bg-[#302B36]"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenu(
                                activeMenu === trainer.id
                                  ? null
                                  : trainer.id
                              )
                            }
                            aria-label={`More actions for ${trainer.name}`}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-[#B0A5BD] dark:hover:bg-[#302B36]"
                          >
                            <MoreVertical size={17} />
                          </button>
                        </div>

                        {activeMenu === trainer.id && (
                          <div className="absolute right-8 top-10 z-20 w-36 rounded-xl border border-slate-100 bg-white p-1 shadow-xl dark:border-[#3B3441] dark:bg-[#211E27]">
                            <button
                              type="button"
                              onClick={() => toggleStatus(trainer.id)}
                              className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#10265F] transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-[#302B36]"
                            >
                              {trainer.status === "Active"
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  {visibleTrainers.length === 0 && (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-4 py-12 text-center text-sm text-slate-500 dark:text-[#B0A5BD]"
                      >
                        No trainers found. Try changing your search or
                        status filter.
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
                {filteredTrainers.length
                  ? (currentPage - 1) * pageSize + 1
                  : 0}{" "}
                to {Math.min(currentPage * pageSize, filteredTrainers.length)}{" "}
                of {filteredTrainers.length} trainers
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setPage((value) => Math.max(1, value - 1))
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40 dark:border-[#3B3441] dark:text-slate-300 dark:hover:bg-[#302B36]"
                  aria-label="Previous page"
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
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40 dark:border-[#3B3441] dark:text-slate-300 dark:hover:bg-[#302B36]"
                  aria-label="Next page"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </Panel>

          <footer className="pb-2 text-center text-xs text-slate-400 dark:text-[#91899B]">
            Equilx IELTS · Institute Admin Portal
          </footer>
        </main>
      </div>

      {showModal && (
        <InviteTrainerModal
          onClose={() => setShowModal(false)}
          onInvite={inviteTrainer}
        />
      )}
    </div>
  );
}