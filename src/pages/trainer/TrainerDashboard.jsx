
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Layers3,
  ClipboardList,
  FilePenLine,
  TrendingUp,
  TrendingDown,
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
} from "lucide-react";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const trainerStats = [
  {
    title: "Total Students",
    value: "56",
    change: "+8.5%",
    description: "vs last month",
    icon: Users,
    color: "blue",
    trend: "up",
    path: "/trainer/students",
  },
  {
    title: "Active Batches",
    value: "12",
    change: "+2",
    description: "new batches",
    icon: Layers3,
    color: "purple",
    trend: "up",
    path: "/trainer/assignments",
  },
  {
    title: "Assignments",
    value: "34",
    change: "8 pending",
    description: "need attention",
    icon: ClipboardList,
    color: "pink",
    trend: "neutral",
    path: "/trainer/assignments",
  },
  {
    title: "Pending Reviews",
    value: "28",
    change: "12 urgent",
    description: "writing submissions",
    icon: FilePenLine,
    color: "orange",
    trend: "down",
    path: "/trainer/writing-grading",
  },
];

const performanceData = [
  { month: "May", listening: 5.8, reading: 5.4, writing: 5.1, speaking: 5.5 },
  { month: "Jun", listening: 6.0, reading: 5.7, writing: 5.3, speaking: 5.7 },
  { month: "Jul", listening: 6.2, reading: 5.9, writing: 5.6, speaking: 5.9 },
  { month: "Aug", listening: 6.5, reading: 6.1, writing: 5.8, speaking: 6.0 },
  { month: "Sep", listening: 6.7, reading: 6.4, writing: 6.0, speaking: 6.3 },
  { month: "Oct", listening: 7.0, reading: 6.6, writing: 6.2, speaking: 6.5 },
];

const activities = [
  {
    id: 1,
    title: "New student added",
    description: "A new student was added to Morning Batch.",
    time: "10 minutes ago",
    icon: UserRoundPlus,
    color: "blue",
  },
  {
    id: 2,
    title: "Writing submission received",
    description: "A student submitted Writing Task 2 for review.",
    time: "35 minutes ago",
    icon: FilePenLine,
    color: "pink",
  },
  {
    id: 3,
    title: "Assignment completed",
    description: "A student completed Cambridge Reading Practice.",
    time: "1 hour ago",
    icon: CheckCircle2,
    color: "green",
  },
  {
    id: 4,
    title: "Speaking session scheduled",
    description: "A new speaking interview is scheduled for today.",
    time: "2 hours ago",
    icon: Video,
    color: "purple",
  },
];

const upcomingSessions = [
  {
    id: 1,
    name: "Amit Verma",
    initials: "AV",
    type: "Speaking Mock Test",
    date: "Today",
    time: "11:00 AM",
    color: "blue",
  },
  {
    id: 2,
    name: "Priya Sharma",
    initials: "PS",
    type: "Speaking Practice",
    date: "Today",
    time: "12:30 PM",
    color: "pink",
  },
  {
    id: 3,
    name: "Rohit Mehta",
    initials: "RM",
    type: "Speaking Mock Test",
    date: "Today",
    time: "03:00 PM",
    color: "purple",
  },
];

const assignments = [
  {
    id: 1,
    title: "Cambridge IELTS 18 · Reading Test 2",
    batch: "Morning Batch",
    due: "Today, 5:00 PM",
    completed: 18,
    total: 24,
    status: "In Progress",
    color: "blue",
  },
  {
    id: 2,
    title: "Writing Task 2 · Opinion Essay",
    batch: "Evening Batch",
    due: "Tomorrow, 6:00 PM",
    completed: 12,
    total: 20,
    status: "In Progress",
    color: "purple",
  },
  {
    id: 3,
    title: "Listening Practice · Section 3",
    batch: "Weekend Batch",
    due: "Oct 30, 4:00 PM",
    completed: 20,
    total: 22,
    status: "Almost Done",
    color: "green",
  },
];

const topStudents = [
  {
    id: 1,
    name: "Amit Verma",
    batch: "Morning Batch",
    band: "7.5",
    progress: 92,
    initials: "AV",
    color: "blue",
  },
  {
    id: 2,
    name: "Priya Sharma",
    batch: "Evening Batch",
    band: "7.0",
    progress: 86,
    initials: "PS",
    color: "pink",
  },
  {
    id: 3,
    name: "Rohit Mehta",
    batch: "Weekend Batch",
    band: "6.5",
    progress: 74,
    initials: "RM",
    color: "purple",
  },
  {
    id: 4,
    name: "Sneha Joshi",
    batch: "Morning Batch",
    band: "6.5",
    progress: 69,
    initials: "SJ",
    color: "green",
  },
];

const iconColorClasses = {
  blue: "bg-blue-50 text-blue-600 dark:bg-[#202b3b] dark:text-blue-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-[#30263d] dark:text-purple-400",
  pink: "bg-rose-50 text-[#FF2454] dark:bg-[#39232f] dark:text-[#ff6688]",
  orange: "bg-amber-50 text-amber-600 dark:bg-[#3b3020] dark:text-amber-400",
  green: "bg-emerald-50 text-emerald-600 dark:bg-[#1f352e] dark:text-emerald-400",
};

function StatCard({ item, onClick }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group min-w-0 rounded-2xl border border-[#E9EEFA] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#3b3441] dark:bg-[#211e27] sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#7183A7] dark:text-[#b0a5bd] sm:text-sm">
            {item.title}
          </p>

          <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-[#10265F] dark:text-white sm:text-3xl">
            {item.value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconColorClasses[item.color]}`}
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

      <div className="mt-3 flex items-center justify-end gap-1 text-[11px] font-semibold text-[#8A9ABB] transition group-hover:text-[#FF2454] dark:text-[#91899b]">
        View details <ArrowUpRight size={13} />
      </div>
    </button>
  );
}

function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-[#E9EEFA] bg-white p-4 shadow-sm transition-colors duration-300 dark:border-[#3b3441] dark:bg-[#211e27] sm:p-5 ${className}`}
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

function PerformanceChart() {
  const series = [
    {
      key: "listening",
      label: "Listening",
      color: "#3B82F6",
    },
    {
      key: "reading",
      label: "Reading",
      color: "#8B5CF6",
    },
    {
      key: "writing",
      label: "Writing",
      color: "#FF2454",
    },
    {
      key: "speaking",
      label: "Speaking",
      color: "#10B981",
    },
  ];

  const minScore = 4;
  const maxScore = 9;
  const chartWidth = 600;
  const chartHeight = 220;
  const left = 35;
  const right = 12;
  const top = 12;
  const bottom = 30;

  const getX = (index) =>
    left +
    (index / (performanceData.length - 1)) *
      (chartWidth - left - right);

  const getY = (score) =>
    top +
    ((maxScore - score) / (maxScore - minScore)) *
      (chartHeight - top - bottom);

  const getPoints = (key) =>
    performanceData
      .map((item, index) => `${getX(index)},${getY(item[key])}`)
      .join(" ");

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2">
        {series.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-2 text-[11px] text-[#506995] dark:text-[#b0a5bd]"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </div>
        ))}
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-auto w-full"
          role="img"
          aria-label="Illustrative average IELTS band score trends"
        >
          {[4, 5, 6, 7, 8, 9].map((score) => (
            <g key={score}>
              <line
                x1={left}
                y1={getY(score)}
                x2={chartWidth - right}
                y2={getY(score)}
                stroke="#E9EEFA"
                strokeDasharray="4 5"
                className="dark:opacity-30"
              />

              <text
                x="4"
                y={getY(score) + 4}
                fill="#8A9ABB"
                fontSize="11"
                className="dark:opacity-70"
              >
                {score.toFixed(1)}
              </text>
            </g>
          ))}

          {series.map((item) => (
            <g key={item.key}>
              <polyline
                points={getPoints(item.key)}
                fill="none"
                stroke={item.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {performanceData.map((point, index) => (
                <circle
                  key={`${item.key}-${point.month}`}
                  cx={getX(index)}
                  cy={getY(point[item.key])}
                  r="3"
                  fill={item.color}
                  stroke="white"
                  strokeWidth="1.5"
                />
              ))}
            </g>
          ))}

          {performanceData.map((item, index) => (
            <text
              key={item.month}
              x={getX(index)}
              y={chartHeight - 7}
              textAnchor="middle"
              fill="#8A9ABB"
              fontSize="11"
              className="dark:opacity-70"
            >
              {item.month}
            </text>
          ))}
        </svg>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-xl bg-blue-50/70 p-3 dark:bg-[#202b3b]">
        <ChartNoAxesCombined
          size={17}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <p className="text-[11px] leading-5 text-[#506995] dark:text-[#b0a5bd]">
          Average skill-wise band scores are shown here as sample data.
          Connect the report API to display actual student performance.
        </p>
      </div>
    </div>
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
          Completion
        </span>

        <span className="text-[11px] font-bold text-[#10265F] dark:text-white">
          {completed}/{total} students · {percentage}%
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
    </div>
  );
}

export default function TrainerDashboard() {
  const navigate = useNavigate();

  const handleStatClick = (path) => {
    navigate(path);
  };

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

            <div className="flex items-center gap-2 rounded-xl border border-[#E9EEFA] bg-white px-3 py-2.5 shadow-sm dark:border-[#3b3441] dark:bg-[#211e27]">
              <CalendarDays size={16} className="text-[#506995] dark:text-[#b0a5bd]" />

              <span className="text-xs font-semibold text-[#506995] dark:text-[#b0a5bd]">
                October 2026
              </span>
            </div>
          </section>

          {/* Summary Stats */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {trainerStats.map((item) => (
              <StatCard
                key={item.title}
                item={item}
                onClick={() => handleStatClick(item.path)}
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
                  className="flex items-center gap-1 text-xs font-semibold text-[#FF2454] hover:text-rose-700"
                >
                  Full reports <ArrowRight size={14} />
                </button>
              }
              className="2xl:col-span-3"
            >
              <PerformanceChart />
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
                  className="flex w-full items-center gap-3 rounded-xl border border-[#E9EEFA] p-3 text-left transition hover:border-rose-200 hover:bg-rose-50/40 dark:border-[#3b3441] dark:hover:border-[#674052] dark:hover:bg-[#39232f]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#FF2454] dark:bg-[#39232f]">
                    <FilePenLine size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#10265F] dark:text-white">
                      Writing Reviews
                    </p>
                    <p className="mt-1 text-[11px] text-[#8A9ABB] dark:text-[#91899b]">
                      Pending submissions
                    </p>
                  </div>

                  <span className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-[#FF2454] dark:bg-[#49303d] dark:text-[#ff8da7]">
                    28
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/trainer/live-speaking")}
                  className="flex w-full items-center gap-3 rounded-xl border border-[#E9EEFA] p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-[#3b3441] dark:hover:border-[#344d70] dark:hover:bg-[#202b3b]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-[#202b3b]">
                    <Video size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#10265F] dark:text-white">
                      Speaking Sessions
                    </p>
                    <p className="mt-1 text-[11px] text-[#8A9ABB] dark:text-[#91899b]">
                      Scheduled for today
                    </p>
                  </div>

                  <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-600 dark:bg-[#202b3b] dark:text-blue-400">
                    3
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/trainer/assignments")}
                  className="flex w-full items-center gap-3 rounded-xl border border-[#E9EEFA] p-3 text-left transition hover:border-purple-200 hover:bg-purple-50/40 dark:border-[#3b3441] dark:hover:border-[#514064] dark:hover:bg-[#30263d]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-[#30263d]">
                    <ClipboardList size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#10265F] dark:text-white">
                      Assignments Due
                    </p>
                    <p className="mt-1 text-[11px] text-[#8A9ABB] dark:text-[#91899b]">
                      Require follow-up
                    </p>
                  </div>

                  <span className="rounded-lg bg-purple-50 px-2.5 py-1.5 text-xs font-bold text-purple-600 dark:bg-[#30263d] dark:text-purple-400">
                    8
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/trainer/messaging")}
                  className="flex w-full items-center gap-3 rounded-xl border border-[#E9EEFA] p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/40 dark:border-[#3b3441] dark:hover:border-[#315b48] dark:hover:bg-[#1f352e]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-[#1f352e]">
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

                  <ArrowRight size={16} className="text-[#8A9ABB] dark:text-[#91899b]" />
                </button>
              </div>
            </Panel>
          </section>

          {/* Assignments and Speaking Sessions */}
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <Panel
              title="Recent Assignments"
              subtitle="Assignment progress across your batches"
              action={
                <button
                  type="button"
                  onClick={() => navigate("/trainer/assignments")}
                  className="text-xs font-semibold text-[#FF2454] hover:text-rose-700"
                >
                  View all
                </button>
              }
            >
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="rounded-xl border border-[#E9EEFA] p-3.5 dark:border-[#3b3441] sm:p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          iconColorClasses[assignment.color]
                        }`}
                      >
                        <BookOpen size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-bold leading-5 text-[#10265F] dark:text-white">
                          {assignment.title}
                        </h3>

                        <p className="mt-1 text-[11px] text-[#8A9ABB] dark:text-[#91899b]">
                          {assignment.batch}
                        </p>

                        <p className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-[#7183A7] dark:text-[#b0a5bd]">
                          <Clock size={12} />
                          Due {assignment.due}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate("/trainer/assignments")}
                        aria-label={`View ${assignment.title}`}
                        className="rounded-lg p-1.5 text-[#8A9ABB] hover:bg-[#F5F7FF] hover:text-[#10265F] dark:text-[#91899b] dark:hover:bg-[#302b37] dark:hover:text-white"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    <div className="mt-4">
                      <AssignmentProgress
                        completed={assignment.completed}
                        total={assignment.total}
                        color={assignment.color}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel
              title="Upcoming Speaking Sessions"
              subtitle="Your scheduled student interviews"
              action={
                <button
                  type="button"
                  onClick={() => navigate("/trainer/live-speaking")}
                  className="text-xs font-semibold text-[#FF2454] hover:text-rose-700"
                >
                  View schedule
                </button>
              }
            >
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-[#E9EEFA] p-3 dark:border-[#3b3441]"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        iconColorClasses[session.color]
                      }`}
                    >
                      {session.initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#10265F] dark:text-white">
                        {session.name}
                      </p>

                      <p className="mt-1 text-[10px] text-[#8A9ABB] dark:text-[#91899b]">
                        {session.type}
                      </p>

                      <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-[#506995] dark:text-[#b0a5bd]">
                        <CalendarDays size={12} />
                        {session.date}
                        <span className="text-[#CBD5E1] dark:text-[#625a6c]">•</span>
                        <Clock size={12} />
                        {session.time}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/trainer/live-speaking")}
                      className="flex items-center gap-1.5 rounded-lg bg-[#10265F] px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-[#193779] dark:bg-[#35466d] dark:hover:bg-[#425780]"
                    >
                      <Video size={13} />
                      Open
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigate("/trainer/live-speaking")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#CBD5E1] py-3 text-xs font-semibold text-[#506995] transition hover:border-[#FF2454] hover:text-[#FF2454] dark:border-[#4a4352] dark:text-[#b0a5bd]"
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
              subtitle="Students making progress in their IELTS preparation"
              action={
                <button
                  type="button"
                  onClick={() => navigate("/trainer/students")}
                  className="text-xs font-semibold text-[#FF2454] hover:text-rose-700"
                >
                  All students
                </button>
              }
              className="xl:col-span-3"
            >
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
                    {topStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-[#F0F3FA] last:border-0 dark:border-[#3b3441]"
                      >
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                iconColorClasses[student.color]
                              }`}
                            >
                              {student.initials}
                            </div>

                            <span className="text-xs font-semibold text-[#10265F] dark:text-white">
                              {student.name}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 pr-3 text-[11px] text-[#7183A7] dark:text-[#b0a5bd]">
                          {student.batch}
                        </td>

                        <td className="py-3 pr-3">
                          <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 dark:bg-[#202b3b] dark:text-blue-300">
                            {student.band}
                          </span>
                        </td>

                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#EEF2FA] dark:bg-[#393441]">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>

                            <span className="text-[10px] font-semibold text-[#506995] dark:text-[#b0a5bd]">
                              {student.progress}%
                            </span>
                          </div>
                        </td>

                        <td className="py-3 pl-2 text-right">
                          <button
                            type="button"
                            onClick={() => navigate("/trainer/reports")}
                            aria-label={`View ${student.name}'s report`}
                            className="rounded-lg p-2 text-[#7183A7] transition hover:bg-blue-50 hover:text-blue-600 dark:text-[#b0a5bd] dark:hover:bg-[#202b3b]"
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel
              title="Recent Activities"
              subtitle="Latest updates from your students"
              action={
                <button
                  type="button"
                  onClick={() => navigate("/trainer/students")}
                  aria-label="View students"
                  className="rounded-lg p-1.5 text-[#8A9ABB] hover:bg-[#F5F7FF] dark:text-[#91899b] dark:hover:bg-[#302b37]"
                >
                  <MoreHorizontal size={18} />
                </button>
              }
              className="xl:col-span-2"
            >
              <div className="space-y-4">
                {activities.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          iconColorClasses[activity.color]
                        }`}
                      >
                        <Icon size={16} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold leading-5 text-[#10265F] dark:text-white">
                          {activity.title}
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-[#7183A7] dark:text-[#b0a5bd]">
                          {activity.description}
                        </p>

                        <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#9AA8C2] dark:text-[#91899b]">
                          <Clock size={11} />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
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
              <button
                type="button"
                onClick={() => navigate("/trainer/students")}
                className="flex items-center gap-3 rounded-2xl border border-[#E9EEFA] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#3b3441] dark:bg-[#211e27]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-[#202b3b]">
                  <UserRoundPlus size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#10265F] dark:text-white">
                    Add Student
                  </p>

                  <p className="mt-1 text-[10px] text-[#8A9ABB] dark:text-[#91899b]">
                    Register a student
                  </p>
                </div>

                <ArrowRight size={15} className="text-[#8A9ABB] dark:text-[#91899b]" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/trainer/assignments")}
                className="flex items-center gap-3 rounded-2xl border border-[#E9EEFA] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#3b3441] dark:bg-[#211e27]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-[#30263d]">
                  <ClipboardList size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#10265F] dark:text-white">
                    Assign Test
                  </p>

                  <p className="mt-1 text-[10px] text-[#8A9ABB] dark:text-[#91899b]">
                    Create an assignment
                  </p>
                </div>

                <ArrowRight size={15} className="text-[#8A9ABB] dark:text-[#91899b]" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/trainer/writing-grading")}
                className="flex items-center gap-3 rounded-2xl border border-[#E9EEFA] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#3b3441] dark:bg-[#211e27]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#FF2454] dark:bg-[#39232f]">
                  <FilePenLine size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#10265F] dark:text-white">
                    Review Writing
                  </p>

                  <p className="mt-1 text-[10px] text-[#8A9ABB] dark:text-[#91899b]">
                    Grade submissions
                  </p>
                </div>

                <ArrowRight size={15} className="text-[#8A9ABB] dark:text-[#91899b]" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/trainer/live-speaking")}
                className="flex items-center gap-3 rounded-2xl border border-[#E9EEFA] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#3b3441] dark:bg-[#211e27]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-[#1f352e]">
                  <Mic size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#10265F] dark:text-white">
                    Start Speaking
                  </p>

                  <p className="mt-1 text-[10px] text-[#8A9ABB] dark:text-[#91899b]">
                    Manage interviews
                  </p>
                </div>

                <ArrowRight size={15} className="text-[#8A9ABB] dark:text-[#91899b]" />
              </button>
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
