
import React, {
  useCallback, useEffect, useMemo, useState,
} from "react";
import {
  Video, CalendarDays, Clock, Users, Plus, Search,
  X, CheckCircle2, Mic, FileText, ExternalLink,
  ClipboardCheck, UserRound, AlertCircle, Eye,
  RefreshCw, LoaderCircle, Trash2, Pencil, Save,
  MessageSquare, Headphones, BookOpen, ArrowUpRight,
} from "lucide-react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import liveSpeakingService from "../../services/Trainer/liveSpeakingService.js";

const BORDER = "border-gray-100 dark:border-[#3B3441]";
const MUTED = "text-gray-500 dark:text-[#B0A5BD]";
const PINK = "bg-[#FF2454] text-white hover:bg-[#e91d49]";
const INPUT =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 " +
  "text-sm outline-none focus:border-blue-400 focus:ring-2 " +
  "focus:ring-blue-50 dark:border-[#3B3441] " +
  "dark:bg-[#19171E] dark:text-white";

const CRITERIA = [
  { key: "fluency", title: "Fluency & Coherence" },
  { key: "vocabulary", title: "Lexical Resource" },
  { key: "grammar", title: "Grammatical Range & Accuracy" },
  { key: "pronunciation", title: "Pronunciation" },
];

const EMPTY_SCHEDULE = {
  studentId: "",
  batchId: "",
  date: "",
  time: "",
  duration: "15",
  type: "Full Speaking Test",
  meetingLink: "",
  notes: "",
};

const EMPTY_SCORE = {
  fluency: "",
  vocabulary: "",
  grammar: "",
  pronunciation: "",
  feedback: "",
};

function dateText(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function sessionDate(session) {
  if (session.scheduledAt) {
    return new Date(session.scheduledAt);
  }

  if (!session.date) return null;

  const date = new Date(
    `${session.date.slice(0, 10)}T${session.time || "00:00"}`
  );

  return Number.isNaN(date.getTime()) ? null : date;
}

function localDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function averageScore(scores) {
  const values = CRITERIA.map((criterion) => scores?.[criterion.key]);

  if (
    values.some(
      (value) =>
        value === null ||
        value === undefined ||
        value === "" ||
        !Number.isFinite(Number(value))
    )
  ) {
    return null;
  }

  const average =
    values.reduce((sum, value) => sum + Number(value), 0) /
    values.length;

  return Math.round(average * 2) / 2;
}

function HoverCard({ children }) {
  return (
    <div className="group relative isolate h-full min-w-0 pb-2">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-2 rounded-2xl bg-pink-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-[#4A2538]"
      />
      <div
        className={`relative z-10 flex h-full min-w-0 flex-col rounded-2xl border ${BORDER} bg-white shadow-sm transition-transform duration-300 group-hover:-translate-y-1.5 dark:bg-[#211E27]`}
      >
        {children}
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <HoverCard>
      <div className="flex h-full min-h-[210px] flex-col p-5">
        <div className="flex items-start justify-between">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
          >
            <Icon size={23} />
          </span>
          <ArrowUpRight size={18} className={MUTED} />
        </div>
        <p className={`mt-5 text-sm font-semibold ${MUTED}`}>
          {title}
        </p>
        <p className="mt-3 text-3xl font-extrabold">{value}</p>
        <p className={`mt-auto pt-4 text-xs leading-5 ${MUTED}`}>
          {subtitle}
        </p>
      </div>
    </HoverCard>
  );
}

function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl border ${BORDER} bg-white shadow-2xl dark:bg-[#211E27] ${
          wide ? "max-w-3xl" : "max-w-xl"
        }`}
      >
        <div
          className={`sticky top-0 z-10 flex items-center justify-between border-b ${BORDER} bg-white px-5 py-4 dark:bg-[#211E27]`}
        >
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-[#393441]"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      {children}
      {hint && (
        <span className={`mt-1.5 block text-xs ${MUTED}`}>
          {hint}
        </span>
      )}
    </label>
  );
}

function StatusBadge({ status }) {
  const colors = {
    Upcoming: "bg-blue-50 text-blue-700 dark:bg-[#202B3B]",
    Completed: "bg-emerald-50 text-emerald-700 dark:bg-[#1F352E]",
    Cancelled: "bg-red-50 text-red-700 dark:bg-[#39232F]",
    "In Progress": "bg-orange-50 text-orange-700 dark:bg-[#3B3020]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
        colors[status] || "bg-gray-100 text-gray-600 dark:bg-[#393441]"
      }`}
    >
      {status || "—"}
    </span>
  );
}

function DetailRow({ label, value, icon: Icon }) {
  return (
    <div
      className={`flex flex-col gap-2 border-b ${BORDER} py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between`}
    >
      <span className={`flex items-center gap-2 text-sm ${MUTED}`}>
        {Icon && <Icon size={16} />}
        {label}
      </span>
      <span className="break-all text-sm font-semibold">
        {value === null || value === undefined || value === ""
          ? "—"
          : value}
      </span>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="px-5 py-14 text-center">
      <Mic size={34} className="mx-auto text-gray-300" />
      <p className="mt-4 font-bold">{title}</p>
      <p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${MUTED}`}>
        {description}
      </p>
    </div>
  );
}

function SpeakingParts() {
  const parts = [
    {
      title: "Part 1 — Introduction",
      duration: "4–5 minutes",
      description: "Personal questions and familiar everyday topics.",
      icon: UserRound,
    },
    {
      title: "Part 2 — Cue Card",
      duration: "3–4 minutes",
      description: "Individual long turn with preparation time.",
      icon: FileText,
    },
    {
      title: "Part 3 — Discussion",
      duration: "4–5 minutes",
      description: "In-depth discussion connected to the Part 2 topic.",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3">
      {parts.map((part) => {
        const Icon = part.icon;

        return (
          <HoverCard key={part.title}>
            <div className="flex h-full min-h-[170px] flex-col p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-[#FF2454] dark:bg-[#4A2538]">
                  <Icon size={21} />
                </span>
                <span className={`text-xs ${MUTED}`}>
                  {part.duration}
                </span>
              </div>
              <h3 className="mt-4 font-bold">{part.title}</h3>
              <p className={`mt-auto pt-2 text-sm leading-6 ${MUTED}`}>
                {part.description}
              </p>
            </div>
          </HoverCard>
        );
      })}
    </div>
  );
}

export default function LiveSpeakingTest() {
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [connected, setConnected] = useState(false);
  const [complete, setComplete] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [activeTab, setActiveTab] = useState("Upcoming");
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("All Batches");

  const [showSchedule, setShowSchedule] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showScoring, setShowScoring] = useState(false);

  const [scheduleForm, setScheduleForm] = useState(EMPTY_SCHEDULE);
  const [scoreForm, setScoreForm] = useState(EMPTY_SCORE);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    const results = await Promise.allSettled([
      liveSpeakingService.listSessions(),
      liveSpeakingService.getStudentsAndBatches(),
    ]);

    const sessionResult = results[0];
    const studentResult = results[1];

    if (sessionResult.status === "fulfilled") {
      setSessions(sessionResult.value.sessions);
      setConnected(sessionResult.value.connected);
      setComplete(sessionResult.value.complete);
    } else {
      setSessions([]);
      setConnected(false);
      setComplete(false);
      setError(
        sessionResult.reason?.message ||
        "Unable to load speaking sessions."
      );
    }

    if (studentResult.status === "fulfilled") {
      setStudents(studentResult.value.students);
      setBatches(studentResult.value.batches);

      if (studentResult.value.errors.length) {
        setError((previous) =>
          [previous, ...studentResult.value.errors]
            .filter(Boolean)
            .join(" | ")
        );
      }
    } else {
      setStudents([]);
      setBatches([]);
      setError((previous) =>
        [
          previous,
          studentResult.reason?.message ||
            "Unable to load students and batches.",
        ]
          .filter(Boolean)
          .join(" | ")
      );
    }

    setLoading(false);

    if (sessionResult.status === "rejected") {
      throw sessionResult.reason;
    }

    return sessionResult.value;
  }, []);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sessions.filter((session) => {
      const matchesSearch =
        !query ||
        [
          session.student,
          session.email,
          session.batch,
          session.type,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesBatch =
        batchFilter === "All Batches" ||
        session.batchId === batchFilter;

      const matchesTab =
        activeTab === "All Sessions" ||
        session.status === activeTab;

      return matchesSearch && matchesBatch && matchesTab;
    });
  }, [sessions, search, batchFilter, activeTab]);

  const counts = useMemo(() => ({
    upcoming: sessions.filter((s) => s.status === "Upcoming").length,
    completed: sessions.filter((s) => s.status === "Completed").length,
    today: sessions.filter((s) => {
      const date = sessionDate(s);
      if (!date || Number.isNaN(date.getTime())) return false;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}` === localDate();
    }).length,
  }), [sessions]);

  const availableStudents = useMemo(() => {
    if (!scheduleForm.batchId) return students;

    return students.filter((student) =>
      student.batches.some((b) => b.id === scheduleForm.batchId)
    );
  }, [students, scheduleForm.batchId]);

  const changeSchedule = (event) => {
    const { name, value } = event.target;

    setScheduleForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "batchId" ? { studentId: "" } : {}),
    }));
  };

  const closeSchedule = () => {
    if (saving) return;
    setShowSchedule(false);
    setEditing(null);
  };

  const openSchedule = () => {
    setEditing(null);
    setScheduleForm(EMPTY_SCHEDULE);
    setError("");
    setShowSchedule(true);
  };

  const openEdit = (session) => {
    setEditing(session);
    setScheduleForm({
      studentId: session.studentId,
      batchId: session.batchId,
      date: session.date ||
        (session.scheduledAt
          ? session.scheduledAt.slice(0, 10)
          : ""),
      time: session.time ||
        (session.scheduledAt
          ? session.scheduledAt.slice(11, 16)
          : ""),
      duration: String(session.duration || 15),
      type: session.type,
      meetingLink: session.meetingLink,
      notes: session.notes,
    });
    setShowSchedule(true);
  };

  const runAction = async (action, message) => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await action();
      await load();
      setSuccess(message);
      return true;
    } catch (err) {
      setError(err.message || "Action failed.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveSchedule = async (event) => {
    event.preventDefault();

    if (!scheduleForm.studentId) {
      setError("Please select a student.");
      return;
    }

    if (!scheduleForm.date || !scheduleForm.time) {
      setError("Please select date and time.");
      return;
    }

    const dateTime = new Date(
      `${scheduleForm.date}T${scheduleForm.time}`
    );

    if (Number.isNaN(dateTime.getTime())) {
      setError("Invalid session date or time.");
      return;
    }

    const duration = Number(scheduleForm.duration);

    if (!Number.isFinite(duration) || duration < 1) {
      setError("Session duration must be valid.");
      return;
    }

    const payload = {
      studentId: scheduleForm.studentId,
      batchId: scheduleForm.batchId || null,
      scheduledAt: dateTime.toISOString(),
      duration,
      type: scheduleForm.type,
      meetingLink: scheduleForm.meetingLink.trim(),
      notes: scheduleForm.notes.trim(),
    };

    const successResult = await runAction(
      () =>
        editing
          ? liveSpeakingService.updateSession(editing.id, payload)
          : liveSpeakingService.scheduleSession(payload),
      editing
        ? "Speaking session updated successfully."
        : "Speaking session scheduled successfully."
    );

    if (successResult) {
      setShowSchedule(false);
      setEditing(null);
    }
  };

  const openDetails = async (session) => {
    setSelectedSession(session);
    setDetailLoading(false);

    if (!liveSpeakingService.connected("getSession")) return;

    setDetailLoading(true);

    try {
      const result = await liveSpeakingService.getSession(session.id);
      if (result) setSelectedSession(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const openScoring = (session) => {
    setSelectedSession(session);
    setScoreForm({
      fluency: session.scores?.fluency ?? "",
      vocabulary: session.scores?.vocabulary ?? "",
      grammar: session.scores?.grammar ?? "",
      pronunciation: session.scores?.pronunciation ?? "",
      feedback: session.feedback || "",
    });
    setShowScoring(true);
  };

  const calculatedBand = averageScore(scoreForm);

  const submitScore = async (event) => {
    event.preventDefault();

    if (!selectedSession) return;

    if (calculatedBand === null) {
      setError("Please enter all four band scores.");
      return;
    }

    const payload = {
      scores: Object.fromEntries(
        CRITERIA.map((criterion) => [
          criterion.key,
          Number(scoreForm[criterion.key]),
        ])
      ),
      overallBand: calculatedBand,
      feedback: scoreForm.feedback.trim(),
    };

    const ok = await runAction(
      () => liveSpeakingService.saveScore(selectedSession.id, payload),
      "Speaking assessment saved successfully."
    );

    if (ok) {
      setShowScoring(false);
      setSelectedSession(null);
    }
  };

  const deleteSession = async (session) => {
    if (!window.confirm("Delete this speaking session?")) return;

    const ok = await runAction(
      () => liveSpeakingService.deleteSession(session.id),
      "Speaking session deleted successfully."
    );

    if (ok) setSelectedSession(null);
  };

  const sessionCount = (value) =>
    loading ? "…" : connected && complete ? value : "—";

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#F5F7FF] text-[#10265F] dark:bg-[#17151B] dark:text-white"
    >
      <Sidebar />

      <div className="min-w-0 lg:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* HEADER */}
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className={`mb-2 text-sm ${MUTED}`}>
                Trainer Portal / Live Speaking
              </p>
              <h1 className="text-2xl font-extrabold sm:text-3xl">
                Live Speaking Tests
              </h1>
              <p className={`mt-2 text-sm ${MUTED}`}>
                Schedule speaking sessions, conduct IELTS interviews
                and evaluate student performance.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => load().catch(() => {})}
                disabled={loading}
                className={`flex items-center gap-2 rounded-xl border ${BORDER} bg-white px-4 py-3 text-sm font-semibold disabled:opacity-50 dark:bg-[#211E27]`}
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={openSchedule}
                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold ${PINK}`}
              >
                <Plus size={18} />
                Schedule Speaking Test
              </button>
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300"
            >
              <AlertCircle size={19} className="shrink-0" />
              <span className="break-words">{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
                className="ml-auto"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {success && (
            <div
              role="status"
              className="flex items-center justify-between rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
            >
              {success}
              <button
                type="button"
                onClick={() => setSuccess("")}
                aria-label="Dismiss success"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {!loading && !connected && (
            <div
              className={`rounded-xl border ${BORDER} bg-white p-4 text-sm ${MUTED} dark:bg-[#211E27]`}
            >
              Trainer live speaking sessions API is not connected yet.
              Sessions will load here after the authorized API adapter
              is integrated.
            </div>
          )}

          {/* FOUR EQUAL SUMMARY CARDS */}
          <section className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Sessions"
              value={sessionCount(sessions.length)}
              subtitle="All scheduled and completed speaking sessions"
              icon={Video}
              color="bg-blue-50 text-blue-600 dark:bg-[#202B3B]"
            />
            <StatCard
              title="Upcoming Sessions"
              value={sessionCount(counts.upcoming)}
              subtitle="Speaking sessions awaiting completion"
              icon={CalendarDays}
              color="bg-purple-50 text-purple-600 dark:bg-[#30263D]"
            />
            <StatCard
              title="Completed Sessions"
              value={sessionCount(counts.completed)}
              subtitle="Finished speaking assessments"
              icon={CheckCircle2}
              color="bg-emerald-50 text-emerald-600 dark:bg-[#1F352E]"
            />
            <StatCard
              title="Today's Sessions"
              value={sessionCount(counts.today)}
              subtitle="Speaking sessions scheduled for today"
              icon={Clock}
              color="bg-orange-50 text-orange-600 dark:bg-[#3B3020]"
            />
          </section>

          {/* SPEAKING TEST STRUCTURE */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-bold">
                IELTS Speaking Test Structure
              </h2>
              <p className={`mt-1 text-sm ${MUTED}`}>
                Three parts of a standard IELTS speaking interview.
              </p>
            </div>
            <SpeakingParts />
          </section>

          {/* FILTERS */}
          <section
            className={`rounded-2xl border ${BORDER} bg-white p-5 shadow-sm dark:bg-[#211E27]`}
          >
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search students, sessions or batches..."
                  className={`${INPUT} pl-10`}
                />
              </div>

              <select
                value={batchFilter}
                onChange={(event) => setBatchFilter(event.target.value)}
                className={`${INPUT} lg:w-[220px]`}
              >
                <option>All Batches</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* SESSIONS TABLE */}
          <section
            className={`overflow-hidden rounded-2xl border ${BORDER} bg-white shadow-sm dark:bg-[#211E27]`}
          >
            <div className={`border-b ${BORDER} p-5 sm:p-6`}>
              <h2 className="text-lg font-bold">Speaking Sessions</h2>
              <p className={`mt-1 text-sm ${MUTED}`}>
                Manage upcoming and completed student interviews.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {["Upcoming", "Completed", "All Sessions"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      activeTab === tab
                        ? PINK
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-[#302B37] dark:text-[#B0A5BD]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-gray-50 dark:bg-[#302B37]">
                  <tr className={`text-xs uppercase tracking-wide ${MUTED}`}>
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Batch</th>
                    <th className="px-5 py-4">Date & Time</th>
                    <th className="px-5 py-4">Duration</th>
                    <th className="px-5 py-4">Test Type</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Band</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-[#3B3441]">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-14 text-center">
                        <LoaderCircle
                          size={29}
                          className="mx-auto animate-spin text-[#FF2454]"
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredSessions.map((session) => {
                      const date = sessionDate(session);
                      const score =
                        session.overallBand ??
                        averageScore(session.scores);

                      return (
                        <tr
                          key={session.id}
                          className="hover:bg-gray-50/70 dark:hover:bg-[#302B37]"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-[#202B3B]">
                                <UserRound size={19} />
                              </span>
                              <div>
                                <p className="font-semibold">
                                  {session.student}
                                </p>
                                <p className={`mt-1 text-xs ${MUTED}`}>
                                  {session.email || "—"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className={`px-5 py-4 text-sm ${MUTED}`}>
                            {session.batch}
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold">
                              {date
                                ? dateText(date)
                                : dateText(session.date)}
                            </p>
                            <p className={`mt-1 text-xs ${MUTED}`}>
                              {session.time ||
                                (date && !Number.isNaN(date.getTime())
                                  ? date.toLocaleTimeString("en-IN", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "—")}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm">
                            {session.duration} min
                          </td>

                          <td className="px-5 py-4 text-sm">
                            {session.type}
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge status={session.status} />
                          </td>

                          <td className="px-5 py-4 text-sm font-bold">
                            {score ?? "—"}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => openDetails(session)}
                                title="View details"
                                className="rounded-lg p-2 hover:bg-blue-50 dark:hover:bg-[#302B37]"
                              >
                                <Eye size={18} />
                              </button>

                              {session.status === "Upcoming" && (
                                <button
                                  type="button"
                                  onClick={() => openEdit(session)}
                                  title="Edit session"
                                  className="rounded-lg p-2 hover:bg-blue-50 dark:hover:bg-[#302B37]"
                                >
                                  <Pencil size={18} />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => openScoring(session)}
                                title="Score speaking test"
                                className="rounded-lg p-2 hover:bg-pink-50 dark:hover:bg-[#342634]"
                              >
                                <ClipboardCheck size={18} />
                              </button>

                              {session.meetingLink && (
                                <a
                                  href={session.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Open meeting"
                                  className="rounded-lg p-2 hover:bg-blue-50 dark:hover:bg-[#302B37]"
                                >
                                  <ExternalLink size={18} />
                                </a>
                              )}

                              <button
                                type="button"
                                onClick={() => deleteSession(session)}
                                title="Delete session"
                                className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-[#39232F]"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {!loading && filteredSessions.length === 0 && (
              <EmptyState
                title="No speaking sessions found"
                description={
                  connected
                    ? "No sessions match your filters. Real sessions will appear here when available."
                    : "Sessions will appear here once the trainer live speaking API is connected."
                }
              />
            )}

            <div
              className={`border-t ${BORDER} px-5 py-4 text-sm ${MUTED}`}
            >
              Showing {filteredSessions.length} of{" "}
              {connected ? sessions.length : "—"} sessions
              {!complete && connected && " (partial API data)"}
            </div>
          </section>
        </main>
      </div>

      {/* SCHEDULE / EDIT MODAL */}
      {showSchedule && (
        <Modal
          title={
            editing
              ? "Edit Speaking Session"
              : "Schedule Speaking Test"
          }
          onClose={closeSchedule}
        >
          <form onSubmit={saveSchedule} className="space-y-4">
            <Field label="Select Batch">
              <select
                name="batchId"
                value={scheduleForm.batchId}
                onChange={changeSchedule}
                className={INPUT}
              >
                <option value="">Select batch</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Select Student">
              <select
                name="studentId"
                value={scheduleForm.studentId}
                onChange={changeSchedule}
                className={INPUT}
                required
              >
                <option value="">Select student</option>
                {availableStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                    {student.email ? ` (${student.email})` : ""}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Session Date">
                <input
                  type="date"
                  name="date"
                  value={scheduleForm.date}
                  onChange={changeSchedule}
                  required
                  className={INPUT}
                />
              </Field>

              <Field label="Session Time">
                <input
                  type="time"
                  name="time"
                  value={scheduleForm.time}
                  onChange={changeSchedule}
                  required
                  className={INPUT}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Test Type">
                <select
                  name="type"
                  value={scheduleForm.type}
                  onChange={changeSchedule}
                  className={INPUT}
                >
                  <option>Full Speaking Test</option>
                  <option>Speaking Practice</option>
                  <option>Mock Interview</option>
                </select>
              </Field>

              <Field label="Duration (minutes)">
                <input
                  type="number"
                  name="duration"
                  value={scheduleForm.duration}
                  onChange={changeSchedule}
                  min="1"
                  max="180"
                  required
                  className={INPUT}
                />
              </Field>
            </div>

            <Field label="Meeting Link">
              <input
                type="url"
                name="meetingLink"
                value={scheduleForm.meetingLink}
                onChange={changeSchedule}
                placeholder="https://..."
                className={INPUT}
              />
            </Field>

            <Field label="Trainer Notes">
              <textarea
                name="notes"
                value={scheduleForm.notes}
                onChange={changeSchedule}
                rows={4}
                placeholder="Add session instructions or notes..."
                className={INPUT}
              />
            </Field>

            {!liveSpeakingService.connected(
              editing ? "updateSession" : "scheduleSession"
            ) && (
              <p className={`rounded-xl bg-orange-50 p-3 text-sm text-orange-700 dark:bg-[#3B3020]`}>
                Trainer scheduling API is not connected yet.
                This form cannot save a session to the database until
                the verified endpoint is integrated.
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={closeSchedule}
                disabled={saving}
                className={`flex-1 rounded-xl border ${BORDER} px-4 py-3 text-sm font-semibold`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !liveSpeakingService.connected(
                  editing ? "updateSession" : "scheduleSession"
                )}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50 ${PINK}`}
              >
                <CalendarDays size={17} />
                {saving
                  ? "Saving..."
                  : editing
                    ? "Save Changes"
                    : "Schedule Session"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* SESSION DETAILS MODAL */}
      {selectedSession && !showScoring && (
        <Modal
          title="Speaking Session Details"
          onClose={() => setSelectedSession(null)}
          wide
        >
          {detailLoading ? (
            <div className="flex justify-center py-12">
              <LoaderCircle
                size={28}
                className="animate-spin text-[#FF2454]"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold">
                    {selectedSession.student}
                  </h3>
                  <p className={`mt-1 text-sm ${MUTED}`}>
                    {selectedSession.type}
                  </p>
                </div>
                <StatusBadge status={selectedSession.status} />
              </div>

              <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                <DetailRow
                  icon={UserRound}
                  label="Student"
                  value={selectedSession.student}
                />
                <DetailRow
                  icon={Users}
                  label="Batch"
                  value={selectedSession.batch}
                />
                <DetailRow
                  icon={CalendarDays}
                  label="Date"
                  value={dateText(
                    sessionDate(selectedSession) ||
                    selectedSession.date
                  )}
                />
                <DetailRow
                  icon={Clock}
                  label="Time"
                  value={
                    selectedSession.time ||
                    (selectedSession.scheduledAt
                      ? new Date(
                          selectedSession.scheduledAt
                        ).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—")
                  }
                />
                <DetailRow
                  icon={Clock}
                  label="Duration"
                  value={`${selectedSession.duration} minutes`}
                />
                <DetailRow
                  icon={Video}
                  label="Test Type"
                  value={selectedSession.type}
                />
              </div>

              <section>
                <h4 className="mb-3 font-bold">Meeting Details</h4>
                {selectedSession.meetingLink ? (
                  <a
                    href={selectedSession.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 break-all text-sm font-semibold text-[#FF2454]"
                  >
                    <ExternalLink size={17} />
                    Open Speaking Meeting
                  </a>
                ) : (
                  <p className={`text-sm ${MUTED}`}>
                    No meeting link available.
                  </p>
                )}
              </section>

              <section>
                <h4 className="mb-3 font-bold">Trainer Notes</h4>
                <p
                  className={`whitespace-pre-wrap rounded-xl border ${BORDER} p-4 text-sm leading-7 ${MUTED}`}
                >
                  {selectedSession.notes || "No notes available."}
                </p>
              </section>

              <section>
                <h4 className="mb-3 font-bold">
                  IELTS Speaking Assessment
                </h4>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {CRITERIA.map((criterion) => (
                    <div
                      key={criterion.key}
                      className={`flex items-center justify-between gap-3 rounded-xl border ${BORDER} p-4`}
                    >
                      <span className="text-sm font-semibold">
                        {criterion.title}
                      </span>
                      <span className="text-lg font-bold text-[#FF2454]">
                        {selectedSession.scores?.[criterion.key] ?? "—"}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className={`mt-3 rounded-xl border ${BORDER} p-4`}
                >
                  <p className={`text-sm ${MUTED}`}>
                    Overall Speaking Band
                  </p>
                  <p className="mt-2 text-3xl font-extrabold">
                    {selectedSession.overallBand ??
                      averageScore(selectedSession.scores) ??
                      "—"}
                  </p>
                </div>
              </section>

              <section>
                <h4 className="mb-3 font-bold">Trainer Feedback</h4>
                <p
                  className={`whitespace-pre-wrap rounded-xl border ${BORDER} p-4 text-sm leading-7 ${MUTED}`}
                >
                  {selectedSession.feedback ||
                    "No trainer feedback available."}
                </p>
              </section>

              <button
                type="button"
                onClick={() => openScoring(selectedSession)}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${PINK}`}
              >
                <ClipboardCheck size={18} />
                Grade Speaking Test
              </button>
            </div>
          )}
        </Modal>
      )}

      {/* SPEAKING SCORING MODAL */}
      {showScoring && selectedSession && (
        <Modal
          title="IELTS Speaking Assessment"
          onClose={() => {
            if (!saving) {
              setShowScoring(false);
              setSelectedSession(null);
            }
          }}
          wide
        >
          <form onSubmit={submitScore} className="space-y-5">
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#302B37]">
              <p className="font-bold">{selectedSession.student}</p>
              <p className={`mt-1 text-sm ${MUTED}`}>
                {selectedSession.type} · {selectedSession.batch}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {CRITERIA.map((criterion) => (
                <Field key={criterion.key} label={criterion.title}>
                  <select
                    value={scoreForm[criterion.key]}
                    onChange={(event) =>
                      setScoreForm((previous) => ({
                        ...previous,
                        [criterion.key]: event.target.value,
                      }))
                    }
                    className={INPUT}
                    required
                  >
                    <option value="">Select band score</option>
                    {Array.from(
                      { length: 18 },
                      (_, index) => (index + 1) / 2
                    ).map((band) => (
                      <option key={band} value={band}>
                        {band.toFixed(1)}
                      </option>
                    ))}
                  </select>
                </Field>
              ))}
            </div>

            <div
              className={`rounded-xl border ${BORDER} bg-gray-50 p-5 dark:bg-[#302B37]`}
            >
              <p className={`text-sm ${MUTED}`}>
                Calculated Overall Band
              </p>
              <p className="mt-2 text-4xl font-extrabold text-[#FF2454]">
                {calculatedBand ?? "—"}
              </p>
              <p className={`mt-2 text-xs ${MUTED}`}>
                Calculated from the four assessment criteria.
              </p>
            </div>

            <Field label="Trainer Feedback">
              <textarea
                value={scoreForm.feedback}
                onChange={(event) =>
                  setScoreForm((previous) => ({
                    ...previous,
                    feedback: event.target.value,
                  }))
                }
                rows={6}
                placeholder="Write detailed speaking assessment feedback..."
                className={INPUT}
              />
            </Field>

            {!liveSpeakingService.connected("saveScore") && (
              <p className="rounded-xl bg-orange-50 p-3 text-sm text-orange-700 dark:bg-[#3B3020]">
                Trainer speaking grading API is not connected yet.
                Scores and feedback cannot be saved until the backend
                endpoint is integrated.
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setShowScoring(false);
                  setSelectedSession(null);
                }}
                disabled={saving}
                className={`flex-1 rounded-xl border ${BORDER} px-4 py-3 text-sm font-semibold`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  saving ||
                  !liveSpeakingService.connected("saveScore")
                }
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50 ${PINK}`}
              >
                <Save size={18} />
                {saving ? "Saving..." : "Submit Assessment"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
