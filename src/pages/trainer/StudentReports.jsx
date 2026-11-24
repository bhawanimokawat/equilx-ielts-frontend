
import React, {
  useCallback, useEffect, useMemo, useState,
} from "react";
import {
  Search, Users, TrendingUp, TrendingDown, Target,
  BookOpen, Headphones, PenLine, MessageCircle,
  ChevronDown, Eye, X, Download, CalendarDays,
  AlertTriangle, CheckCircle2, BarChart3, FileText,
  ArrowUpRight, RefreshCw, LoaderCircle, Mail,
  Phone, GraduationCap,
} from "lucide-react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import studentReportsService, {
  emptyStudentReport,
} from "../../services/Trainer/studentReportsService.js";

const SKILLS = [
  { key: "listening", label: "Listening", icon: Headphones, color: "blue" },
  { key: "reading", label: "Reading", icon: BookOpen, color: "purple" },
  { key: "writing", label: "Writing", icon: PenLine, color: "orange" },
  { key: "speaking", label: "Speaking", icon: MessageCircle, color: "green" },
];

const INPUT =
  "w-full rounded-xl border border-[#E4EAF5] bg-white px-4 py-3 " +
  "text-sm outline-none focus:border-blue-300 focus:ring-2 " +
  "focus:ring-blue-50 dark:border-[#3B3441] dark:bg-[#19171E] " +
  "dark:text-white dark:focus:ring-[#202B3B]";

const BORDER = "border-[#E9EDF6] dark:border-[#3B3441]";
const MUTED = "text-[#71809D] dark:text-[#B0A5BD]";
const PINK = "bg-[#FF2454] text-white hover:bg-[#e91d49]";

const scoreText = (value) =>
  value === null || value === undefined || value === ""
    ? "—"
    : String(value);

const dateText = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      });
};

function initials(name) {
  return String(name || "ST")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
}

function HoverCard({ children, className = "" }) {
  return (
    <div className={`group relative isolate h-full min-w-0 pb-2 ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-2
          rounded-2xl bg-pink-100 opacity-0 transition-opacity
          duration-300 group-hover:opacity-100 dark:bg-[#4A2538]"
      />
      <div
        className={`relative z-10 flex h-full min-w-0 flex-col rounded-2xl
          border ${BORDER} bg-white shadow-sm transition-transform
          duration-300 group-hover:-translate-y-1.5
          dark:bg-[#211E27]`}
      >
        {children}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon = FileText, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
      <Icon size={32} className="text-gray-300 dark:text-gray-500" />
      <h3 className="mt-3 font-bold">{title}</h3>
      <p className={`mt-2 max-w-md text-sm leading-6 ${MUTED}`}>
        {description}
      </p>
    </div>
  );
}

function SkillCard({ skill, score }) {
  const Icon = skill.icon;
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-[#202B3B]",
    purple: "bg-purple-50 text-purple-600 dark:bg-[#30263D]",
    orange: "bg-orange-50 text-orange-600 dark:bg-[#3B3020]",
    green: "bg-emerald-50 text-emerald-600 dark:bg-[#1F352E]",
  };

  const numeric = score === null || score === undefined
    ? null
    : Number(score);

  return (
    <HoverCard>
      <div className="flex h-full min-h-[190px] flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center
              rounded-xl ${colors[skill.color]}`}
          >
            <Icon size={23} />
          </div>
          <ArrowUpRight size={18} className={MUTED} />
        </div>
        <p className={`mt-5 text-sm font-semibold ${MUTED}`}>
          {skill.label}
        </p>
        <p className="mt-auto pt-3 text-3xl font-extrabold">
          {scoreText(score)}
          {score !== null && score !== undefined && (
            <span className={`ml-2 text-xs font-normal ${MUTED}`}>
              / 9
            </span>
          )}
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-[#393441]">
          {numeric !== null && Number.isFinite(numeric) && (
            <div
              className="h-full rounded-full bg-[#FF2454]"
              style={{
                width: `${Math.max(0, Math.min(100, numeric / 9 * 100))}%`,
              }}
            />
          )}
        </div>
      </div>
    </HoverCard>
  );
}

function ScoreChart({ history }) {
  const valid = history
    .map((item) => ({
      ...item,
      score: Number(item.score),
    }))
    .filter((item) => Number.isFinite(item.score));

  if (!valid.length) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No score history yet"
        description="Score history will appear here when the student report API supplies records."
      />
    );
  }

  const width = 760;
  const height = 250;
  const left = 40;
  const right = 25;
  const top = 20;
  const bottom = 45;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const points = valid.map((item, index) => {
    const x = left +
      (valid.length === 1
        ? plotWidth / 2
        : index / (valid.length - 1) * plotWidth);

    const y = top +
      (9 - Math.max(0, Math.min(9, item.score))) / 9 * plotHeight;

    return { ...item, x, y };
  });

  const path = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="min-w-[450px] w-full"
        role="img"
        aria-label="Student score progress chart"
      >
        {[0, 2, 4, 6, 8, 9].map((tick) => {
          const y = top + (9 - tick) / 9 * plotHeight;
          return (
            <g key={tick}>
              <line
                x1={left} x2={width - right}
                y1={y} y2={y}
                stroke="currentColor"
                strokeOpacity=".09"
              />
              <text
                x={left - 12}
                y={y + 4}
                fontSize="12"
                textAnchor="end"
                fill="#8A9ABB"
              >
                {tick}
              </text>
            </g>
          );
        })}

        <path
          d={path}
          fill="none"
          stroke="#FF2454"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, index) => (
          <g key={point.id || index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#FF2454"
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={point.x}
              y={height - 15}
              fontSize="11"
              textAnchor="middle"
              fill="#8A9ABB"
            >
              {String(point.date || "").slice(0, 12)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function FeedbackModal({ item, onClose }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center
        bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Student Feedback"
        className={`max-h-[90vh] w-full max-w-xl overflow-y-auto
          rounded-2xl border ${BORDER} bg-white p-6 shadow-2xl
          dark:bg-[#211E27]`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={`text-sm ${MUTED}`}>Student Feedback</p>
            <h2 className="mt-1 text-xl font-bold">
              {item.skill} Feedback
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close feedback"
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-[#393441]"
          >
            <X size={20} />
          </button>
        </div>

        <div className={`mt-5 rounded-xl border ${BORDER} p-4`}>
          <p className={`text-xs ${MUTED}`}>{dateText(item.date)}</p>
          <h3 className="mt-2 font-bold">{item.title || "Feedback"}</h3>
          <p className={`mt-2 text-sm ${MUTED}`}>
            Reviewed by {item.reviewer || "—"}
          </p>
          <p className="mt-4 text-2xl font-extrabold text-[#FF2454]">
            {item.score == null ? "—" : `Band ${item.score}`}
          </p>
        </div>

        <p className={`mt-5 whitespace-pre-wrap text-sm leading-7 ${MUTED}`}>
          {item.feedback || "No written feedback available."}
        </p>

        <button
          type="button"
          onClick={onClose}
          className={`mt-6 w-full rounded-xl px-4 py-3
            text-sm font-semibold ${PINK}`}
        >
          Close
        </button>
      </div>
    </div>
  );
}

function escapeCsv(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function exportCsv(student, report) {
  if (!student) return;

  const rows = [
    [
      "Student", "Email", "Phone", "Batches",
      "Overall Band", "Listening", "Reading",
      "Writing", "Speaking", "Progress",
    ],
    [
      student.name,
      student.email,
      student.phone,
      student.batches.map((batch) => batch.name).join("; "),
      report.overall,
      report.listening,
      report.reading,
      report.writing,
      report.speaking,
      report.progress,
    ],
    [],
    ["Attempt", "Date", "Listening", "Reading", "Writing", "Speaking", "Overall", "Status"],
    ...report.attempts.map((item) => [
      item.title, item.date, item.listening, item.reading,
      item.writing, item.speaking, item.overall, item.status,
    ]),
    [],
    ["Feedback Type", "Title", "Date", "Band", "Reviewer", "Feedback"],
    ...[...report.writingFeedback, ...report.speakingFeedback].map(
      (item) => [
        item.skill, item.title, item.date, item.score,
        item.reviewer, item.feedback,
      ]
    ),
  ];

  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${student.name.replace(/[^a-z0-9-]/gi, "-")}-report.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function StudentReports() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [report, setReport] = useState(emptyStudentReport(""));

  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportError, setReportError] = useState("");

  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");
  const [showStudentList, setShowStudentList] = useState(false);
  const [activeTab, setActiveTab] = useState("Attempts");
  const [period, setPeriod] = useState("Last 6 weeks");
  const [attemptSearch, setAttemptSearch] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await studentReportsService.getStudents();
      setStudents(result.students);
      setBatches(result.batches);

      setSelectedId((previous) =>
        result.students.some((item) => item.id === previous)
          ? previous
          : result.students[0]?.id || ""
      );

      if (result.errors.length) {
        setError(result.errors.join(" | "));
      }
    } catch (err) {
      setStudents([]);
      setBatches([]);
      setSelectedId("");
      setError(err.message || "Unable to load students.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    if (!selectedId) {
      setReport(emptyStudentReport(""));
      return;
    }

    let cancelled = false;

    async function loadReport() {
      setReportLoading(true);
      setReportError("");
      setReport(emptyStudentReport(selectedId));

      try {
        const result = await studentReportsService.getStudentReport(selectedId);
        if (cancelled) return;

        setReport(result);

        if (result.errors.length) {
          setReportError(result.errors.join(" | "));
        }
      } catch (err) {
        if (!cancelled) {
          setReportError(err.message || "Unable to load report.");
        }
      } finally {
        if (!cancelled) setReportLoading(false);
      }
    }

    loadReport();
    return () => { cancelled = true; };
  }, [selectedId]);

  const student = students.find((item) => item.id === selectedId) || null;

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();

    return students.filter((item) => {
      const matchesSearch =
        !q ||
        [item.name, item.email, item.phone].some((value) =>
          String(value || "").toLowerCase().includes(q)
        );

      const matchesBatch =
        batchFilter === "all" ||
        item.batches.some((batch) => batch.id === batchFilter);

      return matchesSearch && matchesBatch;
    });
  }, [students, search, batchFilter]);

  const skillData = SKILLS.map((skill) => ({
    ...skill,
    score: report[skill.key],
  }));

  const weakSkills = skillData
    .filter((skill) =>
      skill.score !== null &&
      skill.score !== undefined &&
      Number.isFinite(Number(skill.score)) &&
      Number(skill.score) < 6.5
    )
    .sort((a, b) => Number(a.score) - Number(b.score));

  const history = useMemo(() => {
    if (!report.history.length) return [];

    const days = period === "Last 6 weeks" ? 42 : 90;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    return report.history.filter((item) => {
      const time = new Date(item.date).getTime();
      return Number.isNaN(time) || time >= cutoff;
    });
  }, [report.history, period]);

  const filteredAttempts = report.attempts.filter((item) =>
    String(item.title || "")
      .toLowerCase()
      .includes(attemptSearch.trim().toLowerCase())
  );

  const activeFeedback =
    activeTab === "Writing Feedback"
      ? report.writingFeedback
      : report.speakingFeedback;

  const selectStudent = (id) => {
    setSelectedId(id);
    setShowStudentList(false);
    setActiveTab("Attempts");
    setAttemptSearch("");
    setSelectedFeedback(null);
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#F5F7FF]
        text-[#10265F] dark:bg-[#17151B] dark:text-[#F4F0F7]"
    >
      <Sidebar />

      <div className="min-w-0 lg:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* HEADER */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className={`mb-2 text-sm ${MUTED}`}>
                Trainer Portal / Student Reports
              </p>
              <h1 className="text-2xl font-extrabold sm:text-3xl">
                Student Reports
              </h1>
              <p className={`mt-2 text-sm ${MUTED}`}>
                Track IELTS band scores, performance trends, attempts and feedback.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadStudents}
                disabled={loading}
                className={`flex items-center gap-2 rounded-xl border ${BORDER}
                  bg-white px-4 py-3 text-sm font-semibold
                  disabled:opacity-50 dark:bg-[#211E27]`}
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={() => exportCsv(student, report)}
                disabled={!student || reportLoading}
                className={`flex items-center gap-2 rounded-xl
                  px-5 py-3 text-sm font-semibold
                  disabled:cursor-not-allowed disabled:opacity-50 ${PINK}`}
              >
                <Download size={18} />
                Export Report
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50
                p-4 text-sm text-red-700 dark:border-red-500/20
                dark:bg-red-500/10 dark:text-red-300"
            >
              {error}
            </div>
          )}

          {/* STUDENT SELECTOR */}
          <section className={`rounded-2xl border ${BORDER} bg-white p-5 shadow-sm dark:bg-[#211E27]`}>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold">Select Student</h2>
                <p className={`mt-1 text-sm ${MUTED}`}>
                  Choose a student to view their report.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowStudentList((value) => !value)}
                className={`flex min-w-[230px] items-center justify-between
                  gap-3 rounded-xl border ${BORDER} px-4 py-3 text-left
                  text-sm font-semibold`}
              >
                <span className="truncate">
                  {student?.name || "Select a student"}
                </span>
                <ChevronDown size={17} />
              </button>
            </div>

            {showStudentList && (
              <div className={`mt-5 rounded-xl border ${BORDER} p-4`}>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search students..."
                      className={`${INPUT} pl-10`}
                    />
                  </div>

                  <select
                    value={batchFilter}
                    onChange={(event) => setBatchFilter(event.target.value)}
                    className={`${INPUT} sm:w-[200px]`}
                  >
                    <option value="all">All Batches</option>
                    {batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 max-h-[280px] space-y-2 overflow-y-auto">
                  {filteredStudents.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectStudent(item.id)}
                      className="flex w-full items-center gap-3 rounded-xl
                        p-3 text-left hover:bg-gray-50 dark:hover:bg-[#302B37]"
                    >
                      <div
                        className="flex h-10 w-10 shrink-0 items-center
                          justify-center rounded-full bg-blue-50
                          font-bold text-blue-700 dark:bg-[#202B3B]"
                      >
                        {initials(item.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {item.name}
                        </p>
                        <p className={`truncate text-xs ${MUTED}`}>
                          {item.email || "No email"}
                        </p>
                      </div>
                      {item.id === selectedId && (
                        <CheckCircle2 size={18} className="text-[#FF2454]" />
                      )}
                    </button>
                  ))}

                  {!filteredStudents.length && (
                    <EmptyState
                      icon={Users}
                      title="No students found"
                      description="Students will appear when available in your batches."
                    />
                  )}
                </div>
              </div>
            )}
          </section>

          {loading ? (
            <div className="flex justify-center py-16">
              <LoaderCircle size={30} className="animate-spin text-[#FF2454]" />
            </div>
          ) : !student ? (
            <div className={`rounded-2xl border ${BORDER} bg-white dark:bg-[#211E27]`}>
              <EmptyState
                icon={GraduationCap}
                title="No student reports available"
                description="Once students are added to batches, select a student to view the report structure."
              />
            </div>
          ) : (
            <>
              {/* PROFILE AND OVERALL BAND */}
              <section className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[2fr_1fr]">
                <HoverCard>
                  <div className="flex h-full flex-col p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div
                        className="flex h-16 w-16 shrink-0 items-center
                          justify-center rounded-2xl bg-blue-50
                          text-xl font-extrabold text-blue-700
                          dark:bg-[#202B3B]"
                      >
                        {initials(student.name)}
                      </div>

                      <div className="min-w-0">
                        <p className={`text-sm ${MUTED}`}>Student Profile</p>
                        <h2 className="mt-1 text-2xl font-bold">
                          {student.name}
                        </h2>
                        <p className={`mt-2 break-words text-sm ${MUTED}`}>
                          {student.batches.map((batch) => batch.name).join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <p className={`flex items-center gap-2 text-sm ${MUTED}`}>
                        <Mail size={16} />
                        <span className="break-all">
                          {student.email || "—"}
                        </span>
                      </p>
                      <p className={`flex items-center gap-2 text-sm ${MUTED}`}>
                        <Phone size={16} />
                        {student.phone || "—"}
                      </p>
                    </div>
                  </div>
                </HoverCard>

                <HoverCard>
                  <div className="flex h-full min-h-[200px] flex-col p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${MUTED}`}>
                        Overall IELTS Band
                      </p>
                      <Target size={22} className="text-[#FF2454]" />
                    </div>
                    <p className="mt-auto pt-5 text-5xl font-extrabold">
                      {scoreText(report.overall)}
                      {report.overall != null && (
                        <span className={`ml-2 text-base font-normal ${MUTED}`}>
                          / 9
                        </span>
                      )}
                    </p>
                    <p className={`mt-3 text-sm ${MUTED}`}>
                      {reportLoading
                        ? "Loading scores..."
                        : report.overall == null
                          ? "Band score not available yet"
                          : "Latest reported band score"}
                    </p>
                  </div>
                </HoverCard>
              </section>

              {reportError && (
                <div
                  role="alert"
                  className="rounded-xl border border-orange-200 bg-orange-50
                    p-4 text-sm text-orange-700 dark:bg-[#3B3020]"
                >
                  {reportError}
                </div>
              )}

              {/* FOUR EQUAL SKILL CARDS */}
              <section>
                <div className="mb-4">
                  <h2 className="text-lg font-bold">IELTS Skill Performance</h2>
                  <p className={`mt-1 text-sm ${MUTED}`}>
                    Listening, Reading, Writing and Speaking scores.
                  </p>
                </div>

                <div
                  className="grid grid-cols-1 items-stretch gap-4
                    sm:grid-cols-2 xl:grid-cols-4"
                >
                  {skillData.map((skill) => (
                    <SkillCard
                      key={skill.key}
                      skill={skill}
                      score={skill.score}
                    />
                  ))}
                </div>
              </section>

              {/* SCORE PROGRESS + AREAS TO IMPROVE */}
              <section className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[2fr_1fr]">
                <HoverCard>
                  <div className="flex h-full flex-col p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold">Score Progress</h2>
                        <p className={`mt-1 text-sm ${MUTED}`}>
                          IELTS band history over time.
                        </p>
                      </div>

                      <select
                        value={period}
                        onChange={(event) => setPeriod(event.target.value)}
                        className={`${INPUT} w-auto`}
                      >
                        <option>Last 6 weeks</option>
                        <option>Last 3 months</option>
                      </select>
                    </div>

                    <div className="mt-5 flex-1">
                      <ScoreChart history={history} />
                    </div>
                  </div>
                </HoverCard>

                <HoverCard>
                  <div className="flex h-full flex-col p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold">Areas to Improve</h2>
                      <AlertTriangle size={21} className="text-orange-500" />
                    </div>
                    <p className={`mt-2 text-sm ${MUTED}`}>
                      Skills below band 6.5.
                    </p>

                    <div className="mt-5 space-y-3">
                      {weakSkills.map((skill) => {
                        const Icon = skill.icon;
                        return (
                          <div
                            key={skill.key}
                            className={`flex items-center justify-between
                              gap-3 rounded-xl border ${BORDER} p-3`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon size={19} className="text-[#FF2454]" />
                              <span className="text-sm font-semibold">
                                {skill.label}
                              </span>
                            </div>
                            <span className="font-bold">
                              {scoreText(skill.score)}
                            </span>
                          </div>
                        );
                      })}

                      {!weakSkills.length && (
                        <EmptyState
                          icon={CheckCircle2}
                          title={
                            skillData.every((skill) => skill.score != null)
                              ? "No weak skills identified"
                              : "Skill analysis pending"
                          }
                          description={
                            skillData.every((skill) => skill.score != null)
                              ? "No reported skill score is below 6.5."
                              : "Areas to improve will appear once skill scores are available."
                          }
                        />
                      )}
                    </div>
                  </div>
                </HoverCard>
              </section>

              {/* STUDENT ACTIVITY AND FEEDBACK */}
              <section className={`rounded-2xl border ${BORDER} bg-white shadow-sm dark:bg-[#211E27]`}>
                <div className={`border-b ${BORDER} p-5 sm:p-6`}>
                  <h2 className="text-lg font-bold">
                    Student Activity & Feedback
                  </h2>
                  <p className={`mt-1 text-sm ${MUTED}`}>
                    Test attempts, writing feedback and speaking feedback.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Attempts", "Writing Feedback", "Speaking Feedback"].map(
                      (tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`rounded-xl px-4 py-2.5 text-sm
                            font-semibold transition ${
                              activeTab === tab
                                ? PINK
                                : "bg-gray-50 text-[#71809D] hover:bg-gray-100 dark:bg-[#302B37] dark:text-[#B0A5BD]"
                            }`}
                        >
                          {tab}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {activeTab === "Attempts" ? (
                  <>
                    <div className="p-5 sm:p-6">
                      <div className="relative max-w-md">
                        <Search
                          size={18}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          value={attemptSearch}
                          onChange={(event) =>
                            setAttemptSearch(event.target.value)
                          }
                          placeholder="Search test attempts..."
                          className={`${INPUT} pl-10`}
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[880px] text-left">
                        <thead className="bg-gray-50 dark:bg-[#302B37]">
                          <tr className={`text-xs uppercase ${MUTED}`}>
                            <th className="px-5 py-4">Test / Attempt</th>
                            <th className="px-5 py-4">Date</th>
                            <th className="px-5 py-4">Listening</th>
                            <th className="px-5 py-4">Reading</th>
                            <th className="px-5 py-4">Writing</th>
                            <th className="px-5 py-4">Speaking</th>
                            <th className="px-5 py-4">Overall</th>
                            <th className="px-5 py-4">Status</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 dark:divide-[#3B3441]">
                          {filteredAttempts.map((item) => (
                            <tr
                              key={item.id}
                              className="hover:bg-gray-50 dark:hover:bg-[#302B37]"
                            >
                              <td className="px-5 py-4 text-sm font-semibold">
                                {item.title || "Untitled Test"}
                              </td>
                              <td className={`px-5 py-4 text-sm ${MUTED}`}>
                                {dateText(item.date)}
                              </td>
                              {[
                                "listening", "reading", "writing",
                                "speaking", "overall",
                              ].map((key) => (
                                <td key={key} className="px-5 py-4 text-sm">
                                  {scoreText(item[key])}
                                </td>
                              ))}
                              <td className="px-5 py-4">
                                <span
                                  className="rounded-full bg-blue-50
                                    px-3 py-1.5 text-xs font-semibold
                                    text-blue-700 dark:bg-[#202B3B]"
                                >
                                  {item.status || "—"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {!filteredAttempts.length && (
                      <EmptyState
                        icon={FileText}
                        title="No attempts available"
                        description={
                          report.attempts.length
                            ? "No attempts match your search."
                            : "Student test attempts will appear here when the trainer reports API is connected and records exist."
                        }
                      />
                    )}
                  </>
                ) : (
                  <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 sm:p-6">
                    {activeFeedback.map((item) => (
                      <HoverCard key={item.id}>
                        <div className="flex h-full min-h-[220px] flex-col p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div
                              className="flex h-11 w-11 items-center justify-center
                                rounded-xl bg-pink-50 text-[#FF2454]
                                dark:bg-[#4A2538]"
                            >
                              {item.skill === "Writing" ? (
                                <PenLine size={21} />
                              ) : (
                                <MessageCircle size={21} />
                              )}
                            </div>
                            <span className={`text-xs ${MUTED}`}>
                              {dateText(item.date)}
                            </span>
                          </div>

                          <h3 className="mt-4 font-bold">
                            {item.title || `${item.skill} Feedback`}
                          </h3>
                          <p className={`mt-2 text-sm ${MUTED}`}>
                            Reviewer: {item.reviewer || "—"}
                          </p>
                          <p className="mt-2 text-sm font-semibold text-[#FF2454]">
                            {item.score == null ? "Band —" : `Band ${item.score}`}
                          </p>

                          <button
                            type="button"
                            onClick={() => setSelectedFeedback(item)}
                            className="mt-auto flex items-center gap-2
                              pt-5 text-sm font-semibold text-[#FF2454]"
                          >
                            <Eye size={16} />
                            View Feedback
                          </button>
                        </div>
                      </HoverCard>
                    ))}

                    {!activeFeedback.length && (
                      <div className="md:col-span-2">
                        <EmptyState
                          icon={MessageCircle}
                          title={`No ${activeTab.toLowerCase()} available`}
                          description="Feedback cards will appear here when the corresponding API supplies records."
                        />
                      </div>
                    )}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>

      {selectedFeedback && (
        <FeedbackModal
          item={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      )}
    </div>
  );
}
