import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Sparkles,
  Brain,
  PenLine,
  Mic,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Target,
  Clock,
  FileText,
  Send,
  RefreshCw,
  Lightbulb,
  X,
  TrendingUp,
  MessageSquare,
  LoaderCircle,
  ChevronRight,
  Headphones,
} from "lucide-react";

import StudentLayout from "./StudentLayout";
import aiFeedbackService from "../../services/aiFeedbackService";

// =====================================================
// HELPERS
// =====================================================

const getData = (response) => response?.data ?? response ?? {};

const getArray = (response) => {
  const data = getData(response);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.submissions)) return data.submissions;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

const getId = (item) =>
  item?.id ||
  item?.submissionId ||
  item?.submission_id ||
  item?.uuid ||
  null;

const getScore = (item) => {
  const possibleScores = [
    item?.overallBand,
    item?.overall_band,
    item?.bandScore,
    item?.band_score,
    item?.overallScore,
    item?.overall_score,
    item?.aiEvaluation?.overallBand,
    item?.aiEvaluation?.overall_band,
    item?.evaluation?.overallBand,
    item?.evaluation?.overall_band,
    item?.result?.overallBand,
  ];

  const score = possibleScores.find(
    (value) => value !== undefined && value !== null && value !== ""
  );

  const parsed = Number(score);
  return Number.isFinite(parsed) ? parsed : null;
};

const getCriteria = (item) => {
  const evaluation =
    item?.aiEvaluation ||
    item?.evaluation ||
    item?.feedback ||
    item?.result ||
    item;

  const criteria =
    evaluation?.criteria ||
    evaluation?.assessmentCriteria ||
    evaluation?.assessment_criteria ||
    evaluation?.criterionScores ||
    evaluation?.criterion_scores ||
    [];

  if (Array.isArray(criteria)) {
    return criteria.map((criterion) => ({
      name:
        criterion?.name ||
        criterion?.criterion ||
        criterion?.title ||
        "Assessment criterion",
      score: Number(
        criterion?.score ??
          criterion?.band ??
          criterion?.bandScore ??
          criterion?.band_score ??
          0
      ),
      detail:
        criterion?.feedback ||
        criterion?.comment ||
        criterion?.detail ||
        criterion?.description ||
        "No additional feedback available.",
    }));
  }

  return Object.entries(criteria || {}).map(([name, value]) => ({
    name,
    score: Number(value?.score ?? value?.band ?? 0),
    detail:
      value?.feedback ||
      value?.comment ||
      value?.detail ||
      "No additional feedback available.",
  }));
};

const getFeedbackItem = (item) => {
  const evaluation =
    item?.aiEvaluation ||
    item?.evaluation ||
    item?.feedback ||
    item?.result ||
    {};

  const score = getScore(item);

  const strengths =
    evaluation?.strengths ||
    evaluation?.positivePoints ||
    evaluation?.positive_points ||
    [];

  const improvements =
    evaluation?.improvements ||
    evaluation?.areasToImprove ||
    evaluation?.areas_to_improve ||
    evaluation?.weaknesses ||
    [];

  const status = item?.status || evaluation?.status || "Processing";

  return {
    id: getId(item),
    attemptId:
      item?.attemptId ||
      item?.attempt_id ||
      item?.attempt?.id ||
      null,
    title:
      item?.title ||
      item?.taskTitle ||
      item?.task_title ||
      item?.task?.title ||
      "IELTS Writing Submission",
    type: "Writing",
    date:
      item?.createdAt ||
      item?.created_at ||
      item?.submittedAt ||
      item?.submitted_at ||
      "",
    score,
    status,
    topic:
      item?.topic ||
      item?.prompt ||
      item?.task?.prompt ||
      item?.taskTitle ||
      "Writing practice",
    summary:
      evaluation?.summary ||
      evaluation?.overallFeedback ||
      evaluation?.overall_feedback ||
      evaluation?.feedback ||
      "Your submission has been received. Detailed AI feedback will appear here when the evaluation is complete.",
    strengths: Array.isArray(strengths) ? strengths : [],
    improvements: Array.isArray(improvements) ? improvements : [],
    criteria: getCriteria(item),
    raw: item,
  };
};

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

const isReviewed = (item) => {
  const status = String(item?.status || "").toLowerCase();

  return (
    item?.score !== null &&
    item?.score !== undefined &&
    ["completed", "evaluated", "reviewed", "published", "graded"].some(
      (value) => status.includes(value)
    )
  );
};

// =====================================================
// CONSTANTS
// =====================================================

const skillOptions = [
  { label: "Writing", icon: PenLine },
  { label: "Speaking", icon: Mic },
];

const feedbackTabs = ["All feedback", "Writing", "Speaking"];

// =====================================================
// REUSABLE COMPONENTS
// =====================================================

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#E7ECF6] bg-white p-4 shadow-[0_3px_14px_rgba(16,38,95,0.035)] transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(16,38,95,0.07)] sm:p-5 dark:border-[#49333D] dark:bg-[#211e27] ${className}`}
    >
      {children}
    </section>
  );
}

function BandPill({ score }) {
  if (score === null || score === undefined) return null;

  const style =
    score >= 7
      ? "bg-[#DDF8EE] text-[#008A60]"
      : score >= 6
        ? "bg-[#E5F0FF] text-[#2466C2]"
        : "bg-[#FFF0E1] text-[#D97706]";

  return (
    <span
      className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-extrabold ${style}`}
    >
      Band {Number(score).toFixed(1)}
    </span>
  );
}

function StatusPill({ status }) {
  const value = String(status || "Processing").toLowerCase();

  const completed = [
    "completed",
    "evaluated",
    "reviewed",
    "published",
    "graded",
  ].some((word) => value.includes(word));

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${
        completed
          ? "bg-[#DDF8EE] text-[#008A60]"
          : "bg-[#FFF4E5] text-[#B76B00]"
      }`}
    >
      {status || "Processing"}
    </span>
  );
}

function EmptyState({ onSubmit }) {
  return (
    <div className="rounded-xl border border-dashed border-[#DCE4F3] p-7 text-center sm:p-10">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#FF2454]">
        <FileText size={26} />
      </span>

      <h3 className="mt-4 text-sm font-extrabold">
        No feedback reports yet
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
        Your submitted Writing evaluations will appear here after you complete
        a practice submission.
      </p>

      <button
        type="button"
        onClick={onSubmit}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#FF2454] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#E81745]"
      >
        <PenLine size={15} />
        Start Writing
      </button>
    </div>
  );
}

// =====================================================
// MAIN PAGE
// =====================================================

export default function AIFeedbackPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // An attempt ID can be passed when navigating from an active Writing attempt.
  const activeAttemptId =
    location.state?.attemptId ||
    location.state?.attempt?.id ||
    null;

  const [feedbackList, setFeedbackList] = useState([]);
  const [activeTab, setActiveTab] = useState("All feedback");
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const [submissionType, setSubmissionType] = useState("Writing");
  const [taskNumber, setTaskNumber] = useState("2");
  const [essayTitle, setEssayTitle] = useState("");
  const [essayText, setEssayText] = useState("");

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("error");

  // =====================================================
  // LOAD WRITING FEEDBACK FROM BACKEND
  // =====================================================

  const loadFeedback = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setNotice("");

      const response = await aiFeedbackService.getWritingSubmissions(1, 50);

      const submissions = getArray(response)
        .map(getFeedbackItem)
        .filter((item) => item.id);

      setFeedbackList(submissions);

      setSelectedFeedback((previous) => {
        if (!submissions.length) return null;

        if (previous?.id) {
          return (
            submissions.find((item) => item.id === previous.id) ||
            submissions[0]
          );
        }

        return submissions[0];
      });
    } catch (error) {
      setNotice(getErrorMessage(error));
      setNoticeType("error");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  // =====================================================
  // FILTER FEEDBACK
  // =====================================================

  const visibleFeedback = useMemo(() => {
    if (activeTab === "All feedback") return feedbackList;

    // The currently available history endpoint is Writing submissions.
    // Speaking history is not added using demo data.
    return feedbackList.filter((item) => item.type === activeTab);
  }, [feedbackList, activeTab]);

  // =====================================================
  // SUMMARY STATS
  // =====================================================

  const reviewedWriting = useMemo(
    () => feedbackList.filter(isReviewed),
    [feedbackList]
  );

  const latestWritingBand = reviewedWriting[0]?.score ?? null;

  const stats = [
    {
      label: "Feedback reports",
      value: feedbackList.length,
      detail: "Writing submissions",
      icon: FileText,
      color: "#FF2454",
      bg: "bg-[#FFF0F3] dark:bg-[#3A202B]",
    },
    {
      label: "Writing band",
      value:
        latestWritingBand !== null
          ? latestWritingBand.toFixed(1)
          : "--",
      detail: "Latest evaluated writing",
      icon: PenLine,
      color: "#873BFA",
      bg: "bg-[#F3EAFF] dark:bg-[#30243D]",
    },
    {
      label: "Reviewed reports",
      value: reviewedWriting.length,
      detail: "Completed evaluations",
      icon: CheckCircle2,
      color: "#00A879",
      bg: "bg-[#E5F9F1] dark:bg-[#1D3932]",
    },
    {
      label: "Next target",
      value: "7.5",
      detail: "Your target band",
      icon: Target,
      color: "#1680E8",
      bg: "bg-[#EAF4FF] dark:bg-[#1E3042]",
    },
  ];

  // =====================================================
  // SUBMIT WRITING RESPONSE
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submissionType === "Speaking") {
      setShowSubmitModal(false);
      navigate("/student/live-speaking");
      return;
    }

    if (!essayTitle.trim() || !essayText.trim()) {
      setNotice("Please enter a title and your response before submitting.");
      setNoticeType("error");
      return;
    }

    if (!activeAttemptId) {
      setNotice(
        "No active Writing attempt was found. Start a Writing practice first, then submit your response."
      );
      setNoticeType("error");
      return;
    }

    if (essayText.trim().split(/\s+/).length < 20) {
      setNotice("Please write at least 20 words before submitting.");
      setNoticeType("error");
      return;
    }

    try {
      setIsGenerating(true);
      setNotice("");

      await aiFeedbackService.submitWriting(
        activeAttemptId,
        Number(taskNumber),
        essayText.trim()
      );

      setShowSubmitModal(false);
      setEssayTitle("");
      setEssayText("");

      setNotice(
        "Your Writing response has been submitted successfully. Evaluation status will update when the backend completes processing."
      );
      setNoticeType("success");

      await loadFeedback(true);
    } catch (error) {
      setNotice(getErrorMessage(error));
      setNoticeType("error");
    } finally {
      setIsGenerating(false);
    }
  };

  // =====================================================
  // OPEN SUBMISSION MODAL
  // =====================================================

  const openSubmitModal = () => {
    setNotice("");
    setSubmissionType("Writing");
    setShowSubmitModal(true);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <StudentLayout>
      <div className="ai-feedback-page mx-auto w-full max-w-[1800px] space-y-5 overflow-hidden text-[#10265F] dark:text-[#FFF8FA]">

        {/* DARK MODE SUPPORT */}

        <style>{`
          html.dark .ai-feedback-page {
            color: #FFF8FA;
          }

          html.dark .ai-feedback-page section.rounded-2xl,
          html.dark .ai-feedback-page .rounded-2xl.border,
          html.dark .ai-feedback-page form {
            background-color: #211e27;
            border-color: #49333D;
            color: #FFF8FA;
          }

          html.dark .ai-feedback-page [class*="bg-white"] {
            background-color: #211e27 !important;
          }

          html.dark .ai-feedback-page [class*="bg-[#F6F8FE]"],
          html.dark .ai-feedback-page [class*="bg-[#F5F7FF]"],
          html.dark .ai-feedback-page [class*="bg-[#F2F5FD]"],
          html.dark .ai-feedback-page [class*="bg-[#F0F3FA]"],
          html.dark .ai-feedback-page [class*="bg-[#E9EDF7]"],
          html.dark .ai-feedback-page [class*="bg-[#EDF1F9]"] {
            background-color: #30232B !important;
          }

          html.dark .ai-feedback-page [class*="text-[#10265F]"],
          html.dark .ai-feedback-page [class*="text-[#506995]"],
          html.dark .ai-feedback-page [class*="text-[#71809D]"],
          html.dark .ai-feedback-page [class*="text-[#8A9ABB]"],
          html.dark .ai-feedback-page [class*="text-[#9AA8C2]"] {
            color: #C1B5C0 !important;
          }

          html.dark .ai-feedback-page [class*="border-[#E7ECF6]"],
          html.dark .ai-feedback-page [class*="border-[#E2E8F5]"],
          html.dark .ai-feedback-page [class*="border-[#DCE4F3]"],
          html.dark .ai-feedback-page [class*="border-[#CCD7ED]"] {
            border-color: #49333D !important;
          }

          html.dark .ai-feedback-page input,
          html.dark .ai-feedback-page textarea,
          html.dark .ai-feedback-page select {
            background: #30232B;
            color: #FFF8FA;
            border-color: #49333D;
          }

          html.dark .ai-feedback-page input::placeholder,
          html.dark .ai-feedback-page textarea::placeholder {
            color: #9B8D99;
          }

          html.dark .ai-feedback-page [class*="bg-gradient-to-br"] {
            background-image: linear-gradient(to bottom right, #211e27, #30232B) !important;
          }

          .ai-feedback-page .feedback-card {
            transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
          }

          .ai-feedback-page .feedback-card:hover {
            border-color: #FF9BAF;
            box-shadow: 0 8px 22px rgba(255, 36, 84, 0.07);
          }

          @media (prefers-reduced-motion: reduce) {
            .ai-feedback-page * {
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>

        {/* HERO BANNER */}

        <section className="relative min-h-[154px] overflow-hidden rounded-2xl border border-[#E7ECF6] bg-[#F5F7FF] dark:border-[#49333D]">
          <img
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=85"
            alt="IELTS study desk"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/20 dark:from-[#171419] dark:via-[#171419]/90 dark:to-[#171419]/20" />

          <div className="relative z-10 flex min-h-[154px] items-center p-5 sm:p-7">
            <div className="max-w-[430px]">
              <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF2454]">
                <Sparkles size={15} />
                AI-powered insights
              </p>

              <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-[#10265F] dark:text-[#FFF8FA] sm:text-4xl">
                Your AI <span className="text-[#FF2454]">Feedback.</span>
              </h1>

              <p className="mt-2 max-w-md text-xs leading-5 text-[#506995] dark:text-[#C1B5C0] sm:text-sm">
                Review your IELTS practice, understand your performance and
                identify what to improve next.
              </p>

              <button
                type="button"
                onClick={openSubmitModal}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#FF2454] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-100 transition-colors hover:bg-[#E81745]"
              >
                <Sparkles size={16} />
                Get new feedback
              </button>
            </div>
          </div>
        </section>

        {/* NOTICE */}

        {notice && (
          <div
            className={`flex items-start gap-2 rounded-xl border p-3 text-xs ${
              noticeType === "success"
                ? "border-[#BDEBD8] bg-[#EDFFF7] text-[#087A55] dark:border-[#285D4A] dark:bg-[#20372F] dark:text-[#8FE0BD]"
                : "border-[#F6D4DC] bg-[#FFF5F7] text-[#A51D42] dark:border-[#693747] dark:bg-[#30232B] dark:text-[#FF9BAF]"
            }`}
          >
            {noticeType === "success" ? (
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
            )}

            <p className="min-w-0 flex-1 leading-5">{notice}</p>

            <button
              type="button"
              onClick={() => setNotice("")}
              className="shrink-0"
              aria-label="Dismiss message"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* SUMMARY STATS */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Panel
                key={stat.label}
                className="feedback-card flex min-w-0 items-center gap-3"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}
                  style={{ color: stat.color }}
                >
                  <Icon size={22} />
                </span>

                <div className="min-w-0">
                  <p className="text-xs text-[#71809D] dark:text-[#C1B5C0]">
                    {stat.label}
                  </p>

                  <p className="mt-1 text-2xl font-black">{stat.value}</p>

                  <p className="mt-1 truncate text-[10px] text-[#71809D] dark:text-[#A99BA7]">
                    {stat.detail}
                  </p>
                </div>
              </Panel>
            );
          })}
        </div>

        {/* FEEDBACK HISTORY + RIGHT COLUMN */}

        <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">

          {/* LEFT COLUMN */}

          <div className="min-w-0 space-y-4">

            {/* FEEDBACK HISTORY */}

            <Panel>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-base font-black">Feedback history</h2>

                  <p className="mt-1 text-xs text-[#71809D] dark:text-[#C1B5C0]">
                    Select a report to see its detailed analysis.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loadFeedback(true)}
                    disabled={isRefreshing}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F5] px-3 py-2 text-xs font-bold text-[#506995] transition-colors hover:border-[#FF9BAF] disabled:opacity-50 dark:border-[#49333D] dark:text-[#C1B5C0]"
                  >
                    <RefreshCw
                      size={14}
                      className={isRefreshing ? "animate-spin" : ""}
                    />
                    Refresh
                  </button>
                </div>
              </div>

              {/* FILTER TABS */}

              <div className="mt-4 flex flex-wrap gap-2">
                {feedbackTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                      activeTab === tab
                        ? "border-[#FF2454] bg-[#FF2454] text-white"
                        : "border-[#E2E8F5] bg-white text-[#506995] hover:border-[#FF9BAF] dark:border-[#49333D] dark:bg-[#30232B] dark:text-[#C1B5C0]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* LOADING */}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <LoaderCircle
                    size={28}
                    className="animate-spin text-[#FF2454]"
                  />
                  <p className="mt-3 text-xs text-[#71809D]">
                    Loading your feedback...
                  </p>
                </div>
              ) : visibleFeedback.length === 0 ? (
                <div className="mt-4">
                  <EmptyState onSubmit={openSubmitModal} />
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {visibleFeedback.map((item) => {
                    const active = selectedFeedback?.id === item.id;
                    const Icon =
                      item.type === "Writing" ? PenLine : Mic;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedFeedback(item)}
                        className={`feedback-card flex w-full min-w-0 flex-col gap-3 rounded-xl border p-4 text-left sm:flex-row sm:items-center ${
                          active
                            ? "border-[#FF9BAF] bg-[#FFF7F9] dark:border-[#693747] dark:bg-[#30232B]"
                            : "border-[#E7ECF6] bg-white hover:bg-[#FFFAFB] dark:border-[#49333D] dark:bg-[#211e27]"
                        }`}
                      >
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            item.type === "Writing"
                              ? "bg-[#FFF0F3] text-[#FF2454]"
                              : "bg-[#E5F9F1] text-[#00A879]"
                          }`}
                        >
                          <Icon size={20} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block break-words text-sm font-extrabold">
                            {item.title}
                          </span>

                          <span className="mt-1 block break-words text-xs text-[#71809D] dark:text-[#C1B5C0]">
                            {item.topic}
                          </span>

                          <span className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-[#8A9ABB]">
                            <Clock size={12} />
                            {formatDate(item.date)}

                            <span className="rounded-full bg-[#F0F3FA] px-2 py-1 dark:bg-[#30232B]">
                              {item.type}
                            </span>

                            <StatusPill status={item.status} />
                          </span>
                        </span>

                        <span className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                          {item.score !== null ? (
                            <BandPill score={item.score} />
                          ) : (
                            <span className="rounded-lg bg-[#FFF4E5] px-2.5 py-1.5 text-[10px] font-bold text-[#B76B00]">
                              Awaiting score
                            </span>
                          )}

                          <span className="flex items-center gap-1 text-[11px] font-bold text-[#FF2454]">
                            View details
                            <ArrowRight size={13} />
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </Panel>

            {/* DETAILED FEEDBACK */}

            {selectedFeedback && (
              <Panel>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FF2454]">
                      Detailed analysis
                    </p>

                    <h2 className="mt-2 break-words text-lg font-black">
                      {selectedFeedback.title}
                    </h2>

                    <p className="mt-1 break-words text-xs text-[#71809D] dark:text-[#C1B5C0]">
                      {selectedFeedback.topic}
                    </p>
                  </div>

                  {selectedFeedback.score !== null && (
                    <BandPill score={selectedFeedback.score} />
                  )}
                </div>

                {/* SUMMARY */}

                <div className="mt-4 rounded-xl bg-[#F6F8FE] p-4 dark:bg-[#30232B]">
                  <div className="flex items-center gap-2">
                    <Sparkles size={17} className="shrink-0 text-[#FF2454]" />
                    <h3 className="text-xs font-extrabold">
                      Summary feedback
                    </h3>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-[#506995] dark:text-[#C1B5C0]">
                    {selectedFeedback.summary}
                  </p>
                </div>

                {/* STRENGTHS AND IMPROVEMENTS */}

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-[#D8F1E7] p-4 dark:border-[#285D4A]">
                    <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#008A60]">
                      <CheckCircle2 size={17} />
                      What you did well
                    </h3>

                    {selectedFeedback.strengths.length > 0 ? (
                      <div className="mt-3 space-y-3">
                        {selectedFeedback.strengths.map((item, index) => (
                          <div
                            key={`${item}-${index}`}
                            className="flex items-start gap-2"
                          >
                            <CheckCircle2
                              size={15}
                              className="mt-0.5 shrink-0 text-[#00A879]"
                            />

                            <p className="text-xs leading-5 text-[#506995] dark:text-[#C1B5C0]">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-[#71809D]">
                        Strengths will appear after evaluation.
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border border-[#F6DCE2] p-4 dark:border-[#693747]">
                    <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#FF2454]">
                      <Target size={17} />
                      Areas to improve
                    </h3>

                    {selectedFeedback.improvements.length > 0 ? (
                      <div className="mt-3 space-y-3">
                        {selectedFeedback.improvements.map((item, index) => (
                          <div
                            key={`${item}-${index}`}
                            className="flex items-start gap-2"
                          >
                            <AlertCircle
                              size={15}
                              className="mt-0.5 shrink-0 text-[#FF2454]"
                            />

                            <p className="text-xs leading-5 text-[#506995] dark:text-[#C1B5C0]">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-[#71809D]">
                        Improvement suggestions will appear after evaluation.
                      </p>
                    )}
                  </div>
                </div>

                {/* ASSESSMENT CRITERIA */}

                <h3 className="mt-5 text-sm font-extrabold">
                  Assessment criteria
                </h3>

                <p className="mt-1 text-xs text-[#71809D] dark:text-[#C1B5C0]">
                  Your Writing performance across the assessment criteria.
                </p>

                {selectedFeedback.criteria.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {selectedFeedback.criteria.map((criterion, index) => (
                      <div
                        key={`${criterion.name}-${index}`}
                        className="rounded-xl border border-[#E7ECF6] p-3 dark:border-[#49333D]"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs font-bold">
                            {criterion.name}
                          </p>

                          {criterion.score > 0 && (
                            <BandPill score={criterion.score} />
                          )}
                        </div>

                        <p className="mt-2 text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                          {criterion.detail}
                        </p>

                        {criterion.score > 0 && (
                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EDF1F9] dark:bg-[#30232B]">
                            <div
                              className="h-full rounded-full bg-[#FF2454]"
                              style={{
                                width: `${Math.min(
                                  (criterion.score / 9) * 100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl border border-dashed border-[#DCE4F3] p-5 text-center dark:border-[#49333D]">
                    <Brain
                      size={22}
                      className="mx-auto text-[#8A9ABB]"
                    />
                    <p className="mt-2 text-xs text-[#71809D] dark:text-[#C1B5C0]">
                      Assessment criteria will be available after AI
                      evaluation.
                    </p>
                  </div>
                )}
              </Panel>
            )}
          </div>

          {/* RIGHT COLUMN */}

          <aside className="min-w-0 space-y-4">

            {/* IMPROVEMENT PLAN */}

            <Panel className="bg-gradient-to-br from-white to-[#FFF3F6] dark:from-[#211e27] dark:to-[#30232B]">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE1E8] text-[#FF2454]">
                  <Target size={20} />
                </span>

                <h3 className="text-sm font-extrabold">
                  Your improvement plan
                </h3>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                Focus on these actions to work towards your target band.
              </p>

              <div className="mt-4 space-y-4">
                {[
                  {
                    label: "Writing coherence",
                    value: 65,
                    color: "#FF2454",
                  },
                  {
                    label: "Vocabulary range",
                    value: 70,
                    color: "#873BFA",
                  },
                  {
                    label: "Grammar accuracy",
                    value: 58,
                    color: "#1680E8",
                  },
                  {
                    label: "Task response",
                    value: 78,
                    color: "#00A879",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-xs font-bold">{item.label}</p>
                      <span className="text-xs font-extrabold">
                        {item.value}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#EDF1F9] dark:bg-[#30232B]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.value}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-[10px] leading-4 text-[#8A9ABB]">
                These are general practice indicators, not scores returned by
                your AI evaluation.
              </p>
            </Panel>

            {/* AI STUDY TIPS */}

            <Panel>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3EAFF] text-[#873BFA]">
                  <Lightbulb size={20} />
                </span>

                <h3 className="text-sm font-extrabold">AI study tips</h3>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  "Develop each paragraph around one clear main idea.",
                  "Use a wider range of vocabulary naturally.",
                  "Review grammar and sentence structure after writing.",
                ].map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 rounded-xl bg-[#F6F8FE] p-3 dark:bg-[#30232B]"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-[10px] font-black text-[#873BFA] dark:bg-[#211e27]">
                      {index + 1}
                    </span>

                    <p className="text-xs leading-5 text-[#506995] dark:text-[#C1B5C0]">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>

            {/* CONTINUE PRACTISING */}

            <Panel>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#1680E8]">
                  <TrendingUp size={20} />
                </span>

                <h3 className="text-sm font-extrabold">
                  Continue practising
                </h3>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => navigate("/student/practice")}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#E7ECF6] p-3 text-left transition-colors hover:border-[#FF9BAF] hover:bg-[#FFF7F9] dark:border-[#49333D] dark:hover:bg-[#30232B]"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <PenLine size={18} className="shrink-0 text-[#FF2454]" />
                    <span className="min-w-0">
                      <span className="block text-xs font-bold">
                        Writing practice
                      </span>
                      <span className="mt-1 block text-[10px] text-[#71809D]">
                        Improve your writing skills
                      </span>
                    </span>
                  </span>

                  <ChevronRight size={16} className="shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/student/live-speaking")}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#E7ECF6] p-3 text-left transition-colors hover:border-[#FF9BAF] hover:bg-[#FFF7F9] dark:border-[#49333D] dark:hover:bg-[#30232B]"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Mic size={18} className="shrink-0 text-[#00A879]" />
                    <span className="min-w-0">
                      <span className="block text-xs font-bold">
                        Speaking practice
                      </span>
                      <span className="mt-1 block text-[10px] text-[#71809D]">
                        Practise your speaking response
                      </span>
                    </span>
                  </span>

                  <ChevronRight size={16} className="shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/student/study-resources")}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#E7ECF6] p-3 text-left transition-colors hover:border-[#FF9BAF] hover:bg-[#FFF7F9] dark:border-[#49333D] dark:hover:bg-[#30232B]"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Headphones size={18} className="shrink-0 text-[#873BFA]" />
                    <span className="min-w-0">
                      <span className="block text-xs font-bold">
                        Study resources
                      </span>
                      <span className="mt-1 block text-[10px] text-[#71809D]">
                        Explore learning materials
                      </span>
                    </span>
                  </span>

                  <ChevronRight size={16} className="shrink-0" />
                </button>
              </div>
            </Panel>

            {/* REMEMBER */}

            <div className="rounded-2xl border border-[#F6DCE2] bg-[#FFF7F9] p-4 dark:border-[#693747] dark:bg-[#30232B]">
              <div className="flex items-center gap-2 text-[#FF2454]">
                <MessageSquare size={17} />
                <h3 className="text-xs font-extrabold">Remember</h3>
              </div>

              <p className="mt-2 text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                AI feedback is a learning aid. Use the suggestions to improve
                your skills and practise consistently.
              </p>
            </div>
          </aside>
        </div>

        {/* SUBMISSION MODAL */}

        {showSubmitModal && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#10182E]/60 p-3 backdrop-blur-sm sm:p-5"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !isGenerating) {
                setShowSubmitModal(false);
              }
            }}
          >
            <div
              className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E7ECF6] bg-white shadow-2xl dark:border-[#49333D] dark:bg-[#211e27]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="feedback-modal-title"
            >
              {/* MODAL HEADER */}

              <div className="flex items-start justify-between gap-3 border-b border-[#E7ECF6] p-4 sm:p-5 dark:border-[#49333D]">
                <div>
                  <div className="flex items-center gap-2 text-[#FF2454]">
                    <Sparkles size={18} />
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.16em]">
                      AI evaluation
                    </span>
                  </div>

                  <h2
                    id="feedback-modal-title"
                    className="mt-2 text-lg font-black"
                  >
                    Get new feedback
                  </h2>

                  <p className="mt-1 text-xs text-[#71809D] dark:text-[#C1B5C0]">
                    Choose a skill to continue.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  disabled={isGenerating}
                  className="rounded-lg p-2 text-[#71809D] transition-colors hover:bg-[#F6F8FE] disabled:opacity-50 dark:hover:bg-[#30232B]"
                  aria-label="Close modal"
                >
                  <X size={19} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-5">
                {/* SKILL SELECTION */}

                <div className="grid grid-cols-2 gap-3">
                  {skillOptions.map((option) => {
                    const Icon = option.icon;
                    const active = submissionType === option.label;

                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => setSubmissionType(option.label)}
                        disabled={isGenerating}
                        className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-bold transition-colors ${
                          active
                            ? "border-[#FF2454] bg-[#FFF0F3] text-[#FF2454] dark:bg-[#30232B]"
                            : "border-[#E7ECF6] text-[#71809D] hover:border-[#FF9BAF] dark:border-[#49333D]"
                        }`}
                      >
                        <Icon size={17} />
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                {/* WRITING FORM */}

                {submissionType === "Writing" ? (
                  <>
                    <div className="rounded-xl border border-[#DCE4F3] bg-[#F6F8FE] p-3 dark:border-[#49333D] dark:bg-[#30232B]">
                      <div className="flex items-start gap-2">
                        <AlertCircle
                          size={16}
                          className="mt-0.5 shrink-0 text-[#1680E8]"
                        />

                        <p className="text-xs leading-5 text-[#506995] dark:text-[#C1B5C0]">
                          Your Writing response is submitted against an active
                          Writing attempt. Open this page from your active
                          attempt to submit it.
                        </p>
                      </div>
                    </div>

                    {!activeAttemptId && (
                      <div className="rounded-xl border border-[#F6D4DC] bg-[#FFF5F7] p-3 text-xs leading-5 text-[#A51D42] dark:border-[#693747] dark:bg-[#30232B] dark:text-[#FF9BAF]">
                        No active attempt ID was passed to this page. Start a
                        Writing practice first.
                        <button
                          type="button"
                          onClick={() => navigate("/student/practice")}
                          className="ml-1 font-extrabold underline"
                        >
                          Go to practice
                        </button>
                      </div>
                    )}

                    <div>
                      <label className="mb-2 block text-xs font-bold">
                        Writing task
                      </label>

                      <select
                        value={taskNumber}
                        onChange={(event) => setTaskNumber(event.target.value)}
                        disabled={isGenerating}
                        className="w-full rounded-xl border border-[#E2E8F5] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#FF2454] dark:border-[#49333D] dark:bg-[#30232B]"
                      >
                        <option value="1">Writing Task 1</option>
                        <option value="2">Writing Task 2</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold">
                        Submission title
                      </label>

                      <input
                        type="text"
                        value={essayTitle}
                        onChange={(event) => setEssayTitle(event.target.value)}
                        placeholder="e.g. Advantages of online education"
                        disabled={isGenerating}
                        maxLength={150}
                        className="w-full rounded-xl border border-[#E2E8F5] bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#A0ABC0] focus:border-[#FF2454] dark:border-[#49333D] dark:bg-[#30232B]"
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <label className="text-xs font-bold">
                          Your response
                        </label>

                        <span className="text-[10px] text-[#71809D]">
                          {essayText.trim()
                            ? essayText.trim().split(/\s+/).length
                            : 0}{" "}
                          words
                        </span>
                      </div>

                      <textarea
                        value={essayText}
                        onChange={(event) => setEssayText(event.target.value)}
                        placeholder="Write your IELTS response here..."
                        rows={7}
                        disabled={isGenerating}
                        className="w-full resize-y rounded-xl border border-[#E2E8F5] bg-white px-4 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-[#A0ABC0] focus:border-[#FF2454] dark:border-[#49333D] dark:bg-[#30232B]"
                      />
                    </div>

                    <div className="flex flex-col-reverse justify-end gap-2 border-t border-[#E7ECF6] pt-4 sm:flex-row dark:border-[#49333D]">
                      <button
                        type="button"
                        onClick={() => setShowSubmitModal(false)}
                        disabled={isGenerating}
                        className="rounded-xl border border-[#E2E8F5] px-5 py-3 text-xs font-bold text-[#506995] transition-colors hover:bg-[#F6F8FE] disabled:opacity-50 dark:border-[#49333D] dark:text-[#C1B5C0] dark:hover:bg-[#30232B]"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isGenerating || !activeAttemptId}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-[#E81745] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isGenerating ? (
                          <>
                            <LoaderCircle size={15} className="animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send size={15} />
                            Submit response
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-xl border border-[#D8F1E7] bg-[#F0FFF8] p-4 dark:border-[#285D4A] dark:bg-[#20372F]">
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DDF8EE] text-[#008A60]">
                          <Mic size={20} />
                        </span>

                        <div>
                          <h3 className="text-sm font-extrabold text-[#087A55] dark:text-[#8FE0BD]">
                            Speaking practice
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-[#506995] dark:text-[#C1B5C0]">
                            Speaking feedback requires an audio recording.
                            Continue to the Speaking practice page to record
                            your response.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col-reverse justify-end gap-2 border-t border-[#E7ECF6] pt-4 sm:flex-row dark:border-[#49333D]">
                      <button
                        type="button"
                        onClick={() => setShowSubmitModal(false)}
                        className="rounded-xl border border-[#E2E8F5] px-5 py-3 text-xs font-bold text-[#506995] transition-colors hover:bg-[#F6F8FE] dark:border-[#49333D] dark:text-[#C1B5C0]"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate("/student/live-speaking")}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-[#E81745]"
                      >
                        <Mic size={15} />
                        Start Speaking
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}