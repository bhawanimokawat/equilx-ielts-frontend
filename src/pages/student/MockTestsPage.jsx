
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  FileText,
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  Clock,
  BarChart3,
  ArrowRight,
  ChevronDown,
  LockKeyhole,
  CheckCircle2,
  TrendingUp,
  CalendarDays,
  X,
  PlayCircle,
  Target,
  Sparkles,
} from "lucide-react";

import StudentLayout from "./StudentLayout";

// =====================================================
// SKILL TABS
// =====================================================

const skillTabs = [
  { name: "All Tests", icon: FileText },
  { name: "Listening", icon: Headphones },
  { name: "Reading", icon: BookOpen },
  { name: "Writing", icon: PenLine },
  { name: "Speaking", icon: Mic },
];

// =====================================================
// MOCK TEST DATA
// =====================================================

const mockTests = [
  {
    id: 1,
    title: "Cambridge IELTS 18 - Test 1",
    subtitle: "Official-style IELTS practice with all four sections.",
    category: "Cambridge IELTS",
    type: "Free",
    duration: "2 hours 45 mins",
    sections: 4,
    skill: "All Tests",
    popular: true,
    image:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    title: "Cambridge IELTS 17 - Test 2",
    subtitle: "Practise exam-style questions and improve your performance.",
    category: "Cambridge IELTS",
    type: "Pro",
    duration: "2 hours 45 mins",
    sections: 4,
    skill: "All Tests",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    title: "Cambridge IELTS 16 - Test 4",
    subtitle: "Build confidence with a complete timed mock test.",
    category: "Cambridge IELTS",
    type: "Pro",
    duration: "2 hours 45 mins",
    sections: 4,
    skill: "All Tests",
    image:
      "https://images.unsplash.com/photo-1453738773917-9c3eff1db985?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 4,
    title: "General IELTS - Full Mock Test",
    subtitle: "A complete practice test covering all four IELTS skills.",
    category: "General IELTS",
    type: "Free",
    duration: "2 hours 45 mins",
    sections: 4,
    skill: "All Tests",
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 5,
    title: "Academic IELTS - Mixed Test",
    subtitle: "Practise academic questions across multiple IELTS sections.",
    category: "Academic IELTS",
    type: "Pro",
    duration: "2 hours 45 mins",
    sections: 4,
    skill: "All Tests",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 6,
    title: "Listening Practice - Full Test",
    subtitle: "Train your listening accuracy with four question sections.",
    category: "Skill Practice",
    type: "Free",
    duration: "30 mins",
    sections: 4,
    skill: "Listening",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 7,
    title: "Academic Reading - Full Test",
    subtitle: "Practise reading passages and question-solving techniques.",
    category: "Skill Practice",
    type: "Pro",
    duration: "60 mins",
    sections: 3,
    skill: "Reading",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 8,
    title: "Writing Task 1 & Task 2",
    subtitle: "Practise report writing and essay responses under time limits.",
    category: "Skill Practice",
    type: "Free",
    duration: "60 mins",
    sections: 2,
    skill: "Writing",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 9,
    title: "Speaking Interview Practice",
    subtitle: "Practise Part 1, cue cards and discussion questions.",
    category: "Skill Practice",
    type: "Pro",
    duration: "15 mins",
    sections: 3,
    skill: "Speaking",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=85",
  },
];

// =====================================================
// RECENT TESTS
// =====================================================

const recentTests = [
  {
    title: "Cambridge IELTS 18 - Test 1",
    date: "20 Oct 2026",
    score: "6.5",
  },
  {
    title: "Cambridge IELTS 17 - Test 3",
    date: "15 Oct 2026",
    score: "6.0",
  },
  {
    title: "General IELTS - Test 2",
    date: "10 Oct 2026",
    score: "7.0",
  },
];

const categories = [
  "All",
  "Cambridge IELTS",
  "Recent Tests",
  "Topic-wise",
  "Free Tests",
  "Premium Tests",
];

// =====================================================
// COMMON PANEL
// =====================================================

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#E8EAF0] bg-white p-4 text-[#252333] shadow-[0_3px_14px_rgba(20,20,40,0.035)] transition-colors dark:border-[#393440] dark:bg-[#211e27] dark:text-white sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function MockTestsPage() {
  const navigate = useNavigate();

  const [activeSkill, setActiveSkill] = useState("All Tests");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Latest");
  const [selectedTest, setSelectedTest] = useState(null);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // =====================================================
  // FILTER TESTS
  // =====================================================

  const filteredTests = useMemo(() => {
    let result = mockTests.filter((test) => {
      const matchesSkill =
        activeSkill === "All Tests" ||
        test.skill === activeSkill ||
        (activeSkill !== "All Tests" && test.skill === "All Tests");

      const matchesSearch =
        test.title.toLowerCase().includes(search.toLowerCase()) ||
        test.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        test.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        (activeCategory === "Cambridge IELTS" &&
          test.category === "Cambridge IELTS") ||
        (activeCategory === "Recent Tests" &&
          [1, 2, 4].includes(test.id)) ||
        (activeCategory === "Topic-wise" &&
          test.category === "Skill Practice") ||
        (activeCategory === "Free Tests" && test.type === "Free") ||
        (activeCategory === "Premium Tests" && test.type === "Pro");

      return matchesSkill && matchesSearch && matchesCategory;
    });

    if (sortBy === "A-Z") {
      result = [...result].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    return result;
  }, [activeSkill, activeCategory, search, sortBy]);

  // =====================================================
  // START TEST
  // =====================================================

  const startTest = (test) => {
    if (test.type === "Pro") {
      setSelectedTest(null);
      setShowUpgradeModal(true);
      return;
    }

    setSelectedTest(test);
  };

  // =====================================================
  // CONTINUE TEST
  // =====================================================

  const continueTest = () => {
    if (!selectedTest) return;

    if (selectedTest.skill === "Writing") {
      navigate("/ai-feedback");
    } else if (selectedTest.skill === "Speaking") {
      navigate("/live-speaking");
    } else {
      navigate("/practice");
    }

    setSelectedTest(null);
  };

  const visibleRecentTests = showAllRecent
    ? [...recentTests, ...recentTests]
    : recentTests;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <StudentLayout>
      <div className="mock-tests-page mx-auto w-full max-w-[1800px] space-y-5 text-[#252333] dark:text-white">

        {/* HERO SECTION */}

        <section className="relative grid min-h-[220px] overflow-hidden rounded-2xl border border-[#F1DDE2] bg-gradient-to-r from-[#FFF5F7] via-white to-[#FFF0F3] dark:border-[#49333D] dark:from-[#30232D] dark:via-[#211e27] dark:to-[#30232D] lg:grid-cols-[minmax(0,1fr)_310px]">

          <div className="relative z-10 p-5 sm:p-7">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF456C]">
              Mock tests
            </p>

            <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              Full-length IELTS{" "}
              <span className="text-[#FF456C]">mock tests</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#716A7B] dark:text-[#B9B2C2] sm:text-base">
              Experience exam-style practice and track your band score.
            </p>

            <div className="mt-5 grid max-w-xl grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF0F3] text-[#FF456C] dark:bg-[#38202B]">
                  <FileText size={18} />
                </span>

                <div>
                  <p className="text-[11px] font-extrabold">Exam format</p>
                  <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                    4 sections
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4ECFF] text-[#873BFA] dark:bg-[#30243E]">
                  <Clock size={18} />
                </span>

                <div>
                  <p className="text-[11px] font-extrabold">Timed tests</p>
                  <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                    Real practice
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5F9F1] text-[#00A879] dark:bg-[#203B33]">
                  <BarChart3 size={18} />
                </span>

                <div>
                  <p className="text-[11px] font-extrabold">Analysis</p>
                  <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                    Track scores
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden min-h-[220px] overflow-hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1800&q=90"
              alt="Books and study materials in a library"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF5F7] via-[#FFF5F7]/25 to-transparent dark:from-[#30232D] dark:via-[#30232D]/20" />

            <div className="absolute bottom-4 right-4 rounded-xl border border-white/80 bg-white/95 p-3 shadow-lg dark:border-[#49333D] dark:bg-[#211e27]">
              <p className="text-xs font-extrabold text-[#252333] dark:text-white">
                Prepare with purpose
              </p>
              <p className="mt-1 text-[10px] text-[#777184] dark:text-[#AAA5B4]">
                Practice. Review. Improve.
              </p>
            </div>
          </div>
        </section>

        {/* MAIN GRID */}

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">

          <div className="min-w-0 space-y-4">

            {/* SKILL TABS */}

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {skillTabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeSkill === tab.name;

                return (
                  <button
                    key={tab.name}
                    type="button"
                    onClick={() => setActiveSkill(tab.name)}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold transition ${
                      active
                        ? "border-[#FF456C] bg-[#FF456C] text-white shadow-sm"
                        : "border-[#E8EAF0] bg-white text-[#716A7B] hover:border-[#FF9BAF] hover:text-[#FF456C] dark:border-[#393440] dark:bg-[#211e27] dark:text-[#C6C0CD] dark:hover:border-[#75404F]"
                    }`}
                  >
                    <Icon size={17} />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* SEARCH AND CATEGORIES */}

            <Panel className="space-y-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8493]"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search mock tests, topics, questions..."
                  className="w-full rounded-xl border border-[#E8EAF0] bg-[#FAFAFC] py-3 pl-11 pr-4 text-sm text-[#252333] outline-none transition placeholder:text-[#AAA5B4] focus:border-[#FF8199] focus:bg-white dark:border-[#393440] dark:bg-[#292530] dark:text-white dark:placeholder:text-[#898394] dark:focus:bg-[#30232D]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full border px-3.5 py-2 text-[11px] font-semibold transition ${
                      activeCategory === category
                        ? "border-[#FF456C] bg-[#FF456C] text-white"
                        : "border-[#E8EAF0] bg-white text-[#716A7B] hover:border-[#FF9BAF] dark:border-[#393440] dark:bg-[#211e27] dark:text-[#C6C0CD] dark:hover:border-[#75404F]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ECECF1] pt-4 dark:border-[#393440]">
                <p className="text-xs text-[#777184] dark:text-[#AAA5B4]">
                  Showing{" "}
                  <span className="font-extrabold text-[#252333] dark:text-white">
                    {filteredTests.length}
                  </span>{" "}
                  mock tests
                </p>

                <label className="flex items-center gap-2 text-xs text-[#716A7B] dark:text-[#C6C0CD]">
                  Sort by:

                  <span className="relative">
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                      className="appearance-none rounded-lg border border-[#E8EAF0] bg-white py-2 pl-3 pr-8 text-xs font-semibold text-[#252333] outline-none focus:border-[#FF8199] dark:border-[#393440] dark:bg-[#292530] dark:text-white"
                    >
                      <option value="Latest">Latest</option>
                      <option value="A-Z">Name A-Z</option>
                    </select>

                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                    />
                  </span>
                </label>
              </div>
            </Panel>

            {/* TEST CARDS */}

            <div className="space-y-3">
              {filteredTests.map((test) => (
                <article
                  key={test.id}
                  className="group grid gap-4 rounded-2xl border border-[#E8EAF0] bg-white p-3 text-[#252333] shadow-[0_3px_14px_rgba(20,20,40,0.025)] transition hover:border-[#FFB4C2] hover:shadow-md dark:border-[#393440] dark:bg-[#211e27] dark:text-white dark:hover:border-[#75404F] sm:grid-cols-[155px_minmax(0,1fr)] sm:p-4 lg:grid-cols-[165px_minmax(0,1fr)_150px]"
                >
                  <div className="relative h-36 overflow-hidden rounded-xl bg-[#F2F2F6] dark:bg-[#292530] sm:h-full sm:min-h-[135px]">
                    <img
                      src={test.image}
                      alt={test.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                        {test.category}
                      </p>

                      <p className="mt-1 text-sm font-black text-white">
                        {test.skill === "All Tests" ? "IELTS Test" : test.skill}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-extrabold leading-5">
                        {test.title}
                      </h3>

                      {test.popular && (
                        <span className="rounded-full bg-[#FFF0F3] px-2 py-1 text-[10px] font-extrabold text-[#FF456C] dark:bg-[#38202B]">
                          ★ Most Popular
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-xs leading-5 text-[#777184] dark:text-[#AAA5B4]">
                      {test.subtitle}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#716A7B] dark:text-[#C6C0CD]">
                      <span className="flex items-center gap-1.5">
                        <FileText size={14} />
                        {test.sections} Sections
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {test.duration}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <BarChart3 size={14} />
                        Exam-style format
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-between gap-3 border-t border-[#ECECF1] pt-3 dark:border-[#393440] sm:col-span-2 lg:col-span-1 lg:flex-col lg:items-stretch lg:justify-center lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                    <span
                      className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-extrabold ${
                        test.type === "Free"
                          ? "bg-[#E5F9F1] text-[#009A69] dark:bg-[#203B33]"
                          : "bg-[#FFF4E5] text-[#D97706] dark:bg-[#3B3020]"
                      }`}
                    >
                      {test.type === "Pro" ? (
                        <LockKeyhole size={13} />
                      ) : (
                        <CheckCircle2 size={13} />
                      )}
                      {test.type}
                    </span>

                    <button
                      type="button"
                      onClick={() => startTest(test)}
                      className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold transition lg:w-full ${
                        test.type === "Free"
                          ? "bg-[#FF456C] text-white hover:bg-[#E92E59]"
                          : "border border-[#FF9BAF] bg-white text-[#FF456C] hover:bg-[#FFF0F3] dark:border-[#75404F] dark:bg-[#292530] dark:text-[#FF829B] dark:hover:bg-[#38202B]"
                      }`}
                    >
                      {test.type === "Free" ? (
                        <>
                          Start test <ArrowRight size={15} />
                        </>
                      ) : (
                        <>
                          <LockKeyhole size={14} />
                          Upgrade to unlock
                        </>
                      )}
                    </button>
                  </div>
                </article>
              ))}

              {/* EMPTY STATE */}

              {filteredTests.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#DCE0E9] bg-white px-5 py-14 text-center dark:border-[#48434E] dark:bg-[#211e27]">
                  <Search
                    size={28}
                    className="mx-auto text-[#8A8493]"
                  />

                  <h3 className="mt-3 text-base font-extrabold">
                    No mock tests found
                  </h3>

                  <p className="mt-2 text-sm text-[#777184] dark:text-[#AAA5B4]">
                    Try changing your search or selected category.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setActiveSkill("All Tests");
                      setActiveCategory("All");
                    }}
                    className="mt-4 rounded-xl bg-[#FF456C] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#E92E59]"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}

          <aside className="space-y-4">

            {/* PROGRESS PANEL */}

            <Panel>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold">
                  Your mock test progress
                </h3>

                <button
                  type="button"
                  onClick={() => navigate("/progress")}
                  className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF456C]"
                >
                  View all <ArrowRight size={14} />
                </button>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
                  <svg viewBox="0 0 120 120" className="-rotate-90">
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke="#E9E9EF"
                      strokeWidth="10"
                      className="dark:stroke-[#403B46]"
                    />

                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke="#FF456C"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray="120 302"
                    />
                  </svg>

                  <div className="absolute text-center">
                    <p className="text-2xl font-black">2/5</p>
                    <p className="text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                      Completed
                    </p>
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  {[
                    { label: "Completed", count: "2", color: "#00A879" },
                    { label: "In progress", count: "0", color: "#FF456C" },
                    { label: "Not attempted", count: "3", color: "#96909F" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="flex items-center gap-2 text-[#777184] dark:text-[#C6C0CD]">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.label}
                      </span>

                      <span className="font-extrabold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            {/* LATEST BAND SCORE */}

            <Panel className="border-[#F1DDE2] bg-gradient-to-br from-white to-[#FFF6F8] dark:border-[#49333D] dark:from-[#211e27] dark:to-[#30232D]">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF456C] dark:bg-[#38202B]">
                    <BarChart3 size={20} />
                  </span>

                  <h3 className="text-sm font-extrabold">
                    Your latest band score
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/progress")}
                  aria-label="View score details"
                  className="text-[#FF456C]"
                >
                  <ArrowRight size={17} />
                </button>
              </div>

              <div className="mt-4 rounded-xl bg-white/80 p-4 dark:bg-[#292530]">
                <p className="text-xs text-[#777184] dark:text-[#AAA5B4]">
                  Overall Band
                </p>

                <div className="mt-1 flex items-end justify-between">
                  <p className="text-3xl font-black">6.5</p>
                  <TrendingUp size={25} className="text-[#FF456C]" />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  { label: "Listening", score: "6.0", icon: Headphones },
                  { label: "Reading", score: "6.5", icon: BookOpen },
                  { label: "Writing", score: "6.0", icon: PenLine },
                  { label: "Speaking", score: "7.0", icon: Mic },
                ].map((skill) => {
                  const Icon = skill.icon;

                  return (
                    <div
                      key={skill.label}
                      className="rounded-xl border border-[#E8EAF0] bg-white/90 p-3 dark:border-[#393440] dark:bg-[#292530]"
                    >
                      <p className="text-[10px] font-bold text-[#777184] dark:text-[#AAA5B4]">
                        {skill.label}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <Icon size={15} className="text-[#FF456C]" />
                        <span className="text-sm font-extrabold">
                          {skill.score}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>

            {/* RECENT MOCK TESTS */}

            <Panel>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold">
                  Recent mock tests
                </h3>

                <button
                  type="button"
                  onClick={() => setShowAllRecent((value) => !value)}
                  className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF456C]"
                >
                  {showAllRecent ? "Show less" : "View all"}
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="mt-3 space-y-3">
                {visibleRecentTests.map((test, index) => (
                  <div
                    key={`${test.title}-${index}`}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4ECFF] text-[#873BFA] dark:bg-[#30243E]">
                      <FileText size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold">
                        {test.title}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-[10px] text-[#777184] dark:text-[#AAA5B4]">
                        <CalendarDays size={12} />
                        {test.date}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1.5 text-xs font-extrabold ${
                        Number(test.score) >= 6.5
                          ? "bg-[#E5F9F1] text-[#009A69] dark:bg-[#203B33]"
                          : "bg-[#FFF4E5] text-[#D97706] dark:bg-[#3B3020]"
                      }`}
                    >
                      {test.score}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>

            {/* UPGRADE CTA */}

            <div className="overflow-hidden rounded-2xl border border-[#E8EAF0] bg-gradient-to-br from-white to-[#F4ECFF] p-5 dark:border-[#393440] dark:from-[#211e27] dark:to-[#30243E]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#873BFA] shadow-sm dark:bg-[#382B47]">
                <Sparkles size={21} />
              </div>

              <h3 className="mt-4 text-base font-extrabold">
                Need more mock tests?
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#716A7B] dark:text-[#C6C0CD]">
                Explore premium practice and detailed performance analysis.
              </p>

              <button
                type="button"
                onClick={() => setShowUpgradeModal(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF456C] py-3 text-xs font-bold text-white transition hover:bg-[#E92E59]"
              >
                Explore plans <ArrowRight size={15} />
              </button>
            </div>
          </aside>
        </div>

        <p className="pb-2 text-center text-[11px] text-[#96909F] dark:text-[#777184]">
          Equilx IELTS · Prepare with purpose
        </p>
      </div>

      {/* FREE TEST DETAILS MODAL */}

      {selectedTest && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedTest(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mock-test-title"
            className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#E8EAF0] bg-white text-[#252333] shadow-2xl dark:border-[#393440] dark:bg-[#211e27] dark:text-white"
          >
            <div className="relative h-48 bg-[#F2F2F6] dark:bg-[#292530]">
              <img
                src={selectedTest.image}
                alt={selectedTest.title}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedTest(null)}
                aria-label="Close test details"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#252333] shadow-md"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-4 left-5 right-5">
                <span className="rounded-md bg-[#E5F9F1] px-2.5 py-1 text-[10px] font-extrabold text-[#009A69]">
                  FREE TEST
                </span>

                <h2
                  id="mock-test-title"
                  className="mt-2 text-xl font-black text-white"
                >
                  {selectedTest.title}
                </h2>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-sm leading-6 text-[#777184] dark:text-[#C6C0CD]">
                {selectedTest.subtitle}
              </p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-[#F6F6F9] p-3 text-center dark:bg-[#292530]">
                  <FileText size={19} className="mx-auto text-[#FF456C]" />
                  <p className="mt-2 text-sm font-extrabold">
                    {selectedTest.sections}
                  </p>
                  <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                    Sections
                  </p>
                </div>

                <div className="rounded-xl bg-[#F6F6F9] p-3 text-center dark:bg-[#292530]">
                  <Clock size={19} className="mx-auto text-[#873BFA]" />
                  <p className="mt-2 text-xs font-extrabold">
                    {selectedTest.duration}
                  </p>
                  <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                    Duration
                  </p>
                </div>

                <div className="rounded-xl bg-[#F6F6F9] p-3 text-center dark:bg-[#292530]">
                  <Target size={19} className="mx-auto text-[#00A879]" />
                  <p className="mt-2 text-sm font-extrabold">Free</p>
                  <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                    Access
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[#F1DDE2] bg-[#FFF5F7] p-3 text-xs leading-5 text-[#716A7B] dark:border-[#49333D] dark:bg-[#30232D] dark:text-[#C6C0CD]">
                <p className="font-extrabold text-[#252333] dark:text-white">
                  Before you begin
                </p>

                <p className="mt-1">
                  Find a quiet place and keep enough time to complete your practice.
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setSelectedTest(null)}
                  className="flex-1 rounded-xl border border-[#E8EAF0] px-4 py-3 text-sm font-bold text-[#716A7B] transition hover:bg-[#F6F6F9] dark:border-[#393440] dark:text-[#C6C0CD] dark:hover:bg-[#292530]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={continueTest}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF456C] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#E92E59]"
                >
                  Continue <PlayCircle size={18} />
                </button>
              </div>

              <p className="mt-3 text-center text-[10px] leading-4 text-[#96909F] dark:text-[#777184]">
                Demo interface: the complete timed test and score calculation need backend integration.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* UPGRADE MODAL */}

      {showUpgradeModal && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowUpgradeModal(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="upgrade-title"
            className="relative w-full max-w-md rounded-2xl border border-[#F1DDE2] bg-white p-6 text-[#252333] shadow-2xl dark:border-[#49333D] dark:bg-[#211e27] dark:text-white"
          >
            <button
              type="button"
              onClick={() => setShowUpgradeModal(false)}
              aria-label="Close upgrade dialog"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F6F9] text-[#716A7B] transition hover:bg-[#FFF0F3] dark:bg-[#292530] dark:text-[#C6C0CD] dark:hover:bg-[#38202B]"
            >
              <X size={18} />
            </button>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#FF456C] dark:bg-[#38202B]">
              <Sparkles size={28} />
            </div>

            <h2 id="upgrade-title" className="mt-5 text-2xl font-black">
              Unlock more practice
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#777184] dark:text-[#C6C0CD]">
              Premium tests are shown as locked demo content. Connect your subscription and payment flow to unlock real paid tests.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Access to premium mock tests",
                "Detailed skill-wise performance analysis",
                "Track your progress over time",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <CheckCircle2
                    size={17}
                    className="shrink-0 text-[#00A879]"
                  />
                  <span className="text-sm text-[#716A7B] dark:text-[#C6C0CD]">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowUpgradeModal(false);
                navigate("/my-plan");
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF456C] py-3.5 text-sm font-bold text-white transition hover:bg-[#E92E59]"
            >
              View plans <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
