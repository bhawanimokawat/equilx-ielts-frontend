
import React, { useMemo, useRef, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar";
import {
  BookOpen,
  FileText,
  Video,
  Headphones,
  Download,
  Search,
  Plus,
  Upload,
  FolderOpen,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
  X,
  CheckCircle2,
  Clock,
  File,
  Link as LinkIcon,
  Filter,
  ChevronLeft,
  ChevronRight,
  Globe,
  LockKeyhole,
} from "lucide-react";

const initialResources = [
  {
    id: 1,
    title: "IELTS Academic Writing Task 2 Guide",
    description: "Essay structures, examples and scoring tips.",
    category: "Writing",
    type: "PDF",
    size: "2.4 MB",
    author: "Aman Sharma",
    date: "20 Oct 2026",
    status: "Published",
    downloads: 124,
    audience: "All Students",
  },
  {
    id: 2,
    title: "Cambridge Listening Practice Set",
    description: "Listening exercises with answer explanations.",
    category: "Listening",
    type: "Audio",
    size: "18 MB",
    author: "Pooja Gupta",
    date: "19 Oct 2026",
    status: "Published",
    downloads: 98,
    audience: "All Students",
  },
  {
    id: 3,
    title: "Reading Strategies and Skimming",
    description: "Learn skimming, scanning and time management.",
    category: "Reading",
    type: "PDF",
    size: "3.1 MB",
    author: "Rahul Kumar",
    date: "17 Oct 2026",
    status: "Published",
    downloads: 86,
    audience: "Batch A",
  },
  {
    id: 4,
    title: "Speaking Part 2 Masterclass",
    description: "Cue cards, sample responses and fluency tips.",
    category: "Speaking",
    type: "Video",
    size: "245 MB",
    author: "Neha Singh",
    date: "15 Oct 2026",
    status: "Published",
    downloads: 76,
    audience: "All Students",
  },
  {
    id: 5,
    title: "IELTS Grammar Essentials",
    description: "Essential grammar rules for IELTS preparation.",
    category: "Grammar",
    type: "PDF",
    size: "1.8 MB",
    author: "Aman Sharma",
    date: "12 Oct 2026",
    status: "Draft",
    downloads: 0,
    audience: "All Students",
  },
  {
    id: 6,
    title: "Academic Vocabulary Workbook",
    description: "Common academic vocabulary and practice tasks.",
    category: "Vocabulary",
    type: "Document",
    size: "1.2 MB",
    author: "Pooja Gupta",
    date: "10 Oct 2026",
    status: "Published",
    downloads: 64,
    audience: "Batch B",
  },
  {
    id: 7,
    title: "Mock Speaking Interview",
    description: "A guided speaking interview demonstration.",
    category: "Speaking",
    type: "Video",
    size: "180 MB",
    author: "Neha Singh",
    date: "08 Oct 2026",
    status: "Draft",
    downloads: 0,
    audience: "Batch C",
  },
  {
    id: 8,
    title: "IELTS Listening Answer Sheet",
    description: "Printable answer sheet for practice sessions.",
    category: "Listening",
    type: "PDF",
    size: "500 KB",
    author: "Rahul Kumar",
    date: "05 Oct 2026",
    status: "Published",
    downloads: 51,
    audience: "All Students",
  },
];

const categories = [
  "Writing",
  "Reading",
  "Listening",
  "Speaking",
  "Grammar",
  "Vocabulary",
  "General",
];

const fileTypes = ["PDF", "Document", "Video", "Audio", "Link"];

function ResourceIcon({ type, size = 21 }) {
  if (type === "Video") return <Video size={size} />;
  if (type === "Audio") return <Headphones size={size} />;
  if (type === "Link") return <LinkIcon size={size} />;
  if (type === "PDF") return <FileText size={size} />;
  return <File size={size} />;
}

function resourceColors(type) {
  const styles = {
    PDF: "bg-rose-50 text-rose-500",
    Document: "bg-blue-50 text-blue-600",
    Video: "bg-purple-50 text-purple-600",
    Audio: "bg-emerald-50 text-emerald-600",
    Link: "bg-orange-50 text-orange-600",
  };

  return styles[type] || "bg-slate-100 text-slate-600";
}

function StatCard({ title, value, icon: Icon, color, subtitle }) {
  const styles = {
    rose: "bg-rose-50 text-rose-500",
    blue: "bg-blue-50 text-blue-500",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <section className="rounded-2xl border border-slate-100 dark:border-[#3B3441] bg-white dark:bg-[#211E27] p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${styles[color]}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-[#B0A5BD]">{title}</p>
          <h2 className="mt-1 text-3xl font-extrabold text-[#10265F] dark:text-[#E8E2EF]">{value}</h2>
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-400 dark:text-[#91899B]">{subtitle}</p>
    </section>
  );
}

function Panel({ title, children, action }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 dark:border-[#3B3441] bg-white dark:bg-[#211E27] p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold text-[#10265F] dark:text-[#E8E2EF]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function ResourceModal({ resource, onClose, onSave }) {
  const [form, setForm] = useState(
    resource || {
      title: "",
      description: "",
      category: "Writing",
      type: "PDF",
      audience: "All Students",
      status: "Draft",
      url: "",
    }
  );

  const update = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <form
        onSubmit={submit}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-100 dark:border-[#3B3441] bg-white dark:bg-[#211E27] p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#10265F] dark:text-[#E8E2EF]">
              {resource ? "Edit Study Resource" : "Add Study Resource"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-[#B0A5BD]">
              Organize and share learning material with your students.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-500 dark:text-[#B0A5BD] hover:bg-slate-100 dark:hover:bg-[#302B36]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#10265F] dark:text-[#E8E2EF]">
              Resource Title
            </span>
            <input
              name="title"
              required
              value={form.title}
              onChange={update}
              placeholder="Enter resource title"
              className="h-11 w-full rounded-xl border border-slate-200 dark:border-[#3B3441] bg-white dark:bg-[#19171E] px-3 text-sm text-slate-800 dark:text-[#E8E2EF] outline-none focus:border-pink-400"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#10265F] dark:text-[#E8E2EF]">
              Description
            </span>
            <textarea
              name="description"
              value={form.description}
              onChange={update}
              rows={3}
              placeholder="Describe this resource"
              className="w-full rounded-xl border border-slate-200 dark:border-[#3B3441] bg-white dark:bg-[#19171E] p-3 text-sm text-slate-800 dark:text-[#E8E2EF] outline-none focus:border-pink-400"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-sm font-medium text-[#10265F] dark:text-[#E8E2EF]">
                Category
              </span>
              <select
                name="category"
                value={form.category}
                onChange={update}
                className="h-11 w-full rounded-xl border border-slate-200 dark:border-[#3B3441] bg-white dark:bg-[#19171E] px-3 text-sm text-slate-800 dark:text-[#E8E2EF]"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-1.5 block text-sm font-medium text-[#10265F] dark:text-[#E8E2EF]">
                Resource Type
              </span>
              <select
                name="type"
                value={form.type}
                onChange={update}
                className="h-11 w-full rounded-xl border border-slate-200 dark:border-[#3B3441] bg-white dark:bg-[#19171E] px-3 text-sm text-slate-800 dark:text-[#E8E2EF]"
              >
                {fileTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#10265F] dark:text-[#E8E2EF]">
              Resource URL (optional)
            </span>
            <input
              type="url"
              name="url"
              value={form.url || ""}
              onChange={update}
              placeholder="https://example.com/resource"
              className="h-11 w-full rounded-xl border border-slate-200 dark:border-[#3B3441] bg-white dark:bg-[#19171E] px-3 text-sm text-slate-800 dark:text-[#E8E2EF] outline-none focus:border-pink-400"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-sm font-medium text-[#10265F] dark:text-[#E8E2EF]">
                Visible To
              </span>
              <select
                name="audience"
                value={form.audience}
                onChange={update}
                className="h-11 w-full rounded-xl border border-slate-200 dark:border-[#3B3441] bg-white dark:bg-[#19171E] px-3 text-sm text-slate-800 dark:text-[#E8E2EF]"
              >
                <option>All Students</option>
                <option>Batch A</option>
                <option>Batch B</option>
                <option>Batch C</option>
              </select>
            </label>

            <label>
              <span className="mb-1.5 block text-sm font-medium text-[#10265F] dark:text-[#E8E2EF]">
                Publication Status
              </span>
              <select
                name="status"
                value={form.status}
                onChange={update}
                className="h-11 w-full rounded-xl border border-slate-200 dark:border-[#3B3441] bg-white dark:bg-[#19171E] px-3 text-sm text-slate-800 dark:text-[#E8E2EF]"
              >
                <option>Draft</option>
                <option>Published</option>
              </select>
            </label>
          </div>

          <div className="rounded-xl border border-dashed border-slate-200 dark:border-[#3B3441] bg-slate-50 dark:bg-[#19171E] p-4">
            <div className="flex items-center gap-3">
              <Upload size={20} className="text-[#FF2454]" />
              <div>
                <p className="text-sm font-semibold text-[#10265F] dark:text-[#E8E2EF]">
                  File upload integration
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-[#B0A5BD]">
                  This demo form stores resource details only. Actual file upload requires storage integration.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 dark:border-[#3B3441] px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-[#B0A5BD] hover:bg-slate-50 dark:hover:bg-[#302B36]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-[#FF2454] px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600"
          >
            {resource ? "Save Changes" : "Add Resource"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function StudyResources() {
  const [resources, setResources] = useState(initialResources);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [activeTab, setActiveTab] = useState("All Resources");
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState(1);
  const fileInputRef = useRef(null);

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesSearch =
        !query ||
        [resource.title, resource.description, resource.category, resource.author]
          .some((value) => value.toLowerCase().includes(query));

      return (
        matchesSearch &&
        (categoryFilter === "All Categories" || resource.category === categoryFilter) &&
        (typeFilter === "All Types" || resource.type === typeFilter) &&
        (statusFilter === "All Status" || resource.status === statusFilter) &&
        (activeTab === "All Resources" || resource.status === activeTab)
      );
    });
  }, [resources, search, categoryFilter, typeFilter, statusFilter, activeTab]);

  const publishedCount = resources.filter((item) => item.status === "Published").length;
  const draftCount = resources.filter((item) => item.status === "Draft").length;
  const downloadCount = resources.reduce((sum, item) => sum + item.downloads, 0);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filteredResources.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleResources = filteredResources.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const saveResource = (form) => {
    if (form.id) {
      setResources((previous) =>
        previous.map((item) =>
          item.id === form.id
            ? { ...item, ...form, date: item.date }
            : item
        )
      );
      setNotice("Resource updated in the demo list.");
    } else {
      setResources((previous) => [
        {
          ...form,
          id: Date.now(),
          size: "—",
          author: "Institute Admin",
          date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          downloads: 0,
        },
        ...previous,
      ]);
      setNotice("Resource added to the demo list.");
    }
    setPage(1);
  };

  const togglePublish = (id) => {
    setResources((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Published" ? "Draft" : "Published",
            }
          : item
      )
    );
    setActiveMenu(null);
    setNotice("Resource publication status updated.");
  };

  const deleteResource = (id) => {
    const resource = resources.find((item) => item.id === id);
    if (!resource) return;

    if (!window.confirm(`Delete "${resource.title}" from this demo list?`)) {
      setActiveMenu(null);
      return;
    }

    setResources((previous) => previous.filter((item) => item.id !== id));
    setActiveMenu(null);
    setNotice("Resource removed from the demo list.");
  };

  const exportCSV = () => {
    const headers = ["Title", "Category", "Type", "Author", "Audience", "Status", "Downloads"];
    const rows = filteredResources.map((item) => [
      item.title,
      item.category,
      item.type,
      item.author,
      item.audience,
      item.status,
      item.downloads,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "institute-study-resources.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const newResources = files.map((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      const type =
        extension === "pdf"
          ? "PDF"
          : ["mp4", "mov", "webm"].includes(extension)
          ? "Video"
          : ["mp3", "wav", "m4a"].includes(extension)
          ? "Audio"
          : "Document";

      return {
        id: Date.now() + Math.random(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: "Uploaded from this browser session.",
        category: "General",
        type,
        size:
          file.size >= 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.max(1, Math.round(file.size / 1024))} KB`,
        author: "Institute Admin",
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: "Draft",
        downloads: 0,
        audience: "All Students",
      };
    });

    setResources((previous) => [...newResources, ...previous]);
    setNotice(`${files.length} file(s) added to the local demo list as drafts.`);
    event.target.value = "";
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("All Categories");
    setTypeFilter("All Types");
    setStatusFilter("All Status");
    setActiveTab("All Resources");
    setPage(1);
  };

  return (
   <div className="min-h-screen bg-[#F5F7FF] transition-colors duration-300 dark:bg-[#17151B]">
  <Sidebar />

  <div className="ml-[260px] flex min-h-screen min-w-0 flex-col">
    <Navbar />

        <main className="min-w-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {/* Heading */}
          <section className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#6B7FA8] dark:text-[#B0A5BD]">
                Institute <span className="mx-1">›</span> Study Resources
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#10265F] dark:text-[#E8E2EF]">
                Study <span className="text-[#FF2454]">Resources</span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-[#7183A7] dark:text-[#B0A5BD]">
                Upload, organize, publish and manage IELTS learning resources
                for your students and batches.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={exportCSV}
                className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-[#3B3441] bg-white dark:bg-[#211E27] px-4 py-3 text-sm font-semibold text-[#10265F] dark:text-[#E8E2EF] hover:bg-slate-50 dark:hover:bg-[#302B36]"
              >
                <Download size={17} />
                Export
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-[#3B3441] bg-white dark:bg-[#211E27] px-4 py-3 text-sm font-semibold text-[#10265F] dark:text-[#E8E2EF] hover:border-pink-200"
              >
                <Upload size={17} />
                Upload Files
              </button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx,.mp3,.wav,.m4a,.mp4,.mov,.webm"
                onChange={handleFileSelection}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => {
                  setEditingResource(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white hover:bg-rose-600"
              >
                <Plus size={19} />
                Add Resource
              </button>
            </div>
          </section>

          {notice && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Stats */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Resources"
              value={resources.length}
              icon={BookOpen}
              color="rose"
              subtitle="All learning materials"
            />
            <StatCard
              title="Published"
              value={publishedCount}
              icon={CheckCircle2}
              color="green"
              subtitle="Visible to assigned students"
            />
            <StatCard
              title="Drafts"
              value={draftCount}
              icon={Clock}
              color="purple"
              subtitle="Awaiting publication"
            />
            <StatCard
              title="Total Downloads"
              value={downloadCount.toLocaleString()}
              icon={Download}
              color="blue"
              subtitle="Recorded demo download count"
            />
          </section>

          {/* Category cards */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#10265F] dark:text-[#E8E2EF]">
                Browse by Category
              </h2>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-[#FF2454] hover:underline"
              >
                View all resources
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
              {[
                { name: "Writing", icon: FileText, color: "bg-rose-50 text-rose-500" },
                { name: "Reading", icon: BookOpen, color: "bg-blue-50 text-blue-600" },
                { name: "Listening", icon: Headphones, color: "bg-emerald-50 text-emerald-600" },
                { name: "Speaking", icon: Video, color: "bg-purple-50 text-purple-600" },
                { name: "Grammar", icon: File, color: "bg-orange-50 text-orange-600" },
                { name: "Vocabulary", icon: BookOpen, color: "bg-pink-50 text-pink-600" },
                { name: "General", icon: FolderOpen, color: "bg-slate-100 text-slate-600" },
              ].map((category) => {
                const Icon = category.icon;
                const count = resources.filter((item) => item.category === category.name).length;

                return (
                  <button
                    type="button"
                    key={category.name}
                    onClick={() => {
                      setCategoryFilter(category.name);
                      setPage(1);
                    }}
                    className={`rounded-2xl border bg-white dark:bg-[#211E27] p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 ${
                      categoryFilter === category.name
                        ? "border-[#FF2454] ring-1 ring-rose-100 dark:ring-rose-900/40"
                        : "border-slate-100 dark:border-[#3B3441]"
                    }`}
                  >
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${category.color}`}>
                      <Icon size={21} />
                    </span>
                    <p className="mt-3 text-sm font-bold text-[#10265F] dark:text-[#E8E2EF]">
                      {category.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-[#91899B]">
                      {count} resources
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Resource library */}
          <Panel
            title="Resource Library"
            action={
              <span className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-[#FF2454]">
                {filteredResources.length} resources
              </span>
            }
          >
            {/* Tabs */}
            <div className="mb-5 flex flex-wrap gap-5 border-b border-slate-100 dark:border-[#3B3441]">
              {[
                ["All Resources", resources.length],
                ["Published", publishedCount],
                ["Draft", draftCount],
              ].map(([tab, count]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setPage(1);
                  }}
                  className={`border-b-2 pb-3 text-sm ${
                    activeTab === tab
                      ? "border-[#FF2454] font-bold text-[#FF2454]"
                      : "border-transparent text-slate-500 dark:text-[#B0A5BD] hover:text-[#10265F] dark:hover:text-[#E8E2EF]"
                  }`}
                >
                  {tab} ({count})
                </button>
              ))}
            </div>

            {/* Search and filters */}
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(200px,1fr)_180px_160px_160px_auto]">
              <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 dark:border-[#3B3441] bg-white dark:bg-[#19171E] px-3 focus-within:border-pink-300">
                <Search size={17} className="shrink-0 text-slate-400 dark:text-[#91899B]" />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search resources..."
                  className="w-full bg-transparent text-xs text-slate-800 dark:text-[#E8E2EF] outline-none placeholder:text-slate-400 dark:placeholder:text-[#91899B]"
                />
              </div>

              {[
                {
                  value: categoryFilter,
                  setter: setCategoryFilter,
                  options: ["All Categories", ...categories],
                },
                {
                  value: typeFilter,
                  setter: setTypeFilter,
                  options: ["All Types", ...fileTypes],
                },
                {
                  value: statusFilter,
                  setter: setStatusFilter,
                  options: ["All Status", "Published", "Draft"],
                },
              ].map((filter, index) => (
                <select
                  key={index}
                  value={filter.value}
                  onChange={(event) => {
                    filter.setter(event.target.value);
                    setPage(1);
                  }}
                  className="h-10 min-w-0 rounded-xl border border-slate-200 dark:border-[#3B3441] bg-white dark:bg-[#19171E] px-3 text-xs text-[#10265F] dark:text-[#E8E2EF] outline-none focus:border-pink-300"
                >
                  {filter.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ))}

              <button
                type="button"
                onClick={resetFilters}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-[#3B3441] px-3 text-xs font-semibold text-[#10265F] dark:text-[#E8E2EF] hover:bg-slate-50 dark:hover:bg-[#302B36]"
              >
                <Filter size={15} />
                Reset
              </button>
            </div>

            {/* Resource table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#19171E] text-[11px] text-slate-500 dark:text-[#B0A5BD]">
                    {[
                      "Resource",
                      "Category",
                      "Type",
                      "Audience",
                      "Uploaded By",
                      "Date",
                      "Downloads",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th key={heading} className="px-3 py-3 font-semibold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {visibleResources.map((resource) => (
                    <tr
                      key={resource.id}
                      className="border-b border-slate-100 dark:border-[#3B3441] text-xs transition hover:bg-slate-50/70 dark:hover:bg-[#302B36]"
                    >
                      <td className="max-w-[280px] px-3 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${resourceColors(resource.type)}`}>
                            <ResourceIcon type={resource.type} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-bold text-[#10265F] dark:text-[#E8E2EF]">
                              {resource.title}
                            </p>
                            <p className="mt-1 truncate text-[10px] text-slate-400 dark:text-[#91899B]">
                              {resource.description}
                            </p>
                            <p className="mt-1 text-[10px] text-slate-400 dark:text-[#91899B]">
                              {resource.size}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        <span className="whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1.5 text-[10px] font-semibold text-blue-600">
                          {resource.category}
                        </span>
                      </td>

                      <td className="px-3 py-4 text-slate-500 dark:text-[#B0A5BD]">
                        {resource.type}
                      </td>

                      <td className="px-3 py-4">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-slate-500 dark:text-[#B0A5BD]">
                          {resource.audience === "All Students" ? (
                            <Globe size={14} />
                          ) : (
                            <LockKeyhole size={14} />
                          )}
                          {resource.audience}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-[#506995] dark:text-[#B0A5BD]">
                        {resource.author}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-slate-500 dark:text-[#B0A5BD]">
                        {resource.date}
                      </td>
                      <td className="px-3 py-4 font-semibold text-[#10265F] dark:text-[#E8E2EF]">
                        {resource.downloads}
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                            resource.status === "Published"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-orange-50 text-orange-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              resource.status === "Published" ? "bg-emerald-500" : "bg-orange-500"
                            }`}
                          />
                          {resource.status}
                        </span>
                      </td>

                      <td className="relative px-3 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            title="View resource"
                            onClick={() => {
                              if (resource.url) {
                                window.open(resource.url, "_blank", "noopener,noreferrer");
                              } else {
                                setNotice(`${resource.title}: ${resource.description}`);
                              }
                            }}
                            className="rounded-lg p-2 text-slate-500 dark:text-[#B0A5BD] hover:bg-blue-50 dark:hover:bg-[#252D3D] hover:text-blue-600"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            title="Edit resource"
                            onClick={() => {
                              setEditingResource(resource);
                              setShowModal(true);
                            }}
                            className="rounded-lg p-2 text-slate-500 dark:text-[#B0A5BD] hover:bg-purple-50 dark:hover:bg-[#30263A] hover:text-purple-600"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            title="More actions"
                            onClick={() => setActiveMenu(activeMenu === resource.id ? null : resource.id)}
                            className="rounded-lg p-2 text-slate-500 dark:text-[#B0A5BD] hover:bg-slate-100 dark:hover:bg-[#302B36]"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>

                        {activeMenu === resource.id && (
                          <div className="absolute right-8 top-12 z-20 w-44 rounded-xl border border-slate-100 dark:border-[#3B3441] bg-white dark:bg-[#211E27] p-1 shadow-xl">
                            <button
                              type="button"
                              onClick={() => togglePublish(resource.id)}
                              className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#10265F] dark:text-[#E8E2EF] hover:bg-slate-50 dark:hover:bg-[#302B36]"
                            >
                              {resource.status === "Published" ? "Unpublish resource" : "Publish resource"}
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteResource(resource.id)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            >
                              <Trash2 size={14} />
                              Delete resource
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  {visibleResources.length === 0 && (
                    <tr>
                      <td colSpan="9" className="px-4 py-12 text-center">
                        <FolderOpen size={32} className="mx-auto mb-3 text-slate-300 dark:text-[#62596B]" />
                        <p className="font-semibold text-[#10265F] dark:text-[#E8E2EF]">
                          No resources found
                        </p>
                        <p className="mt-1 text-xs text-slate-400 dark:text-[#91899B]">
                          Try another search or category.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-[#3B3441] pt-4">
              <p className="text-xs text-slate-500 dark:text-[#B0A5BD]">
                Showing {filteredResources.length ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                {Math.min(currentPage * pageSize, filteredResources.length)} of{" "}
                {filteredResources.length} resources
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  aria-label="Previous page"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-[#3B3441] text-slate-500 dark:text-[#B0A5BD] disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                </button>

                <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#FF2454] px-3 text-xs font-bold text-white">
                  {currentPage}
                </span>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  aria-label="Next page"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-[#3B3441] text-slate-500 dark:text-[#B0A5BD] disabled:opacity-40"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </Panel>

          <footer className="pb-2 text-center text-xs text-slate-400 dark:text-[#91899B]">
            Equilx IELTS · Institute Admin Portal
          </footer>
        </main>
      </div>

      {showModal && (
        <ResourceModal
          resource={editingResource}
          onClose={() => {
            setShowModal(false);
            setEditingResource(null);
          }}
          onSave={(form) => {
            saveResource(form);
            setShowModal(false);
            setEditingResource(null);
          }}
        />
      )}
    </div>
  );
}
