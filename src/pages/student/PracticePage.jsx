
import React, { useMemo, useState } from "react";
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
  MapPin,
  Sparkles,
  X,
  RotateCcw,
} from "lucide-react";
import StudentLayout from "./StudentLayout";

// ======================================================
// SKILLS
// ======================================================

const skills = [
  {
    name: "Listening",
    description: "Practise listening skills",
    icon: Headphones,
    color: "#FF456C",
    bg: "#FFF0F3",
  },
  {
    name: "Reading",
    description: "Improve reading skills",
    icon: BookOpen,
    color: "#873BFA",
    bg: "#F4ECFF",
  },
  {
    name: "Writing",
    description: "Practise writing skills",
    icon: PenLine,
    color: "#2784FF",
    bg: "#EAF3FF",
  },
  {
    name: "Speaking",
    description: "Build speaking confidence",
    icon: Mic,
    color: "#00A879",
    bg: "#E5F9F1",
  },
];

// ======================================================
// PRACTICE DATA
// ======================================================

const practiceData = [
  {
    id: 1,
    title: "Hotel Reservation",
    description:
      "Listen to a conversation and answer questions about hotel booking details.",
    skill: "Listening",
    section: "Section 1",
    category: "Multiple Choice",
    difficulty: "Easy",
    questions: 10,
    duration: "8 min",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: 2,
    title: "University Campus Tour",
    description:
      "Listen to a campus tour and answer questions about university facilities.",
    skill: "Listening",
    section: "Section 2",
    category: "Form Completion",
    difficulty: "Medium",
    questions: 12,
    duration: "10 min",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: 3,
    title: "Group Project Discussion",
    description:
      "Listen to students discussing a project and identify important details.",
    skill: "Listening",
    section: "Section 3",
    category: "Multiple Choice",
    difficulty: "Medium",
    questions: 10,
    duration: "10 min",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: 4,
    title: "Lecture: Climate Change",
    description:
      "Listen to an academic lecture and answer questions about key ideas.",
    skill: "Listening",
    section: "Section 4",
    category: "Note Completion",
    difficulty: "Hard",
    questions: 15,
    duration: "15 min",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: 5,
    title: "Academic Reading Passage",
    description:
      "Read an academic passage and identify the main ideas and supporting details.",
    skill: "Reading",
    section: "Passage 1",
    category: "True / False / Not Given",
    difficulty: "Easy",
    questions: 13,
    duration: "15 min",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: 6,
    title: "The Future of Education",
    description:
      "Improve reading comprehension with an education-themed passage.",
    skill: "Reading",
    section: "Passage 2",
    category: "Matching Headings",
    difficulty: "Medium",
    questions: 14,
    duration: "18 min",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: 7,
    title: "Online Education Essay",
    description:
      "Write an opinion essay and practise structuring your argument clearly.",
    skill: "Writing",
    section: "Task 2",
    category: "Essay Writing",
    difficulty: "Medium",
    questions: 1,
    duration: "40 min",
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: 8,
    title: "Academic Chart Description",
    description:
      "Describe the key trends and comparisons in a visual data chart.",
    skill: "Writing",
    section: "Task 1",
    category: "Report Writing",
    difficulty: "Hard",
    questions: 1,
    duration: "20 min",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: 9,
    title: "Describe a Memorable Journey",
    description:
      "Practise a cue card response with details, examples and clear structure.",
    skill: "Speaking",
    section: "Part 2",
    category: "Cue Card",
    difficulty: "Medium",
    questions: 1,
    duration: "3 min",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=90",
  },
  {
    id: 10,
    title: "Everyday Conversation",
    description:
      "Practise answering familiar questions about your routine and interests.",
    skill: "Speaking",
    section: "Part 1",
    category: "Interview",
    difficulty: "Easy",
    questions: 12,
    duration: "5 min",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=90",
  },
];

// ======================================================
// FILTERS
// ======================================================

const filters = [
  "All",
  "Section 1",
  "Section 2",
  "Section 3",
  "Section 4",
  "Map/Diagram",
  "Multiple Choice",
  "Form Completion",
  "Note Completion",
];

// ======================================================
// PANEL
// ======================================================

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#E8EAF0] bg-white p-4 shadow-[0_3px_16px_rgba(20,20,40,0.035)] dark:border-[#393440] dark:bg-[#211e27] sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

// ======================================================
// MAIN PAGE
// ======================================================

export default function PracticePage() {
  const navigate = useNavigate();

  const [activeSkill, setActiveSkill] = useState("Listening");
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All levels");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState(null);

  // ====================================================
  // FILTERED PRACTICES
  // ====================================================

  const filteredPractices = useMemo(() => {
    return practiceData.filter((item) => {
      const matchesSkill = item.skill === activeSkill;

      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        activeFilter === "All" ||
        item.section === activeFilter ||
        item.category === activeFilter;

      const matchesDifficulty =
        difficulty === "All levels" || item.difficulty === difficulty;

      return (
        matchesSkill &&
        matchesSearch &&
        matchesFilter &&
        matchesDifficulty
      );
    });
  }, [activeSkill, activeFilter, search, difficulty]);

  // ====================================================
  // HANDLERS
  // ====================================================

  const selectSkill = (skill) => {
    setActiveSkill(skill);
    setActiveFilter("All");
  };

  const startPractice = (item) => {
    setSelectedPractice(item);
  };

  const closePractice = () => {
    setSelectedPractice(null);
  };

  const resetFilters = () => {
    setSearch("");
    setDifficulty("All levels");
    setActiveFilter("All");
  };

  const continueToPractice = () => {
    if (!selectedPractice) return;

    if (selectedPractice.skill === "Speaking") {
      navigate("/live-speaking");
    } else if (selectedPractice.skill === "Writing") {
      navigate("/ai-feedback");
    } else {
      navigate("/mock-tests");
    }

    closePractice();
  };

  // ====================================================
  // CURRENT SKILL
  // ====================================================

  const currentSkill = skills.find(
    (skill) => skill.name === activeSkill
  );

  const CurrentIcon = currentSkill.icon;

  const skillStats = {
    Listening: {
      correct: 28,
      incorrect: 8,
      remaining: 4,
      total: 40,
    },
    Reading: {
      correct: 22,
      incorrect: 10,
      remaining: 8,
      total: 40,
    },
    Writing: {
      correct: 8,
      incorrect: 7,
      remaining: 5,
      total: 20,
    },
    Speaking: {
      correct: 12,
      incorrect: 4,
      remaining: 4,
      total: 20,
    },
  };

  const currentStats = skillStats[activeSkill];

  const recommendations = [
    "Practise more Section 3 questions",
    "Improve note completion skills",
    "Try a full listening test",
  ];

  const quickLinks = [
    {
      title: "Full Listening Tests",
      subtitle: "Real exam-style tests",
      icon: Headphones,
      color: "#FF456C",
      bg: "#FFF0F3",
      action: () => navigate("/mock-tests"),
    },
    {
      title: "Section-wise Practice",
      subtitle: "Target specific sections",
      icon: FileText,
      color: "#00A879",
      bg: "#E5F9F1",
      action: () => {
        setActiveSkill("Listening");
        setActiveFilter("All");
      },
    },
    {
      title: "Map & Diagram Practice",
      subtitle: "Improve visual question skills",
      icon: MapPin,
      color: "#08A6B8",
      bg: "#E5F9FC",
      action: () => {
        setActiveSkill("Listening");
        setActiveFilter("Map/Diagram");
      },
    },
    {
      title: "Audio Library",
      subtitle: "Listen and learn anytime",
      icon: Headphones,
      color: "#873BFA",
      bg: "#F4ECFF",
      action: () => navigate("/study-resources"),
    },
  ];

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <StudentLayout>
      <div className="mx-auto w-full max-w-[1800px] space-y-5 text-[#252333] dark:text-white">

        {/* PAGE HERO */}

        <section className="relative grid min-h-[220px] overflow-hidden rounded-2xl border border-[#F1DDE2] bg-gradient-to-r from-[#FFF5F7] via-white to-[#FFF0F3] dark:border-[#49333D] dark:from-[#30232D] dark:via-[#211e27] dark:to-[#30232D] md:min-h-[235px] md:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)]">

          <div className="relative z-10 flex flex-col justify-center p-5 sm:p-7">

            <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FF456C]">
              <Sparkles size={15} />
              Practise all four skills
            </p>

            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              Practice with{" "}
              <span className="text-[#FF456C]">purpose.</span>
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-[#716A7B] dark:text-[#B9B2C2]">
              Choose a skill, explore topics and practise with realistic
              IELTS questions to improve your band score.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">

              <div className="flex items-center gap-2 rounded-lg border border-[#F0DDE2] bg-white/90 px-3 py-2 text-[11px] font-semibold dark:border-[#49333D] dark:bg-[#211e27]">
                <Target size={15} className="text-[#FF456C]" />
                Targeted practice
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-[#F0DDE2] bg-white/90 px-3 py-2 text-[11px] font-semibold dark:border-[#49333D] dark:bg-[#211e27]">
                <Clock size={15} className="text-[#873BFA]" />
                Flexible timing
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-[#F0DDE2] bg-white/90 px-3 py-2 text-[11px] font-semibold dark:border-[#49333D] dark:bg-[#211e27]">
                <TrendingUp size={15} className="text-[#00A879]" />
                Track progress
              </div>

            </div>
          </div>

          <div className="relative hidden min-h-[235px] overflow-hidden md:block">

            <img
              src="https://images.unsplash.com/photo-1581089786257-d34fe7d9bff6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
              alt="Students studying together in a modern learning environment"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF5F7] via-[#FFF5F7]/30 to-transparent dark:from-[#30232D] dark:via-[#30232D]/20" />

          </div>
        </section>

        {/* FOUR SKILLS */}

        <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">

          {skills.map((skill) => {
            const Icon = skill.icon;
            const active = activeSkill === skill.name;

            return (
              <button
                key={skill.name}
                type="button"
                onClick={() => selectSkill(skill.name)}
                className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition sm:p-4 ${
                  active
                    ? "border-[#FF829B] bg-[#FFF5F7] shadow-sm dark:border-[#A44A63] dark:bg-[#38202B]"
                    : "border-[#E8EAF0] bg-white hover:border-[#FFB3C2] hover:bg-[#FFFAFB] dark:border-[#393440] dark:bg-[#211e27] dark:hover:border-[#75404F] dark:hover:bg-[#292530]"
                }`}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: skill.bg,
                    color: skill.color,
                  }}
                >
                  <Icon size={22} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-sm font-extrabold">
                    {skill.name}
                  </h2>

                  <p className="mt-1 text-[10px] leading-4 text-[#898394] dark:text-[#AAA5B4] sm:text-[11px]">
                    {skill.description}
                  </p>
                </div>
              </button>
            );
          })}

        </section>

        {/* MAIN CONTENT */}

        <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">

          {/* LEFT CONTENT */}

          <div className="min-w-0 space-y-4">

            {/* SKILL HEADING */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <div className="flex items-center gap-2">
                  <CurrentIcon
                    size={23}
                    style={{ color: currentSkill.color }}
                  />

                  <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                    {activeSkill} Practice
                  </h2>
                </div>

                <p className="mt-1 text-xs text-[#898394] dark:text-[#AAA5B4] sm:text-sm">
                  Practise with topic-based exercises and realistic questions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((value) => !value)}
                className={`flex items-center justify-center gap-2 self-start rounded-xl border px-4 py-2.5 text-xs font-bold transition sm:self-auto ${
                  showFilters
                    ? "border-[#FF456C] bg-[#FFF0F3] text-[#FF456C] dark:border-[#75404F] dark:bg-[#38202B]"
                    : "border-[#E8EAF0] bg-white text-[#716A7B] hover:bg-[#F8F7FA] dark:border-[#393440] dark:bg-[#211e27] dark:text-[#C6C0CD] dark:hover:bg-[#292530]"
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
                  placeholder={`Search ${activeSkill.toLowerCase()} topics and questions...`}
                  className="w-full rounded-xl border border-[#E8EAF0] bg-[#F9F9FB] py-3 pl-11 pr-4 text-sm text-[#252333] outline-none transition placeholder:text-[#96909F] focus:border-[#FF829B] focus:bg-white dark:border-[#393440] dark:bg-[#19171e] dark:text-white dark:focus:border-[#A44A63] dark:focus:bg-[#211e27]"
                />
              </div>

              {showFilters && (
                <div className="flex flex-wrap items-center gap-3 border-t border-[#ECECF1] pt-4 dark:border-[#393440]">

                  <label className="text-xs font-bold text-[#716A7B] dark:text-[#C6C0CD]">
                    Difficulty
                  </label>

                  <select
                    value={difficulty}
                    onChange={(event) => setDifficulty(event.target.value)}
                    className="rounded-lg border border-[#E8EAF0] bg-white px-3 py-2 text-xs text-[#252333] outline-none focus:border-[#FF829B] dark:border-[#393440] dark:bg-[#19171e] dark:text-white"
                  >
                    <option>All levels</option>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
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

              <div className="flex gap-2 overflow-x-auto pb-1">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      activeFilter === filter
                        ? "border-[#FF456C] bg-[#FF456C] text-white"
                        : "border-[#E8EAF0] bg-white text-[#716A7B] hover:border-[#FF9BAF] hover:text-[#FF456C] dark:border-[#393440] dark:bg-[#211e27] dark:text-[#C6C0CD] dark:hover:border-[#75404F]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </Panel>

            {/* PRACTICE LIST HEADING */}

            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-extrabold">
                Available exercises
              </h3>

              <span className="text-xs text-[#898394] dark:text-[#AAA5B4]">
                {filteredPractices.length} results
              </span>
            </div>

            {/* PRACTICE CARDS */}

            <div className="space-y-3">

              {filteredPractices.map((item) => {
                const activeSkillData = skills.find(
                  (skill) => skill.name === item.skill
                );

                const Icon = activeSkillData.icon;

                const difficultyColor =
                  item.difficulty === "Easy"
                    ? "#00A879"
                    : item.difficulty === "Medium"
                    ? "#E9A23B"
                    : "#FF456C";

                return (
                  <article
                    key={item.id}
                    className="group min-h-[220px] rounded-2xl border border-[#E8EAF0] bg-white p-3 shadow-[0_3px_14px_rgba(20,20,40,0.025)] transition hover:border-[#FFB4C2] hover:shadow-md dark:border-[#393440] dark:bg-[#211e27] dark:hover:border-[#75404F] sm:p-4"
                  >
                    <div className="grid h-full items-stretch gap-4 sm:grid-cols-[145px_minmax(0,1fr)] lg:grid-cols-[170px_minmax(0,1fr)_125px]">

                      <div className="relative h-32 overflow-hidden rounded-xl bg-[#F2F2F6] sm:h-full sm:min-h-[188px]">
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute left-2 top-2 rounded-lg bg-white/95 px-2 py-1 text-[10px] font-bold text-[#252333]">
                          {item.skill}
                        </div>
                      </div>

                      <div className="flex min-w-0 flex-col justify-center">

                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="flex h-7 w-7 items-center justify-center rounded-lg"
                            style={{
                              backgroundColor: activeSkillData.bg,
                              color: activeSkillData.color,
                            }}
                          >
                            <Icon size={16} />
                          </span>

                          <h3 className="text-sm font-extrabold leading-5">
                            {item.title}
                          </h3>
                        </div>

                        <p className="mt-2 text-xs leading-5 text-[#777184] dark:text-[#AAA5B4]">
                          {item.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-md bg-[#FFF0F3] px-2.5 py-1 text-[10px] font-bold text-[#FF456C] dark:bg-[#38202B]">
                            {item.section}
                          </span>

                          <span className="rounded-md bg-[#EAF3FF] px-2.5 py-1 text-[10px] font-bold text-[#2784FF] dark:bg-[#25334A]">
                            {item.category}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#898394] dark:text-[#AAA5B4]">
                          <span className="flex items-center gap-1.5">
                            <FileText size={14} />
                            {item.questions}{" "}
                            {item.questions === 1 ? "task" : "questions"}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {item.duration}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-row items-center justify-between gap-3 border-t border-[#ECECF1] pt-3 dark:border-[#393440] sm:col-span-2 lg:col-span-1 lg:flex-col lg:items-stretch lg:justify-center lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">

                        <div>
                          <p
                            className="text-xs font-extrabold"
                            style={{ color: difficultyColor }}
                          >
                            <span className="mr-1">●</span>
                            {item.difficulty}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => startPractice(item)}
                          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FF456C] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#E92E59] lg:w-full"
                        >
                          Start
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}

              {/* EMPTY STATE */}

              {filteredPractices.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#DCE0E9] bg-white px-5 py-14 text-center dark:border-[#48434E] dark:bg-[#211e27]">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF0F3] text-[#FF456C] dark:bg-[#38202B]">
                    <Search size={24} />
                  </div>

                  <h3 className="mt-4 text-base font-extrabold">
                    No exercises found
                  </h3>

                  <p className="mt-2 text-sm text-[#898394] dark:text-[#AAA5B4]">
                    Try another keyword or clear your filters.
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
            </div>
          </div>

          {/* RIGHT SIDEBAR */}

          <aside className="space-y-4">

            {/* PROGRESS PANEL */}

            <Panel>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-extrabold">
                  Your progress in {activeSkill}
                </h3>

                <button
                  type="button"
                  onClick={() => navigate("/progress")}
                  className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF456C]"
                >
                  Details
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="mt-5 flex items-center gap-4">

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
                      stroke={currentSkill.color}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${
                        (48 * 2 * Math.PI * (currentStats.correct / currentStats.total)) / 100
                      } 302`}
                    />
                  </svg>

                  <div className="absolute text-center">
                    <p className="text-2xl font-black">
                      {currentStats.correct}
                    </p>

                    <p className="text-xs text-[#898394] dark:text-[#AAA5B4]">
                      / {currentStats.total}
                    </p>
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  {[
                    {
                      color: "#00A879",
                      label: "Correct",
                      value: currentStats.correct,
                    },
                    {
                      color: "#FF456C",
                      label: "Incorrect",
                      value: currentStats.incorrect,
                    },
                    {
                      color: "#96909F",
                      label: "Not attempted",
                      value: currentStats.remaining,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="flex items-center gap-2 text-[#777184] dark:text-[#C6C0CD]">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: stat.color }}
                        />
                        {stat.label}
                      </span>

                      <span className="font-extrabold">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-4 rounded-xl bg-[#F6F6F9] p-3 text-xs leading-5 text-[#777184] dark:bg-[#292530] dark:text-[#C6C0CD]">
                Complete exercises regularly to identify areas where you can improve.
              </p>
            </Panel>

            {/* RECOMMENDATIONS */}

            <Panel className="border-[#F1DDE2] bg-gradient-to-br from-white to-[#FFF6F8] dark:border-[#49333D] dark:from-[#211e27] dark:to-[#30232D]">

              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF456C] dark:bg-[#38202B]">
                  <Target size={21} />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold">
                    Recommended for you
                  </h3>

                  <p className="mt-1 text-[11px] text-[#898394] dark:text-[#AAA5B4]">
                    Based on your practice
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {recommendations.map((recommendation) => (
                  <div
                    key={recommendation}
                    className="flex items-start gap-2.5"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-[#FF456C]"
                    />

                    <p className="text-xs leading-5 text-[#777184] dark:text-[#C6C0CD]">
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigate("/progress")}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#FF9BAF] bg-white py-3 text-xs font-bold text-[#FF456C] transition hover:bg-[#FFF0F3] dark:border-[#75404F] dark:bg-[#211e27] dark:hover:bg-[#38202B]"
              >
                View personalised progress
                <ArrowRight size={15} />
              </button>
            </Panel>

            {/* QUICK LINKS */}

            <Panel>
              <h3 className="text-sm font-extrabold">Quick links</h3>

              <div className="mt-3 space-y-1">
                {quickLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <button
                      key={link.title}
                      type="button"
                      onClick={link.action}
                      className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#F7F7FA] dark:hover:bg-[#292530]"
                    >
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: link.bg,
                          color: link.color,
                        }}
                      >
                        <Icon size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold">
                          {link.title}
                        </p>

                        <p className="mt-1 text-[11px] text-[#898394] dark:text-[#AAA5B4]">
                          {link.subtitle}
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
                  Test your skills in an exam-style environment and review your results.
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

        {/* FOOTER */}

        <p className="pb-2 text-center text-[11px] text-[#96909F] dark:text-[#777184]">
          Equilx IELTS · Practise with purpose
        </p>
      </div>

      {/* PRACTICE DETAILS MODAL */}

      {selectedPractice && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePractice();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="practice-modal-title"
            className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#E8EAF0] bg-white shadow-2xl dark:border-[#393440] dark:bg-[#211e27]"
          >

            <div className="relative h-48 bg-[#F2F2F6] dark:bg-[#292530]">
              <img
                src={selectedPractice.image}
                alt={selectedPractice.title}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <button
                type="button"
                onClick={closePractice}
                aria-label="Close practice details"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#252333] shadow-md transition hover:bg-[#FFF0F3]"
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

            <div className="p-5 sm:p-6">
              <p className="text-sm leading-6 text-[#777184] dark:text-[#C6C0CD]">
                {selectedPractice.description}
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

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={closePractice}
                  className="flex-1 rounded-xl border border-[#E8EAF0] px-4 py-3 text-sm font-bold text-[#716A7B] transition hover:bg-[#F6F6F9] dark:border-[#48434E] dark:text-[#C6C0CD] dark:hover:bg-[#292530]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={continueToPractice}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF456C] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#E92E59]"
                >
                  Continue
                  <PlayCircle size={18} />
                </button>
              </div>

              <p className="mt-3 text-center text-[10px] leading-4 text-[#96909F] dark:text-[#777184]">
                Demo interface: the full question attempt and scoring flow still needs integration.
              </p>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
