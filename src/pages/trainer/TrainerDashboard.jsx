
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Layers3, ClipboardList, FilePenLine,
  ArrowUpRight, ArrowRight, CalendarDays, Clock,
  Video, BookOpen, MessageCircle, UserRoundPlus,
  CircleAlert, ChartNoAxesCombined, MoreHorizontal,
  Headphones, Mic, Eye, RefreshCw, LoaderCircle,
  Activity, Target, CheckCircle2,
} from "lucide-react";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import trainerService from "../../services/Trainer/trainerService.js";

const ROUTES = {
  students: "/trainer/students",
  reports: "/trainer/reports",
  assignments: "/trainer/assignments",
  writing: "/trainer/writing-grading",
  speaking: "/trainer/live-speaking",
  messages: "/trainer/messaging",
};

const COLORS = {
  blue: "bg-blue-50 text-blue-600 dark:bg-[#202b3b] dark:text-blue-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-[#30263d] dark:text-purple-400",
  pink: "bg-rose-50 text-[#FF2454] dark:bg-[#39232f] dark:text-rose-400",
  orange: "bg-amber-50 text-amber-600 dark:bg-[#3b3020] dark:text-amber-400",
  green: "bg-emerald-50 text-emerald-600 dark:bg-[#1f352e] dark:text-emerald-400",
};

const TITLE = "text-[#10265F] dark:text-white";
const MUTED = "text-[#7183A7] dark:text-[#b0a5bd]";
const BORDER = "border-[#E9EEFA] dark:border-[#3b3441]";

const number = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
};

const showNumber = (value) =>
  number(value) === null ? "—" : String(value);

const clamp = (value) => {
  const n = number(value);
  return n === null ? null : Math.max(0, Math.min(100, n));
};

const dateText = (value, withTime = false) => {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not scheduled";
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime
      ? { hour: "numeric", minute: "2-digit" }
      : {}),
  });
};

const initials = (value) =>
  String(value || "ST")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();

const statusStyle = (value) => {
  const status = String(value || "").toUpperCase();

  if (["ACTIVE", "PUBLISHED", "COMPLETED", "GRADED"].includes(status)) {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
  }
  if (["DRAFT", "PENDING", "SCHEDULED", "IN_PROGRESS"].includes(status)) {
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
  }
  if (["CLOSED", "CANCELLED", "OVERDUE"].includes(status)) {
    return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";
  }
  return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
};

function Badge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1
        text-[10px] font-bold ${statusStyle(status)}`}
    >
      {String(status || "Unknown").replaceAll("_", " ")}
    </span>
  );
}

// Shared hover wrapper:
// White card remains white; pink is BEHIND the card.
function HoverCard({
  children,
  className = "",
  contentClassName = "",
  onClick,
}) {
  const clickable = typeof onClick === "function";

  return (
    <div
      className={`group relative isolate h-full min-w-0 pb-2 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0
          bottom-0 top-2 rounded-2xl bg-pink-100
          opacity-0 transition-opacity duration-300
          group-hover:opacity-100 dark:bg-[#4A2538]"
      />

      {clickable ? (
        <button
          type="button"
          onClick={onClick}
          className={`relative z-10 flex h-full w-full min-w-0
            flex-col rounded-2xl border bg-white text-left
            shadow-sm transition-transform duration-300
            ease-out group-hover:-translate-y-1.5
            dark:bg-[#211e27] ${BORDER} ${contentClassName}`}
        >
          {children}
        </button>
      ) : (
        <div
          className={`relative z-10 flex h-full w-full min-w-0
            flex-col rounded-2xl border bg-white shadow-sm
            transition-transform duration-300 ease-out
            group-hover:-translate-y-1.5
            dark:bg-[#211e27] ${BORDER} ${contentClassName}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function EmptyState({
  icon: Icon = ClipboardList,
  title = "No data available",
  description = "Records will appear here when available.",
}) {
  return (
    <div
      className={`flex min-h-[175px] flex-col items-center
        justify-center rounded-xl border border-dashed
        px-4 py-7 text-center ${BORDER}`}
    >
      <div
        className="mb-3 flex h-12 w-12 items-center
          justify-center rounded-xl bg-[#F1F5FF]
          text-[#7183A7] dark:bg-[#302a37]"
      >
        <Icon size={22} />
      </div>
      <p className={`text-sm font-bold ${TITLE}`}>{title}</p>
      <p className={`mt-2 max-w-sm text-xs leading-5 ${MUTED}`}>
        {description}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[175px] items-center justify-center">
      <LoaderCircle
        size={27}
        className="animate-spin text-[#FF2454]"
      />
    </div>
  );
}

function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}) {
  return (
    <HoverCard className={className}>
      <div className="flex h-full min-w-0 flex-col p-4 sm:p-5">
        <div
          className="mb-5 flex flex-wrap items-start
            justify-between gap-3"
        >
          <div className="min-w-0">
            <h2 className={`text-base font-bold ${TITLE}`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`mt-1 text-xs leading-5 ${MUTED}`}>
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </HoverCard>
  );
}

function ActionLink({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-xs
        font-semibold text-[#FF2454] hover:underline"
    >
      {children}
      <ArrowRight size={14} />
    </button>
  );
}

function StatCard({ item, loading, onClick }) {
  const Icon = item.icon;

  return (
    <HoverCard
      onClick={onClick}
      contentClassName="min-h-[285px]"
    >
      <div className="flex h-full w-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-14 w-14 items-center
              justify-center rounded-2xl ${COLORS[item.color]}`}
          >
            <Icon size={25} />
          </div>
          <ArrowUpRight size={20} className={MUTED} />
        </div>

        <p className={`mt-5 text-base font-medium ${MUTED}`}>
          {item.title}
        </p>

        {loading ? (
          <LoaderCircle
            className="mt-5 animate-spin text-[#FF2454]"
            size={26}
          />
        ) : (
          <p className={`mt-5 text-3xl font-extrabold ${TITLE}`}>
            {item.value}
          </p>
        )}

        <div className="mt-auto pt-5">
          <p className={`text-xs leading-5 ${MUTED}`}>
            {item.description}
          </p>
          <p className="mt-3 text-xs font-semibold text-[#FF2454]">
            {item.note}
          </p>
        </div>
      </div>
    </HoverCard>
  );
}

function ProgressBar({ value, color = "bg-[#FF2454]" }) {
  const amount = clamp(value);

  return (
    <div className="h-2 overflow-hidden rounded-full bg-[#EEF2FA] dark:bg-[#393441]">
      {amount !== null && (
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${amount}%` }}
        />
      )}
    </div>
  );
}

function AssignmentCard({ assignment, progress, onClick, index }) {
  const colors = ["blue", "purple", "green"];
  const color = colors[index % colors.length];
  const details = progress?.data || {};

  const completed = number(
    details.completed ??
    details.completedCount ??
    details.completedStudents
  );
  const total = number(
    details.total ??
    details.totalCount ??
    details.totalStudents
  );

  const completion =
    completed !== null && total !== null && total > 0
      ? Math.round((completed / total) * 100)
      : clamp(details.percentage ?? details.completionRate);

  return (
    <div className={`rounded-xl border p-4 ${BORDER}`}>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center
            justify-center rounded-xl ${COLORS[color]}`}
        >
          <BookOpen size={19} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className={`text-sm font-bold ${TITLE}`}>
              {assignment.title || "Untitled assignment"}
            </p>
            <Badge status={assignment.status} />
          </div>

          <p className={`mt-1 text-xs ${MUTED}`}>
            Created {dateText(assignment.createdAt)}
          </p>

          <div className={`mt-3 flex flex-wrap gap-4 text-xs ${MUTED}`}>
            <span className="inline-flex items-center gap-1">
              <Clock size={13} />
              Due {dateText(assignment.dueAt || assignment.dueDate)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Target size={13} />
              {assignment._count?.targets ?? "—"} targets
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex justify-between gap-2 text-xs">
          <span className={MUTED}>Completion</span>
          <span className={`font-semibold ${TITLE}`}>
            {completion === null ? "—" : `${completion}%`}
          </span>
        </div>
        <ProgressBar value={completion} />
        <p className={`mt-2 text-[11px] ${MUTED}`}>
          {completed !== null && total !== null
            ? `${completed} of ${total} completed`
            : progress?.error
              ? "Progress currently unavailable"
              : "Completion data unavailable"}
        </p>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="mt-4 inline-flex items-center gap-1
          text-xs font-semibold text-[#FF2454] hover:underline"
      >
        View assignment <ArrowRight size={14} />
      </button>
    </div>
  );
}

const SKILLS = [
  { key: "listening", title: "Listening", icon: Headphones, color: "#3B82F6" },
  { key: "reading", title: "Reading", icon: BookOpen, color: "#8B5CF6" },
  { key: "writing", title: "Writing", icon: FilePenLine, color: "#FF2454" },
  { key: "speaking", title: "Speaking", icon: Mic, color: "#10B981" },
];

function PerformanceChart({ records = [] }) {
  const rows = Array.isArray(records) ? records : [];
  const latest = rows.at(-1) || {};
  const width = 640;
  const height = 190;
  const pad = 20;

  const chartPoints = (key) =>
    rows
      .map((row, index) => {
        const value = number(row[key]);
        if (value === null) return null;

        const x =
          pad +
          (index / Math.max(rows.length - 1, 1)) *
            (width - pad * 2);

        const y =
          height -
          pad -
          (Math.min(9, Math.max(0, value)) / 9) *
            (height - pad * 2);

        return { x, y };
      })
      .filter(Boolean);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SKILLS.map((skill) => {
          const Icon = skill.icon;
          return (
            <div
              key={skill.key}
              className={`rounded-xl border p-3 ${BORDER}`}
            >
              <div className="flex items-center gap-2">
                <Icon size={17} style={{ color: skill.color }} />
                <span className={`text-xs ${MUTED}`}>
                  {skill.title}
                </span>
              </div>
              <p className={`mt-3 text-xl font-bold ${TITLE}`}>
                {showNumber(latest[skill.key])}
                <span className={`ml-1 text-xs font-normal ${MUTED}`}>
                  / 9
                </span>
              </p>
            </div>
          );
        })}
      </div>

      <div className={`mt-4 rounded-xl border p-3 ${BORDER}`}>
        <div className="mb-3 flex flex-wrap gap-3">
          {SKILLS.map((skill) => (
            <span
              key={skill.key}
              className={`inline-flex items-center gap-1.5 text-xs ${MUTED}`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: skill.color }}
              />
              {skill.title}
            </span>
          ))}
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={ChartNoAxesCombined}
            title="No performance data yet"
            description="Skill trends will appear here when the trainer performance API is connected."
          />
        ) : (
          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full min-w-[350px]"
              role="img"
              aria-label="IELTS performance trend chart"
            >
              {[0, 3, 6, 9].map((band) => {
                const y =
                  height -
                  pad -
                  (band / 9) * (height - pad * 2);

                return (
                  <g key={band}>
                    <line
                      x1={pad}
                      y1={y}
                      x2={width - pad}
                      y2={y}
                      stroke="currentColor"
                      strokeOpacity="0.12"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={pad + 2}
                      y={y - 4}
                      fontSize="9"
                      fill="currentColor"
                      opacity="0.5"
                    >
                      {band}
                    </text>
                  </g>
                );
              })}

              {SKILLS.map((skill) => {
                const points = chartPoints(skill.key);

                if (points.length === 1) {
                  return (
                    <circle
                      key={skill.key}
                      cx={points[0].x}
                      cy={points[0].y}
                      r="4"
                      fill={skill.color}
                    />
                  );
                }

                if (points.length < 2) return null;

                return (
                  <polyline
                    key={skill.key}
                    points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    stroke={skill.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              })}
            </svg>
            <div className={`flex justify-between text-xs ${MUTED}`}>
              <span>{dateText(rows[0]?.date)}</span>
              <span>{dateText(rows.at(-1)?.date)}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function SessionCard({ session, onClick }) {
  const studentName =
    session.student?.profile?.name ||
    session.student?.name ||
    session.studentName ||
    "Student";

  return (
    <div className={`rounded-xl border p-4 ${BORDER}`}>
      <div className="flex flex-wrap justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl p-2.5 ${COLORS.pink}`}>
            <Video size={20} />
          </div>
          <div>
            <p className={`text-sm font-bold ${TITLE}`}>
              {studentName}
            </p>
            <p className={`mt-1 text-xs ${MUTED}`}>
              {session.title || session.testType || "Speaking Test"}
            </p>
          </div>
        </div>
        <Badge status={session.status} />
      </div>

      <div className={`mt-4 flex flex-wrap gap-4 text-xs ${MUTED}`}>
        <span className="inline-flex items-center gap-1">
          <CalendarDays size={14} />
          {dateText(session.scheduledAt || session.startTime, true)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock size={14} />
          {session.durationMinutes != null
            ? `${session.durationMinutes} min`
            : "Duration unavailable"}
        </span>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="mt-4 inline-flex items-center gap-2
          rounded-lg bg-[#FF2454] px-3 py-2
          text-xs font-semibold text-white hover:bg-[#E91F4D]"
      >
        <Eye size={14} />
        View session
      </button>
    </div>
  );
}

function StudentTable({ students, onClick, loading }) {
  return (
    <div className={`overflow-x-auto rounded-xl border ${BORDER}`}>
      <table className="w-full min-w-[660px] text-left">
        <thead className="bg-[#F8FAFF] dark:bg-[#29252F]">
          <tr>
            {[
              "Student", "Batch", "Avg. Band",
              "Progress", "Status", "View",
            ].map((heading) => (
              <th
                key={heading}
                className={`px-3 py-3 text-[11px] font-semibold ${MUTED}`}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6}>
                <LoadingState />
              </td>
            </tr>
          ) : students.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-3">
                <EmptyState
                  icon={Users}
                  title="No students found"
                  description="Students assigned to your batches will appear here."
                />
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr
                key={student.id}
                className={`border-t ${BORDER}`}
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center
                        justify-center rounded-full bg-blue-50
                        text-xs font-bold text-blue-600
                        dark:bg-[#202b3b]"
                    >
                      {initials(student.name)}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold ${TITLE}`}>
                        {student.name}
                      </p>
                      <p className={`text-[11px] ${MUTED}`}>
                        {student.email || "No email"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className={`px-3 py-3 text-xs ${MUTED}`}>
                  {student.batches.map((b) => b.name).join(", ") || "—"}
                </td>

                <td className={`px-3 py-3 text-xs font-bold ${TITLE}`}>
                  {showNumber(student.overallBand)}
                </td>

                <td className="px-3 py-3">
                  <div className="min-w-[100px]">
                    <p className={`mb-1 text-[11px] ${MUTED}`}>
                      {clamp(student.progress) === null
                        ? "—"
                        : `${clamp(student.progress)}%`}
                    </p>
                    <ProgressBar value={student.progress} />
                  </div>
                </td>

                <td className="px-3 py-3">
                  {student.status
                    ? <Badge status={student.status} />
                    : <span className={MUTED}>—</span>}
                </td>

                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => onClick(student)}
                    aria-label={`View ${student.name}`}
                    className="rounded-lg p-2 text-[#7183A7]
                      hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function ActivityCard({ activity }) {
  const type = String(activity.type || "").toUpperCase();
  const Icon =
    type.includes("SPEAKING") ? Mic :
    type.includes("WRITING") ? FilePenLine :
    type.includes("ASSIGNMENT") ? ClipboardList :
    type.includes("STUDENT") ? Users : Activity;

  return (
    <div className={`flex gap-3 border-b py-3 last:border-0 ${BORDER}`}>
      <div
        className={`flex h-10 w-10 shrink-0 items-center
          justify-center rounded-xl ${COLORS.pink}`}
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap justify-between gap-2">
          <p className={`text-sm font-bold ${TITLE}`}>
            {activity.title || "Activity"}
          </p>
          {activity.status && <Badge status={activity.status} />}
        </div>

        <p className={`mt-1 text-xs leading-5 ${MUTED}`}>
          {activity.description || "No additional details"}
        </p>

        {activity.studentName && (
          <p className={`mt-1 text-xs ${MUTED}`}>
            Student: {activity.studentName}
          </p>
        )}

        <p className={`mt-2 text-[11px] ${MUTED}`}>
          {dateText(activity.createdAt, true)}
        </p>
      </div>
    </div>
  );
}

const EMPTY_DASHBOARD = {
  assignments: [],
  batches: [],
  assignmentProgress: {},
  skillPerformance: [],
  speakingSessions: [],
  recentActivities: [],
  writingReviews: [],
  unreadMessages: null,
  connected: {},
  completeness: {},
  errors: {},
};

export default function TrainerDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const result = await trainerService.getDashboardData();

      setDashboard({
        ...EMPTY_DASHBOARD,
        ...result,
      });

      const problems = [];

      if (result.errors?.assignments) {
        problems.push(
          `Assignments: ${result.errors.assignments.message}`
        );
      }

      if (result.errors?.batches) {
        problems.push(
          `Batches: ${result.errors.batches.message}`
        );
      }

      (result.batches || []).forEach((batch) => {
        if (batch.membersError) {
          problems.push(
            `${batch.name || "Batch"}: ${batch.membersError}`
          );
        }
      });

      if (
        result.completeness?.assignments === false &&
        !result.errors?.assignments
      ) {
        problems.push("Assignment listing may be incomplete.");
      }

      if (
        result.completeness?.batches === false &&
        !result.errors?.batches
      ) {
        problems.push("Batch listing may be incomplete.");
      }

      setError(problems.join(" | "));
    } catch (err) {
      setError(err.message || "Unable to load Dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const assignments = dashboard.assignments || [];
  const batches = dashboard.batches || [];

  const students = useMemo(() => {
    const unique = new Map();

    batches.forEach((batch) => {
      (batch.members || []).forEach((member) => {
        const user = member.user || {};
        const id = member.userId || user.id;

        if (!id) return;

        const existing = unique.get(id) || {
          id,
          name:
            user.profile?.name ||
            user.profile?.fullName ||
            user.name ||
            user.email ||
            "Student",
          email: user.email || "",
          batches: [],
          overallBand: null,
          progress: null,
          status: null,
        };

        if (!existing.batches.some((b) => b.id === batch.id)) {
          existing.batches.push({
            id: batch.id,
            name: batch.name || "Unnamed Batch",
          });
        }

        unique.set(id, existing);
      });
    });

    return [...unique.values()];
  }, [batches]);

  const published = assignments.filter(
    (a) => String(a.status).toUpperCase() === "PUBLISHED"
  ).length;

  const drafts = assignments.filter(
    (a) => String(a.status).toUpperCase() === "DRAFT"
  ).length;

  const recentAssignments = useMemo(
    () =>
      [...assignments]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        )
        .slice(0, 3),
    [assignments]
  );

  const speakingSessions = dashboard.speakingSessions || [];
  const activities = dashboard.recentActivities || [];
  const writingReviews = dashboard.writingReviews || [];
  const connected = dashboard.connected || {};

  const pendingReviews = connected.writingReviews
    ? writingReviews.filter(
        (item) => String(item.status).toUpperCase() === "PENDING"
      ).length
    : null;

  const studentCount =
    dashboard.errors?.batches ||
    dashboard.completeness?.batches === false ||
    dashboard.completeness?.members === false
      ? null
      : students.length;

  const batchCount =
    dashboard.errors?.batches ||
    dashboard.completeness?.batches === false
      ? null
      : batches.length;

  const assignmentCount =
    dashboard.errors?.assignments ||
    dashboard.completeness?.assignments === false
      ? null
      : assignments.length;

  const stats = [
    {
      title: "Total Students",
      value: showNumber(studentCount),
      description: "Unique students in assigned batches",
      note: "Student management",
      icon: Users,
      color: "blue",
      path: ROUTES.students,
    },
    {
      title: "Active Batches",
      value: showNumber(batchCount),
      description: "Batches in your institute",
      note: "Batch membership data",
      icon: Layers3,
      color: "purple",
      path: ROUTES.assignments,
    },
    {
      title: "Assignments",
      value: showNumber(assignmentCount),
      description: `${published} published · ${drafts} drafts`,
      note: "Assignment management",
      icon: ClipboardList,
      color: "pink",
      path: ROUTES.assignments,
    },
    {
      title: "Pending Reviews",
      value: showNumber(pendingReviews),
      description: "Writing submissions awaiting review",
      note: "Writing grading queue",
      icon: FilePenLine,
      color: "orange",
      path: ROUTES.writing,
    },
  ];

  const overview = [
    {
      title: "Writing Reviews",
      subtitle: "Review student writing submissions",
      value: showNumber(pendingReviews),
      icon: FilePenLine,
      color: "orange",
      path: ROUTES.writing,
    },
    {
      title: "Speaking Sessions",
      subtitle: "Manage speaking interviews",
      value: connected.speakingSessions
        ? speakingSessions.length
        : "—",
      icon: Video,
      color: "blue",
      path: ROUTES.speaking,
    },
    {
      title: "Assignments",
      subtitle: "Create and manage IELTS tests",
      value: showNumber(assignmentCount),
      icon: ClipboardList,
      color: "purple",
      path: ROUTES.assignments,
    },
    {
      title: "Student Messages",
      subtitle: "Open your conversations",
      value: connected.messages
        ? showNumber(dashboard.unreadMessages)
        : "—",
      icon: MessageCircle,
      color: "green",
      path: ROUTES.messages,
    },
  ];

  const quickActions = [
    {
      title: "Add Student",
      description: "Manage student records",
      icon: UserRoundPlus,
      color: "blue",
      path: ROUTES.students,
    },
    {
      title: "Assign Test",
      description: "Create an assignment",
      icon: ClipboardList,
      color: "purple",
      path: ROUTES.assignments,
    },
    {
      title: "Review Writing",
      description: "Open writing workspace",
      icon: FilePenLine,
      color: "pink",
      path: ROUTES.writing,
    },
    {
      title: "Start Speaking",
      description: "Manage speaking sessions",
      icon: Mic,
      color: "green",
      path: ROUTES.speaking,
    },
  ];

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#F5F7FF]
        text-[#10265F] dark:bg-[#17151B] dark:text-white"
    >
      <Sidebar />

      <div className="flex min-h-screen min-w-0 flex-col lg:ml-[260px]">
        <Navbar />

        <main
          className="min-w-0 flex-1 space-y-5
            p-4 sm:p-5 lg:p-7"
        >
          {/* PAGE HEADER */}
          <section
            className="flex flex-wrap items-start
              justify-between gap-4"
          >
            <div>
              <p className={`mb-2 text-xs ${MUTED}`}>
                Trainer Portal / Dashboard
              </p>
              <h1 className={`text-2xl font-extrabold sm:text-3xl ${TITLE}`}>
                Trainer <span className="text-[#FF2454]">Dashboard</span>
              </h1>
              <p className={`mt-2 text-sm ${MUTED}`}>
                Track students, assignments and IELTS performance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div
                className={`flex items-center gap-2 rounded-xl
                  border bg-white px-3 py-2.5
                  dark:bg-[#211e27] ${BORDER}`}
              >
                <CalendarDays size={16} className={MUTED} />
                <span className={`text-xs font-semibold ${MUTED}`}>
                  {today}
                </span>
              </div>

              <button
                type="button"
                disabled={loading || refreshing}
                onClick={() => loadDashboard(true)}
                className="inline-flex items-center gap-2
                  rounded-xl bg-[#10265F] px-4 py-2.5
                  text-xs font-bold text-white
                  hover:bg-[#193779] disabled:opacity-60"
              >
                <RefreshCw
                  size={15}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </section>

          {/* API ERRORS */}
          {error && (
            <div
              role="alert"
              className="flex flex-wrap items-start
                justify-between gap-3 rounded-xl
                border border-amber-200 bg-amber-50 p-4
                dark:border-amber-500/20 dark:bg-amber-500/10"
            >
              <div className="flex min-w-0 items-start gap-3">
                <CircleAlert
                  size={19}
                  className="shrink-0 text-amber-600"
                />
                <div>
                  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                    Some dashboard data could not be loaded
                  </p>
                  <p className="mt-1 break-words text-xs text-amber-700 dark:text-amber-400">
                    {error}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => loadDashboard(true)}
                className="rounded-lg bg-amber-700 px-3 py-2
                  text-xs font-semibold text-white"
              >
                Try again
              </button>
            </div>
          )}

          {/* 1. FOUR EQUAL SUMMARY CARDS */}
          <section
            className="grid grid-cols-1 items-stretch
              gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {stats.map((item) => (
              <StatCard
                key={item.title}
                item={item}
                loading={loading}
                onClick={() => navigate(item.path)}
              />
            ))}
          </section>

          {/* 2. PERFORMANCE + 3. QUICK OVERVIEW */}
          <section className="grid grid-cols-1 items-stretch gap-5 2xl:grid-cols-5">
            <Panel
              title="Student Performance"
              subtitle="Average IELTS band score across skills"
              className="2xl:col-span-3"
              action={
                <ActionLink onClick={() => navigate(ROUTES.reports)}>
                  Full reports
                </ActionLink>
              }
            >
              <PerformanceChart
                records={dashboard.skillPerformance}
              />
            </Panel>

            <Panel
              title="Quick Overview"
              subtitle="Your daily teaching workload"
              className="2xl:col-span-2"
            >
              <div className="grid gap-3">
                {overview.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => navigate(item.path)}
                      className={`flex w-full items-center gap-3
                        rounded-xl border p-3 text-left
                        transition-colors hover:border-pink-200
                        dark:hover:border-pink-500/30 ${BORDER}`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0
                          items-center justify-center rounded-xl
                          ${COLORS[item.color]}`}
                      >
                        <Icon size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-bold ${TITLE}`}>
                          {item.title}
                        </p>
                        <p className={`mt-1 text-[11px] ${MUTED}`}>
                          {item.subtitle}
                        </p>
                      </div>

                      <span className={`text-lg font-bold ${TITLE}`}>
                        {item.value}
                      </span>
                      <ArrowRight size={15} className={MUTED} />
                    </button>
                  );
                })}
              </div>
            </Panel>
          </section>

          {/* 4. ASSIGNMENTS + 5. SPEAKING */}
          <section className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-2">
            <Panel
              title="Recent Assignments"
              subtitle="Latest assignments in your institute"
              action={
                <ActionLink
                  onClick={() => navigate(ROUTES.assignments)}
                >
                  View all
                </ActionLink>
              }
            >
              {loading ? (
                <LoadingState />
              ) : recentAssignments.length === 0 ? (
                <EmptyState
                  icon={ClipboardList}
                  title="No assignments found"
                  description="Assignments will appear here when they are created."
                />
              ) : (
                <div className="space-y-3">
                  {recentAssignments.map((assignment, index) => (
                    <AssignmentCard
                      key={assignment.id || index}
                      assignment={assignment}
                      index={index}
                      progress={
                        dashboard.assignmentProgress?.[assignment.id]
                      }
                      onClick={() => navigate(ROUTES.assignments)}
                    />
                  ))}
                </div>
              )}
            </Panel>

            <Panel
              title="Upcoming Speaking Sessions"
              subtitle="Your scheduled student interviews"
              action={
                <ActionLink onClick={() => navigate(ROUTES.speaking)}>
                  View schedule
                </ActionLink>
              }
            >
              {speakingSessions.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  title="No speaking sessions available"
                  description="Sessions will appear here after the speaking schedule API is connected."
                />
              ) : (
                <div className="space-y-3">
                  {[...speakingSessions]
                    .sort(
                      (a, b) =>
                        new Date(a.scheduledAt || a.startTime || 0) -
                        new Date(b.scheduledAt || b.startTime || 0)
                    )
                    .slice(0, 4)
                    .map((session, index) => (
                      <SessionCard
                        key={session.id || index}
                        session={session}
                        onClick={() => navigate(ROUTES.speaking)}
                      />
                    ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => navigate(ROUTES.speaking)}
                className={`mt-4 flex w-full items-center
                  justify-center gap-2 rounded-xl border
                  border-dashed py-3 text-xs font-semibold
                  text-[#506995] hover:border-[#FF2454]
                  hover:text-[#FF2454] ${BORDER}`}
              >
                <CalendarDays size={15} />
                Manage Speaking Schedule
              </button>
            </Panel>
          </section>

          {/* 6. STUDENTS + 7. ACTIVITIES */}
          <section className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-5">
            <Panel
              title="Student Performance Overview"
              subtitle="Students in your assigned batches"
              className="xl:col-span-3"
              action={
                <ActionLink onClick={() => navigate(ROUTES.students)}>
                  All students
                </ActionLink>
              }
            >
              <StudentTable
                students={students.slice(0, 5)}
                loading={loading}
                onClick={() => navigate(ROUTES.students)}
              />

              <p className={`mt-3 text-[11px] ${MUTED}`}>
                Band scores and progress will populate when their
                API fields are connected.
              </p>
            </Panel>

            <Panel
              title="Recent Activities"
              subtitle="Latest updates from your students"
              className="xl:col-span-2"
              action={
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.students)}
                  aria-label="View students"
                  className={`rounded-lg p-1.5 ${MUTED}`}
                >
                  <MoreHorizontal size={19} />
                </button>
              }
            >
              {activities.length === 0 ? (
                <EmptyState
                  icon={Activity}
                  title="No recent activities available"
                  description="Assignment submissions, writing reviews and speaking activity will appear after the activity API is connected."
                />
              ) : (
                <div>
                  {[...activities]
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt || 0) -
                        new Date(a.createdAt || 0)
                    )
                    .slice(0, 6)
                    .map((activity, index) => (
                      <ActivityCard
                        key={activity.id || index}
                        activity={activity}
                      />
                    ))}
                </div>
              )}
            </Panel>
          </section>

          {/* 8. QUICK ACTIONS */}
          <section>
            <div className="mb-4">
              <h2 className={`text-base font-bold ${TITLE}`}>
                Quick Actions
              </h2>
              <p className={`mt-1 text-xs ${MUTED}`}>
                Common tasks for your daily workflow
              </p>
            </div>

            <div
              className="grid grid-cols-1 items-stretch
                gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              {quickActions.map((item) => {
                const Icon = item.icon;

                return (
                  <HoverCard
                    key={item.title}
                    onClick={() => navigate(item.path)}
                    contentClassName="min-h-[125px]"
                  >
                    <div className="flex h-full w-full items-center gap-3 p-4">
                      <div
                        className={`flex h-11 w-11 shrink-0
                          items-center justify-center rounded-xl
                          ${COLORS[item.color]}`}
                      >
                        <Icon size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-bold ${TITLE}`}>
                          {item.title}
                        </p>
                        <p className={`mt-1 text-xs ${MUTED}`}>
                          {item.description}
                        </p>
                      </div>

                      <ArrowRight size={16} className={MUTED} />
                    </div>
                  </HoverCard>
                );
              })}
            </div>
          </section>

          <footer className={`pb-2 text-center text-xs ${MUTED}`}>
            Equilx IELTS · Trainer Portal
          </footer>
        </main>
      </div>
    </div>
  );
}
