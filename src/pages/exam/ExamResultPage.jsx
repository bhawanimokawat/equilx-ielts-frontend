import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Award,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Info,
  Sun,
  Moon,
} from "lucide-react";
import { api } from "../../services/api.js";

function formatDateString(isoString) {
  if (!isoString) return "Recently";
  try {
    const d = new Date(isoString);
    return `${d.toLocaleDateString()} at ${d.toLocaleTimeString()}`;
  } catch {
    return "Recently";
  }
}

export function ExamResultPage() {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("equilx-theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("equilx-theme", dark ? "dark" : "light");
      if (dark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // Ignore
    }
  }, [dark]);

  useEffect(() => {
    let isMounted = true;
    api
      .getAttemptResult(attemptId)
      .then((res) => {
        if (isMounted && res?.data?.attempt) {
          setResult(res.data.attempt);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to load exam result.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [attemptId]);

  if (loading) {
    return (
      <div className={dark ? "dark" : ""}>
        <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] text-[#2B3467] dark:bg-[#17151b] dark:text-white">
          <div className="text-center space-y-3">
            <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#EB455F] border-t-transparent mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Retrieving test scorecard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className={dark ? "dark" : ""}>
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F9FA] p-6 text-[#2B3467] dark:bg-[#17151b] dark:text-white">
          <div className="max-w-md text-center space-y-4">
            <XCircle size={44} className="mx-auto text-rose-500" />
            <h1 className="text-xl font-bold">Scorecard Unavailable</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {error || "The requested attempt scorecard could not be retrieved from the server."}
            </p>
            <div className="pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[#EB455F] px-4 py-2.5 text-xs font-bold text-white shadow-sm"
              >
                <ArrowLeft size={15} />
                <span>Return to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { test, answers, rawScore, bandScore, submittedAt } = result;
  const isObjective = test?.module === "READING" || test?.module === "LISTENING";
  const totalQuestions = test?.totalQuestions || 40;

  // Map answers by questionId
  const answerMap = new Map();
  if (Array.isArray(answers)) {
    answers.forEach((ans) => answerMap.set(ans.questionId, ans));
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-[#F8F9FA] text-[#2B3467] dark:bg-[#17151b] dark:text-[#fff8fa]">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md dark:border-[#3a2930] dark:bg-[#17151b]/95">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#EB455F] dark:text-slate-300"
            >
              <ArrowLeft size={16} />
              <span>Back to Student Dashboard</span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDark((v) => !v)}
                className="theme-toggle"
                aria-label="Toggle Theme"
              >
                {dark ? <Sun size={17} /> : <Moon size={17} />}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
          {/* Result Score Card */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-[#3a2930] dark:bg-[#211b22]">
            <div className="border-b border-slate-100 bg-gradient-to-r from-rose-50/60 to-white p-6 dark:border-[#3a2930] dark:from-[#2e2027] dark:to-[#211b22] sm:p-8">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#EB455F] px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
                      {test.module}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-600 dark:bg-[#33252c] dark:text-[#ffbac7]">
                      {test.testType}
                    </span>
                  </div>
                  <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{test.title}</h1>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Completed on {formatDateString(submittedAt)}
                  </p>
                </div>

                {/* Big Band Score Box */}
                <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#49313a] dark:bg-[#1c171d]">
                  <div className="text-right">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Estimated IELTS Band
                    </span>
                    <span className="text-3xl font-extrabold text-[#EB455F]">
                      {isObjective ? (bandScore ? `Band ${bandScore.toFixed(1)}` : "Band —") : "Pending Evaluation"}
                    </span>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-[#EB455F] dark:bg-[#3d242d]">
                    <Award size={26} />
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats Row */}
            <div className="grid grid-cols-2 divide-x divide-y sm:divide-y-0 sm:grid-cols-4 divide-slate-100 border-b border-slate-100 text-center dark:divide-[#3a2930] dark:border-[#3a2930]">
              <div className="p-4 sm:p-5">
                <span className="block text-[10px] font-bold uppercase text-slate-400">Raw Score</span>
                <span className="mt-1 block text-lg font-bold">
                  {rawScore ?? "—"} <span className="text-xs font-normal text-slate-400">/ {totalQuestions}</span>
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <span className="block text-[10px] font-bold uppercase text-slate-400">Accuracy</span>
                <span className="mt-1 block text-lg font-bold text-emerald-600">
                  {rawScore ? `${Math.round((rawScore / totalQuestions) * 100)}%` : "0%"}
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <span className="block text-[10px] font-bold uppercase text-slate-400">Answered</span>
                <span className="mt-1 block text-lg font-bold">
                  {answers?.filter((a) => a.userResponse?.trim()).length || 0}{" "}
                  <span className="text-xs font-normal text-slate-400">/ {totalQuestions}</span>
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <span className="block text-[10px] font-bold uppercase text-slate-400">Review Status</span>
                <span className="mt-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
                  {isObjective ? "Auto-Graded" : "Under Trainer Review"}
                </span>
              </div>
            </div>

            {/* Disclaimer Alert */}
            <div className="flex items-start gap-3 bg-slate-50 p-4 text-xs text-slate-600 dark:bg-[#1a151b] dark:text-slate-400">
              <Info size={16} className="shrink-0 text-slate-400 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Estimated Score Disclaimer:
                </span>{" "}
                Scores are calibrated estimates based on the official IELTS raw-to-band conversion tables and do not represent an official certificate from Cambridge Assessment English, IDP, or British Council.
              </div>
            </div>
          </div>

          {/* Question-by-Question Review */}
          <div className="mt-8 space-y-6">
            <h2 className="text-lg font-bold">Question & Answer Review</h2>

            {test.sections?.map((section) => (
              <div
                key={section.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#3a2930] dark:bg-[#211b22] space-y-4"
              >
                <div className="border-b border-slate-200 pb-3 dark:border-[#3a2930]">
                  <h3 className="text-sm font-bold text-[#EB455F]">
                    Section {section.sectionNumber}: {section.title}
                  </h3>
                  {section.passageText && (
                    <div className="mt-3 max-h-48 overflow-y-auto rounded-xl bg-slate-50 p-4 font-serif text-xs leading-relaxed text-slate-700 dark:bg-[#1a151b] dark:text-slate-300">
                      {section.passageText}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {section.questionGroups?.map((group) => (
                    <div key={group.id} className="space-y-3">
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {group.instruction}
                      </div>

                      <div className="space-y-3">
                        {group.questions?.map((q) => {
                          const studentAns = answerMap.get(q.id);
                          const isCorrect = studentAns?.isCorrect;
                          const userResp = studentAns?.userResponse?.trim() || "No answer submitted";

                          return (
                            <div
                              key={q.id}
                              className={`rounded-xl border p-4 text-xs transition ${
                                isCorrect
                                  ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                                  : "border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1 flex-1">
                                  <div className="font-semibold text-slate-900 dark:text-white">
                                    <span className="font-bold text-[#EB455F] mr-2">
                                      Q{q.questionNumber}.
                                    </span>
                                    {q.prompt}
                                  </div>

                                  {q.options && (
                                    <div className="mt-2 pl-6 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                                      {Array.isArray(q.options)
                                        ? q.options.map((opt) => (
                                            <div key={opt.key}>
                                              <b className="text-slate-700 dark:text-slate-300">
                                                {opt.key}:
                                              </b>{" "}
                                              {opt.text}
                                            </div>
                                          ))
                                        : JSON.stringify(q.options)}
                                    </div>
                                  )}
                                </div>

                                <div className="shrink-0 text-right">
                                  {isCorrect ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                                      <CheckCircle2 size={12} />
                                      Correct
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-900/60 dark:text-rose-200">
                                      <XCircle size={12} />
                                      Incorrect
                                    </span>
                                  )}
                                  <div className="mt-1 text-[10px] text-slate-400">
                                    {isCorrect ? `${q.marks || 1} mark` : "0 marks"}
                                  </div>
                                </div>
                              </div>

                              {/* Answer comparison */}
                              <div className="mt-3 flex flex-wrap gap-4 border-t border-slate-200/60 pt-3 text-[11px] dark:border-[#3a2930]">
                                <div>
                                  <span className="block text-[10px] font-bold text-slate-400 uppercase">
                                    Your Response
                                  </span>
                                  <span
                                    className={`font-semibold ${
                                      isCorrect
                                        ? "text-emerald-700 dark:text-emerald-300"
                                        : "text-rose-700 dark:text-rose-300 line-through"
                                    }`}
                                  >
                                    {userResp}
                                  </span>
                                </div>

                                <div>
                                  <span className="block text-[10px] font-bold text-slate-400 uppercase">
                                    Correct Answer Key
                                  </span>
                                  <span className="font-bold text-emerald-700 dark:text-emerald-300">
                                    {q.correctAnswer || "Subjective Evaluation"}
                                  </span>
                                </div>
                              </div>

                              {/* Explanation */}
                              {q.explanation && (
                                <div className="mt-2.5 rounded-lg bg-white/70 p-2.5 text-[11px] text-slate-600 dark:bg-[#1a151b] dark:text-slate-400">
                                  <span className="font-bold text-slate-700 dark:text-slate-300">
                                    Explanation:
                                  </span>{" "}
                                  {q.explanation}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6 dark:border-[#3a2930]">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-[#EB455F] dark:border-[#49313a] dark:bg-[#211b22] dark:text-white"
            >
              <ArrowLeft size={15} />
              <span>Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={() => navigate(`/exam/${test.id}`)}
              className="rounded-xl bg-[#EB455F] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#cf334d]"
            >
              Retake Practice Test
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ExamResultPage;
