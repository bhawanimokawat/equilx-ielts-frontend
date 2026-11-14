import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Clock,
  Flag,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Volume2,
  X,
  Sun,
  Moon,
  ArrowLeft,
} from "lucide-react";
import { api } from "../../services/api.js";

export function ExamRunnerPage() {
  const { testId, attemptId: paramAttemptId } = useParams();
  const navigate = useNavigate();

  // Test & Attempt State
  const [test, setTest] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({}); // { [questionId]: { userResponse, isFlaggedForReview } }
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState(null);

  // Exam Navigation State
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Timer State (Server Authoritative)
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const timerRef = useRef(null);

  // Autosave State
  const [saveStatus, setSaveStatus] = useState("saved"); // "saving" | "saved" | "error"
  const pendingAnswersRef = useRef(new Map());
  const saveTimeoutRef = useRef(null);
  const saveInFlightRef = useRef(null);
  const flushPendingAnswersRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const [submitError, setSubmitError] = useState(null);

  // Speaking Recorder & Cue Card State
  const [cueCardPrepSeconds, setCueCardPrepSeconds] = useState(0);
  const prepTimerRef = useRef(null);

  // Theme
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

  // Final Submission Handler
  const handleSubmitExam = useCallback(
    async (_isAutoSubmit = false) => {
      if (!attempt || isSubmittingRef.current) return;
      isSubmittingRef.current = true;

      try {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        await flushPendingAnswersRef.current?.();
        if (pendingAnswersRef.current.size > 0) {
          throw new Error("Some answers could not be saved. Check your connection and retry before submitting.");
        }
        await api.submitAttempt(attempt.id);
        navigate(`/results/${attempt.id}`);
      } catch (error) {
        setSubmitError(error.message || "Submission failed. Your exam has not been submitted.");
        isSubmittingRef.current = false;
      }
    },
    [attempt, navigate]
  );

  const handleSubmitRef = useRef(handleSubmitExam);
  useEffect(() => {
    handleSubmitRef.current = handleSubmitExam;
  }, [handleSubmitExam]);

  // 1. Initialize Test & Attempt
  useEffect(() => {
    let isMounted = true;
    async function initExam() {
      setLoading(true);
      setInitError(null);

      try {
        let attemptRecord;
        if (paramAttemptId) {
          const res = await api.getAttempt(paramAttemptId);
          attemptRecord = res.data.attempt;
        } else if (testId) {
          const res = await api.startAttempt(testId);
          attemptRecord = res.data.attempt;
        }

        if (!isMounted) return;

        if (!attemptRecord) {
          throw new Error("Unable to establish active exam session.");
        }

        setAttempt(attemptRecord);

        // Fetch test structure if not already embedded
        let testData = attemptRecord.test;
        if (!testData || !testData.sections) {
          const testRes = await api.getTestById(attemptRecord.testId);
          testData = testRes.data.test;
        }

        if (!isMounted) return;
        setTest(testData);

        // Initialize answers from existing attempt (refresh recovery)
        const initialAnswers = {};
        if (Array.isArray(attemptRecord.answers)) {
          attemptRecord.answers.forEach((ans) => {
            initialAnswers[ans.questionId] = {
              userResponse: ans.userResponse || "",
              isFlaggedForReview: !!ans.isFlaggedForReview,
            };
          });
        }
        setAnswers(initialAnswers);

        // Initialize active question
        const firstQ = testData.sections?.[0]?.questionGroups?.[0]?.questions?.[0];
        if (firstQ) {
          setActiveQuestionId(firstQ.id);
        }

        // Initialize countdown from server-authoritative deadline
        const deadlineMs = new Date(attemptRecord.deadline).getTime();
        const nowMs = Date.now();
        const initialRemaining = Math.max(0, Math.floor((deadlineMs - nowMs) / 1000));
        setRemainingSeconds(initialRemaining);

        if (initialRemaining <= 0) {
          // Attempt already expired on server - immediately submit and navigate
          try {
            await api.submitAttempt(attemptRecord.id);
          } catch {
            // Ignore
          }
          navigate(`/results/${attemptRecord.id}`);
        }
      } catch (err) {
        if (isMounted) {
          setInitError(err.message || "Failed to load examination.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initExam();

    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    };
  }, [testId, paramAttemptId, navigate]);

  // 2. Countdown Timer
  useEffect(() => {
    if (remainingSeconds <= 0 || !attempt) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmitRef.current?.(true); // Auto submit on expiry
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [remainingSeconds, attempt]);

  // 3. Reliable Autosave with Flush Mechanism
  const flushPendingAnswers = useCallback(async function flushPendingAnswersImpl() {
    if (!attempt || pendingAnswersRef.current.size === 0) return;
    if (saveInFlightRef.current) {
      await saveInFlightRef.current;
      if (pendingAnswersRef.current.size > 0) return flushPendingAnswersImpl();
      return;
    }

    const batch = Array.from(pendingAnswersRef.current.entries());
    setSaveStatus("saving");
    saveInFlightRef.current = (async () => {
      try {
        await api.saveAnswers(attempt.id, batch.map(([, value]) => value));
        batch.forEach(([questionId, savedValue]) => {
          // Keep an edit made while this request was in flight for the next batch.
          if (pendingAnswersRef.current.get(questionId) === savedValue) {
            pendingAnswersRef.current.delete(questionId);
          }
        });
        setSaveStatus(pendingAnswersRef.current.size ? "saving" : "saved");
      } catch (error) {
        setSaveStatus("error");
        throw error;
      } finally {
        saveInFlightRef.current = null;
      }
    })();

    try {
      await saveInFlightRef.current;
    } catch {
      return;
    }
    if (pendingAnswersRef.current.size > 0) return flushPendingAnswersImpl();
  }, [attempt]);

  useEffect(() => {
    flushPendingAnswersRef.current = flushPendingAnswers;
  }, [flushPendingAnswers]);

  const recordAnswerChange = (questionId, userResponse) => {
    const isFlagged = answers[questionId]?.isFlaggedForReview || false;

    // Immediate local state update for zero input latency
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        userResponse,
        isFlaggedForReview: isFlagged,
      },
    }));

    // Queue for batched network autosave
    pendingAnswersRef.current.set(questionId, {
      questionId,
      userResponse,
      isFlaggedForReview: isFlagged,
    });

    setSaveStatus("saving");

    // Debounce save by 600ms
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      flushPendingAnswers();
    }, 600);
  };

  const toggleFlagForReview = (questionId) => {
    const current = answers[questionId] || { userResponse: "", isFlaggedForReview: false };
    const nextFlagged = !current.isFlaggedForReview;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...current,
        isFlaggedForReview: nextFlagged,
      },
    }));

    pendingAnswersRef.current.set(questionId, {
      questionId,
      userResponse: current.userResponse || "",
      isFlaggedForReview: nextFlagged,
    });

    flushPendingAnswers();
  };

  const startCueCardPrep = (seconds = 60) => {
    setCueCardPrepSeconds(seconds);
    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    prepTimerRef.current = setInterval(() => {
      setCueCardPrepSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(prepTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Helper formatting for timer
  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className={dark ? "dark" : ""}>
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F9FA] text-[#2B3467] dark:bg-[#17151b] dark:text-white">
          <div className="text-center space-y-3">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#EB455F] border-t-transparent mx-auto" />
            <h2 className="text-sm font-bold">Setting up secure exam room...</h2>
            <p className="text-xs text-slate-500">Synchronizing timer and question bank with server</p>
          </div>
        </div>
      </div>
    );
  }

  if (initError || !test) {
    return (
      <div className={dark ? "dark" : ""}>
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F9FA] p-6 text-[#2B3467] dark:bg-[#17151b] dark:text-white">
          <div className="max-w-md text-center space-y-4">
            <AlertCircle size={44} className="mx-auto text-rose-500" />
            <h1 className="text-xl font-bold">Cannot Access Exam Session</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {initError || "This test could not be loaded. Please ensure you are logged in and the test is active."}
            </p>
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
    );
  }

  // Flatten all questions for palette
  const allQuestions = [];
  test.sections?.forEach((sec) => {
    sec.questionGroups?.forEach((grp) => {
      grp.questions?.forEach((q) => {
        allQuestions.push({
          ...q,
          sectionNumber: sec.sectionNumber,
          questionType: grp.questionType,
          instruction: grp.instruction,
        });
      });
    });
  });

  const totalQuestions = allQuestions.length || test.totalQuestions || 40;
  const answeredCount = Object.values(answers).filter((a) => a?.userResponse?.trim()).length;
  const flaggedCount = Object.values(answers).filter((a) => a?.isFlaggedForReview).length;
  const currentSection = test.sections?.[activeSectionIdx] || test.sections?.[0];

  return (
    <div className={dark ? "dark" : ""}>
      <div className="flex h-screen flex-col overflow-hidden bg-[#F8F9FA] text-[#2B3467] dark:bg-[#17151b] dark:text-[#fff8fa]">
        {/* Top Control Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 dark:border-[#3a2930] dark:bg-[#211b22]">
          <div className="flex items-center gap-3">
            <span className="brand-mark !h-8 !w-8 !rounded-lg !text-base">e</span>
            <div>
              <span className="block text-xs font-bold leading-tight truncate max-w-[240px] sm:max-w-md">
                {test.title}
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                {test.module} · {test.testType}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Autosave Status indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              {saveStatus === "saving" && (
                <>
                  <RefreshCw size={12} className="animate-spin text-amber-500" />
                  <span>Saving...</span>
                </>
              )}
              {saveStatus === "saved" && (
                <>
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span>Autosaved</span>
                </>
              )}
              {saveStatus === "error" && (
                <>
                  <AlertCircle size={13} className="text-rose-500" />
                  <span className="text-rose-500">Save failed · unsaved answers retained</span>
                </>
              )}
            </div>

            {/* Countdown Timer */}
            <div
              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-mono text-sm font-bold ${
                remainingSeconds < 300
                  ? "bg-rose-100 text-rose-700 animate-pulse dark:bg-rose-950/60 dark:text-rose-300"
                  : remainingSeconds < 600
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                  : "bg-slate-100 text-[#2B3467] dark:bg-[#33252c] dark:text-white"
              }`}
            >
              <Clock size={16} />
              <span>{formatTimer(remainingSeconds)}</span>
            </div>

            <button
              onClick={() => setDark((v) => !v)}
              className="theme-toggle"
              aria-label="Toggle Theme"
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Submit Exam Button */}
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="rounded-xl bg-[#EB455F] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#cf334d]"
            >
              Submit Exam
            </button>
          </div>
        </header>

        {/* Section Navigation Tabs */}
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-5 dark:border-[#3a2930] dark:bg-[#1a151b]">
          <div className="flex items-center gap-1 overflow-x-auto text-xs font-bold">
            {test.sections?.map((sec, idx) => (
              <button
                key={sec.id || idx}
                onClick={() => setActiveSectionIdx(idx)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                  activeSectionIdx === idx
                    ? "bg-white text-[#EB455F] shadow-xs dark:bg-[#2e232a]"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                }`}
              >
                <span>Section {sec.sectionNumber}</span>
              </button>
            ))}
          </div>

          <div className="text-[11px] font-semibold text-slate-500">
            Progress: <b className="text-slate-800 dark:text-white">{answeredCount}</b> of {totalQuestions} answered
          </div>
        </div>

        {/* Exam Split Workspace */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel: Passage Text / Audio Media / Task Instructions */}
          <div className="flex-1 overflow-y-auto border-r border-slate-200 p-6 sm:p-8 dark:border-[#3a2930]">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="border-b border-slate-200 pb-3 dark:border-[#3a2930]">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600 dark:bg-[#33252c] dark:text-[#ffbac7]">
                  Part {currentSection?.sectionNumber}
                </span>
                <h2 className="mt-2 text-lg font-bold">{currentSection?.title}</h2>
              </div>

              {/* Listening Audio Player Control */}
              {test.module === "LISTENING" && currentSection?.audioUrl && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-[#49313a] dark:bg-[#211b22] space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-[#EB455F] dark:bg-[#3d242d]">
                      <Volume2 size={20} />
                    </span>
                    <div>
                      <span className="block text-xs font-bold">Exam Audio Recording</span>
                      <span className="text-[10px] text-slate-400">Plays once during official examination</span>
                    </div>
                  </div>
                  <audio
                    controls
                    className="w-full mt-2"
                    src={currentSection.audioUrl}
                  />
                </div>
              )}
              {test.module === "LISTENING" && !currentSection?.audioUrl && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
                  Listening audio has not been configured for this section.
                </div>
              )}

              {/* Reading Passage Text */}
              {currentSection?.passageText ? (
                <div className="font-serif text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line space-y-4">
                  {currentSection.passageText}
                </div>
              ) : (
                <div className="rounded-xl bg-slate-100 p-4 text-xs text-slate-500 dark:bg-[#211b22]">
                  {currentSection?.promptText || "Read the questions on the right and respond accordingly."}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Interactive Question Sheet */}
          <div className="flex-1 overflow-y-auto bg-white p-6 sm:p-8 dark:bg-[#1c171d]">
            <div className="max-w-xl mx-auto space-y-6">
              {currentSection?.questionGroups?.map((group) => (
                <div key={group.id} className="space-y-4">
                  {/* Group Instruction Banner */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs dark:border-[#3a2930] dark:bg-[#211b22]">
                    <div className="font-bold text-[#EB455F] mb-1">
                      {group.questionType.replace(/_/g, " ")}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 font-medium">
                      {group.instruction}
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    {group.questions?.map((q) => {
                      const userAns = answers[q.id]?.userResponse ?? "";
                      const isFlagged = answers[q.id]?.isFlaggedForReview ?? false;
                      const options = Array.isArray(q.options)
                        ? q.options
                        : Object.entries(q.options || {}).map(([key, text]) => ({ key, text: String(text) }));
                      let selectedOptions = [];
                      try {
                        const parsed = JSON.parse(userAns);
                        selectedOptions = Array.isArray(parsed) ? parsed : [];
                      } catch {
                        selectedOptions = userAns ? userAns.split(",").map((value) => value.trim()) : [];
                      }

                      return (
                        <div
                          key={q.id}
                          id={`question-${q.id}`}
                          className={`rounded-2xl border p-5 transition ${
                            activeQuestionId === q.id
                              ? "border-[#EB455F] ring-1 ring-[#EB455F]/30 bg-rose-50/20 dark:bg-rose-950/10"
                              : "border-slate-200 bg-white dark:border-[#3a2930] dark:bg-[#211b22]"
                          }`}
                          onClick={() => setActiveQuestionId(q.id)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#2B3467] text-[10px] font-bold text-white dark:bg-[#402a32]">
                                {q.questionNumber}
                              </span>
                              <div className="font-semibold text-xs leading-relaxed text-slate-800 dark:text-white">
                                {q.prompt}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFlagForReview(q.id);
                              }}
                              className={`rounded-lg p-1.5 transition ${
                                isFlagged
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                                  : "text-slate-400 hover:text-slate-600 dark:hover:text-white"
                              }`}
                              title={isFlagged ? "Marked for review" : "Mark question for review"}
                            >
                              <Flag size={14} className={isFlagged ? "fill-amber-600" : ""} />
                            </button>
                          </div>

                          {/* 4A. TRUE / FALSE / NOT GIVEN Control */}
                          {group.questionType === "TRUE_FALSE_NOT_GIVEN" && (
                            <div className="mt-3.5 flex flex-wrap gap-2 pl-8">
                              {["TRUE", "FALSE", "NOT GIVEN"].map((val) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => recordAnswerChange(q.id, val)}
                                  className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                                    userAns.toUpperCase() === val
                                      ? "bg-[#EB455F] text-white shadow-xs"
                                      : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-[#EB455F] dark:border-[#3a2930] dark:bg-[#1a151b] dark:text-slate-200"
                                  }`}
                                >
                                  {val}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* 4B. YES / NO / NOT GIVEN Control */}
                          {group.questionType === "YES_NO_NOT_GIVEN" && (
                            <div className="mt-3.5 flex flex-wrap gap-2 pl-8">
                              {["YES", "NO", "NOT GIVEN"].map((val) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => recordAnswerChange(q.id, val)}
                                  className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                                    userAns.toUpperCase() === val
                                      ? "bg-[#EB455F] text-white shadow-xs"
                                      : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-[#EB455F] dark:border-[#3a2930] dark:bg-[#1a151b] dark:text-slate-200"
                                  }`}
                                >
                                  {val}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* 4C. Multiple Choice Single */}
                          {group.questionType === "MULTIPLE_CHOICE_SINGLE" && (
                            <div className="mt-3.5 space-y-2 pl-8">
                              {options.map((opt, index) => (
                                <label
                                  key={opt.key ?? index}
                                  className={`flex items-center gap-3 rounded-xl border p-3 text-xs font-medium cursor-pointer transition ${
                                    userAns === (opt.key ?? String.fromCharCode(65 + index))
                                      ? "border-[#EB455F] bg-rose-50/40 text-[#2B3467] dark:bg-rose-950/20 dark:text-white"
                                      : "border-slate-200 hover:bg-slate-50 dark:border-[#3a2930] dark:hover:bg-[#261f28]"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`q-${q.id}`}
                                    value={opt.key ?? String.fromCharCode(65 + index)}
                                    checked={userAns === (opt.key ?? String.fromCharCode(65 + index))}
                                    onChange={() => recordAnswerChange(q.id, opt.key ?? String.fromCharCode(65 + index))}
                                    className="accent-[#EB455F]"
                                  />
                                  <span className="font-bold text-[#EB455F]">{opt.key ?? String.fromCharCode(65 + index)}.</span>
                                  <span>{opt.text}</span>
                                </label>
                              ))}
                            </div>
                          )}

                          {group.questionType === "MULTIPLE_CHOICE_MULTIPLE" && (
                            <div className="mt-3.5 space-y-2 pl-8">
                              {options.map((opt, index) => {
                                const key = String(opt.key ?? String.fromCharCode(65 + index));
                                const checked = selectedOptions.includes(key);
                                return (
                                  <label key={key} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-xs dark:border-[#3a2930]">
                                    <input type="checkbox" checked={checked} onChange={() => {
                                      const next = checked ? selectedOptions.filter((item) => item !== key) : [...selectedOptions, key];
                                      recordAnswerChange(q.id, next.join(","));
                                    }} className="accent-[#EB455F]" />
                                    <span className="font-bold text-[#EB455F]">{key}.</span><span>{opt.text ?? ""}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}

                          {["MATCHING_HEADINGS", "MATCHING_INFORMATION", "MATCHING_FEATURES"].includes(group.questionType) && (
                            <div className="mt-3.5 pl-8">
                              <select value={userAns} onChange={(event) => recordAnswerChange(q.id, event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#3a2930] dark:bg-[#1a151b]">
                                <option value="">Choose a match…</option>
                                {options.map((opt, index) => {
                                  const key = String(opt.key ?? String.fromCharCode(65 + index));
                                  return <option key={key} value={key}>{key}. {opt.text ?? ""}</option>;
                                })}
                              </select>
                            </div>
                          )}

                          {/* 4D. Text Fill-in: Sentence / Summary / Form Completion / Short Answer */}
                          {[
                            "SENTENCE_COMPLETION",
                            "SUMMARY_COMPLETION",
                            "FORM_COMPLETION",
                            "TABLE_COMPLETION",
                            "SHORT_ANSWER",
                          ].includes(group.questionType) && (
                            <div className="mt-3.5 pl-8">
                              <input
                                type="text"
                                value={userAns}
                                onChange={(e) => recordAnswerChange(q.id, e.target.value)}
                                placeholder="Type your answer here..."
                                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-[#EB455F] focus:outline-none dark:border-[#3a2930] dark:bg-[#1a151b]"
                              />
                            </div>
                          )}

                          {/* 4E. Writing Tasks (Task 1 & 2 Essay) */}
                          {["WRITING_TASK_1", "WRITING_TASK_2"].includes(group.questionType) && (
                            <div className="mt-3.5 pl-8 space-y-2">
                              <textarea
                                rows={8}
                                value={userAns}
                                onChange={(e) => recordAnswerChange(q.id, e.target.value)}
                                placeholder="Type your response essay here..."
                                className="w-full rounded-xl border border-slate-200 p-3 text-xs leading-relaxed focus:border-[#EB455F] focus:outline-none dark:border-[#3a2930] dark:bg-[#1a151b]"
                              />
                              <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                                <span>
                                  Word Count:{" "}
                                  <b className="text-slate-800 dark:text-white">
                                    {userAns.trim() ? userAns.trim().split(/\s+/).length : 0}
                                  </b>{" "}
                                  words
                                </span>
                                <span>
                                  Requirement: {group.questionType === "WRITING_TASK_1" ? "150 words" : "250 words"}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* 4F. Speaking Tasks (Part 1, 2 Cue Card, Part 3) */}
                          {["SPEAKING_PART_1", "SPEAKING_PART_2", "SPEAKING_PART_3"].includes(group.questionType) && (
                            <div className="mt-3.5 pl-8 space-y-4">
                              {/* Cue Card 1-Minute Prep Countdown (Part 2) */}
                              {group.questionType === "SPEAKING_PART_2" && (
                                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                                      <Clock size={16} />
                                      <span>1-Minute Preparation Timer</span>
                                    </div>
                                    <span className="font-mono text-sm font-extrabold text-amber-700 dark:text-amber-300">
                                      {cueCardPrepSeconds > 0
                                        ? `00:${String(cueCardPrepSeconds).padStart(2, "0")}`
                                        : "Ready to Speak"}
                                    </span>
                                  </div>

                                  {cueCardPrepSeconds === 0 ? (
                                    <button
                                      type="button"
                                      onClick={() => startCueCardPrep(60)}
                                      className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition"
                                    >
                                      Start 1-Minute Prep Countdown
                                    </button>
                                  ) : (
                                    <p className="text-[11px] text-amber-800 dark:text-amber-300">
                                      Use this time to organize your thoughts and jot notes below.
                                    </p>
                                  )}

                                  <textarea
                                    rows={3}
                                    placeholder="Jot preparation notes & bullet points here..."
                                    className="w-full rounded-xl border border-amber-200 bg-white p-3 text-xs focus:border-amber-500 focus:outline-none dark:border-amber-900/40 dark:bg-[#1a151b]"
                                  />
                                </div>
                              )}

                              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
                                Audio recording and upload are not available in this build. No audio has been captured. You may enter a transcript below.
                              </div>
                              <textarea
                                rows={3}
                                value={userAns}
                                onChange={(e) => recordAnswerChange(q.id, e.target.value)}
                                placeholder="Enter a transcript (audio upload unavailable)"
                                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-[#EB455F] focus:outline-none dark:border-[#3a2930] dark:bg-[#211b22]"
                              />
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
        </div>

        {/* Bottom Question Palette Drawer */}
        <footer className="h-16 shrink-0 border-t border-slate-200 bg-white px-5 dark:border-[#3a2930] dark:bg-[#211b22]">
          <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto py-2 flex-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase mr-2 hidden md:inline">
                Palette:
              </span>
              {allQuestions.map((q) => {
                const isAnswered = !!answers[q.id]?.userResponse?.trim();
                const isFlagged = !!answers[q.id]?.isFlaggedForReview;
                const isCurrent = activeQuestionId === q.id;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setActiveQuestionId(q.id);
                      setActiveSectionIdx(q.sectionNumber - 1);
                      const el = document.getElementById(`question-${q.id}`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition ${
                      isCurrent
                        ? "ring-2 ring-[#EB455F] ring-offset-1 font-extrabold"
                        : ""
                    } ${
                      isFlagged
                        ? "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/70 dark:text-amber-300"
                        : isAnswered
                        ? "bg-[#EB455F] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#33252c] dark:text-slate-300"
                    }`}
                  >
                    <span>{q.questionNumber}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-500 shrink-0 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#EB455F]" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span>Flagged ({flaggedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span>Unanswered ({totalQuestions - answeredCount})</span>
              </div>
            </div>
          </div>
        </footer>

        {/* Final Submission Confirmation Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#211b22] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-[#3a2930]">
                <h3 className="text-base font-bold">Submit IELTS Test Paper</h3>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#33252c]"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Are you ready to submit your exam responses? Once submitted, answers cannot be edited and your test will be officially scored.
                </p>

                <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center dark:border-[#3a2930] dark:bg-[#1a151b]">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Answered</span>
                    <span className="text-base font-bold text-emerald-600">{answeredCount}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Unanswered</span>
                    <span className="text-base font-bold text-rose-500">
                      {totalQuestions - answeredCount}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Flagged</span>
                    <span className="text-base font-bold text-amber-500">{flaggedCount}</span>
                  </div>
                </div>

                {totalQuestions - answeredCount > 0 && (
                  <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-2.5 text-[11px] text-amber-800 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/40 dark:text-amber-300">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <span>
                      You have <b>{totalQuestions - answeredCount} unanswered questions</b>. You can still return and answer them before submitting.
                    </span>
                  </div>
                )}
                {submitError && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{submitError}</p>}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-[#3a2930] dark:text-slate-300 dark:hover:bg-[#33252c]"
                >
                  Return to Test
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmitExam(false)}
                  className="rounded-xl bg-[#EB455F] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#cf334d]"
                >
                  Yes, Submit Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamRunnerPage;
