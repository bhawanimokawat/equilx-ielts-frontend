
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  Crown,
  ArrowRight,
  CheckCircle2,
  FileText,
  TrendingUp,
  Target,
  Sparkles,
  ChevronRight,
  Play,
  GraduationCap,
  RefreshCw,
  Clock3,
  ClipboardList,
  Activity,
  LoaderCircle,
  AlertCircle,
  CalendarDays,
  BarChart3,
  CircleCheck,
  BookMarked,
  Trophy,
  UserRound,
} from "lucide-react";

import StudentLayout from "./StudentLayout";
import studentService from "../../services/studentService";

// ======================================================
// CONSTANTS
// ======================================================

const skills = [
  {
    name: "Listening",
    icon: Headphones,
    color: "#FF456C",
    bg: "#FFF0F3",
    path: "/practice",
    key: "listeningBand",
  },
  {
    name: "Reading",
    icon: BookOpen,
    color: "#9333EA",
    bg: "#F4EAFE",
    path: "/practice",
    key: "readingBand",
  },
  {
    name: "Writing",
    icon: PenLine,
    color: "#2784FF",
    bg: "#EAF3FF",
    path: "/ai-feedback",
    key: "writingBand",
  },
  {
    name: "Speaking",
    icon: Mic,
    color: "#00A879",
    bg: "#E5F9F1",
    path: "/live-speaking",
    key: "speakingBand",
  },
];

const practiceCards = [
  {
    title: "Listening",
    subtitle: "Improve listening accuracy and understanding.",
    description: "Train your ears with IELTS listening exercises.",
    icon: Headphones,
    color: "#FF456C",
    bg: "#FFF0F3",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
    path: "/practice",
  },
  {
    title: "Reading",
    subtitle: "Improve comprehension and reading speed.",
    description: "Build confidence with reading passages.",
    icon: BookOpen,
    color: "#9333EA",
    bg: "#F4EAFE",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85",
    path: "/practice",
  },
  {
    title: "Writing",
    subtitle: "Practise essays and improve your writing.",
    description: "Work on Task 1 and Task 2 responses.",
    icon: PenLine,
    color: "#2784FF",
    bg: "#EAF3FF",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85",
    path: "/ai-feedback",
  },
  {
    title: "Speaking",
    subtitle: "Build confidence through speaking practice.",
    description: "Practise speaking and fluency.",
    icon: Mic,
    color: "#00A879",
    bg: "#E5F9F1",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=85",
    path: "/live-speaking",
  },
];

const resources = [
  {
    title: "Grammar essentials",
    subtitle: "Strengthen sentence structure",
    icon: BookOpen,
    color: "#FF456C",
    bg: "#FFF0F3",
  },
  {
    title: "Vocabulary builder",
    subtitle: "Learn useful words in context",
    icon: GraduationCap,
    color: "#00A879",
    bg: "#E5F9F1",
  },
  {
    title: "Exam strategies",
    subtitle: "Tips for each section",
    icon: Target,
    color: "#9333EA",
    bg: "#F4EAFE",
  },
  {
    title: "Sample essays",
    subtitle: "High-band score examples",
    icon: FileText,
    color: "#2784FF",
    bg: "#EAF3FF",
  },
];

// ======================================================
// DATA HELPERS
// ======================================================

const unwrap = (response) => response?.data ?? response ?? {};

const getArray = (response, keys = []) => {
  const data = unwrap(response);

  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

const getProfileName = (profile) =>
  profile?.profile?.name ||
  profile?.name ||
  profile?.fullName ||
  profile?.email?.split("@")[0] ||
  "Student";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const getBand = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) && number >= 0 && number <= 9
    ? number
    : null;
};

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getResult = (item) =>
  item?.result ||
  item?.mockScore ||
  item?.practiceResult ||
  item?.scoreSnapshot ||
  {};

const getTestName = (item) => {
  const test = item?.test || item?.testVersion?.test;

  if (test?.title) {
    return test?.book?.title
      ? `${test.book.title} - ${test.title}`
      : test.title;
  }

  return item?.title || item?.name || "IELTS Test";
};

const getUsageType = (item) =>
  item?.usageType ||
  (item?.mockScore || item?.mockResult ? "FULL_MOCK" : "PRACTICE");

const getTestScore = (item) => {
  const result = getResult(item);
  const band = result?.overallBand ?? result?.bandScore;

  if (band !== undefined && band !== null) {
    return `Band ${band}`;
  }

  if (item?.status === "IN_PROGRESS") return "In progress";

  return item?.status || "Completed";
};

const getTestDate = (item) =>
  item?.submittedAt ||
  item?.completedAt ||
  getResult(item)?.completedAt ||
  item?.createdAt ||
  item?.startedAt;

const buildRecentTests = (results, practice, mock) => {
  const map = new Map();

  const add = (item, type) => {
    if (!item) return;

    const id = item?.attemptId || item?.id;

    if (!id || map.has(id)) return;

    map.set(id, {
      id,
      name: getTestName(item),
      type,
      score: getTestScore(item),
      date: getTestDate(item),
      status: item?.status,
    });
  };

  results.forEach((item) => {
    add(
      item,
      getUsageType(item) === "FULL_MOCK" ? "Mock test" : "Practice"
    );
  });

  mock.forEach((item) => add(item, "Mock test"));
  practice.forEach((item) => add(item, "Practice"));

  return Array.from(map.values())
    .sort(
      (a, b) =>
        new Date(b.date || 0).getTime() -
        new Date(a.date || 0).getTime()
    )
    .slice(0, 5);
};

// ======================================================
// COMMON PANEL
// ======================================================

function Panel({ children, className = "" }) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-[#E8EAF0] bg-white shadow-[0_4px_22px_rgba(20,20,40,0.035)] dark:border-[#393440] dark:bg-[#211e27] ${className}`}
    >
      {children}
    </section>
  );
}

function PanelHeader({ icon: Icon, title, subtitle, action, onClick }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF456C] dark:bg-[#38202B]">
            <Icon size={20} />
          </div>
        )}

        <div className="min-w-0">
          <h2 className="truncate text-sm font-extrabold text-[#292331] dark:text-white sm:text-base">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-[11px] text-[#898394] dark:text-[#AAA5B4]">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action && (
        <button
          type="button"
          onClick={onClick}
          className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF456C] transition hover:text-[#E51F50]"
        >
          {action}
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

// ======================================================
// EMPTY STATE
// ======================================================

function EmptyState({ icon: Icon = ClipboardList, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E2EA] bg-[#FAF9FB] px-4 py-8 text-center dark:border-[#403B46] dark:bg-[#292530]">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF0F3] text-[#FF456C] dark:bg-[#38202B]">
        <Icon size={22} />
      </div>

      <p className="text-sm font-bold text-[#292331] dark:text-white">
        {title}
      </p>

      <p className="mt-1 max-w-xs text-xs leading-5 text-[#898394] dark:text-[#AAA5B4]">
        {description}
      </p>
    </div>
  );
}

// ======================================================
// LOADING
// ======================================================

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-[245px] rounded-2xl bg-[#F1EDF2] dark:bg-[#302B36]" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-28 rounded-2xl bg-[#F1EDF2] dark:bg-[#302B36]"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,0.85fr)]">
        <div className="space-y-5">
          <div className="h-56 rounded-2xl bg-[#F1EDF2] dark:bg-[#302B36]" />
          <div className="h-64 rounded-2xl bg-[#F1EDF2] dark:bg-[#302B36]" />
        </div>

        <div className="space-y-5">
          <div className="h-56 rounded-2xl bg-[#F1EDF2] dark:bg-[#302B36]" />
          <div className="h-56 rounded-2xl bg-[#F1EDF2] dark:bg-[#302B36]" />
        </div>
      </div>
    </div>
  );
}

// ======================================================
// HERO
// ======================================================

function HeroBanner({ name, email, navigate }) {
  return (
    <section className="relative grid min-h-[250px] overflow-hidden rounded-2xl border border-[#F1DDE2] bg-[#FFF3F5] dark:border-[#44313B] dark:bg-[#30232D] md:grid-cols-[0.8fr_1.2fr]">
      <div className="relative z-10 flex flex-col items-start justify-center p-5 sm:p-7">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#FFD5DF] bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#E83E65] dark:border-[#63404C] dark:bg-[#211e27] dark:text-[#FF829B]">
          <Sparkles size={14} />
          IELTS learning journey
        </div>

        <p className="text-sm text-[#777184] dark:text-[#B9B2C2]">
          {getGreeting()},
        </p>

        <h1 className="mt-1 max-w-full break-words text-3xl font-black tracking-tight text-[#292331] dark:text-white sm:text-[42px]">
          {name}
          <span className="text-[#FF456C]">!</span>
        </h1>

        {email && (
          <p className="mt-1 max-w-full truncate text-xs text-[#898394] dark:text-[#AAA5B4]">
            {email}
          </p>
        )}

        <p className="mt-3 max-w-[320px] text-xs leading-6 text-[#716A7B] dark:text-[#B9B2C2] sm:text-sm">
          Your IELTS preparation journey starts here. Practise consistently
          and work towards your target band score.
        </p>

        <button
          type="button"
          onClick={() => navigate("/practice")}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FF456C] px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-200/40 transition hover:-translate-y-0.5 hover:bg-[#E92E59] dark:shadow-none"
        >
          Continue learning
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="relative hidden min-h-[250px] overflow-hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=90"
          alt="Students studying together"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#FFF3F5] to-transparent dark:from-[#30232D]" />
      </div>
    </section>
  );
}

// ======================================================
// OVERVIEW CARDS
// ======================================================

function OverviewCards({ attempts, results }) {
  const inProgress = attempts.filter(
    (item) => item?.status === "IN_PROGRESS"
  ).length;

  const stats = [
    {
      title: "Total attempts",
      value: attempts.length,
      description: "All recorded attempts",
      icon: ClipboardList,
      color: "#FF456C",
      bg: "#FFF0F3",
    },
    {
      title: "Completed tests",
      value: results.length,
      description: "Available result records",
      icon: CircleCheck,
      color: "#00A879",
      bg: "#E5F9F1",
    },
    {
      title: "In progress",
      value: inProgress,
      description: "Currently active attempts",
      icon: Clock3,
      color: "#2784FF",
      bg: "#EAF3FF",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Panel
            key={item.title}
            className="group p-4 transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#898394] dark:text-[#AAA5B4]">
                  {item.title}
                </p>

                <p className="mt-2 text-3xl font-black text-[#292331] dark:text-white">
                  {item.value}
                </p>

                <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                  {item.description}
                </p>
              </div>

              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: item.bg, color: item.color }}
              >
                <Icon size={22} />
              </div>
            </div>
          </Panel>
        );
      })}
    </div>
  );
}

// ======================================================
// PERFORMANCE
// ======================================================

function PerformancePanel({ results, navigate }) {
  const latestMock = results.find(
    (item) =>
      getUsageType(item) === "FULL_MOCK" &&
      getResult(item)?.overallBand != null
  );

  const result = latestMock ? getResult(latestMock) : {};

  const overallBand = getBand(result?.overallBand);

  const availableSkills = skills.map((skill) => ({
    ...skill,
    score: getBand(result?.[skill.key]),
  }));

  return (
    <Panel className="p-4 sm:p-5">
      <PanelHeader
        icon={BarChart3}
        title="Your performance"
        subtitle="Understand your IELTS skill scores"
        action="Full report"
        onClick={() => navigate("/progress")}
      />

      <div className="grid gap-5 md:grid-cols-[175px_minmax(0,1fr)]">
        <div className="flex flex-col items-center justify-center rounded-xl bg-[#FAF8FA] p-4 dark:bg-[#292530]">
          <p className="text-xs font-semibold text-[#898394] dark:text-[#AAA5B4]">
            Latest overall band
          </p>

          <div className="relative mt-3 flex h-32 w-32 items-center justify-center">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="49"
                fill="none"
                stroke="#E9E9EF"
                strokeWidth="10"
                className="dark:stroke-[#403B46]"
              />

              {overallBand !== null && (
                <circle
                  cx="60"
                  cy="60"
                  r="49"
                  fill="none"
                  stroke="#FF456C"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(overallBand / 9) * 308} 308`}
                />
              )}
            </svg>

            <div className="absolute text-center">
              <p className="text-3xl font-black">
                {overallBand ?? "--"}
              </p>
              <p className="text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                Out of 9
              </p>
            </div>
          </div>

          <p className="mt-2 text-center text-[10px] text-[#898394] dark:text-[#AAA5B4]">
            {latestMock
              ? `Updated ${formatDate(getTestDate(latestMock))}`
              : "No completed mock score"}
          </p>
        </div>

        <div className="min-w-0">
          <div className="mb-4">
            <h3 className="text-sm font-extrabold">
              Skill-wise performance
            </h3>
            <p className="mt-1 text-[11px] text-[#898394] dark:text-[#AAA5B4]">
              Scores from your latest available mock result
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {availableSkills.map((skill) => {
              const Icon = skill.icon;

              return (
                <button
                  key={skill.name}
                  type="button"
                  onClick={() => navigate(skill.path)}
                  className="rounded-xl border border-[#ECECF1] bg-white p-3 text-left transition hover:border-[#FFB8C8] hover:bg-[#FFFAFB] dark:border-[#393440] dark:bg-[#211e27] dark:hover:bg-[#30232D]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{
                          color: skill.color,
                          backgroundColor: skill.bg,
                        }}
                      >
                        <Icon size={19} />
                      </span>

                      <span className="text-xs font-bold">
                        {skill.name}
                      </span>
                    </div>

                    <span className="text-lg font-black">
                      {skill.score ?? "--"}
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#EEEAF0] dark:bg-[#403B46]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width:
                          skill.score === null
                            ? "0%"
                            : `${(skill.score / 9) * 100}%`,
                        backgroundColor: skill.color,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Panel>
  );
}

// ======================================================
// PRACTICE CARDS
// ======================================================

function PracticeSection({ navigate }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold sm:text-lg">
            Continue practising
          </h2>
          <p className="mt-1 text-xs text-[#898394] dark:text-[#AAA5B4]">
            Choose a skill and keep improving
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/practice")}
          className="flex items-center gap-1 text-xs font-bold text-[#FF456C]"
        >
          View all <ArrowRight size={15} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {practiceCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className="group overflow-hidden rounded-2xl border border-[#E8EAF0] bg-white shadow-[0_4px_20px_rgba(20,20,40,0.035)] transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-[#393440] dark:bg-[#211e27]"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={card.image}
                  alt={`${card.title} practice`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />

                <div
                  className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md"
                  style={{ color: card.color }}
                >
                  <Icon size={21} />
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-extrabold">
                    {card.title}
                  </h3>

                  <span
                    className="rounded-full px-2 py-1 text-[9px] font-bold"
                    style={{
                      backgroundColor: card.bg,
                      color: card.color,
                    }}
                  >
                    IELTS Skill
                  </span>
                </div>

                <p className="mt-2 min-h-[36px] text-xs leading-5 text-[#898394] dark:text-[#AAA5B4]">
                  {card.description}
                </p>

                <button
                  type="button"
                  onClick={() => navigate(card.path)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFF0F3] py-3 text-xs font-bold text-[#FF456C] transition hover:bg-[#FF456C] hover:text-white dark:bg-[#38202B] dark:hover:bg-[#FF456C]"
                >
                  Start practising
                  <ArrowRight size={15} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ======================================================
// RECENT ACTIVITY
// ======================================================

function RecentActivity({ tests, navigate }) {
  return (
    <Panel className="p-4 sm:p-5">
      <PanelHeader
        icon={CalendarDays}
        title="Recent activity"
        subtitle="Your latest test and practice records"
        action="View all"
        onClick={() => navigate("/progress")}
      />

      {tests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No activity yet"
          description="Your test attempts and results will appear here once available."
        />
      ) : (
        <div className="space-y-2">
          {tests.map((test) => (
            <div
              key={test.id}
              className="flex flex-col gap-3 rounded-xl border border-[#ECECF1] bg-white p-3 transition hover:bg-[#FAF8FA] dark:border-[#393440] dark:bg-[#211e27] dark:hover:bg-[#292530] sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF456C] dark:bg-[#38202B]">
                  {test.type === "Mock test" ? (
                    <Trophy size={19} />
                  ) : (
                    <BookOpen size={19} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-bold">
                    {test.name}
                  </p>

                  <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                    {test.type} · {formatDate(test.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="rounded-lg bg-[#F5F3F7] px-3 py-2 text-[10px] font-bold text-[#555061] dark:bg-[#302B36] dark:text-[#D1CBD8]">
                  {test.score}
                </span>

                <button
                  type="button"
                  onClick={() => navigate("/progress")}
                  className="flex items-center gap-1 text-xs font-bold text-[#FF456C]"
                >
                  View <ChevronRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

// ======================================================
// LEARNING ACTIVITY
// ======================================================

function LearningActivity({ attempts, results }) {
  const inProgress = attempts.filter(
    (item) => item?.status === "IN_PROGRESS"
  ).length;

  return (
    <Panel className="p-4 sm:p-5">
      <PanelHeader
        icon={Activity}
        title="Learning activity"
        subtitle="Your recorded learning summary"
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-[#FAF8FA] p-3 dark:bg-[#292530]">
          <div className="flex items-center gap-2">
            <ClipboardList size={17} className="text-[#FF456C]" />
            <span className="text-xs font-semibold">Total attempts</span>
          </div>

          <span className="text-sm font-black">{attempts.length}</span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#FAF8FA] p-3 dark:bg-[#292530]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-[#00A879]" />
            <span className="text-xs font-semibold">Results available</span>
          </div>

          <span className="text-sm font-black">{results.length}</span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#FAF8FA] p-3 dark:bg-[#292530]">
          <div className="flex items-center gap-2">
            <Clock3 size={17} className="text-[#2784FF]" />
            <span className="text-xs font-semibold">In progress</span>
          </div>

          <span className="text-sm font-black">{inProgress}</span>
        </div>
      </div>

      <p className="mt-4 text-[10px] leading-5 text-[#898394] dark:text-[#AAA5B4]">
        This summary uses records returned by your account APIs. It does not
        represent a daily streak or weekly goal.
      </p>
    </Panel>
  );
}

// ======================================================
// PLAN CARD
// ======================================================

function PlanCard({ navigate }) {
  return (
    <Panel className="overflow-hidden border-[#F5DCE2] dark:border-[#49333D]">
      <div className="bg-gradient-to-br from-[#FFF3F5] to-white p-4 dark:from-[#30232D] dark:to-[#211e27] sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0E2] text-[#E99A28] dark:bg-[#443329]">
            <Crown size={23} />
          </div>

          <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#E99A28] dark:bg-[#443329]">
            Membership
          </span>
        </div>

        <h3 className="mt-4 text-lg font-extrabold">Explore your plan</h3>

        <p className="mt-2 text-xs leading-5 text-[#777184] dark:text-[#C1BBC8]">
          Explore available subscription plans and their included features.
        </p>

        <button
          type="button"
          onClick={() => navigate("/my-plan")}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF456C] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#E92E59]"
        >
          View subscription plans
          <ArrowRight size={15} />
        </button>
      </div>
    </Panel>
  );
}

// ======================================================
// RESOURCES
// ======================================================

function StudyResources({ navigate }) {
  return (
    <Panel className="p-4 sm:p-5">
      <PanelHeader
        icon={BookMarked}
        title="Study resources"
        subtitle="Explore learning material"
        action="View all"
        onClick={() => navigate("/study-resources")}
      />

      <div className="space-y-2">
        {resources.map((resource) => {
          const Icon = resource.icon;

          return (
            <button
              key={resource.title}
              type="button"
              onClick={() => navigate("/study-resources")}
              className="flex w-full items-center gap-3 rounded-xl border border-transparent p-2 text-left transition hover:border-[#ECECF1] hover:bg-[#FAF8FA] dark:hover:border-[#393440] dark:hover:bg-[#292530]"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: resource.bg,
                  color: resource.color,
                }}
              >
                <Icon size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold">
                  {resource.title}
                </p>

                <p className="mt-1 truncate text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                  {resource.subtitle}
                </p>
              </div>

              <ChevronRight
                size={16}
                className="shrink-0 text-[#96909F]"
              />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => navigate("/study-resources")}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5F5F8] py-3 text-xs font-bold text-[#292331] transition hover:bg-[#ECECF1] dark:bg-[#292530] dark:text-white dark:hover:bg-[#393440]"
      >
        Explore all resources
        <ArrowRight size={15} />
      </button>
    </Panel>
  );
}

// ======================================================
// NEXT STEP
// ======================================================

function NextStep({ navigate }) {
  return (
    <section className="rounded-2xl border border-[#E8EAF0] bg-gradient-to-br from-white to-[#FFF4F6] p-4 dark:border-[#393440] dark:from-[#211e27] dark:to-[#30232D] sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF456C] dark:bg-[#38202B]">
          <Target size={21} />
        </div>

        <div>
          <h3 className="text-sm font-extrabold">Ready for a challenge?</h3>

          <p className="mt-1 text-xs leading-5 text-[#898394] dark:text-[#AAA5B4]">
            Explore mock tests and practise in an exam-style environment.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate("/mock-tests")}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#292331] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#413746] dark:bg-[#FF456C] dark:hover:bg-[#E92E59]"
      >
        <Play size={15} />
        Explore mock tests
      </button>
    </section>
  );
}

// ======================================================
// MAIN DASHBOARD
// ======================================================

export default function Dashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    profile: null,
    attempts: [],
    results: [],
    practiceHistory: [],
    mockHistory: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const responses = await Promise.allSettled([
        studentService.getProfile(),
        studentService.getAttempts(),
        studentService.getResults(1, 10),
        studentService.getPracticeHistory(1, 5),
        studentService.getMockHistory(1, 5),
      ]);

      const [
        profileResponse,
        attemptsResponse,
        resultsResponse,
        practiceResponse,
        mockResponse,
      ] = responses;

      if (profileResponse.status === "rejected") {
        throw profileResponse.reason;
      }

      const profileData = unwrap(profileResponse.value);

      const attempts = getArray(
        attemptsResponse.status === "fulfilled"
          ? attemptsResponse.value
          : null,
        ["attempts"]
      );

      const results = getArray(
        resultsResponse.status === "fulfilled"
          ? resultsResponse.value
          : null,
        ["results"]
      );

      const practiceHistory = getArray(
        practiceResponse.status === "fulfilled"
          ? practiceResponse.value
          : null,
        ["items", "history", "attempts"]
      );

      const mockHistory = getArray(
        mockResponse.status === "fulfilled"
          ? mockResponse.value
          : null,
        ["items", "history", "attempts"]
      );

      setDashboardData({
        profile: profileData?.user || profileData?.profile || profileData,
        attempts,
        results,
        practiceHistory,
        mockHistory,
      });

      const failedModules = responses
        .slice(1)
        .filter((item) => item.status === "rejected");

      if (failedModules.length > 0) {
        console.warn(
          "Some dashboard APIs could not be loaded:",
          failedModules
        );
      }
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err?.message ||
          "Unable to load your dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const recentTests = useMemo(
    () =>
      buildRecentTests(
        dashboardData.results,
        dashboardData.practiceHistory,
        dashboardData.mockHistory
      ),
    [
      dashboardData.results,
      dashboardData.practiceHistory,
      dashboardData.mockHistory,
    ]
  );

  const studentName = getProfileName(dashboardData.profile);
  const studentEmail = dashboardData.profile?.email || "";

  if (loading) {
    return (
      <StudentLayout>
        <main className="mx-auto w-full max-w-[1800px]">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-[#898394]">
            <LoaderCircle size={16} className="animate-spin" />
            Loading your dashboard...
          </div>
          <DashboardSkeleton />
        </main>
      </StudentLayout>
    );
  }

  if (error && !dashboardData.profile) {
    return (
      <StudentLayout>
        <main className="mx-auto w-full max-w-[1800px]">
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E8A5B5] bg-[#FFF7F8] p-6 text-center dark:border-[#61404B] dark:bg-[#30232D]">
            <AlertCircle size={32} className="text-[#FF456C]" />

            <h2 className="mt-4 text-lg font-extrabold">
              Unable to load dashboard
            </h2>

            <p className="mt-2 max-w-md text-sm text-[#777184] dark:text-[#B9B2C2]">
              {error}
            </p>

            <button
              type="button"
              onClick={loadDashboard}
              className="mt-5 flex items-center gap-2 rounded-xl bg-[#FF456C] px-5 py-3 text-sm font-bold text-white hover:bg-[#E92E59]"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        </main>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <main className="mx-auto w-full max-w-[1800px] space-y-5 text-[#252333] dark:text-white">
        {/* PAGE HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#898394] dark:text-[#AAA5B4]">
              Student portal
            </p>

            <h2 className="mt-1 text-xl font-extrabold">
              Dashboard overview
            </h2>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E8EAF0] bg-white px-4 py-2.5 text-xs font-bold text-[#777184] transition hover:border-[#FF456C] hover:text-[#FF456C] dark:border-[#393440] dark:bg-[#211e27] dark:text-[#C1BBC8]"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* HERO */}

        <HeroBanner
          name={studentName}
          email={studentEmail}
          navigate={navigate}
        />

        {/* OVERVIEW */}

        <OverviewCards
          attempts={dashboardData.attempts}
          results={dashboardData.results}
        />

        {error && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[#F0C5CF] bg-[#FFF7F8] p-3 text-xs text-[#B83254] dark:border-[#61404B] dark:bg-[#30232D] dark:text-[#FF829B]">
            <span>{error}</span>
            <button
              type="button"
              onClick={loadDashboard}
              className="shrink-0 font-bold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* MAIN CONTENT */}

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(290px,0.85fr)]">
          {/* LEFT COLUMN */}

          <div className="min-w-0 space-y-5">
            <PerformancePanel
              results={dashboardData.results}
              navigate={navigate}
            />

            <PracticeSection navigate={navigate} />

            <RecentActivity
              tests={recentTests}
              navigate={navigate}
            />
          </div>

          {/* RIGHT COLUMN */}

          <aside className="min-w-0 space-y-5">
            <LearningActivity
              attempts={dashboardData.attempts}
              results={dashboardData.results}
            />

            <PlanCard navigate={navigate} />

            <StudyResources navigate={navigate} />

            <NextStep navigate={navigate} />
          </aside>
        </div>

        {/* FOOTER */}

        <footer className="border-t border-[#ECECF1] pt-4 text-center text-[11px] text-[#AAA5B4] dark:border-[#393440]">
          Equilx IELTS · Prepare with purpose
        </footer>
      </main>
    </StudentLayout>
  );
}
