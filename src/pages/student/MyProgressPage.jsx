import React, { useMemo, useState } from "react";
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
} from "lucide-react";
import StudentLayout from "./StudentLayout";

const skills = [
  {
    name: "Listening",
    score: 6.0,
    previous: 5.5,
    icon: Headphones,
    color: "#FF456C",
    bg: "bg-[#FFF0F3]",
  },
  {
    name: "Reading",
    score: 6.5,
    previous: 6.0,
    icon: BookOpen,
    color: "#873BFA",
    bg: "bg-[#F3EAFF]",
  },
  {
    name: "Writing",
    score: 6.0,
    previous: 5.5,
    icon: PenLine,
    color: "#1680E8",
    bg: "bg-[#EAF4FF]",
  },
  {
    name: "Speaking",
    score: 7.0,
    previous: 6.0,
    icon: Mic,
    color: "#00A879",
    bg: "bg-[#E5F9F1]",
  },
];

const tests = [
  {
    id: 1,
    name: "Cambridge 18 - Test 1",
    date: "20 Oct 2026",
    band: 6.5,
    listening: 6.0,
    reading: 6.5,
    writing: 6.0,
    speaking: 7.0,
  },
  {
    id: 2,
    name: "Cambridge 17 - Test 3",
    date: "15 Oct 2026",
    band: 6.0,
    listening: 5.5,
    reading: 6.0,
    writing: 6.0,
    speaking: 6.5,
  },
  {
    id: 3,
    name: "General IELTS - Test 2",
    date: "10 Oct 2026",
    band: 5.5,
    listening: 5.0,
    reading: 5.5,
    writing: 5.5,
    speaking: 6.0,
  },
  {
    id: 4,
    name: "Cambridge 16 - Test 4",
    date: "5 Oct 2026",
    band: 5.0,
    listening: 5.0,
    reading: 5.0,
    writing: 5.0,
    speaking: 5.5,
  },
];

const studyActivity = {
  "Last 7 days": [
    { day: "Mon", hours: 1.0 },
    { day: "Tue", hours: 2.0 },
    { day: "Wed", hours: 1.5 },
    { day: "Thu", hours: 2.0 },
    { day: "Fri", hours: 3.0 },
    { day: "Sat", hours: 4.5 },
    { day: "Sun", hours: 5.5 },
  ],
  "Last 30 days": [
    { day: "Week 1", hours: 10 },
    { day: "Week 2", hours: 13 },
    { day: "Week 3", hours: 16 },
    { day: "Week 4", hours: 20 },
  ],
  "Last 3 months": [
    { day: "Aug", hours: 28 },
    { day: "Sep", hours: 36 },
    { day: "Oct", hours: 42 },
  ],
};

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#E7ECF6] bg-white p-4 shadow-[0_3px_14px_rgba(16,38,95,0.035)] dark:border-[#49333D] dark:bg-[#211e27] sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
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

function BandRing({
  score,
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
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black tracking-tight text-[#10265F] dark:text-[#FFF8FA]">
          {score.toFixed(1)}
        </span>

        <span className="mt-1 text-center text-[10px] text-[#71809D] dark:text-[#BDB0BC]">
          {label}
        </span>
      </div>
    </div>
  );
}

function BandBadge({ score }) {
  let style = "bg-[#FFF0E1] text-[#D97706]";

  if (score >= 6.5) style = "bg-[#DDF8EE] text-[#008A60]";
  else if (score >= 6.0) style = "bg-[#E5F0FF] text-[#2466C2]";
  else if (score < 5.5) style = "bg-[#FFE8EE] text-[#E11D48]";

  return (
    <span
      className={`inline-flex min-w-10 justify-center rounded-lg px-2 py-1 text-[11px] font-extrabold ${style}`}
    >
      {score.toFixed(1)}
    </span>
  );
}

export default function MyProgressPage() {
  const navigate = useNavigate();

  const [period, setPeriod] = useState("Overview");
  const [activityPeriod, setActivityPeriod] = useState("Last 7 days");
  const [testFilter, setTestFilter] = useState("All tests");
  const [selectedTest, setSelectedTest] = useState(null);

  const filteredTests = useMemo(() => {
    if (testFilter === "Highest score") {
      return [...tests].sort((a, b) => b.band - a.band);
    }

    if (testFilter === "Oldest first") {
      return [...tests].reverse();
    }

    return tests;
  }, [testFilter]);

  const activity = studyActivity[activityPeriod];
  const maxActivity = Math.max(...activity.map((item) => item.hours), 1);

  const overallScore = 6.5;
  const targetScore = 7.5;
  const scoreDifference = targetScore - overallScore;

  const periodDescription =
    period === "Last 7 days"
      ? "Your progress over the last 7 days"
      : period === "Last 30 days"
        ? "Your progress over the last 30 days"
        : period === "Last 3 months"
          ? "Your progress over the last 3 months"
          : "Your overall IELTS performance";

  return (
    <StudentLayout>
      <div className="progress-page mx-auto max-w-[1800px] space-y-5 text-[#10265F] dark:text-[#FFF8FA]">
        <style>{`
          html.dark .progress-page {
            color: #FFF8FA !important;
          }

          html.dark .progress-page [class*="bg-white"] {
            background-color: #211e27 !important;
          }

          html.dark .progress-page [class*="bg-[#F4F7FD]"],
          html.dark .progress-page [class*="bg-[#F5F7FF]"],
          html.dark .progress-page [class*="bg-[#FAFBFF]"],
          html.dark .progress-page [class*="bg-[#FFF0F3]"],
          html.dark .progress-page [class*="bg-[#FFF5F7]"] {
            background-color: #30232B !important;
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
          html.dark .progress-page [class*="border-[#E2E8F5]"],
          html.dark .progress-page [class*="border-[#E8EDF7]"],
          html.dark .progress-page [class*="border-[#E6EBF5]"] {
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

          html.dark .progress-page svg circle[stroke="#E9EDF7"] {
            stroke: #49333D;
          }

          html.dark .progress-page svg line[stroke="#E6EBF5"] {
            stroke: #49333D;
          }

          html.dark .progress-page svg text[fill="#10265F"] {
            fill: #FFF8FA;
          }

          html.dark .progress-page svg text[fill="#71809D"] {
            fill: #BDB0BC;
          }

          html.dark .progress-modal-content {
            background-color: #211e27 !important;
            color: #FFF8FA !important;
            border: 1px solid #49333D;
          }

          html.dark .progress-modal-content [class*="text-[#10265F]"],
          html.dark .progress-modal-content [class*="text-[#506995]"] {
            color: #FFF8FA !important;
          }

          html.dark .progress-modal-content [class*="text-[#71809D]"] {
            color: #BDB0BC !important;
          }

          html.dark .progress-modal-content [class*="bg-white"],
          html.dark .progress-modal-content [class*="bg-[#F5F7FF]"] {
            background-color: #30232B !important;
          }

          html.dark .progress-modal-content [class*="border-[#E7ECF6]"],
          html.dark .progress-modal-content [class*="border-[#E2E8F5]"] {
            border-color: #49333D !important;
          }
        `}</style>

        {/* HERO */}
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
              See your performance, identify strengths and weaknesses, and keep
              improving.
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
              src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=900&q=85"
              alt="Books and study materials on a desk"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#F5F7FF] via-[#F5F7FF]/20 to-transparent dark:from-[#211B22] dark:via-[#211B22]/30" />

            <div className="absolute bottom-3 right-3 max-w-[200px] rounded-xl border border-white bg-white/95 p-3 shadow-md dark:border-[#49333D] dark:bg-[#211e27]/95">
              <p className="text-xs font-extrabold dark:text-[#FFF8FA]">
                Progress takes practice.
              </p>
              <p className="mt-1 text-[10px] leading-4 text-[#71809D] dark:text-[#BDB0BC]">
                Keep building your skills, one session at a time.
              </p>
            </div>
          </div>
        </section>

        <p className="text-xs text-[#71809D] dark:text-[#BDB0BC]">
          {periodDescription}
        </p>

        {/* SCORE OVERVIEW */}
        <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr_1fr]">
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

                <p className="mt-1 text-3xl font-black">{targetScore}</p>

                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#E9EDF7] dark:bg-[#49333D]">
                  <div
                    className="h-full rounded-full bg-[#FF456C]"
                    style={{
                      width: `${(overallScore / targetScore) * 100}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-[#71809D] dark:text-[#BDB0BC]">
                  You are {scoreDifference.toFixed(1)} band away from your
                  target.
                </p>

                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#DDF8EE] px-2.5 py-1.5 text-[11px] font-extrabold text-[#008A60]">
                  <TrendingUp size={13} /> +0.5 from last test
                </div>
              </div>
            </div>
          </Panel>

          <Panel>
            <SectionTitle
              title="Skill-wise Band Score"
              subtitle="Compare your four IELTS skills"
            />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
              {skills.map((skill) => {
                const Icon = skill.icon;

                return (
                  <div
                    key={skill.name}
                    className="rounded-xl border border-[#EDF0F8] p-3 text-center dark:border-[#49333D]"
                  >
                    <p className="text-xl font-black">
                      {skill.score.toFixed(1)}
                    </p>

                    <div className="mx-auto mt-2 flex h-14 items-end justify-center">
                      <div
                        className="w-8 rounded-t-md"
                        style={{
                          height: `${(skill.score / 9) * 54}px`,
                          backgroundColor: skill.color,
                          opacity: 0.75,
                        }}
                      />
                    </div>

                    <div
                      className="mx-auto mt-2 flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{
                        color: skill.color,
                        backgroundColor: `${skill.color}14`,
                      }}
                    >
                      <Icon size={19} />
                    </div>

                    <p className="mt-2 text-xs font-extrabold">
                      {skill.name}
                    </p>

                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#DDF8EE] px-2 py-1 text-[10px] font-bold text-[#008A60]">
                      <TrendingUp size={11} />
                      +{(skill.score - skill.previous).toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel>
            <SectionTitle
              title="Study Activity"
              subtitle="Hours spent learning"
              action={
                <div className="relative">
                  <select
                    value={activityPeriod}
                    onChange={(event) =>
                      setActivityPeriod(event.target.value)
                    }
                    className="appearance-none rounded-lg border border-[#E2E8F5] bg-white py-2 pl-3 pr-8 text-[11px] font-bold outline-none focus:border-[#FF8199] dark:border-[#49333D] dark:bg-[#30232B] dark:text-[#FFF8FA]"
                  >
                    {Object.keys(studyActivity).map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={13}
                    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                  />
                </div>
              }
            />

            <div className="flex h-[150px] items-end gap-2 border-b border-[#E8EDF7] px-1 pt-3 dark:border-[#49333D]">
              {activity.map((item) => (
                <div
                  key={item.day}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-[9px] font-bold text-[#71809D] dark:text-[#BDB0BC]">
                    {item.hours}
                  </span>

                  <div className="flex h-[105px] w-full items-end justify-center">
                    <div
                      className="w-full max-w-8 rounded-t-md bg-[#FF456C] transition-all duration-300"
                      style={{
                        height: `${(item.hours / maxActivity) * 100}%`,
                        minHeight: 5,
                        opacity: 0.85,
                      }}
                    />
                  </div>

                  <span className="text-[9px] text-[#71809D] dark:text-[#BDB0BC]">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#FFF0F3] p-3 dark:bg-[#30232B]">
                <div className="flex items-center gap-2 text-[#FF456C]">
                  <Clock size={16} />
                  <span className="text-[10px] font-bold">
                    Total study time
                  </span>
                </div>
                <p className="mt-1 text-lg font-black">6h 20m</p>
              </div>

              <div className="rounded-xl bg-[#FFF0F3] p-3 dark:bg-[#30232B]">
                <div className="flex items-center gap-2 text-[#FF456C]">
                  <Flame size={16} />
                  <span className="text-[10px] font-bold">Study streak</span>
                </div>
                <p className="mt-1 text-lg font-black">7 days</p>
              </div>
            </div>
          </Panel>
        </div>

        {/* BAND SCORE HISTORY + RECENT TESTS */}
        <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <Panel>
            <SectionTitle
              title="Band Score Progress"
              subtitle="Your improvement across mock tests"
            />

            <div className="relative mt-2">
              <div className="absolute inset-0 flex flex-col justify-between pb-7 pl-7">
                {[9, 8, 7, 6, 5, 4].map((number) => (
                  <div
                    key={number}
                    className="flex items-center gap-2 border-b border-dashed border-[#E6EBF5] dark:border-[#49333D]"
                  >
                    <span className="absolute left-0 -translate-y-1/2 text-[10px] text-[#71809D] dark:text-[#BDB0BC]">
                      {number}
                    </span>
                  </div>
                ))}
              </div>

              <svg
                viewBox="0 0 400 210"
                className="relative z-10 w-full overflow-visible"
                role="img"
                aria-label="Band score history line chart"
              >
                <defs>
                  <linearGradient
                    id="scoreFill"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#FF456C"
                      stopOpacity="0.17"
                    />
                    <stop
                      offset="100%"
                      stopColor="#FF456C"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {[25, 55, 85, 115, 145, 175].map((y) => (
                  <line
                    key={y}
                    x1="28"
                    y1={y}
                    x2="390"
                    y2={y}
                    stroke="#E6EBF5"
                    strokeDasharray="4 4"
                  />
                ))}

                {(() => {
                  const points = tests
                    .slice()
                    .reverse()
                    .map((test, index) => ({
                      x: 45 + index * 82,
                      y: 175 - ((test.band - 4) / 5) * 150,
                      score: test.band,
                      date: test.date.split(" ")[0],
                    }));

                  const linePoints = points
                    .map((point) => `${point.x},${point.y}`)
                    .join(" ");

                  const areaPoints = `45,175 ${linePoints} ${
                    points[points.length - 1].x
                  },175`;

                  return (
                    <>
                      <polygon
                        points={areaPoints}
                        fill="url(#scoreFill)"
                      />

                      <polyline
                        points={linePoints}
                        fill="none"
                        stroke="#FF456C"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />

                      {points.map((point) => (
                        <g key={point.date}>
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="4.5"
                            fill="#FF456C"
                            stroke="white"
                            strokeWidth="2"
                          />

                          <text
                            x={point.x}
                            y={point.y - 12}
                            textAnchor="middle"
                            fill="#10265F"
                            fontSize="12"
                            fontWeight="700"
                          >
                            {point.score.toFixed(1)}
                          </text>

                          <text
                            x={point.x}
                            y="198"
                            textAnchor="middle"
                            fill="#71809D"
                            fontSize="10"
                          >
                            {point.date} Oct
                          </text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>
          </Panel>

          <Panel>
            <SectionTitle
              title="Recent Mock Tests"
              subtitle="Review your recent test results"
              action={
                <button
                  type="button"
                  onClick={() => navigate("/mock-tests")}
                  className="flex items-center gap-1 text-xs font-bold text-[#FF456C]"
                >
                  View all <ArrowRight size={14} />
                </button>
              }
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

            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#F4F7FD] text-[11px] text-[#506995] dark:bg-[#30232B] dark:text-[#C1B5C0]">
                    <th className="rounded-l-lg px-3 py-3 font-extrabold">
                      Test name
                    </th>
                    <th className="px-3 py-3 font-extrabold">Date</th>
                    <th className="px-3 py-3 font-extrabold">
                      Overall band
                    </th>
                    <th className="px-3 py-3 font-extrabold">Skills</th>
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
                      <td className="px-3 py-3 font-bold">{test.name}</td>

                      <td className="whitespace-nowrap px-3 py-3 text-[#71809D] dark:text-[#BDB0BC]">
                        {test.date}
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
                          className="rounded-lg border border-[#FF9BAF] px-3 py-1.5 text-[11px] font-bold text-[#FF456C] hover:bg-[#FFF0F3] dark:border-[#71404D] dark:hover:bg-[#30232B]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {/* STRENGTHS + IMPROVEMENT + NEXT STEPS */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E5F9F1] text-[#00A879]">
                <Trophy size={19} />
              </span>
              <h3 className="text-sm font-extrabold">Strengths</h3>
            </div>

            <div className="space-y-3">
              {[
                "Speaking is your strongest skill (7.0)",
                "Good performance in Reading",
                "Consistent improvement in all skills",
                "Better time management in recent tests",
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
              <h3 className="text-sm font-extrabold">Areas to improve</h3>
            </div>

            <div className="space-y-3">
              {[
                "Listening accuracy (aim for 6.5+)",
                "Writing Task 2 structure and coherence",
                "Improve grammar and vocabulary range",
                "Practise more academic reading passages",
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
                  text: "Practise more Listening Section 3 questions",
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Mock tests completed",
              value: "4",
              detail: "Keep practising",
              icon: BarChart3,
              color: "#FF456C",
              bg: "bg-[#FFF0F3] dark:bg-[#49232F]",
            },
            {
              label: "Average band score",
              value: "5.8",
              detail: "Across recent tests",
              icon: Activity,
              color: "#873BFA",
              bg: "bg-[#F3EAFF] dark:bg-[#382747]",
            },
            {
              label: "Study streak",
              value: "7 days",
              detail: "Consistency matters",
              icon: Flame,
              color: "#D97706",
              bg: "bg-[#FFF4E5] dark:bg-[#443323]",
            },
            {
              label: "Target band score",
              value: "7.5",
              detail: "Keep moving forward",
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
                  <p className="mt-1 text-xl font-black">{item.value}</p>
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
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#081633]/60 p-4 backdrop-blur-sm"
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
            className="progress-modal-content my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl dark:bg-[#211e27] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FF456C]">
                  Mock test result
                </p>

                <h2
                  id="test-modal-title"
                  className="mt-2 text-xl font-black"
                >
                  {selectedTest.name}
                </h2>

                <p className="mt-1 text-xs text-[#71809D] dark:text-[#BDB0BC]">
                  {selectedTest.date}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTest(null)}
                className="rounded-xl border border-[#E2E8F5] px-3 py-2 text-xs font-bold text-[#506995] hover:bg-[#F5F7FF] dark:border-[#49333D] dark:text-[#C1B5C0] dark:hover:bg-[#30232B]"
              >
                Close
              </button>
            </div>

            <div className="mt-5 flex items-center gap-5 rounded-2xl bg-gradient-to-r from-[#FFF0F3] to-[#F5F7FF] p-4 dark:from-[#30232B] dark:to-[#30232B]">
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
                  {selectedTest.band.toFixed(1)}
                </p>

                <p className="mt-1 text-xs text-[#506995] dark:text-[#C1B5C0]">
                  Target: {targetScore.toFixed(1)}
                </p>
              </div>
            </div>

            <h3 className="mt-5 text-sm font-extrabold">
              Skill breakdown
            </h3>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {skills.map((skill) => {
                const Icon = skill.icon;
                const score = selectedTest[skill.name.toLowerCase()];

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
                        {score.toFixed(1)}
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
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF456C] py-3 text-sm font-bold text-white hover:bg-[#E81745]"
            >
              Go to mock tests <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}