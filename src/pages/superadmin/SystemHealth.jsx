import React, { useState } from "react";

import {
  Activity,
  Server,
  Database,
  BrainCircuit,
  HardDrive,
  AlertTriangle,
  Clock3,
  RefreshCw,
  Cpu,
  Zap,
  Wifi,
  Layers,
} from "lucide-react";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const services = [
  {
    name: "Backend API",
    description: "REST API and request handling",
    icon: Server,
    status: "Operational",
    uptime: "99.98%",
    response: "124 ms",
    color: "blue",
  },
  {
    name: "PostgreSQL Database",
    description: "Primary application database",
    icon: Database,
    status: "Operational",
    uptime: "99.99%",
    response: "38 ms",
    color: "green",
  },
  {
    name: "AI Provider",
    description: "IELTS feedback and AI processing",
    icon: BrainCircuit,
    status: "Degraded",
    uptime: "98.72%",
    response: "1.8 sec",
    color: "orange",
  },
  {
    name: "File Storage",
    description: "Learning materials and uploads",
    icon: HardDrive,
    status: "Operational",
    uptime: "99.95%",
    response: "86 ms",
    color: "purple",
  },
];

const initialJobs = [
  {
    id: "JOB-1048",
    name: "IELTS Score Calculation",
    status: "Running",
    time: "10:42 AM",
  },
  {
    id: "JOB-1047",
    name: "Institute Report Generation",
    status: "Completed",
    time: "10:35 AM",
  },
  {
    id: "JOB-1046",
    name: "AI Feedback Generation",
    status: "Failed",
    time: "10:28 AM",
  },
  {
    id: "JOB-1045",
    name: "Daily Data Backup",
    status: "Queued",
    time: "10:25 AM",
  },
];

function StatusBadge({ status }) {
  const styles = {
    Operational:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    Completed:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    Running:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    Queued:
      "bg-slate-100 text-slate-600 dark:bg-[#393441] dark:text-[#D0C7D8]",
    Degraded:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    Failed:
      "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] ||
        "bg-slate-100 text-slate-600 dark:bg-[#393441] dark:text-[#D0C7D8]"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function MetricCard({ title, value, detail, icon: Icon, tone }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    green:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    orange:
      "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
    purple:
      "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
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

        <div className={`rounded-xl p-3 ${tones[tone]}`}>
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500 dark:text-[#B0A5BD]">
        {detail}
      </p>
    </div>
  );
}

export default function SystemHealth() {
  const [jobs, setJobs] = useState(initialJobs);
  const [lastChecked, setLastChecked] = useState("Just now");
  const [notice, setNotice] = useState("");

  const refreshStatus = () => {
    setLastChecked(new Date().toLocaleTimeString());
    setNotice(
      "Demo dashboard refreshed. Live metrics require backend integration."
    );
  };

  const retryJob = (id) => {
    setJobs((previous) =>
      previous.map((job) =>
        job.id === id ? { ...job, status: "Queued" } : job
      )
    );

    setNotice(`${id} moved to the demo queue.`);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FF] text-slate-800 dark:bg-[#17151B] dark:text-white">
      <Sidebar />

      <div className="min-h-screen min-w-0 lg:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm text-slate-500 dark:text-[#B0A5BD]">
                Super Admin / System Health
              </p>

              <h1 className="text-2xl font-bold text-[#10265F] dark:text-white sm:text-3xl">
                System Health
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-[#B0A5BD]">
                Monitor platform availability, service performance and
                background jobs.
              </p>
            </div>

            <button
              onClick={refreshStatus}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10265F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1B397D] dark:bg-[#FF2454] dark:hover:bg-[#E51E49]"
            >
              <RefreshCw size={16} />
              Refresh Status
            </button>
          </div>

          {/* Last Checked */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-[#B0A5BD]">
            <Clock3 size={15} />
            Last checked: {lastChecked}
          </div>

          {/* Notice */}
          {notice && (
            <div className="flex items-start justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
              <span>{notice}</span>

              <button
                onClick={() => setNotice("")}
                aria-label="Dismiss notice"
                className="text-lg font-semibold"
              >
                ×
              </button>
            </div>
          )}

          {/* Metric Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Services Operational"
              value="3 / 4"
              detail="One service needs attention"
              icon={Activity}
              tone="green"
            />

            <MetricCard
              title="API Uptime"
              value="99.98%"
              detail="Illustrative 30-day uptime"
              icon={Wifi}
              tone="blue"
            />

            <MetricCard
              title="Failed Jobs"
              value={jobs.filter((job) => job.status === "Failed").length}
              detail="Tasks requiring review"
              icon={AlertTriangle}
              tone="orange"
            />

            <MetricCard
              title="Active Processes"
              value="12"
              detail="Illustrative worker processes"
              icon={Layers}
              tone="purple"
            />
          </div>

          {/* Service Monitoring */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27] sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#10265F] dark:text-white">
                Service Monitoring
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-[#B0A5BD]">
                Status and response metrics for core platform services.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <div
                    key={service.name}
                    className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:shadow-sm dark:border-[#3B3441] dark:hover:border-[#FF2454]/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-blue-50 p-3 text-[#2454A6] dark:bg-blue-950/40 dark:text-blue-300">
                          <Icon size={21} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-[#10265F] dark:text-white">
                            {service.name}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500 dark:text-[#B0A5BD]">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      <StatusBadge status={service.status} />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 dark:border-[#3B3441]">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-[#B0A5BD]">
                          Uptime
                        </p>

                        <p className="mt-1 font-bold text-[#10265F] dark:text-white">
                          {service.uptime}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 dark:text-[#B0A5BD]">
                          Response time
                        </p>

                        <p className="mt-1 font-bold text-[#10265F] dark:text-white">
                          {service.response}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Resource Utilization */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27] sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-[#2454A6] dark:bg-blue-950/40 dark:text-blue-300">
                <Cpu size={21} />
              </div>

              <div>
                <h2 className="font-bold text-[#10265F] dark:text-white">
                  Resource Utilization
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-[#B0A5BD]">
                  Example resource usage; replace with live monitoring data.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {[
                {
                  name: "CPU Usage",
                  value: 42,
                  color: "bg-blue-600",
                },
                {
                  name: "Memory Usage",
                  value: 68,
                  color: "bg-violet-600",
                },
                {
                  name: "Database Connections",
                  value: 35,
                  color: "bg-emerald-600",
                },
                {
                  name: "Storage Usage",
                  value: 54,
                  color: "bg-orange-500",
                },
              ].map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-[#E7E1EC]">
                      {item.name}
                    </span>

                    <span className="font-bold text-[#10265F] dark:text-white">
                      {item.value}%
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-[#393441]">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Background Jobs */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]">
            <div className="flex items-center gap-3 p-5 sm:p-6">
              <div className="rounded-xl bg-purple-50 p-3 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                <Zap size={21} />
              </div>

              <div>
                <h2 className="font-bold text-[#10265F] dark:text-white">
                  Background Jobs
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-[#B0A5BD]">
                  Recent report, AI and backup tasks.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-[#19171E] dark:text-[#B0A5BD]">
                  <tr>
                    <th className="px-5 py-4">Job ID</th>
                    <th className="px-5 py-4">Task</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Started</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-[#3B3441]">
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-50 dark:hover:bg-[#292530]"
                    >
                      <td className="px-5 py-4 font-mono text-xs text-slate-500 dark:text-[#B0A5BD]">
                        {job.id}
                      </td>

                      <td className="px-5 py-4 font-semibold text-[#10265F] dark:text-white">
                        {job.name}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={job.status} />
                      </td>

                      <td className="px-5 py-4 text-slate-500 dark:text-[#B0A5BD]">
                        {job.time}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {job.status === "Failed" ? (
                          <button
                            onClick={() => retryJob(job.id)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#2454A6] hover:bg-blue-50 dark:border-[#4A4352] dark:text-blue-300 dark:hover:bg-blue-950/40"
                          >
                            Retry
                          </button>
                        ) : (
                          <span className="text-slate-300 dark:text-[#6F6678]">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Demo Warning */}
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            <AlertTriangle size={19} className="mt-0.5 shrink-0" />

            <p className="leading-6">
              The values shown are demonstration data, not live server
              measurements. Connect monitoring endpoints to display actual
              system status.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}