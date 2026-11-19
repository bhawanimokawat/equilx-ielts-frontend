import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  ArrowRight,
  Clock,
  CheckCircle2,
  Target,
  TrendingUp,
  ChevronRight,
  SlidersHorizontal,
  PlayCircle,
  FileText,
  Sparkles,
  X,
  RotateCcw,
  Loader2,
  AlertCircle,
  RefreshCw,
  BookMarked,
  GraduationCap,
  Filter,
  History,
  CircleHelp,
} from "lucide-react";

import StudentLayout from "./StudentLayout";
import practiceService from "../../services/practiceService";

// ------------------------------------------------------
// SKILLS
// ------------------------------------------------------

const skills = [
  {
    name: "Listening",
    description: "Improve your listening accuracy",
    icon: Headphones,
    color: "#FF456C",
    bg: "#FFF0F3",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Reading",
    description: "Build reading comprehension",
    icon: BookOpen,
    color: "#873BFA",
    bg: "#F4ECFF",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Writing",
    description: "Develop structured writing",
    icon: PenLine,
    color: "#2784FF",
    bg: "#EAF3FF",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Speaking",
    description: "Build speaking confidence",
    icon: Mic,
    color: "#00A879",
    bg: "#E5F9F1",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=900&q=85",
  },
];

// Different fallback images for individual cards.
// Backend image is always preferred when it is available.

const fallbackImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=85",
];

// ------------------------------------------------------
// HELPERS
// ------------------------------------------------------

const getPayload = (response) => {
  return response?.data ?? response ?? {};
};

const getList = (response) => {
  const data = getPayload(response);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.tests)) return data.tests;

  return [];
};

const getSkillName = (module) => {
  const value = [
    module?.section,
    module?.name,
    module?.title,
    module?.type,
    module?.moduleType,
    module?.skill,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (value.includes("listen")) return "Listening";
  if (value.includes("read")) return "Reading";
  if (value.includes("writ")) return "Writing";
  if (value.includes("speak")) return "Speaking";

  return "Other";
};

const getDifficulty = (value) => {
  if (!value) return "Not specified";

  const text = String(value).toLowerCase();

  if (text.includes("easy") || text.includes("beginner")) {
    return "Easy";
  }

  if (text.includes("medium") || text.includes("intermediate")) {
    return "Medium";
  }

  if (text.includes("hard") || text.includes("advanced")) {
    return "Hard";
  }

  return value;
};

const formatDuration = (seconds) => {
  if (!seconds || Number.isNaN(Number(seconds))) {
    return "Not specified";
  }

  const minutes = Math.ceil(Number(seconds) / 60);

  return `${minutes} min`;
};

const getImageForTest = (test, index, skill) => {
  const backendImage =
    test?.imageUrl ||
    test?.image ||
    test?.thumbnailUrl ||
    test?.coverImage ||
    test?.publishedVersion?.imageUrl ||
    test?.publishedVersion?.thumbnailUrl;

  if (backendImage) return backendImage;

  // Skill-specific image is used if there is only one test.
  // Multiple tests get different fallback images.
  if (index === 0) {
    const skillData = skills.find((item) => item.name === skill);
    if (skillData?.image) return skillData.image;
  }

  return fallbackImages[index % fallbackImages.length];
};

const getDifficultyColor = (difficulty) => {
  if (difficulty === "Easy") return "#00A879";
  if (difficulty === "Medium") return "#E9A23B";
  if (difficulty === "Hard") return "#FF456C";

  return "#898394";
};

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

// ------------------------------------------------------
// SMALL COMPONENTS
// ------------------------------------------------------

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#E8EAF0] bg-white p-4 shadow-[0_3px_16px_rgba(20,20,40,0.035)] dark:border-[#393440] dark:bg-[#211e27] sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

function SkillIcon({ skill, size = 18 }) {
  const skillData = skills.find((item) => item.name === skill);
  const Icon = skillData?.icon || BookOpen;

  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
      style={{
        backgroundColor: skillData?.bg || "#F4ECFF",
        color: skillData?.color || "#873BFA",
      }}
    >
      <Icon size={size} />
    </span>
  );
}

function DifficultyBadge({ difficulty }) {
  const color = getDifficultyColor(difficulty);

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
      style={{
        color,
        backgroundColor: `${color}15`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {difficulty}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E8EAF0] bg-white py-16 dark:border-[#393440] dark:bg-[#211e27]">
      <Loader2 size={32} className="animate-spin text-[#FF456C]" />
      <p className="mt-4 text-sm font-bold">Loading practice exercises...</p>
      <p className="mt-1 text-xs text-[#898394]">
        Please wait while we fetch your exercises.
      </p>
    </div>
  );
}

// ------------------------------------------------------
// PRACTICE CARD
// ------------------------------------------------------

function PracticeCard({ item, onStart }) {
  const skillData = skills.find((skill) => skill.name === item.skill);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8EAF0] bg-white shadow-[0_3px_15px_rgba(20,20,40,0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#FFB4C2] hover:shadow-[0_12px_30px_rgba(255,69,108,0.10)] dark:border-[#393440] dark:bg-[#211e27] dark:hover:border-[#75404F]">
      {/* IMAGE */}

      <div className="relative h-44 overflow-hidden bg-[#F4F3F7]">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.src =
              skillData?.image || fallbackImages[0];
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

        <div className="absolute left-3 top-3">
          <span
            className="rounded-lg px-3 py-1.5 text-[10px] font-extrabold shadow-sm"
            style={{
              color: skillData?.color || "#873BFA",
              backgroundColor: "#FFFFFF",
            }}
          >
            {item.skill}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <span className="rounded-md bg-black/45 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            {item.section}
          </span>

          <DifficultyBadge difficulty={item.difficulty} />
        </div>
      </div>

      {/* CONTENT */}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <SkillIcon skill={item.skill} />

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm font-extrabold leading-5 text-[#252333] dark:text-white">
              {item.title}
            </h3>

            <p className="mt-1 text-[10px] font-medium text-[#96909F] dark:text-[#AAA5B4]">
              {item.category}
            </p>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 min-h-[40px] text-xs leading-5 text-[#777184] dark:text-[#AAA5B4]">
          {item.description || "Practise this IELTS exercise and improve your skills."}
        </p>

        <div className="my-4 grid grid-cols-2 gap-2 border-y border-[#ECECF1] py-3 dark:border-[#393440]">
          <div className="flex items-center gap-2 text-[11px] text-[#777184] dark:text-[#AAA5B4]">
            <FileText size={14} className="shrink-0 text-[#FF456C]" />
            <span>
              {item.questions ?? "—"}{" "}
              {item.questions === 1 ? "task" : "questions"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#777184] dark:text-[#AAA5B4]">
            <Clock size={14} className="shrink-0 text-[#873BFA]" />
            <span>{item.duration}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="text-[10px] font-semibold text-[#96909F] dark:text-[#AAA5B4]">
            {item.categoryType || "IELTS Practice"}
          </span>

          <button
            type="button"
            onClick={() => onStart(item)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF456C] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#E92E59] focus:outline-none focus:ring-2 focus:ring-[#FF456C]/40"
          >
            Start practice
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

// ------------------------------------------------------
// MAIN PAGE
// ------------------------------------------------------

export default function PracticePage() {
  const navigate = useNavigate();

  // Page state
  const [activeSkill, setActiveSkill] = useState("Listening");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All levels");
  const [category, setCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // API state
  const [tests, setTests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [testDetails, setTestDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [modalError, setModalError] = useState("");

  // Test category filter
  const [testCategory, setTestCategory] = useState("All");

  // ----------------------------------------------------
  // LOAD PRACTICE TESTS
  // ----------------------------------------------------

  const loadTests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await practiceService.getTests(
        1,
        50,
        testCategory === "All" ? "" : testCategory
      );

      setTests(getList(response));
    } catch (err) {
      setError(getErrorMessage(err));
      setTests([]);
    } finally {
      setLoading(false);
    }
  }, [testCategory]);

  // ----------------------------------------------------
  // LOAD PRACTICE HISTORY
  // ----------------------------------------------------

  const loadHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);

      const response = await practiceService.getHistory(1, 5);
      const data = getPayload(response);

      const records = Array.isArray(data.items)
        ? data.items
        : Array.isArray(data.attempts)
          ? data.attempts
          : [];

      setHistory(records);
    } catch (err) {
      console.error("Practice history error:", err);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTests();
  }, [loadTests]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // ----------------------------------------------------
  // NORMALISE API TESTS
  // ----------------------------------------------------

  const practices = useMemo(() => {
    return tests.map((test, index) => {
      const version = test?.publishedVersion || {};
      const modules = Array.isArray(version.modules)
        ? version.modules
        : [];

      const matchingModule =
        modules.find((module) => getSkillName(module) === activeSkill) ||
        modules[0];

      const skill = matchingModule
        ? getSkillName(matchingModule)
        : getSkillName(test);

      const durationSeconds =
        matchingModule?.durationSeconds ??
        test?.durationSeconds ??
        version?.durationSeconds;

      const questionCount =
        matchingModule?.questionCount ??
        matchingModule?.totalQuestions ??
        test?.questionCount ??
        test?.totalQuestions;

      const difficultyValue =
        matchingModule?.difficulty ??
        test?.difficulty ??
        "Not specified";

      return {
        id: test.id,
        title:
          test.title ||
          test.name ||
          version.title ||
          "IELTS Practice Test",
        description:
          test.description ||
          version.description ||
          "",
        skill,
        section:
          matchingModule?.name ||
          matchingModule?.title ||
          matchingModule?.type ||
          "Practice",
        category:
          matchingModule?.questionType ||
          matchingModule?.category ||
          test?.questionType ||
          test?.category ||
          "Practice Exercise",
        categoryType: test?.category || "",
        difficulty: getDifficulty(difficultyValue),
        questions: questionCount ?? "—",
        duration: formatDuration(durationSeconds),
        image: getImageForTest(test, index, skill),
        test,
        version,
        modules,
        matchingModule,
      };
    });
  }, [tests, activeSkill]);

  // ----------------------------------------------------
  // AVAILABLE SKILLS FROM API
  // ----------------------------------------------------

  const skillCounts = useMemo(() => {
    const counts = {
      Listening: 0,
      Reading: 0,
      Writing: 0,
      Speaking: 0,
    };

    tests.forEach((test) => {
      const modules = test?.publishedVersion?.modules || [];

      modules.forEach((module) => {
        const skill = getSkillName(module);

        if (counts[skill] !== undefined) {
          counts[skill] += 1;
        }
      });
    });

    return counts;
  }, [tests]);

  // ----------------------------------------------------
  // FILTERS
  // ----------------------------------------------------

  const filteredPractices = useMemo(() => {
    return practices.filter((item) => {
      const skillMatch = item.skill === activeSkill;

      const searchText = search.trim().toLowerCase();

      const searchMatch =
        !searchText ||
        item.title.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText) ||
        String(item.category).toLowerCase().includes(searchText);

      const difficultyMatch =
        difficulty === "All levels" ||
        item.difficulty === difficulty;

      const categoryMatch =
        category === "All" ||
        item.category === category ||
        item.section === category;

      return (
        skillMatch &&
        searchMatch &&
        difficultyMatch &&
        categoryMatch
      );
    });
  }, [practices, activeSkill, search, difficulty, category]);

  // ----------------------------------------------------
  // SKILL CHANGE
  // ----------------------------------------------------

  const selectSkill = (skill) => {
    setActiveSkill(skill);
    setCategory("All");
    setSearch("");
  };

  // ----------------------------------------------------
  // RESET FILTERS
  // ----------------------------------------------------

  const resetFilters = () => {
    setSearch("");
    setDifficulty("All levels");
    setCategory("All");
  };

  // ----------------------------------------------------
  // OPEN PRACTICE DETAILS
  // ----------------------------------------------------

  const openPractice = async (item) => {
    setSelectedPractice(item);
    setTestDetails(null);
    setSelectedModuleId("");
    setModalError("");
    setDetailsLoading(true);

    try {
      const response = await practiceService.getTestDetails(item.id);
      const data = getPayload(response);

      const details = data.test || data;
      setTestDetails(details);

      const version =
        details.publishedVersion ||
        details.test?.publishedVersion ||
        item.version;

      const modules = Array.isArray(version?.modules)
        ? version.modules
        : item.modules;

      const firstModule = modules?.[0];

      if (firstModule?.id) {
        setSelectedModuleId(firstModule.id);
      }
    } catch (err) {
      setModalError(getErrorMessage(err));
    } finally {
      setDetailsLoading(false);
    }
  };

  const closePractice = () => {
    setSelectedPractice(null);
    setTestDetails(null);
    setSelectedModuleId("");
    setModalError("");
  };

  // ----------------------------------------------------
  // START PRACTICE
  // ----------------------------------------------------

  const continueToPractice = async () => {
    if (!selectedPractice) return;

    const details = testDetails || selectedPractice.test;
    const version =
      details?.publishedVersion ||
      details?.test?.publishedVersion ||
      selectedPractice.version;

    const testVersionId = version?.id;

    if (!testVersionId) {
      setModalError(
        "Published test version ID is missing. Please check the test details returned by the API."
      );
      return;
    }

    if (!selectedModuleId) {
      setModalError("Please select a practice module first.");
      return;
    }

    try {
      setStarting(true);
      setModalError("");

      const response = await practiceService.startAttempt(
        testVersionId,
        { moduleId: selectedModuleId }
      );

      const data = getPayload(response);
      const attempt = data.attempt || data;

      // Refresh recent practice history after starting.
      loadHistory();

      const attemptId = attempt?.id || attempt?.attemptId;

      closePractice();

      if (attemptId) {
        navigate(`/practice/attempt/${attemptId}`);
      } else {
        setError(
          "Practice attempt was created, but the attempt screen route needs to be connected."
        );
      }
    } catch (err) {
      setModalError(getErrorMessage(err));
    } finally {
      setStarting(false);
    }
  };

  // ----------------------------------------------------
  // CURRENT SKILL
  // ----------------------------------------------------

  const currentSkill = skills.find(
    (skill) => skill.name === activeSkill
  );

  const CurrentIcon = currentSkill?.icon || BookOpen;

  // ----------------------------------------------------
  // CATEGORY OPTIONS
  // ----------------------------------------------------

  const categoryOptions = useMemo(() => {
    const options = new Set();

    practices
      .filter((item) => item.skill === activeSkill)
      .forEach((item) => {
        if (item.category) options.add(item.category);
        if (item.section) options.add(item.section);
      });

    return ["All", ...Array.from(options)];
  }, [practices, activeSkill]);

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------

  return (
    <StudentLayout>
      <div className="mx-auto w-full max-w-[1800px] space-y-6 text-[#252333] dark:text-white">

        {/* PAGE HEADER */}

        <section className="relative overflow-hidden rounded-3xl border border-[#F1DDE2] bg-gradient-to-r from-[#FFF5F7] via-white to-[#FFF0F3] dark:border-[#49333D] dark:from-[#30232D] dark:via-[#211e27] dark:to-[#30232D]">
          <div className="grid md:grid-cols-[1.2fr_0.8fr]">
            <div className="relative z-10 flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FF456C]">
                <Sparkles size={15} />
                IELTS Practice Centre
              </p>

              <h1 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                Practise with{" "}
                <span className="text-[#FF456C]">purpose.</span>
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-6 text-[#716A7B] dark:text-[#B9B2C2]">
                Choose your IELTS skill, explore available exercises
                and improve your performance with focused practice.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  { icon: Target, text: "Targeted practice" },
                  { icon: Clock, text: "Flexible timing" },
                  { icon: TrendingUp, text: "Track your progress" },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <span
                      key={item.text}
                      className="flex items-center gap-2 rounded-xl border border-[#F0DDE2] bg-white/90 px-3 py-2 text-[11px] font-semibold dark:border-[#49333D] dark:bg-[#211e27]"
                    >
                      <Icon size={14} className="text-[#FF456C]" />
                      {item.text}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="relative hidden min-h-[260px] overflow-hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1581089786257-d34fe7d9bff6?w=900&auto=format&fit=crop&q=85"
                alt="Students learning together"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#FFF5F7] via-[#FFF5F7]/20 to-transparent dark:from-[#30232D] dark:via-[#30232D]/20" />
            </div>
          </div>
        </section>

        {/* SKILL SELECTOR */}

        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold">
                Choose your skill
              </h2>
              <p className="mt-1 text-xs text-[#898394] dark:text-[#AAA5B4]">
                Select the area you want to improve.
              </p>
            </div>

            <span className="text-[10px] font-semibold text-[#898394] dark:text-[#AAA5B4]">
              4 IELTS skills
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {skills.map((skill) => {
              const Icon = skill.icon;
              const active = activeSkill === skill.name;

              return (
                <button
                  key={skill.name}
                  type="button"
                  onClick={() => selectSkill(skill.name)}
                  className={`group flex items-center gap-3 rounded-2xl border p-3.5 text-left transition sm:p-4 ${
                    active
                      ? "border-[#FF829B] bg-[#FFF5F7] shadow-sm dark:border-[#A44A63] dark:bg-[#38202B]"
                      : "border-[#E8EAF0] bg-white hover:border-[#FFB3C2] dark:border-[#393440] dark:bg-[#211e27]"
                  }`}
                >
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105"
                    style={{
                      backgroundColor: skill.bg,
                      color: skill.color,
                    }}
                  >
                    <Icon size={23} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold">
                      {skill.name}
                    </span>

                    <span className="mt-1 block text-[10px] leading-4 text-[#898394] dark:text-[#AAA5B4]">
                      {skill.description}
                    </span>

                    <span className="mt-1.5 block text-[10px] font-bold text-[#FF456C]">
                      {skillCounts[skill.name] || 0} available modules
                    </span>
                  </span>

                  {active && (
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-[#FF456C]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* MAIN CONTENT */}

        <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">

          {/* LEFT SIDE */}

          <div className="min-w-0 space-y-5">

            {/* HEADING */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CurrentIcon
                    size={23}
                    style={{ color: currentSkill?.color }}
                  />

                  <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                    {activeSkill} Practice
                  </h2>
                </div>

                <p className="mt-1 text-xs text-[#898394] dark:text-[#AAA5B4]">
                  Explore exercises and practise at your own pace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((value) => !value)}
                className={`flex items-center justify-center gap-2 self-start rounded-xl border px-4 py-2.5 text-xs font-bold transition sm:self-auto ${
                  showFilters
                    ? "border-[#FF456C] bg-[#FFF0F3] text-[#FF456C] dark:border-[#75404F] dark:bg-[#38202B]"
                    : "border-[#E8EAF0] bg-white text-[#716A7B] dark:border-[#393440] dark:bg-[#211e27] dark:text-[#C6C0CD]"
                }`}
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>

            {/* SEARCH AND FILTERS */}

            <Panel className="space-y-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#96909F]"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`Search ${activeSkill.toLowerCase()} exercises...`}
                  className="w-full rounded-xl border border-[#E8EAF0] bg-[#F9F9FB] py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#96909F] focus:border-[#FF829B] focus:bg-white dark:border-[#393440] dark:bg-[#19171e] dark:text-white dark:focus:border-[#A44A63] dark:focus:bg-[#211e27]"
                />
              </div>

              {/* TEST CATEGORY */}

              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-[11px] font-bold text-[#716A7B] dark:text-[#C6C0CD]">
                  Test type:
                </span>

                {["All", "ACADEMIC", "GENERAL_TRAINING"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTestCategory(item)}
                    className={`rounded-full border px-3 py-1.5 text-[10px] font-bold transition ${
                      testCategory === item
                        ? "border-[#FF456C] bg-[#FF456C] text-white"
                        : "border-[#E8EAF0] bg-white text-[#716A7B] dark:border-[#393440] dark:bg-[#211e27] dark:text-[#C6C0CD]"
                    }`}
                  >
                    {item === "GENERAL_TRAINING"
                      ? "General Training"
                      : item === "ACADEMIC"
                        ? "Academic"
                        : "All"}
                  </button>
                ))}
              </div>

              {showFilters && (
                <div className="flex flex-wrap items-center gap-3 border-t border-[#ECECF1] pt-4 dark:border-[#393440]">
                  <label className="text-xs font-bold text-[#716A7B] dark:text-[#C6C0CD]">
                    Difficulty
                  </label>

                  <select
                    value={difficulty}
                    onChange={(event) => setDifficulty(event.target.value)}
                    className="rounded-lg border border-[#E8EAF0] bg-white px-3 py-2 text-xs outline-none dark:border-[#393440] dark:bg-[#19171e] dark:text-white"
                  >
                    <option>All levels</option>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>

                  <label className="text-xs font-bold text-[#716A7B] dark:text-[#C6C0CD]">
                    Section / Type
                  </label>

                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="max-w-full rounded-lg border border-[#E8EAF0] bg-white px-3 py-2 text-xs outline-none dark:border-[#393440] dark:bg-[#19171e] dark:text-white"
                  >
                    {categoryOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-xs font-bold text-[#FF456C]"
                  >
                    <RotateCcw size={13} />
                    Clear filters
                  </button>
                </div>
              )}
            </Panel>

            {/* CARD LIST HEADER */}

            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold">
                  Available exercises
                </h3>

                <p className="mt-1 text-[11px] text-[#898394] dark:text-[#AAA5B4]">
                  Select an exercise to view its details.
                </p>
              </div>

              <span className="shrink-0 rounded-lg bg-[#FFF0F3] px-3 py-1.5 text-[11px] font-bold text-[#FF456C] dark:bg-[#38202B]">
                {filteredPractices.length} results
              </span>
            </div>

            {/* ERROR STATE */}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={19}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-red-700 dark:text-red-300">
                      Unable to load practice exercises
                    </p>

                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={loadTests}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                    >
                      <RefreshCw size={13} />
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* LOADING */}

            {loading ? (
              <LoadingState />
            ) : (
              <>
                {/* PRACTICE GRID */}

                {filteredPractices.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {filteredPractices.map((item) => (
                      <PracticeCard
                        key={item.id}
                        item={item}
                        onStart={openPractice}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#DCE0E9] bg-white px-5 py-14 text-center dark:border-[#48434E] dark:bg-[#211e27]">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF0F3] text-[#FF456C] dark:bg-[#38202B]">
                      <Search size={24} />
                    </div>

                    <h3 className="mt-4 text-base font-extrabold">
                      No exercises found
                    </h3>

                    <p className="mt-2 text-sm text-[#898394] dark:text-[#AAA5B4]">
                      There are no matching published exercises for this
                      skill or filter.
                    </p>

                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-4 rounded-xl bg-[#FF456C] px-5 py-2.5 text-xs font-bold text-white"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT SIDEBAR */}

          <aside className="space-y-4">

            {/* PRACTICE SUMMARY */}

            <Panel>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF456C] dark:bg-[#38202B]">
                  <GraduationCap size={21} />
                </span>

                <div>
                  <h3 className="text-sm font-extrabold">
                    Practice overview
                  </h3>

                  <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                    Published exercises
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#F8F7FA] p-3 dark:bg-[#292530]">
                  <p className="text-2xl font-black">
                    {tests.length}
                  </p>

                  <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                    Published tests
                  </p>
                </div>

                <div className="rounded-xl bg-[#F8F7FA] p-3 dark:bg-[#292530]">
                  <p className="text-2xl font-black">
                    {history.length}
                  </p>

                  <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                    Recent attempts
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {skills.map((skill) => {
                  const Icon = skill.icon;

                  return (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="flex items-center gap-2 text-xs font-semibold">
                        <Icon size={15} style={{ color: skill.color }} />
                        {skill.name}
                      </span>

                      <span className="text-xs font-extrabold">
                        {skillCounts[skill.name] || 0}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Panel>

            {/* RECENT HISTORY */}

            <Panel>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <History size={18} className="text-[#873BFA]" />
                  <h3 className="text-sm font-extrabold">
                    Recent practice
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={loadHistory}
                  aria-label="Refresh practice history"
                  className="rounded-lg p-1.5 text-[#898394] transition hover:bg-[#F6F6F9] dark:hover:bg-[#292530]"
                >
                  <RefreshCw
                    size={14}
                    className={historyLoading ? "animate-spin" : ""}
                  />
                </button>
              </div>

              {historyLoading ? (
                <div className="flex justify-center py-7">
                  <Loader2
                    size={22}
                    className="animate-spin text-[#FF456C]"
                  />
                </div>
              ) : history.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {history.map((item, index) => (
                    <div
                      key={item.id || item.attemptId || index}
                      className="rounded-xl border border-[#ECECF1] p-3 dark:border-[#393440]"
                    >
                      <p className="line-clamp-1 text-xs font-bold">
                        {item.test?.title ||
                          item.testTitle ||
                          item.title ||
                          "Practice attempt"}
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                          {item.status || "Attempt"}
                        </span>

                        <span className="text-[10px] font-semibold text-[#873BFA]">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <BookMarked
                    size={25}
                    className="mx-auto text-[#B8B2C1]"
                  />

                  <p className="mt-2 text-xs font-bold">
                    No practice history yet
                  </p>

                  <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                    Your attempts will appear here.
                  </p>
                </div>
              )}
            </Panel>

            {/* RECOMMENDATION */}

            <Panel className="border-[#F1DDE2] bg-gradient-to-br from-white to-[#FFF6F8] dark:border-[#49333D] dark:from-[#211e27] dark:to-[#30232D]">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF456C] dark:bg-[#38202B]">
                  <Target size={21} />
                </span>

                <div>
                  <h3 className="text-sm font-extrabold">
                    Practice tip
                  </h3>

                  <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                    Make every session count
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  "Practise one skill at a time.",
                  "Review your mistakes after each attempt.",
                  "Focus on accuracy before speed.",
                ].map((tip) => (
                  <div key={tip} className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-[#00A879]"
                    />

                    <p className="text-xs leading-5 text-[#777184] dark:text-[#C6C0CD]">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>

            {/* MOCK TEST CTA */}

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#38202B] to-[#211e27] p-5 text-white">
              <div className="absolute -right-7 -top-7 h-28 w-28 rounded-full border-[18px] border-white/10" />

              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <BookOpen size={22} />
                </div>

                <h3 className="mt-4 text-base font-extrabold">
                  Ready for a mock test?
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/70">
                  Test your skills in an exam-style environment and
                  review your results.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/mock-tests")}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF456C] py-3 text-xs font-bold text-white transition hover:bg-[#E92E59]"
                >
                  Explore mock tests
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

          </aside>
        </section>

        <p className="pb-2 text-center text-[11px] text-[#96909F] dark:text-[#777184]">
          Equilx IELTS · Practise with purpose
        </p>

        {/* ---------------------------------------------- */}
        {/* PRACTICE DETAILS MODAL */}
        {/* ---------------------------------------------- */}

        {selectedPractice && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closePractice();
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="practice-modal-title"
              className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-[#E8EAF0] bg-white shadow-2xl dark:border-[#393440] dark:bg-[#211e27]"
            >
              {/* MODAL IMAGE */}

              <div className="relative h-48 bg-[#F2F2F6] dark:bg-[#292530]">
                <img
                  src={selectedPractice.image}
                  alt={selectedPractice.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />

                <button
                  type="button"
                  onClick={closePractice}
                  disabled={starting}
                  aria-label="Close practice details"
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#252333] shadow-md transition hover:bg-[#FFF0F3] disabled:opacity-50"
                >
                  <X size={18} />
                </button>

                <div className="absolute bottom-4 left-5 right-5">
                  <span className="rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#FF456C]">
                    {selectedPractice.skill}
                  </span>

                  <h2
                    id="practice-modal-title"
                    className="mt-2 text-xl font-black text-white"
                  >
                    {selectedPractice.title}
                  </h2>
                </div>
              </div>

              {/* MODAL CONTENT */}

              <div className="p-5 sm:p-6">
                <p className="text-sm leading-6 text-[#777184] dark:text-[#C6C0CD]">
                  {selectedPractice.description ||
                    "Review the exercise details and select a module to begin."}
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-[#F6F6F9] p-3 text-center dark:bg-[#292530]">
                    <FileText
                      size={19}
                      className="mx-auto text-[#FF456C]"
                    />

                    <p className="mt-2 text-sm font-extrabold">
                      {selectedPractice.questions}
                    </p>

                    <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                      Questions
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F6F6F9] p-3 text-center dark:bg-[#292530]">
                    <Clock
                      size={19}
                      className="mx-auto text-[#873BFA]"
                    />

                    <p className="mt-2 text-sm font-extrabold">
                      {selectedPractice.duration}
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
                      {selectedPractice.difficulty}
                    </p>

                    <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                      Difficulty
                    </p>
                  </div>
                </div>

                {/* MODULE SELECTION */}

                <div className="mt-5">
                  <div className="mb-2 flex items-center gap-2">
                    <BookMarked
                      size={16}
                      className="text-[#FF456C]"
                    />

                    <h3 className="text-sm font-extrabold">
                      Select practice module
                    </h3>
                  </div>

                  {detailsLoading ? (
                    <div className="flex items-center gap-2 rounded-xl bg-[#F8F7FA] p-4 text-xs text-[#777184] dark:bg-[#292530] dark:text-[#C6C0CD]">
                      <Loader2
                        size={16}
                        className="animate-spin text-[#FF456C]"
                      />
                      Loading test modules...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(testDetails?.publishedVersion?.modules ||
                        testDetails?.test?.publishedVersion?.modules ||
                        selectedPractice.modules ||
                        []).map((module) => (
                        <label
                          key={module.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                            selectedModuleId === module.id
                              ? "border-[#FF829B] bg-[#FFF5F7] dark:border-[#A44A63] dark:bg-[#38202B]"
                              : "border-[#E8EAF0] dark:border-[#393440]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="practice-module"
                            value={module.id}
                            checked={selectedModuleId === module.id}
                            onChange={() =>
                              setSelectedModuleId(module.id)
                            }
                            className="accent-[#FF456C]"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold">
                              {module.name ||
                                module.title ||
                                module.type ||
                                "Practice module"}
                            </p>

                            {module.durationSeconds && (
                              <p className="mt-1 text-[10px] text-[#898394] dark:text-[#AAA5B4]">
                                {formatDuration(module.durationSeconds)}
                              </p>
                            )}
                          </div>

                          {selectedModuleId === module.id && (
                            <CheckCircle2
                              size={17}
                              className="text-[#FF456C]"
                            />
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* MODAL ERROR */}

                {modalError && (
                  <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
                    <AlertCircle
                      size={16}
                      className="mt-0.5 shrink-0"
                    />
                    {modalError}
                  </div>
                )}

                {/* ACTIONS */}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={closePractice}
                    disabled={starting}
                    className="flex-1 rounded-xl border border-[#E8EAF0] px-4 py-3 text-sm font-bold text-[#716A7B] transition hover:bg-[#F6F6F9] disabled:opacity-50 dark:border-[#48434E] dark:text-[#C6C0CD] dark:hover:bg-[#292530]"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={continueToPractice}
                    disabled={
                      starting ||
                      detailsLoading ||
                      !selectedModuleId
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF456C] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#E92E59] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {starting ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        Start practice
                        <PlayCircle size={18} />
                      </>
                    )}
                  </button>
                </div>

                <p className="mt-3 flex items-center justify-center gap-1 text-center text-[10px] leading-4 text-[#96909F] dark:text-[#777184]">
                  <CircleHelp size={12} />
                  Your attempt will be created using the selected module.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}