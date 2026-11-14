import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  MessageSquare,
  Send,
  Sparkles,
  UserRound,
  CalendarDays,
  ChevronDown,
  ArrowRight,
  PenLine,
  ClipboardCheck,
  CircleCheck,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const initialSubmissions = [
  {
    id: 1,
    student: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    batch: "Morning Batch",
    title: "Task 2: Technology and Education",
    type: "Writing Task 2",
    submitted: "28 Oct 2026, 09:15 AM",
    due: "28 Oct 2026",
    status: "Pending Review",
    wordCount: 278,
    estimatedBand: 6,
    finalBand: null,
    essay:
      "Technology has changed the way people learn. Many students use online platforms to attend classes and access study materials. I believe that technology has made education more accessible, although traditional classrooms are still important.\n\nFirstly, online learning gives students the opportunity to study from any location. Students who live in remote areas can access quality educational resources. For example, recorded lessons allow learners to revise difficult topics at their own pace.\n\nHowever, technology also has disadvantages. Some students may become distracted by social media, and not everyone has a reliable internet connection. Teachers also play an important role in providing guidance and encouraging discussion.\n\nIn conclusion, technology has improved access to education, but it should support rather than completely replace traditional teaching methods.",
    aiFeedback:
      "The response presents a clear position and includes relevant examples. Paragraphing is appropriate. To improve the score, develop ideas more deeply, use a wider range of complex sentence structures, and review grammatical accuracy.",
    descriptors: {
      task: 6,
      coherence: 6,
      vocabulary: 6,
      grammar: 5,
    },
    comments: [],
  },
  {
    id: 2,
    student: "Priya Verma",
    email: "priya.verma@example.com",
    batch: "Evening Batch",
    title: "Task 1: Academic Bar Chart",
    type: "Writing Task 1",
    submitted: "28 Oct 2026, 08:40 AM",
    due: "28 Oct 2026",
    status: "Pending Review",
    wordCount: 183,
    estimatedBand: 6.5,
    finalBand: null,
    essay:
      "The bar chart compares the number of students who selected different subjects at a university. Overall, business was the most popular subject, while history had the lowest number of students.\n\nBusiness attracted approximately 400 students, followed by science with around 320. The number choosing arts was slightly lower, at about 280 students. In comparison, history was selected by only 150 students.\n\nThe difference between business and history was significant. Business had more than twice as many students as history. The other subjects had moderate differences in their enrolment figures.",
    aiFeedback:
      "The report identifies the main trend and includes comparisons. Add a more precise overview, ensure all key figures are accurately represented, and use varied comparative structures.",
    descriptors: {
      task: 7,
      coherence: 6,
      vocabulary: 6,
      grammar: 6,
    },
    comments: [],
  },
  {
    id: 3,
    student: "Rahul Meena",
    email: "rahul.meena@example.com",
    batch: "Weekend Batch",
    title: "Task 2: Environmental Protection",
    type: "Writing Task 2",
    submitted: "27 Oct 2026, 04:30 PM",
    due: "29 Oct 2026",
    status: "Pending Review",
    wordCount: 221,
    estimatedBand: 5.5,
    finalBand: null,
    essay:
      "Environment is important for every people. Government should make rules for pollution and people also need to change their habits.\n\nThere are many causes of pollution. Cars and factories create smoke and damage the air. Plastic waste also creates problems for animals and water. People should use public transport and reduce plastic.\n\nIn my opinion government and public both have responsibility. If everyone works together then environment can become clean. Schools can teach students about nature and recycling.",
    aiFeedback:
      "The response addresses the topic but ideas need further development. The essay is below the usual minimum word count for Task 2. Expand supporting arguments, use paragraph structures more effectively, and improve grammatical range and accuracy.",
    descriptors: {
      task: 5,
      coherence: 5,
      vocabulary: 5,
      grammar: 5,
    },
    comments: [],
  },
  {
    id: 4,
    student: "Sneha Gupta",
    email: "sneha.gupta@example.com",
    batch: "Morning Batch",
    title: "Task 2: Working from Home",
    type: "Writing Task 2",
    submitted: "27 Oct 2026, 11:20 AM",
    due: "28 Oct 2026",
    status: "Reviewed",
    wordCount: 291,
    estimatedBand: 7,
    finalBand: 7,
    essay:
      "Working from home has become more common in recent years. It offers flexibility and reduces commuting time, although it may also make communication more difficult for some teams.\n\nOne major advantage is that employees can organize their work around their personal responsibilities. Companies may also reduce office costs. However, remote workers need discipline and a suitable working environment to remain productive.\n\nOverall, working from home can be beneficial when employers provide clear expectations and effective communication tools.",
    aiFeedback:
      "The response is organized and presents a clear argument. More detailed examples and greater lexical variety could strengthen the response further.",
    descriptors: {
      task: 7,
      coherence: 7,
      vocabulary: 7,
      grammar: 7,
    },
    comments: [],
  },
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50 dark:!border-[#3B3441] dark:!bg-[#19171E] dark:!text-[#F4F0F7] dark:placeholder:!text-[#91899B]";

const criteria = [
  {
    key: "task",
    label: "Task Achievement / Response",
    description: "Addresses the task and develops relevant ideas.",
  },
  {
    key: "coherence",
    label: "Coherence & Cohesion",
    description: "Organization, paragraphing and logical progression.",
  },
  {
    key: "vocabulary",
    label: "Lexical Resource",
    description: "Vocabulary range, precision and word choice.",
  },
  {
    key: "grammar",
    label: "Grammatical Range & Accuracy",
    description: "Sentence variety and grammatical accuracy.",
  },
];

export default function WritingGradingQueue() {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending Review");
  const [typeFilter, setTypeFilter] = useState("All Tasks");
  const [selectedId, setSelectedId] = useState(1);
  const [showGrading, setShowGrading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState("");
  const [finalBand, setFinalBand] = useState("6");
  const [scores, setScores] = useState({
    task: 6,
    coherence: 6,
    vocabulary: 6,
    grammar: 5,
  });
  const [gradeError, setGradeError] = useState("");

  const filteredSubmissions = useMemo(() => {
    const query = search.toLowerCase().trim();

    return submissions.filter((item) => {
      const matchesSearch =
        item.student.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All Status" || item.status === statusFilter;

      const matchesType =
        typeFilter === "All Tasks" || item.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [submissions, search, statusFilter, typeFilter]);

  const pendingCount = submissions.filter(
    (item) => item.status === "Pending Review"
  ).length;

  const reviewedCount = submissions.filter(
    (item) => item.status === "Reviewed"
  ).length;

  const selected =
    submissions.find((item) => item.id === selectedId) || null;

  const selectSubmission = (item) => {
    setSelectedId(item.id);
    setShowGrading(false);
    setShowComments(false);
    setComment("");
    setFeedback("");
    setFinalBand(String(item.finalBand ?? item.estimatedBand));
    setScores({ ...item.descriptors });
    setGradeError("");
  };

  const updateScore = (key, value) => {
    setScores((previous) => ({
      ...previous,
      [key]: Number(value),
    }));
  };

  const calculatedBand = (
    Object.values(scores).reduce((sum, value) => sum + value, 0) / 4
  ).toFixed(2);

  const saveComment = (event) => {
    event.preventDefault();

    if (!comment.trim() || !selected) return;

    setSubmissions((previous) =>
      previous.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              comments: [
                ...item.comments,
                {
                  id: Date.now(),
                  text: comment.trim(),
                  createdAt: new Date().toLocaleString("en-IN"),
                },
              ],
            }
          : item
      )
    );

    setComment("");
  };

  const submitGrade = (event) => {
    event.preventDefault();

    if (!selected) return;

    const band = Number(finalBand);

    if (
      !Number.isFinite(band) ||
      band < 0 ||
      band > 9 ||
      band * 2 % 1 !== 0
    ) {
      setGradeError("Enter a band score from 0 to 9 in 0.5 increments.");
      return;
    }

    setSubmissions((previous) =>
      previous.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              status: "Reviewed",
              finalBand: band,
              descriptors: { ...scores },
              aiFeedback: feedback.trim() || item.aiFeedback,
            }
          : item
      )
    );

    setGradeError("");
    setShowGrading(false);
  };

  return (
    <div className="writing-grading-queue min-h-screen bg-[#F5F7FF] text-[#10265F] dark:!bg-[#17151B] dark:!text-[#F4F0F7]">
      <style>{`
        .dark .writing-grading-queue {
          background: #17151B !important;
          color: #F4F0F7 !important;
        }

        .dark .writing-grading-queue [class*="bg-white"],
        .dark .writing-grading-queue [class*="bg-[#F5F7FF]"],
        .dark .writing-grading-queue [class*="bg-[#FAFBFF]"],
        .dark .writing-grading-queue [class*="bg-gray-50"],
        .dark .writing-grading-queue [class*="bg-gray-100"] {
          background-color: #211E27 !important;
        }

        .dark .writing-grading-queue [class*="text-[#10265F]"],
        .dark .writing-grading-queue [class*="text-gray-700"],
        .dark .writing-grading-queue [class*="text-gray-800"],
        .dark .writing-grading-queue [class*="text-blue-900"] {
          color: #F4F0F7 !important;
        }

        .dark .writing-grading-queue [class*="text-gray-500"],
        .dark .writing-grading-queue [class*="text-gray-400"],
        .dark .writing-grading-queue [class*="text-gray-600"] {
          color: #B0A5BD !important;
        }

        .dark .writing-grading-queue [class*="border-gray-100"],
        .dark .writing-grading-queue [class*="border-gray-200"],
        .dark .writing-grading-queue [class*="border-violet-100"] {
          border-color: #3B3441 !important;
        }

        .dark .writing-grading-queue input:not([type="range"]),
        .dark .writing-grading-queue select,
        .dark .writing-grading-queue textarea {
          background: #19171E !important;
          color: #F4F0F7 !important;
          border-color: #3B3441 !important;
        }

        .dark .writing-grading-queue input::placeholder,
        .dark .writing-grading-queue textarea::placeholder {
          color: #91899B !important;
        }

        .dark .writing-grading-queue button[class*="hover:bg-gray-50"]:hover,
        .dark .writing-grading-queue button[class*="hover:bg-gray-100"]:hover {
          background: #292530 !important;
        }
      `}</style>

      <Sidebar />

      <div className="min-w-0 lg:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Heading */}
          <section>
            <p className="mb-2 text-sm text-gray-500">
              Trainer Portal / Writing Grading Queue
            </p>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Writing Grading Queue
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Review student writing submissions, use AI draft feedback as
              assistance, assess IELTS band descriptors and add comments.
            </p>
          </section>

          {/* Summary */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Submissions"
              value={submissions.length}
              subtitle="All writing submissions"
              icon={<FileText size={22} />}
              color="blue"
            />

            <StatCard
              title="Pending Review"
              value={pendingCount}
              subtitle="Awaiting trainer review"
              icon={<Clock size={22} />}
              color="orange"
            />

            <StatCard
              title="Reviewed"
              value={reviewedCount}
              subtitle="Grading completed"
              icon={<CheckCircle2 size={22} />}
              color="green"
            />

            <StatCard
              title="Needs Attention"
              value={
                submissions.filter(
                  (item) =>
                    item.status === "Pending Review" &&
                    item.due < "28 Oct 2026"
                ).length
              }
              subtitle="Older pending submissions"
              icon={<AlertCircle size={22} />}
              color="purple"
            />
          </section>

          {/* Queue + selected submission */}
          <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
            {/* Left queue */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-[#3B3441] dark:bg-[#211E27] xl:col-span-5">
              <div className="border-b border-gray-100 p-5 dark:border-[#3B3441]">
                <h2 className="font-bold">Submission Queue</h2>

                <p className="mt-1 text-sm text-gray-500">
                  Select a submission to review.
                </p>

                <div className="relative mt-4">
                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search student or submission..."
                    className={`${inputClass} pl-10`}
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="relative">
                    <Filter
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <select
                      value={statusFilter}
                      onChange={(event) =>
                        setStatusFilter(event.target.value)
                      }
                      className={`${inputClass} appearance-none pl-9 pr-8`}
                    >
                      <option>Pending Review</option>
                      <option>Reviewed</option>
                      <option>All Status</option>
                    </select>

                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>

                  <select
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value)}
                    className={inputClass}
                  >
                    <option>All Tasks</option>
                    <option>Writing Task 1</option>
                    <option>Writing Task 2</option>
                  </select>
                </div>
              </div>

              <div className="max-h-[720px] space-y-3 overflow-y-auto p-4">
                {filteredSubmissions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => selectSubmission(item)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      item.id === selectedId
                        ? "border-blue-300 bg-blue-50/70 ring-1 ring-blue-100 dark:!border-blue-700 dark:!bg-[#302536]"
                        : "border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50 dark:!border-[#3B3441] dark:!bg-[#211E27] dark:hover:!bg-[#292530]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-[#FF2454]">
                          <PenLine size={19} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="break-words text-sm font-semibold">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {item.student}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          item.status === "Reviewed"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                            : "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300"
                        }`}
                      >
                        {item.status === "Reviewed" ? "Reviewed" : "Pending"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        {item.submitted}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <FileText size={14} />
                        {item.wordCount} words
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-[#3B3441]">
                      <span className="text-xs text-gray-500">
                        AI estimated band
                      </span>

                      <span className="font-bold">
                        {item.estimatedBand.toFixed(1)}
                      </span>
                    </div>
                  </button>
                ))}

                {filteredSubmissions.length === 0 && (
                  <div className="py-12 text-center">
                    <FileText
                      size={30}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 font-semibold">
                      No submissions found
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Try changing your filters.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-400 dark:border-[#3B3441]">
                Showing {filteredSubmissions.length} of {submissions.length}{" "}
                demo submissions
              </div>
            </div>

            {/* Right submission details */}
            <div className="space-y-6 xl:col-span-7">
              {!selected ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center dark:border-[#3B3441] dark:bg-[#211E27]">
                  <FileText
                    size={36}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 font-semibold">
                    Select a writing submission
                  </p>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27] sm:p-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                          <FileText size={23} />
                        </div>

                        <div className="min-w-0">
                          <h2 className="break-words text-lg font-bold">
                            {selected.title}
                          </h2>

                          <p className="mt-1 text-sm text-gray-500">
                            {selected.student} · {selected.batch}
                          </p>

                          <p className="mt-1 break-all text-xs text-gray-400">
                            {selected.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 self-start rounded-full px-3 py-1.5 text-xs font-semibold ${
                          selected.status === "Reviewed"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                            : "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300"
                        }`}
                      >
                        {selected.status}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <InfoTile
                        icon={<FileText size={17} />}
                        label="Word Count"
                        value={selected.wordCount}
                      />

                      <InfoTile
                        icon={<Clock size={17} />}
                        label="AI Estimate"
                        value={`Band ${selected.estimatedBand.toFixed(1)}`}
                      />

                      <InfoTile
                        icon={<CalendarDays size={17} />}
                        label="Due Date"
                        value={selected.due}
                      />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          setFeedback(selected.aiFeedback);
                          setFinalBand(
                            String(
                              selected.finalBand ?? selected.estimatedBand
                            )
                          );
                          setScores({ ...selected.descriptors });
                          setGradeError("");
                          setShowGrading(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-semibold text-white hover:bg-[#e91d49]"
                      >
                        <ClipboardCheck size={17} />
                        {selected.status === "Reviewed"
                          ? "Update Grade"
                          : "Grade Submission"}
                      </button>

                      <button
                        onClick={() => setShowComments(!showComments)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold hover:bg-gray-50 dark:border-[#3B3441] dark:hover:bg-[#292530]"
                      >
                        <MessageSquare size={17} />
                        Inline Comments ({selected.comments.length})
                      </button>
                    </div>
                  </div>

                  {/* Essay */}
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27] sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div>
                        <h2 className="font-bold">Student Submission</h2>

                        <p className="mt-1 text-sm text-gray-500">
                          Original writing submitted by the student.
                        </p>
                      </div>

                      <span className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:bg-[#19171E]">
                        {selected.type}
                      </span>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-[#FAFBFF] p-4 text-sm leading-7 text-gray-700 dark:border-[#3B3441] dark:bg-[#19171E] sm:p-5">
                      {selected.essay.split("\n\n").map((paragraph, index) => (
                        <p key={index} className={index ? "mt-4" : ""}>
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                      <FileText size={15} />
                      {selected.wordCount} words · Submitted {selected.submitted}
                    </div>
                  </div>

                  {/* AI feedback */}
                  <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27] sm:p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                        <Sparkles size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-bold">AI Draft Feedback</h2>

                          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700">
                            ASSISTIVE DRAFT
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          Review and edit this feedback before final grading.
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 rounded-xl bg-violet-50/70 p-4 text-sm leading-7 text-gray-700 dark:bg-[#302536] dark:text-[#F4F0F7]">
                      {selected.aiFeedback}
                    </p>

                    <p className="mt-3 text-xs leading-5 text-gray-400">
                      This is demo feedback, not a live AI-generated evaluation.
                      The trainer should verify all feedback and scores.
                    </p>
                  </div>

                  {/* Band descriptors */}
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27] sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="font-bold">IELTS Band Descriptors</h2>

                        <p className="mt-1 text-sm text-gray-500">
                          Current estimated criterion scores.
                        </p>
                      </div>

                      <span className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">
                        {selected.finalBand !== null
                          ? `Final: ${selected.finalBand.toFixed(1)}`
                          : `Estimate: ${selected.estimatedBand.toFixed(1)}`}
                      </span>
                    </div>

                    <div className="mt-5 space-y-5">
                      {criteria.map((criterion) => (
                        <div key={criterion.key}>
                          <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                            <p className="text-sm font-semibold">
                              {criterion.label}
                            </p>

                            <span className="text-sm font-bold">
                              {selected.descriptors[criterion.key]}.0 / 9
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-gray-500">
                            {criterion.description}
                          </p>

                          <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-[#3B3441]">
                            <div
                              className="h-2 rounded-full bg-[#FF2454]"
                              style={{
                                width: `${
                                  (selected.descriptors[criterion.key] / 9) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setScores({ ...selected.descriptors });
                        setFeedback(selected.aiFeedback);
                        setFinalBand(
                          String(selected.finalBand ?? selected.estimatedBand)
                        );
                        setGradeError("");
                        setShowGrading(true);
                      }}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold hover:bg-gray-50 dark:border-[#3B3441] dark:hover:bg-[#292530]"
                    >
                      Review Descriptors
                      <ArrowRight size={17} />
                    </button>
                  </div>

                  {/* Comments */}
                  {showComments && (
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27] sm:p-6">
                      <h2 className="font-bold">Inline Comments</h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Add comments related to the student's submission.
                      </p>

                      <form onSubmit={saveComment} className="mt-4">
                        <textarea
                          value={comment}
                          onChange={(event) => setComment(event.target.value)}
                          rows={3}
                          placeholder="Write a comment or improvement suggestion..."
                          className={`${inputClass} resize-y`}
                          required
                        />

                        <button
                          type="submit"
                          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#10265F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#19377d]"
                        >
                          <Send size={16} />
                          Add Comment
                        </button>
                      </form>

                      <div className="mt-5 space-y-3">
                        {selected.comments.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-gray-100 p-4 dark:border-[#3B3441]"
                          >
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <UserRound size={14} />
                              Trainer
                              <span>· {item.createdAt}</span>
                            </div>

                            <p className="mt-2 text-sm leading-6 text-gray-700">
                              {item.text}
                            </p>
                          </div>
                        ))}

                        {selected.comments.length === 0 && (
                          <p className="py-3 text-sm text-gray-400">
                            No comments added yet.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Grading modal */}
      {showGrading && selected && (
        <Modal
          title="Grade Writing Submission"
          onClose={() => setShowGrading(false)}
        >
          <p className="mb-5 text-sm leading-6 text-gray-500">
            Review each criterion, edit the feedback and submit the trainer's
            final score for {selected.student}.
          </p>

          <form onSubmit={submitGrade} className="space-y-5">
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#19171E]">
              <p className="text-xs text-gray-500">Submission</p>
              <p className="mt-1 font-semibold">{selected.title}</p>
            </div>

            <div className="space-y-4">
              {criteria.map((criterion) => (
                <div key={criterion.key}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor={criterion.key}
                      className="text-sm font-semibold"
                    >
                      {criterion.label}
                    </label>

                    <span className="text-sm font-bold">
                      {Number(scores[criterion.key]).toFixed(1)}
                    </span>
                  </div>

                  <input
                    id={criterion.key}
                    type="range"
                    min="0"
                    max="9"
                    step="0.5"
                    value={scores[criterion.key]}
                    onChange={(event) =>
                      updateScore(criterion.key, event.target.value)
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
            </div>

            <div className="rounded-xl bg-blue-50 p-4 dark:bg-[#252B40]">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Average of four criterion scores
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">
                {calculatedBand}
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-700 dark:text-blue-300">
                This average is a helper for the trainer. Verify the official
                IELTS scoring rules before deciding the final band.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Final Band Score
              </label>

              <select
                value={finalBand}
                onChange={(event) => setFinalBand(event.target.value)}
                className={inputClass}
              >
                {Array.from({ length: 19 }, (_, index) => index * 0.5).map(
                  (band) => (
                    <option key={band} value={band}>
                      Band {band.toFixed(1)}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Final Feedback
              </label>

              <textarea
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                rows={4}
                placeholder="Enter feedback for the student..."
                className={`${inputClass} resize-y`}
              />
            </div>

            {gradeError && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-300">
                {gradeError}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowGrading(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold hover:bg-gray-50 dark:border-[#3B3441] dark:hover:bg-[#292530]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-semibold text-white hover:bg-[#e91d49]"
              >
                <CircleCheck size={17} />
                Submit Final Grade
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
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]">
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

function InfoTile({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-[#3B3441] dark:bg-[#19171E]">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-2 break-words text-sm font-bold text-[#10265F] dark:!text-[#F4F0F7]">
        {value}
      </p>
    </div>
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