import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, Brain, PenLine, Mic, Headphones, BookOpen, ArrowRight,
  ChevronDown, CheckCircle2, AlertCircle, Target, TrendingUp, Clock,
  FileText, Send, RefreshCw, Lightbulb, MessageSquare, X,
} from "lucide-react";
import StudentLayout from "./StudentLayout";

const initialFeedback = [
  {
    id: 1,
    title: "IELTS Writing Task 2",
    type: "Writing",
    date: "Today, 10:30 AM",
    score: 6.5,
    status: "Reviewed",
    topic: "Advantages and disadvantages of online education",
    summary: "Your essay has a clear position and relevant examples. Improve paragraph development and use more varied sentence structures to strengthen your response.",
    strengths: [
      "Clear introduction and position",
      "Relevant examples support your ideas",
      "Good use of linking expressions",
    ],
    improvements: [
      "Develop each main idea with more explanation",
      "Avoid repeating the same vocabulary",
      "Check article usage and complex sentence accuracy",
    ],
    criteria: [
      { name: "Task Response", score: 7.0, detail: "The main question is addressed with a clear position." },
      { name: "Coherence & Cohesion", score: 6.5, detail: "Ideas are organised logically, but some links can be smoother." },
      { name: "Lexical Resource", score: 6.0, detail: "Vocabulary is relevant; use more precise synonyms." },
      { name: "Grammar Range & Accuracy", score: 6.0, detail: "Review articles, punctuation and complex sentence structures." },
    ],
  },
  {
    id: 2,
    title: "IELTS Speaking Part 2",
    type: "Speaking",
    date: "Yesterday, 4:15 PM",
    score: 7.0,
    status: "Reviewed",
    topic: "Describe a skill you would like to learn",
    summary: "You communicated your ideas clearly and maintained a natural flow. Add more specific examples and practise stress and intonation to make your answer more engaging.",
    strengths: [
      "Clear and relevant response",
      "Good fluency with few long pauses",
      "Appropriate vocabulary for the topic",
    ],
    improvements: [
      "Use more specific supporting examples",
      "Vary intonation to emphasise key points",
      "Practise less common topic-related vocabulary",
    ],
    criteria: [
      { name: "Fluency & Coherence", score: 7.0, detail: "Your response is generally clear and well organised." },
      { name: "Lexical Resource", score: 7.0, detail: "Good topic vocabulary with opportunities for more variety." },
      { name: "Grammar Range & Accuracy", score: 6.5, detail: "Use a wider range of complex structures." },
      { name: "Pronunciation", score: 7.0, detail: "Generally understandable; continue practising word stress." },
    ],
  },
  {
    id: 3,
    title: "IELTS Writing Task 1",
    type: "Writing",
    date: "18 Oct 2026",
    score: 6.0,
    status: "Reviewed",
    topic: "Describe changes in city transport",
    summary: "Your report includes the key information, but the overview needs to highlight the most significant trends. Work on accurate comparisons and data descriptions.",
    strengths: [
      "Includes relevant information",
      "Uses a suitable report structure",
      "Attempts to compare categories",
    ],
    improvements: [
      "Write a clearer overview",
      "Compare the most important figures",
      "Use more accurate comparative language",
    ],
    criteria: [
      { name: "Task Achievement", score: 6.0, detail: "Main features are included but need stronger selection." },
      { name: "Coherence & Cohesion", score: 6.0, detail: "Paragraphing is appropriate; improve transitions." },
      { name: "Lexical Resource", score: 6.0, detail: "Use more precise language for changes and comparisons." },
      { name: "Grammar Range & Accuracy", score: 5.5, detail: "Check tense consistency and comparative structures." },
    ],
  },
];

const skillOptions = [
  { label: "Writing", icon: PenLine },
  { label: "Speaking", icon: Mic },
];

function Panel({ children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-[#E7ECF6] bg-white p-4 shadow-[0_3px_14px_rgba(16,38,95,0.035)] sm:p-5 dark:border-[#49333D] dark:bg-[#211e27] ${className}`}>
      {children}
    </section>
  );
}

function BandPill({ score }) {
  const style =
    score >= 7
      ? "bg-[#DDF8EE] text-[#008A60]"
      : score >= 6
        ? "bg-[#E5F0FF] text-[#2466C2]"
        : "bg-[#FFF0E1] text-[#D97706]";

  return (
    <span className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-extrabold ${style}`}>
      Band {score.toFixed(1)}
    </span>
  );
}

export default function AIFeedbackPage() {
  const navigate = useNavigate();

  const [feedbackList, setFeedbackList] = useState(initialFeedback);
  const [activeTab, setActiveTab] = useState("All feedback");
  const [selectedFeedback, setSelectedFeedback] = useState(initialFeedback[0]);
  const [submissionType, setSubmissionType] = useState("Writing");
  const [essayTitle, setEssayTitle] = useState("");
  const [essayText, setEssayText] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notice, setNotice] = useState("");

  const visibleFeedback = feedbackList.filter((item) => {
    if (activeTab === "All feedback") return true;
    return item.type === activeTab;
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!essayTitle.trim() || !essayText.trim()) {
      setNotice("Please enter a title and your response before submitting.");
      return;
    }

    setIsGenerating(true);
    setNotice("");

    // Frontend demo only: no AI API is called here.
    window.setTimeout(() => {
      const newFeedback = {
        id: Date.now(),
        title: submissionType === "Writing" ? "IELTS Writing Practice" : "IELTS Speaking Practice",
        type: submissionType,
        date: "Just now",
        score: 0,
        status: "Awaiting AI connection",
        topic: essayTitle.trim(),
        summary: "Your response has been saved in this demo interface. Connect an AI feedback API to generate an actual IELTS band estimate, detailed comments and skill analysis.",
        strengths: [
          "Submission captured successfully",
          "Ready for detailed review",
        ],
        improvements: [
          "Connect the AI feedback endpoint to assess this response",
          "Review the official IELTS assessment criteria",
        ],
        criteria: [
          { name: "Assessment status", score: 0, detail: "An AI service must be connected to calculate a score." },
        ],
      };

      setFeedbackList((previous) => [newFeedback, ...previous]);
      setSelectedFeedback(newFeedback);
      setShowSubmitModal(false);
      setEssayTitle("");
      setEssayText("");
      setIsGenerating(false);
      setNotice("Submission added. Connect your AI API for actual scoring.");
    }, 500);
  };

  return (
    <StudentLayout>
      <div className="ai-feedback-page mx-auto max-w-[1800px] space-y-5 text-[#10265F] dark:text-[#FFF8FA]">

        {/* DARK MODE SUPPORT */}
        <style>{`
          html.dark .ai-feedback-page {
            color: #FFF8FA;
          }

          html.dark .ai-feedback-page section.rounded-2xl,
          html.dark .ai-feedback-page .rounded-2xl.border,
          html.dark .ai-feedback-page form {
            background-color: #211e27;
            border-color: #49333D;
            color: #FFF8FA;
          }

          html.dark .ai-feedback-page [class*="bg-white"] {
            background-color: #211e27 !important;
          }

          html.dark .ai-feedback-page [class*="bg-[#F6F8FE]"],
          html.dark .ai-feedback-page [class*="bg-[#F5F7FF]"],
          html.dark .ai-feedback-page [class*="bg-[#F2F5FD]"],
          html.dark .ai-feedback-page [class*="bg-[#F0F3FA]"],
          html.dark .ai-feedback-page [class*="bg-[#E9EDF7]"],
          html.dark .ai-feedback-page [class*="bg-[#EDF1F9]"] {
            background-color: #30232B !important;
          }

          html.dark .ai-feedback-page [class*="text-[#10265F]"],
          html.dark .ai-feedback-page [class*="text-[#506995]"],
          html.dark .ai-feedback-page [class*="text-[#71809D]"],
          html.dark .ai-feedback-page [class*="text-[#8A9ABB]"],
          html.dark .ai-feedback-page [class*="text-[#9AA8C2]"] {
            color: #C1B5C0 !important;
          }

          html.dark .ai-feedback-page [class*="border-[#E7ECF6]"],
          html.dark .ai-feedback-page [class*="border-[#E2E8F5]"],
          html.dark .ai-feedback-page [class*="border-[#DCE4F3]"],
          html.dark .ai-feedback-page [class*="border-[#CCD7ED]"] {
            border-color: #49333D !important;
          }

          html.dark .ai-feedback-page input,
          html.dark .ai-feedback-page textarea {
            background: #30232B;
            color: #FFF8FA;
            border-color: #49333D;
          }

          html.dark .ai-feedback-page input::placeholder,
          html.dark .ai-feedback-page textarea::placeholder {
            color: #9B8D99;
          }

          html.dark .ai-feedback-page [class*="hover:bg-[#FFF7F9]"]:hover,
          html.dark .ai-feedback-page [class*="hover:bg-[#F5F7FF]"]:hover {
            background-color: #30232B !important;
          }

          html.dark .ai-feedback-page [class*="bg-gradient-to-br"] {
            background-image: linear-gradient(to bottom right, #211e27, #30232B) !important;
          }

          html.dark .ai-feedback-page [class*="bg-[#F6F9FF]"] {
            background-color: #30232B !important;
          }
        `}</style>

        {/* HERO BANNER */}
        <section className="relative min-h-[154px] overflow-hidden rounded-2xl border border-[#E7ECF6] bg-[#F5F7FF] dark:border-[#49333D]">
          <img
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=85"
            alt="IELTS study desk"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/20 dark:from-[#171419] dark:via-[#171419]/90 dark:to-[#171419]/20" />

          <div className="relative z-10 flex min-h-[154px] items-center p-5 sm:p-7">
            <div className="max-w-[430px]">
              <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF2454]">
                <Sparkles size={15} />
                AI-powered insights
              </p>

              <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-[#10265F] dark:text-[#FFF8FA] sm:text-4xl">
                Your AI <span className="text-[#FF2454]">Feedback.</span>
              </h1>

              <p className="mt-2 max-w-md text-xs leading-5 text-[#506995] dark:text-[#C1B5C0] sm:text-sm">
                Review your IELTS practice, understand your performance and identify what to improve next.
              </p>

              <button
                type="button"
                onClick={() => {
                  setNotice("");
                  setShowSubmitModal(true);
                }}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#FF2454] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-100 transition hover:bg-[#E81745]"
              >
                <Sparkles size={16} />
                Get new feedback
              </button>
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

        {/* SUMMARY STATS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Feedback reports",
              value: feedbackList.length,
              detail: "Across your practice",
              icon: FileText,
              color: "#FF2454",
              bg: "bg-[#FFF0F3] dark:bg-[#3A202B]",
            },
            {
              label: "Writing band",
              value: "6.5",
              detail: "Latest reviewed writing",
              icon: PenLine,
              color: "#873BFA",
              bg: "bg-[#F3EAFF] dark:bg-[#30243D]",
            },
            {
              label: "Speaking band",
              value: "7.0",
              detail: "Latest reviewed speaking",
              icon: Mic,
              color: "#00A879",
              bg: "bg-[#E5F9F1] dark:bg-[#1D3932]",
            },
            {
              label: "Next target",
              value: "7.5",
              detail: "Keep working towards it",
              icon: Target,
              color: "#1680E8",
              bg: "bg-[#EAF4FF] dark:bg-[#1E3042]",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <Panel key={stat.label} className="flex items-center gap-3">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}
                  style={{ color: stat.color }}
                >
                  <Icon size={22} />
                </span>
                <div>
                  <p className="text-xs text-[#71809D] dark:text-[#C1B5C0]">{stat.label}</p>
                  <p className="mt-1 text-2xl font-black">{stat.value}</p>
                  <p className="mt-1 text-[10px] text-[#71809D] dark:text-[#A99BA7]">{stat.detail}</p>
                </div>
              </Panel>
            );
          })}
        </div>

        {/* FEEDBACK HISTORY */}
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
          <div className="min-w-0 space-y-4">
            <Panel>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black">Feedback history</h2>
                  <p className="mt-1 text-xs text-[#71809D] dark:text-[#C1B5C0]">
                    Select a report to see its detailed analysis.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["All feedback", "Writing", "Speaking"].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                        activeTab === tab
                          ? "border-[#FF2454] bg-[#FF2454] text-white"
                          : "border-[#E2E8F5] bg-white text-[#506995] hover:border-[#FF9BAF] dark:border-[#49333D] dark:bg-[#30232B] dark:text-[#C1B5C0]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {visibleFeedback.map((item) => {
                  const active = selectedFeedback?.id === item.id;
                  const Icon = item.type === "Writing" ? PenLine : Mic;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedFeedback(item)}
                      className={`flex w-full flex-col gap-3 rounded-xl border p-4 text-left transition sm:flex-row sm:items-center ${
                        active
                          ? "border-[#FF9BAF] bg-[#FFF7F9] dark:border-[#A94B62] dark:bg-[#30232B]"
                          : "border-[#E7ECF6] bg-white hover:border-[#CCD7ED] dark:border-[#49333D] dark:bg-[#211e27] dark:hover:bg-[#30232B]"
                      }`}
                    >
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        item.type === "Writing"
                          ? "bg-[#FFF0F3] text-[#FF2454] dark:bg-[#3A202B]"
                          : "bg-[#E5F9F1] text-[#00A879] dark:bg-[#1D3932]"
                      }`}>
                        <Icon size={20} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-extrabold">{item.title}</span>
                        <span className="mt-1 block text-xs text-[#71809D] dark:text-[#C1B5C0]">{item.topic}</span>
                        <span className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-[#8A9ABB] dark:text-[#A99BA7]">
                          <Clock size={12} />
                          {item.date}
                          <span className="rounded-full bg-[#F0F3FA] px-2 py-1 dark:bg-[#30232B]">{item.type}</span>
                        </span>
                      </span>

                      <span className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                        {item.score > 0 ? (
                          <BandPill score={item.score} />
                        ) : (
                          <span className="rounded-lg bg-[#FFF4E5] px-2.5 py-1.5 text-[10px] font-bold text-[#B76B00]">
                            Awaiting score
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px] font-bold text-[#FF2454]">
                          View details <ArrowRight size={13} />
                        </span>
                      </span>
                    </button>
                  );
                })}

                {visibleFeedback.length === 0 && (
                  <div className="rounded-xl border border-dashed border-[#DCE4F3] p-8 text-center dark:border-[#49333D]">
                    <FileText size={26} className="mx-auto text-[#8A9ABB]" />
                    <p className="mt-3 text-sm font-bold">No feedback found</p>
                    <p className="mt-1 text-xs text-[#71809D] dark:text-[#C1B5C0]">
                      Submit a practice response to start building your history.
                    </p>
                  </div>
                )}
              </div>
            </Panel>

            {/* DETAILED FEEDBACK */}
            {selectedFeedback && (
              <Panel>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FF2454]">
                      Detailed analysis
                    </p>
                    <h2 className="mt-2 text-lg font-black">{selectedFeedback.title}</h2>
                    <p className="mt-1 text-xs text-[#71809D] dark:text-[#C1B5C0]">{selectedFeedback.topic}</p>
                  </div>
                  {selectedFeedback.score > 0 && <BandPill score={selectedFeedback.score} />}
                </div>

                <div className="mt-4 rounded-xl bg-[#F6F8FE] p-4 dark:bg-[#30232B]">
                  <div className="flex items-center gap-2">
                    <Sparkles size={17} className="text-[#FF2454]" />
                    <h3 className="text-xs font-extrabold">Summary feedback</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#506995] dark:text-[#C1B5C0]">
                    {selectedFeedback.summary}
                  </p>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-[#D8F1E7] p-4 dark:border-[#285846]">
                    <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#008A60]">
                      <CheckCircle2 size={17} /> What you did well
                    </h3>
                    <div className="mt-3 space-y-3">
                      {selectedFeedback.strengths.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#00A879]" />
                          <p className="text-xs leading-5 text-[#506995] dark:text-[#C1B5C0]">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#F6DCE2] p-4 dark:border-[#693747]">
                    <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#FF2454]">
                      <Target size={17} /> Areas to improve
                    </h3>
                    <div className="mt-3 space-y-3">
                      {selectedFeedback.improvements.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#FF2454]" />
                          <p className="text-xs leading-5 text-[#506995] dark:text-[#C1B5C0]">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <h3 className="mt-5 text-sm font-extrabold">Assessment criteria</h3>
                <p className="mt-1 text-xs text-[#71809D] dark:text-[#C1B5C0]">
                  Sample criterion breakdown for this demo report.
                </p>

                <div className="mt-3 space-y-3">
                  {selectedFeedback.criteria.map((criterion) => (
                    <div key={criterion.name} className="rounded-xl border border-[#E7ECF6] p-3 dark:border-[#49333D]">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-bold">{criterion.name}</p>
                        {criterion.score > 0 && <BandPill score={criterion.score} />}
                      </div>
                      <p className="mt-2 text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                        {criterion.detail}
                      </p>
                      {criterion.score > 0 && (
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EDF1F9] dark:bg-[#49333D]">
                          <div
                            className="h-full rounded-full bg-[#FF2454]"
                            style={{ width: `${(criterion.score / 9) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Panel>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <aside className="space-y-4">
            <Panel className="bg-gradient-to-br from-white to-[#FFF3F6] dark:from-[#211e27] dark:to-[#30232B]">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE1E8] text-[#FF2454] dark:bg-[#3A202B]">
                  <Target size={20} />
                </span>
                <h3 className="text-sm font-extrabold">Your improvement plan</h3>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                Focus on these actions to work towards your target band.
              </p>

              <div className="mt-4 space-y-4">
                {[
                  { label: "Writing coherence", value: 65, color: "#FF2454" },
                  { label: "Vocabulary range", value: 70, color: "#873BFA" },
                  { label: "Grammar accuracy", value: 58, color: "#1680E8" },
                  { label: "Speaking fluency", value: 78, color: "#00A879" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold">{item.label}</span>
                      <span className="text-[11px] font-extrabold" style={{ color: item.color }}>
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#E9EDF7] dark:bg-[#49333D]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.value}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#1680E8] dark:bg-[#1E3042]">
                  <Lightbulb size={20} />
                </span>
                <h3 className="text-sm font-extrabold">AI study tips</h3>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  "Plan your essay before you start writing.",
                  "Use topic-specific vocabulary naturally.",
                  "Record your speaking practice and review pauses.",
                  "Check grammar and spelling before submitting.",
                ].map((tip, index) => (
                  <div key={tip} className="flex items-start gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#F2F5FD] text-[10px] font-extrabold dark:bg-[#30232B]">
                      {index + 1}
                    </span>
                    <p className="text-xs leading-5 text-[#506995] dark:text-[#C1B5C0]">{tip}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel>
              <h3 className="text-sm font-extrabold">Continue practising</h3>
              <p className="mt-2 text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                Apply your feedback in another practice session.
              </p>

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => navigate("/practice")}
                  className="flex w-full items-center justify-between rounded-xl border border-[#E7ECF6] p-3 text-left transition hover:border-[#FF9BAF] hover:bg-[#FFF7F9] dark:border-[#49333D] dark:hover:bg-[#30232B]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF0F3] text-[#FF2454] dark:bg-[#3A202B]">
                      <PenLine size={17} />
                    </span>
                    <span>
                      <span className="block text-xs font-bold">Writing practice</span>
                      <span className="mt-1 block text-[10px] text-[#71809D] dark:text-[#C1B5C0]">Task 1 & Task 2</span>
                    </span>
                  </span>
                  <ArrowRight size={16} className="text-[#FF2454]" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/live-speaking")}
                  className="flex w-full items-center justify-between rounded-xl border border-[#E7ECF6] p-3 text-left transition hover:border-[#FF9BAF] hover:bg-[#FFF7F9] dark:border-[#49333D] dark:hover:bg-[#30232B]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E5F9F1] text-[#00A879] dark:bg-[#1D3932]">
                      <Mic size={17} />
                    </span>
                    <span>
                      <span className="block text-xs font-bold">Speaking practice</span>
                      <span className="mt-1 block text-[10px] text-[#71809D] dark:text-[#C1B5C0]">Improve fluency</span>
                    </span>
                  </span>
                  <ArrowRight size={16} className="text-[#FF2454]" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/study-resources")}
                  className="flex w-full items-center justify-between rounded-xl border border-[#E7ECF6] p-3 text-left transition hover:border-[#FF9BAF] hover:bg-[#FFF7F9] dark:border-[#49333D] dark:hover:bg-[#30232B]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3EAFF] text-[#873BFA] dark:bg-[#30243D]">
                      <BookOpen size={17} />
                    </span>
                    <span>
                      <span className="block text-xs font-bold">Study resources</span>
                      <span className="mt-1 block text-[10px] text-[#71809D] dark:text-[#C1B5C0]">Lessons and guides</span>
                    </span>
                  </span>
                  <ArrowRight size={16} className="text-[#FF2454]" />
                </button>
              </div>
            </Panel>

            <Panel className="border-[#E2EAF8] bg-[#F6F9FF] dark:border-[#49333D] dark:bg-[#30232B]">
              <div className="flex items-center gap-2">
                <MessageSquare size={19} className="text-[#1680E8]" />
                <h3 className="text-sm font-extrabold">Remember</h3>
              </div>
              <p className="mt-2 text-xs leading-5 text-[#506995] dark:text-[#C1B5C0]">
                Automated feedback is a learning aid, not an official IELTS score.
                Use it alongside your trainer's guidance.
              </p>
            </Panel>
          </aside>
        </div>

        <p className="pb-2 text-center text-[11px] text-[#9AA8C2] dark:text-[#A99BA7]">
          Equilx IELTS · Practise with purpose.
        </p>
      </div>

      {/* SUBMISSION MODAL */}
      {showSubmitModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#081633]/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isGenerating) {
              setShowSubmitModal(false);
            }
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl dark:border dark:border-[#49333D] dark:bg-[#211e27] dark:text-[#FFF8FA] sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FF2454]">
                  <Sparkles size={14} /> New submission
                </p>
                <h2 className="mt-2 text-xl font-black">Get feedback on your practice</h2>
                <p className="mt-1 text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                  Submit your practice response for review.
                </p>
              </div>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => setShowSubmitModal(false)}
                className="rounded-lg p-2 text-[#71809D] hover:bg-[#F5F7FF] disabled:opacity-50 dark:text-[#C1B5C0] dark:hover:bg-[#30232B]"
                aria-label="Close submission form"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-xs font-bold">Practice type</label>
              <div className="grid grid-cols-2 gap-3">
                {skillOptions.map((option) => {
                  const Icon = option.icon;
                  const active = submissionType === option.label;

                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setSubmissionType(option.label)}
                      className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-bold transition ${
                        active
                          ? "border-[#FF2454] bg-[#FFF0F3] text-[#FF2454] dark:bg-[#3A202B]"
                          : "border-[#E2E8F5] text-[#506995] dark:border-[#49333D] dark:text-[#C1B5C0]"
                      }`}
                    >
                      <Icon size={17} /> {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="feedback-title" className="mb-2 block text-xs font-bold">
                Topic or task title
              </label>
              <input
                id="feedback-title"
                value={essayTitle}
                onChange={(event) => setEssayTitle(event.target.value)}
                placeholder="e.g. Advantages of online learning"
                required
                className="w-full rounded-xl border border-[#E2E8F5] px-4 py-3 text-sm outline-none transition placeholder:text-[#9AA8C2] focus:border-[#FF8199] dark:border-[#49333D] dark:bg-[#30232B] dark:text-[#FFF8FA]"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="feedback-response" className="mb-2 block text-xs font-bold">
                {submissionType === "Writing" ? "Your written response" : "Speaking transcript"}
              </label>
              <textarea
                id="feedback-response"
                value={essayText}
                onChange={(event) => setEssayText(event.target.value)}
                rows={7}
                required
                minLength={20}
                placeholder={
                  submissionType === "Writing"
                    ? "Paste your IELTS writing response here..."
                    : "Paste your speaking transcript here..."
                }
                className="w-full resize-y rounded-xl border border-[#E2E8F5] px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[#9AA8C2] focus:border-[#FF8199] dark:border-[#49333D] dark:bg-[#30232B] dark:text-[#FFF8FA]"
              />
              <p className="mt-2 text-right text-[10px] text-[#8A9ABB] dark:text-[#A99BA7]">
                {essayText.length} characters
              </p>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 rounded-xl border border-[#E2E8F5] px-4 py-3 text-sm font-bold text-[#506995] hover:bg-[#F5F7FF] dark:border-[#49333D] dark:text-[#C1B5C0] dark:hover:bg-[#30232B]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isGenerating}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#E81745] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Saving submission...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Submit response
                  </>
                )}
              </button>
            </div>

            <p className="mt-4 text-[10px] leading-5 text-[#8A9ABB] dark:text-[#A99BA7]">
              Demo interface: submitting a response does not call an AI service
              or generate an official band score. Connect your backend AI endpoint
              for real feedback.
            </p>
          </form>
        </div>
      )}
    </StudentLayout>
  );
}