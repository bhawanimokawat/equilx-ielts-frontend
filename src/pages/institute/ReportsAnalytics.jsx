
import React, { useMemo, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar";
import {
  BarChart3,
  TrendingUp,
  Users,
  GraduationCap,
  ClipboardCheck,
  Download,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Target,
  Award,
  Clock,
} from "lucide-react";

const studentsData = [
  { name: "Aarav Sharma", batch: "Batch A", band: 7.5, attendance: 94, assignments: 92, status: "On Track" },
  { name: "Priya Verma", batch: "Batch B", band: 8.0, attendance: 97, assignments: 96, status: "Excellent" },
  { name: "Rohan Gupta", batch: "Batch A", band: 6.0, attendance: 78, assignments: 65, status: "Needs Attention" },
  { name: "Ananya Singh", batch: "Batch C", band: 7.0, attendance: 89, assignments: 88, status: "On Track" },
  { name: "Kabir Mehta", batch: "Batch B", band: 6.5, attendance: 84, assignments: 75, status: "On Track" },
  { name: "Ishita Jain", batch: "Batch C", band: 8.5, attendance: 98, assignments: 100, status: "Excellent" },
  { name: "Arjun Patel", batch: "Batch A", band: 5.5, attendance: 68, assignments: 52, status: "Needs Attention" },
  { name: "Meera Joshi", batch: "Batch B", band: 7.5, attendance: 92, assignments: 90, status: "Excellent" },
];

const batchData = [
  { name: "Batch A", students: 32, band: 7.0, completion: 78, attendance: 86 },
  { name: "Batch B", students: 28, band: 7.5, completion: 91, attendance: 93 },
  { name: "Batch C", students: 24, band: 7.2, completion: 84, attendance: 89 },
  { name: "Batch D", students: 20, band: 6.8, completion: 72, attendance: 81 },
];

const trainerData = [
  { name: "Aman Sharma", initials: "AS", students: 32, band: 7.4, completion: 92, rating: 4.9 },
  { name: "Pooja Gupta", initials: "PG", students: 28, band: 7.8, completion: 96, rating: 4.8 },
  { name: "Rahul Kumar", initials: "RK", students: 24, band: 7.1, completion: 85, rating: 4.7 },
  { name: "Neha Singh", initials: "NS", students: 20, band: 7.6, completion: 90, rating: 4.9 },
];

const monthlyData = [
  { month: "May", score: 6.1, completion: 65 },
  { month: "Jun", score: 6.3, completion: 70 },
  { month: "Jul", score: 6.5, completion: 74 },
  { month: "Aug", score: 6.8, completion: 79 },
  { month: "Sep", score: 7.0, completion: 84 },
  { month: "Oct", score: 7.3, completion: 89 },
];

const statusStyles = {
  Excellent:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  "On Track":
    "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  "Needs Attention":
    "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
};

function StatCard({ title, value, change, subtitle, icon: Icon, color }) {
  const colors = {
    pink: "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    blue: "bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-[#B0A5BD]">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-[#10265F] dark:text-white">
            {value}
          </h2>

          <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp size={14} />
            {change}
          </p>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}>
          <Icon size={24} />
        </div>
      </div>

      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-[#3B3441] dark:text-[#91899B]">
        {subtitle}
      </p>
    </div>
  );
}

function Panel({ title, subtitle, action, children }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#10265F] dark:text-slate-100">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-400 dark:text-[#91899B]">
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

function ScoreChart({ data }) {
  const points = data.map((item, index) => ({
    ...item,
    x: 40 + index * (320 / Math.max(data.length - 1, 1)),
    y: 150 - ((item.score - 5) / 4) * 120,
  }));

  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `40,150 ${line} ${points[points.length - 1]?.x || 360},150`;

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-[#B0A5BD]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF4778]" />
        Average IELTS band score
      </div>

      <svg
        viewBox="0 0 390 195"
        className="w-full"
        role="img"
        aria-label="Average IELTS band score trend"
      >
        {[30, 60, 90, 120, 150].map((y) => (
          <g key={y}>
            <line
              x1="35"
              y1={y}
              x2="370"
              y2={y}
              stroke="#64748B"
              strokeOpacity="0.22"
              strokeDasharray="4 4"
            />

            <text
              x="25"
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="#94A3B8"
            >
              {(9 - ((y - 30) / 120) * 4).toFixed(0)}
            </text>
          </g>
        ))}

        <polygon points={area} fill="#FF4778" fillOpacity="0.10" />

        <polyline
          points={line}
          fill="none"
          stroke="#FF4778"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point) => (
          <g key={point.month}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#FF4778"
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />

            <text
              x={point.x}
              y="174"
              textAnchor="middle"
              fontSize="10"
              fill="#94A3B8"
            >
              {point.month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function BatchChart({ data }) {
  return (
    <div className="space-y-5">
      {data.map((batch, index) => (
        <div key={batch.name}>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-[#10265F] dark:text-slate-200">
              {batch.name}
            </span>

            <span className="text-xs font-bold text-[#10265F] dark:text-slate-100">
              {batch.completion}%
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-[#3B3441]">
            <div
              className={`h-full rounded-full ${
                [
                  "bg-[#FF4778]",
                  "bg-purple-500",
                  "bg-blue-500",
                  "bg-emerald-500",
                ][index % 4]
              }`}
              style={{ width: `${batch.completion}%` }}
            />
          </div>

          <p className="mt-1.5 text-[10px] text-slate-400 dark:text-[#91899B]">
            {batch.students} students · Band {batch.band.toFixed(1)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function ReportsAnalytics() {
  const [period, setPeriod] = useState("Last 6 Months");
  const [activeReport, setActiveReport] = useState("Students");
  const [batchFilter, setBatchFilter] = useState("All Batches");
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    return studentsData.filter((student) => {
      const matchesBatch =
        batchFilter === "All Batches" || student.batch === batchFilter;

      const matchesSearch = student.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesBatch && matchesSearch;
    });
  }, [batchFilter, search]);

  const exportCSV = () => {
    let headers;
    let rows;
    let filename;

    if (activeReport === "Students") {
      headers = [
        "Student",
        "Batch",
        "Band Score",
        "Attendance",
        "Assignment Completion",
        "Status",
      ];

      rows = filteredStudents.map((student) => [
        student.name,
        student.batch,
        student.band,
        `${student.attendance}%`,
        `${student.assignments}%`,
        student.status,
      ]);

      filename = "student-report.csv";
    } else if (activeReport === "Batches") {
      headers = [
        "Batch",
        "Students",
        "Average Band",
        "Assignment Completion",
        "Attendance",
      ];

      rows = batchData.map((batch) => [
        batch.name,
        batch.students,
        batch.band,
        `${batch.completion}%`,
        `${batch.attendance}%`,
      ]);

      filename = "batch-report.csv";
    } else {
      headers = [
        "Trainer",
        "Students",
        "Average Band",
        "Assignment Completion",
        "Rating",
      ];

      rows = trainerData.map((trainer) => [
        trainer.name,
        trainer.students,
        trainer.band,
        `${trainer.completion}%`,
        trainer.rating,
      ]);

      filename = "trainer-report.csv";
    }

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  const averageBand = (
    studentsData.reduce((sum, student) => sum + student.band, 0) /
    studentsData.length
  ).toFixed(1);

  const averageCompletion = Math.round(
    studentsData.reduce((sum, student) => sum + student.assignments, 0) /
      studentsData.length
  );

  const averageAttendance = Math.round(
    studentsData.reduce((sum, student) => sum + student.attendance, 0) /
      studentsData.length
  );

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
                Institute <span className="mx-1">›</span> Reports & Analytics
              </p>

              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#10265F] dark:text-white">
                Reports & <span className="text-[#FF2454]">Analytics</span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-[#7183A7] dark:text-[#B0A5BD]">
                Track student performance, batch progress and trainer
                effectiveness across your institute.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 dark:border-[#3B3441] dark:bg-[#211E27]">
                <CalendarDays
                  size={17}
                  className="text-slate-400 dark:text-[#91899B]"
                />

                <select
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                  className="bg-transparent text-xs font-semibold text-[#10265F] outline-none dark:text-slate-200 dark:[color-scheme:dark]"
                >
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                  <option>Last 6 Months</option>
                  <option>This Year</option>
                </select>
              </label>

              <button
                type="button"
                onClick={exportCSV}
                className="flex h-11 items-center gap-2 rounded-xl bg-[#FF2454] px-4 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                <Download size={17} />
                Export Report
              </button>
            </div>
          </section>

          {/* KPI cards */}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Students"
              value="124"
              change="+12.5%"
              subtitle="Compared with previous period"
              icon={Users}
              color="pink"
            />

            <StatCard
              title="Average Band Score"
              value={averageBand}
              change="+0.4"
              subtitle="Institute-wide average"
              icon={Award}
              color="purple"
            />

            <StatCard
              title="Assignment Completion"
              value={`${averageCompletion}%`}
              change="+8.2%"
              subtitle="Average completed assignments"
              icon={ClipboardCheck}
              color="blue"
            />

            <StatCard
              title="Average Attendance"
              value={`${averageAttendance}%`}
              change="+3.1%"
              subtitle="Student attendance rate"
              icon={GraduationCap}
              color="green"
            />
          </section>

          {/* Charts */}

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <Panel
                title="Institute Performance Trend"
                subtitle={`Performance overview · ${period}`}
                action={
                  <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <TrendingUp size={14} />
                    Improving
                  </span>
                }
              >
                <ScoreChart data={monthlyData} />

                <div className="mt-3 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 dark:border-[#3B3441] sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate-400 dark:text-[#91899B]">
                      Current Average
                    </p>
                    <p className="mt-1 text-xl font-extrabold text-[#10265F] dark:text-white">
                      7.3
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 dark:text-[#91899B]">
                      Score Improvement
                    </p>
                    <p className="mt-1 text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      +1.2
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 dark:text-[#91899B]">
                      Target Band
                    </p>
                    <p className="mt-1 text-xl font-extrabold text-[#10265F] dark:text-white">
                      8.0
                    </p>
                  </div>
                </div>
              </Panel>
            </div>

            <div className="xl:col-span-4">
              <Panel
                title="Batch Performance"
                subtitle="Assignment completion by batch"
                action={
                  <BarChart3
                    size={18}
                    className="text-slate-400 dark:text-[#91899B]"
                  />
                }
              >
                <BatchChart data={batchData} />
              </Panel>
            </div>
          </section>

          {/* Report tabs */}

          <Panel
            title="Detailed Reports"
            subtitle="Review student, batch and trainer performance"
            action={
              <button
                type="button"
                onClick={exportCSV}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#10265F] transition hover:bg-slate-50 dark:border-[#3B3441] dark:text-slate-200 dark:hover:bg-[#302B36]"
              >
                <Download size={15} />
                Download CSV
              </button>
            }
          >
            <div className="mb-5 flex flex-wrap gap-5 border-b border-slate-100 dark:border-[#3B3441]">
              {[
                { label: "Students", icon: Users },
                { label: "Batches", icon: GraduationCap },
                { label: "Trainers", icon: Award },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveReport(label)}
                  className={`flex items-center gap-2 border-b-2 pb-3 text-sm transition ${
                    activeReport === label
                      ? "border-[#FF2454] font-bold text-[#FF2454]"
                      : "border-transparent text-slate-500 hover:text-[#10265F] dark:text-[#B0A5BD] dark:hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            {/* Students Report */}

            {activeReport === "Students" && (
              <>
                <div className="mb-4 flex flex-wrap gap-3">
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search student..."
                    className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition focus:border-pink-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white dark:placeholder:text-[#91899B] sm:max-w-xs"
                  />

                  <select
                    value={batchFilter}
                    onChange={(event) => setBatchFilter(event.target.value)}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-[#10265F] outline-none dark:border-[#3B3441] dark:bg-[#19171E] dark:text-slate-200 dark:[color-scheme:dark]"
                  >
                    <option>All Batches</option>

                    {batchData.map((batch) => (
                      <option key={batch.name}>{batch.name}</option>
                    ))}
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] text-slate-500 dark:bg-[#19171E] dark:text-[#B0A5BD]">
                        {[
                          "Student",
                          "Batch",
                          "Band Score",
                          "Attendance",
                          "Assignment Completion",
                          "Performance",
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
                      {filteredStudents.map((student, index) => (
                        <tr
                          key={student.name}
                          className="border-b border-slate-100 text-xs transition hover:bg-slate-50/70 dark:border-[#3B3441] dark:hover:bg-[#302B36]/60"
                        >
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-3">
                              <span
                                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                                  index % 2 === 0
                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                    : "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                                }`}
                              >
                                {student.name
                                  .split(" ")
                                  .map((word) => word[0])
                                  .join("")}
                              </span>

                              <span className="whitespace-nowrap font-semibold text-[#10265F] dark:text-slate-100">
                                {student.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-3 py-4 text-slate-500 dark:text-[#B0A5BD]">
                            {student.batch}
                          </td>

                          <td className="px-3 py-4">
                            <span className="font-extrabold text-[#10265F] dark:text-slate-100">
                              {student.band.toFixed(1)}
                            </span>
                            <span className="ml-1 text-slate-400 dark:text-[#91899B]">
                              / 9
                            </span>
                          </td>

                          <td className="px-3 py-4">
                            <span className="font-semibold text-[#10265F] dark:text-slate-200">
                              {student.attendance}%
                            </span>
                          </td>

                          <td className="px-3 py-4">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-[#3B3441]">
                                <div
                                  className="h-full rounded-full bg-emerald-400"
                                  style={{
                                    width: `${student.assignments}%`,
                                  }}
                                />
                              </div>

                              <span className="text-slate-500 dark:text-[#B0A5BD]">
                                {student.assignments}%
                              </span>
                            </div>
                          </td>

                          <td className="px-3 py-4">
                            <span
                              className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${statusStyles[student.status]}`}
                            >
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      ))}

                      {filteredStudents.length === 0 && (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-3 py-10 text-center text-sm text-slate-400 dark:text-[#B0A5BD]"
                          >
                            No students match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Batches Report */}

            {activeReport === "Batches" && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] text-slate-500 dark:bg-[#19171E] dark:text-[#B0A5BD]">
                      {[
                        "Batch",
                        "Students",
                        "Average Band",
                        "Assignment Completion",
                        "Attendance",
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
                    {batchData.map((batch) => (
                      <tr
                        key={batch.name}
                        className="border-b border-slate-100 text-xs dark:border-[#3B3441]"
                      >
                        <td className="px-3 py-4 font-bold text-[#10265F] dark:text-slate-100">
                          {batch.name}
                        </td>

                        <td className="px-3 py-4 text-slate-500 dark:text-[#B0A5BD]">
                          {batch.students}
                        </td>

                        <td className="px-3 py-4 font-bold text-[#10265F] dark:text-slate-100">
                          {batch.band.toFixed(1)}
                        </td>

                        <td className="px-3 py-4 text-slate-600 dark:text-slate-300">
                          {batch.completion}%
                        </td>

                        <td className="px-3 py-4 text-slate-600 dark:text-slate-300">
                          {batch.attendance}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Trainers Report */}

            {activeReport === "Trainers" && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] text-slate-500 dark:bg-[#19171E] dark:text-[#B0A5BD]">
                      {[
                        "Trainer",
                        "Students",
                        "Average Band",
                        "Assignment Completion",
                        "Rating",
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
                    {trainerData.map((trainer) => (
                      <tr
                        key={trainer.name}
                        className="border-b border-slate-100 text-xs dark:border-[#3B3441]"
                      >
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 font-bold text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                              {trainer.initials}
                            </span>

                            <span className="whitespace-nowrap font-semibold text-[#10265F] dark:text-slate-100">
                              {trainer.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-3 py-4 text-slate-600 dark:text-slate-300">
                          {trainer.students}
                        </td>

                        <td className="px-3 py-4 font-bold text-[#10265F] dark:text-slate-100">
                          {trainer.band.toFixed(1)}
                        </td>

                        <td className="px-3 py-4 text-slate-600 dark:text-slate-300">
                          {trainer.completion}%
                        </td>

                        <td className="px-3 py-4 font-semibold text-amber-500">
                          ★ {trainer.rating.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          {/* Highlights */}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Target size={20} />
              </span>

              <div>
                <h3 className="text-sm font-bold text-[#10265F] dark:text-slate-100">
                  Top Performing Batch
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-[#B0A5BD]">
                  Batch B · 91% assignment completion
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                <Award size={20} />
              </span>

              <div>
                <h3 className="text-sm font-bold text-[#10265F] dark:text-slate-100">
                  Top Trainer
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-[#B0A5BD]">
                  Pooja Gupta · 96% completion
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400">
                <Clock size={20} />
              </span>

              <div>
                <h3 className="text-sm font-bold text-[#10265F] dark:text-slate-100">
                  Needs Attention
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-[#B0A5BD]">
                  2 students may need additional support.
                </p>
              </div>
            </div>
          </section>

          <footer className="pb-2 text-center text-xs text-slate-400 dark:text-[#91899B]">
            Equilx IELTS · Institute Admin Portal
          </footer>
        </main>
      </div>
    </div>
  );
}

