import React, { useMemo, useState } from "react";
import {
  Search,
  Users,
  TrendingUp,
  TrendingDown,
  Target,
  BookOpen,
  Headphones,
  PenLine,
  MessageCircle,
  ChevronDown,
  Eye,
  X,
  Download,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const initialStudents = [
  { id: 1, name: "Aarav Sharma", email: "aarav.sharma@example.com", phone: "+91 98765 43210", batch: "Morning Batch", overall: 6.5, listening: 7, reading: 6.5, writing: 5.5, speaking: 6, progress: 0.5, active: true },
  { id: 2, name: "Priya Verma", email: "priya.verma@example.com", phone: "+91 98765 43211", batch: "Evening Batch", overall: 7.5, listening: 8, reading: 8, writing: 6.5, speaking: 7, progress: 1, active: true },
  { id: 3, name: "Rahul Meena", email: "rahul.meena@example.com", phone: "+91 98765 43212", batch: "Weekend Batch", overall: 5.5, listening: 6, reading: 5.5, writing: 4.5, speaking: 5.5, progress: 0.5, active: true },
  { id: 4, name: "Sneha Gupta", email: "sneha.gupta@example.com", phone: "+91 98765 43213", batch: "Morning Batch", overall: 7, listening: 7.5, reading: 7, writing: 6.5, speaking: 7, progress: 0.5, active: true },
  { id: 5, name: "Rohan Singh", email: "rohan.singh@example.com", phone: "+91 98765 43214", batch: "Evening Batch", overall: 5, listening: 5.5, reading: 5, writing: 4.5, speaking: 5, progress: -0.5, active: false },
  { id: 6, name: "Ananya Joshi", email: "ananya.joshi@example.com", phone: "+91 98765 43215", batch: "Weekend Batch", overall: 6.5, listening: 7, reading: 6, writing: 5.5, speaking: 6.5, progress: 0.5, active: true },
];

const scoreHistory = {
  1: [{ date: "Sep 08", score: 5.5 }, { date: "Sep 15", score: 5.5 }, { date: "Sep 22", score: 6 }, { date: "Sep 29", score: 6 }, { date: "Oct 06", score: 6.5 }, { date: "Oct 13", score: 6.5 }],
  2: [{ date: "Sep 08", score: 6.5 }, { date: "Sep 15", score: 7 }, { date: "Sep 22", score: 7 }, { date: "Sep 29", score: 7.5 }, { date: "Oct 06", score: 7 }, { date: "Oct 13", score: 7.5 }],
  3: [{ date: "Sep 08", score: 4.5 }, { date: "Sep 15", score: 5 }, { date: "Sep 22", score: 5 }, { date: "Sep 29", score: 5.5 }, { date: "Oct 06", score: 5 }, { date: "Oct 13", score: 5.5 }],
  4: [{ date: "Sep 08", score: 6 }, { date: "Sep 15", score: 6 }, { date: "Sep 22", score: 6.5 }, { date: "Sep 29", score: 6.5 }, { date: "Oct 06", score: 7 }, { date: "Oct 13", score: 7 }],
  5: [{ date: "Sep 08", score: 5.5 }, { date: "Sep 15", score: 5.5 }, { date: "Sep 22", score: 5 }, { date: "Sep 29", score: 5 }, { date: "Oct 06", score: 5.5 }, { date: "Oct 13", score: 5 }],
  6: [{ date: "Sep 08", score: 5.5 }, { date: "Sep 15", score: 5.5 }, { date: "Sep 22", score: 6 }, { date: "Sep 29", score: 6 }, { date: "Oct 06", score: 6.5 }, { date: "Oct 13", score: 6.5 }],
};

const attempts = [
  { id: 1, title: "IELTS Full Mock Test 03", date: "13 Oct 2026", listening: 7, reading: 6.5, writing: 5.5, speaking: 6, overall: 6.5, status: "Reviewed" },
  { id: 2, title: "IELTS Reading Practice 08", date: "10 Oct 2026", listening: null, reading: 7, writing: null, speaking: null, overall: 7, status: "Completed" },
  { id: 3, title: "IELTS Writing Task 2", date: "08 Oct 2026", listening: null, reading: null, writing: 5.5, speaking: null, overall: 5.5, status: "Reviewed" },
  { id: 4, title: "IELTS Full Mock Test 02", date: "05 Oct 2026", listening: 6.5, reading: 6, writing: 5, speaking: 5.5, overall: 6, status: "Reviewed" },
];

const feedbackRecords = [
  { id: 1, skill: "Writing", title: "Task 2 Essay - Technology in Education", date: "13 Oct 2026", score: 5.5, reviewer: "Trainer", feedback: "Your essay has a clear opinion. Improve paragraph development, use more varied sentence structures, and support your arguments with specific examples." },
  { id: 2, skill: "Speaking", title: "Speaking Part 2 - Describe a Person", date: "11 Oct 2026", score: 6, reviewer: "Trainer", feedback: "You communicate your ideas clearly. Work on fluency, avoid long pauses, and use a wider range of vocabulary." },
  { id: 3, skill: "Writing", title: "Task 1 - Academic Chart", date: "08 Oct 2026", score: 5.5, reviewer: "Trainer", feedback: "Include a clear overview and compare the most important data points. Review grammar accuracy and linking words." },
  { id: 4, skill: "Speaking", title: "Speaking Part 3 - Education", date: "06 Oct 2026", score: 6.5, reviewer: "Trainer", feedback: "Your answers are relevant. Develop your ideas further and support opinions with examples." },
];

const skills = [
  { key: "listening", label: "Listening", icon: Headphones, color: "blue" },
  { key: "reading", label: "Reading", icon: BookOpen, color: "purple" },
  { key: "writing", label: "Writing", icon: PenLine, color: "orange" },
  { key: "speaking", label: "Speaking", icon: MessageCircle, color: "green" },
];

const inputClass =
  "w-full rounded-xl border border-[#E4EAF5] bg-white px-4 py-3 text-sm text-[#10265F] outline-none transition placeholder:text-[#9AA8C2] focus:border-blue-300 focus:ring-2 focus:ring-blue-50 dark:!border-[#3B3441] dark:!bg-[#19171E] dark:!text-[#F4F0F7] dark:placeholder:!text-[#91899B]";

const cardClass =
  "rounded-2xl border border-[#E9EDF6] bg-white shadow-sm dark:!border-[#3B3441] dark:!bg-[#211E27]";

const mutedText = "text-[#71809D] dark:!text-[#B0A5BD]";
const secondaryText = "text-[#8A9ABB] dark:!text-[#91899B]";
const headingText = "text-[#10265F] dark:!text-[#F4F0F7]";

export default function StudentReports() {
  const [students] = useState(initialStudents);
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("All Batches");
  const [showStudentList, setShowStudentList] = useState(false);
  const [activeTab, setActiveTab] = useState("Attempts");
  const [period, setPeriod] = useState("Last 6 weeks");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [attemptSearch, setAttemptSearch] = useState("");

  const student = students.find((item) => item.id === selectedId) || students[0];

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.phone.includes(query);

      const matchesBatch =
        batchFilter === "All Batches" || item.batch === batchFilter;

      return matchesSearch && matchesBatch;
    });
  }, [students, search, batchFilter]);

  const skillData = skills.map((skill) => ({
    ...skill,
    score: student[skill.key],
  }));

  const weakSkills = [...skillData]
    .filter((skill) => skill.score < 6.5)
    .sort((a, b) => a.score - b.score);

  const history = scoreHistory[student.id] || [];
  const chartHistory =
    period === "Last 3 months"
      ? [{ date: "Aug", score: Math.max(4, student.overall - 1) }, ...history]
      : history;

  const studentAttempts =
    student.id === 1
      ? attempts
      : attempts.map((attempt, index) => {
          const adjust = student.overall - 6.5;
          const overall =
            attempt.overall === null
              ? null
              : Math.max(
                  4,
                  Math.min(
                    9,
                    Math.round(
                      (attempt.overall + adjust * (index % 2 === 0 ? 1 : 0.5)) * 2
                    ) / 2
                  )
                );

          return { ...attempt, overall };
        });

  const filteredAttempts = studentAttempts.filter((attempt) =>
    attempt.title.toLowerCase().includes(attemptSearch.toLowerCase())
  );

  const writingFeedback = feedbackRecords.filter(
    (item) => item.skill === "Writing"
  );

  const speakingFeedback = feedbackRecords.filter(
    (item) => item.skill === "Speaking"
  );

  const averageProgress = Math.round(
    (students.reduce((sum, item) => sum + item.overall, 0) /
      students.length /
      9) *
      100
  );

  const handleExport = () => {
    const rows = [
      ["Student", "Email", "Phone", "Batch", "Overall Band", "Listening", "Reading", "Writing", "Speaking", "Progress"],
      [
        student.name,
        student.email,
        student.phone,
        student.batch,
        student.overall,
        student.listening,
        student.reading,
        student.writing,
        student.speaking,
        student.progress,
      ],
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${student.name.replace(/\s+/g, "-")}-report.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="student-reports-page min-h-screen bg-[#F5F7FF] text-[#10265F] dark:!bg-[#17151B] dark:!text-[#F4F0F7]">
      <style>{`
        .dark .student-reports-page {
          background: #17151B !important;
          color: #F4F0F7 !important;
        }
        .dark .student-reports-page [class*="bg-white"],
        .dark .student-reports-page [class*="bg-[#F5F7FF]"],
        .dark .student-reports-page [class*="bg-[#F8FAFF]"],
        .dark .student-reports-page [class*="bg-[#F9FBFF]"] {
          background-color: #211E27 !important;
        }
        .dark .student-reports-page [class*="text-[#10265F]"],
        .dark .student-reports-page [class*="text-[#18336F]"],
        .dark .student-reports-page [class*="text-[#1E3265]"] {
          color: #F4F0F7 !important;
        }
        .dark .student-reports-page [class*="text-[#71809D]"],
        .dark .student-reports-page [class*="text-[#64728D]"],
        .dark .student-reports-page [class*="text-[#8A9ABB]"],
        .dark .student-reports-page [class*="text-[#9AA8C2]"] {
          color: #B0A5BD !important;
        }
        .dark .student-reports-page [class*="border-[#E4EAF5]"],
        .dark .student-reports-page [class*="border-[#E9EDF6]"],
        .dark .student-reports-page [class*="border-[#E9EDF5]"],
        .dark .student-reports-page [class*="border-[#EEF2FA]"],
        .dark .student-reports-page [class*="border-[#DDE5F2]"] {
          border-color: #3B3441 !important;
        }
        .dark .student-reports-page input,
        .dark .student-reports-page select,
        .dark .student-reports-page textarea {
          background-color: #19171E !important;
          color: #F4F0F7 !important;
          border-color: #3B3441 !important;
        }
        .dark .student-reports-page input::placeholder {
          color: #91899B !important;
        }
        .dark .student-reports-page button:hover {
          border-color: #514758;
        }
        .dark .student-reports-page svg line {
          stroke: #514758;
        }
      `}</style>

      <Sidebar />

      <div className="min-w-0 lg:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <p className={`mb-2 text-sm ${mutedText}`}>
                Trainer Portal / Student Reports
              </p>
              <h1 className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${headingText}`}>
                Student Reports
              </h1>
              <p className={`mt-2 max-w-2xl text-sm leading-6 sm:text-base ${mutedText}`}>
                Track IELTS performance, identify skill-wise weaknesses, and
                review student attempt and feedback history.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E91C49]"
            >
              <Download size={18} />
              Export Student Report
            </button>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Students" value={students.length} subtitle="Students in your list" icon={<Users size={23} />} tone="blue" />
            <StatCard title="Active Students" value={students.filter((item) => item.active).length} subtitle="Currently active" icon={<CheckCircle2 size={23} />} tone="green" />
            <StatCard
              title="Average Band Score"
              value={(students.reduce((sum, item) => sum + item.overall, 0) / students.length).toFixed(1)}
              subtitle="Across all students"
              icon={<BarChart3 size={23} />}
              tone="purple"
            />
            <StatCard title="Average Progress" value={`${averageProgress}%`} subtitle="Average score as percentage of 9" icon={<ArrowUpRight size={23} />} tone="orange" />
          </section>

          <section className={`${cardClass} p-5 sm:p-6`}>
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <h2 className={`text-lg font-bold ${headingText}`}>Select Student</h2>
                <p className={`mt-1 text-sm ${mutedText}`}>
                  Choose a student to view their individual performance report.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowStudentList((previous) => !previous)}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#E4EAF5] px-4 py-3 text-sm font-semibold transition hover:bg-[#F8FAFF] dark:border-[#3B3441] dark:hover:bg-[#292530] xl:min-w-[270px]"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700">
                    {getInitials(student.name)}
                  </span>
                  <span className="text-left">
                    <span className={`block ${headingText}`}>{student.name}</span>
                    <span className={`mt-1 block text-xs font-normal ${secondaryText}`}>
                      {student.batch}
                    </span>
                  </span>
                </span>
                <ChevronDown size={18} className={`transition ${showStudentList ? "rotate-180" : ""}`} />
              </button>
            </div>

            {showStudentList && (
              <div className="mt-5 rounded-xl border border-[#E9EDF6] bg-[#F8FAFF] p-4 dark:border-[#3B3441] dark:bg-[#19171E]">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="relative">
                    <Search size={17} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${secondaryText}`} />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search name, email or phone..."
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                  <select
                    value={batchFilter}
                    onChange={(event) => setBatchFilter(event.target.value)}
                    className={inputClass}
                  >
                    <option>All Batches</option>
                    <option>Morning Batch</option>
                    <option>Evening Batch</option>
                    <option>Weekend Batch</option>
                  </select>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredStudents.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => {
                        setSelectedId(item.id);
                        setShowStudentList(false);
                        setSearch("");
                        setBatchFilter("All Batches");
                      }}
                      className={`rounded-xl border p-4 text-left transition ${
                        item.id === selectedId
                          ? "border-[#FF2454] bg-rose-50 dark:!bg-[#39212B]"
                          : "border-[#E4EAF5] bg-white hover:border-blue-200 dark:!border-[#3B3441] dark:!bg-[#211E27] dark:hover:!bg-[#292530]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                            {getInitials(item.name)}
                          </span>
                          <div className="min-w-0">
                            <p className={`truncate text-sm font-semibold ${headingText}`}>{item.name}</p>
                            <p className={`mt-1 truncate text-xs ${secondaryText}`}>{item.batch}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 text-lg font-extrabold ${headingText}`}>{item.overall}</span>
                      </div>
                      <p className={`mt-3 truncate text-xs ${mutedText}`}>{item.email}</p>
                    </button>
                  ))}

                  {filteredStudents.length === 0 && (
                    <p className={`col-span-full py-8 text-center text-sm ${mutedText}`}>
                      No students found. Try another search or batch.
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="overflow-hidden rounded-2xl bg-[#10265F] p-5 text-white shadow-sm sm:p-7">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold">
                  {getInitials(student.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-blue-100">Student Profile</p>
                  <h2 className="mt-1 truncate text-2xl font-bold">{student.name}</h2>
                  <p className="mt-1 text-sm text-blue-100">{student.email}</p>
                  <p className="mt-1 text-sm text-blue-100">{student.batch}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <ProfileMetric label="Overall Band" value={student.overall.toFixed(1)} />
                <ProfileMetric label="Progress" value={`${student.progress > 0 ? "+" : ""}${student.progress.toFixed(1)}`} />
                <ProfileMetric label="Status" value={student.active ? "Active" : "Inactive"} />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {skillData.map((skill) => {
              const Icon = skill.icon;
              return (
                <div key={skill.key} className={`${cardClass} p-5`}>
                  <div className="flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClass(skill.color)}`}>
                      <Icon size={21} />
                    </div>
                    <span className={`text-2xl font-extrabold ${headingText}`}>{skill.score.toFixed(1)}</span>
                  </div>
                  <p className={`mt-4 text-sm font-semibold ${headingText}`}>{skill.label}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EDF0F7] dark:bg-[#3B3441]">
                    <div
                      className="h-full rounded-full bg-[#FF2454]"
                      style={{ width: `${(skill.score / 9) * 100}%` }}
                    />
                  </div>
                  <p className={`mt-2 text-xs ${secondaryText}`}>Band score out of 9</p>
                </div>
              );
            })}
          </section>

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className={`${cardClass} p-5 sm:p-6 xl:col-span-2`}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className={`text-lg font-bold ${headingText}`}>Score Progress</h2>
                  <p className={`mt-1 text-sm ${mutedText}`}>Track the student's overall IELTS band score.</p>
                </div>
                <select
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                  className={`${inputClass} sm:w-auto`}
                >
                  <option>Last 6 weeks</option>
                  <option>Last 3 months</option>
                </select>
              </div>
              <div className="mt-5">
                <ScoreChart data={chartHistory} />
              </div>
            </div>

            <div className={`${cardClass} p-5 sm:p-6`}>
              <h2 className={`text-lg font-bold ${headingText}`}>Areas to Improve</h2>
              <p className={`mt-1 text-sm ${mutedText}`}>Skills that need more practice.</p>

              {weakSkills.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {weakSkills.map((skill) => {
                    const Icon = skill.icon;
                    return (
                      <div key={skill.key} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                          <Icon size={19} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between gap-2">
                            <p className={`text-sm font-semibold ${headingText}`}>{skill.label}</p>
                            <p className="text-sm font-bold text-[#FF2454]">{skill.score.toFixed(1)}</p>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-[#EDF0F7] dark:bg-[#3B3441]">
                            <div className="h-2 rounded-full bg-[#FF2454]" style={{ width: `${(skill.score / 9) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                  Great work! No weak skills identified.
                </div>
              )}

              <div className="mt-5 rounded-xl bg-[#F8FAFF] p-4 dark:bg-[#19171E]">
                <p className={`text-sm font-semibold ${headingText}`}>Trainer Recommendation</p>
                <p className={`mt-2 text-sm leading-6 ${mutedText}`}>
                  {weakSkills.length
                    ? `Focus on ${weakSkills[0].label} through regular practice and targeted exercises.`
                    : "Maintain the current practice routine and continue regular mock tests."}
                </p>
              </div>
            </div>
          </section>

          <section className={`${cardClass} overflow-hidden`}>
            <div className="border-b border-[#E9EDF6] p-5 dark:border-[#3B3441] sm:px-6">
              <h2 className={`text-lg font-bold ${headingText}`}>Student Activity & Feedback</h2>
              <p className={`mt-1 text-sm ${mutedText}`}>Review attempts and trainer feedback.</p>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-[#E9EDF6] px-5 pt-4 dark:border-[#3B3441] sm:px-6">
              {["Attempts", "Writing Feedback", "Speaking Feedback"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-t-lg border-b-2 px-4 py-3 text-sm font-semibold transition ${
                    activeTab === tab
                      ? "border-[#FF2454] text-[#FF2454]"
                      : "border-transparent text-[#71809D] hover:text-[#10265F] dark:text-[#B0A5BD] dark:hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Attempts" && (
              <div>
                <div className="p-5 sm:px-6">
                  <div className="relative max-w-sm">
                    <Search size={17} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${secondaryText}`} />
                    <input
                      value={attemptSearch}
                      onChange={(event) => setAttemptSearch(event.target.value)}
                      placeholder="Search attempts..."
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[750px] text-left text-sm">
                    <thead className="bg-[#F8FAFF] text-xs uppercase tracking-wide text-[#71809D] dark:bg-[#19171E] dark:text-[#B0A5BD]">
                      <tr>
                        <th className="px-5 py-4 font-semibold">Test / Practice</th>
                        <th className="px-5 py-4 font-semibold">Date</th>
                        <th className="px-5 py-4 font-semibold">Listening</th>
                        <th className="px-5 py-4 font-semibold">Reading</th>
                        <th className="px-5 py-4 font-semibold">Writing</th>
                        <th className="px-5 py-4 font-semibold">Speaking</th>
                        <th className="px-5 py-4 font-semibold">Overall</th>
                        <th className="px-5 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDF0F7] dark:divide-[#3B3441]">
                      {filteredAttempts.map((attempt) => (
                        <tr key={attempt.id} className="transition hover:bg-[#F8FAFF] dark:hover:bg-[#292530]">
                          <td className={`px-5 py-4 font-semibold ${headingText}`}>{attempt.title}</td>
                          <td className={`px-5 py-4 ${mutedText}`}>{attempt.date}</td>
                          <td className={`px-5 py-4 ${headingText}`}>{attempt.listening ?? "—"}</td>
                          <td className={`px-5 py-4 ${headingText}`}>{attempt.reading ?? "—"}</td>
                          <td className={`px-5 py-4 ${headingText}`}>{attempt.writing ?? "—"}</td>
                          <td className={`px-5 py-4 ${headingText}`}>{attempt.speaking ?? "—"}</td>
                          <td className="px-5 py-4 font-bold text-[#FF2454]">{attempt.overall ?? "—"}</td>
                          <td className="px-5 py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              attempt.status === "Reviewed"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                            }`}>
                              {attempt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredAttempts.length === 0 && (
                        <tr>
                          <td colSpan={8} className={`px-5 py-10 text-center text-sm ${secondaryText}`}>
                            No attempts match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab !== "Attempts" && (
              <div className="divide-y divide-[#EDF0F7] dark:divide-[#3B3441]">
                {(activeTab === "Writing Feedback" ? writingFeedback : speakingFeedback).map((feedback) => (
                  <div key={feedback.id} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#FF2454]">
                        {feedback.skill === "Writing" ? <PenLine size={21} /> : <MessageCircle size={21} />}
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold ${headingText}`}>{feedback.title}</p>
                        <p className={`mt-1 text-sm ${mutedText}`}>{feedback.date} · Reviewed by {feedback.reviewer}</p>
                        <p className={`mt-2 text-xs ${secondaryText}`}>{feedback.skill} feedback</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:shrink-0">
                      <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">
                        Band {feedback.score.toFixed(1)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedFeedback(feedback)}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#E4EAF5] px-3 py-2.5 text-sm font-semibold transition hover:bg-[#F5F7FF] dark:border-[#3B3441] dark:hover:bg-[#292530]"
                      >
                        <Eye size={16} />
                        View Feedback
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-[#EDF0F7] px-5 py-4 text-xs text-[#8A9ABB] dark:border-[#3B3441] dark:text-[#91899B] sm:px-6">
              Demo records · Connect your backend API to show actual student history.
            </div>
          </section>
        </main>
      </div>

      {selectedFeedback && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#0B1739]/55 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedFeedback(null);
            }
          }}
        >
          <div className="my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl dark:!bg-[#211E27] sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#FF2454]">
                  Student Feedback
                </p>
                <h2 className={`mt-1 text-xl font-bold ${headingText}`}>
                  {selectedFeedback.skill} Feedback
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFeedback(null)}
                className="rounded-lg p-2 text-[#71809D] transition hover:bg-[#F5F7FF] dark:text-[#B0A5BD] dark:hover:bg-[#292530]"
                aria-label="Close feedback"
              >
                <X size={20} />
              </button>
            </div>

            <div className="rounded-xl bg-[#F5F7FF] p-4 dark:bg-[#19171E]">
              <p className={`flex items-center gap-2 text-xs ${mutedText}`}>
                <CalendarDays size={14} />
                {selectedFeedback.date}
              </p>
              <h3 className={`mt-3 font-bold ${headingText}`}>{selectedFeedback.title}</h3>
              <p className={`mt-2 text-sm ${mutedText}`}>Reviewed by {selectedFeedback.reviewer}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">
                <FileText size={16} />
                Band {selectedFeedback.score.toFixed(1)}
              </div>
            </div>

            <div className="mt-5">
              <h4 className={`font-semibold ${headingText}`}>Trainer Comments</h4>
              <p className={`mt-2 text-sm leading-7 ${mutedText}`}>{selectedFeedback.feedback}</p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedFeedback(null)}
              className="mt-6 w-full rounded-xl bg-[#10265F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#19377D]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function toneClass(tone) {
  const classes = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return classes[tone] || classes.blue;
}

function StatCard({ title, value, subtitle, icon, tone }) {
  return (
    <div className={`${cardClass} p-5 transition hover:shadow-md`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-sm ${mutedText}`}>{title}</p>
          <h3 className={`mt-3 text-3xl font-extrabold tracking-tight ${headingText}`}>{value}</h3>
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${toneClass(tone)}`}>
          {icon}
        </div>
      </div>
      <p className={`mt-3 text-xs ${secondaryText}`}>{subtitle}</p>
    </div>
  );
}

function ProfileMetric({ label, value }) {
  return (
    <div className="min-w-[100px] rounded-xl border border-white/15 bg-white/10 p-3">
      <p className="text-xs text-blue-100">{label}</p>
      <p className="mt-2 text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function ScoreChart({ data }) {
  const width = 700;
  const height = 260;
  const left = 35;
  const right = 20;
  const top = 18;
  const bottom = 35;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;

  const points = data.map((item, index) => {
    const x =
      left +
      (data.length <= 1 ? chartWidth / 2 : (index / (data.length - 1)) * chartWidth);
    const y = top + chartHeight - (item.score / 9) * chartHeight;

    return { ...item, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${top + chartHeight} L ${points[0].x} ${top + chartHeight} Z`
    : "";

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Student IELTS score progress chart"
      >
        <defs>
          <linearGradient id="studentReportGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF2454" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FF2454" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {[0, 2, 4, 6, 8, 9].map((tick) => {
          const y = top + chartHeight - (tick / 9) * chartHeight;
          return (
            <g key={tick}>
              <line
                x1={left}
                x2={width - right}
                y1={y}
                y2={y}
                stroke="#E9EDF5"
                strokeDasharray="4 4"
              />
              <text
                x={left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#94A3B8"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {points.length > 1 && (
          <path d={areaPath} fill="url(#studentReportGradient)" />
        )}

        {points.length > 0 && (
          <path
            d={linePath}
            fill="none"
            stroke="#FF2454"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {points.map((point) => (
          <g key={point.date}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#FF2454"
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={point.x}
              y={height - 10}
              textAnchor="middle"
              fontSize="10"
              fill="#94A3B8"
            >
              {point.date}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}