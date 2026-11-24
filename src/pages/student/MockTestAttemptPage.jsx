
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Flag,
  Headphones,
  LoaderCircle,
  Mic,
  PenLine,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import mockAttemptService from "../../services/mockAttemptService";

const SECTIONS = [
  "LISTENING",
  "READING",
  "WRITING",
  "SPEAKING",
];

const SECTION_META = {
  LISTENING: {
    label: "Listening",
    icon: Headphones,
    description: "Listen carefully and answer the questions.",
  },
  READING: {
    label: "Reading",
    icon: BookOpen,
    description: "Read the passage and answer accurately.",
  },
  WRITING: {
    label: "Writing",
    icon: PenLine,
    description: "Organize your ideas and write clearly.",
  },
  SPEAKING: {
    label: "Speaking",
    icon: Mic,
    description: "Review the speaking prompts and instructions.",
  },
};

const unwrap = (response) => response?.data ?? response ?? {};

const displayText = (value) => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  if (typeof value === "object") {
    const text =
      value.text ??
      value.questionText ??
      value.prompt ??
      value.instructions;

    if (text != null) return displayText(text);
    return JSON.stringify(value, null, 2);
  }

  return String(value);
};

const getSection = (question) =>
  String(
    question?.testPart?.testModule?.section ??
      question?.section ??
      ""
  ).toUpperCase();

const getPrompt = (question) => {
  const content = question?.content ?? {};

  return displayText(
    content.questionText ??
      content.text ??
      content.prompt ??
      content.question ??
      content.instructions ??
      content
  );
};

const getPassage = (question) => {
  const content = question?.content ?? {};

  return displayText(
    content.passage ??
      content.readingPassage ??
      content.context ??
      content.paragraph ??
      question?.testPart?.passage ??
      ""
  );
};

const getOptions = (question) => {
  const content = question?.content ?? {};
  const options = content.options ?? content.choices;

  if (Array.isArray(options)) {
    return options.map((option, index) => {
      if (typeof option === "object" && option !== null) {
        return {
          value: String(
            option.value ??
              option.id ??
              option.key ??
              option.label ??
              index
          ),
          label: displayText(
            option.label ??
              option.text ??
              option.title ??
              option.value ??
              option
          ),
        };
      }

      return {
        value: String(option),
        label: String(option),
      };
    });
  }

  if (options && typeof options === "object") {
    return Object.entries(options).map(([value, label]) => ({
      value,
      label: displayText(label),
    }));
  }

  return [];
};

const hasAnswer = (value) => {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object")
    return Object.keys(value).length > 0;
  return true;
};

const toInputText = (value) => {
  if (value == null) return "";
  return typeof value === "string"
    ? value
    : JSON.stringify(value, null, 2);
};

const formatTime = (seconds) => {
  const total = Math.max(0, Math.floor(seconds));

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;

  return [hours, minutes, remainingSeconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
};

const wordCount = (value) =>
  String(value ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

const cardStyle =
  "rounded-[22px] border border-[#ece7ef] bg-white " +
  "shadow-[0_8px_32px_rgba(38,25,54,0.035)] " +
  "dark:border-[#3d3545] dark:bg-[#211e29]";

const hoverStyle =
  "transition-all duration-300 ease-out " +
  "hover:-translate-y-0.5 hover:border-[#ffb9cb] " +
  "hover:bg-[#fff7fa] " +
  "hover:shadow-[0_12px_30px_rgba(255,69,108,0.09)] " +
  "dark:hover:border-[#795064] dark:hover:bg-[#302330]";

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl " +
  "bg-[#ff456c] px-5 py-3 text-sm font-bold text-white " +
  "shadow-[0_6px_18px_rgba(255,69,108,0.16)] " +
  "transition-all duration-300 hover:-translate-y-0.5 " +
  "hover:bg-[#ed315c] hover:shadow-[0_12px_26px_rgba(255,69,108,0.24)] " +
  "active:scale-[0.98] disabled:cursor-not-allowed " +
  "disabled:opacity-50 disabled:hover:translate-y-0";

const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl " +
  "border border-[#e9e5ed] bg-white px-4 py-3 " +
  "text-sm font-bold text-[#524b60] transition-all duration-300 " +
  "hover:border-[#ffb9cb] hover:bg-[#fff1f5] " +
  "hover:text-[#f13e67] active:scale-[0.98] " +
  "disabled:cursor-not-allowed disabled:opacity-40 " +
  "dark:border-[#443a4b] dark:bg-[#292330] " +
  "dark:text-[#d5ccdc] dark:hover:bg-[#382733]";

export default function MockTestAttemptPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const [section, setSection] = useState("LISTENING");
  const [activeId, setActiveId] = useState(null);

  const [flags, setFlags] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [lastSavedId, setLastSavedId] = useState(null);

  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const [now, setNow] = useState(Date.now());
  const [showNavigator, setShowNavigator] = useState(false);

  const draftRef = useRef("");
  const answersRef = useRef({});
  const activeIdRef = useRef(null);
  const saveLockRef = useRef(false);

  const loadExam = useCallback(async () => {
    if (!attemptId) return;

    setLoading(true);
    setError("");

    try {
      const [attemptResponse, questionsResponse, answersResponse] =
        await Promise.all([
          mockAttemptService.getAttempt(attemptId),
          mockAttemptService.getQuestions(attemptId),
          mockAttemptService.getAnswers(attemptId),
        ]);

      const attemptData = unwrap(attemptResponse);
      const questionData = unwrap(questionsResponse);
      const answerData = unwrap(answersResponse);

      const attemptRecord =
        attemptData?.attempt ?? attemptData;

      const questionList = Array.isArray(questionData?.questions)
        ? questionData.questions
        : Array.isArray(questionData)
          ? questionData
          : [];

      const savedList = Array.isArray(answerData?.answers)
        ? answerData.answers
        : Array.isArray(answerData)
          ? answerData
          : [];

      const savedAnswers = {};

      savedList.forEach((item) => {
        if (item?.questionId != null) {
          savedAnswers[item.questionId] = item.answer;
        }
      });

      setAttempt(attemptRecord);
      setQuestions(questionList);
      setAnswers(savedAnswers);
      answersRef.current = savedAnswers;

      const firstQuestion = questionList[0];

      if (firstQuestion) {
        const initialSection = getSection(firstQuestion);
        setSection(
          SECTIONS.includes(initialSection)
            ? initialSection
            : "LISTENING"
        );
        setActiveId(firstQuestion.id);
        activeIdRef.current = firstQuestion.id;

        const initialDraft = toInputText(
          savedAnswers[firstQuestion.id]
        );

        setDraft(initialDraft);
        draftRef.current = initialDraft;
      }

      if (
        ["SUBMITTED", "AUTO_SUBMITTED", "COMPLETED", "EVALUATED"]
          .includes(attemptRecord?.status)
      ) {
        setSubmitted(true);
      }
    } catch (err) {
      setError(err?.message || "Unable to load your exam.");
    } finally {
      setLoading(false);
    }
  }, [attemptId]);

  useEffect(() => {
    loadExam();
  }, [loadExam]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sectionQuestions = useMemo(
    () => questions.filter((q) => getSection(q) === section),
    [questions, section]
  );

  const currentIndex = sectionQuestions.findIndex(
    (q) => q.id === activeId
  );

  const current = sectionQuestions[currentIndex] ?? null;

  const answeredCount = questions.filter((q) =>
    hasAnswer(answers[q.id])
  ).length;

  const unansweredCount = Math.max(
    0,
    questions.length - answeredCount
  );

  const flaggedCount = questions.filter(
    (q) => flags[q.id]
  ).length;

  const progress = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  const remaining = useMemo(() => {
    if (!attempt?.deadlineAt) return null;

    const deadline = new Date(attempt.deadlineAt).getTime();

    if (!Number.isFinite(deadline)) return null;

    return Math.max(
      0,
      Math.ceil((deadline - now) / 1000)
    );
  }, [attempt?.deadlineAt, now]);

  const canEdit =
    !submitted &&
    (!attempt?.status ||
      attempt.status === "IN_PROGRESS") &&
    (remaining === null || remaining > 0);

  const activeMeta =
    SECTION_META[section] ?? SECTION_META.LISTENING;

  const ActiveIcon = activeMeta.icon;

  const setAnswerDraft = (value) => {
    setDraft(value);
    draftRef.current = value;
    setSaveError("");
    setLastSavedId(null);
  };

  const saveCurrent = async () => {
    const questionId = activeIdRef.current;

    if (!canEdit || !questionId) return true;
    if (saveLockRef.current) return false;

    const value = draftRef.current;
    const previous = answersRef.current[questionId];

    if (value === toInputText(previous)) return true;

    saveLockRef.current = true;
    setSaving(true);
    setSaveError("");

    try {
      await mockAttemptService.saveAnswer(
        attemptId,
        questionId,
        value
      );

      const updated = {
        ...answersRef.current,
        [questionId]: value,
      };

      answersRef.current = updated;
      setAnswers(updated);
      setLastSavedId(questionId);

      return true;
    } catch (err) {
      setSaveError(
        err?.message ||
          "Your answer could not be saved. Please retry."
      );
      return false;
    } finally {
      saveLockRef.current = false;
      setSaving(false);
    }
  };

  const changeQuestion = async (question) => {
    if (!question || question.id === activeIdRef.current) {
      return;
    }

    const saved = await saveCurrent();
    if (!saved) return;

    const nextSection = getSection(question);

    if (SECTIONS.includes(nextSection)) {
      setSection(nextSection);
    }

    setActiveId(question.id);
    activeIdRef.current = question.id;

    const nextDraft = toInputText(
      answersRef.current[question.id]
    );

    setDraft(nextDraft);
    draftRef.current = nextDraft;

    setSaveError("");
    setLastSavedId(null);
    setShowNavigator(false);
  };

  const changeSection = async (nextSection) => {
    if (nextSection === section) return;

    const first = questions.find(
      (q) => getSection(q) === nextSection
    );

    if (first) {
      await changeQuestion(first);
      return;
    }

    const saved = await saveCurrent();

    if (saved) {
      setSection(nextSection);
      setActiveId(null);
      activeIdRef.current = null;
      setDraft("");
      draftRef.current = "";
      setShowNavigator(false);
    }
  };

  const moveQuestion = async (direction) => {
    const index = questions.findIndex(
      (q) => q.id === activeIdRef.current
    );

    const next = questions[index + direction];

    if (next) await changeQuestion(next);
  };

  const toggleFlag = () => {
    if (!current) return;

    setFlags((prev) => ({
      ...prev,
      [current.id]: !prev[current.id],
    }));
  };

  const submitExam = async () => {
    if (!canEdit || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const saved = await saveCurrent();

      if (!saved) {
        setShowSubmitModal(false);
        return;
      }

      await mockAttemptService.submitAttempt(attemptId);

      setSubmitted(true);
      setShowSubmitModal(false);

      try {
        const response =
          await mockAttemptService.getResult(attemptId);

        setResult(unwrap(response));
      } catch {
        // Evaluation may still be pending.
        setResult(null);
      }
    } catch (err) {
      setError(
        err?.message ||
          "Unable to submit your exam. Please retry."
      );
      setShowSubmitModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const isWriting = section === "WRITING";
  const isSpeaking = section === "SPEAKING";
  const isReading = section === "READING";
  const options = current ? getOptions(current) : [];
  const passage = current ? getPassage(current) : "";

  const currentGlobalIndex = questions.findIndex(
    (q) => q.id === activeId
  );

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#faf8fc] px-5 text-[#282638] dark:bg-[#17141d] dark:text-white">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#fff0f5] dark:bg-[#382431]">
          <LoaderCircle
            size={35}
            className="animate-spin text-[#ff456c]"
          />
        </div>
        <h2 className="text-xl font-black">
          Preparing your IELTS exam
        </h2>
        <p className="text-center text-sm text-[#888091]">
          Loading your real questions and saved answers...
        </p>
      </div>
    );
  }

  if (submitted) {
    const resultData = result?.result ?? result;
    const overallBand =
      resultData?.mockScore?.overallBand ??
      resultData?.overallBand;

    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fff5f8] via-[#faf8fc] to-[#f3efff] p-4 dark:from-[#211923] dark:via-[#17141d] dark:to-[#251d32]">
        <div className="w-full max-w-xl rounded-[30px] border border-[#ffe0e8] bg-white p-6 text-center shadow-[0_25px_70px_rgba(70,30,60,0.08)] dark:border-[#493443] dark:bg-[#241e2b] sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#e9faf2] text-[#10a879] dark:bg-[#203c32]">
            <CheckCircle2 size={42} />
          </div>

          <h1 className="mt-6 text-2xl font-black tracking-tight text-[#292536] dark:text-white sm:text-3xl">
            Exam submitted successfully!
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#817a8c] dark:text-[#bdb5c5]">
            Your IELTS mock test has been submitted.
            Your answers are now locked.
          </p>

          <div className="mt-7 rounded-2xl border border-[#f1e9f0] bg-[#fcf9fc] p-6 dark:border-[#433949] dark:bg-[#2c2533]">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#898091]">
              Overall band
            </p>

            <p className="mt-3 text-5xl font-black text-[#ff456c]">
              {overallBand ?? "—"}
            </p>

            <p className="mt-3 text-xs text-[#898091] dark:text-[#bdb5c5]">
              {overallBand != null
                ? "Your evaluated band score"
                : "Evaluation is pending. Your score will appear when available."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/student/mock-tests")}
            className={`${primaryButton} mt-7 w-full`}
          >
            <ArrowLeft size={17} />
            Back to Mock Tests
          </button>
        </div>
      </main>
    );
  }

  if (error && !attempt) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf8fc] p-5 dark:bg-[#17141d]">
        <div className={`${cardStyle} w-full max-w-md p-8 text-center`}>
          <AlertCircle
            size={40}
            className="mx-auto text-[#ff456c]"
          />
          <h2 className="mt-4 text-xl font-black dark:text-white">
            Unable to open exam
          </h2>
          <p className="mt-3 text-sm text-[#817a8c]">
            {error}
          </p>
          <button
            type="button"
            onClick={loadExam}
            className={`${primaryButton} mt-6`}
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9fc] text-[#292536] selection:bg-[#ffd8e3] dark:bg-[#17141d] dark:text-white">
      {/* PREMIUM TOP BAR */}
      <header className="sticky top-0 z-40 border-b border-[#eee8f0] bg-white/95 shadow-[0_4px_20px_rgba(25,15,40,0.025)] backdrop-blur-xl dark:border-[#3a3342] dark:bg-[#211c28]/95">
        <div className="mx-auto flex max-w-[1700px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#eee7ef] text-[#71697d] transition-all hover:border-[#ffc0d0] hover:bg-[#fff0f5] hover:text-[#ff456c] dark:border-[#433a4b] dark:hover:bg-[#382631]"
            >
              <ArrowLeft size={19} />
            </button>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff456c] to-[#ff8ca8] text-white shadow-[0_6px_16px_rgba(255,69,108,0.18)]">
              <BookOpen size={22} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-black tracking-tight sm:text-base">
                IELTS Mock Examination
              </p>
              <p className="mt-0.5 text-[11px] text-[#8b8494] dark:text-[#aaa2b3]">
                Equilx IELTS · Exam Workspace
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-extrabold sm:px-4 ${
                remaining !== null && remaining <= 300
                  ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/30"
                  : "border-[#f4dce4] bg-[#fff4f7] text-[#f13e67] dark:border-[#553342] dark:bg-[#382530]"
              }`}
            >
              <Clock3 size={16} />
              <span className="font-mono text-sm tabular-nums">
                {remaining === null
                  ? "No timer"
                  : formatTime(remaining)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowNavigator((v) => !v)}
              className={`${secondaryButton} lg:hidden`}
            >
              <Target size={16} />
              Questions
            </button>

            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              disabled={!canEdit || submitting || saving}
              className={`${primaryButton} px-3 sm:px-5`}
            >
              <Send size={16} />
              Submit
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1700px] space-y-5 px-4 py-5 sm:px-6 lg:px-8">
        {/* WELCOME AND PROGRESS */}
        <section className="relative overflow-hidden rounded-[25px] border border-[#f7dce5] bg-gradient-to-r from-[#fff0f5] via-white to-[#f8f3ff] p-5 dark:border-[#4a3441] dark:from-[#342330] dark:via-[#25202c] dark:to-[#30283c] sm:p-7">
          <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-[#ffabc3]/20 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ffc8d7] bg-white/80 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#f13e67] dark:border-[#6c4254] dark:bg-[#392a37]">
                <Sparkles size={13} />
                Your exam journey
              </div>

              <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
                Focus. Practice.{" "}
                <span className="text-[#ff456c]">
                  Achieve your band.
                </span>
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#81798a] dark:text-[#c2b9c9]">
                Complete each section at your own pace within the
                exam deadline. Your saved answers come from the
                real exam backend.
              </p>
            </div>

            <div className="w-full shrink-0 rounded-2xl border border-white bg-white/85 p-4 shadow-sm dark:border-[#4b3b4e] dark:bg-[#292330]/90 md:w-[250px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#827b8b]">
                  Exam progress
                </span>
                <span className="text-sm font-black text-[#ff456c]">
                  {progress}%
                </span>
              </div>

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#f4eaf0] dark:bg-[#463747]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#ff456c] to-[#ff94ae] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-3 text-xs font-semibold text-[#827b8b]">
                {answeredCount} of {questions.length} answered
              </p>
            </div>
          </div>
        </section>

        {/* SECTION TABS */}
        <nav
          aria-label="IELTS exam sections"
          className="grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          {SECTIONS.map((name) => {
            const meta = SECTION_META[name];
            const Icon = meta.icon;
            const active = section === name;

            const sectionItems = questions.filter(
              (q) => getSection(q) === name
            );

            const completed = sectionItems.filter(
              (q) => hasAnswer(answers[q.id])
            ).length;

            return (
              <button
                key={name}
                type="button"
                onClick={() => changeSection(name)}
                disabled={saving}
                className={`group relative flex min-w-0 items-center gap-3 rounded-[20px] border p-3 text-left transition-all duration-300 sm:p-4 ${
                  active
                    ? "border-[#ff89a4] bg-[#fff0f5] shadow-[0_10px_25px_rgba(255,69,108,0.09)] dark:border-[#a35370] dark:bg-[#392631]"
                    : "border-[#ebe6ee] bg-white hover:-translate-y-1 hover:border-[#ffc0d0] hover:bg-[#fff7fa] hover:shadow-[0_12px_28px_rgba(255,69,108,0.08)] dark:border-[#3d3545] dark:bg-[#211e29] dark:hover:bg-[#302330]"
                }`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-105 ${
                    active
                      ? "bg-[#ff456c] text-white"
                      : "bg-[#fff0f5] text-[#ff456c] dark:bg-[#392631]"
                  }`}
                >
                  <Icon size={21} />
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-sm font-black">
                    {meta.label}
                  </span>
                  <span className="mt-1 block text-[11px] text-[#898292] dark:text-[#b6aebe]">
                    {completed}/{sectionItems.length} answered
                  </span>
                </span>

                {active && (
                  <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#ff456c]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* MAIN EXAM GRID */}
        <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_330px]">
          <main className="min-w-0 space-y-5">
            {/* SECTION HEADER */}
            <div className={`${cardStyle} overflow-hidden`}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0eaf1] p-4 dark:border-[#403746] sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0f5] text-[#ff456c] dark:bg-[#392631]">
                    <ActiveIcon size={23} />
                  </span>

                  <div>
                    <h2 className="text-lg font-black">
                      {activeMeta.label} Section
                    </h2>
                    <p className="mt-1 text-xs text-[#898292] dark:text-[#b5adbd]">
                      {activeMeta.description}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-[#f5f1f7] px-3 py-2 text-[11px] font-extrabold text-[#716a7c] dark:bg-[#322b39] dark:text-[#c5bccc]">
                  {sectionQuestions.length} Questions
                </span>
              </div>

              {!canEdit && (
                <div className="flex items-center gap-2 bg-amber-50 px-5 py-3 text-xs font-semibold text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
                  <AlertCircle size={16} />
                  This attempt is no longer editable.
                </div>
              )}
            </div>

            {/* QUESTION CARD */}
            {current ? (
              <article className={`${cardStyle} overflow-hidden`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0eaf1] bg-[#fffdfd] px-4 py-4 dark:border-[#403746] dark:bg-[#251f2c] sm:px-6">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#ff456c]">
                      Question {currentGlobalIndex + 1}
                    </p>
                    <h3 className="mt-1 text-sm font-black">
                      {activeMeta.label} Practice
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={toggleFlag}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                      flags[current.id]
                        ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/30"
                        : "border-[#eee8f0] bg-white text-[#807888] hover:border-[#ffc1d1] hover:bg-[#fff1f5] hover:text-[#ff456c] dark:border-[#493f50] dark:bg-[#2b2532]"
                    }`}
                  >
                    <Flag
                      size={15}
                      fill={flags[current.id] ? "currentColor" : "none"}
                    />
                    {flags[current.id]
                      ? "Flagged"
                      : "Flag for review"}
                  </button>
                </div>

                <div className="space-y-6 p-4 sm:p-6">
                  {/* READING PASSAGE */}
                  {isReading && passage && (
                    <section className="rounded-2xl border border-[#ebe6ee] bg-[#fbfafc] p-4 dark:border-[#403746] dark:bg-[#2a2531] sm:p-5">
                      <div className="flex items-center gap-2 text-sm font-black text-[#ff456c]">
                        <BookOpen size={17} />
                        Reading Passage
                      </div>

                      <div className="mt-4 max-h-[420px] overflow-y-auto whitespace-pre-wrap text-sm leading-8 text-[#514b5b] dark:text-[#d4ccda]">
                        {passage}
                      </div>
                    </section>
                  )}

                  {/* QUESTION PROMPT */}
                  <div className="rounded-2xl border border-[#f0eaf1] bg-[#fffdfd] p-4 dark:border-[#403746] dark:bg-[#292330] sm:p-5">
                    <div className="mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#ff456c]">
                      <FileText size={15} />
                      Question prompt
                    </div>

                    <p className="whitespace-pre-wrap text-sm font-medium leading-8 text-[#403b4c] dark:text-[#e0d9e6] sm:text-[15px]">
                      {getPrompt(current) ||
                        "No question prompt was provided."}
                    </p>
                  </div>

                  {/* ANSWER AREA */}
                  <div>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-black">
                        Your Answer
                      </h4>

                      {isWriting && (
                        <span className="rounded-full bg-[#fff0f5] px-3 py-1.5 text-[11px] font-bold text-[#ff456c] dark:bg-[#392631]">
                          {wordCount(draft)} words
                        </span>
                      )}
                    </div>

                    {options.length > 0 ? (
                      <div className="grid gap-3">
                        {options.map((option, index) => {
                          const selected = draft === option.value;

                          return (
                            <button
                              key={`${option.value}-${index}`}
                              type="button"
                              disabled={!canEdit || saving}
                              onClick={() =>
                                setAnswerDraft(option.value)
                              }
                              className={`group flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-300 ${
                                selected
                                  ? "border-[#ff7999] bg-[#fff0f5] shadow-[0_5px_18px_rgba(255,69,108,0.07)] dark:border-[#a45670] dark:bg-[#392631]"
                                  : "border-[#ebe6ee] bg-white hover:-translate-y-0.5 hover:border-[#ffb7c9] hover:bg-[#fff7fa] dark:border-[#443b4c] dark:bg-[#292330] dark:hover:bg-[#342633]"
                              } disabled:cursor-not-allowed disabled:opacity-70`}
                            >
                              <span
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                                  selected
                                    ? "bg-[#ff456c] text-white"
                                    : "bg-[#f6f2f7] text-[#817a8a] group-hover:bg-[#ffe2ea] group-hover:text-[#ff456c] dark:bg-[#3b3242]"
                                }`}
                              >
                                {selected ? (
                                  <Check size={17} />
                                ) : (
                                  String.fromCharCode(65 + index)
                                )}
                              </span>

                              <span className="min-w-0 flex-1 text-sm font-semibold leading-6">
                                {option.label}
                              </span>

                              <span
                                className={`h-5 w-5 shrink-0 rounded-full border-2 ${
                                  selected
                                    ? "border-[#ff456c] bg-[#ff456c] ring-4 ring-[#ffe2ea] dark:ring-[#543344]"
                                    : "border-[#d8d1dc]"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div>
                        <textarea
                          value={draft}
                          onChange={(event) =>
                            setAnswerDraft(event.target.value)
                          }
                          disabled={!canEdit || saving}
                          rows={isWriting ? 15 : isSpeaking ? 6 : 5}
                          placeholder={
                            isWriting
                              ? "Start writing your IELTS response here..."
                              : isSpeaking
                                ? "Enter your response or notes here. Audio recording requires a verified backend upload API."
                                : "Type your answer here..."
                          }
                          className={`w-full resize-y rounded-2xl border border-[#e9e3ed] bg-[#fcfbfd] p-4 text-sm leading-8 text-[#403b4c] outline-none transition-all duration-300 placeholder:text-[#aaa3b2] hover:border-[#ffb9cb] focus:border-[#ff7999] focus:bg-white focus:ring-4 focus:ring-[#ff456c]/10 disabled:cursor-not-allowed disabled:opacity-65 dark:border-[#443b4c] dark:bg-[#292330] dark:text-white dark:focus:bg-[#302634] ${
                            isWriting ? "min-h-[330px]" : "min-h-[150px]"
                          }`}
                        />

                        {isSpeaking && (
                          <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#eae4f0] bg-[#f8f5fc] p-3 text-xs leading-6 text-[#777084] dark:border-[#443a4d] dark:bg-[#2c2535] dark:text-[#c5bccc]">
                            <Mic size={17} className="mt-0.5 shrink-0 text-[#ff456c]" />
                            Speaking audio recording is not enabled until
                            the real upload and submission API is verified.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* SAVE STATUS */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f0eaf1] pt-5 dark:border-[#403746]">
                    <div className="flex items-center gap-2 text-xs">
                      {saving ? (
                        <>
                          <LoaderCircle
                            size={16}
                            className="animate-spin text-[#ff456c]"
                          />
                          <span className="font-semibold text-[#81798a]">
                            Saving answer...
                          </span>
                        </>
                      ) : saveError ? (
                        <>
                          <AlertCircle
                            size={16}
                            className="text-red-500"
                          />
                          <span className="max-w-[280px] text-red-500">
                            {saveError}
                          </span>
                        </>
                      ) : lastSavedId === current.id ? (
                        <>
                          <CheckCircle2
                            size={16}
                            className="text-emerald-500"
                          />
                          <span className="font-semibold text-emerald-600">
                            Answer saved successfully
                          </span>
                        </>
                      ) : draft !== toInputText(answers[current.id]) ? (
                        <span className="font-semibold text-amber-600">
                          Unsaved changes
                        </span>
                      ) : (
                        <>
                          <ShieldCheck
                            size={16}
                            className="text-[#8c8493]"
                          />
                          <span className="text-[#8c8493]">
                            No unsaved changes
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={saveCurrent}
                      disabled={!canEdit || saving}
                      className={secondaryButton}
                    >
                      {saving ? (
                        <LoaderCircle
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Check size={16} />
                      )}
                      Save Answer
                    </button>
                  </div>
                </div>
              </article>
            ) : (
              <div className={`${cardStyle} px-5 py-16 text-center`}>
                <FileText
                  size={38}
                  className="mx-auto text-[#ff8ca8]"
                />
                <h3 className="mt-4 text-lg font-black">
                  No questions available
                </h3>
                <p className="mt-2 text-sm text-[#898292]">
                  There are no questions for this section in the
                  current exam data.
                </p>
              </div>
            )}

            {/* PREVIOUS / NEXT */}
            <div className={`${cardStyle} flex flex-wrap items-center justify-between gap-3 p-4`}>
              <button
                type="button"
                onClick={() => moveQuestion(-1)}
                disabled={
                  saving ||
                  currentGlobalIndex <= 0
                }
                className={secondaryButton}
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <span className="text-xs font-bold text-[#81798a] dark:text-[#b9b0c0]">
                {currentGlobalIndex >= 0
                  ? currentGlobalIndex + 1
                  : 0}{" "}
                / {questions.length}
              </span>

              <button
                type="button"
                onClick={() => moveQuestion(1)}
                disabled={
                  saving ||
                  currentGlobalIndex < 0 ||
                  currentGlobalIndex >= questions.length - 1
                }
                className={primaryButton}
              >
                Next Question
                <ChevronRight size={17} />
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/20">
                <AlertCircle size={19} className="shrink-0" />
                {error}
              </div>
            )}
          </main>

          {/* QUESTION NAVIGATOR */}
          <aside
            className={`min-w-0 space-y-4 ${
              showNavigator ? "block" : "hidden lg:block"
            }`}
          >
            <div className={`${cardStyle} overflow-hidden lg:sticky lg:top-24`}>
              <div className="flex items-center justify-between border-b border-[#f0eaf1] p-5 dark:border-[#403746]">
                <div>
                  <h3 className="text-sm font-black">
                    Question Navigator
                  </h3>
                  <p className="mt-1 text-[11px] text-[#8a8291]">
                    Jump between questions
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNavigator(false)}
                  aria-label="Close navigator"
                  className="rounded-lg p-2 text-[#81798a] hover:bg-[#fff0f5] hover:text-[#ff456c] lg:hidden"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5 p-5">
                {SECTIONS.map((name) => {
                  const items = questions.filter(
                    (q) => getSection(q) === name
                  );

                  if (!items.length) return null;

                  const meta = SECTION_META[name];
                  const Icon = meta.icon;

                  return (
                    <section key={name}>
                      <div className="mb-3 flex items-center gap-2">
                        <Icon
                          size={15}
                          className="text-[#ff456c]"
                        />
                        <h4 className="text-xs font-black">
                          {meta.label}
                        </h4>
                        <span className="ml-auto text-[10px] text-[#938a9a]">
                          {items.length} Q
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-2">
                        {items.map((question) => {
                          const number =
                            questions.findIndex(
                              (q) => q.id === question.id
                            ) + 1;

                          const active = question.id === activeId;
                          const answered = hasAnswer(
                            answers[question.id]
                          );
                          const flagged = flags[question.id];

                          return (
                            <button
                              key={question.id}
                              type="button"
                              disabled={saving}
                              onClick={() =>
                                changeQuestion(question)
                              }
                              title={`Question ${number}${
                                flagged ? " — Flagged" : ""
                              }`}
                              className={`relative flex aspect-square items-center justify-center rounded-xl border text-xs font-black transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                                active
                                  ? "border-[#ff456c] bg-[#ff456c] text-white shadow-[0_5px_15px_rgba(255,69,108,0.18)]"
                                  : answered
                                    ? "border-[#b5ebd2] bg-[#e9faf1] text-[#0d9866] hover:border-[#7ed5ae] dark:border-[#35664e] dark:bg-[#233b31]"
                                    : "border-[#e9e3ed] bg-[#faf8fb] text-[#827a8b] hover:border-[#ffc0d0] hover:bg-[#fff0f5] hover:text-[#ff456c] dark:border-[#473d4f] dark:bg-[#2b2532]"
                              }`}
                            >
                              {number}

                              {flagged && (
                                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-white bg-amber-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}

                {questions.length === 0 && (
                  <p className="text-xs text-[#898292]">
                    No questions returned by the backend.
                  </p>
                )}
              </div>

              <div className="border-t border-[#f0eaf1] bg-[#fdfbfd] p-5 dark:border-[#403746] dark:bg-[#292330]">
                <h4 className="text-xs font-black">
                  Exam Summary
                </h4>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    {
                      label: "Answered",
                      value: answeredCount,
                      color: "text-emerald-600",
                    },
                    {
                      label: "Pending",
                      value: unansweredCount,
                      color: "text-[#ff456c]",
                    },
                    {
                      label: "Flagged",
                      value: flaggedCount,
                      color: "text-amber-600",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-xl border border-[#eee8f0] bg-white p-3 text-center dark:border-[#443b4c] dark:bg-[#211e29] ${hoverStyle}`}
                    >
                      <p className={`text-xl font-black ${item.color}`}>
                        {item.value}
                      </p>
                      <p className="mt-1 text-[10px] text-[#8a8291]">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2 text-[11px] text-[#81798a]">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-[#e9faf1] ring-1 ring-emerald-200" />
                    Answered
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-[#faf8fb] ring-1 ring-[#e9e3ed]" />
                    Not answered
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-[#ff456c]" />
                    Current question
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-amber-400" />
                    Flagged for review
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  disabled={!canEdit || saving}
                  className={`${primaryButton} mt-5 w-full`}
                >
                  <Send size={16} />
                  Finish Examination
                </button>
              </div>
            </div>
          </aside>
        </div>

        <footer className="pb-5 pt-2 text-center text-[11px] text-[#9a91a0] dark:text-[#8d8395]">
          Equilx IELTS · Focus on progress, one question at a time.
        </footer>
      </div>

      {/* SUBMIT CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#17121e]/70 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-exam-title"
            className="my-auto w-full max-w-md rounded-[28px] border border-[#f1e3eb] bg-white p-6 shadow-2xl dark:border-[#4c3b4d] dark:bg-[#241e2b] sm:p-8"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#fff0f5] text-[#ff456c] dark:bg-[#392631]">
              <Send size={28} />
            </div>

            <h2
              id="submit-exam-title"
              className="mt-5 text-center text-xl font-black text-[#292536] dark:text-white"
            >
              Ready to submit your exam?
            </h2>

            <p className="mt-3 text-center text-sm leading-7 text-[#81798a] dark:text-[#bcb3c3]">
              Once submitted, you cannot change your answers.
              Please review your progress before finishing.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#effbf5] p-4 text-center dark:bg-[#22382f]">
                <p className="text-2xl font-black text-emerald-600">
                  {answeredCount}
                </p>
                <p className="mt-1 text-xs text-[#81798a]">
                  Saved answers
                </p>
              </div>

              <div className="rounded-2xl bg-[#fff0f5] p-4 text-center dark:bg-[#392631]">
                <p className="text-2xl font-black text-[#ff456c]">
                  {unansweredCount}
                </p>
                <p className="mt-1 text-xs text-[#81798a]">
                  Unanswered
                </p>
              </div>
            </div>

            {unansweredCount > 0 && (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-6 text-amber-700 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                <AlertCircle
                  size={15}
                  className="mr-1 inline-block"
                />
                Some questions are unanswered. You can go back
                and review them before submitting.
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowSubmitModal(false)}
                className={secondaryButton}
              >
                Review Again
              </button>

              <button
                type="button"
                disabled={submitting || saving}
                onClick={submitExam}
                className={primaryButton}
              >
                {submitting ? (
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
