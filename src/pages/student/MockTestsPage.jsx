
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  LoaderCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import StudentLayout from "./StudentLayout";
import mockService from "../../services/mockService";

// =====================================================
// CONSTANTS
// =====================================================

const skillTabs = [
  { name: "All Tests", icon: FileText },
  { name: "Listening", icon: Headphones },
  { name: "Reading", icon: BookOpen },
  { name: "Writing", icon: PenLine },
  { name: "Speaking", icon: Mic },
];

// Original card images - preserved
const cardImages = [
  "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1453738773917-9c3eff1db985?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=85",
];

// Original permanent hero image - unchanged
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1800&q=90";

const categories = [
  "All",
  "Cambridge IELTS",
  "Academic IELTS",
  "General Training",
  "Recent Tests",
];

const getData = (response) => response?.data ?? response ?? {};

const getTestTitle = (test) => {
  if (!test) return "IELTS Mock Test";

  if (test.book?.title && test.testNumber) {
    return `${test.book.title} - Test ${test.testNumber}`;
  }

  return test.title || test.book?.title || "IELTS Mock Test";
};

const getDuration = (modules = []) => {
  const seconds = modules.reduce(
    (total, module) => total + (module.durationSeconds || 0),
    0
  );

  if (!seconds) return "Duration not specified";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours && minutes) return `${hours} hours ${minutes} mins`;
  if (hours) return `${hours} hours`;
  return `${minutes} mins`;
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Date unavailable";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatus = (status) => {
  const statuses = {
    IN_PROGRESS: "In progress",
    SUBMITTED: "Submitted",
    EVALUATED: "Completed",
    COMPLETED: "Completed",
    EXPIRED: "Expired",
  };

  return statuses[status] || status || "Unknown";
};

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

  // API states
  const [tests, setTests] = useState([]);
  const [recentTests, setRecentTests] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");

  // Filter states
  const [activeSkill, setActiveSkill] = useState("All Tests");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Latest");
  const [page, setPage] = useState(1);
  const [showAllRecent, setShowAllRecent] = useState(false);

  // Modal states
  const [selectedTest, setSelectedTest] = useState(null);
  const [testDetails, setTestDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState("");
  const [startedAttempt, setStartedAttempt] = useState(null);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // =====================================================
  // API: FETCH MOCK TESTS
  // =====================================================

  const fetchTests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await mockService.getTests(page, 10);
      const data = getData(response);

      setTests(Array.isArray(data.items) ? data.items : []);

      setPagination(
        data.pagination || {
          page,
          limit: 10,
          total: 0,
          totalPages: 0,
        }
      );
    } catch (err) {
      setError(err.message || "Unable to load mock tests.");
      setTests([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  // =====================================================
  // API: FETCH MOCK HISTORY
  // =====================================================

  const fetchHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      setHistoryError("");

      const response = await mockService.getHistory(1, 50);
      const data = getData(response);

      setRecentTests(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      setHistoryError(err.message || "Unable to load mock history.");
      setRecentTests([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // =====================================================
  // MAP BACKEND DATA TO EXISTING CARD DESIGN
  // =====================================================

  const mappedTests = useMemo(() => {
    return tests.map((test, index) => {
      const categoryName =
        test.category === "ACADEMIC"
          ? "Academic IELTS"
          : test.category === "GENERAL_TRAINING"
            ? "General Training"
            : "IELTS Mock Test";

      return {
        ...test,
        title: getTestTitle(test),
        subtitle: `Complete IELTS ${categoryName} mock test with all four sections.`,
        category: categoryName,
        type: "Published",
        duration: "Full-length mock test",
        sections: 4,
        skill: "All Tests",
        image: cardImages[index % cardImages.length],
        popular: false,
      };
    });
  }, [tests]);

  // =====================================================
  // FILTER AND SORT
  // =====================================================

  const filteredTests = useMemo(() => {
    let result = [...mappedTests];

    if (search.trim()) {
      const term = search.toLowerCase();

      result = result.filter((test) =>
        [
          test.title,
          test.subtitle,
          test.category,
          test.book?.title,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term))
      );
    }

    if (activeCategory === "Cambridge IELTS") {
      result = result.filter((test) => Boolean(test.book?.title));
    }

    if (activeCategory === "Academic IELTS") {
      result = result.filter(
        (test) => test.category === "Academic IELTS"
      );
    }

    if (activeCategory === "General Training") {
      result = result.filter(
        (test) => test.category === "General Training"
      );
    }

    if (activeCategory === "Recent Tests") {
      const recentIds = new Set(
        recentTests.map((item) => item.testVersion?.test?.id)
      );

      result = result.filter((test) => recentIds.has(test.id));
    }

    // The mock list endpoint returns full tests, not separate skill tests.
    // All four skills are included in each full mock test.
    if (activeSkill !== "All Tests") {
      result = [];
    }

    if (sortBy === "A-Z") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortBy === "Latest") {
      result.sort((a, b) => {
        const dateA = new Date(
          a.publishedVersion?.publishedAt || 0
        ).getTime();

        const dateB = new Date(
          b.publishedVersion?.publishedAt || 0
        ).getTime();

        return dateB - dateA;
      });
    }

    return result;
  }, [
    mappedTests,
    search,
    activeCategory,
    activeSkill,
    sortBy,
    recentTests,
  ]);

  // =====================================================
  // API: OPEN TEST DETAILS
  // =====================================================

  const openTestDetails = async (test) => {
    setSelectedTest(test);
    setTestDetails(null);
    setDetailsError("");
    setStartError("");
    setStartedAttempt(null);

    try {
      setDetailsLoading(true);

      const response = await mockService.getTestDetails(test.id);
      const data = getData(response);

      setTestDetails(data);
    } catch (err) {
      setDetailsError(err.message || "Unable to load test details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  // =====================================================
  // API: START MOCK TEST
  // =====================================================

  const continueTest = async () => {
    if (!testDetails) return;

    const versionId = testDetails.publishedVersion?.id;

    if (!versionId) {
      setStartError("Published test version is not available.");
      return;
    }

    try {
      setStarting(true);
      setStartError("");

      const response = await mockService.startTest(versionId);
      const data = getData(response);

      if (!data.id) {
        throw new Error("Attempt ID was not returned by the server.");
      }

      setStartedAttempt(data);

      // Refresh history after creating an attempt
      fetchHistory();
    } catch (err) {
      setStartError(err.message || "Unable to start mock test.");
    } finally {
      setStarting(false);
    }
  };

  const closeTestModal = () => {
    if (starting) return;

    setSelectedTest(null);
    setTestDetails(null);
    setDetailsError("");
    setStartError("");
    setStartedAttempt(null);
  };

  // =====================================================
  // PROGRESS FROM ACTUAL HISTORY
  // =====================================================

  const completedTests = recentTests.filter((test) =>
    ["SUBMITTED", "EVALUATED", "COMPLETED"].includes(test.status)
  );

  const inProgressTests = recentTests.filter(
    (test) => test.status === "IN_PROGRESS"
  );

  const latestScore = recentTests.find(
    (test) => test.mockScore?.overallBand != null
  );

  const latestBand = latestScore?.mockScore?.overallBand;

  const completedCount = completedTests.length;
  const inProgressCount = inProgressTests.length;
  const totalAttempts = recentTests.length;

  const visibleRecentTests = showAllRecent
    ? recentTests
    : recentTests.slice(0, 3);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <StudentLayout>
      <div className="mock-tests-page mx-auto w-full max-w-[1800px] space-y-5 text-[#252333] dark:text-white">

        {/* HERO SECTION - ORIGINAL IMAGE PRESERVED */}

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
              src={HERO_IMAGE}
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
              {loading ? (
                <Panel className="flex flex-col items-center py-14">
                  <LoaderCircle
                    size={30}
                    className="animate-spin text-[#FF456C]"
                  />
                  <p className="mt-3 text-sm font-bold">
                    Loading mock tests...
                  </p>
                </Panel>
              ) : error ? (
                <Panel className="py-10 text-center">
                  <AlertCircle
                    size={28}
                    className="mx-auto text-red-500"
                  />
                  <h3 className="mt-3 text-base font-extrabold">
                    Unable to load mock tests
                  </h3>
                  <p className="mt-2 text-sm text-[#777184]">
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={fetchTests}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#FF456C] px-5 py-2.5 text-xs font-bold text-white"
                  >
                    <RefreshCw size={14} />
                    Try again
                  </button>
                </Panel>
              ) : (
                <>
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
                            IELTS Test
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-extrabold leading-5">
                            {test.title}
                          </h3>

                          <span className="rounded-full bg-[#E5F9F1] px-2 py-1 text-[10px] font-extrabold text-[#009A69] dark:bg-[#203B33]">
                            Published
                          </span>
                        </div>

                        <p className="mt-2 text-xs leading-5 text-[#777184] dark:text-[#AAA5B4]">
                          {test.subtitle}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#716A7B] dark:text-[#C6C0CD]">
                          <span className="flex items-center gap-1.5">
                            <FileText size={14} />
                            4 Sections
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            Full-length test
                          </span>

                          <span className="flex items-center gap-1.5">
                            <BarChart3 size={14} />
                            Exam-style format
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-row items-center justify-between gap-3 border-t border-[#ECECF1] pt-3 dark:border-[#393440] sm:col-span-2 lg:col-span-1 lg:flex-col lg:items-stretch lg:justify-center lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                        <span className="flex w-fit items-center gap-1.5 rounded-full bg-[#E5F9F1] px-3 py-1.5 text-[11px] font-extrabold text-[#009A69] dark:bg-[#203B33]">
                          <CheckCircle2 size={13} />
                          Published
                        </span>

                        <button
                          type="button"
                          onClick={() => openTestDetails(test)}
                          className="flex items-center justify-center gap-2 rounded-xl bg-[#FF456C] px-3 py-3 text-xs font-bold text-white transition hover:bg-[#E92E59] lg:w-full"
                        >
                          View test <ArrowRight size={15} />
                        </button>
                      </div>
                    </article>
                  ))}

                  {filteredTests.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[#DCE0E9] bg-white px-5 py-14 text-center dark:border-[#48434E] dark:bg-[#211e27]">
                      <Search
                        size={28}
                        className="mx-auto text-[#8A8493]"
                      />

                      <h3 className="mt-3 text-base font-extrabold">
                        {tests.length === 0
                          ? "No published mock tests available"
                          : activeSkill !== "All Tests"
                            ? "Full mock tests include all four skills"
                            : "No mock tests found"}
                      </h3>

                      <p className="mt-2 text-sm text-[#777184] dark:text-[#AAA5B4]">
                        {tests.length === 0
                          ? "Published tests will appear here when they become available."
                          : activeSkill !== "All Tests"
                            ? "Choose All Tests to view the available full-length tests."
                            : "Try changing your search or selected category."}
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
                </>
              )}

              {/* PAGINATION */}

              {!loading && !error && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between rounded-xl border border-[#E8EAF0] bg-white p-3 dark:border-[#393440] dark:bg-[#211e27]">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((value) => value - 1)}
                    className="rounded-lg border border-[#E8EAF0] px-3 py-2 text-xs font-bold disabled:opacity-40 dark:border-[#393440]"
                  >
                    Previous
                  </button>

                  <span className="text-xs text-[#777184] dark:text-[#AAA5B4]">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((value) => value + 1)}
                    className="rounded-lg border border-[#E8EAF0] px-3 py-2 text-xs font-bold disabled:opacity-40 dark:border-[#393440]"
                  >
                    Next
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

              {historyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoaderCircle
                    size={22}
                    className="animate-spin text-[#FF456C]"
                  />
                </div>
              ) : historyError ? (
                <p className="mt-4 text-xs text-red-500">
                  {historyError}
                </p>
              ) : (
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
                        strokeDasharray={`${totalAttempts ? (completedCount / totalAttempts) * 302 : 0} 302`}
                      />
                    </svg>

                    <div className="absolute text-center">
                      <p className="text-2xl font-black">
                        {completedCount}
                      </p>
                      <p className="text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                        Completed
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-3">
                    {[
                      {
                        label: "Completed",
                        count: completedCount,
                        color: "#00A879",
                      },
                      {
                        label: "In progress",
                        count: inProgressCount,
                        color: "#FF456C",
                      },
                      {
                        label: "Total attempts",
                        count: totalAttempts,
                        color: "#96909F",
                      },
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

                        <span className="font-extrabold">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                  <p className="text-3xl font-black">
                    {historyLoading ? "..." : latestBand ?? "—"}
                  </p>
                  <TrendingUp size={25} className="text-[#FF456C]" />
                </div>

                <p className="mt-2 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                  {latestScore?.mockScore?.completedAt
                    ? `Completed ${formatDate(latestScore.mockScore.completedAt)}`
                    : "No evaluated mock score available yet."}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  {
                    label: "Listening",
                    score: latestScore?.mockScore?.listeningBand,
                    icon: Headphones,
                  },
                  {
                    label: "Reading",
                    score: latestScore?.mockScore?.readingBand,
                    icon: BookOpen,
                  },
                  {
                    label: "Writing",
                    score: latestScore?.mockScore?.writingBand,
                    icon: PenLine,
                  },
                  {
                    label: "Speaking",
                    score: latestScore?.mockScore?.speakingBand,
                    icon: Mic,
                  },
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
                          {skill.score ?? "—"}
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
                {historyLoading ? (
                  <p className="py-4 text-center text-xs text-[#898394]">
                    Loading history...
                  </p>
                ) : historyError ? (
                  <p className="text-xs text-red-500">
                    {historyError}
                  </p>
                ) : visibleRecentTests.length === 0 ? (
                  <p className="py-5 text-center text-xs text-[#898394]">
                    No mock attempts yet.
                  </p>
                ) : (
                  visibleRecentTests.map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4ECFF] text-[#873BFA] dark:bg-[#30243E]">
                        <FileText size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold">
                          {getTestTitle(test.testVersion?.test)}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-[10px] text-[#777184] dark:text-[#AAA5B4]">
                          <CalendarDays size={12} />
                          {formatDate(test.submittedAt || test.startedAt)}
                        </p>

                        <p className="mt-1 text-[10px] text-[#898394]">
                          {getStatus(test.status)}
                        </p>
                      </div>

                      <span className="rounded-full bg-[#FFF0F3] px-2.5 py-1.5 text-xs font-extrabold text-[#FF456C] dark:bg-[#38202B]">
                        {test.mockScore?.overallBand ?? "—"}
                      </span>
                    </div>
                  ))
                )}
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

      {/* TEST DETAILS MODAL - ORIGINAL IMAGE PRESERVED */}

      {selectedTest && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeTestModal();
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
                onClick={closeTestModal}
                disabled={starting}
                aria-label="Close test details"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#252333] shadow-md disabled:opacity-50"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-4 left-5 right-5">
                <span className="rounded-md bg-[#E5F9F1] px-2.5 py-1 text-[10px] font-extrabold text-[#009A69]">
                  PUBLISHED TEST
                </span>

                <h2
                  id="mock-test-title"
                  className="mt-2 text-xl font-black text-white"
                >
                  {getTestTitle(testDetails || selectedTest)}
                </h2>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {detailsLoading ? (
                <div className="flex flex-col items-center py-10">
                  <LoaderCircle
                    size={30}
                    className="animate-spin text-[#FF456C]"
                  />
                  <p className="mt-3 text-xs text-[#898394]">
                    Loading test details...
                  </p>
                </div>
              ) : detailsError ? (
                <div className="rounded-xl bg-red-50 p-4 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-300">
                  <p>{detailsError}</p>
                  <button
                    type="button"
                    onClick={() => openTestDetails(selectedTest)}
                    className="mt-3 font-bold underline"
                  >
                    Try again
                  </button>
                </div>
              ) : startedAttempt ? (
                <div className="py-5 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E5F9F1] text-[#009A69] dark:bg-[#203B33]">
                    <CheckCircle2 size={34} />
                  </div>

                  <h3 className="mt-4 text-lg font-black">
                    Mock attempt started!
                  </h3>

                  <p className="mt-2 text-xs text-[#777184] dark:text-[#AAA5B4]">
                    Your attempt has been created successfully.
                  </p>

                  <p className="mt-3 break-all rounded-lg bg-[#F6F6F9] p-3 text-xs font-semibold dark:bg-[#292530]">
                    Attempt ID: {startedAttempt.id}
                  </p>

                  <p className="mt-3 text-[10px] text-[#96909F]">
                    The attempt screen navigation will be connected when
                    its frontend route is confirmed.
                  </p>

                  <button
                    type="button"
                    onClick={closeTestModal}
                    className="mt-5 w-full rounded-xl bg-[#FF456C] px-4 py-3 text-sm font-bold text-white"
                  >
                    Close
                  </button>
                </div>
              ) : testDetails ? (
                <>
                  <p className="text-sm leading-6 text-[#777184] dark:text-[#C6C0CD]">
                    {testDetails.book?.title || testDetails.title}
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-[#F6F6F9] p-3 text-center dark:bg-[#292530]">
                      <FileText
                        size={19}
                        className="mx-auto text-[#FF456C]"
                      />
                      <p className="mt-2 text-sm font-extrabold">
                        {testDetails.publishedVersion?.modules?.length ?? 4}
                      </p>
                      <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                        Modules
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F6F6F9] p-3 text-center dark:bg-[#292530]">
                      <Clock
                        size={19}
                        className="mx-auto text-[#873BFA]"
                      />
                      <p className="mt-2 text-xs font-extrabold">
                        {getDuration(
                          testDetails.publishedVersion?.modules || []
                        )}
                      </p>
                      <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                        Duration
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F6F6F9] p-3 text-center dark:bg-[#292530]">
                      <Target
                        size={19}
                        className="mx-auto text-[#00A879]"
                      />
                      <p className="mt-2 text-sm font-extrabold">
                        Full
                      </p>
                      <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                        Mock test
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-xs font-extrabold">
                      Included modules
                    </h3>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {(testDetails.publishedVersion?.modules || []).map(
                        (module) => {
                          const moduleIcons = {
                            LISTENING: Headphones,
                            READING: BookOpen,
                            WRITING: PenLine,
                            SPEAKING: Mic,
                          };

                          const Icon =
                            moduleIcons[module.section] || FileText;

                          return (
                            <div
                              key={module.id}
                              className="flex items-center gap-2 rounded-xl border border-[#E8EAF0] p-3 dark:border-[#393440]"
                            >
                              <Icon
                                size={17}
                                className="text-[#FF456C]"
                              />
                              <span className="text-xs font-bold">
                                {module.section}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {startError && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-300">
                      <AlertCircle size={16} className="shrink-0" />
                      {startError}
                    </div>
                  )}

                  <div className="mt-5 rounded-xl border border-[#F1DDE2] bg-[#FFF5F7] p-3 text-xs leading-5 text-[#716A7B] dark:border-[#49333D] dark:bg-[#30232D] dark:text-[#C6C0CD]">
                    <p className="font-extrabold text-[#252333] dark:text-white">
                      Before you begin
                    </p>
                    <p className="mt-1">
                      Find a quiet place and keep enough time to complete
                      your full mock test.
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={closeTestModal}
                      disabled={starting}
                      className="flex-1 rounded-xl border border-[#E8EAF0] px-4 py-3 text-sm font-bold text-[#716A7B] transition hover:bg-[#F6F6F9] disabled:opacity-50 dark:border-[#393440] dark:text-[#C6C0CD] dark:hover:bg-[#292530]"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={continueTest}
                      disabled={
                        starting ||
                        !testDetails.publishedVersion?.id
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF456C] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#E92E59] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {starting ? (
                        <>
                          <LoaderCircle
                            size={17}
                            className="animate-spin"
                          />
                          Starting...
                        </>
                      ) : (
                        <>
                          Start full mock test
                          <PlayCircle size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : null}
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

            <h2
              id="upgrade-title"
              className="mt-5 text-2xl font-black"
            >
              Explore more plans
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#777184] dark:text-[#C6C0CD]">
              Explore available plans and subscription options.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Access to available mock tests",
                "Detailed performance analysis",
                "Track your progress over time",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2.5"
                >
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
