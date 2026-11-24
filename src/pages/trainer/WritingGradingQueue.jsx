
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search, Filter, FileText, Clock, CheckCircle2, AlertCircle,
  Eye, X, MessageSquare, Send, Sparkles, UserRound,
  CalendarDays, ChevronDown, PenLine, ClipboardCheck,
  RefreshCw, LoaderCircle, Save, ArrowUpRight,
} from "lucide-react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import writingGradingService from "../../services/Trainer/writingGradingService.js";

const criteria = [
  { key: "task", label: "Task Achievement / Response", description: "Addresses the task and develops relevant ideas." },
  { key: "coherence", label: "Coherence & Cohesion", description: "Organization, paragraphing and logical progression." },
  { key: "vocabulary", label: "Lexical Resource", description: "Vocabulary range, precision and word choice." },
  { key: "grammar", label: "Grammatical Range & Accuracy", description: "Sentence variety and grammatical accuracy." },
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 dark:border-[#403746] dark:bg-[#19171e] dark:text-white";
const muted = "text-gray-500 dark:text-[#b0a5bd]";
const border = "border-gray-100 dark:border-[#403746]";
const pink = "bg-[#FF2454] text-white hover:bg-[#e91d49]";

const dateText = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

const numberText = (value) =>
  value === null || value === undefined || value === "" ? "—" : String(value);

function HoverCard({ children }) {
  return (
    <div className="group relative isolate h-full min-w-0 pb-2">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-2 rounded-2xl bg-pink-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-[#4A2538]"
      />
      <div
        className={`relative z-10 flex h-full min-w-0 flex-col rounded-2xl border ${border} bg-white shadow-sm transition-transform duration-300 group-hover:-translate-y-1.5 dark:bg-[#211e27]`}
      >
        {children}
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <HoverCard>
      <div className="flex h-full min-h-[215px] flex-col p-5">
        <div className="flex items-start justify-between">
          <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
            <Icon size={23} />
          </span>
          <ArrowUpRight size={18} className={muted} />
        </div>
        <p className={`mt-5 text-sm font-semibold ${muted}`}>{title}</p>
        <p className="mt-3 text-3xl font-extrabold">{value}</p>
        <p className={`mt-auto pt-4 text-xs leading-5 ${muted}`}>{subtitle}</p>
      </div>
    </HoverCard>
  );
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const listener = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
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
        className={`max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border ${border} bg-white shadow-2xl dark:bg-[#211e27]`}
      >
        <div className={`sticky top-0 z-10 flex items-center justify-between border-b ${border} bg-white px-5 py-4 dark:bg-[#211e27]`}>
          <h2 className="text-lg font-bold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-[#393441]">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function Empty({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
      <FileText size={32} className="text-gray-300" />
      <h3 className="mt-3 font-bold">{title}</h3>
      <p className={`mt-2 max-w-md text-sm leading-6 ${muted}`}>{description}</p>
    </div>
  );
}

function ScoreField({ item, value, onChange }) {
  return (
    <div className={`rounded-xl border ${border} p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold">{item.label}</p>
          <p className={`mt-1 text-xs leading-5 ${muted}`}>{item.description}</p>
        </div>
        <span className="text-lg font-bold text-[#FF2454]">{numberText(value)}</span>
      </div>
      <select
        value={value ?? ""}
        onChange={(event) => onChange(item.key, event.target.value)}
        className={`${inputClass} mt-3`}
      >
        <option value="">Select band</option>
        {Array.from({ length: 18 }, (_, index) => (index + 1) / 2).map((band) => (
          <option key={band} value={band}>{band.toFixed(1)}</option>
        ))}
      </select>
    </div>
  );
}

export default function WritingGradingQueue() {
  const [submissions, setSubmissions] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending Review");
  const [typeFilter, setTypeFilter] = useState("All Tasks");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [showGrading, setShowGrading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState("");
  const [finalBand, setFinalBand] = useState("");
  const [scores, setScores] = useState({
    task: "", coherence: "", vocabulary: "", grammar: "",
  });
  const [gradeError, setGradeError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await writingGradingService.listSubmissions();
      setSubmissions(result.submissions);
      setConnected(result.connected);
      setSelectedId((previous) =>
        result.submissions.some((item) => item.id === previous)
          ? previous
          : result.submissions[0]?.id ?? null
      );
    } catch (err) {
      setError(err.message || "Unable to load writing submissions.");
      setSubmissions([]);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const selected =
    selectedDetail && selectedDetail.id === selectedId
      ? selectedDetail
      : submissions.find((item) => item.id === selectedId) || null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return submissions.filter((item) => {
      const matchesSearch = [item.student, item.title, item.email, item.batch]
        .some((value) => String(value || "").toLowerCase().includes(q));
      const matchesStatus =
        statusFilter === "All Status" || item.status === statusFilter;
      const matchesType =
        typeFilter === "All Tasks" || item.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [submissions, search, statusFilter, typeFilter]);

  const pending = submissions.filter((item) => item.status === "Pending Review").length;
  const reviewed = submissions.filter((item) => item.status === "Reviewed").length;
  const task1 = submissions.filter((item) => item.type === "Writing Task 1").length;
  const task2 = submissions.filter((item) => item.type === "Writing Task 2").length;

  const choose = async (item) => {
    setSelectedId(item.id);
    setSelectedDetail(null);
    setShowGrading(false);
    setShowComments(false);
    setComment("");
    setFeedback("");
    setFinalBand(item.finalBand == null ? "" : String(item.finalBand));
    setScores({
      task: item.descriptors?.task ?? "",
      coherence: item.descriptors?.coherence ?? "",
      vocabulary: item.descriptors?.vocabulary ?? "",
      grammar: item.descriptors?.grammar ?? "",
    });
    setGradeError("");

    if (writingGradingService.connected.getSubmission()) {
      setDetailLoading(true);
      try {
        const detail = await writingGradingService.getSubmission(item.id);
        setSelectedDetail(detail);
      } catch (err) {
        setError(err.message);
      } finally {
        setDetailLoading(false);
      }
    }
  };

  const updateScore = (key, value) =>
    setScores((previous) => ({ ...previous, [key]: value }));

  const values = Object.values(scores).map(Number);
  const allScoresValid =
    Object.values(scores).every((value) => value !== "") &&
    values.every((value) => Number.isFinite(value) && value >= 0.5 && value <= 9);

  const calculatedBand = allScoresValid
    ? (values.reduce((sum, value) => sum + value, 0) / 4).toFixed(2)
    : null;

  const saveGrade = async (event) => {
    event.preventDefault();
    setGradeError("");
    if (!selected) return;

    if (!allScoresValid || !finalBand) {
      setGradeError("Enter all four criteria and final band.");
      return;
    }

    const band = Number(finalBand);
    if (!Number.isFinite(band) || band < 0.5 || band > 9) {
      setGradeError("Final band must be between 0.5 and 9.");
      return;
    }

    setSaving(true);
    try {
      await writingGradingService.saveGrade(selected.id, {
        finalBand: band,
        descriptors: Object.fromEntries(
          Object.entries(scores).map(([key, value]) => [key, Number(value)])
        ),
        feedback: feedback.trim(),
      });
      await load();
      setShowGrading(false);
      setSuccess("Grade saved successfully.");
    } catch (err) {
      setGradeError(err.message || "Unable to save grade.");
    } finally {
      setSaving(false);
    }
  };

  const saveComment = async (event) => {
    event.preventDefault();
    if (!selected || !comment.trim()) return;

    setSaving(true);
    setGradeError("");
    try {
      await writingGradingService.saveComment(selected.id, comment.trim());
      const detail = await writingGradingService.getSubmission(selected.id);
      if (detail) setSelectedDetail(detail);
      await load();
      setComment("");
      setShowComments(false);
      setSuccess("Comment saved successfully.");
    } catch (err) {
      setGradeError(err.message || "Unable to save comment.");
    } finally {
      setSaving(false);
    }
  };

  const closeModals = () => {
    if (saving) return;
    setShowGrading(false);
    setShowComments(false);
    setGradeError("");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F7FF] text-[#10265F] dark:bg-[#17151B] dark:text-white">
      <Sidebar />
      <div className="min-w-0 lg:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* HEADER */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className={`mb-2 text-sm ${muted}`}>Trainer Portal / Writing Grading</p>
              <h1 className="text-2xl font-extrabold sm:text-3xl">Writing Grading Queue</h1>
              <p className={`mt-2 text-sm ${muted}`}>
                Review IELTS writing tasks, assess band descriptors and provide feedback.
              </p>
            </div>
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className={`flex items-center justify-center gap-2 rounded-xl border ${border} bg-white px-5 py-3 text-sm font-semibold disabled:opacity-50 dark:bg-[#211e27]`}
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh Queue
            </button>
          </div>

          {error && (
            <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div role="status" className="flex items-center justify-between rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              {success}
              <button type="button" onClick={() => setSuccess("")} aria-label="Dismiss"><X size={17} /></button>
            </div>
          )}
          {!connected && !loading && (
            <div className={`rounded-xl border ${border} bg-white p-4 text-sm ${muted} dark:bg-[#211e27]`}>
              Trainer-wide writing queue API is not connected yet. This page is ready to display real records when the authorized API adapter is added.
            </div>
          )}

          {/* FOUR EQUAL SUMMARY CARDS */}
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Submissions"
              value={loading ? "…" : connected ? submissions.length : "—"}
              subtitle="Writing responses in the grading queue"
              icon={FileText}
              color="bg-blue-50 text-blue-600 dark:bg-[#202b3b]"
            />
            <StatCard
              title="Pending Reviews"
              value={loading ? "…" : connected ? pending : "—"}
              subtitle="Submissions awaiting trainer review"
              icon={Clock}
              color="bg-orange-50 text-orange-600 dark:bg-[#3b3020]"
            />
            <StatCard
              title="Reviewed"
              value={loading ? "…" : connected ? reviewed : "—"}
              subtitle="Submissions already reviewed"
              icon={CheckCircle2}
              color="bg-emerald-50 text-emerald-600 dark:bg-[#1f352e]"
            />
            <StatCard
              title="Task 1 / Task 2"
              value={loading ? "…" : connected ? `${task1} / ${task2}` : "—"}
              subtitle="Writing task distribution"
              icon={PenLine}
              color="bg-purple-50 text-purple-600 dark:bg-[#30263d]"
            />
          </div>

          {/* FILTERS */}
          <section className={`rounded-2xl border ${border} bg-white p-5 shadow-sm dark:bg-[#211e27]`}>
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search student, batch or writing title..."
                  className={`${inputClass} pl-10`}
                />
              </div>
              <div className="relative">
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className={`${inputClass} appearance-none pl-9 pr-9`}
                >
                  <option>All Status</option>
                  <option>Pending Review</option>
                  <option>Reviewed</option>
                  <option>In Progress</option>
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className={`${inputClass} lg:w-[190px]`}
              >
                <option>All Tasks</option>
                <option>Writing Task 1</option>
                <option>Writing Task 2</option>
              </select>
            </div>
          </section>

          {/* QUEUE + REVIEW WORKSPACE */}
          <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.4fr)]">
            <section className={`overflow-hidden rounded-2xl border ${border} bg-white shadow-sm dark:bg-[#211e27]`}>
              <div className={`border-b ${border} p-5`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Submissions Queue</h2>
                  <span className={`text-sm ${muted}`}>{filtered.length} records</span>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-14">
                  <LoaderCircle size={28} className="animate-spin text-[#FF2454]" />
                </div>
              ) : !filtered.length ? (
                <Empty
                  title="No writing submissions"
                  description={
                    connected
                      ? "No records match the current filters. New submissions will appear here when available."
                      : "Writing submissions will appear when the trainer grading API is connected."
                  }
                />
              ) : (
                <div className={`max-h-[800px] divide-y divide-gray-100 overflow-y-auto dark:divide-[#403746]`}>
                  {filtered.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => choose(item)}
                      className={`w-full p-5 text-left transition hover:bg-pink-50/50 dark:hover:bg-[#302632] ${
                        selectedId === item.id ? "bg-pink-50/70 dark:bg-[#342634]" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700 dark:bg-[#202b3b]">
                            <UserRound size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-bold">{item.student}</p>
                            <p className={`mt-1 truncate text-xs ${muted}`}>{item.email || item.batch}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
                          item.status === "Reviewed"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-[#1f352e]"
                            : "bg-orange-50 text-orange-700 dark:bg-[#3b3020]"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-4 text-sm font-semibold">{item.title}</p>
                      <div className={`mt-3 flex flex-wrap items-center gap-3 text-xs ${muted}`}>
                        <span>{item.type}</span>
                        <span>{dateText(item.submitted)}</span>
                        <span>{numberText(item.wordCount)} words</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className={`min-w-0 overflow-hidden rounded-2xl border ${border} bg-white shadow-sm dark:bg-[#211e27]`}>
              {!selected ? (
                <Empty
                  title="Select a submission"
                  description="Choose a writing submission from the queue to review its essay, scores and feedback."
                />
              ) : (
                <div className="space-y-6 p-5 sm:p-6">
                  {detailLoading && (
                    <div className={`flex items-center gap-2 text-sm ${muted}`}>
                      <LoaderCircle size={17} className="animate-spin" />
                      Loading submission details...
                    </div>
                  )}

                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <p className={`text-sm ${muted}`}>{selected.type}</p>
                      <h2 className="mt-1 text-xl font-bold">{selected.title}</h2>
                      <p className={`mt-2 text-sm ${muted}`}>
                        {selected.student} · {selected.batch}
                      </p>
                    </div>
                    <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 dark:bg-[#202b3b]">
                      {selected.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: "Submitted", value: dateText(selected.submitted), icon: CalendarDays },
                      { label: "Due Date", value: dateText(selected.due), icon: Clock },
                      { label: "Word Count", value: numberText(selected.wordCount), icon: FileText },
                      { label: "AI Estimate", value: numberText(selected.estimatedBand), icon: Sparkles },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className={`min-w-0 rounded-xl border ${border} p-3`}>
                          <Icon size={17} className="text-[#FF2454]" />
                          <p className={`mt-2 text-xs ${muted}`}>{item.label}</p>
                          <p className="mt-1 break-words text-sm font-bold">{item.value}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* ESSAY */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-bold">
                      <PenLine size={19} className="text-[#FF2454]" />
                      Student Writing Response
                    </h3>
                    <div className={`max-h-[420px] overflow-y-auto whitespace-pre-wrap rounded-xl border ${border} bg-gray-50 p-5 text-sm leading-8 dark:bg-[#19171e]`}>
                      {selected.essay || (
                        <span className={muted}>Writing response text is not available.</span>
                      )}
                    </div>
                  </div>

                  {/* AI FEEDBACK */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-bold">
                      <Sparkles size={19} className="text-purple-600" />
                      AI Feedback
                    </h3>
                    <div className={`rounded-xl border ${border} bg-purple-50/50 p-5 text-sm leading-7 dark:bg-[#30263d]/30`}>
                      {selected.aiFeedback || (
                        <span className={muted}>AI feedback is not available yet.</span>
                      )}
                    </div>
                  </div>

                  {/* CRITERIA */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-bold">
                      <ClipboardCheck size={19} className="text-[#FF2454]" />
                      Band Descriptors
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {criteria.map((item) => (
                        <div key={item.key} className={`rounded-xl border ${border} p-4`}>
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold">{item.label}</p>
                            <span className="text-lg font-bold text-[#FF2454]">
                              {numberText(selected.descriptors?.[item.key])}
                            </span>
                          </div>
                          <p className={`mt-2 text-xs leading-5 ${muted}`}>{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FINAL BAND */}
                  <div className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border ${border} p-5`}>
                    <div>
                      <p className={`text-sm ${muted}`}>Final Trainer Band</p>
                      <p className="mt-2 text-3xl font-extrabold">
                        {numberText(selected.finalBand)}
                      </p>
                    </div>
                    <span className={`text-sm ${muted}`}>
                      {selected.status === "Reviewed" ? "Review completed" : "Awaiting review"}
                    </span>
                  </div>

                  {/* COMMENTS */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-bold">
                      <MessageSquare size={19} className="text-[#FF2454]" />
                      Trainer Comments
                    </h3>
                    {selected.comments?.length ? (
                      <div className="space-y-3">
                        {selected.comments.map((item, index) => (
                          <div key={item.id || index} className={`rounded-xl border ${border} p-4`}>
                            <p className="whitespace-pre-wrap text-sm leading-6">
                              {item.text || item.comment}
                            </p>
                            <p className={`mt-2 text-xs ${muted}`}>
                              {dateText(item.createdAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`rounded-xl border ${border} p-5 text-sm ${muted}`}>
                        No trainer comments yet.
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setGradeError("");
                        setShowGrading(true);
                      }}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${pink}`}
                    >
                      <ClipboardCheck size={18} />
                      Grade Writing
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGradeError("");
                        setShowComments(true);
                      }}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border ${border} px-4 py-3 text-sm font-semibold`}
                    >
                      <MessageSquare size={18} />
                      Add Comment
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* GRADING MODAL */}
      {showGrading && selected && (
        <Modal title="Grade Writing Submission" onClose={closeModals}>
          <form onSubmit={saveGrade} className="space-y-5">
            <div className={`rounded-xl bg-gray-50 p-4 dark:bg-[#302b37]`}>
              <p className="font-bold">{selected.student}</p>
              <p className={`mt-1 text-sm ${muted}`}>{selected.title}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {criteria.map((item) => (
                <ScoreField
                  key={item.key}
                  item={item}
                  value={scores[item.key]}
                  onChange={updateScore}
                />
              ))}
            </div>

            <div className={`rounded-xl border ${border} p-4`}>
              <p className={`text-sm ${muted}`}>Average Descriptor Band</p>
              <p className="mt-2 text-3xl font-extrabold text-[#FF2454]">
                {calculatedBand ?? "—"}
              </p>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">Final Band Score</span>
              <select
                value={finalBand}
                onChange={(event) => setFinalBand(event.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select final band</option>
                {Array.from({ length: 18 }, (_, index) => (index + 1) / 2).map((band) => (
                  <option key={band} value={band}>{band.toFixed(1)}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">Trainer Feedback</span>
              <textarea
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                rows={5}
                placeholder="Write detailed feedback for the student..."
                className={inputClass}
              />
            </label>

            {gradeError && (
              <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10">
                {gradeError}
              </p>
            )}

            {!writingGradingService.connected.saveGrade() && (
              <p className={`text-xs leading-5 ${muted}`}>
                The trainer grading save API is not connected. Scores can be entered in this form, but they cannot be saved to the database yet.
              </p>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={closeModals} disabled={saving} className={`flex-1 rounded-xl border ${border} px-4 py-3 text-sm font-semibold`}>
                Cancel
              </button>
              <button type="submit" disabled={saving} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50 ${pink}`}>
                <Save size={17} />
                {saving ? "Saving..." : "Submit Grade"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* COMMENT MODAL */}
      {showComments && selected && (
        <Modal title="Add Trainer Comment" onClose={closeModals}>
          <form onSubmit={saveComment} className="space-y-4">
            <p className={`text-sm ${muted}`}>
              Comment on {selected.student}'s writing submission.
            </p>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={6}
              placeholder="Enter your comment..."
              required
              className={inputClass}
            />

            {gradeError && (
              <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {gradeError}
              </p>
            )}

            {!writingGradingService.connected.saveComment() && (
              <p className={`text-xs leading-5 ${muted}`}>
                The trainer comment API is not connected yet. Comments will not be saved until the authorized endpoint is available.
              </p>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={closeModals} disabled={saving} className={`flex-1 rounded-xl border ${border} px-4 py-3 text-sm font-semibold`}>
                Cancel
              </button>
              <button type="submit" disabled={saving} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50 ${pink}`}>
                <Send size={17} />
                {saving ? "Saving..." : "Save Comment"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
