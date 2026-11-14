
import React from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import {
  Users,
  Building2,
  CreditCard,
  IndianRupee,
  TrendingUp,
  BrainCircuit,
  Activity,
  Database,
  Server,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ShieldCheck,
  Zap,
  BookOpen,
  CircleDollarSign,
} from "lucide-react";

/* =========================
   DASHBOARD DATA
========================= */

const platformStats = [
  {
    title: "Total Users",
    value: "12,486",
    change: "+12%",
    subtitle: "vs last month",
    icon: Users,
    color: "blue",
    positive: true,
  },
  {
    title: "Total Institutes",
    value: "145",
    change: "+8%",
    subtitle: "vs last month",
    icon: Building2,
    color: "purple",
    positive: true,
  },
  {
    title: "Active Subscriptions",
    value: "1,236",
    change: "+15%",
    subtitle: "vs last month",
    icon: CreditCard,
    color: "pink",
    positive: true,
  },
  {
    title: "Monthly Revenue",
    value: "₹12,48,500",
    change: "+18%",
    subtitle: "vs last month",
    icon: IndianRupee,
    color: "green",
    positive: true,
  },
];

const activities = [
  {
    id: 1,
    title: "New institute registered",
    description: "Arya College joined the platform",
    time: "5 min ago",
    icon: Building2,
    color: "blue",
  },
  {
    id: 2,
    title: "Subscription upgraded",
    description: "Purnima College upgraded to Institute 12M",
    time: "18 min ago",
    icon: TrendingUp,
    color: "purple",
  },
  {
    id: 3,
    title: "Refund processed",
    description: "Refund of ₹2,999 recorded",
    time: "1 hour ago",
    icon: RefreshCw,
    color: "pink",
  },
  {
    id: 4,
    title: "Cambridge content published",
    description: "Book 16 · Listening Test 2",
    time: "2 hours ago",
    icon: BookOpen,
    color: "green",
  },
];

const systemServices = [
  { name: "API Server", status: "Operational", value: "100%" },
  { name: "Database", status: "Operational", value: "100%" },
  { name: "Background Jobs", status: "Monitoring", value: "90%" },
  { name: "Storage", status: "Operational", value: "100%" },
];

const revenuePlans = [
  { name: "Student Pro", percentage: 42, color: "#FF2454" },
  { name: "Institute 6M", percentage: 28, color: "#8B5CF6" },
  { name: "Institute 12M", percentage: 20, color: "#3B82F6" },
  { name: "Free Plan", percentage: 10, color: "#CBD5E1" },
];

/* =========================
   STAT CARD
========================= */

function StatCard({ item }) {
  const Icon = item.icon;

  const iconColors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/40",
    pink: "bg-rose-50 text-[#FF2454] dark:bg-rose-950/30",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30",
  };

  return (
    <div className="min-w-0 rounded-2xl border border-[#E9EEFA] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#7183A7] sm:text-sm dark:text-[#B0A5BD]">
            {item.title}
          </p>

          <h3 className="mt-2 break-words text-2xl font-extrabold tracking-tight text-[#10265F] sm:text-[27px] dark:text-white">
            {item.value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconColors[item.color]}`}
        >
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1 text-xs font-bold ${
            item.positive ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {item.positive ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}
          {item.change}
        </span>

        <span className="text-[11px] text-[#8A9ABB] dark:text-[#B0A5BD]">
          {item.subtitle}
        </span>
      </div>
    </div>
  );
}

/* =========================
   REUSABLE PANEL
========================= */

function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-[#E9EEFA] bg-white p-4 shadow-sm sm:p-5 dark:border-[#3B3441] dark:bg-[#211E27] ${className}`}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#10265F] sm:text-base dark:text-white">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-xs leading-5 text-[#8A9ABB] dark:text-[#B0A5BD]">
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

/* =========================
   GROWTH CHART
========================= */

function GrowthChart() {
  const users = [30, 42, 38, 55, 49, 65, 61, 79, 70, 91, 86, 100];
  const institutes = [18, 25, 22, 35, 30, 42, 39, 51, 46, 61, 56, 70];

  const makePoints = (values) =>
    values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * 100;
        const y = 100 - value;
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <span className="flex items-center gap-2 text-xs text-[#506995] dark:text-[#B0A5BD]">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Users
        </span>

        <span className="flex items-center gap-2 text-xs text-[#506995] dark:text-[#B0A5BD]">
          <span className="h-2 w-2 rounded-full bg-[#FF4778]" />
          Institutes
        </span>
      </div>

      <div className="relative h-[190px] w-full">
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="w-full border-t border-dashed border-slate-100 dark:border-[#3B3441]"
            />
          ))}
        </div>

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
          role="img"
          aria-label="Illustrative user and institute growth chart"
        >
          <defs>
            <linearGradient id="usersFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>

            <linearGradient
              id="institutesFill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#FF4778" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FF4778" stopOpacity="0" />
            </linearGradient>
          </defs>

          <polygon
            points={`0,100 ${makePoints(users)} 100,100`}
            fill="url(#usersFill)"
          />

          <polygon
            points={`0,100 ${makePoints(institutes)} 100,100`}
            fill="url(#institutesFill)"
          />

          <polyline
            points={makePoints(users)}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <polyline
            points={makePoints(institutes)}
            fill="none"
            stroke="#FF4778"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="mt-3 flex justify-between text-[10px] text-[#8A9ABB] sm:text-xs dark:text-[#B0A5BD]">
        <span>Oct 01</span>
        <span>Oct 08</span>
        <span>Oct 15</span>
        <span>Oct 22</span>
        <span>Oct 31</span>
      </div>
    </div>
  );
}

/* =========================
   REVENUE DISTRIBUTION
========================= */

function RevenueDistribution() {
  let offset = 0;

  const gradient = revenuePlans
    .map((plan) => {
      const start = offset;
      offset += plan.percentage;
      return `${plan.color} ${start}% ${offset}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
      <div
        className="relative h-36 w-36 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
        role="img"
        aria-label="Illustrative revenue distribution by subscription plan"
      >
        <div className="absolute inset-[22px] flex flex-col items-center justify-center rounded-full bg-white dark:bg-[#211E27]">
          <span className="text-[10px] text-[#8A9ABB] dark:text-[#B0A5BD]">
            Plan Share
          </span>
          <span className="mt-1 text-lg font-extrabold text-[#10265F] dark:text-white">
            100%
          </span>
        </div>
      </div>

      <div className="w-full space-y-4 sm:max-w-[190px]">
        {revenuePlans.map((plan) => (
          <div
            key={plan.name}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex min-w-0 items-center gap-2 text-xs text-[#506995] dark:text-[#B0A5BD]">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: plan.color }}
              />
              <span className="truncate">{plan.name}</span>
            </span>

            <span className="text-xs font-bold text-[#10265F] dark:text-white">
              {plan.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================
   AI USAGE PANEL
========================= */

function AIUsagePanel() {
  const bars = [
    30, 44, 36, 55, 49, 70, 57, 76, 64,
    85, 72, 95, 80, 100, 84, 91, 74, 88,
  ];

  return (
    <Panel
      title="AI Usage & Cost"
      subtitle="Illustrative platform-wide AI metrics"
      action={
        <span className="rounded-lg bg-purple-50 px-2.5 py-1.5 text-[10px] font-semibold text-purple-600 dark:bg-purple-950/40">
          Last 30 days
        </span>
      }
    >
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div>
          <p className="text-[10px] text-[#8A9ABB] sm:text-xs dark:text-[#B0A5BD]">
            AI Requests
          </p>
          <p className="mt-2 break-words text-base font-extrabold text-[#10265F] sm:text-xl dark:text-white">
            2,48,632
          </p>
          <p className="mt-1 text-[10px] font-semibold text-emerald-600">
            +22%
          </p>
        </div>

        <div>
          <p className="text-[10px] text-[#8A9ABB] sm:text-xs dark:text-[#B0A5BD]">
            Total Cost
          </p>
          <p className="mt-2 break-words text-base font-extrabold text-[#10265F] sm:text-xl dark:text-white">
            ₹18,420
          </p>
          <p className="mt-1 text-[10px] font-semibold text-emerald-600">
            +16%
          </p>
        </div>

        <div>
          <p className="text-[10px] text-[#8A9ABB] sm:text-xs dark:text-[#B0A5BD]">
            Avg. Cost / Request
          </p>
          <p className="mt-2 break-words text-base font-extrabold text-[#10265F] sm:text-xl dark:text-white">
            ₹0.07
          </p>
          <p className="mt-1 text-[10px] font-semibold text-emerald-600">
            Stable
          </p>
        </div>
      </div>

      <div className="mt-6 flex h-16 items-end gap-1.5">
        {bars.map((height, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-sm bg-gradient-to-t from-purple-100 to-purple-400 dark:from-purple-950 dark:to-purple-500"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      <div className="mt-3 flex justify-between text-[10px] text-[#8A9ABB] dark:text-[#B0A5BD]">
        <span>Oct 01</span>
        <span>Oct 10</span>
        <span>Oct 20</span>
        <span>Oct 31</span>
      </div>
    </Panel>
  );
}

/* =========================
   SYSTEM HEALTH PANEL
========================= */

function SystemHealthPanel() {
  return (
    <Panel
      title="System Health"
      subtitle="Service status overview"
      action={
        <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-950/30">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Demo status
        </span>
      }
    >
      <div className="space-y-4">
        {systemServices.map((service) => {
          const isHealthy = service.status === "Operational";

          return (
            <div
              key={service.name}
              className="flex items-center gap-3"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  isHealthy
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30"
                    : "bg-amber-50 text-amber-600 dark:bg-amber-950/30"
                }`}
              >
                {service.name === "Database" ? (
                  <Database size={17} />
                ) : service.name === "Background Jobs" ? (
                  <Zap size={17} />
                ) : service.name === "Storage" ? (
                  <Activity size={17} />
                ) : (
                  <Server size={17} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#10265F] dark:text-white">
                  {service.name}
                </p>

                <p
                  className={`mt-1 text-[10px] ${
                    isHealthy ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {service.status}
                </p>
              </div>

              <span className="text-xs font-bold text-[#10265F] dark:text-white">
                {service.value}
              </span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

/* =========================
   RECENT ACTIVITY PANEL
========================= */

function ActivityPanel() {
  const iconStyles = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/40",
    pink: "bg-rose-50 text-[#FF2454] dark:bg-rose-950/30",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30",
  };

  return (
    <Panel
      title="Recent Administrative Activities"
      subtitle="Latest platform events"
      action={
        <button
          type="button"
          onClick={() => {
            window.location.href = "/superadmin/audit-logs";
          }}
          className="text-xs font-semibold text-[#FF2454] hover:text-rose-700"
        >
          View all
        </button>
      }
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
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconStyles[activity.color]}`}
              >
                <Icon size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold leading-5 text-[#10265F] dark:text-white">
                  {activity.title}
                </p>

                <p className="mt-0.5 text-[11px] leading-4 text-[#7183A7] dark:text-[#B0A5BD]">
                  {activity.description}
                </p>

                <p className="mt-1.5 flex items-center gap-1 text-[10px] text-[#9AA8C2] dark:text-[#B0A5BD]">
                  <Clock size={11} />
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

/* =========================
   SUPER ADMIN DASHBOARD
========================= */

export default function SuperAdminDashboard() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F7FF] dark:bg-[#17151B]">
      {/* Fixed sidebar stays separate from the content area */}
      <Sidebar />

      {/* IMPORTANT:
          Sidebar width = 260px on large screens.
          If your Sidebar.jsx width is different, update lg:ml-[260px].
      */}
      <div className="flex min-h-screen min-w-0 flex-col lg:ml-[260px]">
        <Navbar />

        <main className="min-w-0 flex-1 space-y-5 overflow-x-hidden p-4 sm:p-5 lg:p-6">
          {/* PAGE HEADING */}
          <section className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2 text-xs text-[#7183A7] dark:text-[#B0A5BD]">
                <span>Super Admin</span>
                <span>›</span>
                <span className="text-[#10265F] dark:text-white">Dashboard</span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-[#10265F] sm:text-3xl dark:text-white">
                Platform <span className="text-[#FF2454]">Overview</span>
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#7183A7] dark:text-[#B0A5BD]">
                Complete overview of your Equilx IELTS platform.
              </p>
            </div>

            <label className="flex max-w-full items-center gap-2 rounded-xl border border-[#E4EAF8] bg-white px-3 py-2.5 text-xs font-semibold text-[#506995] shadow-sm dark:border-[#3B3441] dark:bg-[#211E27] dark:text-[#B0A5BD]">
              <Clock size={15} />

              <select
                defaultValue="30"
                aria-label="Analytics date range"
                className="max-w-[130px] bg-transparent outline-none dark:text-white"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last 12 months</option>
              </select>
            </label>
          </section>

          {/* PLATFORM STATS */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {platformStats.map((item) => (
              <StatCard key={item.title} item={item} />
            ))}
          </section>

          {/* GROWTH AND REVENUE */}
          <section className="grid grid-cols-1 gap-5 2xl:grid-cols-5">
            <Panel
              title="User & Institute Growth"
              subtitle="Platform growth trend"
              action={
                <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-950/40">
                  Last 30 days
                </span>
              }
              className="2xl:col-span-3"
            >
              <GrowthChart />
            </Panel>

            <Panel
              title="Revenue & Plan Distribution"
              subtitle="Subscription mix by plan"
              className="2xl:col-span-2"
            >
              <RevenueDistribution />
            </Panel>
          </section>

          {/* AI, SYSTEM HEALTH AND ACTIVITY */}
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
            <AIUsagePanel />
            <SystemHealthPanel />
            <ActivityPanel />
          </section>

          {/* ADDITIONAL OVERVIEW CARDS */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#E9EEFA] bg-white p-4 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40">
                <BookOpen size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-[#7183A7] dark:text-[#B0A5BD]">
                  Cambridge Content
                </p>
                <p className="mt-1 text-lg font-extrabold text-[#10265F] dark:text-white">
                  21 Books
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#E9EEFA] bg-white p-4 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40">
                <BrainCircuit size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-[#7183A7] dark:text-[#B0A5BD]">
                  AI Evaluation
                </p>
                <p className="mt-1 text-lg font-extrabold text-[#10265F] dark:text-white">
                  Monitoring
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#E9EEFA] bg-white p-4 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30">
                <ShieldCheck size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-[#7183A7] dark:text-[#B0A5BD]">
                  Security Events
                </p>
                <p className="mt-1 text-lg font-extrabold text-[#10265F] dark:text-white">
                  Audit Enabled
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#E9EEFA] bg-white p-4 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#FF2454] dark:bg-rose-950/30">
                <CircleDollarSign size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-[#7183A7] dark:text-[#B0A5BD]">
                  Pending Reviews
                </p>
                <p className="mt-1 text-lg font-extrabold text-[#10265F] dark:text-white">
                  View Activity
                </p>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="pb-2 pt-1 text-center text-xs text-[#9AA8C2] dark:text-[#B0A5BD]">
            Equilx IELTS · Super Admin Portal
          </footer>
        </main>
      </div>
    </div>
  );
}
