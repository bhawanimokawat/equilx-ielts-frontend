import React, { useMemo, useState } from "react";

import {
  ShieldCheck,
  Search,
  Download,
  Eye,
  X,
  FileText,
  Clock3,
  AlertTriangle,
  Filter,
  Activity,
} from "lucide-react";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const initialLogs = [
  {
    id: "AUD-1001",
    event: "Institute account updated",
    description: "Institute profile information was modified.",
    actor: "Super Admin",
    role: "Super Admin",
    category: "Institute",
    severity: "Info",
    timestamp: "Oct 27, 10:42 AM",
    ip: "192.168.1.20",
  },
  {
    id: "AUD-1002",
    event: "AI feedback request failed",
    description: "An AI feedback task did not complete successfully.",
    actor: "System Worker",
    role: "System",
    category: "AI Service",
    severity: "Error",
    timestamp: "Oct 27, 10:28 AM",
    ip: "10.0.0.14",
  },
  {
    id: "AUD-1003",
    event: "Subscription plan modified",
    description: "A platform subscription plan was updated.",
    actor: "Super Admin",
    role: "Super Admin",
    category: "Billing",
    severity: "Warning",
    timestamp: "Oct 27, 10:15 AM",
    ip: "192.168.1.20",
  },
  {
    id: "AUD-1004",
    event: "Institute administrator created",
    description: "A new administrator account was created.",
    actor: "Platform Admin",
    role: "Admin",
    category: "User Access",
    severity: "Info",
    timestamp: "Oct 27, 09:54 AM",
    ip: "192.168.1.36",
  },
  {
    id: "AUD-1005",
    event: "Repeated login attempts detected",
    description: "Multiple unsuccessful login attempts were detected.",
    actor: "Security Monitor",
    role: "System",
    category: "Security",
    severity: "Critical",
    timestamp: "Oct 27, 09:41 AM",
    ip: "10.0.0.29",
  },
  {
    id: "AUD-1006",
    event: "Study material published",
    description: "A learning resource was marked as published.",
    actor: "Content Manager",
    role: "Admin",
    category: "Content",
    severity: "Info",
    timestamp: "Oct 27, 09:20 AM",
    ip: "192.168.1.42",
  },
  {
    id: "AUD-1007",
    event: "Refund request reviewed",
    description: "A refund request was opened for administrator review.",
    actor: "Billing Admin",
    role: "Admin",
    category: "Billing",
    severity: "Warning",
    timestamp: "Oct 27, 09:05 AM",
    ip: "192.168.1.51",
  },
];

function SeverityBadge({ severity }) {
  const styles = {
    Info: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    Warning:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    Error: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
    Critical:
      "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[severity] ||
        "bg-slate-100 text-slate-600 dark:bg-[#393441] dark:text-[#D0C7D8]"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {severity}
    </span>
  );
}

function SummaryCard({ title, value, description, icon: Icon, tone }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    amber:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
    green:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-[#B0A5BD]">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-[#10265F] dark:text-white">
            {value}
          </h3>
        </div>

        <div className={`rounded-xl p-3 ${styles[tone]}`}>
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500 dark:text-[#B0A5BD]">
        {description}
      </p>
    </div>
  );
}

function exportCSV(rows) {
  if (!rows.length) return;

  const headers = [
    "id",
    "event",
    "description",
    "actor",
    "role",
    "category",
    "severity",
    "timestamp",
    "ip",
  ];

  const escapeCell = (value) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const csv = [
    headers.map(escapeCell).join(","),
    ...rows.map((row) =>
      headers.map((key) => escapeCell(row[key])).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "equilx-audit-logs.csv";
  link.click();

  URL.revokeObjectURL(url);
}

export default function AuditLogs() {
  const [logs] = useState(initialLogs);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [category, setCategory] = useState("All");
  const [selectedLog, setSelectedLog] = useState(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const searchText = [
        log.id,
        log.event,
        log.description,
        log.actor,
        log.role,
        log.category,
        log.ip,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());
      const matchesSeverity =
        severity === "All" || log.severity === severity;
      const matchesCategory =
        category === "All" || log.category === category;

      return matchesSearch && matchesSeverity && matchesCategory;
    });
  }, [logs, search, severity, category]);

  const criticalCount = logs.filter(
    (log) => log.severity === "Critical"
  ).length;

  const warningCount = logs.filter(
    (log) => log.severity === "Warning"
  ).length;

  const errorCount = logs.filter(
    (log) => log.severity === "Error"
  ).length;

  const categories = [...new Set(logs.map((log) => log.category))];

  return (
    <div className="min-h-screen bg-[#F5F7FF] text-slate-800 dark:bg-[#17151B] dark:text-white">
      <Sidebar />

      <div className="min-h-screen min-w-0 lg:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-sm text-slate-500 dark:text-[#B0A5BD]">
                Super Admin / Audit Logs
              </p>

              <h1 className="text-2xl font-bold text-[#10265F] dark:text-white sm:text-3xl">
                Audit Logs
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-[#B0A5BD]">
                Track administrative actions, security events and platform
                activity.
              </p>
            </div>

            <button
              onClick={() => exportCSV(filteredLogs)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10265F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1B397D] dark:bg-[#FF2454] dark:hover:bg-[#E51E49]"
            >
              <Download size={17} />
              Export CSV
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total Events"
              value={logs.length}
              description="Sample events in this view"
              icon={Activity}
              tone="blue"
            />

            <SummaryCard
              title="Critical Events"
              value={criticalCount}
              description="Events requiring urgent review"
              icon={AlertTriangle}
              tone="rose"
            />

            <SummaryCard
              title="Warnings"
              value={warningCount}
              description="Events to review"
              icon={ShieldCheck}
              tone="amber"
            />

            <SummaryCard
              title="Errors"
              value={errorCount}
              description="Failed operations in sample data"
              icon={FileText}
              tone="green"
            />
          </div>

          {/* Activity History */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]">
            <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-[#10265F] dark:text-white">
                  Activity History
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-[#B0A5BD]">
                  Search, filter and inspect individual audit events.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-[#B0A5BD]">
                <Clock3 size={15} />
                Sample event history
              </span>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 border-y border-slate-100 bg-slate-50/70 p-4 dark:border-[#3B3441] dark:bg-[#19171E] lg:grid-cols-[minmax(0,1fr)_190px_190px]">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search events, actors, IDs or IP addresses..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-white dark:placeholder:text-[#82778D] dark:focus:border-[#FF2454] dark:focus:ring-[#FF2454]/10"
                />
              </div>

              <div className="relative">
                <Filter
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={severity}
                  onChange={(event) => setSeverity(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-blue-400 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-white dark:focus:border-[#FF2454]"
                >
                  <option value="All">All severities</option>
                  <option value="Info">Info</option>
                  <option value="Warning">Warning</option>
                  <option value="Error">Error</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-white dark:focus:border-[#FF2454]"
              >
                <option value="All">All categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Audit Logs Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-white text-xs uppercase tracking-wide text-slate-500 dark:bg-[#211E27] dark:text-[#B0A5BD]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Event</th>
                    <th className="px-5 py-4 font-semibold">Actor</th>
                    <th className="px-5 py-4 font-semibold">Category</th>
                    <th className="px-5 py-4 font-semibold">Severity</th>
                    <th className="px-5 py-4 font-semibold">Timestamp</th>
                    <th className="px-5 py-4 font-semibold">IP Address</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-[#3B3441]">
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-[#292530]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#10265F] dark:text-white">
                          {log.event}
                        </p>

                        <p className="mt-1 text-xs text-slate-400 dark:text-[#91869D]">
                          {log.id}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-700 dark:text-[#E7E1EC]">
                          {log.actor}
                        </p>

                        <p className="mt-1 text-xs text-slate-400 dark:text-[#91869D]">
                          {log.role}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-600 dark:text-[#D0C7D8]">
                        {log.category}
                      </td>

                      <td className="px-5 py-4">
                        <SeverityBadge severity={log.severity} />
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-[#B0A5BD]">
                        {log.timestamp}
                      </td>

                      <td className="px-5 py-4 font-mono text-xs text-slate-500 dark:text-[#B0A5BD]">
                        {log.ip}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          aria-label={`View details for ${log.id}`}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700 dark:text-[#B0A5BD] dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredLogs.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-12 text-center text-slate-500 dark:text-[#B0A5BD]"
                      >
                        No audit events match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="flex flex-col justify-between gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 dark:border-[#3B3441] dark:text-[#B0A5BD] sm:flex-row">
              <span>
                Showing {filteredLogs.length} of {logs.length} events
              </span>

              <span>Pagination can be connected to the backend.</span>
            </div>
          </section>

          {/* Security Information */}
          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
            <ShieldCheck size={19} className="mt-0.5 shrink-0" />

            <p className="leading-6">
              Audit records should be generated and stored by the backend. In a
              production system, restrict access and protect logs from
              modification.
            </p>
          </div>
        </main>
      </div>

      {/* Event Details Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onClick={() => setSelectedLog(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:border dark:border-[#3B3441] dark:bg-[#211E27]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-[#B0A5BD]">
                  Audit event details
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#10265F] dark:text-white">
                  {selectedLog.event}
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-[#B0A5BD]">
                  {selectedLog.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-[#B0A5BD] dark:hover:bg-[#393441]"
              >
                <X size={19} />
              </button>
            </div>

            <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-[#D0C7D8]">
              {selectedLog.description}
            </p>

            <div className="space-y-3">
              {[
                ["Actor", selectedLog.actor],
                ["Role", selectedLog.role],
                ["Category", selectedLog.category],
                ["Severity", selectedLog.severity],
                ["Timestamp", selectedLog.timestamp],
                ["IP Address", selectedLog.ip],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 text-sm dark:border-[#3B3441]"
                >
                  <span className="text-slate-500 dark:text-[#B0A5BD]">
                    {label}
                  </span>

                  <span className="text-right font-semibold text-slate-800 dark:text-white">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="mt-6 w-full rounded-xl bg-[#10265F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1B397D] dark:bg-[#FF2454] dark:hover:bg-[#E51E49]"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}