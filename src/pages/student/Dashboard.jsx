
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  Flame,
  Crown,
  ArrowRight,
  Check,
  FileText,
  TrendingUp,
  Target,
  Sparkles,
  ChevronRight,
  Play,
  GraduationCap,
  Trophy,
} from "lucide-react";

import StudentLayout from "./StudentLayout";

// ======================================================
// DEMO DATA
// ======================================================

const skills = [
  {
    name: "Listening",
    score: "28 / 40",
    percent: 70,
    icon: Headphones,
    color: "#FF456C",
    path: "/practice",
  },
  {
    name: "Reading",
    score: "22 / 40",
    percent: 55,
    icon: BookOpen,
    color: "#9333EA",
    path: "/practice",
  },
  {
    name: "Writing",
    score: "8 / 20",
    percent: 40,
    icon: PenLine,
    color: "#2784FF",
    path: "/ai-feedback",
  },
  {
    name: "Speaking",
    score: "12 / 20",
    percent: 60,
    icon: Mic,
    color: "#00A879",
    path: "/live-speaking",
  },
];

const practiceCards = [
  {
    title: "Listening",
    subtitle: "Practise section-wise questions.",
    icon: Headphones,
    color: "#FF2454",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=95",
    path: "/practice",
  },
  {
    title: "Reading",
    subtitle: "Improve comprehension and speed.",
    icon: BookOpen,
    color: "#8B2CFF",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=95",
    path: "/practice",
  },
  {
    title: "Writing",
    subtitle: "Get feedback on your essays.",
    icon: PenLine,
    color: "#2784FF",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=95",
    path: "/ai-feedback",
  },
  {
    title: "Speaking",
    subtitle: "Practise and improve confidence.",
    icon: Mic,
    color: "#00A879",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=95",
    path: "/live-speaking",
  },
];

const recentTests = [
  {
    name: "Cambridge 18 - Test 1",
    type: "Mock Test",
    score: "6.0",
    date: "20 Oct 2026",
  },
  {
    name: "Listening Practice Set 3",
    type: "Practice",
    score: "32 / 40",
    date: "18 Oct 2026",
  },
  {
    name: "Writing Task 2 (Education)",
    type: "Practice",
    score: "6.5 (AI)",
    date: "16 Oct 2026",
  },
];

const resources = [
  {
    title: "Grammar essentials",
    subtitle: "Strengthen sentence structure",
    icon: BookOpen,
    color: "#FF2454",
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
    color: "#8B2CFF",
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

const weeklyActivity = [
  { day: "Mon", completed: true },
  { day: "Tue", completed: true },
  { day: "Wed", completed: true },
  { day: "Thu", completed: true },
  { day: "Fri", completed: true },
  { day: "Sat", completed: true },
  { day: "Sun", completed: true },
];

const completedDays = weeklyActivity.filter(
  (item) => item.completed
).length;

// ======================================================
// REUSABLE PANEL
// ======================================================

function Panel({ children, className = "" }) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-[#E8EAF0] bg-white p-4 shadow-[0_3px_18px_rgba(20,20,40,0.035)] dark:border-[#393440] dark:bg-[#211e27] sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

// ======================================================
// SECTION HEADING
// ======================================================

function SectionHeading({ title, action, onClick }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-base font-extrabold text-[#252333] dark:text-white sm:text-lg">
        {title}
      </h2>

      {action && (
        <button
          type="button"
          onClick={onClick}
          className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF456C] transition hover:text-[#E51F50] sm:text-sm"
        >
          {action}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}

// ======================================================
// HERO BANNER
// ======================================================

function HeroBanner({ navigate }) {
  return (
    <section className="relative grid min-h-[260px] w-full grid-cols-1 overflow-hidden rounded-2xl border border-[#F1DDE2] bg-[#FFF3F5] dark:border-[#44313B] dark:bg-[#30232D] sm:min-h-[250px] md:h-[250px] md:min-h-0 md:grid-cols-[0.75fr_1.25fr]">

      {/* LEFT CONTENT */}

      <div className="relative z-10 flex min-w-0 flex-col items-start justify-center p-5 sm:p-6">

        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#FFD5DF] bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#E83E65] dark:border-[#63404C] dark:bg-[#211e27] dark:text-[#FF829B] sm:text-xs">
          <Sparkles size={14} />
          IELTS learning journey
        </div>

        <p className="text-sm text-[#777184] dark:text-[#B9B2C2]">
          Good morning,
        </p>

        <h1 className="mt-0.5 text-4xl font-black tracking-tight text-[#292331] dark:text-white sm:text-[42px]">
          Dinesh<span className="text-[#FF456C]">!</span>
        </h1>

        <p className="mt-2 max-w-[310px] text-xs leading-5 text-[#716A7B] dark:text-[#B9B2C2] sm:text-sm sm:leading-6">
          Improve your IELTS skills with focused practice and achieve
          your target band score.
        </p>

        <button
          type="button"
          onClick={() => navigate("/practice")}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#FF456C] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-200/40 transition hover:-translate-y-0.5 hover:bg-[#E92E59] dark:shadow-none"
        >
          Continue learning
          <ArrowRight size={16} />
        </button>
      </div>

      {/* RIGHT IMAGE */}

      <div className="relative hidden min-w-0 items-center justify-center overflow-hidden bg-[#F8EDEF] dark:bg-[#30232D] md:flex">

        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=95"
          alt="Students studying together in a professional learning environment"
          className="h-full w-full object-cover object-center"
        />

        <div className="pointer-events-none absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-[#FFF3F5] to-transparent dark:from-[#30232D]" />
      </div>
    </section>
  );
}

// ======================================================
// STUDY STREAK
// ======================================================

function StudyStreak() {
  return (
    <Panel>

      <div className="flex items-center justify-between gap-2">

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF456C] dark:bg-[#38202B]">
            <Flame size={22} />
          </div>

          <div>
            <h2 className="text-sm font-extrabold">
              Study streak
            </h2>

            <p className="mt-0.5 text-[11px] text-[#898394] dark:text-[#AAA5B4]">
              Your weekly activity
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-black text-[#FF456C]">7</p>
          <p className="text-[10px] text-[#898394] dark:text-[#AAA5B4]">
            Day streak
          </p>
        </div>
      </div>

      {/* WEEKLY ACTIVITY */}

      <div className="mt-5">

        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold">This week</p>

          <span className="text-xs font-bold text-[#20B989]">
            {completedDays}/7 days
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {weeklyActivity.map((item) => (
            <div
              key={item.day}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  item.completed
                    ? "bg-[#FF456C] text-white"
                    : "border border-[#E7E7ED] bg-[#F7F7FA] text-[#AAA5B4] dark:border-[#48434E] dark:bg-[#292530]"
                }`}
              >
                {item.completed ? (
                  <Check size={15} strokeWidth={2.5} />
                ) : (
                  "–"
                )}
              </div>

              <span className="text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* WEEKLY GOAL */}

      <div className="mt-5 rounded-xl border border-[#F0E2E6] bg-[#FFF8F9] p-3 dark:border-[#49333D] dark:bg-[#30232D]">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={17} className="text-[#FF456C]" />
            <span className="text-xs font-bold">Weekly goal</span>
          </div>

          <span className="text-xs font-extrabold text-[#FF456C]">
            {completedDays}/7
          </span>
        </div>

        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#F1DDE2] dark:bg-[#49333D]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF456C] to-[#FF829B]"
            style={{ width: `${(completedDays / 7) * 100}%` }}
          />
        </div>

        <p className="mt-2 text-[10px] text-[#777184] dark:text-[#C6B9C2]">
          {completedDays === 7
            ? "Excellent! You completed your weekly goal."
            : "Keep practising to complete your weekly goal."}
        </p>
      </div>

      {/* STREAK RECORDS */}

      <div className="mt-3 grid grid-cols-2 gap-3">

        <div className="rounded-xl bg-[#F7F7FA] p-3 dark:bg-[#292530]">
          <div className="flex items-center gap-1.5 text-[#FF456C]">
            <Flame size={15} />

            <span className="text-[10px] text-[#898394] dark:text-[#AAA5B4]">
              Current streak
            </span>
          </div>

          <p className="mt-1 text-base font-black">7 days</p>
        </div>

        <div className="rounded-xl bg-[#F7F7FA] p-3 dark:bg-[#292530]">
          <div className="flex items-center gap-1.5 text-[#E9A23B]">
            <Trophy size={15} />

            <span className="text-[10px] text-[#898394] dark:text-[#AAA5B4]">
              Best streak
            </span>
          </div>

          <p className="mt-1 text-base font-black">12 days</p>
        </div>
      </div>
    </Panel>
  );
}

// ======================================================
// PROGRESS PANEL
// ======================================================

function ProgressPanel({ navigate }) {
  return (
    <Panel>

      <div className="grid gap-5 md:grid-cols-[170px_minmax(0,1fr)]">

        {/* TARGET SCORE */}

        <div className="flex flex-col items-center justify-center border-b border-[#ECECF1] pb-5 dark:border-[#393440] md:border-b-0 md:border-r md:pb-0 md:pr-5">

          <h2 className="self-start text-sm font-extrabold">
            Your target band score
          </h2>

          <div className="relative mt-4 flex h-32 w-32 items-center justify-center">

            <svg
              viewBox="0 0 120 120"
              className="h-full w-full -rotate-90"
            >
              <circle
                cx="60"
                cy="60"
                r="49"
                fill="none"
                stroke="#E9E9EF"
                strokeWidth="10"
                className="dark:stroke-[#403B46]"
              />

              <circle
                cx="60"
                cy="60"
                r="49"
                fill="none"
                stroke="#FF456C"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="205 308"
              />
            </svg>

            <div className="absolute text-center">
              <p className="text-3xl font-black">6.5</p>

              <p className="mt-1 text-xs text-[#898394] dark:text-[#AAA5B4]">
                Target
              </p>
            </div>
          </div>
        </div>

        {/* SKILLS */}

        <div className="min-w-0">

          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold">
              Overall progress
            </h2>

            <span className="text-sm font-extrabold">42%</span>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#ECECF1] dark:bg-[#403B46]">
            <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-[#FF456C] to-[#FF829B]" />
          </div>

          <p className="mt-2 text-xs text-[#898394] dark:text-[#AAA5B4]">
            You are on track! Keep going.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#ECECF1] pt-4 dark:border-[#393440] sm:grid-cols-4">

            {skills.map((skill) => {
              const Icon = skill.icon;

              return (
                <button
                  key={skill.name}
                  type="button"
                  onClick={() => navigate(skill.path)}
                  className="min-w-0 rounded-lg p-2 text-left transition hover:bg-[#F8F7FA] dark:hover:bg-[#292530]"
                >

                  <div className="flex items-center gap-2">
                    <Icon
                      size={21}
                      className="shrink-0"
                      style={{ color: skill.color }}
                    />

                    <span className="truncate text-[11px] font-bold">
                      {skill.name}
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] text-[#898394] dark:text-[#AAA5B4]">
                    {skill.score}
                  </p>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#ECECF1] dark:bg-[#403B46]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${skill.percent}%`,
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
// PLAN CARD
// ======================================================

function PlanCard({ navigate }) {
  return (
    <Panel className="border-[#F5DCE2] bg-gradient-to-br from-white to-[#FFF3F5] dark:border-[#49333D] dark:from-[#211e27] dark:to-[#30232D]">

      <div className="flex items-center justify-between gap-2">

        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E2] text-[#E99A28] dark:bg-[#443329]">
            <Crown size={22} />
          </div>

          <h2 className="text-base font-extrabold">Your plan</h2>
        </div>

        <button
          type="button"
          onClick={() => navigate("/my-plan")}
          className="flex items-center gap-1 text-xs font-bold text-[#FF456C]"
        >
          View plan <ArrowRight size={15} />
        </button>
      </div>

      <h3 className="mt-4 text-xl font-extrabold">Free Plan</h3>

      <div className="mt-4 space-y-3">
        {[
          "2 full mock tests",
          "8 practice tests",
          "Study resources",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF456C] text-white">
              <Check size={13} />
            </span>

            <p className="text-xs text-[#777184] dark:text-[#C1BBC8]">
              {item}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => navigate("/my-plan")}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF456C] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#E92E59]"
      >
        Upgrade to Pro
        <ArrowRight size={17} />
      </button>
    </Panel>
  );
}

// ======================================================
// PRACTICE SECTION
// ======================================================

function PracticeSection({ navigate }) {
  return (
    <section>

      <SectionHeading
        title="Continue practising"
        action="View all"
        onClick={() => navigate("/practice")}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {practiceCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className="group overflow-hidden rounded-2xl border border-[#E8EAF0] bg-white p-2.5 shadow-[0_4px_20px_rgba(20,20,40,0.04)] transition hover:-translate-y-1 hover:shadow-lg dark:border-[#393440] dark:bg-[#211e27]"
            >

              <div className="relative h-40 overflow-hidden rounded-xl bg-[#F2F2F6] dark:bg-[#292530]">
                <img
                  src={card.image}
                  alt={`${card.title} practice`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute bottom-2 left-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white shadow-sm">
                  <Icon size={21} style={{ color: card.color }} />
                </div>
              </div>

              <div className="px-1.5 pb-1 pt-3">

                <h3 className="text-sm font-extrabold">
                  {card.title}
                </h3>

                <p className="mt-1 min-h-[36px] text-xs leading-5 text-[#898394] dark:text-[#AAA5B4]">
                  {card.subtitle}
                </p>

                <button
                  type="button"
                  onClick={() => navigate(card.path)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#FFD0DA] bg-[#FFF7F8] py-2.5 text-xs font-bold text-[#FF456C] transition hover:bg-[#FF456C] hover:text-white dark:border-[#61404B] dark:bg-[#38202B] dark:hover:bg-[#FF456C]"
                >
                  Continue
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
// RECENT TESTS
// ======================================================

function RecentTests({ navigate }) {
  return (
    <Panel>

      <SectionHeading
        title="Recent tests"
        action="View all"
        onClick={() => navigate("/progress")}
      />

      <div className="overflow-x-auto">

        <table className="w-full min-w-[570px] border-collapse text-left text-xs">

          <thead>
            <tr className="bg-[#F5F5F8] text-[#777184] dark:bg-[#292530] dark:text-[#B9B2C2]">
              <th className="rounded-l-lg px-3 py-3 font-bold">
                Test name
              </th>

              <th className="px-3 py-3 font-bold">Type</th>
              <th className="px-3 py-3 font-bold">Score</th>
              <th className="px-3 py-3 font-bold">Date</th>

              <th className="rounded-r-lg px-3 py-3 font-bold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {recentTests.map((test, index) => (
              <tr
                key={test.name}
                className="border-b border-[#ECECF1] last:border-0 dark:border-[#393440]"
              >
                <td className="px-3 py-4 font-semibold">
                  {test.name}
                </td>

                <td className="px-3 py-4 text-[#898394] dark:text-[#AAA5B4]">
                  {test.type}
                </td>

                <td className="px-3 py-4 font-bold">
                  {test.score}
                </td>

                <td className="px-3 py-4 text-[#898394] dark:text-[#AAA5B4]">
                  {test.date}
                </td>

                <td className="px-3 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        index === 2 ? "/ai-feedback" : "/progress"
                      )
                    }
                    className="whitespace-nowrap rounded-lg border border-[#FFD0DA] px-3 py-2 font-bold text-[#FF456C] transition hover:bg-[#FFF0F3] dark:border-[#61404B] dark:hover:bg-[#38202B]"
                  >
                    {index === 2 ? "Feedback" : "View result"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

// ======================================================
// STUDY RESOURCES
// ======================================================

function StudyResources({ navigate }) {
  return (
    <Panel>

      <SectionHeading
        title="Study resources"
        action="View all"
        onClick={() => navigate("/study-resources")}
      />

      <div className="space-y-1">
        {resources.map((resource) => {
          const Icon = resource.icon;

          return (
            <button
              key={resource.title}
              type="button"
              onClick={() => navigate("/study-resources")}
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#F7F7FA] dark:hover:bg-[#292530]"
            >

              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: resource.bg,
                  color: resource.color,
                }}
              >
                <Icon size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold">
                  {resource.title}
                </p>

                <p className="mt-1 text-[11px] text-[#898394] dark:text-[#AAA5B4]">
                  {resource.subtitle}
                </p>
              </div>

              <ChevronRight
                size={17}
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
        Explore resources
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
    <section className="rounded-2xl border border-[#E8EAF0] bg-gradient-to-r from-white to-[#FFF4F6] p-4 dark:border-[#393440] dark:from-[#211e27] dark:to-[#30232D]">

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF456C] dark:bg-[#38202B]">
          <TrendingUp size={22} />
        </div>

        <div>
          <h3 className="text-sm font-extrabold">Your next step</h3>

          <p className="mt-1 text-xs leading-5 text-[#898394] dark:text-[#AAA5B4]">
            Take a short practice test today and review your mistakes
            to improve your band score.
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

  return (
    <StudentLayout>
      <main className="mx-auto w-full max-w-[1800px] text-[#252333] dark:text-white">

        {/* TWO-COLUMN DASHBOARD */}

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,0.85fr)]">

          {/* LEFT COLUMN */}

          <div className="min-w-0 space-y-5">

            <HeroBanner navigate={navigate} />

            <ProgressPanel navigate={navigate} />

            <PracticeSection navigate={navigate} />

            <RecentTests navigate={navigate} />

          </div>

          {/* RIGHT COLUMN */}

          <div className="min-w-0 space-y-5">

            <StudyStreak />

            <PlanCard navigate={navigate} />

            <StudyResources navigate={navigate} />

            <NextStep navigate={navigate} />

          </div>

        </div>

        {/* FOOTER */}

        <footer className="mt-5 pb-2 text-center text-[11px] text-[#AAA5B4]">
          Equilx IELTS · Prepare with purpose
        </footer>

      </main>
    </StudentLayout>
  );
}
