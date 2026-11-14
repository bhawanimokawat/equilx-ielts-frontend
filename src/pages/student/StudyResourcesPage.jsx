import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  BookOpen,
  FileText,
  Headphones,
  Mic,
  PlayCircle,
  ArrowRight,
  Clock,
  Bookmark,
  BookmarkCheck,
  GraduationCap,
  Target,
  X,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import StudentLayout from "./StudentLayout";

const categories = [
  { name: "All Resources", icon: BookOpen },
  { name: "Grammar", icon: FileText },
  { name: "Vocabulary", icon: BookOpen },
  { name: "Exam Strategies", icon: Target },
  { name: "Sample Essays", icon: FileText },
  { name: "Video Lessons", icon: PlayCircle },
  { name: "Audio Library", icon: Headphones },
];

const resources = [
  {
    id: 1,
    title: "Essential Grammar for IELTS",
    category: "Grammar",
    description: "Learn key grammar rules with examples and exercises.",
    detail:
      "Revise tenses, articles, sentence structure, prepositions and common grammar mistakes. Use the lessons to make your writing clearer and more accurate.",
    count: "25 lessons",
    level: "Beginner",
    format: "Reading",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=85",
    color: "rose",
    duration: "45 min",
    featured: true,
  },
  {
    id: 2,
    title: "Academic Vocabulary List",
    category: "Vocabulary",
    description: "Important IELTS words with definitions and examples.",
    detail:
      "Build academic vocabulary with useful words, meanings, example sentences and synonyms for common IELTS topics.",
    count: "50 word lists",
    level: "Intermediate",
    format: "Reading",
    image:
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=800&q=85",
    color: "purple",
    duration: "30 min",
    featured: true,
  },
  {
    id: 3,
    title: "Top Tips to Get Band 7+",
    category: "Exam Strategies",
    description: "Practical strategies for each IELTS test section.",
    detail:
      "Learn how to manage time, understand question instructions, identify keywords and review your answers before the test ends.",
    count: "12 articles",
    level: "Intermediate",
    format: "Reading",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=85",
    color: "green",
    duration: "20 min",
    featured: true,
  },
  {
    id: 4,
    title: "Sample Essays with Band Scores",
    category: "Sample Essays",
    description: "High-scoring examples with examiner-style comments.",
    detail:
      "Explore example responses for IELTS Writing Task 1 and Task 2, including structure, idea development, vocabulary and grammar observations.",
    count: "40 essays",
    level: "Advanced",
    format: "Reading",
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=85",
    color: "blue",
    duration: "35 min",
    featured: true,
  },
  {
    id: 5,
    title: "IELTS Listening Masterclass",
    category: "Video Lessons",
    description: "Learn listening strategies with guided video lessons.",
    detail:
      "Practise listening for names, dates, numbers, paraphrases and distractors. Follow the lesson and review the question-solving strategy.",
    count: "18 videos",
    level: "Intermediate",
    format: "Video",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=85",
    color: "rose",
    duration: "25 min",
    featured: false,
  },
  {
    id: 6,
    title: "Speaking Cue Card Collection",
    category: "Exam Strategies",
    description: "Practise common Part 2 topics and speaking outlines.",
    detail:
      "Use cue cards to organise your ideas, add relevant examples and practise speaking continuously within the allotted time.",
    count: "100 topics",
    level: "Intermediate",
    format: "Reading",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=85",
    color: "purple",
    duration: "15 min",
    featured: false,
  },
  {
    id: 7,
    title: "Listening Practice Audio Library",
    category: "Audio Library",
    description: "Listen to conversations and academic discussions.",
    detail:
      "Practise with conversation and lecture-style audio activities. Review questions afterwards to identify missed information.",
    count: "50 audio files",
    level: "Beginner",
    format: "Audio",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=85",
    color: "green",
    duration: "30 min",
    featured: false,
  },
  {
    id: 8,
    title: "Writing Task 1: Charts and Graphs",
    category: "Sample Essays",
    description: "Understand how to describe data and key trends.",
    detail:
      "Learn to identify main trends, compare data, write an overview and organise details in a clear report.",
    count: "20 examples",
    level: "Intermediate",
    format: "Reading",
    image:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=85",
    color: "blue",
    duration: "40 min",
    featured: false,
  },
  {
    id: 9,
    title: "IELTS Reading: Time Management",
    category: "Video Lessons",
    description: "Improve speed while maintaining reading accuracy.",
    detail:
      "Learn skimming, scanning, keyword matching and practical ways to distribute time across the reading passages.",
    count: "8 videos",
    level: "Advanced",
    format: "Video",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=85",
    color: "rose",
    duration: "22 min",
    featured: false,
  },
];

const popularResources = [
  {
    title: "IELTS Writing Task 2 Templates",
    meta: "PDF · Writing",
    icon: FileText,
    color: "rose",
    resourceId: 4,
  },
  {
    title: "Common Speaking Topics",
    meta: "Practice guide · Speaking",
    icon: Mic,
    color: "green",
    resourceId: 6,
  },
  {
    title: "Listening Practice Materials",
    meta: "Audio · Listening",
    icon: Headphones,
    color: "purple",
    resourceId: 7,
  },
  {
    title: "Academic Vocabulary",
    meta: "Word lists · Vocabulary",
    icon: BookOpen,
    color: "blue",
    resourceId: 2,
  },
  {
    title: "IELTS Reading Strategies",
    meta: "Video · Reading",
    icon: PlayCircle,
    color: "rose",
    resourceId: 9,
  },
];

const colorStyles = {
  rose: {
    badge:
      "bg-[#FFE8EE] text-[#FF2454] dark:bg-[#49232F] dark:text-[#FF8CA5]",
    icon:
      "bg-[#FFF0F3] text-[#FF2454] dark:bg-[#49232F] dark:text-[#FF8CA5]",
    soft: "bg-[#FFF5F7] dark:bg-[#30232B]",
  },
  purple: {
    badge:
      "bg-[#F1E8FF] text-[#873BFA] dark:bg-[#382747] dark:text-[#C59AFF]",
    icon:
      "bg-[#F3EAFF] text-[#873BFA] dark:bg-[#382747] dark:text-[#C59AFF]",
    soft: "bg-[#F8F4FF] dark:bg-[#2D2535]",
  },
  green: {
    badge:
      "bg-[#DDF8EE] text-[#009A69] dark:bg-[#203C34] dark:text-[#65D6AB]",
    icon:
      "bg-[#E5F9F1] text-[#00A879] dark:bg-[#203C34] dark:text-[#65D6AB]",
    soft: "bg-[#F0FCF7] dark:bg-[#20332E]",
  },
  blue: {
    badge:
      "bg-[#E3F0FF] text-[#1680E8] dark:bg-[#20354C] dark:text-[#82BFFF]",
    icon:
      "bg-[#EAF4FF] text-[#1680E8] dark:bg-[#20354C] dark:text-[#82BFFF]",
    soft: "bg-[#F2F8FF] dark:bg-[#202D3A]",
  },
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

export default function StudyResourcesPage() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("All Resources");
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState([2]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showAllPopular, setShowAllPopular] = useState(false);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesCategory =
        activeCategory === "All Resources" ||
        resource.category === activeCategory;

      const matchesSearch =
        resource.title.toLowerCase().includes(search.toLowerCase()) ||
        resource.description.toLowerCase().includes(search.toLowerCase()) ||
        resource.category.toLowerCase().includes(search.toLowerCase());

      const matchesSaved =
        !showSavedOnly || savedIds.includes(resource.id);

      return matchesCategory && matchesSearch && matchesSaved;
    });
  }, [activeCategory, search, savedIds, showSavedOnly]);

  const toggleSaved = (id) => {
    setSavedIds((previous) =>
      previous.includes(id)
        ? previous.filter((savedId) => savedId !== id)
        : [...previous, id]
    );
  };

  const openResource = (resource) => {
    setSelectedResource(resource);
  };

  const handleStartLearning = (resource) => {
    setSelectedResource(null);

    if (resource.category === "Audio Library") {
      navigate("/practice");
    } else if (resource.category === "Video Lessons") {
      navigate("/practice");
    } else if (resource.category === "Sample Essays") {
      navigate("/ai-feedback");
    } else if (resource.category === "Exam Strategies") {
      navigate("/practice");
    } else {
      navigate("/practice");
    }
  };

  return (
    <StudentLayout>
      <div className="mx-auto max-w-[1800px] space-y-5 text-[#10265F] dark:text-[#FFF8FA]">

        {/* HERO */}
        <section className="relative grid min-h-[220px] overflow-hidden rounded-2xl border border-[#E7ECF6] bg-gradient-to-r from-white via-[#F5F7FF] to-[#FFF0F4] dark:border-[#49333D] dark:from-[#211B22] dark:via-[#292029] dark:to-[#30232B] lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="relative z-10 p-5 sm:p-7">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF456C]">
              Study resources
            </p>

            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              Learn. Practise.{" "}
              <span className="text-[#FF456C]">Improve.</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#506995] dark:text-[#C1B5C0] sm:text-base">
              Access study materials to support your IELTS preparation.
            </p>

            <div className="mt-5 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF456C] dark:bg-[#49232F]">
                  <BookOpen size={19} />
                </span>
                <div>
                  <p className="text-xs font-extrabold">Learn concepts</p>
                  <p className="mt-1 text-[10px] text-[#71809D] dark:text-[#AFA2AE]">
                    Clear explanations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1E8FF] text-[#873BFA] dark:bg-[#382747] dark:text-[#C59AFF]">
                  <GraduationCap size={19} />
                </span>
                <div>
                  <p className="text-xs font-extrabold">Build skills</p>
                  <p className="mt-1 text-[10px] text-[#71809D] dark:text-[#AFA2AE]">
                    IELTS-focused content
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden min-h-[220px] lg:block">
            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1000&q=85"
              alt="Books and study resources"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5F7FF] via-[#F5F7FF]/15 to-transparent dark:from-[#211B22] dark:via-[#211B22]/30" />
            <div className="absolute bottom-4 right-4 rounded-xl border border-white bg-white/95 p-3 shadow-lg dark:border-[#49333D] dark:bg-[#211e27]/95">
              <p className="text-xs font-extrabold dark:text-[#FFF8FA]">
                Your learning library
              </p>
              <p className="mt-1 text-[10px] text-[#71809D] dark:text-[#C1B5C0]">
                Read, listen and practise
              </p>
            </div>
          </div>
        </section>

        {/* SEARCH AND CATEGORIES */}
        <Panel className="space-y-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9ABB] dark:text-[#AFA2AE]"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search study materials, grammar, vocabulary..."
              className="w-full rounded-xl border border-[#E1E7F3] bg-[#FAFBFF] py-3 pl-11 pr-4 text-sm text-[#10265F] outline-none transition placeholder:text-[#91A0BA] focus:border-[#FF8199] focus:bg-white dark:border-[#49333D] dark:bg-[#30232B] dark:text-[#FFF8FA] dark:placeholder:text-[#AFA2AE] dark:focus:bg-[#30232B]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const active = activeCategory === category.name;

              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => setActiveCategory(category.name)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold transition ${
                    active
                      ? "border-[#FF456C] bg-[#FF456C] text-white shadow-sm"
                      : "border-[#E7ECF6] bg-white text-[#506995] hover:border-[#FF9BAF] hover:text-[#FF456C] dark:border-[#49333D] dark:bg-[#30232B] dark:text-[#C1B5C0] dark:hover:text-[#FF8CA5]"
                  }`}
                >
                  <Icon size={16} />
                  {category.name}
                </button>
              );
            })}
          </div>
        </Panel>

        {/* FEATURED RESOURCES */}
        {!showSavedOnly && activeCategory === "All Resources" && !search && (
          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black">Featured resources</h2>
                <p className="mt-1 text-xs text-[#71809D] dark:text-[#AFA2AE]">
                  Start with these popular learning materials.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveCategory("All Resources")}
                className="flex items-center gap-1 text-xs font-bold text-[#FF456C]"
              >
                Explore all <ArrowRight size={15} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {resources
                .filter((resource) => resource.featured)
                .map((resource) => {
                  const styles = colorStyles[resource.color];
                  const saved = savedIds.includes(resource.id);

                  return (
                    <article
                      key={resource.id}
                      className="group overflow-hidden rounded-2xl border border-[#E7ECF6] bg-white shadow-[0_3px_14px_rgba(16,38,95,0.035)] transition hover:-translate-y-1 hover:shadow-lg dark:border-[#49333D] dark:bg-[#211e27]"
                    >
                      <div className="relative h-40 overflow-hidden bg-[#F2F5FD] dark:bg-[#30232B]">
                        <img
                          src={resource.image}
                          alt={resource.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute left-3 top-3">
                          <span
                            className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold ${styles.badge}`}
                          >
                            {resource.category}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleSaved(resource.id)}
                          aria-label={saved ? "Remove bookmark" : "Save resource"}
                          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#10265F] shadow-sm transition hover:text-[#FF456C] dark:bg-[#211e27]/95 dark:text-[#FFF8FA]"
                        >
                          {saved ? (
                            <BookmarkCheck
                              size={17}
                              className="text-[#FF456C]"
                            />
                          ) : (
                            <Bookmark size={17} />
                          )}
                        </button>
                      </div>

                      <div className="p-4">
                        <h3 className="text-sm font-extrabold leading-5">
                          {resource.title}
                        </h3>

                        <p className="mt-2 min-h-[40px] text-xs leading-5 text-[#71809D] dark:text-[#AFA2AE]">
                          {resource.description}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-[11px] text-[#71809D] dark:text-[#AFA2AE]">
                          <FileText size={14} />
                          {resource.count}
                          <span className="ml-auto flex items-center gap-1">
                            <Clock size={13} />
                            {resource.duration}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => openResource(resource)}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#FF9BAF] bg-[#FFF7F9] py-2.5 text-xs font-bold text-[#FF456C] transition hover:bg-[#FF456C] hover:text-white dark:border-[#71404D] dark:bg-[#30232B] dark:text-[#FF8CA5] dark:hover:bg-[#FF456C] dark:hover:text-white"
                        >
                          {resource.category === "Vocabulary"
                            ? "Explore now"
                            : resource.category === "Sample Essays"
                              ? "View essays"
                              : resource.category === "Exam Strategies"
                                ? "Read now"
                                : "Start learning"}
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </article>
                  );
                })}
            </div>
          </section>
        )}

        {/* RESOURCE LIBRARY + SIDEBAR */}
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black">
                  {showSavedOnly ? "Saved resources" : "Browse resources"}
                </h2>
                <p className="mt-1 text-xs text-[#71809D] dark:text-[#AFA2AE]">
                  {filteredResources.length} resources available
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSavedOnly((value) => !value)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                  showSavedOnly
                    ? "border-[#FF456C] bg-[#FFF0F3] text-[#FF456C] dark:bg-[#49232F] dark:text-[#FF8CA5]"
                    : "border-[#DCE4F3] bg-white text-[#506995] dark:border-[#49333D] dark:bg-[#211e27] dark:text-[#C1B5C0]"
                }`}
              >
                {showSavedOnly ? (
                  <BookmarkCheck size={15} />
                ) : (
                  <Bookmark size={15} />
                )}
                {showSavedOnly ? "Show all" : "Saved"}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {filteredResources.map((resource) => {
                const styles = colorStyles[resource.color];

                const Icon =
                  resource.category === "Audio Library"
                    ? Headphones
                    : resource.category === "Video Lessons"
                      ? PlayCircle
                      : resource.category === "Exam Strategies"
                        ? Target
                        : resource.category === "Sample Essays"
                          ? FileText
                          : BookOpen;

                return (
                  <article
                    key={resource.id}
                    className="flex gap-3 rounded-2xl border border-[#E7ECF6] bg-white p-3 transition hover:border-[#FFB4C2] hover:shadow-md dark:border-[#49333D] dark:bg-[#211e27] dark:hover:border-[#71404D] sm:p-4"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F2F5FD] dark:bg-[#30232B] sm:h-28 sm:w-28">
                      <img
                        src={resource.image}
                        alt={resource.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`w-fit rounded-full px-2 py-1 text-[10px] font-bold ${styles.badge}`}
                        >
                          {resource.category}
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleSaved(resource.id)}
                          aria-label={
                            savedIds.includes(resource.id)
                              ? "Remove saved resource"
                              : "Save resource"
                          }
                          className="shrink-0 text-[#71809D] hover:text-[#FF456C] dark:text-[#AFA2AE] dark:hover:text-[#FF8CA5]"
                        >
                          {savedIds.includes(resource.id) ? (
                            <BookmarkCheck
                              size={17}
                              className="text-[#FF456C]"
                            />
                          ) : (
                            <Bookmark size={17} />
                          )}
                        </button>
                      </div>

                      <h3 className="mt-2 text-xs font-extrabold leading-5 sm:text-sm">
                        {resource.title}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#71809D] dark:text-[#AFA2AE]">
                        {resource.description}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                        <span className="text-[10px] text-[#71809D] dark:text-[#AFA2AE]">
                          {resource.count}
                        </span>

                        <button
                          type="button"
                          onClick={() => openResource(resource)}
                          className="flex items-center gap-1 text-[11px] font-bold text-[#FF456C] dark:text-[#FF8CA5]"
                        >
                          Open <ArrowRight size={13} />
                        </button>
                      </div>

                      <div className="hidden">
                        <Icon size={14} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {filteredResources.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#DCE4F3] bg-white px-5 py-14 text-center dark:border-[#49333D] dark:bg-[#211e27]">
                <Search
                  size={28}
                  className="mx-auto text-[#8A9ABB] dark:text-[#AFA2AE]"
                />
                <h3 className="mt-3 text-base font-extrabold">
                  No resources found
                </h3>
                <p className="mt-2 text-sm text-[#71809D] dark:text-[#AFA2AE]">
                  Try another search, category or saved filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All Resources");
                    setShowSavedOnly(false);
                  }}
                  className="mt-4 rounded-xl bg-[#FF456C] px-5 py-2.5 text-xs font-bold text-white"
                >
                  Reset filters
                </button>
              </div>
            )}
          </section>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-4">
            <Panel>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold">
                  Your study progress
                </h3>
                <button
                  type="button"
                  onClick={() => navigate("/progress")}
                  className="flex items-center gap-1 text-xs font-bold text-[#FF456C] dark:text-[#FF8CA5]"
                >
                  View details <ArrowRight size={14} />
                </button>
              </div>

              <div className="mt-5 flex items-center gap-4">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg viewBox="0 0 100 100" className="-rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="39"
                      fill="none"
                      stroke="#E9EDF7"
                      className="dark:stroke-[#49333D]"
                      strokeWidth="9"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="39"
                      fill="none"
                      stroke="#FF456C"
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray="103 245"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-xl font-black">42%</p>
                    <p className="text-[9px] text-[#71809D] dark:text-[#AFA2AE]">
                      Completed
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  {[
                    { label: "Completed", count: 48, color: "#00A879" },
                    { label: "In progress", count: 32, color: "#FF456C" },
                    { label: "Not started", count: 40, color: "#23458B" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="flex items-center gap-2 text-[#506995] dark:text-[#C1B5C0]">
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

            <Panel className="border-[#FFE0E6] bg-gradient-to-br from-white to-[#FFF0F3] dark:border-[#71404D] dark:from-[#211e27] dark:to-[#30232B]">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFE1E8] text-[#FF456C] dark:bg-[#49232F] dark:text-[#FF8CA5]">
                  <Target size={19} />
                </span>
                <h3 className="text-sm font-extrabold">
                  Recommended for you
                </h3>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                Explore these materials to strengthen your IELTS preparation.
              </p>

              <div className="mt-3 space-y-3">
                {[
                  {
                    title: "Practise more Writing Task 2",
                    subtitle: "Improve essay structure",
                    id: 4,
                    icon: FileText,
                    color: "rose",
                  },
                  {
                    title: "Learn academic vocabulary",
                    subtitle: "Improve word choice",
                    id: 2,
                    icon: BookOpen,
                    color: "purple",
                  },
                  {
                    title: "Study time management",
                    subtitle: "Build exam strategies",
                    id: 3,
                    icon: Clock,
                    color: "green",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const styles = colorStyles[item.color];
                  const resource = resources.find((r) => r.id === item.id);

                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => openResource(resource)}
                      className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white dark:hover:bg-[#30232B]"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${styles.icon}`}
                      >
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-[10px] text-[#71809D] dark:text-[#AFA2AE]">
                          {item.subtitle}
                        </span>
                      </span>
                      <ArrowRight
                        size={15}
                        className="shrink-0 text-[#8A9ABB] dark:text-[#AFA2AE]"
                      />
                    </button>
                  );
                })}
              </div>
            </Panel>

            <Panel>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold">
                  Popular resources
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAllPopular((value) => !value)}
                  className="text-xs font-bold text-[#FF456C] dark:text-[#FF8CA5]"
                >
                  {showAllPopular ? "Show less" : "View all"}
                </button>
              </div>

              <div className="mt-3 space-y-1">
                {(showAllPopular
                  ? [...popularResources, ...popularResources.slice(0, 2)]
                  : popularResources
                ).map((item, index) => {
                  const Icon = item.icon;
                  const styles = colorStyles[item.color];
                  const resource = resources.find(
                    (r) => r.id === item.resourceId
                  );

                  return (
                    <button
                      key={`${item.title}-${index}`}
                      type="button"
                      onClick={() => openResource(resource)}
                      className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#F8FAFF] dark:hover:bg-[#30232B]"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${styles.icon}`}
                      >
                        <Icon size={18} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold leading-5">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-[10px] text-[#71809D] dark:text-[#AFA2AE]">
                          {item.meta}
                        </span>
                      </span>

                      <ArrowRight
                        size={15}
                        className="shrink-0 text-[#8A9ABB] dark:text-[#AFA2AE]"
                      />
                    </button>
                  );
                })}
              </div>
            </Panel>

            <Panel className="bg-gradient-to-br from-white to-[#F1F7FF] dark:from-[#211e27] dark:to-[#202D3A]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#1680E8] dark:bg-[#20354C] dark:text-[#82BFFF]">
                <GraduationCap size={21} />
              </div>

              <h3 className="mt-3 text-sm font-extrabold">
                Keep learning every day
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                Small, regular practice sessions can help you build confidence.
              </p>

              <button
                type="button"
                onClick={() => navigate("/practice")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF456C] py-3 text-xs font-bold text-white transition hover:bg-[#E81745]"
              >
                Start practice <ArrowRight size={15} />
              </button>
            </Panel>
          </aside>
        </div>

        <p className="pb-2 text-center text-[11px] text-[#9AA8C2] dark:text-[#807580]">
          Equilx IELTS · Learn. Practise. Improve.
        </p>
      </div>

      {/* RESOURCE DETAIL MODAL */}
      {selectedResource && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#081633]/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedResource(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="resource-detail-title"
            className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:border dark:border-[#49333D] dark:bg-[#211e27]"
          >
            <div className="relative h-52 bg-[#F2F5FD] dark:bg-[#30232B]">
              <img
                src={selectedResource.image}
                alt={selectedResource.title}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#10265F]/80 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedResource(null)}
                aria-label="Close resource details"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#10265F] dark:bg-[#211e27] dark:text-white"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-4 left-5 right-5">
                <span
                  className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
                    colorStyles[selectedResource.color].badge
                  }`}
                >
                  {selectedResource.category}
                </span>
                <h2
                  id="resource-detail-title"
                  className="mt-3 text-xl font-black text-white"
                >
                  {selectedResource.title}
                </h2>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-sm leading-6 text-[#506995] dark:text-[#C1B5C0]">
                {selectedResource.detail}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-[#F5F7FF] p-3 text-center dark:bg-[#30232B]">
                  <FileText
                    size={18}
                    className="mx-auto text-[#FF456C]"
                  />
                  <p className="mt-2 text-[11px] font-extrabold">
                    {selectedResource.count}
                  </p>
                </div>

                <div className="rounded-xl bg-[#F5F7FF] p-3 text-center dark:bg-[#30232B]">
                  <Clock
                    size={18}
                    className="mx-auto text-[#873BFA]"
                  />
                  <p className="mt-2 text-[11px] font-extrabold">
                    {selectedResource.duration}
                  </p>
                </div>

                <div className="rounded-xl bg-[#F5F7FF] p-3 text-center dark:bg-[#30232B]">
                  <GraduationCap
                    size={18}
                    className="mx-auto text-[#00A879]"
                  />
                  <p className="mt-2 text-[11px] font-extrabold">
                    {selectedResource.level}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[#E7ECF6] bg-[#FAFBFF] p-3 dark:border-[#49333D] dark:bg-[#30232B]">
                <div className="flex items-start gap-2">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-[#00A879]"
                  />
                  <p className="text-xs leading-5 text-[#506995] dark:text-[#C1B5C0]">
                    This is a resource preview. Connect your content API or CMS
                    to load the complete lesson, downloadable file or media.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => toggleSaved(selectedResource.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#DCE4F3] px-4 py-3 text-sm font-bold text-[#506995] hover:bg-[#F5F7FF] dark:border-[#49333D] dark:text-[#C1B5C0] dark:hover:bg-[#30232B]"
                >
                  {savedIds.includes(selectedResource.id) ? (
                    <BookmarkCheck size={17} />
                  ) : (
                    <Bookmark size={17} />
                  )}
                  {savedIds.includes(selectedResource.id)
                    ? "Saved"
                    : "Save resource"}
                </button>

                <button
                  type="button"
                  onClick={() => handleStartLearning(selectedResource)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF456C] px-4 py-3 text-sm font-bold text-white hover:bg-[#E81745]"
                >
                  Open resource <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}