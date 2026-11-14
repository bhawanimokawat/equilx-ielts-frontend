import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "./StudentLayout";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Clock,
  CalendarDays,
  Headphones,
  MessageCircle,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Circle,
  ArrowRight,
  X,
  Send,
  BookOpen,
  Target,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const sessions = [
  {
    id: 1,
    title: "IELTS Speaking Mock Test",
    part: "Full Speaking Test",
    date: "Today",
    time: "11:30 AM",
    duration: "15 minutes",
    trainer: "Academic Trainer",
    type: "Mock test",
    status: "Upcoming",
    color: "pink",
  },
  {
    id: 2,
    title: "Speaking Part 2 Practice",
    part: "Cue Card Practice",
    date: "Tomorrow",
    time: "2:00 PM",
    duration: "12 minutes",
    trainer: "Academic Trainer",
    type: "Practice",
    status: "Upcoming",
    color: "blue",
  },
  {
    id: 3,
    title: "Fluency & Pronunciation",
    part: "Speaking Part 1",
    date: "18 Oct 2026",
    time: "10:00 AM",
    duration: "10 minutes",
    trainer: "Academic Trainer",
    type: "Practice",
    status: "Completed",
    color: "green",
  },
];

const practiceQuestions = [
  {
    part: "Part 1",
    title: "Introduction and Interview",
    duration: "4–5 minutes",
    description:
      "Answer familiar questions about yourself, your studies, your home and your interests.",
    question: "Do you enjoy learning new things? Why or why not?",
    tip: "Give a direct answer and add a reason or a personal example.",
  },
  {
    part: "Part 2",
    title: "Long Turn",
    duration: "3–4 minutes",
    description:
      "Speak about a topic for up to two minutes after one minute of preparation.",
    question:
      "Describe a book that you enjoyed reading. You should say what the book was, when you read it, what it was about, and explain why you enjoyed it.",
    tip: "Use your preparation minute to note keywords for each cue-card point.",
  },
  {
    part: "Part 3",
    title: "Discussion",
    duration: "4–5 minutes",
    description:
      "Discuss more abstract questions related to the Part 2 topic.",
    question:
      "How do you think reading habits have changed in recent years?",
    tip: "Explain your opinion, support it with an example, and consider another perspective.",
  },
];

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#E7ECF6] bg-white p-4 shadow-[0_3px_14px_rgba(16,38,95,0.035)] sm:p-5 dark:border-[#49333D] dark:bg-[#211e27] ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeading({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF2454] dark:bg-[#3A202B]">
          <Icon size={20} />
        </span>

        <div>
          <h2 className="text-base font-black text-[#10265F] dark:text-[#FFF8FA]">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
              {description}
            </p>
          )}
        </div>
      </div>

      {action}
    </div>
  );
}

export default function LiveSpeakingPage() {
  const navigate = useNavigate();

  const [activePart, setActivePart] = useState(0);
  const [activeTab, setActiveTab] = useState("All sessions");
  const [selectedSession, setSelectedSession] = useState(null);
  const [showPractice, setShowPractice] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [answer, setAnswer] = useState("");
  const [prepSeconds, setPrepSeconds] = useState(60);
  const [prepRunning, setPrepRunning] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("11:00");
  const [scheduleType, setScheduleType] = useState("Mock test");
  const [customSessions, setCustomSessions] = useState([]);
  const [notice, setNotice] = useState("");
  const [submittedAnswers, setSubmittedAnswers] = useState([]);

  const timerRef = useRef(null);
  const allSessions = [...customSessions, ...sessions];

  const visibleSessions = allSessions.filter((session) => {
    if (activeTab === "All sessions") return true;
    return session.status === activeTab;
  });

  const startPreparation = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setPrepSeconds(60);
    setPrepRunning(true);

    timerRef.current = setInterval(() => {
      setPrepSeconds((previous) => {
        if (previous <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setPrepRunning(false);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);
  };

  const stopPreparation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setPrepRunning(false);
  };

  const resetPreparation = () => {
    stopPreparation();
    setPrepSeconds(60);
  };

  const handleSchedule = (event) => {
    event.preventDefault();

    if (!scheduleDate || !scheduleTime) {
      setNotice("Please select a date and time for your session.");
      return;
    }

    const newSession = {
      id: Date.now(),
      title:
        scheduleType === "Mock test"
          ? "IELTS Speaking Mock Test"
          : "IELTS Speaking Practice",
      part:
        scheduleType === "Mock test"
          ? "Full Speaking Test"
          : "Practice Session",
      date: scheduleDate,
      time: scheduleTime,
      duration: scheduleType === "Mock test" ? "15 minutes" : "10 minutes",
      trainer: "Trainer assignment pending",
      type: scheduleType,
      status: "Upcoming",
      color: "pink",
    };

    setCustomSessions((previous) => [newSession, ...previous]);
    setShowSchedule(false);
    setScheduleDate("");
    setScheduleTime("11:00");
    setNotice("Your demo session has been added to the schedule.");
  };

  const submitPractice = (event) => {
    event.preventDefault();

    if (!answer.trim()) {
      setNotice("Write a practice answer before submitting.");
      return;
    }

    setSubmittedAnswers((previous) => [
      {
        id: Date.now(),
        part: practiceQuestions[activePart].part,
        question: practiceQuestions[activePart].question,
        answer: answer.trim(),
        date: new Date().toLocaleString(),
      },
      ...previous,
    ]);

    setNotice(
      "Your answer was saved in this demo. Connect a speech or AI assessment service for real feedback."
    );

    setAnswer("");
    setShowPractice(false);
    resetPreparation();
  };

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentQuestion = practiceQuestions[activePart];

  return (
    <StudentLayout>
      <div className="speaking-page mx-auto max-w-[1800px] space-y-5 text-[#10265F] dark:text-[#FFF8FA]">

        {/* DARK MODE SUPPORT */}
        <style>{`
          html.dark .speaking-page {
            color: #FFF8FA;
          }

          html.dark .speaking-page section.rounded-2xl,
          html.dark .speaking-page .rounded-2xl.border {
            background-color: #211e27;
            border-color: #49333D;
            color: #FFF8FA;
          }

          html.dark .speaking-page [class*="bg-white"] {
            background-color: #211e27 !important;
          }

          html.dark .speaking-page [class*="bg-[#F6F8FE]"],
          html.dark .speaking-page [class*="bg-[#F5F7FF]"],
          html.dark .speaking-page [class*="bg-[#FFF7F9]"],
          html.dark .speaking-page [class*="bg-[#F2F5FD]"],
          html.dark .speaking-page [class*="bg-[#E9EDF7]"] {
            background-color: #30232B !important;
          }

          html.dark .speaking-page [class*="text-[#10265F]"],
          html.dark .speaking-page [class*="text-[#506995]"],
          html.dark .speaking-page [class*="text-[#71809D]"],
          html.dark .speaking-page [class*="text-[#8A9ABB]"],
          html.dark .speaking-page [class*="text-[#9AA8C2]"] {
            color: #C1B5C0 !important;
          }

          html.dark .speaking-page [class*="border-[#E7ECF6]"],
          html.dark .speaking-page [class*="border-[#E2E8F5]"],
          html.dark .speaking-page [class*="border-[#DCE4F3]"],
          html.dark .speaking-page [class*="border-[#CCD7ED]"] {
            border-color: #49333D !important;
          }

          html.dark .speaking-page input,
          html.dark .speaking-page textarea,
          html.dark .speaking-page select {
            background: #30232B;
            color: #FFF8FA;
            border-color: #49333D;
          }

          html.dark .speaking-page input::placeholder,
          html.dark .speaking-page textarea::placeholder {
            color: #9B8D99;
          }

          html.dark .speaking-page [class*="hover:bg-[#FFF7F9]"]:hover,
          html.dark .speaking-page [class*="hover:bg-[#F5F7FF]"]:hover {
            background-color: #30232B !important;
          }

          html.dark [class*="fixed"][class*="z-"] > div,
          html.dark [class*="fixed"][class*="z-"] > form {
            background-color: #211e27 !important;
            color: #FFF8FA;
            border: 1px solid #49333D;
          }

          html.dark [class*="fixed"][class*="z-"] input,
          html.dark [class*="fixed"][class*="z-"] textarea {
            background: #30232B;
            color: #FFF8FA;
            border-color: #49333D;
          }

          html.dark [class*="fixed"][class*="z-"] [class*="text-[#71809D]"],
          html.dark [class*="fixed"][class*="z-"] [class*="text-[#506995]"],
          html.dark [class*="fixed"][class*="z-"] [class*="text-[#8A9ABB]"] {
            color: #C1B5C0 !important;
          }

          html.dark [class*="fixed"][class*="z-"] [class*="border-[#E2E8F5]"],
          html.dark [class*="fixed"][class*="z-"] [class*="border-[#E7ECF6]"] {
            border-color: #49333D !important;
          }

          html.dark [class*="fixed"][class*="z-"] [class*="bg-[#F6F8FE]"],
          html.dark [class*="fixed"][class*="z-"] [class*="bg-[#F5F7FF]"] {
            background-color: #30232B !important;
          }
        `}</style>

        {/* HERO BANNER */}
        <section className="relative min-h-[190px] overflow-hidden rounded-2xl border border-[#E7ECF6] bg-[#F5F7FF] dark:border-[#49333D]">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=85"
            alt="Students practising and preparing for an IELTS speaking test"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/35 dark:from-[#171419] dark:via-[#171419]/90 dark:to-[#171419]/30" />

          <div className="relative z-10 flex min-h-[190px] items-center p-5 sm:p-6">
            <div className="max-w-[620px]">
              <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FF2454]">
                <Sparkles size={15} /> IELTS speaking studio
              </p>

              <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                Speak with <span className="text-[#FF2454]">confidence.</span>
              </h1>

              <p className="mt-2 max-w-xl text-xs leading-5 text-[#506995] dark:text-[#C1B5C0] sm:text-sm">
                Practise all three IELTS Speaking parts, prepare for mock tests
                and build confidence one answer at a time.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActivePart(0);
                    setAnswer("");
                    setShowPractice(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FF2454] px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:bg-[#E81745]"
                >
                  <Mic size={16} /> Start practising
                </button>

                <button
                  type="button"
                  onClick={() => setShowSchedule(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F5] bg-white/95 px-4 py-2.5 text-xs font-bold text-[#10265F] transition hover:border-[#FF9BAF] dark:border-[#49333D] dark:bg-[#211e27]/95 dark:text-[#FFF8FA]"
                >
                  <CalendarDays size={16} /> Schedule session
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* NOTICE */}
        {notice && (
          <div className="flex items-start gap-2 rounded-xl border border-[#F6D4DC] bg-[#FFF5F7] p-3 text-xs text-[#A51D42] dark:border-[#693747] dark:bg-[#30232B] dark:text-[#FF9BAF]">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>{notice}</p>
            <button
              type="button"
              onClick={() => setNotice("")}
              className="ml-auto"
              aria-label="Dismiss message"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* OVERVIEW CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Sessions completed",
              value: 8 + submittedAnswers.length,
              detail: "Keep building your confidence",
              icon: CheckCircle2,
              color: "#00A879",
              bg: "bg-[#E5F9F1] dark:bg-[#1D3932]",
            },
            {
              label: "Practice duration",
              value: "2h 35m",
              detail: "Total speaking practice",
              icon: Clock,
              color: "#1680E8",
              bg: "bg-[#EAF4FF] dark:bg-[#1E3042]",
            },
            {
              label: "Current target band",
              value: "7.5",
              detail: "Your personal goal",
              icon: Target,
              color: "#873BFA",
              bg: "bg-[#F3EAFF] dark:bg-[#30243D]",
            },
            {
              label: "Upcoming sessions",
              value: allSessions.filter((s) => s.status === "Upcoming").length,
              detail: "Sessions on your schedule",
              icon: CalendarDays,
              color: "#FF2454",
              bg: "bg-[#FFF0F3] dark:bg-[#3A202B]",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Panel key={item.label} className="flex items-center gap-3">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.bg}`}
                  style={{ color: item.color }}
                >
                  <Icon size={22} />
                </span>

                <div>
                  <p className="text-xs text-[#71809D] dark:text-[#C1B5C0]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-2xl font-black">{item.value}</p>
                  <p className="mt-1 text-[10px] text-[#71809D] dark:text-[#C1B5C0]">
                    {item.detail}
                  </p>
                </div>
              </Panel>
            );
          })}
        </div>

        {/* SPEAKING PARTS */}
        <Panel>
          <SectionHeading
            icon={MessageCircle}
            title="Explore speaking practice"
            description="Choose a part to practise its question style and timing."
          />

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {practiceQuestions.map((part, index) => (
              <button
                key={part.part}
                type="button"
                onClick={() => {
                  setActivePart(index);
                  setAnswer("");
                  setShowPractice(true);
                }}
                className={`group rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                  activePart === index
                    ? "border-[#FF9BAF] bg-[#FFF7F9] dark:border-[#A94B62] dark:bg-[#30232B]"
                    : "border-[#E7ECF6] bg-white hover:border-[#CCD7ED] dark:border-[#49333D] dark:bg-[#211e27] dark:hover:bg-[#30232B]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-[#FFF0F3] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#FF2454] dark:bg-[#3A202B]">
                    {part.part}
                  </span>

                  <ArrowRight
                    size={17}
                    className="text-[#8A9ABB] transition group-hover:translate-x-1 group-hover:text-[#FF2454]"
                  />
                </div>

                <h3 className="mt-4 text-base font-extrabold">{part.title}</h3>

                <p className="mt-2 text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                  {part.description}
                </p>

                <div className="mt-4 flex items-center gap-2 border-t border-[#E7ECF6] pt-3 text-[11px] font-semibold text-[#506995] dark:border-[#49333D] dark:text-[#C1B5C0]">
                  <Clock size={14} /> {part.duration}
                </div>
              </button>
            ))}
          </div>
        </Panel>

        {/* UPCOMING SESSIONS */}
        <Panel>
          <SectionHeading
            icon={CalendarDays}
            title="Speaking sessions"
            description="Review your upcoming sessions and past practice."
            action={
              <button
                type="button"
                onClick={() => setShowSchedule(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F5] px-3 py-2 text-xs font-bold transition hover:border-[#FF9BAF] hover:bg-[#FFF7F9] dark:border-[#49333D] dark:hover:bg-[#30232B]"
              >
                <CalendarDays size={15} /> Schedule
              </button>
            }
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {["All sessions", "Upcoming", "Completed"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                  activeTab === tab
                    ? "border-[#FF2454] bg-[#FF2454] text-white"
                    : "border-[#E2E8F5] text-[#506995] hover:border-[#FF9BAF] dark:border-[#49333D] dark:text-[#C1B5C0]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {visibleSessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col gap-3 rounded-xl border border-[#E7ECF6] p-4 transition hover:border-[#CCD7ED] dark:border-[#49333D] dark:hover:border-[#74505F] sm:flex-row sm:items-center"
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    session.color === "green"
                      ? "bg-[#E5F9F1] text-[#00A879] dark:bg-[#1D3932]"
                      : session.color === "blue"
                        ? "bg-[#EAF4FF] text-[#1680E8] dark:bg-[#1E3042]"
                        : "bg-[#FFF0F3] text-[#FF2454] dark:bg-[#3A202B]"
                  }`}
                >
                  <Mic size={20} />
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-extrabold">{session.title}</h3>
                  <p className="mt-1 text-xs text-[#71809D] dark:text-[#C1B5C0]">
                    {session.part}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#8A9ABB] dark:text-[#A99BA7]">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={12} /> {session.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {session.time}
                    </span>
                    <span>{session.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:ml-auto">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      session.status === "Completed"
                        ? "bg-[#E5F9F1] text-[#008A60]"
                        : "bg-[#EAF4FF] text-[#2466C2]"
                    }`}
                  >
                    {session.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedSession(session)}
                    className="rounded-xl border border-[#E2E8F5] px-3 py-2 text-xs font-bold transition hover:border-[#FF9BAF] hover:text-[#FF2454] dark:border-[#49333D]"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}

            {visibleSessions.length === 0 && (
              <p className="rounded-xl border border-dashed border-[#DCE4F3] p-6 text-center text-xs text-[#71809D] dark:border-[#49333D] dark:text-[#C1B5C0]">
                No sessions in this category.
              </p>
            )}
          </div>
        </Panel>

        {/* STUDY TIPS */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel>
            <SectionHeading
              icon={Headphones}
              title="Before your speaking test"
              description="A quick checklist to help you prepare."
            />

            <div className="mt-4 space-y-3">
              {[
                "Test your microphone and audio setup.",
                "Speak naturally instead of memorising answers.",
                "Give reasons and examples to extend your answers.",
                "Practise speaking clearly at a comfortable pace.",
              ].map((tip) => (
                <div key={tip} className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-[#00A879]"
                  />
                  <p className="text-xs leading-5 text-[#506995] dark:text-[#C1B5C0]">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="bg-gradient-to-br from-white to-[#F3F7FF] dark:from-[#211e27] dark:to-[#30232B]">
            <SectionHeading
              icon={ShieldCheck}
              title="Build a consistent routine"
              description="Short, regular practice is more useful than last-minute cramming."
            />

            <div className="mt-4 rounded-xl border border-[#E2EAF8] bg-white p-4 dark:border-[#49333D] dark:bg-[#30232B]">
              <p className="text-sm font-extrabold">Your suggested routine</p>

              <div className="mt-3 space-y-3">
                {[
                  ["5 minutes", "Answer Part 1 questions"],
                  ["10 minutes", "Practise one cue card"],
                  ["5 minutes", "Review vocabulary and fluency"],
                ].map(([time, label]) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="min-w-[85px] rounded-lg bg-[#FFF0F3] px-2 py-2 text-center text-[10px] font-extrabold text-[#FF2454] dark:bg-[#3A202B]">
                      {time}
                    </span>
                    <span className="text-xs text-[#506995] dark:text-[#C1B5C0]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>

        {/* SAVED ANSWERS */}
        {submittedAnswers.length > 0 && (
          <Panel>
            <SectionHeading
              icon={BookOpen}
              title="Your saved practice answers"
              description="Answers submitted in this browser session."
            />

            <div className="mt-4 space-y-3">
              {submittedAnswers.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#E7ECF6] p-4 dark:border-[#49333D]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-extrabold">{item.part}</p>
                    <span className="text-[10px] text-[#8A9ABB] dark:text-[#A99BA7]">
                      {item.date}
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-semibold">{item.question}</p>
                  <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        )}

        <p className="pb-2 text-center text-[11px] text-[#9AA8C2] dark:text-[#A99BA7]">
          Equilx IELTS · Practise with purpose.
        </p>
      </div>

      {/* PRACTICE MODAL */}
      {showPractice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#081633]/60 p-4 backdrop-blur-sm">
          <div className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl dark:border dark:border-[#49333D] dark:bg-[#211e27] dark:text-[#FFF8FA] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FF2454]">
                  IELTS Speaking Studio
                </p>

                <h2 className="mt-2 text-xl font-black">
                  {currentQuestion.title}
                </h2>

                <p className="mt-1 text-xs text-[#71809D] dark:text-[#C1B5C0]">
                  {currentQuestion.part} · {currentQuestion.duration}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPractice(false);
                  resetPreparation();
                }}
                aria-label="Close practice"
                className="rounded-lg p-2 text-[#71809D] hover:bg-[#F5F7FF] dark:text-[#C1B5C0] dark:hover:bg-[#30232B]"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {practiceQuestions.map((part, index) => (
                <button
                  key={part.part}
                  type="button"
                  onClick={() => {
                    setActivePart(index);
                    setAnswer("");
                    resetPreparation();
                  }}
                  className={`rounded-xl border px-2 py-3 text-xs font-bold transition ${
                    activePart === index
                      ? "border-[#FF2454] bg-[#FFF0F3] text-[#FF2454] dark:bg-[#3A202B]"
                      : "border-[#E2E8F5] text-[#506995] dark:border-[#49333D] dark:text-[#C1B5C0]"
                  }`}
                >
                  {part.part}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-xl bg-[#F6F8FE] p-4 dark:bg-[#30232B]">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#71809D] dark:text-[#C1B5C0]">
                Your question
              </p>

              <p className="mt-2 text-sm font-semibold leading-6">
                {currentQuestion.question}
              </p>

              <p className="mt-3 text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                <span className="font-bold text-[#FF2454]">Tip: </span>
                {currentQuestion.tip}
              </p>
            </div>

            {activePart === 1 && (
              <div className="mt-4 rounded-xl border border-[#E7ECF6] p-4 dark:border-[#49333D]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold">Preparation timer</p>
                    <p className="mt-1 text-[10px] text-[#71809D] dark:text-[#C1B5C0]">
                      Use this minute to plan your cue-card response.
                    </p>
                  </div>

                  <p className="text-2xl font-black tabular-nums text-[#FF2454]">
                    {String(Math.floor(prepSeconds / 60)).padStart(2, "0")}:
                    {String(prepSeconds % 60).padStart(2, "0")}
                  </p>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={prepRunning ? stopPreparation : startPreparation}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#FF2454] px-3 py-2 text-xs font-bold text-white"
                  >
                    {prepRunning ? <Pause size={14} /> : <Play size={14} />}
                    {prepRunning ? "Pause timer" : "Start 1-minute timer"}
                  </button>

                  <button
                    type="button"
                    onClick={resetPreparation}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F5] px-3 py-2 text-xs font-bold text-[#506995] dark:border-[#49333D] dark:text-[#C1B5C0]"
                  >
                    <RotateCcw size={14} /> Reset
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={submitPractice} className="mt-4">
              <label htmlFor="speaking-answer" className="text-xs font-extrabold">
                Practise your answer
              </label>

              <textarea
                id="speaking-answer"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                rows={6}
                required
                placeholder="Type a practice transcript or outline your answer here..."
                className="mt-2 w-full resize-y rounded-xl border border-[#E2E8F5] px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[#9AA8C2] focus:border-[#FF8199] dark:border-[#49333D] dark:bg-[#30232B] dark:text-[#FFF8FA]"
              />

              <p className="mt-2 text-right text-[10px] text-[#8A9ABB] dark:text-[#A99BA7]">
                {answer.trim() ? answer.trim().split(/\s+/).length : 0} words
              </p>

              <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setShowPractice(false);
                    resetPreparation();
                  }}
                  className="flex-1 rounded-xl border border-[#E2E8F5] px-4 py-3 text-sm font-bold text-[#506995] hover:bg-[#F5F7FF] dark:border-[#49333D] dark:text-[#C1B5C0] dark:hover:bg-[#30232B]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#E81745]"
                >
                  <Send size={16} /> Save practice answer
                </button>
              </div>
            </form>

            <p className="mt-4 text-[10px] leading-5 text-[#8A9ABB] dark:text-[#A99BA7]">
              This practice form saves text only. Live microphone, video calls,
              speech recognition and AI scoring require separate integrations.
            </p>
          </div>
        </div>
      )}

      {/* SESSION DETAILS MODAL */}
      {selectedSession && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#081633]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:border dark:border-[#49333D] dark:bg-[#211e27] dark:text-[#FFF8FA] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FF2454]">
                  Session details
                </p>
                <h2 className="mt-2 text-lg font-black">
                  {selectedSession.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="rounded-lg p-2 text-[#71809D] hover:bg-[#F5F7FF] dark:text-[#C1B5C0] dark:hover:bg-[#30232B]"
                aria-label="Close session details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 rounded-xl bg-[#F6F8FE] p-4 dark:bg-[#30232B]">
              {[
                ["Session type", selectedSession.type],
                ["Practice format", selectedSession.part],
                ["Date", selectedSession.date],
                ["Time", selectedSession.time],
                ["Duration", selectedSession.duration],
                ["Trainer", selectedSession.trainer],
                ["Status", selectedSession.status],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-3 text-xs"
                >
                  <span className="text-[#71809D] dark:text-[#C1B5C0]">
                    {label}
                  </span>
                  <span className="text-right font-bold">{value}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedSession(null);
                setActivePart(0);
                setShowPractice(true);
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#E81745]"
            >
              <Mic size={16} /> Start practice instead
            </button>
          </div>
        </div>
      )}

      {/* SCHEDULE MODAL */}
      {showSchedule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#081633]/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSchedule}
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:border dark:border-[#49333D] dark:bg-[#211e27] dark:text-[#FFF8FA] sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FF2454]">
                  Session planner
                </p>
                <h2 className="mt-2 text-xl font-black">
                  Schedule speaking practice
                </h2>
                <p className="mt-1 text-xs text-[#71809D] dark:text-[#C1B5C0]">
                  Add a session to your local demo schedule.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSchedule(false)}
                className="rounded-lg p-2 text-[#71809D] hover:bg-[#F5F7FF] dark:text-[#C1B5C0] dark:hover:bg-[#30232B]"
                aria-label="Close schedule form"
              >
                <X size={18} />
              </button>
            </div>

            <label className="mt-5 block text-xs font-bold">Session type</label>

            <div className="mt-2 grid grid-cols-2 gap-2">
              {["Mock test", "Practice"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setScheduleType(type)}
                  className={`rounded-xl border px-3 py-3 text-xs font-bold transition ${
                    scheduleType === type
                      ? "border-[#FF2454] bg-[#FFF0F3] text-[#FF2454] dark:bg-[#3A202B]"
                      : "border-[#E2E8F5] text-[#506995] dark:border-[#49333D] dark:text-[#C1B5C0]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <label htmlFor="session-date" className="mt-4 block text-xs font-bold">
              Preferred date
            </label>

            <input
              id="session-date"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={scheduleDate}
              onChange={(event) => setScheduleDate(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-[#E2E8F5] px-3 py-3 text-sm outline-none focus:border-[#FF8199] dark:border-[#49333D] dark:bg-[#30232B] dark:text-[#FFF8FA]"
            />

            <label htmlFor="session-time" className="mt-4 block text-xs font-bold">
              Preferred time
            </label>

            <input
              id="session-time"
              type="time"
              value={scheduleTime}
              onChange={(event) => setScheduleTime(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-[#E2E8F5] px-3 py-3 text-sm outline-none focus:border-[#FF8199] dark:border-[#49333D] dark:bg-[#30232B] dark:text-[#FFF8FA]"
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowSchedule(false)}
                className="flex-1 rounded-xl border border-[#E2E8F5] px-4 py-3 text-sm font-bold text-[#506995] dark:border-[#49333D] dark:text-[#C1B5C0]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-bold text-white hover:bg-[#E81745]"
              >
                <CalendarDays size={16} /> Add session
              </button>
            </div>

            <p className="mt-3 text-[10px] leading-5 text-[#8A9ABB] dark:text-[#A99BA7]">
              This demo creates a local session entry only. Actual trainer booking
              and calendar synchronisation require backend integration.
            </p>
          </form>
        </div>
      )}
    </StudentLayout>
  );
}