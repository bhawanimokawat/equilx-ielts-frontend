
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  Clock,
  Flame,
  Target,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  ChevronDown,
  BarChart3,
  Trophy,
  Activity,
  RefreshCw,
  X,
  FileText,
  Loader2,
} from "lucide-react";

import StudentLayout from "./StudentLayout";
import progressService from "../../services/progressService";

// =====================================================
// CONSTANTS
// =====================================================

const TARGET_SCORE = 7.5;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=90";

const skillDefinitions = [
  {
    name: "Listening",
    icon: Headphones,
    color: "#FF456C",
    bg: "bg-[#FFF0F3]",
  },
  {
    name: "Reading",
    icon: BookOpen,
    color: "#873BFA",
    bg: "bg-[#F3EAFF]",
  },
  {
    name: "Writing",
    icon: PenLine,
    color: "#1680E8",
    bg: "bg-[#EAF4FF]",
  },
  {
    name: "Speaking",
    icon: Mic,
    color: "#00A879",
    bg: "bg-[#E5F9F1]",
  },
];

// =====================================================
// HELPERS
// =====================================================

const unwrap = (response) =>
  response?.data?.data ?? response?.data ?? response ?? {};

const getRows = (payload, keys = []) => {
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }

  return [];
};

const getDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getBand = (...values) => {
  const value = values.find(
    (item) => item !== undefined && item !== null && item !== ""
  );

  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

const getResultObject = (item) =>
  item?.mockScore || item?.result || item?.score || {};

const getSkillScore = (result, snapshot, skill) => {
  const key = skill.toLowerCase();

  return getBand(
    result?.[`${key}Band`],
    result?.[key]?.band,
    snapshot?.[`${key}Band`],
    snapshot?.[key]?.band
  );
};

const getOverallScore = (result, snapshot) =>
  getBand(
    result?.overallBand,
    result?.overall?.band,
    snapshot?.overallBand,
    snapshot?.overall?.band
  );

const normalizeResult = (item) => {
  const result = getResultObject(item);
  const snapshot = result?.scoreSnapshot || {};
  const test = item?.test || item?.testVersion?.test || {};

  return {
    id: item?.attemptId || item?.id,
    name: test?.title || item?.testTitle || "IELTS Mock Test",
    date:
      item?.submittedAt ||
      item?.completedAt ||
      item?.startedAt ||
      result?.completedAt,
    band: getOverallScore(result, snapshot),
    listening: getSkillScore(result, snapshot, "Listening"),
    reading: getSkillScore(result, snapshot, "Reading"),
    writing: getSkillScore(result, snapshot, "Writing"),
    speaking: getSkillScore(result, snapshot, "Speaking"),
    status: item?.status || "COMPLETED",
    raw: item,
  };
};

// =====================================================
// COMMON PANEL
// =====================================================

function Panel({ children, className = "" }) {
  return (
    <section
      className={`
        min-w-0 rounded-2xl border border-[#E7ECF6]
        bg-white p-4
        shadow-[0_3px_14px_rgba(16,38,95,0.035)]
        transition-all duration-200 ease-out
        hover:-translate-y-1
        hover:border-[#FF9BAF]
        hover:shadow-[0_12px_28px_rgba(16,38,95,0.10)]
        dark:border-[#49333D] dark:bg-[#211e27]
        dark:hover:border-[#71404D]
        sm:p-5
        ${className}
      `}
    >
      {children}
    </section>
  );
}

// =====================================================
// SECTION TITLE
// =====================================================

function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-base font-black text-[#10265F] dark:text-[#FFF8FA]">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-xs leading-5 text-[#71809D] dark:text-[#BDB0BC]">
            {subtitle}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

// =====================================================
// BAND RING
// =====================================================

function BandRing({
  score = 0,
  size = 160,
  stroke = 11,
  label = "Current Score",
}) {
  const radius = (100 - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score / 9, 0), 1);
  const dash = circumference * progress;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      aria-label={`${label}: IELTS band ${score} out of 9`}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#E9EDF7"
          strokeWidth={stroke}
          className="dark:stroke-[#49333D]"
        />

        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#FF456C"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className="transition-all duration-500"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black tracking-tight text-[#10265F] dark:text-[#FFF8FA]">
          {score > 0 ? score.toFixed(1) : "—"}
        </span>

        <span className="mt-1 text-center text-[10px] text-[#71809D] dark:text-[#BDB0BC]">
          {label}
        </span>
      </div>
    </div>
  );
}

// =====================================================
// BAND BADGE
// =====================================================

function BandBadge({ score }) {
  let style = "bg-[#FFF0E1] text-[#D97706]";

  if (score >= 6.5) {
    style = "bg-[#DDF8EE] text-[#008A60]";
  } else if (score >= 6) {
    style = "bg-[#E5F0FF] text-[#2466C2]";
  } else if (score < 5.5) {
    style = "bg-[#FFE8EE] text-[#E11D48]";
  }

  return (
    <span
      className={`inline-flex min-w-10 justify-center rounded-lg px-2 py-1 text-[11px] font-extrabold ${style}`}
    >
      {score > 0 ? score.toFixed(1) : "—"}
    </span>
  );
}

// =====================================================
// LOADING STATE
// =====================================================

function LoadingState() {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center gap-3">
      <Loader2 className="animate-spin text-[#FF456C]" size={30} />
      <p className="text-xs font-semibold text-[#71809D] dark:text-[#BDB0BC]">
        Loading your progress...
      </p>
    </div>
  );
}

// =====================================================
// EMPTY STATE
// =====================================================

function EmptyState({ title, description, action }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center px-4 py-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#FF456C] dark:bg-[#49232F]">
        <FileText size={22} />
      </span>

      <h3 className="mt-3 text-sm font-extrabold text-[#10265F] dark:text-white">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-[#71809D] dark:text-[#BDB0BC]">
        {description}
      </p>

      {action}
    </div>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function MyProgressPage() {
  const navigate = useNavigate();

  // UI states
  const [period, setPeriod] = useState("Overview");
  const [activityPeriod, setActivityPeriod] = useState("Last 7 days");
  const [testFilter, setTestFilter] = useState("All tests");
  const [selectedTest, setSelectedTest] = useState(null);
  const [activeHistoryTab, setActiveHistoryTab] = useState("Mock tests");

  // API states
  const [tests, setTests] = useState([]);
  const [practiceHistory, setPracticeHistory] = useState([]);
  const [mockHistory, setMockHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // =====================================================
  // LOAD PROGRESS APIs
  // =====================================================

  const loadProgress = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const [
        resultsResponse,
        mockResponse,
        practiceResponse,
      ] = await Promise.allSettled([
        progressService.getResults(1, 50, "FULL_MOCK"),
        progressService.getMockHistory(1, 50),
        progressService.getPracticeHistory(1, 50),
      ]);

      const errors = [];

      // Results API
      if (resultsResponse.status === "fulfilled") {
        const payload = unwrap(resultsResponse.value);

        const rows = getRows(payload, [
          "results",
          "items",
        ]);

        setTests(rows.map(normalizeResult).filter((item) => item.id));
      } else {
        setTests([]);
        errors.push("Test results could not be loaded.");
      }

      // Mock history API
      if (mockResponse.status === "fulfilled") {
        const payload = unwrap(mockResponse.value);

        setMockHistory(
          getRows(payload, ["items", "attempts", "history"])
        );
      } else {
        setMockHistory([]);
        errors.push("Mock history could not be loaded.");
      }

      // Practice history API
      if (practiceResponse.status === "fulfilled") {
        const payload = unwrap(practiceResponse.value);

        setPracticeHistory(
          getRows(payload, ["items", "attempts", "history"])
        );
      } else {
        setPracticeHistory([]);
        errors.push("Practice history could not be loaded.");
      }

      if (errors.length) {
        setError(errors.join(" "));
      }
    } catch (err) {
      setError(err?.message || "Unable to load progress.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // =====================================================
  // FILTER TESTS
  // =====================================================

  const filteredTests = useMemo(() => {
    const rows = [...tests];

    if (testFilter === "Highest score") {
      rows.sort((a, b) => b.band - a.band);
    } else if (testFilter === "Oldest first") {
      rows.sort(
        (a, b) =>
          new Date(a.date || 0).getTime() -
          new Date(b.date || 0).getTime()
      );
    } else {
      rows.sort(
        (a, b) =>
          new Date(b.date || 0).getTime() -
          new Date(a.date || 0).getTime()
      );
    }

    return rows;
  }, [tests, testFilter]);

  // =====================================================
  // LATEST SCORE
  // =====================================================

  const latestTest = useMemo(() => {
    return [...tests].sort(
      (a, b) =>
        new Date(b.date || 0).getTime() -
        new Date(a.date || 0).getTime()
    )[0];
  }, [tests]);

  const overallScore = latestTest?.band || 0;

  const scoreDifference = Math.max(
    TARGET_SCORE - overallScore,
    0
  );

  // =====================================================
  // SKILL BREAKDOWN
  // =====================================================

  const skills = useMemo(() => {
    const sorted = [...tests].sort(
      (a, b) =>
        new Date(a.date || 0).getTime() -
        new Date(b.date || 0).getTime()
    );

    const previousTest = sorted.length > 1
      ? sorted[sorted.length - 2]
      : null;

    return skillDefinitions.map((skill) => {
      const key = skill.name.toLowerCase();

      return {
        ...skill,
        score: latestTest?.[key] || 0,
        previous: previousTest?.[key] || 0,
      };
    });
  }, [latestTest, tests]);

  // =====================================================
  // HISTORY COUNTS
  // =====================================================

  const completedMocks = mockHistory.filter((item) =>
    ["SUBMITTED", "EVALUATED", "COMPLETED"].includes(
      String(item?.status || "").toUpperCase()
    )
  );

  const completedPractice = practiceHistory.filter((item) =>
    ["SUBMITTED", "EVALUATED", "COMPLETED"].includes(
      String(item?.status || "").toUpperCase()
    )
  );

  const averageBand = tests.length
    ? (
        tests.reduce((sum, test) => sum + test.band, 0) /
        tests.length
      ).toFixed(1)
    : "—";

  // =====================================================
  // PERIOD DESCRIPTION
  // =====================================================

  const periodDescription =
    period === "Last 7 days"
      ? "Your progress over the last 7 days"
      : period === "Last 30 days"
        ? "Your progress over the last 30 days"
        : period === "Last 3 months"
          ? "Your progress over the last 3 months"
          : "Your overall IELTS performance";

  // =====================================================
  // HISTORY TAB
  // =====================================================

  const activeHistory =
    activeHistoryTab === "Mock tests"
      ? mockHistory
      : practiceHistory;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <StudentLayout>
      <div className="progress-page mx-auto w-full max-w-[1800px] min-w-0 space-y-5 px-3 pb-8 text-[#10265F] sm:px-5 lg:px-6 dark:text-[#FFF8FA]">

        <style>{`
          html.dark .progress-page {
            color: #FFF8FA !important;
          }

          html.dark .progress-page [class*="bg-white"] {
            background-color: #211e27 !important;
          }

          html.dark .progress-page [class*="text-[#10265F]"],
          html.dark .progress-page [class*="text-[#506995]"] {
            color: #FFF8FA !important;
          }

          html.dark .progress-page [class*="text-[#71809D]"],
          html.dark .progress-page [class*="text-[#9AA8C2]"] {
            color: #BDB0BC !important;
          }

          html.dark .progress-page [class*="border-[#E7ECF6]"],
          html.dark .progress-page [class*="border-[#EDF0F8]"],
          html.dark .progress-page [class*="border-[#E2E8F5]"] {
            border-color: #49333D !important;
          }

          html.dark .progress-page .progress-hero {
            background: linear-gradient(
              110deg,
              #211B22,
              #292029 65%,
              #30232B
            ) !important;
          }

          html.dark .progress-page select {
            background-color: #30232B !important;
            color: #FFF8FA !important;
            border-color: #49333D !important;
          }

          html.dark .progress-page option {
            background: #211e27;
            color: #FFF8FA;
          }

          html.dark .progress-modal-content {
            background-color: #211e27 !important;
            color: #FFF8FA !important;
            border: 1px solid #49333D;
          }

          @media (prefers-reduced-motion: reduce) {
            .progress-page *,
            .progress-page *::before,
            .progress-page *::after {
              transition-duration: 0.01ms !important;
              animation-duration: 0.01ms !important;
            }
          }
        `}</style>

        {/* HERO SECTION */}

        <section className="progress-hero relative grid min-h-[150px] overflow-hidden rounded-2xl border border-[#E7ECF6] bg-gradient-to-r from-white via-[#F5F7FF] to-[#FFF0F4] dark:border-[#49333D] dark:from-[#211B22] dark:via-[#292029] dark:to-[#30232B] lg:grid-cols-[minmax(0,1fr)_280px]">

          <div className="relative z-10 p-5 sm:p-6">

            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF456C]">
              My progress
            </p>

            <h1 className="mt-2 text-2xl font-black leading-tight tracking-tight sm:text-4xl">
              Track your IELTS{" "}
              <span className="text-[#FF456C]">journey.</span>
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#506995] dark:text-[#C1B5C0]">
              See your performance, identify strengths and weaknesses,
              and keep improving.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Overview",
                "Last 7 days",
                "Last 30 days",
                "Last 3 months",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPeriod(item)}
                  className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                    period === item
                      ? "border-[#FF456C] bg-[#FF456C] text-white"
                      : "border-[#E2E8F5] bg-white/90 text-[#506995] hover:border-[#FF9BAF] dark:border-[#49333D] dark:bg-[#30232B] dark:text-[#C1B5C0]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="relative hidden min-h-[150px] lg:block">
            <img
              src={HERO_IMAGE}
              alt="Books and study materials"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#F5F7FF] via-[#F5F7FF]/20 to-transparent dark:from-[#211B22] dark:via-[#211B22]/30" />
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#71809D] dark:text-[#BDB0BC]">
            {periodDescription}
          </p>

          <button
            type="button"
            onClick={() => loadProgress(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F5] bg-white px-3 py-2 text-xs font-bold text-[#506995] transition hover:border-[#FF9BAF] hover:text-[#FF456C] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#49333D] dark:bg-[#211e27] dark:text-[#FFF8FA]"
          >
            <RefreshCw
              size={14}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* API ERROR */}

        {error && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#FFC7D2] bg-[#FFF0F3] px-4 py-3 text-xs text-[#C12B4C] dark:border-[#71404D] dark:bg-[#30232B] dark:text-[#FF9BAF]">
            <div className="flex items-center gap-2">
              <AlertCircle size={17} />
              {error}
            </div>

            <button
              type="button"
              onClick={() => loadProgress(true)}
              className="font-extrabold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* SCORE OVERVIEW */}

        {loading ? (
          <Panel>
            <LoadingState />
          </Panel>
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[1.05fr_1fr_1fr]">

            {/* OVERALL BAND */}

            <Panel>
              <SectionTitle
                title="Overall Band Score"
                subtitle="Your latest mock test performance"
              />

              <div className="flex flex-wrap items-center justify-center gap-5 sm:justify-start">
                <BandRing score={overallScore} size={150} />

                <div className="min-w-[145px] flex-1">
                  <p className="text-xs font-bold text-[#506995] dark:text-[#C1B5C0]">
                    Target Band Score
                  </p>

                  <p className="mt-1 text-3xl font-black">
                    {TARGET_SCORE.toFixed(1)}
                  </p>

                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#E9EDF7] dark:bg-[#49333D]">
                    <div
                      className="h-full rounded-full bg-[#FF456C] transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (overallScore / TARGET_SCORE) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs leading-5 text-[#71809D] dark:text-[#BDB0BC]">
                    {overallScore
                      ? `You are ${scoreDifference.toFixed(1)} band away from your target.`
                      : "Complete a mock test to see your progress."}
                  </p>

                  {latestTest && (
                    <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#DDF8EE] px-2.5 py-1.5 text-[11px] font-extrabold text-[#008A60]">
                      <TrendingUp size={13} />
                      Latest result
                    </div>
                  )}
                </div>
              </div>

              {latestTest && (
                <div className="mt-4 flex items-center gap-2 border-t border-[#EDF0F8] pt-3 text-xs text-[#71809D] dark:border-[#49333D] dark:text-[#BDB0BC]">
                  <CalendarDays size={14} />
                  Last test: {getDate(latestTest.date)}
                </div>
              )}
            </Panel>

            {/* SKILL SCORES */}

            <Panel>
              <SectionTitle
                title="Skill Performance"
                subtitle="Your latest skill-wise band scores"
              />

              <div className="space-y-4">
                {skills.map((skill) => {
                  const Icon = skill.icon;

                  const difference =
                    skill.score - skill.previous;

                  return (
                    <div
                      key={skill.name}
                      className="flex items-center gap-3"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${skill.bg}`}
                        style={{ color: skill.color }}
                      >
                        <Icon size={19} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <span className="text-xs font-bold">
                            {skill.name}
                          </span>

                          <span className="text-sm font-black">
                            {skill.score
                              ? skill.score.toFixed(1)
                              : "—"}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-[#EDF0F8] dark:bg-[#49333D]">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(skill.score / 9) * 100}%`,
                              backgroundColor: skill.color,
                            }}
                          />
                        </div>

                        {skill.score > 0 && skill.previous > 0 && (
                          <p className="mt-1 flex items-center gap-1 text-[10px] text-[#71809D] dark:text-[#BDB0BC]">
                            {difference >= 0 ? (
                              <TrendingUp
                                size={11}
                                className="text-[#00A879]"
                              />
                            ) : (
                              <TrendingDown
                                size={11}
                                className="text-[#E11D48]"
                              />
                            )}

                            {difference > 0 ? "+" : ""}
                            {difference.toFixed(1)} from previous test
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>

            {/* QUICK STATS */}

            <Panel>
              <SectionTitle
                title="Your Statistics"
                subtitle="Based on your available test records"
              />

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-[#FFF0F3] p-3 dark:bg-[#49232F]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#FF456C] dark:bg-[#30232B]">
                    <BarChart3 size={18} />
                  </span>

                  <p className="mt-3 text-xl font-black text-[#10265F] dark:text-white">
                    {tests.length}
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-[#71809D] dark:text-[#BDB0BC]">
                    Scored tests
                  </p>
                </div>

                <div className="rounded-xl bg-[#F3EAFF] p-3 dark:bg-[#382747]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#873BFA] dark:bg-[#30232B]">
                    <Activity size={18} />
                  </span>

                  <p className="mt-3 text-xl font-black text-[#10265F] dark:text-white">
                    {averageBand}
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-[#71809D] dark:text-[#BDB0BC]">
                    Average band
                  </p>
                </div>

                <div className="rounded-xl bg-[#EAF4FF] p-3 dark:bg-[#25354A]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#1680E8] dark:bg-[#30232B]">
                    <FileText size={18} />
                  </span>

                  <p className="mt-3 text-xl font-black text-[#10265F] dark:text-white">
                    {completedMocks.length}
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-[#71809D] dark:text-[#BDB0BC]">
                    Completed mocks
                  </p>
                </div>

                <div className="rounded-xl bg-[#E5F9F1] p-3 dark:bg-[#203C34]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#00A879] dark:bg-[#30232B]">
                    <CheckCircle2 size={18} />
                  </span>

                  <p className="mt-3 text-xl font-black text-[#10265F] dark:text-white">
                    {completedPractice.length}
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-[#71809D] dark:text-[#BDB0BC]">
                    Completed practice
                  </p>
                </div>

              </div>
            </Panel>
          </div>
        )}

        {/* HISTORY SECTION */}

        <Panel>
          <SectionTitle
            title="Learning History"
            subtitle="Your mock test and practice activity"
          />

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {["Mock tests", "Practice"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveHistoryTab(tab)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                    activeHistoryTab === tab
                      ? "bg-[#FF456C] text-white"
                      : "border border-[#E2E8F5] text-[#506995] hover:border-[#FF9BAF] dark:border-[#49333D] dark:text-[#C1B5C0]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-[#71809D] dark:text-[#BDB0BC]">
              {activeHistory.length} records
            </span>
          </div>

          {loading ? (
            <LoadingState />
          ) : activeHistory.length === 0 ? (
            <EmptyState
              title={`No ${activeHistoryTab.toLowerCase()} history`}
              description="Your completed activities will appear here once you start practising."
              action={
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      activeHistoryTab === "Mock tests"
                        ? "/mock-tests"
                        : "/practice"
                    )
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#FF456C] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#E81745]"
                >
                  Start practising <ArrowRight size={14} />
                </button>
              }
            />
          ) : (
            <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {activeHistory.map((item, index) => {
                const title =
                  item?.testVersion?.test?.title ||
                  item?.test?.title ||
                  item?.title ||
                  (activeHistoryTab === "Mock tests"
                    ? "IELTS Mock Test"
                    : "IELTS Practice");

                const date =
                  item?.submittedAt ||
                  item?.completedAt ||
                  item?.startedAt ||
                  item?.createdAt;

                const status = item?.status || "UNKNOWN";

                return (
                  <div
                    key={item?.attemptId || item?.id || index}
                    className="rounded-xl border border-[#E7ECF6] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[#FF9BAF] hover:shadow-lg dark:border-[#49333D]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF456C] dark:bg-[#49232F]">
                        {activeHistoryTab === "Mock tests" ? (
                          <Trophy size={19} />
                        ) : (
                          <BookOpen size={19} />
                        )}
                      </span>

                      <span className="rounded-full bg-[#F4F7FD] px-2.5 py-1 text-[10px] font-bold text-[#506995] dark:bg-[#30232B] dark:text-[#C1B5C0]">
                        {String(status).replaceAll("_", " ")}
                      </span>
                    </div>

                    <h3 className="mt-3 line-clamp-2 text-sm font-extrabold text-[#10265F] dark:text-white">
                      {title}
                    </h3>

                    <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-[#71809D] dark:text-[#BDB0BC]">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} />
                        {getDate(date)}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        {/* TEST RESULTS TABLE */}

        <Panel>
          <SectionTitle
            title="Mock Test Results"
            subtitle="Your scored mock tests and skill-wise performance"
          />

          <div className="mb-3 flex justify-end">
            <div className="relative">
              <select
                value={testFilter}
                onChange={(event) => setTestFilter(event.target.value)}
                className="appearance-none rounded-lg border border-[#E2E8F5] bg-white py-2 pl-3 pr-8 text-[11px] font-bold outline-none focus:border-[#FF8199] dark:border-[#49333D] dark:bg-[#30232B] dark:text-[#FFF8FA]"
              >
                <option>All tests</option>
                <option>Highest score</option>
                <option>Oldest first</option>
              </select>

              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          {loading ? (
            <LoadingState />
          ) : filteredTests.length === 0 ? (
            <EmptyState
              title="No completed mock test results"
              description="Complete a full mock test to see your overall band and individual skill scores."
              action={
                <button
                  type="button"
                  onClick={() => navigate("/mock-tests")}
                  className="mt-4 rounded-xl bg-[#FF456C] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#E81745]"
                >
                  Explore mock tests
                </button>
              }
            />
          ) : (
            <div className="w-full overflow-x-auto rounded-xl">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#F4F7FD] text-[11px] text-[#506995] dark:bg-[#30232B] dark:text-[#C1B5C0]">
                    <th className="rounded-l-lg px-3 py-3 font-extrabold">
                      Test name
                    </th>

                    <th className="px-3 py-3 font-extrabold">
                      Date
                    </th>

                    <th className="px-3 py-3 font-extrabold">
                      Overall band
                    </th>

                    <th className="px-3 py-3 font-extrabold">
                      Skills
                    </th>

                    <th className="rounded-r-lg px-3 py-3 font-extrabold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTests.map((test) => (
                    <tr
                      key={test.id}
                      className="border-b border-[#EDF0F8] text-xs last:border-b-0 dark:border-[#49333D]"
                    >
                      <td className="max-w-[180px] truncate px-3 py-3 font-bold">
                        {test.name}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3 text-[#71809D] dark:text-[#BDB0BC]">
                        {getDate(test.date)}
                      </td>

                      <td className="px-3 py-3">
                        <BandBadge score={test.band} />
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex gap-1">
                          <BandBadge score={test.listening} />
                          <BandBadge score={test.reading} />
                          <BandBadge score={test.writing} />
                          <BandBadge score={test.speaking} />
                        </div>
                      </td>

                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedTest(test)}
                          className="rounded-lg border border-[#FF9BAF] px-3 py-1.5 text-[11px] font-bold text-[#FF456C] transition hover:bg-[#FFF0F3] dark:border-[#71404D] dark:hover:bg-[#30232B]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        {/* STRENGTHS + IMPROVEMENT + NEXT STEPS */}

        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">

          <Panel>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E5F9F1] text-[#00A879]">
                <Trophy size={19} />
              </span>

              <h3 className="text-sm font-extrabold">
                Strengths
              </h3>
            </div>

            <div className="space-y-3">
              {[
                "Review your highest-scoring skill.",
                "Maintain your performance through regular practice.",
                "Compare recent mock test results.",
                "Continue building exam confidence.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-[#00A879]"
                  />

                  <p className="text-xs leading-5 text-[#506995] dark:text-[#C1B5C0]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF456C] dark:bg-[#49232F]">
                <Target size={19} />
              </span>

              <h3 className="text-sm font-extrabold">
                Areas to improve
              </h3>
            </div>

            <div className="space-y-3">
              {[
                "Review your lowest-scoring skill.",
                "Practise regularly under timed conditions.",
                "Analyse mistakes after each mock test.",
                "Track your band score over time.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <AlertCircle
                    size={17}
                    className="mt-0.5 shrink-0 text-[#FF456C]"
                  />

                  <p className="text-xs leading-5 text-[#506995] dark:text-[#C1B5C0]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="bg-gradient-to-br from-white to-[#FFF5F7] dark:from-[#211e27] dark:to-[#30232B]">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFE8C9] text-[#D97706]">
                <Target size={19} />
              </span>

              <h3 className="text-sm font-extrabold">
                Recommended next steps
              </h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  text: "Practise Listening Section 3 questions",
                  path: "/practice",
                },
                {
                  text: "Work on Writing Task 2 essays",
                  path: "/ai-feedback",
                },
                {
                  text: "Learn advanced vocabulary for band 7+",
                  path: "/study-resources",
                },
                {
                  text: "Take another full IELTS mock test",
                  path: "/mock-tests",
                },
              ].map((item, index) => (
                <button
                  key={item.text}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="flex w-full items-start gap-3 text-left"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFE0E7] text-[11px] font-black text-[#FF456C] dark:bg-[#49232F] dark:text-[#FF8CA5]">
                    {index + 1}
                  </span>

                  <span className="flex-1 text-xs leading-5 text-[#506995] transition hover:text-[#FF456C] dark:text-[#C1B5C0] dark:hover:text-[#FF8CA5]">
                    {item.text}
                  </span>

                  <ArrowRight
                    size={14}
                    className="mt-1 shrink-0 text-[#FF456C]"
                  />
                </button>
              ))}
            </div>
          </Panel>
        </div>

        {/* EXTRA INSIGHT STRIP */}

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Mock tests completed",
              value: String(completedMocks.length),
              detail: "From mock history",
              icon: BarChart3,
              color: "#FF456C",
              bg: "bg-[#FFF0F3] dark:bg-[#49232F]",
            },
            {
              label: "Average band score",
              value: averageBand,
              detail: "Across scored tests",
              icon: Activity,
              color: "#873BFA",
              bg: "bg-[#F3EAFF] dark:bg-[#382747]",
            },
            {
              label: "Practice activities",
              value: String(practiceHistory.length),
              detail: "From practice history",
              icon: Flame,
              color: "#D97706",
              bg: "bg-[#FFF4E5] dark:bg-[#443323]",
            },
            {
              label: "Target band score",
              value: TARGET_SCORE.toFixed(1),
              detail: "Your selected target",
              icon: Target,
              color: "#00A879",
              bg: "bg-[#E5F9F1] dark:bg-[#203C34]",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Panel
                key={item.label}
                className="flex items-center gap-3"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.bg}`}
                  style={{ color: item.color }}
                >
                  <Icon size={22} />
                </span>

                <div className="min-w-0">
                  <p className="text-xs text-[#71809D] dark:text-[#BDB0BC]">
                    {item.label}
                  </p>

                  <p className="mt-1 text-xl font-black">
                    {item.value}
                  </p>

                  <p className="mt-1 text-[10px] text-[#71809D] dark:text-[#BDB0BC]">
                    {item.detail}
                  </p>
                </div>
              </Panel>
            );
          })}
        </div>

        <p className="pb-2 text-center text-[11px] text-[#9AA8C2] dark:text-[#807580]">
          Equilx IELTS · Your progress, one step at a time.
        </p>
      </div>

      {/* TEST DETAILS MODAL */}

      {selectedTest && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#081633]/60 p-3 backdrop-blur-sm sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedTest(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="test-modal-title"
            className="progress-modal-content my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl dark:bg-[#211e27] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FF456C]">
                  Mock test result
                </p>

                <h2
                  id="test-modal-title"
                  className="mt-2 break-words text-xl font-black"
                >
                  {selectedTest.name}
                </h2>

                <p className="mt-1 text-xs text-[#71809D] dark:text-[#BDB0BC]">
                  {getDate(selectedTest.date)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTest(null)}
                aria-label="Close result details"
                className="shrink-0 rounded-xl border border-[#E2E8F5] p-2 text-[#506995] transition hover:bg-[#FFF0F3] hover:text-[#FF456C] dark:border-[#49333D] dark:text-[#C1B5C0]"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-5 rounded-2xl bg-gradient-to-r from-[#FFF0F3] to-[#F5F7FF] p-4 dark:from-[#30232B] dark:to-[#30232B]">
              <BandRing
                score={selectedTest.band}
                size={105}
                stroke={9}
              />

              <div>
                <p className="text-xs text-[#71809D] dark:text-[#BDB0BC]">
                  Overall band score
                </p>

                <p className="mt-1 text-3xl font-black">
                  {selectedTest.band > 0
                    ? selectedTest.band.toFixed(1)
                    : "—"}
                </p>

                <p className="mt-1 text-xs text-[#506995] dark:text-[#C1B5C0]">
                  Target: {TARGET_SCORE.toFixed(1)}
                </p>
              </div>
            </div>

            <h3 className="mt-5 text-sm font-extrabold">
              Skill breakdown
            </h3>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {skills.map((skill) => {
                const Icon = skill.icon;
                const score =
                  selectedTest[skill.name.toLowerCase()] || 0;

                return (
                  <div
                    key={skill.name}
                    className="flex items-center gap-3 rounded-xl border border-[#E7ECF6] p-3 dark:border-[#49333D]"
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${skill.bg}`}
                      style={{ color: skill.color }}
                    >
                      <Icon size={19} />
                    </span>

                    <div>
                      <p className="text-xs text-[#71809D] dark:text-[#BDB0BC]">
                        {skill.name}
                      </p>

                      <p className="mt-1 text-lg font-black">
                        {score ? score.toFixed(1) : "—"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedTest(null);
                navigate("/mock-tests");
              }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF456C] py-3 text-sm font-bold text-white transition hover:bg-[#E81745]"
            >
              Go to mock tests <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
