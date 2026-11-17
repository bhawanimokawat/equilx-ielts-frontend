
import React, { useCallback, useEffect, useRef, useState } from "react";
import StudentLayout from "./StudentLayout";
import speakingService from "../../services/speakingService";
import {
  Mic,
  Square,
  Play,
  Clock,
  BookOpen,
  Target,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  RotateCcw,
  X,
  History,
  Upload,
  Headphones,
} from "lucide-react";

const unwrap = (response) => response?.data ?? response ?? {};

const getErrorMessage = (error) =>
  error?.message || "Something went wrong. Please try again.";

const getQuestionText = (question) => {
  const content = question?.content;

  if (typeof content === "string") return content;

  if (content && typeof content === "object") {
    return (
      content.question ||
      content.text ||
      content.prompt ||
      content.title ||
      JSON.stringify(content)
    );
  }

  return "Question content is not available.";
};

const getPartNumber = (question) => {
  const position = Number(question?.testPart?.position);

  if (position >= 1 && position <= 3) return position;

  const title = String(question?.testPart?.title || "");
  const match = title.match(/part\s*([1-3])/i);

  return match ? Number(match[1]) : null;
};

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Not available";

  return parsed.toLocaleString();
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#E7ECF6] bg-white p-5 shadow-sm dark:border-[#49333D] dark:bg-[#211e27] ${className}`}
    >
      {children}
    </section>
  );
}

function Notice({ type = "error", children, onClose }) {
  const styles =
    type === "success"
      ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300"
      : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300";

  return (
    <div className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${styles}`}>
      {type === "success" ? (
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
      ) : (
        <AlertCircle size={18} className="mt-0.5 shrink-0" />
      )}
      <div className="flex-1">{children}</div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Close notification">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default function LiveSpeakingPage() {
  const [activeTab, setActiveTab] = useState("practice");

  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState("");
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedPartId, setSelectedPartId] = useState("");

  const [history, setHistory] = useState([]);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [recordingBusy, setRecordingBusy] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [consent, setConsent] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [submissionId, setSubmissionId] = useState("");
  const [transcriptionStatus, setTranscriptionStatus] = useState("");

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const recordingStartedAtRef = useRef(null);

  const modules =
    selectedTest?.publishedVersion?.modules || [];

  const speakingModules = modules.filter(
    (module) => module.section === "SPEAKING"
  );

  const selectedModule = speakingModules.find(
    (module) => module.id === selectedModuleId
  );

  const selectedParts = selectedModule?.parts || [];

  const currentQuestion = questions[activeQuestionIndex] || null;

  const loadTests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await speakingService.getPracticeTests();
      const payload = unwrap(response);

      const items = Array.isArray(payload.items) ? payload.items : [];

      const speakingTests = items.filter((test) =>
        test?.publishedVersion?.modules?.some(
          (module) => module.section === "SPEAKING"
        )
      );

      setTests(speakingTests);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);

    try {
      const response = await speakingService.getPracticeHistory();
      const payload = unwrap(response);
      setHistory(Array.isArray(payload.items) ? payload.items : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTests();
    loadHistory();
  }, [loadTests, loadHistory]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);

      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleTestChange = async (testId) => {
    setSelectedTestId(testId);
    setSelectedTest(null);
    setSelectedModuleId("");
    setSelectedPartId("");
    setError("");
    setSuccess("");

    if (!testId) return;

    setDetailsLoading(true);

    try {
      const response =
        await speakingService.getPracticeTestDetails(testId);

      const details = unwrap(response);

      setSelectedTest(details);

      const availableModules =
        details?.publishedVersion?.modules || [];

      const firstSpeakingModule = availableModules.find(
        (module) => module.section === "SPEAKING"
      );

      if (firstSpeakingModule) {
        setSelectedModuleId(firstSpeakingModule.id);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDetailsLoading(false);
    }
  };

  const startPractice = async () => {
    if (!selectedTest || !selectedModuleId) {
      setError("Please select a published Speaking module.");
      return;
    }

    const versionId = selectedTest?.publishedVersion?.id;

    if (!versionId) {
      setError("Published test version ID was not returned by the backend.");
      return;
    }

    // The backend requires exactly one of moduleId or partId.
    const scope = selectedPartId
      ? { partId: selectedPartId }
      : { moduleId: selectedModuleId };

    setStarting(true);
    setError("");
    setSuccess("");

    try {
      const startResponse = await speakingService.startPracticeAttempt(
        versionId,
        scope
      );

      // Practice controller returns the attempt directly in data.
      const newAttempt = unwrap(startResponse);

      if (!newAttempt?.id) {
        throw new Error("Backend did not return the practice attempt ID.");
      }

      const [questionResponse, answerResponse] = await Promise.all([
        speakingService.getAttemptQuestions(newAttempt.id),
        speakingService.getAttemptAnswers(newAttempt.id),
      ]);

      const questionPayload = unwrap(questionResponse);
      const answerPayload = unwrap(answerResponse);

      const questionItems = Array.isArray(questionPayload.questions)
        ? questionPayload.questions
        : [];

      const answerItems = Array.isArray(answerPayload.answers)
        ? answerPayload.answers
        : [];

      const savedAnswers = {};

      answerItems.forEach((item) => {
        savedAnswers[item.questionId] = item.answer;
      });

      setAttempt(newAttempt);
      setQuestions(questionItems);
      setAnswers(savedAnswers);
      setActiveQuestionIndex(0);
      setSubmissionId("");
      setRecordingBlob(null);
      setTranscriptionStatus("");
      setRecordingSeconds(0);
      setConsent(false);

      if (!questionItems.length) {
        setSuccess(
          "Attempt started, but the selected Speaking content has no questions."
        );
      } else {
        setSuccess("Speaking practice attempt started successfully.");
      }

      await loadHistory();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setStarting(false);
    }
  };

  const saveAnswer = async () => {
    if (!attempt?.id || !currentQuestion?.id) return;

    const answer = answers[currentQuestion.id];

    if (
      answer === undefined ||
      answer === null ||
      (typeof answer === "string" && !answer.trim())
    ) {
      setError("Please write your answer before saving.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await speakingService.saveAnswer(
        attempt.id,
        currentQuestion.id,
        answer
      );

      setSuccess("Answer saved successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const startRecording = async () => {
    if (!attempt?.id) {
      setError("Start a practice attempt before recording.");
      return;
    }

    if (!consent) {
      setError("Please give recording consent first.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError("Audio recording is not supported in this browser.");
      return;
    }

    setError("");
    setSuccess("");
    setRecordingBlob(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const supportedTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg",
        "audio/wav",
      ];

      const mimeType = supportedTypes.find((type) =>
        MediaRecorder.isTypeSupported(type)
      );

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data?.size) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setError("An error occurred while recording audio.");
        setIsRecording(false);
        stopTracks();
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        setRecordingBlob(blob);
        setIsRecording(false);
        stopTracks();
      };

      recorder.start();
      recordingStartedAtRef.current = Date.now();
      setRecordingSeconds(0);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - recordingStartedAtRef.current) / 1000
        );

        setRecordingSeconds(elapsed);

        if (elapsed >= 900 && recorder.state === "recording") {
          recorder.stop();
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }, 1000);
    } catch (err) {
      setError(
        err?.name === "NotAllowedError"
          ? "Microphone permission was denied. Please allow microphone access."
          : getErrorMessage(err)
      );
      stopTracks();
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const uploadAndSubmitRecording = async () => {
    if (!recordingBlob || !attempt?.id) {
      setError("Please record your answer first.");
      return;
    }

    if (recordingBlob.size > 25 * 1024 * 1024) {
      setError("Recording exceeds the backend 25 MB file limit.");
      return;
    }

    const partNumber = getPartNumber(currentQuestion);

    if (!partNumber) {
      setError(
        "Could not determine the Speaking part number from the selected question."
      );
      return;
    }

    const durationSeconds = Math.max(
      1,
      Math.min(900, recordingSeconds)
    );

    setRecordingBusy(true);
    setError("");
    setSuccess("");

    try {
      let currentSubmissionId = submissionId;

      if (!currentSubmissionId) {
        const submissionResponse =
          await speakingService.createSubmission(
            attempt.id,
            partNumber
          );

        const submission = unwrap(submissionResponse);

        if (!submission?.id) {
          throw new Error("Speaking submission ID was not returned.");
        }

        currentSubmissionId = submission.id;
        setSubmissionId(currentSubmissionId);
      }

      await speakingService.uploadRecording(
        currentSubmissionId,
        recordingBlob,
        durationSeconds
      );

      const completeResponse =
        await speakingService.completeSubmission(currentSubmissionId);

      const completePayload = unwrap(completeResponse);

      setTranscriptionStatus(
        completePayload?.transcription?.status || "QUEUED"
      );

      setRecordingBlob(null);
      setSuccess(
        "Recording uploaded. Transcription has been queued by the backend."
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setRecordingBusy(false);
    }
  };

  const handleWithdrawConsent = async () => {
    if (!submissionId) {
      setConsent(false);
      setRecordingBlob(null);
      setSuccess("Recording consent disabled.");
      return;
    }

    setRecordingBusy(true);
    setError("");
    setSuccess("");

    try {
      await speakingService.withdrawConsent(submissionId);

      setConsent(false);
      setSubmissionId("");
      setRecordingBlob(null);
      setTranscriptionStatus("");
      setSuccess("Recording consent withdrawn successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setRecordingBusy(false);
    }
  };

  const resetPractice = () => {
    if (isRecording) stopRecording();

    setAttempt(null);
    setQuestions([]);
    setAnswers({});
    setActiveQuestionIndex(0);
    setConsent(false);
    setRecordingBlob(null);
    setSubmissionId("");
    setTranscriptionStatus("");
    setRecordingSeconds(0);
    setError("");
    setSuccess("");
  };

  const updateAnswer = (value) => {
    if (!currentQuestion?.id) return;

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: value,
    }));
  };

  return (
    <StudentLayout>
      <div className="speaking-page mx-auto max-w-[1600px] space-y-5 text-[#10265F] dark:text-[#FFF8FA]">
        {/* HERO */}
        <section className="relative min-h-[205px] overflow-hidden rounded-2xl border border-[#E7ECF6] bg-[#F5F7FF] dark:border-[#49333D]">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=85"
            alt="Students preparing for an English speaking test"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/30 dark:from-[#171419] dark:via-[#171419]/90 dark:to-[#171419]/30" />

          <div className="relative z-10 flex min-h-[205px] items-center p-6 sm:p-8">
            <div className="max-w-2xl">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#FFF0F3] px-3 py-1 text-xs font-bold text-[#FF2454] dark:bg-[#3A202B]">
                <Sparkles size={14} />
                IELTS Speaking Module
              </span>

              <h1 className="text-2xl font-black sm:text-3xl">
                Live Speaking Practice
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#506995] dark:text-[#C1B5C0]">
                Practise using published IELTS Speaking content, save your
                answers and submit your voice recordings.
              </p>
            </div>
          </div>
        </section>

        {error && (
          <Notice type="error" onClose={() => setError("")}>
            {error}
          </Notice>
        )}

        {success && (
          <Notice type="success" onClose={() => setSuccess("")}>
            {success}
          </Notice>
        )}

        {/* TABS */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("practice")}
            className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
              activeTab === "practice"
                ? "bg-[#FF2454] text-white"
                : "border border-[#E7ECF6] bg-white text-[#506995] dark:border-[#49333D] dark:bg-[#211e27] dark:text-[#C1B5C0]"
            }`}
          >
            <span className="flex items-center gap-2">
              <Mic size={16} />
              Speaking Practice
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("history");
              loadHistory();
            }}
            className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
              activeTab === "history"
                ? "bg-[#FF2454] text-white"
                : "border border-[#E7ECF6] bg-white text-[#506995] dark:border-[#49333D] dark:bg-[#211e27] dark:text-[#C1B5C0]"
            }`}
          >
            <span className="flex items-center gap-2">
              <History size={16} />
              Practice History
            </span>
          </button>
        </div>

        {loading ? (
          <Card className="flex min-h-52 items-center justify-center">
            <div className="text-center">
              <Loader2 size={30} className="mx-auto animate-spin text-[#FF2454]" />
              <p className="mt-3 text-sm text-[#71809D]">
                Loading published IELTS content...
              </p>
            </div>
          </Card>
        ) : activeTab === "history" ? (
          <Card>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF2454] dark:bg-[#3A202B]">
                <History size={20} />
              </span>
              <div>
                <h2 className="font-black">Practice History</h2>
                <p className="mt-1 text-xs text-[#71809D]">
                  Your practice attempts retrieved from the backend.
                </p>
              </div>
            </div>

            {historyLoading ? (
              <div className="py-12 text-center">
                <Loader2 size={26} className="mx-auto animate-spin text-[#FF2454]" />
              </div>
            ) : history.length === 0 ? (
              <div className="py-12 text-center">
                <BookOpen size={34} className="mx-auto text-[#9AA8C2]" />
                <p className="mt-3 font-bold">No practice history available</p>
                <p className="mt-1 text-sm text-[#71809D]">
                  Your practice attempts will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-3 rounded-xl border border-[#E7ECF6] p-4 sm:flex-row sm:items-center dark:border-[#49333D]"
                  >
                    <div>
                      <h3 className="font-bold">
                        {item.testVersion?.test?.title || "IELTS Practice"}
                      </h3>
                      <p className="mt-1 text-xs text-[#71809D]">
                        {item.testVersion?.test?.book?.title || "Published test"}
                        {item.testVersion?.test?.testNumber
                          ? ` · Test ${item.testVersion.test.testNumber}`
                          : ""}
                      </p>
                      <p className="mt-1 text-xs text-[#71809D]">
                        Started: {formatDate(item.startedAt)}
                      </p>
                      {item.submittedAt && (
                        <p className="mt-1 text-xs text-[#71809D]">
                          Submitted: {formatDate(item.submittedAt)}
                        </p>
                      )}
                    </div>

                    <span className="w-fit rounded-full bg-[#F2F5FD] px-3 py-1 text-xs font-bold text-[#506995] dark:bg-[#30232B] dark:text-[#C1B5C0]">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ) : (
          <>
            {/* TEST SELECTION */}
            <Card>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF2454] dark:bg-[#3A202B]">
                  <BookOpen size={20} />
                </span>
                <div>
                  <h2 className="font-black">Choose Speaking Test</h2>
                  <p className="mt-1 text-xs text-[#71809D]">
                    Select a published test and its Speaking module or part.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#506995] dark:text-[#C1B5C0]">
                    Published IELTS test
                  </label>
                  <select
                    value={selectedTestId}
                    onChange={(event) => handleTestChange(event.target.value)}
                    disabled={detailsLoading || starting}
                    className="w-full rounded-xl border border-[#DCE4F3] bg-white px-4 py-3 text-sm outline-none focus:border-[#FF2454] dark:border-[#49333D] dark:bg-[#30232B]"
                  >
                    <option value="">Select a test</option>
                    {tests.map((test) => (
                      <option key={test.id} value={test.id}>
                        {test.title}
                        {test.testNumber ? ` · Test ${test.testNumber}` : ""}
                        {test.book?.title ? ` · ${test.book.title}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-[#506995] dark:text-[#C1B5C0]">
                    Speaking module
                  </label>
                  <select
                    value={selectedModuleId}
                    onChange={(event) => {
                      setSelectedModuleId(event.target.value);
                      setSelectedPartId("");
                    }}
                    disabled={!speakingModules.length || detailsLoading}
                    className="w-full rounded-xl border border-[#DCE4F3] bg-white px-4 py-3 text-sm outline-none focus:border-[#FF2454] dark:border-[#49333D] dark:bg-[#30232B]"
                  >
                    <option value="">Select a module</option>
                    {speakingModules.map((module) => (
                      <option key={module.id} value={module.id}>
                        Speaking Module {module.position}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedModule && selectedParts.length > 0 && (
                <div className="mt-4">
                  <label className="mb-2 block text-xs font-bold text-[#506995] dark:text-[#C1B5C0]">
                    Practice a specific part (optional)
                  </label>
                  <select
                    value={selectedPartId}
                    onChange={(event) => setSelectedPartId(event.target.value)}
                    className="w-full rounded-xl border border-[#DCE4F3] bg-white px-4 py-3 text-sm outline-none focus:border-[#FF2454] dark:border-[#49333D] dark:bg-[#30232B]"
                  >
                    <option value="">Entire Speaking module</option>
                    {selectedParts.map((part) => (
                      <option key={part.id} value={part.id}>
                        {part.title || `Part ${part.position}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {detailsLoading && (
                <p className="mt-3 flex items-center gap-2 text-xs text-[#71809D]">
                  <Loader2 size={14} className="animate-spin" />
                  Loading test details...
                </p>
              )}

              {!tests.length && (
                <div className="mt-5 rounded-xl bg-[#F6F8FE] p-4 text-sm text-[#71809D] dark:bg-[#30232B]">
                  No published tests containing a Speaking module were returned
                  by the backend.
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[#71809D]">
                  {selectedTest
                    ? `${selectedTest.title} · ${selectedTest.category || "IELTS"}`
                    : "Select a test to begin."}
                </p>

                <button
                  type="button"
                  onClick={startPractice}
                  disabled={
                    starting ||
                    detailsLoading ||
                    !selectedTest ||
                    !selectedModuleId ||
                    Boolean(attempt)
                  }
                  className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#E91E4D] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {starting ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Play size={17} />
                  )}
                  Start Practice
                </button>
              </div>
            </Card>

            {/* PRACTICE CONTENT */}
            {attempt && (
              <>
                <Card>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF2454] dark:bg-[#3A202B]">
                        <Target size={20} />
                      </span>
                      <div>
                        <h2 className="font-black">Your Speaking Practice</h2>
                        <p className="mt-1 text-xs text-[#71809D]">
                          Attempt ID: {attempt.id}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={resetPractice}
                      disabled={isRecording || recordingBusy}
                      className="flex items-center gap-2 rounded-xl border border-[#E7ECF6] px-3 py-2 text-xs font-bold text-[#506995] dark:border-[#49333D] dark:text-[#C1B5C0]"
                    >
                      <RotateCcw size={14} />
                      Close practice
                    </button>
                  </div>

                  {!questions.length ? (
                    <div className="py-12 text-center">
                      <AlertCircle size={34} className="mx-auto text-[#9AA8C2]" />
                      <h3 className="mt-3 font-bold">
                        No Speaking questions available
                      </h3>
                      <p className="mt-1 text-sm text-[#71809D]">
                        The backend returned no questions for this selected scope.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {questions.map((question, index) => (
                          <button
                            key={question.id}
                            type="button"
                            onClick={() => setActiveQuestionIndex(index)}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${
                              index === activeQuestionIndex
                                ? "bg-[#FF2454] text-white"
                                : answers[question.id] !== undefined
                                  ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300"
                                  : "bg-[#F2F5FD] text-[#506995] dark:bg-[#30232B] dark:text-[#C1B5C0]"
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>

                      <div className="mt-5 rounded-2xl bg-[#F6F8FE] p-5 dark:bg-[#30232B] sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-full bg-[#FFF0F3] px-3 py-1 text-xs font-bold text-[#FF2454] dark:bg-[#3A202B]">
                            {currentQuestion?.testPart?.title ||
                              `Question ${activeQuestionIndex + 1}`}
                          </span>
                          <span className="text-xs text-[#71809D]">
                            Question {activeQuestionIndex + 1} of {questions.length}
                          </span>
                        </div>

                        <h3 className="mt-4 text-lg font-black leading-7">
                          {getQuestionText(currentQuestion)}
                        </h3>

                        {currentQuestion?.testPart?.instructions && (
                          <p className="mt-3 text-sm leading-6 text-[#71809D]">
                            {currentQuestion.testPart.instructions}
                          </p>
                        )}

                        {currentQuestion?.questionGroup?.instructions && (
                          <p className="mt-3 text-sm leading-6 text-[#71809D]">
                            {currentQuestion.questionGroup.instructions}
                          </p>
                        )}

                        {currentQuestion?.questionGroup?.passage && (
                          <div className="mt-4 whitespace-pre-wrap rounded-xl bg-white p-4 text-sm leading-6 dark:bg-[#211e27]">
                            {currentQuestion.questionGroup.passage}
                          </div>
                        )}

                        <label className="mt-5 block text-xs font-bold text-[#506995] dark:text-[#C1B5C0]">
                          Your written answer
                        </label>
                        <textarea
                          rows={5}
                          value={answers[currentQuestion?.id] ?? ""}
                          onChange={(event) => updateAnswer(event.target.value)}
                          placeholder="Write your answer here..."
                          className="mt-2 w-full resize-y rounded-xl border border-[#DCE4F3] bg-white p-4 text-sm leading-6 outline-none focus:border-[#FF2454] dark:border-[#49333D] dark:bg-[#211e27]"
                        />

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={saveAnswer}
                            disabled={saving}
                            className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                          >
                            {saving ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={16} />
                            )}
                            Save answer
                          </button>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={activeQuestionIndex === 0}
                              onClick={() =>
                                setActiveQuestionIndex((index) => index - 1)
                              }
                              className="flex items-center gap-1 rounded-xl border border-[#DCE4F3] px-3 py-2.5 text-sm font-bold disabled:opacity-40 dark:border-[#49333D]"
                            >
                              <ChevronLeft size={16} />
                              Previous
                            </button>

                            <button
                              type="button"
                              disabled={activeQuestionIndex >= questions.length - 1}
                              onClick={() =>
                                setActiveQuestionIndex((index) => index + 1)
                              }
                              className="flex items-center gap-1 rounded-xl border border-[#DCE4F3] px-3 py-2.5 text-sm font-bold disabled:opacity-40 dark:border-[#49333D]"
                            >
                              Next
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Card>

                {/* RECORDING */}
                <Card>
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF2454] dark:bg-[#3A202B]">
                      <Headphones size={21} />
                    </span>
                    <div>
                      <h2 className="font-black">Speaking Audio Recording</h2>
                      <p className="mt-1 text-xs leading-5 text-[#71809D]">
                        Record your spoken answer and upload it for transcription.
                        Maximum duration: 15 minutes.
                      </p>
                    </div>
                  </div>

                  <label className="mt-5 flex items-start gap-3 rounded-xl bg-[#F6F8FE] p-4 dark:bg-[#30232B]">
                    <input
                      type="checkbox"
                      checked={consent}
                      disabled={isRecording || recordingBusy}
                      onChange={(event) => setConsent(event.target.checked)}
                      className="mt-1 accent-[#FF2454]"
                    />
                    <span>
                      <span className="flex items-center gap-2 text-sm font-bold">
                        <ShieldCheck size={16} />
                        Recording consent
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#71809D]">
                        I consent to recording and processing my audio for this
                        Speaking submission.
                      </span>
                    </span>
                  </label>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        disabled={!consent || recordingBusy || !currentQuestion}
                        className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Mic size={17} />
                        Start recording
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white"
                      >
                        <Square size={16} />
                        Stop recording
                      </button>
                    )}

                    <span className="flex items-center gap-2 text-sm font-bold text-[#506995] dark:text-[#C1B5C0]">
                      {isRecording && (
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                      )}
                      <Clock size={16} />
                      {formatTime(recordingSeconds)}
                    </span>
                  </div>

                  {recordingBlob && (
                    <div className="mt-4 rounded-xl bg-[#F6F8FE] p-4 dark:bg-[#30232B]">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-green-700 dark:text-green-300">
                            Recording ready
                          </p>
                          <p className="mt-1 text-xs text-[#71809D]">
                            {(recordingBlob.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={uploadAndSubmitRecording}
                          disabled={recordingBusy || !consent}
                          className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                        >
                          {recordingBusy ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Upload size={16} />
                          )}
                          Upload and submit
                        </button>
                      </div>
                    </div>
                  )}

                  {transcriptionStatus && (
                    <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
                      Transcription status: <strong>{transcriptionStatus}</strong>
                    </div>
                  )}

                  {submissionId && (
                    <button
                      type="button"
                      onClick={handleWithdrawConsent}
                      disabled={recordingBusy || isRecording}
                      className="mt-4 text-xs font-bold text-red-600 underline disabled:opacity-40"
                    >
                      Withdraw recording consent
                    </button>
                  )}
                </Card>
              </>
            )}

            {!attempt && (
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <BookOpen className="text-[#FF2454]" size={24} />
                  <h3 className="mt-3 font-black">Published IELTS Content</h3>
                  <p className="mt-1 text-xs leading-5 text-[#71809D]">
                    Select real published Speaking tests from the backend.
                  </p>
                </Card>

                <Card>
                  <Target className="text-[#FF2454]" size={24} />
                  <h3 className="mt-3 font-black">Real Questions</h3>
                  <p className="mt-1 text-xs leading-5 text-[#71809D]">
                    Questions are loaded from your active practice attempt.
                  </p>
                </Card>

                <Card>
                  <Mic className="text-[#FF2454]" size={24} />
                  <h3 className="mt-3 font-black">Audio Submission</h3>
                  <p className="mt-1 text-xs leading-5 text-[#71809D]">
                    Record and submit your audio through the Speaking API.
                  </p>
                </Card>
              </div>
            )}
          </>
        )}

        {/* API CAPABILITY NOTE */}
        <Card>
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 shrink-0 text-[#FF2454]" size={19} />
            <div>
              <h3 className="font-bold">Speaking feedback and trainer sessions</h3>
              <p className="mt-1 text-xs leading-5 text-[#71809D]">
                The inspected backend provides practice attempts, question
                retrieval, answer saving, audio submission and transcription
                queueing. It does not currently expose a trainer-session booking
                endpoint or a Speaking submission result/status retrieval endpoint.
                Therefore this page does not show invented session schedules,
                trainer details, band scores or AI feedback.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </StudentLayout>
  );
}
