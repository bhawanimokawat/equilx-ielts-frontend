import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  Layers3,
  ClipboardList,
  FilePenLine,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  Clock,
  Video,
  BookOpen,
  MessageCircle,
  UserRoundPlus,
  CheckCircle2,
  CircleAlert,
  ChartNoAxesCombined,
  MoreHorizontal,
  Headphones,
  Mic,
  Eye,
  RefreshCw,
  LoaderCircle,
} from "lucide-react";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import trainerService from "../../services/trainerService";

const iconColorClasses = {
  blue: "bg-blue-50 text-blue-600 dark:bg-[#202b3b] dark:text-blue-400",
  purple:
    "bg-purple-50 text-purple-600 dark:bg-[#30263d] dark:text-purple-400",
  pink: "bg-rose-50 text-[#FF2454] dark:bg-[#39232f] dark:text-[#ff6688]",
  orange:
    "bg-amber-50 text-amber-600 dark:bg-[#3b3020] dark:text-amber-400",
  green:
    "bg-emerald-50 text-emerald-600 dark:bg-[#1f352e] dark:text-emerald-400",
};

const cardHover =
  "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-950/10 dark:hover:shadow-black/30";

const formatDate = (date) => {
  if (!date) return "Not specified";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Not specified";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDueDate = (date) => {
  if (!date) return "No due date";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "No due date";

  return parsed.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getInitials = (name, email) => {
  const value = name || email || "ST";
  const parts = value.trim().split(/\s+/);

  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return value.slice(0, 2).toUpperCase();
};

const getAssignmentColor = (index) => {
  const colors = ["blue", "purple", "green"];
  return colors[index % colors.length];
};

const getStatusClass = (status) => {
  const value = String(status || "").toUpperCase();

  if (value === "PUBLISHED") {
    return "bg-emerald-50 text-emerald-700 dark:bg-[#1f352e] dark:text-emerald-400";
  }

  if (value === "DRAFT") {
    return "bg-amber-50 text-amber-700 dark:bg-[#3b3020] dark:text-amber-400";
  }

  if (value === "CLOSED" || value === "CANCELLED") {
    return "bg-gray-100 text-gray-600 dark:bg-[#393441] dark:text-gray-300";
  }

  return "bg-blue-50 text-blue-700 dark:bg-[#202b3b] dark:text-blue-400";
};

function LoadingState() {
  return (
    <div className="flex min-h-[180px] items-center justify-center">
      <LoaderCircle size={28} className="animate-spin text-[#FF2454]" />
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-[#DCE4F5] px-5 py-8 text-center dark:border-[#49404f]">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1F5FF] text-[#7183A7] dark:bg-[#302a37] dark:text-[#b0a5bd]">
        <Icon size={22} />
      </div>

      <h3 className="text-sm font-bold text-[#10265F] dark:text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-xs leading-5 text-[#8A9ABB] dark:text-[#91899b]">
        {description}
      </p>
    </div>
  );
}

function UnavailableState({ title, description }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/70 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
      <CircleAlert
        size={18}
        className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
      />

      <div>
        <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-400/80">
          {description}
        </p>
      </div>
    </div>
  );
}

function StatCard({ item, onClick, loading }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!item.path}
      className={`group min-w-0 rounded-2xl border border-[#E9EEFA] bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#cbd7f5] hover:shadow-xl hover:shadow-blue-950/10 disabled:cursor-default dark:border-[#3b3441] dark:bg-[#211e27] dark:hover:border-[#594c68] dark:hover:shadow-black/30 sm:p-5`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#7183A7] dark:text-[#b0a5bd] sm:text-sm">
            {item.title}
          </p>

          {loading ? (
            <LoaderCircle
              size={24}
              className="mt-3 animate-spin text-[#FF2454]"
            />
          ) : (
            <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-[#10265F] dark:text-white sm:text-3xl">
              {item.value}
            </h3>
          )}
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${iconColorClasses[item.color]}`}
        >
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {item.trend === "up" && (
          <TrendingUp size={14} className="text-emerald-600" />
        )}

        {item.trend === "down" && (
          <CircleAlert size={14} className="text-amber-600" />
        )}

        <span
          className={`text-xs font-bold ${
            item.trend === "up"
              ? "text-emerald-600"
              : item.trend === "down"
                ? "text-amber-600"
                : "text-[#FF2454]"
          }`}
        >
          {item.change}
        </span>

        <span className="text-[11px] text-[#8A9ABB] dark:text-[#91899b]">
          {item.description}
        </span>
      </div>

      {item.path && (
        <div className="mt-3 flex items-center justify-end gap-1 text-[11px] font-semibold text-[#8A9ABB] transition group-hover:text-[#FF2454] dark:text-[#91899b]">
          View details
          <ArrowUpRight size={13} />
        </div>
      )}
    </button>
  );
}

function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-[#E9EEFA] bg-white p-4 shadow-sm transition-all duration-300 hover:border-[#d4def3] hover:shadow-lg hover:shadow-blue-950/5 dark:border-[#3b3441] dark:bg-[#211e27] dark:hover:border-[#594c68] dark:hover:shadow-black/20 sm:p-5 ${className}`}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-[#10265F] dark:text-white sm:text-base">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-xs leading-5 text-[#8A9ABB] dark:text-[#91899b]">
              {subtitle}
            </p>
          )}
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

function AssignmentProgress({ completed, total, color }) {
  const percentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  const progressColor = {
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    green: "bg-emerald-500",
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[11px] text-[#7183A7] dark:text-[#b0a5bd]">
          Assigned targets
        </span>

        <span className="text-[11px] font-bold text-[#10265F] dark:text-white">
          {total} targets
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#EEF2FA] dark:bg-[#393441]">
        <div
          className={`h-full rounded-full transition-all ${
            progressColor[color] || progressColor.blue
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-2 text-[10px] text-[#8A9ABB] dark:text-[#91899b]">
        Submission completion data is not available in this dashboard API.
      </p>
    </div>
  );
}

function AssignmentCard({ assignment, index, onClick }) {
  const color = getAssignmentColor(index);

  return (
    <div
      className={`group rounded-xl border border-[#E9EEFA] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50/30 hover:shadow-md dark:border-[#3b3441] dark:hover:border-[#674052] dark:hover:bg-[#39232f] sm:p-4`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${iconColorClasses[color]}`}
        >
          <BookOpen size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-bold leading-5 text-[#10265F] dark:text-white">
            {assignment.title || "Untitled assignment"}
          </h3>

          <p className="mt-1 text-[11px] text-[#8A9ABB] dark:text-[#91899b]">
            Created {formatDate(assignment.createdAt)}
          </p>

          <p className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-[#7183A7] dark:text-[#b0a5bd]">
            <Clock size={12} />
            Due {formatDueDate(assignment.dueAt)}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-lg px-2 py-1 text-[10px] font-bold ${getStatusClass(assignment.status)}`}
            >
              {assignment.status || "UNKNOWN"}
            </span>

            <span className="text-[10px] text-[#8A9ABB] dark:text-[#91899b]">
              {assignment?._count?.contents ?? 0} tests
            </span>

            <span className="text-[10px] text-[#8A9ABB] dark:text-[#91899b]">
              {assignment?._count?.targets ?? 0} targets
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClick}
          aria-label={`View ${assignment.title || "assignment"}`}
          className="rounded-lg p-1.5 text-[#8A9ABB] transition hover:bg-[#F5F7FF] hover:text-[#10265F] dark:text-[#91899b] dark:hover:bg-[#302b37] dark:hover:text-white"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}

function TrainerDashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    assignments: [],
    batches: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const result = await trainerService.getDashboardData();

      setDashboardData({
        assignments: result.assignments || [],
        batches: result.batches || [],
      });

      const errors = [];

      if (result.errors?.assignments) {
        errors.push(`Assignments: ${result.errors.assignments.message}`);
      }

      if (result.errors?.batches) {
        errors.push(`Batches: ${result.errors.batches.message}`);
      }

      const memberErrors = (result.batches || [])
        .filter((batch) => batch.membersError)
        .map((batch) => `${batch.name}: ${batch.membersError}`);

      if (memberErrors.length) {
        errors.push(`Batch members: ${memberErrors.join("; ")}`);
      }

      if (errors.length) setError(errors.join(" | "));
    } catch (err) {
      setError(err.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const assignments = dashboardData.assignments;
  const batches = dashboardData.batches;

  const students = useMemo(() => {
    const uniqueStudents = new Map();

    batches.forEach((batch) => {
      (batch.members || []).forEach((member) => {
        const user = member.user || {};
        const userId = member.userId || user.id;

        if (!userId) return;

        const current = uniqueStudents.get(userId) || {
          id: userId,
          name: user.profile?.name || user.email || "Student",
          email: user.email || "",
          batches: [],
        };

        if (!current.batches.some((item) => item.id === batch.id)) {
          current.batches.push({
            id: batch.id,
            name: batch.name,
          });
        }

        uniqueStudents.set(userId, current);
      });
    });

    return Array.from(uniqueStudents.values());
  }, [batches]);

  const assignmentStats = useMemo(() => {
    const published = assignments.filter(
      (item) => String(item.status).toUpperCase() === "PUBLISHED"
    ).length;

    const drafts = assignments.filter(
      (item) => String(item.status).toUpperCase() === "DRAFT"
    ).length;

    const closed = assignments.filter((item) =>
      ["CLOSED", "CANCELLED"].includes(String(item.status).toUpperCase())
    ).length;

    return {
      total: assignments.length,
      published,
      drafts,
      closed,
    };
  }, [assignments]);

  const recentAssignments = useMemo(
    () =>
      [...assignments]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 3),
    [assignments]
  );

  const topStudents = useMemo(() => students.slice(0, 5), [students]);

  const totalBatchStudents = students.length;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const trainerStats = [
    {
      title: "Total Students",
      value: totalBatchStudents,
      change: "Live",
      description: "unique students in your batches",
      icon: Users,
      color: "blue",
      trend: "up",
      path: "/trainer/students",
    },
    {
      title: "Active Batches",
      value: batches.length,
      change: "Live",
      description: "assigned batches",
      icon: Layers3,
      color: "purple",
      trend: "up",
      path: "/trainer/assignments",
    },
    {
      title: "Assignments",
      value: assignmentStats.total,
      change: `${assignmentStats.published} published`,
      description: `${assignmentStats.drafts} drafts`,
      icon: ClipboardList,
      color: "pink",
      trend: "neutral",
      path: "/trainer/assignments",
    },
    {
      title: "Pending Reviews",
      value: "—",
      change: "Unavailable",
      description: "trainer grading API not available",
      icon: FilePenLine,
      color: "orange",
      trend: "down",
      path: null,
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F7FF] text-[#10265F] transition-colors duration-300 dark:bg-[#17151B] dark:text-white">
      <Sidebar />

      <div className="flex min-h-screen min-w-0 flex-col lg:ml-[260px]">
        <Navbar />

        <main className="min-w-0 flex-1 space-y-5 p-4 sm:p-5 lg:p-7">
          {/* Page Heading */}
          <section className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-[#7183A7] dark:text-[#b0a5bd]">
                <span>Trainer Portal</span>
                <span>/</span>
                <span className="font-medium text-[#10265F] dark:text-white">
                  Dashboard
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-[#10265F] dark:text-white sm:text-3xl">
                Trainer <span className="text-[#FF2454]">Dashboard</span>
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#7183A7] dark:text-[#b0a5bd]">
                Track your students, assignments and IELTS performance.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-[#E9EEFA] bg-white px-3 py-2.5 shadow-sm dark:border-[#3b3441] dark:bg-[#211e27]">
                <CalendarDays
                  size={16}
                  className="text-[#506995] dark:text-[#b0a5bd]"
                />

                <span className="text-xs font-semibold text-[#506995] dark:text-[#b0a5bd]">
                  {today}
                </span>
              </div>

              <button
                type="button"
                onClick={() => loadDashboard(true)}
                disabled={loading || refreshing}
                className="flex items-center gap-2 rounded-xl bg-[#10265F] px-3 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#193779] hover:shadow-lg disabled:opacity-60 dark:bg-[#35466d] dark:hover:bg-[#425780]"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </section>

          {/* API Error */}
          {error && (
            <div className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-rose-500/20 dark:bg-rose-500/5">
              <div className="flex items-start gap-2">
                <CircleAlert
                  size={18}
                  className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400"
                />

                <div>
                  <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
                    Dashboard data could not be fully loaded
                  </p>

                  <p className="mt-1 break-words text-xs text-rose-600 dark:text-rose-400">
                    {error}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => loadDashboard(true)}
                className="shrink-0 rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
              >
                Try again
              </button>
            </div>
          )}

          {/* Summary Stats */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {trainerStats.map((item) => (
              <StatCard
                key={item.title}
                item={item}
                loading={loading}
                onClick={() => item.path && navigate(item.path)}
              />
            ))}
          </section>

          {/* Performance and Quick Overview */}
          <section className="grid grid-cols-1 gap-5 2xl:grid-cols-5">
            <Panel
              title="Student Performance"
              subtitle="Average IELTS band score across skills"
              action={
                <button
                  type="button"
                  onClick={() => navigate("/trainer/reports")}
                  className="flex items-center gap-1 text-xs font-semibold text-[#FF2454] transition-all hover:gap-2 hover:text-rose-700"
                >
                  Full reports <ArrowRight size={14} />
                </button>
              }
              className="2xl:col-span-3"
            >
              <UnavailableState
                title="Performance report API not available"
                description="The current backend does not provide trainer-wide skill-wise band scores. The previous sample chart has been removed to avoid showing fabricated performance data."
              />
            </Panel>

            <Panel
              title="Quick Overview"
              subtitle="Your daily teaching workload"
              className="2xl:col-span-2"
            >
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => navigate("/trainer/writing-grading")}
                  className="group flex w-full items-center gap-3 rounded-xl border border-[#E9EEFA] p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50/40 hover:shadow-md dark:border-[#3b3441] dark:hover:border-[#674052] dark:hover:bg-[#39232f]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#FF2454] transition-transform group-hover:scale-110 dark:bg-[#39232f]">
                    <FilePenLine size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#10265F] dark:text-white">
                      Writing Reviews
                    </p>

                    <p className="mt-1 text-[11px] text-[#8A9ABB] dark:text-[#91899b]">
                      Trainer review endpoint unavailable
                    </p>
                  </div>

                  <span className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-[10px] font-bold text-amber-700 dark:bg-[#3b3020] dark:text-amber-400">
                    API gap
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/trainer/live-speaking")}
                  className="group flex w-full items-center gap-3 rounded-xl border border-[#E9EEFA] p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-md dark:border-[#3b3441] dark:hover:border-[#344d70] dark:hover:bg-[#202b3b]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110 dark:bg-[#202b3b]">
                    <Video size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#10265F] dark:text-white">
                      Speaking Sessions
                    </p>

                    <p className="mt-1 text-[11px] text-[#8A9ABB] dark:text-[#91899b]">
                      Trainer schedule endpoint unavailable
                    </p>
                  </div>

                  <span className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-[10px] font-bold text-amber-700 dark:bg-[#3b3020] dark:text-amber-400">
                    API gap
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/trainer/assignments")}
                  className="group flex w-full items-center gap-3 rounded-xl border border-[#E9EEFA] p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 hover:bg-purple-50/40 hover:shadow-md dark:border-[#3b3441] dark:hover:border-[#514064] dark:hover:bg-[#30263d]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-transform group-hover:scale-110 dark:bg-[#30263d]">
                    <ClipboardList size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#10265F] dark:text-white">
                      Assignments
                    </p>

                    <p className="mt-1 text-[11px] text-[#8A9ABB] dark:text-[#91899b]">
                      {assignmentStats.total} records retrieved
                    </p>
                  </div>

                  <span className="rounded-lg bg-purple-50 px-2.5 py-1.5 text-xs font-bold text-purple-600 dark:bg-[#30263d] dark:text-purple-400">
                    {loading ? "—" : assignmentStats.total}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/trainer/messaging")}
                  className="group flex w-full items-center gap-3 rounded-xl border border-[#E9EEFA] p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-md dark:border-[#3b3441] dark:hover:border-[#315b48] dark:hover:bg-[#1f352e]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110 dark:bg-[#1f352e]">
                    <MessageCircle size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#10265F] dark:text-white">
                      Student Messages
                    </p>

                    <p className="mt-1 text-[11px] text-[#8A9ABB] dark:text-[#91899b]">
                      Open your conversations
                    </p>
                  </div>

                  <ArrowRight
                    size={16}
                    className="text-[#8A9ABB] transition-transform group-hover:translate-x-1 dark:text-[#91899b]"
                  />
                </button>
              </div>
            </Panel>
          </section>

          {/* Assignments and Speaking Sessions */}
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <Panel
              title="Recent Assignments"
              subtitle="Assignments retrieved from your institute"
              action={
                <button
                  type="button"
                  onClick={() => navigate("/trainer/assignments")}
                  className="text-xs font-semibold text-[#FF2454] transition hover:text-rose-700"
                >
                  View all
                </button>
              }
            >
              {loading ? (
                <LoadingState />
              ) : recentAssignments.length === 0 ? (
                <EmptyState
                  icon={ClipboardList}
                  title="No assignments found"
                  description="Assignments will appear here when they are available for your institute."
                />
              ) : (
                <div className="space-y-4">
                  {recentAssignments.map((assignment, index) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      index={index}
                      onClick={() => navigate("/trainer/assignments")}
                    />
                  ))}
                </div>
              )}
            </Panel>

            <Panel
              title="Upcoming Speaking Sessions"
              subtitle="Your scheduled student interviews"
              action={
                <button
                  type="button"
                  onClick={() => navigate("/trainer/live-speaking")}
                  className="text-xs font-semibold text-[#FF2454] transition hover:text-rose-700"
                >
                  View schedule
                </button>
              }
            >
              <UnavailableState
                title="Speaking schedule API not available"
                description="The current speaking backend supports student submissions and recordings, but it does not expose trainer-specific scheduled sessions."
              />

              <button
                type="button"
                onClick={() => navigate("/trainer/live-speaking")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#CBD5E1] py-3 text-xs font-semibold text-[#506995] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF2454] hover:bg-rose-50/40 hover:text-[#FF2454] dark:border-[#4a4352] dark:text-[#b0a5bd] dark:hover:bg-[#39232f]"
              >
                <CalendarDays size={15} />
                Manage Speaking Schedule
              </button>
            </Panel>
          </section>

          {/* Students and Activities */}
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">
            <Panel
              title="Student Performance Overview"
              subtitle="Students in your assigned batches"
              action={
                <button
                  type="button"
                  onClick={() => navigate("/trainer/students")}
                  className="text-xs font-semibold text-[#FF2454] transition hover:text-rose-700"
                >
                  All students
                </button>
              }
              className="xl:col-span-3"
            >
              {loading ? (
                <LoadingState />
              ) : topStudents.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No students found"
                  description="Students added to your assigned batches will appear here."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[490px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[#E9EEFA] dark:border-[#3b3441]">
                        <th className="pb-3 pr-3 text-[10px] font-semibold uppercase tracking-wider text-[#8A9ABB] dark:text-[#91899b]">
                          Student
                        </th>

                        <th className="pb-3 pr-3 text-[10px] font-semibold uppercase tracking-wider text-[#8A9ABB] dark:text-[#91899b]">
                          Batch
                        </th>

                        <th className="pb-3 pr-3 text-[10px] font-semibold uppercase tracking-wider text-[#8A9ABB] dark:text-[#91899b]">
                          Avg. Band
                        </th>

                        <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#8A9ABB] dark:text-[#91899b]">
                          Progress
                        </th>

                        <th className="pb-3 pl-2 text-right text-[10px] font-semibold uppercase tracking-wider text-[#8A9ABB] dark:text-[#91899b]">
                          View
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {topStudents.map((student, index) => (
                        <tr
                          key={student.id}
                          className="group border-b border-[#F0F3FA] transition-colors duration-200 last:border-0 hover:bg-blue-50/50 dark:border-[#3b3441] dark:hover:bg-[#202b3b]"
                        >
                          <td className="py-3 pr-3">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${iconColorClasses[getAssignmentColor(index)]}`}
                              >
                                {getInitials(student.name, student.email)}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-[#10265F] dark:text-white">
                                  {student.name}
                                </p>

                                <p className="max-w-[130px] truncate text-[10px] text-[#8A9ABB] dark:text-[#91899b]">
                                  {student.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 pr-3 text-[11px] text-[#7183A7] dark:text-[#b0a5bd]">
                            {student.batches.map((batch) => batch.name).join(", ")}
                          </td>

                          <td className="py-3 pr-3">
                            <span className="rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-500 dark:bg-[#393441] dark:text-gray-300">
                              N/A
                            </span>
                          </td>

                          <td className="py-3">
                            <span className="text-[10px] text-[#8A9ABB] dark:text-[#91899b]">
                              N/A
                            </span>
                          </td>

                          <td className="py-3 pl-2 text-right">
                            <button
                              type="button"
                              onClick={() => navigate("/trainer/students")}
                              aria-label={`View ${student.name}`}
                              className="rounded-lg p-2 text-[#7183A7] transition-all duration-200 hover:bg-blue-100 hover:text-blue-600 dark:text-[#b0a5bd] dark:hover:bg-[#303e55]"
                            >
                              <Eye size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="mt-3 text-[10px] text-[#9AA8C2] dark:text-[#91899b]">
                Student names and batch membership are live. Band score and
                progress data are not supplied by the current trainer APIs.
              </p>
            </Panel>

            <Panel
              title="Recent Activities"
              subtitle="Latest updates from your students"
              action={
                <button
                  type="button"
                  onClick={() => navigate("/trainer/students")}
                  aria-label="View students"
                  className="rounded-lg p-1.5 text-[#8A9ABB] transition hover:bg-[#F5F7FF] dark:text-[#91899b] dark:hover:bg-[#302b37]"
                >
                  <MoreHorizontal size={18} />
                </button>
              }
              className="xl:col-span-2"
            >
              <UnavailableState
                title="Activity feed API not available"
                description="A trainer-specific recent activity endpoint was not found in the current backend. No sample activities are displayed."
              />
            </Panel>
          </section>

          {/* Quick Actions */}
          <section>
            <div className="mb-4">
              <h2 className="text-sm font-bold text-[#10265F] dark:text-white">
                Quick Actions
              </h2>

              <p className="mt-1 text-xs text-[#8A9ABB] dark:text-[#91899b]">
                Common tasks for your daily workflow
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "Add Student",
                  description: "Register a student",
                  icon: UserRoundPlus,
                  color: "blue",
                  path: "/trainer/students",
                },
                {
                  title: "Assign Test",
                  description: "Create an assignment",
                  icon: ClipboardList,
                  color: "purple",
                  path: "/trainer/assignments",
                },
                {
                  title: "Review Writing",
                  description: "Open writing workspace",
                  icon: FilePenLine,
                  color: "pink",
                  path: "/trainer/writing-grading",
                },
                {
                  title: "Start Speaking",
                  description: "Manage interviews",
                  icon: Mic,
                  color: "green",
                  path: "/trainer/live-speaking",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={`group flex items-center gap-3 rounded-2xl border border-[#E9EEFA] bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#cbd7f5] hover:shadow-xl hover:shadow-blue-950/10 dark:border-[#3b3441] dark:bg-[#211e27] dark:hover:border-[#594c68] dark:hover:shadow-black/30`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${iconColorClasses[item.color]}`}
                    >
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#10265F] dark:text-white">
                        {item.title}
                      </p>

                      <p className="mt-1 text-[10px] text-[#8A9ABB] dark:text-[#91899b]">
                        {item.description}
                      </p>
                    </div>

                    <ArrowRight
                      size={15}
                      className="text-[#8A9ABB] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#FF2454] dark:text-[#91899b]"
                    />
                  </button>
                );
              })}
            </div>
          </section>

          {/* Footer */}
          <footer className="pb-2 pt-1 text-center text-[10px] text-[#9AA8C2] dark:text-[#91899b]">
            Equilx IELTS · Trainer Portal · 2026
          </footer>
        </main>
      </div>
    </div>
  );
}

export default TrainerDashboard;