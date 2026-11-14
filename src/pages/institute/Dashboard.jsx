
import React from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar";
import {
  Users,
  ChartNoAxesCombined,
  UserRound,
  CircleCheck,
  CalendarDays,
  ClipboardList,
  Video,
  CreditCard,
  ArrowUpRight,
  ArrowRight,
  BookOpen,
} from "lucide-react";

const students = [
  { name: "Riya Sharma", batch: "Batch A", date: "Oct 25", band: "7.5" },
  { name: "Aman Verma", batch: "Batch B", date: "Oct 24", band: "6.0" },
  { name: "Sneha Patel", batch: "Batch A", date: "Oct 22", band: "8.0" },
  { name: "Karan Singh", batch: "Batch C", date: "Oct 20", band: "6.5" },
  { name: "Priya Mehta", batch: "Batch B", date: "Oct 18", band: "7.0" },
];

const trainers = [
  { name: "Aman Sharma", initials: "AS", students: 48, batches: 4, completion: 82 },
  { name: "Pooja Gupta", initials: "PG", students: 36, batches: 3, completion: 78 },
  { name: "Rahul Kumar", initials: "RK", students: 28, batches: 2, completion: 80 },
  { name: "Neha Singh", initials: "NS", students: 24, batches: 3, completion: 71 },
  { name: "Vikram Patel", initials: "VP", students: 20, batches: 2, completion: 85 },
];

const activities = [
  {
    title: "New assignment created",
    detail: "Reading Practice Test - Batch A",
    time: "2 hours ago",
    icon: ClipboardList,
    color: "rose",
  },
  {
    title: "5 new students enrolled",
    detail: "From website and lead form",
    time: "4 hours ago",
    icon: Users,
    color: "blue",
  },
  {
    title: "Writing test graded",
    detail: "Aman Verma - Task 2",
    time: "6 hours ago",
    icon: BookOpen,
    color: "purple",
  },
  {
    title: "Live speaking session completed",
    detail: "Riya Sharma",
    time: "7 hours ago",
    icon: Video,
    color: "green",
  },
  {
    title: "Payment received",
    detail: "₹12,000 - 6 Months Plan",
    time: "1 day ago",
    icon: CreditCard,
    color: "orange",
  },
];

const stats = [
  {
    title: "Total Students",
    value: "248",
    change: "12%",
    subtitle: "from last month",
    icon: Users,
    color: "rose",
    points: "0,38 30,31 55,35 83,23 110,28 138,18 164,24 194,11 220,15 250,2",
  },
  {
    title: "Average Band Score",
    value: "6.8",
    change: "0.4",
    subtitle: "from last month",
    icon: ChartNoAxesCombined,
    color: "purple",
    points: "0,39 30,32 55,35 83,24 110,19 138,29 164,23 194,13 220,17 250,3",
  },
  {
    title: "Active Trainers",
    value: "12",
    change: "2",
    subtitle: "from last month",
    icon: UserRound,
    color: "blue",
    points: "0,39 30,31 55,35 83,24 110,18 138,27 164,22 194,12 220,16 250,3",
  },
  {
    title: "Assignment Completion",
    value: "76%",
    change: "8%",
    subtitle: "from last month",
    icon: CircleCheck,
    color: "green",
    points: "0,39 30,31 55,35 83,21 110,27 138,18 164,24 194,11 220,16 250,2",
  },
];

const colorStyles = {
  rose: {
    icon: "bg-rose-50 text-rose-500 dark:bg-rose-500/15 dark:text-rose-400",
    line: "#FF3864",
    fill: "#FF3864",
  },
  purple: {
    icon: "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
    line: "#A044FF",
    fill: "#A044FF",
  },
  blue: {
    icon: "bg-blue-50 text-blue-500 dark:bg-blue-500/15 dark:text-blue-400",
    line: "#2995FF",
    fill: "#2995FF",
  },
  green: {
    icon: "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-400",
    line: "#06C99A",
    fill: "#06C99A",
  },
  orange: {
    icon: "bg-orange-50 text-orange-500 dark:bg-orange-500/15 dark:text-orange-400",
    line: "#FF9D35",
    fill: "#FF9D35",
  },
};

// KPI Card
function StatCard({ item }) {
  const Icon = item.icon;
  const colors = colorStyles[item.color];

  return (
    <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${colors.icon}`}
        >
          <Icon size={27} strokeWidth={2.5} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#10265F] dark:text-white">
            {item.title}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-[#10265F] dark:text-white">
              {item.value}
            </span>

            <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-500">
              <ArrowUpRight size={15} />
              {item.change}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-[#91899B]">
            {item.subtitle}
          </p>
        </div>
      </div>

      <svg
        viewBox="0 0 250 45"
        preserveAspectRatio="none"
        className="mt-3 h-10 w-full"
        aria-label={`${item.title} trend`}
      >
        <defs>
          <linearGradient
            id={`gradient-${item.color}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={colors.fill} stopOpacity="0.22" />
            <stop offset="100%" stopColor={colors.fill} stopOpacity="0" />
          </linearGradient>
        </defs>

        <polygon
          points={`0,45 ${item.points} 250,45`}
          fill={`url(#gradient-${item.color})`}
        />

        <polyline
          points={item.points}
          fill="none"
          stroke={colors.line}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// Common Panel
function Panel({ title, children, className = "", action }) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-[#3B3441] dark:bg-[#211E27] ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-[#10265F] dark:text-white">
          {title}
        </h2>

        {action}
      </div>

      {children}
    </section>
  );
}

// Performance Chart
function PerformanceChart() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May",
    "Jun", "Jul", "Aug", "Sep", "Oct",
  ];

  const lines = [
    {
      name: "Overall",
      color: "#FF3864",
      values: [4.7, 5.4, 6.2, 6.6, 6.8, 7.1, 7.7, 8.2, 8.7, 9.0, 9.4],
    },
    {
      name: "Listening",
      color: "#A044FF",
      values: [3.8, 4.4, 5.0, 5.3, 5.7, 6.1, 6.5, 6.8, 7.2, 7.5, 8.1],
    },
    {
      name: "Reading",
      color: "#2995FF",
      values: [2.9, 3.3, 3.8, 4.0, 4.4, 4.9, 5.2, 5.7, 6.1, 6.5, 7.0],
    },
    {
      name: "Writing",
      color: "#06C99A",
      values: [2.6, 3.0, 3.5, 3.8, 4.0, 4.5, 4.8, 5.2, 5.8, 6.0, 6.4],
    },
    {
      name: "Speaking",
      color: "#FF9D35",
      values: [2.4, 2.8, 3.2, 3.5, 3.8, 4.1, 4.5, 4.8, 5.2, 5.7, 6.0],
    },
  ];

  const x = (index) => 34 + index * 68;
  const y = (value) => 178 - value * 15.5;

  return (
    <Panel title="Performance Overview" className="xl:col-span-2">
      <div className="mb-3 flex flex-wrap gap-x-3 gap-y-2">
        {lines.map((line) => (
          <span
            key={line.name}
            className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-[#B0A5BD]"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: line.color }}
            />
            {line.name}
          </span>
        ))}
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox="0 0 720 230"
          className="w-full"
          role="img"
          aria-label="Institute skill performance trend chart"
        >
          {[0, 2, 4, 6, 8, 10].map((tick) => (
            <g key={tick}>
              <line
                x1="34"
                y1={y(tick)}
                x2="710"
                y2={y(tick)}
                stroke="#8B8494"
                strokeOpacity="0.2"
                strokeWidth="1"
              />

              <text
                x="7"
                y={y(tick) + 4}
                fill="#91899B"
                fontSize="11"
              >
                {tick}
              </text>
            </g>
          ))}

          {months.map((month, index) => (
            <g key={month}>
              <line
                x1={x(index)}
                y1="23"
                x2={x(index)}
                y2="178"
                stroke="#8B8494"
                strokeOpacity="0.12"
              />

              <text
                x={x(index)}
                y="204"
                textAnchor="middle"
                fill="#91899B"
                fontSize="11"
              >
                {month}
              </text>
            </g>
          ))}

          {lines.map((line) => (
            <g key={line.name}>
              <polyline
                points={line.values
                  .map((value, index) => `${x(index)},${y(value)}`)
                  .join(" ")}
                fill="none"
                stroke={line.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {line.values.map((value, index) => (
                <circle
                  key={`${line.name}-${index}`}
                  cx={x(index)}
                  cy={y(value)}
                  r="2.5"
                  className="fill-white dark:fill-[#211E27]"
                  stroke={line.color}
                  strokeWidth="1.5"
                />
              ))}
            </g>
          ))}
        </svg>
      </div>
    </Panel>
  );
}

// Band Distribution
function BandDistribution() {
  const bands = [
    { name: "Band 8.0+", count: 12, percent: "5%", color: "#A044FF" },
    { name: "Band 7.0 - 8.0", count: 54, percent: "22%", color: "#2995FF" },
    { name: "Band 6.0 - 7.0", count: 92, percent: "37%", color: "#27D5AC" },
    { name: "Band 5.0 - 6.0", count: 60, percent: "24%", color: "#FF7199" },
    { name: "Below 5.0", count: 30, percent: "12%", color: "#FFA34D" },
  ];

  return (
    <Panel title="Students by Band Score">
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        <div
          className="relative h-36 w-36 shrink-0 rounded-full"
          style={{
            background:
              "conic-gradient(#A044FF 0% 5%, #2995FF 5% 27%, #27D5AC 27% 64%, #FF7199 64% 88%, #FFA34D 88% 100%)",
          }}
        >
          <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white dark:bg-[#211E27]">
            <span className="text-2xl font-extrabold text-[#10265F] dark:text-white">
              248
            </span>

            <span className="text-xs text-slate-500 dark:text-[#B0A5BD]">
              Students
            </span>
          </div>
        </div>

        <div className="w-full space-y-3">
          {bands.map((band) => (
            <div
              key={band.name}
              className="flex items-center gap-2 text-[11px]"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: band.color }}
              />

              <span className="min-w-0 flex-1 text-slate-500 dark:text-[#B0A5BD]">
                {band.name}
              </span>

              <span className="font-bold text-[#10265F] dark:text-white">
                {band.count}
              </span>

              <span className="w-9 text-right text-slate-400 dark:text-[#91899B]">
                ({band.percent})
              </span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

// Recent Students
function RecentStudents() {
  return (
    <Panel
      title="Recent Students"
      action={
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View all <ArrowRight size={14} />
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[390px] text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 dark:bg-[#19171E] dark:text-[#B0A5BD]">
            <tr>
              {["#", "Name", "Batch", "Last Test", "Band", "Status"].map(
                (heading) => (
                  <th key={heading} className="px-2 py-2 font-medium">
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr
                key={student.name}
                className="border-b border-slate-50 last:border-0 dark:border-[#3B3441]"
              >
                <td className="px-2 py-3 text-slate-400 dark:text-[#91899B]">
                  {index + 1}
                </td>

                <td className="whitespace-nowrap px-2 py-3 font-medium text-[#10265F] dark:text-white">
                  {student.name}
                </td>

                <td className="px-2 py-3 text-slate-500 dark:text-[#B0A5BD]">
                  {student.batch}
                </td>

                <td className="whitespace-nowrap px-2 py-3 text-slate-500 dark:text-[#B0A5BD]">
                  {student.date}
                </td>

                <td className="px-2 py-3">
                  <span className="rounded-md bg-emerald-50 px-2 py-1 font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                    {student.band}
                  </span>
                </td>

                <td className="px-2 py-3">
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                    Active
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

// Trainer Workload
function TrainerWorkload() {
  return (
    <Panel
      title="Trainer Workload"
      action={
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View all <ArrowRight size={14} />
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[330px] text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 dark:bg-[#19171E] dark:text-[#B0A5BD]">
            <tr>
              {["#", "Trainer", "Students", "Batches", "Completion"].map(
                (heading) => (
                  <th key={heading} className="px-2 py-2 font-medium">
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {trainers.map((trainer, index) => (
              <tr
                key={trainer.name}
                className="border-b border-slate-50 last:border-0 dark:border-[#3B3441]"
              >
                <td className="px-2 py-3 text-slate-400 dark:text-[#91899B]">
                  {index + 1}
                </td>

                <td className="whitespace-nowrap px-2 py-3 font-medium text-[#10265F] dark:text-white">
                  <span className="mr-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-[9px] font-bold text-purple-600 dark:bg-purple-500/15 dark:text-purple-400">
                    {trainer.initials}
                  </span>

                  {trainer.name}
                </td>

                <td className="px-2 py-3 text-slate-600 dark:text-[#B0A5BD]">
                  {trainer.students}
                </td>

                <td className="px-2 py-3 text-slate-600 dark:text-[#B0A5BD]">
                  {trainer.batches}
                </td>

                <td className="px-2 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-[#3B3441]">
                      <div
                        className="h-full rounded-full bg-emerald-400"
                        style={{ width: `${trainer.completion}%` }}
                      />
                    </div>

                    <span className="text-slate-500 dark:text-[#B0A5BD]">
                      {trainer.completion}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

// Recent Activities
function RecentActivities() {
  return (
    <Panel title="Recent Activities">
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          const color = colorStyles[activity.color];

          return (
            <div
              key={activity.title}
              className="flex items-start gap-3"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color.icon}`}
              >
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#10265F] dark:text-white">
                  {activity.title}
                </p>

                <p className="mt-1 text-[11px] text-slate-500 dark:text-[#B0A5BD]">
                  {activity.detail}
                </p>
              </div>

              <span className="shrink-0 text-[10px] text-slate-400 dark:text-[#91899B]">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

// Main Dashboard
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F5F7FF] transition-colors duration-300 dark:bg-[#17151B]">
      <Sidebar />

      {/* Main content starts after the fixed 260px sidebar */}
      <div className="ml-[260px] flex min-h-screen min-w-0 flex-col">
        <Navbar />

        <main className="min-w-0 flex-1 space-y-5 overflow-x-hidden p-4 transition-colors duration-300 md:p-6">
          {/* Page Heading */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#6B7FA8] dark:text-[#B0A5BD]">
                Welcome back,
              </p>

              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#10265F] dark:text-white">
                Institute <span className="text-[#FF2454]">Dashboard</span>
              </h1>

              <p className="mt-2 text-sm text-[#7183A7] dark:text-[#91899B]">
                Here's an overview of your institute's performance, students,
                trainers and more.
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-medium text-[#10265F] shadow-sm transition hover:border-pink-200 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-white dark:hover:border-[#FF2454]"
            >
              <CalendarDays size={18} className="text-blue-600 dark:text-blue-400" />
              Oct 1, 2025 - Oct 31, 2025
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {stats.map((item) => (
              <StatCard key={item.title} item={item} />
            ))}
          </div>

          {/* Performance and Band Score */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <PerformanceChart />
            <BandDistribution />
          </div>

          {/* Tables and Activities */}
          <div className="grid grid-cols-1 gap-4 2xl:grid-cols-3">
            <RecentStudents />
            <TrainerWorkload />
            <RecentActivities />
          </div>

          <footer className="pb-2 text-center text-xs text-slate-400 dark:text-[#91899B]">
            Equilx IELTS Institute Portal
          </footer>
        </main>
      </div>
    </div>
  );
}
