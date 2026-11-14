
import React, { useMemo, useState } from "react";
import {
  Video,
  CalendarDays,
  Clock,
  Users,
  Plus,
  Search,
  X,
  CheckCircle2,
  Mic,
  FileText,
  ExternalLink,
  ClipboardCheck,
  UserRound,
  AlertCircle,
  Eye,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const initialSessions = [
  {
    id: 1,
    student: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    batch: "Morning Batch",
    date: "2026-10-29",
    time: "10:00",
    duration: 15,
    type: "Full Speaking Test",
    status: "Upcoming",
    meetingLink: "",
    notes: "Full speaking assessment: all three parts.",
    scores: { fluency: 0, vocabulary: 0, grammar: 0, pronunciation: 0 },
    feedback: "",
  },
  {
    id: 2,
    student: "Priya Verma",
    email: "priya.verma@example.com",
    batch: "Evening Batch",
    date: "2026-10-29",
    time: "17:00",
    duration: 15,
    type: "Full Speaking Test",
    status: "Upcoming",
    meetingLink: "",
    notes: "Focus on fluency and vocabulary.",
    scores: { fluency: 0, vocabulary: 0, grammar: 0, pronunciation: 0 },
    feedback: "",
  },
  {
    id: 3,
    student: "Rahul Meena",
    email: "rahul.meena@example.com",
    batch: "Weekend Batch",
    date: "2026-10-27",
    time: "11:30",
    duration: 10,
    type: "Speaking Practice",
    status: "Completed",
    meetingLink: "",
    notes: "Part 2 cue card practice.",
    scores: { fluency: 6, vocabulary: 5.5, grammar: 5.5, pronunciation: 6 },
    feedback: "Practice extending answers with examples and improve grammatical accuracy.",
  },
  {
    id: 4,
    student: "Sneha Gupta",
    email: "sneha.gupta@example.com",
    batch: "Morning Batch",
    date: "2026-10-30",
    time: "09:30",
    duration: 15,
    type: "Full Speaking Test",
    status: "Upcoming",
    meetingLink: "",
    notes: "Full speaking assessment.",
    scores: { fluency: 0, vocabulary: 0, grammar: 0, pronunciation: 0 },
    feedback: "",
  },
  {
    id: 5,
    student: "Rohan Singh",
    email: "rohan.singh@example.com",
    batch: "Evening Batch",
    date: "2026-10-25",
    time: "16:00",
    duration: 15,
    type: "Full Speaking Test",
    status: "Completed",
    meetingLink: "",
    notes: "Full speaking assessment.",
    scores: { fluency: 5, vocabulary: 5, grammar: 4.5, pronunciation: 5 },
    feedback: "Work on sentence structure, clearer pronunciation and longer answers.",
  },
];

const studentOptions = [
  { name: "Aarav Sharma", email: "aarav.sharma@example.com", batch: "Morning Batch" },
  { name: "Priya Verma", email: "priya.verma@example.com", batch: "Evening Batch" },
  { name: "Rahul Meena", email: "rahul.meena@example.com", batch: "Weekend Batch" },
  { name: "Sneha Gupta", email: "sneha.gupta@example.com", batch: "Morning Batch" },
  { name: "Rohan Singh", email: "rohan.singh@example.com", batch: "Evening Batch" },
  { name: "Ananya Joshi", email: "ananya.joshi@example.com", batch: "Weekend Batch" },
];

const criteria = [
  { key: "fluency", label: "Fluency & Coherence" },
  { key: "vocabulary", label: "Lexical Resource" },
  { key: "grammar", label: "Grammatical Range & Accuracy" },
  { key: "pronunciation", label: "Pronunciation" },
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50 dark:!border-[#3B3441] dark:!bg-[#19171E] dark:!text-[#F4F0F7] dark:placeholder:!text-[#91899B]";

function getSessionDate(session) {
  return new Date(`${session.date}T${session.time}:00`);
}

function getAverage(scores) {
  const values = Object.values(scores).map(Number);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function LiveSpeakingTest() {
  const [sessions, setSessions] = useState(initialSessions);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("All Batches");
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showScoring, setShowScoring] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [scheduleForm, setScheduleForm] = useState({
    student: "",
    date: "",
    time: "10:00",
    duration: "15",
    type: "Full Speaking Test",
    meetingLink: "",
    notes: "",
  });

  const [scoreForm, setScoreForm] = useState({
    fluency: 6,
    vocabulary: 6,
    grammar: 6,
    pronunciation: 6,
    feedback: "",
  });

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        session.student.toLowerCase().includes(query) ||
        session.email.toLowerCase().includes(query) ||
        session.type.toLowerCase().includes(query);

      const matchesBatch =
        batchFilter === "All Batches" || session.batch === batchFilter;

      const matchesTab =
        activeTab === "All Sessions" || session.status === activeTab;

      return matchesSearch && matchesBatch && matchesTab;
    });
  }, [sessions, search, batchFilter, activeTab]);

  const upcomingCount = sessions.filter(
    (session) => session.status === "Upcoming"
  ).length;

  const completedCount = sessions.filter(
    (session) => session.status === "Completed"
  ).length;

  const todayCount = sessions.filter(
    (session) => session.date === getLocalDate()
  ).length;

  const resetScheduleForm = () => {
    setScheduleForm({
      student: "",
      date: "",
      time: "10:00",
      duration: "15",
      type: "Full Speaking Test",
      meetingLink: "",
      notes: "",
    });
  };

  const scheduleSession = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const selectedStudent = studentOptions.find(
      (student) => student.name === scheduleForm.student
    );

    if (!selectedStudent) {
      setError("Please select a student.");
      return;
    }

    const sessionDate = getSessionDate({
      date: scheduleForm.date,
      time: scheduleForm.time,
    });

    if (!scheduleForm.date || Number.isNaN(sessionDate.getTime())) {
      setError("Please select a valid date and time.");
      return;
    }

    if (sessionDate.getTime() < Date.now()) {
      setError("Please select a future date and time.");
      return;
    }

    if (
      scheduleForm.meetingLink &&
      !/^https?:\/\/.+/i.test(scheduleForm.meetingLink.trim())
    ) {
      setError("Meeting link must start with http:// or https://.");
      return;
    }

    const newSession = {
      id: Date.now(),
      student: selectedStudent.name,
      email: selectedStudent.email,
      batch: selectedStudent.batch,
      date: scheduleForm.date,
      time: scheduleForm.time,
      duration: Number(scheduleForm.duration),
      type: scheduleForm.type,
      status: "Upcoming",
      meetingLink: scheduleForm.meetingLink.trim(),
      notes: scheduleForm.notes.trim(),
      scores: { fluency: 0, vocabulary: 0, grammar: 0, pronunciation: 0 },
      feedback: "",
    };

    setSessions((previous) => [newSession, ...previous]);
    setActiveTab("Upcoming");
    setSearch("");
    setBatchFilter("All Batches");
    resetScheduleForm();
    setShowSchedule(false);
    setSuccess("Speaking session scheduled in the demo list.");
  };

  const openScoring = (session) => {
    setSelectedSession(session);
    setScoreForm({
      fluency: session.scores.fluency || 6,
      vocabulary: session.scores.vocabulary || 6,
      grammar: session.scores.grammar || 6,
      pronunciation: session.scores.pronunciation || 6,
      feedback: session.feedback || "",
    });
    setError("");
    setShowScoring(true);
  };

  const submitScore = (event) => {
    event.preventDefault();

    if (!selectedSession) return;

    if (!scoreForm.feedback.trim()) {
      setError("Please enter feedback before saving the assessment.");
      return;
    }

    setSessions((previous) =>
      previous.map((session) =>
        session.id === selectedSession.id
          ? {
              ...session,
              status: "Completed",
              scores: {
                fluency: Number(scoreForm.fluency),
                vocabulary: Number(scoreForm.vocabulary),
                grammar: Number(scoreForm.grammar),
                pronunciation: Number(scoreForm.pronunciation),
              },
              feedback: scoreForm.feedback.trim(),
            }
          : session
      )
    );

    setShowScoring(false);
    setSelectedSession(null);
    setError("");
    setSuccess("Speaking assessment saved in the demo list.");
  };

  const deleteSession = (id) => {
    if (!window.confirm("Delete this demo speaking session?")) return;

    setSessions((previous) =>
      previous.filter((session) => session.id !== id)
    );

    setSelectedSession(null);
    setSuccess("Demo session removed.");
  };

  return (
    <div className="live-speaking-page min-h-screen bg-[#F5F7FF] text-[#10265F] dark:!bg-[#17151B] dark:!text-[#F4F0F7]">
      <style>{`
        .dark .live-speaking-page {
          background: #17151B !important;
          color: #F4F0F7 !important;
        }

        .dark .live-speaking-page [class*="bg-white"],
        .dark .live-speaking-page [class*="bg-gray-50"],
        .dark .live-speaking-page [class*="bg-gray-100"] {
          background-color: #211E27 !important;
        }

        .dark .live-speaking-page [class*="text-[#10265F]"],
        .dark .live-speaking-page [class*="text-gray-700"],
        .dark .live-speaking-page [class*="text-gray-800"] {
          color: #F4F0F7 !important;
        }

        .dark .live-speaking-page [class*="text-gray-500"],
        .dark .live-speaking-page [class*="text-gray-400"],
        .dark .live-speaking-page [class*="text-gray-600"] {
          color: #B0A5BD !important;
        }

        .dark .live-speaking-page [class*="border-gray-100"],
        .dark .live-speaking-page [class*="border-gray-200"] {
          border-color: #3B3441 !important;
        }

        .dark .live-speaking-page input:not([type="range"]),
        .dark .live-speaking-page select,
        .dark .live-speaking-page textarea {
          background: #19171E !important;
          color: #F4F0F7 !important;
          border-color: #3B3441 !important;
        }

        .dark .live-speaking-page input::placeholder,
        .dark .live-speaking-page textarea::placeholder {
          color: #91899B !important;
        }
      `}</style>

      <Sidebar />

      <div className="min-w-0 lg:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm text-gray-500">
                Trainer Portal / Live Speaking Test
              </p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Live Speaking Tests
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Schedule speaking sessions, conduct IELTS interviews and
                record feedback using the four assessment criteria.
              </p>
            </div>

            <button
              onClick={() => {
                setError("");
                setSuccess("");
                setShowSchedule(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e91d49]"
            >
              <Plus size={18} />
              Schedule Speaking Test
            </button>
          </section>

          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
              <CheckCircle2 size={18} />
              <span>{success}</span>
              <button
                onClick={() => setSuccess("")}
                className="ml-auto"
                aria-label="Dismiss message"
              >
                <X size={17} />
              </button>
            </div>
          )}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Sessions"
              value={sessions.length}
              subtitle="Scheduled and completed"
              icon={<Video size={22} />}
              color="blue"
            />
            <StatCard
              title="Upcoming Sessions"
              value={upcomingCount}
              subtitle="Awaiting interview"
              icon={<CalendarDays size={22} />}
              color="purple"
            />
            <StatCard
              title="Completed Sessions"
              value={completedCount}
              subtitle="Assessment recorded"
              icon={<CheckCircle2 size={22} />}
              color="green"
            />
            <StatCard
              title="Today's Sessions"
              value={todayCount}
              subtitle="Scheduled for today"
              icon={<Clock size={22} />}
              color="orange"
            />
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27] sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300">
                  <Mic size={22} />
                </div>
                <div>
                  <h2 className="font-bold">IELTS Speaking Test Format</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Use the three-part speaking interview structure.
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 lg:self-center">
                <Clock size={15} />
                10–15 minutes
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              <PartCard
                part="Part 1"
                title="Introduction & Interview"
                duration="4–5 minutes"
                description="Questions about familiar topics, everyday life and personal experiences."
              />
              <PartCard
                part="Part 2"
                title="Individual Long Turn"
                duration="3–4 minutes"
                description="Student speaks about a cue-card topic, including preparation time."
              />
              <PartCard
                part="Part 3"
                title="Discussion"
                duration="4–5 minutes"
                description="More detailed discussion connected to the Part 2 topic."
              />
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]">
            <div className="border-b border-gray-100 p-5 dark:border-[#3B3441] sm:p-6">
              <h2 className="font-bold">Speaking Sessions</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage appointments and review completed assessments.
              </p>

              <div className="mt-5 flex flex-col gap-3 xl:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by student or test type..."
                    className={`${inputClass} bg-gray-50 pl-10`}
                  />
                </div>

                <select
                  value={batchFilter}
                  onChange={(event) => setBatchFilter(event.target.value)}
                  className={`${inputClass} xl:max-w-[190px]`}
                >
                  <option>All Batches</option>
                  <option>Morning Batch</option>
                  <option>Evening Batch</option>
                  <option>Weekend Batch</option>
                </select>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {["Upcoming", "Completed", "All Sessions"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      activeTab === tab
                        ? "bg-[#10265F] text-white"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#292530]"
                    }`}
                  >
                    {tab}
                    <span className="ml-2 opacity-70">
                      {tab === "Upcoming"
                        ? upcomingCount
                        : tab === "Completed"
                          ? completedCount
                          : sessions.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-gray-50 dark:bg-[#19171E]">
                  <tr className="text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Session</th>
                    <th className="px-5 py-4">Date & Time</th>
                    <th className="px-5 py-4">Duration</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-[#3B3441]">
                  {filteredSessions.map((session) => (
                    <tr
                      key={session.id}
                      className="hover:bg-gray-50/70 dark:hover:bg-[#292530]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
                            {session.student
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">
                              {session.student}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {session.batch}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium">{session.type}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {session.notes || "No additional notes"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium">
                          {new Date(
                            `${session.date}T12:00:00`
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {session.time}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {session.duration} min
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={session.status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {session.status === "Upcoming" ? (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedSession(session);
                                  setError("");
                                }}
                                className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 dark:border-[#3B3441] dark:hover:bg-[#292530]"
                                title="View session"
                              >
                                <FileText size={17} />
                              </button>

                              <button
                                onClick={() => {
                                  if (session.meetingLink) {
                                    window.open(
                                      session.meetingLink,
                                      "_blank",
                                      "noopener,noreferrer"
                                    );
                                  } else {
                                    setSelectedSession(session);
                                    setError("");
                                  }
                                }}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#FF2454] px-3 py-2 text-xs font-semibold text-white hover:bg-[#e91d49]"
                              >
                                <Video size={15} />
                                {session.meetingLink ? "Join" : "Start"}
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedSession(session);
                                setError("");
                              }}
                              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold hover:bg-gray-50 dark:border-[#3B3441] dark:hover:bg-[#292530]"
                            >
                              <Eye size={15} />
                              View Report
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredSessions.length === 0 && (
              <div className="px-6 py-14 text-center">
                <Video size={32} className="mx-auto text-gray-300" />
                <p className="mt-3 font-semibold">No sessions found</p>
                <p className="mt-1 text-sm text-gray-500">
                  Try changing the filters or schedule a new session.
                </p>
              </div>
            )}

            <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-400 dark:border-[#3B3441]">
              Showing {filteredSessions.length} of {sessions.length} demo
              sessions.
            </div>
          </section>
        </main>
      </div>

      {showSchedule && (
        <Modal
          title="Schedule Speaking Test"
          onClose={() => {
            setShowSchedule(false);
            setError("");
          }}
        >
          <p className="mb-5 text-sm leading-6 text-gray-500">
            Choose a student, interview time and optional video meeting link.
          </p>

          <form onSubmit={scheduleSession} className="space-y-4">
            <Field label="Select Student" required>
              <select
                name="student"
                value={scheduleForm.student}
                onChange={(event) =>
                  setScheduleForm({
                    ...scheduleForm,
                    student: event.target.value,
                  })
                }
                required
                className={inputClass}
              >
                <option value="">Choose a student</option>
                {studentOptions.map((student) => (
                  <option key={student.email} value={student.name}>
                    {student.name} — {student.batch}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Test Type" required>
              <select
                name="type"
                value={scheduleForm.type}
                onChange={(event) =>
                  setScheduleForm({
                    ...scheduleForm,
                    type: event.target.value,
                  })
                }
                className={inputClass}
              >
                <option>Full Speaking Test</option>
                <option>Speaking Practice</option>
                <option>Part 1 Practice</option>
                <option>Part 2 Cue Card</option>
                <option>Part 3 Discussion</option>
              </select>
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Date" required>
                <input
                  type="date"
                  value={scheduleForm.date}
                  min={getLocalDate()}
                  onChange={(event) =>
                    setScheduleForm({
                      ...scheduleForm,
                      date: event.target.value,
                    })
                  }
                  required
                  className={inputClass}
                />
              </Field>

              <Field label="Start Time" required>
                <input
                  type="time"
                  value={scheduleForm.time}
                  onChange={(event) =>
                    setScheduleForm({
                      ...scheduleForm,
                      time: event.target.value,
                    })
                  }
                  required
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Duration" required>
              <select
                value={scheduleForm.duration}
                onChange={(event) =>
                  setScheduleForm({
                    ...scheduleForm,
                    duration: event.target.value,
                  })
                }
                className={inputClass}
              >
                <option value="10">10 minutes</option>
                <option value="12">12 minutes</option>
                <option value="15">15 minutes</option>
              </select>
            </Field>

            <Field label="Video Meeting Link">
              <input
                type="url"
                value={scheduleForm.meetingLink}
                onChange={(event) =>
                  setScheduleForm({
                    ...scheduleForm,
                    meetingLink: event.target.value,
                  })
                }
                placeholder="https://meet.example.com/..."
                className={inputClass}
              />
              <p className="mt-1.5 text-xs text-gray-400">
                Add an existing meeting URL. This form does not create a video
                room.
              </p>
            </Field>

            <Field label="Session Notes">
              <textarea
                value={scheduleForm.notes}
                onChange={(event) =>
                  setScheduleForm({
                    ...scheduleForm,
                    notes: event.target.value,
                  })
                }
                rows={3}
                placeholder="Topics or instructions for the interview..."
                className={`${inputClass} resize-y`}
              />
            </Field>

            {error && <ErrorMessage message={error} />}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setShowSchedule(false);
                  setError("");
                }}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold hover:bg-gray-50 dark:border-[#3B3441] dark:hover:bg-[#292530]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-semibold text-white hover:bg-[#e91d49]"
              >
                <CalendarDays size={17} />
                Schedule Session
              </button>
            </div>
          </form>
        </Modal>
      )}

      {selectedSession && !showScoring && (
        <Modal
          title="Speaking Session Details"
          onClose={() => {
            setSelectedSession(null);
            setError("");
          }}
        >
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#19171E]">
            <p className="text-xs text-gray-500">{selectedSession.type}</p>
            <h3 className="mt-1 text-lg font-bold">
              {selectedSession.student}
            </h3>
            <p className="mt-1 break-all text-sm text-gray-500">
              {selectedSession.batch} · {selectedSession.email}
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <DetailRow
              icon={<CalendarDays size={17} />}
              label="Date"
              value={selectedSession.date}
            />
            <DetailRow
              icon={<Clock size={17} />}
              label="Time and Duration"
              value={`${selectedSession.time} · ${selectedSession.duration} minutes`}
            />
            <DetailRow
              icon={<CheckCircle2 size={17} />}
              label="Status"
              value={selectedSession.status}
            />
            <DetailRow
              icon={<FileText size={17} />}
              label="Notes"
              value={selectedSession.notes || "No notes"}
            />
          </div>

          {selectedSession.meetingLink && (
            <a
              href={selectedSession.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300"
            >
              Open Meeting Link
              <ExternalLink size={16} />
            </a>
          )}

          {selectedSession.status === "Completed" ? (
            <div className="mt-5 rounded-xl border border-gray-100 p-4 dark:border-[#3B3441]">
              <h4 className="font-bold">Speaking Assessment</h4>

              <div className="mt-3 grid grid-cols-2 gap-3">
                {criteria.map((criterion) => (
                  <div
                    key={criterion.key}
                    className="rounded-lg bg-gray-50 p-3 dark:bg-[#19171E]"
                  >
                    <p className="text-xs text-gray-500">
                      {criterion.label}
                    </p>
                    <p className="mt-1 text-lg font-bold">
                      {selectedSession.scores[criterion.key]}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-[#B0A5BD]">
                {selectedSession.feedback || "No feedback saved."}
              </p>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => openScoring(selectedSession)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#10265F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#19377d]"
              >
                <ClipboardCheck size={17} />
                Enter Assessment
              </button>

              <button
                onClick={() => {
                  if (selectedSession.meetingLink) {
                    window.open(
                      selectedSession.meetingLink,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  } else {
                    setError(
                      "No meeting link is configured. Add a real video meeting provider to conduct the interview."
                    );
                  }
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold hover:bg-gray-50 dark:border-[#3B3441] dark:hover:bg-[#292530]"
              >
                <Video size={17} />
                Open Meeting
              </button>
            </div>
          )}

          {selectedSession.status === "Upcoming" && (
            <button
              onClick={() => deleteSession(selectedSession.id)}
              className="mt-4 w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
            >
              Delete Demo Session
            </button>
          )}

          {error && <div className="mt-4"><ErrorMessage message={error} /></div>}
        </Modal>
      )}

      {showScoring && selectedSession && (
        <Modal
          title="Speaking Assessment"
          onClose={() => {
            setShowScoring(false);
            setError("");
          }}
        >
          <div className="mb-5 rounded-xl bg-blue-50 p-4 dark:bg-[#252B40]">
            <p className="text-xs text-blue-600 dark:text-blue-300">
              Student
            </p>
            <p className="mt-1 font-bold text-blue-900 dark:text-blue-100">
              {selectedSession.student}
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              {selectedSession.date} · {selectedSession.time}
            </p>
          </div>

          <form onSubmit={submitScore} className="space-y-5">
            <p className="text-sm leading-6 text-gray-500">
              Rate each IELTS speaking criterion from 0 to 9 in half-band
              increments and provide trainer feedback.
            </p>

            {criteria.map((criterion) => (
              <div key={criterion.key}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor={`score-${criterion.key}`}
                    className="text-sm font-semibold"
                  >
                    {criterion.label}
                  </label>
                  <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
                    {Number(scoreForm[criterion.key]).toFixed(1)}
                  </span>
                </div>

                <input
                  id={`score-${criterion.key}`}
                  type="range"
                  min="0"
                  max="9"
                  step="0.5"
                  value={scoreForm[criterion.key]}
                  onChange={(event) =>
                    setScoreForm({
                      ...scoreForm,
                      [criterion.key]: Number(event.target.value),
                    })
                  }
                  className="w-full accent-[#FF2454]"
                />

                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>0</span>
                  <span>4.5</span>
                  <span>9</span>
                </div>
              </div>
            ))}

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#19171E]">
              <p className="text-sm text-gray-500">
                Average criterion score (helper)
              </p>
              <p className="mt-1 text-2xl font-bold">
                {getAverage({
                  fluency: scoreForm.fluency,
                  vocabulary: scoreForm.vocabulary,
                  grammar: scoreForm.grammar,
                  pronunciation: scoreForm.pronunciation,
                }).toFixed(2)}
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-400">
                Confirm the final score according to the official assessment
                rules. This average is not automatically treated as an official
                IELTS band.
              </p>
            </div>

            <Field label="Trainer Feedback" required>
              <textarea
                value={scoreForm.feedback}
                onChange={(event) =>
                  setScoreForm({
                    ...scoreForm,
                    feedback: event.target.value,
                  })
                }
                rows={4}
                placeholder="Provide feedback on fluency, vocabulary, grammar and pronunciation..."
                required
                className={`${inputClass} resize-y`}
              />
            </Field>

            {error && <ErrorMessage message={error} />}

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setShowScoring(false);
                  setError("");
                }}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold hover:bg-gray-50 dark:border-[#3B3441] dark:hover:bg-[#292530]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-semibold text-white hover:bg-[#e91d49]"
              >
                <CheckCircle2 size={17} />
                Save Assessment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-300",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-300",
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="mt-3 text-3xl font-bold">{value}</h3>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}

function PartCard({ part, title, duration, description }) {
  return (
    <div className="rounded-xl border border-gray-100 p-4 dark:border-[#3B3441]">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
          {part}
        </span>
        <span className="text-xs text-gray-400">{duration}</span>
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const style =
    status === "Completed"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
      : "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300";

  return (
    <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${style}`}>
      {status}
    </span>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}
        {required && <span className="ml-1 text-[#FF2454]">*</span>}
      </label>
      {children}
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="mt-1 break-words text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-300">
      <AlertCircle size={17} className="mt-0.5 shrink-0" />
      {message}
    </p>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#0B1739]/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="my-auto max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl dark:!bg-[#211E27] sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-[#10265F] dark:!text-[#F4F0F7]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-[#292530]"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
